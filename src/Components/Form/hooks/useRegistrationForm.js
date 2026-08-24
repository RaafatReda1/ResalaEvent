import { useState, useEffect } from "react";
import supabase from "@/utils/supabaseClient";
import {
  uploadData,
  uploadImg,
  updateStudentData,
  generateCookieToken,
  saveRegistrationCookie,
  getRegistrationCookie,
  clearRegistrationCookie,
  verifyStudentCookie,
  signInWithGoogle,
  signOutUser,
  fetchStudentByEmail,
} from "../Actions";

export const useRegistrationForm = () => {
  const [authUser, setAuthUser] = useState(null); // Supabase Google user
  const [loadingAuth, setLoadingAuth] = useState(false);
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
  const [loadingStage, setLoadingStage] = useState(null); // 'uploading_image' | 'saving_data' | 'completing' | 'updating'
  const [errorMsg, setErrorMsg] = useState("");
  const [successToast, setSuccessToast] = useState("");

  // ── Modal State ──
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    primaryLabel: "",
    secondaryLabel: "",
    onPrimary: null,
    onSecondary: null,
    data: null,
  });

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const openModal = (config) => {
    setModalConfig({
      isOpen: true,
      type: config.type || "success",
      title: config.title || "",
      message: config.message || "",
      primaryLabel: config.primaryLabel || "حسناً",
      secondaryLabel: config.secondaryLabel || "",
      onPrimary: config.onPrimary || closeModal,
      onSecondary: config.onSecondary || closeModal,
      data: config.data || null,
    });
  };

  // ─────────────────────────────────────────────
  // 1. Unified Auth & DB Verification on mount
  //    - If signed in with Google: ignore cookies, fetch DB by Google email
  //    - If not signed in: fallback to browser Cookie Token verification
  // ─────────────────────────────────────────────
  useEffect(() => {
    const initAuthAndVerification = async () => {
      setIsVerifying(true);
      try {
        // Step A: Check active Supabase Google session
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user;
        setAuthUser(currentUser || null);

        if (currentUser?.email) {
          // Google user is logged in -> IGNORE cookies, search DB by email!
          const dbRow = await fetchStudentByEmail(currentUser.email);

          if (dbRow) {
            const hydrated = {
              ...dbRow,
              cookieToken: dbRow.cookie || generateCookieToken(),
            };
            setSavedAttendee(hydrated);
            setForm({
              name: dbRow.name || currentUser.user_metadata?.full_name || "",
              email: dbRow.email || currentUser.email || "",
              phone: dbRow.phone || "",
              university: dbRow.university || "",
              place: dbRow.place || "",
            });
            const img = dbRow.imgSrc || dbRow["imgSrc"] || dbRow.image || dbRow.image_url;
            if (img) setFilePreview(img);
          } else {
            // New Google user without existing record -> pre-fill email and name
            setSavedAttendee(null);
            setForm((prev) => ({
              ...prev,
              email: currentUser.email,
              name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || prev.name,
            }));
          }
          setIsVerifying(false);
          return;
        }

        // Step B: Not logged in with Google -> check Cookie Token
        const localData = getRegistrationCookie();
        const token = localData?.cookieToken;

        if (!token) {
          setIsVerifying(false);
          return;
        }

        const dbRow = await verifyStudentCookie(token);

        if (!dbRow) {
          clearRegistrationCookie();
          setIsVerifying(false);
          return;
        }

        const hydrated = {
          ...dbRow,
          cookieToken: token,
        };
        setSavedAttendee(hydrated);
        setForm({
          name: dbRow.name || "",
          email: dbRow.email || "",
          phone: dbRow.phone || "",
          university: dbRow.university || "",
          place: dbRow.place || "",
        });
        const img = dbRow.imgSrc || dbRow["imgSrc"] || dbRow.image || dbRow.image_url;
        if (img) setFilePreview(img);

        saveRegistrationCookie(hydrated);
      } catch (e) {
        console.error("Auth & verification error:", e);
      } finally {
        setIsVerifying(false);
      }
    };

    initAuthAndVerification();

    // Listen to OAuth state changes (e.g. redirect back from Google OAuth)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          if (session?.user) {
            setAuthUser(session.user);
            const dbRow = await fetchStudentByEmail(session.user.email);
            if (dbRow) {
              setSavedAttendee(dbRow);
              setForm({
                name: dbRow.name || "",
                email: dbRow.email || "",
                phone: dbRow.phone || "",
                university: dbRow.university || "",
                place: dbRow.place || "",
              });
              const img = dbRow.imgSrc || dbRow["imgSrc"] || dbRow.image || dbRow.image_url;
              if (img) setFilePreview(img);
            } else {
              setSavedAttendee(null);
              setForm((prev) => ({
                ...prev,
                email: session.user.email,
                name: session.user.user_metadata?.full_name || prev.name,
              }));
            }
          }
        } else if (event === "SIGNED_OUT") {
          setAuthUser(null);
          setSavedAttendee(null);
          setForm({ name: "", email: "", phone: "", university: "", place: "" });
          setFile(null);
          setFilePreview(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // ─────────────────────────────────────────────
  // Google Sign In / Sign Out Handlers
  // ─────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    try {
      setLoadingAuth(true);
      await signInWithGoogle();
    } catch (err) {
      console.error("Google sign in failed:", err);
      openModal({
        type: "error",
        title: "تعذر تسجيل الدخول بـ Google",
        message: err?.message || "يرجى المحاولة مرة أخرى أو إدخال البيانات يدوياً.",
        primaryLabel: "حسناً",
      });
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      setLoadingAuth(true);
      await signOutUser();
      setAuthUser(null);
      setSavedAttendee(null);
      setForm({ name: "", email: "", phone: "", university: "", place: "" });
      setFile(null);
      setFilePreview(null);
      setSuccessToast("تم تسجيل الخروج بنجاح");
      setTimeout(() => setSuccessToast(""), 3000);
    } catch (err) {
      console.error("Google sign out failed:", err);
    } finally {
      setLoadingAuth(false);
    }
  };


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
      openModal({
        type: "error",
        title: "نوع ملف غير صالح",
        message: "يرجى اختيار صورة صحيحة بصيغة PNG أو JPG أو JPEG.",
        primaryLabel: "اختيار صورة أخرى",
      });
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      openModal({
        type: "error",
        title: "حجم الصورة كبير جداً",
        message: "الحد الأقصى لحجم صورة بطاقة الترشيح هو 5 ميجابايت. يرجى ضغط الصورة أو اختيار ملف أصغر.",
        primaryLabel: "فهمت",
      });
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
  // 3. Validation helper
  // ─────────────────────────────────────────────
  const validateForm = () => {
    if (!form.name.trim()) {
      setErrorMsg("يرجى إدخال الاسم بالكامل");
      return false;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setErrorMsg("يرجى إدخال بريد إلكتروني صحيح");
      return false;
    }
    if (!form.phone.trim() || form.phone.trim().length < 10) {
      setErrorMsg("يرجى إدخال رقم هاتف / واتساب صالح (11 رقم)");
      return false;
    }
    if (!form.university.trim()) {
      setErrorMsg("يرجى كتابة اسم الجامعة / الكلية");
      return false;
    }
    if (!form.place.trim()) {
      setErrorMsg("يرجى اختيار أقرب فرع لرسالة لنقطة التجمع والباص");
      return false;
    }
    return true;
  };

  // ─────────────────────────────────────────────
  // 4. Submit new registration
  // ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMsg("");

    if (!validateForm()) return;

    // Warning if no image was selected for fresh registration
    if (!file) {
      openModal({
        type: "error",
        title: "صورة بطاقة الترشيح مطلوبة",
        message: "يرجى إرفاق صورة بطاقة الترشيح أو ما يثبت التحاقك بالفرقة الأولى لإتمام التسجيل وتأكيد مقعدك.",
        primaryLabel: "إرفاق الصورة الآن",
      });
      return;
    }

    try {
      setLoading(true);

      // Step 1: Uploading Image
      setLoadingStage("uploading_image");
      let publicImgUrl = "";
      if (file) {
        publicImgUrl = await uploadImg(file, form.name);
      }

      // Step 2: Database saving
      setLoadingStage("saving_data");
      const cookieToken = generateCookieToken();

      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        university: form.university.trim(),
        place: form.place.trim(),
        imgSrc: publicImgUrl || null,
        cookie: cookieToken,
      };

      const dbRow = await uploadData(payload);

      // Step 3: Ticket issuance
      setLoadingStage("generating_ticket");
      const registeredData = {
        ...dbRow,
        cookieToken,
        registeredAt: new Date().toISOString(),
      };

      saveRegistrationCookie(registeredData);
      setSavedAttendee(registeredData);
      setSuccessToast("تم استلام طلب تسجيلك بنجاح! 📨");

      // Trigger Modal
      openModal({
        type: "success",
        title: "تم استلام طلب التسجيل بنجاح! 📨",
        message:
          "أهلاً بك! تم استلام بياناتك بنجاح وحفظها على هذا الجهاز. طلبك الآن قيد مراجعة مسؤولي الإيفنت، وسيقوم فريقنا بالتواصل معك عبر واتساب لتأكيد القبول وإرسال كود الـ QR وموعد باص التحرك.",
        primaryLabel: "عرض بيانات التسجيل",
        onPrimary: closeModal,
      });
    } catch (err) {
      console.error("Form submission error:", err);
      if (err?.code === "23505" || err?.message?.includes("unique") || err?.message?.includes("email")) {
        openModal({
          type: "duplicate_email",
          title: "البريد الإلكتروني مسجل مسبقاً",
          message:
            "هذا البريد الإلكتروني مسجل لدينا بالفعل. إذا كنت قد سجلت من قبل يمكنك التواصل معنا عبر واتساب للمساعدة ومتابعة طلبك.",
          primaryLabel: "فهمت",
        });
      } else {
        openModal({
          type: "error",
          title: "حدث خطأ أثناء إرسال الطلب",
          message: err?.message || "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.",
          primaryLabel: "إعادة المحاولة",
        });
      }
    } finally {
      setLoading(false);
      setLoadingStage(null);
    }
  };

  // ─────────────────────────────────────────────
  // 5. Update existing registration
  // ─────────────────────────────────────────────
  const executeUpdate = async () => {
    closeModal();
    try {
      setLoading(true);
      setLoadingStage("updating");

      let publicImgUrl =
        savedAttendee?.imgSrc ||
        savedAttendee?.["imgSrc"] ||
        savedAttendee?.image ||
        savedAttendee?.image_url ||
        "";

      if (file && (!filePreview || !filePreview.startsWith("http"))) {
        setLoadingStage("uploading_image");
        publicImgUrl = await uploadImg(file, form.name);
      }

      setLoadingStage("saving_data");
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        university: form.university.trim(),
        place: form.place.trim(),
        imgSrc: publicImgUrl || null,
      };

      let dbRow = null;
      if (savedAttendee?.id) {
        dbRow = await updateStudentData(savedAttendee.id, payload);
      }

      const updatedData = {
        ...(dbRow || savedAttendee),
        ...payload,
        cookieToken: savedAttendee.cookieToken,
        updatedAt: new Date().toISOString(),
      };

      saveRegistrationCookie(updatedData);
      setSavedAttendee(updatedData);
      setIsEditing(false);
      setSuccessToast("تم حفظ التعديلات بنجاح! ✅");

      openModal({
        type: "success",
        title: "تم حفظ التعديلات بنجاح! ✨",
        message: "تم تحديث بياناتك ونقطة التجمع بنجاح وربطها بطلب التسجيل الخاص بك.",
        primaryLabel: "العودة لبيانات التسجيل",
        onPrimary: closeModal,
      });
    } catch (err) {
      console.error("Update error:", err);
      openModal({
        type: "error",
        title: "تعذر تحديث البيانات",
        message: err?.message || "حدث خطأ أثناء الاتصال بقاعدة البيانات. يرجى المحاولة مرة أخرى.",
        primaryLabel: "حسناً",
      });
    } finally {
      setLoading(false);
      setLoadingStage(null);
    }
  };

  // Trigger confirmation modal before performing update
  const handleTriggerUpdateConfirm = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validateForm()) return;

    openModal({
      type: "confirm_update",
      title: "تأكيد حفظ التعديلات",
      message: `هل أنت متأكد من حفظ التعديلات الجديدة (الاسم: ${form.name} | نقطة التحرك: ${form.place})؟`,
      primaryLabel: "نعم، حفظ وتأكيد",
      secondaryLabel: "مراجعة البيانات",
      onPrimary: executeUpdate,
      onSecondary: closeModal,
    });
  };

  // Trigger confirmation modal before cancelling edit
  const handleCancelEdit = () => {
    openModal({
      type: "confirm_cancel",
      title: "إلغاء التعديل؟",
      message: "هل تريد التراجع عن التعديلات والعودة لعرض بيانات طلبك المحفوظة دون حفظ أي تغييرات؟",
      primaryLabel: "نعم، إلغاء التعديل",
      secondaryLabel: "متابعة التعديل",
      onPrimary: () => {
        closeModal();
        setIsEditing(false);
        // Reset form values to saved attendee data
        if (savedAttendee) {
          setForm({
            name: savedAttendee.name || "",
            email: savedAttendee.email || "",
            phone: savedAttendee.phone || "",
            university: savedAttendee.university || "",
            place: savedAttendee.place || "",
          });
          const img = savedAttendee.imgSrc || savedAttendee["imgSrc"] || savedAttendee.image;
          if (img) setFilePreview(img);
          setFile(null);
        }
      },
      onSecondary: closeModal,
    });
  };

  // ─────────────────────────────────────────────
  // 6. Clear cookie (User Reset)
  // ─────────────────────────────────────────────
  const handleClearRegistration = () => {
    openModal({
      type: "confirm_cancel",
      title: "إلغاء طلب التسجيل على هذا الجهاز؟",
      message: "هل تريد بالتأكيد إلغاء بيانات طلب التسجيل المحفوظة على هذا الجهاز والبدء بطلب جديد؟",
      primaryLabel: "نعم، طلب جديد",
      secondaryLabel: "تراجع",
      onPrimary: () => {
        closeModal();
        clearRegistrationCookie();
        setSavedAttendee(null);
        setIsEditing(false);
        setForm({ name: "", email: "", phone: "", university: "", place: "" });
        setFile(null);
        setFilePreview(null);
      },
      onSecondary: closeModal,
    });
  };

  return {
    authUser,
    loadingAuth,
    savedAttendee,
    isEditing,
    setIsEditing,
    isVerifying,
    form,
    file,
    filePreview,
    loading,
    loadingStage,
    errorMsg,
    successToast,
    modalConfig,
    closeModal,
    openModal,
    handleGoogleSignIn,
    handleGoogleSignOut,
    handleChange,
    handleBranchSelect,
    handleFileChange,
    handleRemoveFile,
    handleSubmit,
    handleTriggerUpdateConfirm,
    handleCancelEdit,
    handleClearRegistration,
  };
};

export default useRegistrationForm;



