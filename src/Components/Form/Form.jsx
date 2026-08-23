import { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Bus,
  MapPin,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { uploadData, uploadImg } from "./Actions";
import styles from "./Form.module.css";

gsap.registerPlugin(ScrollTrigger);

const BRANCH_OPTIONS = [
  { id: "mossadak", name: "رسالة فرع مصدق", area: "الدقي / الجيزة" },
  { id: "nasr_city", name: "رسالة فرع مدينة نصر", area: "شرق القاهرة" },
  { id: "heliopolis", name: "رسالة فرع مصر الجديدة", area: "شمال القاهرة" },
  { id: "october", name: "رسالة فرع أكتوبر", area: "الجيزة / زايد" },
  { id: "helwan", name: "رسالة فرع حلوان", area: "جنوب القاهرة" },
];

const Form = () => {
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
  const [success, setSuccess] = useState(false);

  const containerRef = useRef(null);
  const formCardRef = useRef(null);
  const headerRef = useRef(null);

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
        },
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
        "-=0.4",
      );
    },
    { scope: containerRef },
  );

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
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Basic validation
    if (!form.name.trim()) {
      setErrorMsg("يرجى كتابة الاسم بالكامل");
      return;
    }
    if (!form.email.trim()) {
      setErrorMsg("يرجى كتابة البريد الإلكتروني");
      return;
    }
    if (!form.phone.trim()) {
      setErrorMsg("يرجى كتابة رقم الهاتف / واتساب");
      return;
    }
    if (!form.university.trim()) {
      setErrorMsg("يرجى كتابة اسم الجامعة / الكلية");
      return;
    }
    if (!form.place.trim()) {
      setErrorMsg("يرجى اختيار أقرب فرع لرسالة لنقطة التجمع");
      return;
    }

    try {
      setLoading(true);

      let publicImgUrl = "";
      if (file) {
        publicImgUrl = await uploadImg(file, form.name);
      }

      // Payload matching Supabase schema with both image & image_url fallbacks
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        university: form.university.trim(),
        place: form.place.trim(),
        imgSrc: publicImgUrl || null,
      };

      await uploadData(payload);

      setSuccess(true);
    } catch (err) {
      console.error("Form submission error:", err);
      setErrorMsg(
        err?.message || "حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      university: "",
      place: "",
    });
    setFile(null);
    setFilePreview(null);
    setSuccess(false);
    setErrorMsg("");
  };

  return (
    <section ref={containerRef} className={styles.formSection} id="register">
      {/* ── Background Environment Layers ── */}
      <div className={styles.bgGrid} />
      <div className={styles.bgCoronaLeft} />
      <div className={styles.bgCoronaRight} />
      <div className={styles.bgScanLine} />

      <div className={styles.formContainer}>
        {/* ── Section Header ── */}
        <div ref={headerRef} className={styles.sectionHeader}>
          <div className={styles.badgePill}>
            <span className={styles.badgeDot} />
            <span className={styles.badgeText}>
              انضم الآن • EVENT REGISTRATION
            </span>
          </div>

          <h2 className={styles.mainTitle}>سجّل حضورك في الإيفنت</h2>

          <p className={styles.subtitle}>
            كن جزءاً من أكبر تجمع لملائكة الرحمة وصناع الأمل في النشاط الطبي
            لجمعية رسالة. املأ بياناتك لضمان مقعدك ووسيلة الانتقال.
          </p>
        </div>

        {/* ── Glassmorphism Form Card ── */}
        <div ref={formCardRef} className={styles.glassFormCard}>
          {success ? (
            <div className={styles.successCard}>
              <div className={styles.successIconCircle}>
                <CheckCircle2 size={40} />
              </div>
              <h3 className={styles.successTitle}>تم تأكيد تسجيلك بنجاح!</h3>
              <p className={styles.successDesc}>
                أهلاً بك يا <strong>{form.name}</strong>! تم حفظ بياناتك وحجز
                مقعدك في باص التجمع الخاص بـ (<strong>{form.place}</strong>).
                سنتواصل معك عبر الواتساب لتأكيد المواعيد والتفاصيل.
              </p>
              
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-6"
            >
              {errorMsg && (
                <div className={styles.errorMessage}>
                  <AlertCircle size={20} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* ── Inputs Grid ── */}
              <div className={styles.inputsGrid}>
                {/* Full Name */}
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>
                    <span className={styles.labelIcon}>
                      <User size={16} />
                    </span>
                    <span>الاسم بالكامل *</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      placeholder="مثال: د. أحمد محمد علي"
                      onChange={handleChange}
                      required
                      className={styles.inputField}
                    />
                    <div className={styles.inputIcon}>
                      <User size={18} />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>
                    <span className={styles.labelIcon}>
                      <Mail size={16} />
                    </span>
                    <span>البريد الإلكتروني *</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      placeholder="name@example.com"
                      onChange={handleChange}
                      required
                      className={styles.inputField}
                    />
                    <div className={styles.inputIcon}>
                      <Mail size={18} />
                    </div>
                  </div>
                </div>

                {/* Phone / WhatsApp */}
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>
                    <span className={styles.labelIcon}>
                      <Phone size={16} />
                    </span>
                    <span>رقم الهاتف / واتساب *</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      placeholder="010XXXXXXXX"
                      onChange={handleChange}
                      required
                      className={styles.inputField}
                    />
                    <div className={styles.inputIcon}>
                      <Phone size={18} />
                    </div>
                  </div>
                </div>

                {/* University / Faculty */}
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>
                    <span className={styles.labelIcon}>
                      <GraduationCap size={16} />
                    </span>
                    <span>الجامعة*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      name="university"
                      value={form.university}
                      placeholder="مثال: طب حلوان"
                      onChange={handleChange}
                      required
                      className={styles.inputField}
                    />
                    <div className={styles.inputIcon}>
                      <GraduationCap size={18} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Bus Branch Pickup Selector ── */}
              <div className={styles.branchSection}>
                <div className={styles.branchHeader}>
                  <div className={styles.branchTitle}>
                    <Bus size={20} className="text-yellow-400" />
                    <span>
                      ايه أقرب فرع لرسالة ليك اللي هيتم نقلك منه من خلال الباص
                      لمكان الإيفنت؟ *
                    </span>
                    <span className={styles.busBadge}>خدمة نقل مجانية</span>
                  </div>
                  <p className={styles.branchSubtitle}>
                    اختر نقطة التجمع الأنسب لك لنقل الحضور ذهاباً وإياباً بأمان
                    وراحة.
                  </p>
                </div>

                <div className={styles.branchGrid}>
                  {BRANCH_OPTIONS.map((branch) => {
                    const isSelected = form.place === branch.name;
                    return (
                      <div
                        key={branch.id}
                        onClick={() => handleBranchSelect(branch.name)}
                        className={`${styles.branchCard} ${
                          isSelected ? styles.branchCardActive : ""
                        }`}
                      >
                        <div className={styles.branchIconCircle}>
                          <MapPin size={18} />
                        </div>
                        <span className={styles.branchName}>{branch.name}</span>
                        <span className={styles.branchCheckmark}>
                          {isSelected ? "✓ تم الاختيار" : branch.area}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Image Upload Dropzone ── */}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  <span className={styles.labelIcon}>
                    <ImageIcon size={16} />
                  </span>
                  <span>صورة بطاقه الترشيح</span>
                </label>

                {filePreview ? (
                  <div className={styles.previewBox}>
                    <img
                      src={filePreview}
                      alt="Preview"
                      className={styles.previewThumb}
                    />
                    <div className={styles.previewInfo}>
                      <span className={styles.previewName}>{file?.name}</span>
                      <span className={styles.previewSize}>
                        {(file?.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className={styles.removeImgBtn}
                      title="حذف الصورة"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className={styles.fileDropzone}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className={styles.fileInputHidden}
                    />
                    <div className={styles.uploadIconCircle}>
                      <UploadCloud size={24} />
                    </div>
                    <div className={styles.uploadTitle}>
                      اضغط لاختيار صورة أو اسحبها هنا
                    </div>
                    <div className={styles.uploadDesc}>
                      صيغ الصور المدعومة: PNG, JPG, JPEG (بحد أقصى 5MB)
                    </div>
                  </div>
                )}
              </div>

              {/* ── Submit CTA ── */}
              <button
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
              >
                <div className={styles.submitBtnInner}>
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>جاري حفظ البيانات ورفع الصورة...</span>
                    </>
                  ) : (
                    <>
                      <span className={styles.btnDot} />
                      <span>تأكيد تسجيل الحضور في الإيفنت</span>
                      <Sparkles size={20} />
                    </>
                  )}
                  <div className={styles.btnShine} />
                </div>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Form;