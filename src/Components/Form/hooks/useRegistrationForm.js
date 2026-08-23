import { useState, useEffect } from "react";
import {
  uploadData,
  uploadImg,
  updateStudentData,
  generateCookieToken,
  saveRegistrationCookie,
  getRegistrationCookie,
  clearRegistrationCookie,
  verifyStudentCookie,
} from "../Actions";

export const useRegistrationForm = () => {
  const [savedAttendee, setSavedAttendee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true); // true while we check the DB

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    university: "",
    place: "",
  });

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successToast, setSuccessToast] = useState("");

  // ─────────────────────────────────────────────
  // 1. On mount: read browser cookie → verify against DB
  //    ✓ Token found in DB  → hydrate from DB row, show profile
  //    ✗ Token not in DB    → clear stale browser cookie, show form
  // ─────────────────────────────────────────────
  useEffect(() => {
    const verify = async () => {
      setIsVerifying(true);
      try {
        const localData = getRegistrationCookie();
        const token = localData?.cookieToken;

        if (!token) {
          // No cookie at all → fresh user
          return;
        }

        // Ask the database if this token exists
        const dbRow = await verifyStudentCookie(token);

        if (!dbRow) {
          // Token not found in DB → stale / tampered cookie → wipe it
          clearRegistrationCookie();
          return;
        }

        // ✓ Verified: hydrate state from the authoritative DB row
        const hydrated = {
          ...dbRow,
          cookieToken: token, // keep token for future updates
        };
        setSavedAttendee(hydrated);
        setForm({
          name: dbRow.name || "",
          email: dbRow.email || "",
          phone: dbRow.phone || "",
          university: dbRow.university || "",
          place: dbRow.place || "",
        });
        const img = dbRow.imgSrc || dbRow.image || dbRow.image_url;
        if (img) setFilePreview(img);

        // Re-save to keep the local copy fresh
        saveRegistrationCookie(hydrated);
      } catch (e) {
        console.error("Cookie verification failed:", e);
      } finally {
        setIsVerifying(false);
      }
    };

    verify();
  }, []);

  // ─────────────────────────────────────────────
  // 2. Input change handlers
  // ─────────────────────────────────────────────
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg("");
  };

  const handleBranchSelect = (branchName) => {
    setForm((prev) => ({ ...prev, place: branchName }));
    setErrorMsg("");
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      setErrorMsg("يرجى اختيار ملف صورة صالح (PNG, JPG, JPEG)");
      return;
    }
    setFile(selected);
    setFilePreview(URL.createObjectURL(selected));
    setErrorMsg("");
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (filePreview && !filePreview.startsWith("http")) {
      URL.revokeObjectURL(filePreview);
    }
    setFilePreview(null);
  };

  // ─────────────────────────────────────────────
  // 3. Submit new registration
  //    → generate unique token → insert with cookie col
  //    → save token in browser cookie
  // ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.university.trim() ||
      !form.place.trim()
    ) {
      setErrorMsg("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      setLoading(true);

      // Upload photo if provided
      let publicImgUrl = "";
      if (file) {
        publicImgUrl = await uploadImg(file, form.name);
      }

      // Generate a fresh browser-to-DB binding token
      const cookieToken = generateCookieToken();

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        university: form.university.trim(),
        place: form.place.trim(),
        imgSrc: publicImgUrl || null,
        cookie: cookieToken,   // ← stored in DB `cookie` column
      };

      const dbRow = await uploadData(payload);

      const registeredData = {
        ...dbRow,
        cookieToken, // keep handy in browser data
        registeredAt: new Date().toISOString(),
      };

      saveRegistrationCookie(registeredData);
      setSavedAttendee(registeredData);
      setSuccessToast("تم تسجيل حضورك بنجاح! تم حفظ تذكرتك على جهازك 🎉");
      setTimeout(() => setSuccessToast(""), 6000);
    } catch (err) {
      console.error("Form submission error:", err);
      setErrorMsg(err?.message || "حدث خطأ أثناء التسجيل.");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // 4. Update existing registration
  //    → update DB row by id (cookie token stays the same)
  // ─────────────────────────────────────────────
  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.university.trim() ||
      !form.place.trim()
    ) {
      setErrorMsg("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      setLoading(true);

      let publicImgUrl =
        savedAttendee?.imgSrc ||
        savedAttendee?.image ||
        savedAttendee?.image_url ||
        "";

      if (file && (!filePreview || !filePreview.startsWith("http"))) {
        publicImgUrl = await uploadImg(file, form.name);
      }

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        university: form.university.trim(),
        place: form.place.trim(),
        imgSrc: publicImgUrl || null,
        // NOTE: cookie token is intentionally NOT changed on update
      };

      let dbRow = null;
      if (savedAttendee?.id) {
        dbRow = await updateStudentData(savedAttendee.id, payload);
      }

      const updatedData = {
        ...(dbRow || savedAttendee),
        ...payload,
        cookieToken: savedAttendee.cookieToken, // preserve token
        updatedAt: new Date().toISOString(),
      };

      saveRegistrationCookie(updatedData);
      setSavedAttendee(updatedData);
      setIsEditing(false);
      setSuccessToast("تم تحديث بياناتك بنجاح! ✅");
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (err) {
      setErrorMsg(err?.message || "حدث خطأ أثناء تحديث البيانات");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // 5. Clear cookie → user starts fresh
  // ─────────────────────────────────────────────
  const handleClearRegistration = () => {
    if (
      window.confirm(
        "هل تريد بالتأكيد إلغاء التسجيل المحفوظ على هذا الجهاز وتسجيل حضور جديد؟"
      )
    ) {
      clearRegistrationCookie();
      setSavedAttendee(null);
      setIsEditing(false);
      setForm({ name: "", email: "", phone: "", university: "", place: "" });
      setFile(null);
      setFilePreview(null);
    }
  };

  return {
    savedAttendee,
    isEditing,
    setIsEditing,
    isVerifying,
    form,
    file,
    filePreview,
    loading,
    errorMsg,
    successToast,
    handleChange,
    handleBranchSelect,
    handleFileChange,
    handleRemoveFile,
    handleSubmit,
    handleUpdate,
    handleClearRegistration,
  };
};

export default useRegistrationForm;

