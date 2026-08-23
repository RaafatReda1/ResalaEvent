import { useState, useEffect } from "react";
import {
  uploadData,
  uploadImg,
  updateStudentData,
  saveRegistrationCookie,
  getRegistrationCookie,
  clearRegistrationCookie,
} from "../Actions";

export const useRegistrationForm = () => {
  const [savedAttendee, setSavedAttendee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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

  // 1. Read existing registration from cookie on mount
  useEffect(() => {
    const existing = getRegistrationCookie();
    if (existing && existing.name) {
      setSavedAttendee(existing);
      setForm({
        name: existing.name || "",
        email: existing.email || "",
        phone: existing.phone || "",
        university: existing.university || "",
        place: existing.place || "",
      });
      const img = existing.imgSrc || existing.image || existing.image_url;
      if (img) {
        setFilePreview(img);
      }
    }
  }, []);

  // 2. Input changes
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMsg("");
  };

  const handleBranchSelect = (branchName) => {
    setForm((prev) => ({
      ...prev,
      place: branchName,
    }));
    setErrorMsg("");
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.type.startsWith("image/")) {
        setErrorMsg("يرجى اختيار ملف صورة صالح (PNG, JPG, JPEG)");
        return;
      }
      setFile(selected);
      setFilePreview(URL.createObjectURL(selected));
      setErrorMsg("");
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (filePreview && !filePreview.startsWith("http")) {
      URL.revokeObjectURL(filePreview);
    }
    setFilePreview(null);
  };

  // 3. Submit New Registration
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
      let publicImgUrl = "";
      if (file) {
        publicImgUrl = await uploadImg(file, form.name);
      }

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        university: form.university.trim(),
        place: form.place.trim(),
        imgSrc: publicImgUrl || null,
        image: publicImgUrl || null,
        image_url: publicImgUrl || null,
      };

      const result = await uploadData(payload);
      const registeredData = {
        id: result?.id || crypto.randomUUID(),
        ...payload,
        registeredAt: new Date().toISOString(),
      };

      saveRegistrationCookie(registeredData);
      setSavedAttendee(registeredData);
      setSuccessToast("تم تسجيل حضورك بنجاح! تم حفظ تذكرتك على جهازك 🎉");
    } catch (err) {
      console.error("Form submission error:", err);
      setErrorMsg(err?.message || "حدث خطأ أثناء التسجيل.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Update Existing Registration
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
        image: publicImgUrl || null,
        image_url: publicImgUrl || null,
      };

      if (savedAttendee?.id) {
        await updateStudentData(savedAttendee.id, payload);
      }

      const updatedData = {
        ...savedAttendee,
        ...payload,
        updatedAt: new Date().toISOString(),
      };

      saveRegistrationCookie(updatedData);
      setSavedAttendee(updatedData);
      setIsEditing(false);
      setSuccessToast("تم تحديث بياناتك بنجاح!");
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (err) {
      setErrorMsg(err?.message || "حدث خطأ أثناء تحديث البيانات");
    } finally {
      setLoading(false);
    }
  };

  // 5. Clear Cookie
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
