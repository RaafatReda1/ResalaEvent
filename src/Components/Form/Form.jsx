import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Save,
} from "lucide-react";
import {
  uploadData,
  uploadImg,
  updateStudentData,
  saveRegistrationCookie,
  getRegistrationCookie,
  clearRegistrationCookie,
} from "./Actions";

import FormHeader from "./components/FormHeader";
import AttendeeProfile from "./components/AttendeeProfile";
import RegistrationInputs from "./components/RegistrationInputs";
import BranchSelector from "./components/BranchSelector";
import ImageUploadDropzone from "./components/ImageUploadDropzone";
import styles from "./Form.module.css";

gsap.registerPlugin(ScrollTrigger);

const Form = () => {
  // ── State ──
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

  const containerRef = useRef(null);
  const formCardRef = useRef(null);
  const headerRef = useRef(null);

  // ── 1. Check for existing cookie on mount ──
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

  // ── 2. Entrance Animation ──
  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.fromTo(
        headerRef.current?.children || [],
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
        }
      ).fromTo(
        formCardRef.current,
        { opacity: 0, y: 50, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
        },
        "-=0.4"
      );
    },
    { scope: containerRef }
  );

  // ── Form Input Change ──
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMsg("");
  };

  // ── Branch Select ──
  const handleBranchSelect = (branchName) => {
    setForm((prev) => ({
      ...prev,
      place: branchName,
    }));
    setErrorMsg("");
  };

  // ── File Pick ──
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

  // ── File Remove ──
  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (filePreview && !filePreview.startsWith("http")) {
      URL.revokeObjectURL(filePreview);
    }
    setFilePreview(null);
  };

  // ── 3. Submit New Registration ──
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

  // ── 4. Update Existing Registration ──
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

  // ── 5. Clear Cookie / Re-register ──
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

  return (
    <section ref={containerRef} className={styles.formSection} id="register">
      {/* Background Decor */}
      <div className={styles.bgGrid} />
      <div className={styles.bgCoronaLeft} />
      <div className={styles.bgCoronaRight} />
      <div className={styles.bgScanLine} />

      <div className={styles.formContainer}>
        {/* Header Component */}
        <FormHeader
          headerRef={headerRef}
          savedAttendee={savedAttendee}
          isEditing={isEditing}
        />

        {/* Main Glass Card */}
        <div ref={formCardRef} className={styles.glassFormCard}>
          {/* Error Alert */}
          {errorMsg && (
            <div className={styles.errorMessage}>
              <AlertCircle size={20} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Toast */}
          {successToast && (
            <div className="bg-teal-500/20 border border-teal-400/40 text-teal-200 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold shadow-lg mb-6">
              <CheckCircle2 size={20} className="text-teal-400 shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

          {/* VIEW A: REGISTERED ATTENDEE PROFILE */}
          {savedAttendee && !isEditing ? (
            <AttendeeProfile
              savedAttendee={savedAttendee}
              onStartEdit={() => setIsEditing(true)}
              onClearRegistration={handleClearRegistration}
            />
          ) : (
            /* VIEW B: REGISTRATION FORM / EDIT MODE */
            <form
              onSubmit={isEditing ? handleUpdate : handleSubmit}
              className="w-full flex flex-col gap-6"
            >
              {/* Inputs */}
              <RegistrationInputs form={form} onChange={handleChange} />

              {/* Branch Selector */}
              <BranchSelector
                selectedPlace={form.place}
                onSelectBranch={handleBranchSelect}
              />

              {/* Photo Upload */}
              <ImageUploadDropzone
                file={file}
                filePreview={filePreview}
                onFileChange={handleFileChange}
                onRemoveFile={handleRemoveFile}
              />

              {/* Action Buttons */}
              <div className="flex items-center gap-4 w-full flex-wrap">
                <button
                  type="submit"
                  disabled={loading}
                  className={`${styles.submitBtn} flex-1`}
                >
                  <div className={styles.submitBtnInner}>
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>جاري معالجة وحفظ البيانات...</span>
                      </>
                    ) : isEditing ? (
                      <>
                        <Save size={20} />
                        <span>حفظ التعديلات في تذكرتي</span>
                      </>
                    ) : (
                      <>
                        <span className={styles.btnDot} />
                        <span>تأكيد تسجيل الحضور وحفظ التذكرة</span>
                        <Sparkles size={20} />
                      </>
                    )}
                    <div className={styles.btnShine} />
                  </div>
                </button>

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className={styles.cancelBtn}
                  >
                    إلغاء التعديل
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Form;

