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
import { logActivity, ACTION_TYPES, ACTION_CATEGORIES } from "@/utils/activityLogger";

export const useRegistrationForm = () => {
  const [authUser, setAuthUser] = useState(null); // Supabase Google user
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [savedAttendee, setSavedAttendee] = useState(null);
  const [anonCookieData, setAnonCookieData] = useState(null); // Registration cookie found without active Google session
  const [isEditing, setIsEditing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true); // true while we check the DB

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    university: "",
    academicYear: "",
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
  //    - If signed in with Google: fetch DB by Google email (RLS allows authenticated SELECT)
  //    - If not signed in: check if browser has a saved registration cookie
  //      and prompt the user to sign in to preview/edit their data.
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
          // Google user is logged in -> ignore anon cookies, search DB by email with RLS credentials!
          setAnonCookieData(null);
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
              academicYear: dbRow.academicYear || dbRow.academic_year || "",
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
        if (localData && (localData.email || localData.name || localData.cookieToken)) {
          // User previously submitted the form on this device without signing in.
          // RLS policy prevents unauthenticated SELECT, so prompt them to sign in.
          setAnonCookieData(localData);
          setSavedAttendee(null);
        } else {
          setAnonCookieData(null);
          setSavedAttendee(null);
        }
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
            setAnonCookieData(null);
            const dbRow = await fetchStudentByEmail(session.user.email);
            if (dbRow) {
              setSavedAttendee(dbRow);
              setForm({
                name: dbRow.name || "",
                email: dbRow.email || "",
                phone: dbRow.phone || "",
                university: dbRow.university || "",
                academicYear: dbRow.academicYear || dbRow.academic_year || "",
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
          const localData = getRegistrationCookie();
          if (localData && (localData.email || localData.name || localData.cookieToken)) {
            setAnonCookieData(localData);
          } else {
            setAnonCookieData(null);
          }
          setForm({ name: "", email: "", phone: "", university: "", academicYear: "", place: "" });
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
        message:
          "تم إغلاق نافذة تسجيل الدخول أو تعذر المصادقة. يمكنك المحاولة مجدداً أو كتابة بريدك الإلكتروني يدوياً في النموذج بكل سهولة.",
        primaryLabel: "حسناً، فهمت",
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
      setForm({ name: "", email: "", phone: "", university: "", academicYear: "", place: "" });
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
  // Friendly Error Parser Helper
  // ─────────────────────────────────────────────
  const parseUserFriendlyError = (err, context = "submit") => {
    const msg = (err?.message || "").toLowerCase();
    const code = (err?.code || "").toString();

    // 1. Duplicate email / unique constraint
    if (
      code === "23505" ||
      msg.includes("unique") ||
      msg.includes("duplicate") ||
      msg.includes("already registered") ||
      msg.includes("students_email_key")
    ) {
      return {
        type: "duplicate_email",
        title: "البريد الإلكتروني مسجل مسبقاً",
        message:
          "هذا البريد الإلكتروني مسجل لدينا بالفعل في قائمة الحضور. إذا كنت ترغب في مراجعة بياناتك المسجلة أو تعديلها، يمكنك الدخول بنفس البريد أو التواصل معنا عبر واتساب للمساعدة.",
        primaryLabel: "فهمت",
      };
    }

    // 2. Storage / Image upload errors
    if (
      msg.includes("storage") ||
      msg.includes("bucket") ||
      msg.includes("invalid key") ||
      msg.includes("payload too large") ||
      msg.includes("413") ||
      msg.includes("entity too large")
    ) {
      return {
        type: "error",
        title: "تعذر رفع صورة بطاقة الترشيح",
        message:
          "حدث خطأ أثناء رفع ملف الصورة. يرجى التأكد من أن الصورة لا تتجاوز 5 ميجابايت وبصيغة (JPG أو PNG)، ثم المحاولة مجدداً.",
        primaryLabel: "اختيار صورة أخرى",
      };
    }

    // 3. Network / Offline / Timeout
    if (
      msg.includes("failed to fetch") ||
      msg.includes("network") ||
      msg.includes("timeout") ||
      msg.includes("offline") ||
      msg.includes("err_connection") ||
      (typeof navigator !== "undefined" && !navigator.onLine)
    ) {
      return {
        type: "error",
        title: "تعذر الاتصال بالشبكة 🌐",
        message:
          "يبدو أن هناك ضعفاً أو انقطاعاً في اتصال الإنترنت. يرجى التحقق من اتصالك بالشبكة ثم الضغط على زر إعادة المحاولة (بياناتك المدخلة محفوظة في الحقول ولم تُفقد).",
        primaryLabel: "إعادة المحاولة",
      };
    }

    // 4. Permission / RLS / Auth error
    if (
      msg.includes("permission") ||
      msg.includes("policy") ||
      msg.includes("row-level security") ||
      code === "42501" ||
      code === "403"
    ) {
      return {
        type: "error",
        title: "تعذر إتمام العملية حالياً",
        message:
          "نعتذر، حدثت مشكلة غير متوقعة في الخادم. يرجى تحديث الصفحة والمحاولة مجدداً أو التواصل مع فريق التنظيم للمساعدة الفورية.",
        primaryLabel: "تحديث الصفحة",
        onPrimary: () => window.location.reload(),
      };
    }

    // 5. Default Fallback with empathetic phrasing
    return {
      type: "error",
      title: context === "update" ? "تعذر حفظ التعديلات" : "حدث خطأ أثناء إرسال الطلب",
      message:
        "حدث خطأ مؤقت أثناء معالجة طلبك. بياناتك المدخلة ما زالت محفوظة في النموذج، يرجى المحاولة مرة أخرى.",
      primaryLabel: "إعادة المحاولة",
    };
  };

  // ─────────────────────────────────────────────
  // 3. Validation helper with clear error messages
  // ─────────────────────────────────────────────
  const validateForm = () => {
    const trimmedName = form.name.trim();
    if (!trimmedName) {
      setErrorMsg("يرجى إدخال الاسم بالكامل");
      return false;
    }
    if (trimmedName.length < 3) {
      setErrorMsg("يرجى إدخال الاسم كاملاً (ثلاثي أو ثنائي على الأقل)");
      return false;
    }

    const trimmedEmail = form.email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg("يرجى إدخال بريد إلكتروني صالح (مثال: name@example.com)");
      return false;
    }

    const trimmedPhone = form.phone.trim().replace(/[\s-]/g, "");
    if (!trimmedPhone || trimmedPhone.length < 10) {
      setErrorMsg("يرجى إدخال رقم هاتف / واتساب صحيح يتكون من 11 رقماً (مثال: 01012345678)");
      return false;
    }

    if (!form.university.trim()) {
      setErrorMsg("يرجى كتابة اسم الجامعة / الكلية");
      return false;
    }
    if (!form.academicYear.trim()) {
      setErrorMsg("يرجى اختيار السنة الدراسية (فرقة أولى)");
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
        publicImgUrl = await uploadImg(file, form.name, {
          identifier: form.phone || form.email,
          email: form.email,
        });
      }

      // Step 2: Database saving
      setLoadingStage("saving_data");
      const cookieToken = generateCookieToken();

      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        university: form.university.trim(),
        academicYear: form.academicYear.trim(),
        place: form.place.trim(),
        imgSrc: publicImgUrl || null,
        cookie: cookieToken,
        user_id: authUser?.id || (await supabase.auth.getUser())?.data?.user?.id || null,
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

      logActivity({
        action_type: ACTION_TYPES.STUDENT_SUBMIT_FORM,
        action_category: ACTION_CATEGORIES.STUDENT_ACTION,
        description: `قام الطالب "${payload.name}" بإرسال استمارة التسجيل لأول مرة`,
        target_id: dbRow?.id || null,
        target_name: payload.name,
        metadata: {
          university: payload.university,
          academicYear: payload.academicYear,
          place: payload.place,
          email: payload.email,
        },
        actorOverride: {
          id: authUser?.id || null,
          email: payload.email,
          name: payload.name,
          role: "student",
        },
      });

      if (authUser) {
        setSavedAttendee(registeredData);
        setAnonCookieData(null);
        setIsEditing(false);
        setSuccessToast("تم استلام طلب تسجيلك بنجاح! 📨");

        openModal({
          type: "success",
          title: "تم استلام طلب التسجيل بنجاح! 📨",
          message:
            "أهلاً بك! تم استلام بياناتك بنجاح وحفظها بحسابك. طلبك الآن قيد مراجعة مسؤولي الإيفنت، وسيقوم فريقنا بالتواصل معك عبر واتساب لتأكيد القبول وإرسال كود الـ QR وموعد باص التحرك.",
          primaryLabel: "عرض بطاقة التسجيل",
          onPrimary: closeModal,
        });
      } else {
        // Unsigned-in anonymous user: strictly no savedAttendee / no edit access
        setSavedAttendee(null);
        setAnonCookieData(registeredData);
        setIsEditing(false);
        setSuccessToast("تم استلام طلب تسجيلك بنجاح! 📨");

        openModal({
          type: "success",
          title: "تم استلام طلب التسجيل بنجاح! 📨",
          message:
            "أهلاً بك! تم استلام بياناتك وحفظها بنجاح بقاعدة البيانات. لعرض تفاصيل استمارتك أو تعديل بياناتك ومكان الباص مستقبلاً، يرجى تسجيل الدخول بحساب Google.",
          primaryLabel: "حسناً، فهمت",
          onPrimary: closeModal,
        });
      }
    } catch (err) {
      console.error("Form submission error:", err);
      const friendlyErr = parseUserFriendlyError(err, "submit");
      openModal(friendlyErr);
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

      let previousImgUrl =
        savedAttendee?.imgSrc ||
        savedAttendee?.["imgSrc"] ||
        savedAttendee?.image ||
        savedAttendee?.image_url ||
        "";

      let publicImgUrl = previousImgUrl;

      if (file && (!filePreview || !filePreview.startsWith("http"))) {
        setLoadingStage("uploading_image");
        publicImgUrl = await uploadImg(file, form.name, {
          oldImgUrl: previousImgUrl,
          identifier: form.phone || form.email,
          email: form.email,
        });
      }

      setLoadingStage("saving_data");
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        university: form.university.trim(),
        academicYear: form.academicYear.trim(),
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

      logActivity({
        action_type: ACTION_TYPES.STUDENT_UPDATE_FORM,
        action_category: ACTION_CATEGORIES.STUDENT_ACTION,
        description: `قام الطالب "${payload.name}" بتحديث بيانات استمارة التسجيل الخاصة به`,
        target_id: savedAttendee?.id || null,
        target_name: payload.name,
        metadata: {
          university: payload.university,
          academicYear: payload.academicYear,
          place: payload.place,
          email: payload.email,
        },
        actorOverride: {
          id: authUser?.id || null,
          email: payload.email,
          name: payload.name,
          role: "student",
        },
      });

      openModal({
        type: "success",
        title: "تم حفظ التعديلات بنجاح! ✨",
        message: "تم تحديث بياناتك ونقطة التجمع بنجاح وربطها بطلب التسجيل الخاص بك.",
        primaryLabel: "العودة لبيانات التسجيل",
        onPrimary: closeModal,
      });
    } catch (err) {
      console.error("Update error:", err);
      const friendlyErr = parseUserFriendlyError(err, "update");
      openModal(friendlyErr);
    } finally {
      setLoading(false);
      setLoadingStage(null);
    }
  };

  // Trigger confirmation modal before performing update
  const handleTriggerUpdateConfirm = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!authUser || !savedAttendee) {
      openModal({
        type: "error",
        title: "تسجيل الدخول مطلوب لتعديل البيانات",
        message: "يجب تسجيل الدخول بحساب Google أولاً لتتمكن من تعديل بيانات التسجيل وتأكيد هويتك.",
        primaryLabel: "حسناً، فهمت",
      });
      return;
    }
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
            academicYear: savedAttendee.academicYear || savedAttendee.academic_year || "",
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
  // 6. Clear cookie (User Reset / Start New Form)
  // ─────────────────────────────────────────────
  const handleStartNewRegistration = () => {
    openModal({
      type: "confirm_cancel",
      title: "بدء استمارة تسجيل جديدة؟",
      message: "هل تريد تسجيل استمارة لشخص آخر والبدء بنموذج تسجيل جديد فارغ على هذا المتصفح؟",
      primaryLabel: "نعم، تسجيل جديد",
      secondaryLabel: "إلغاء",
      onPrimary: () => {
        closeModal();
        clearRegistrationCookie();
        setAnonCookieData(null);
        setSavedAttendee(null);
        setIsEditing(false);
        setForm({ name: "", email: "", phone: "", university: "", academicYear: "", place: "" });
        setFile(null);
        setFilePreview(null);
        setErrorMsg("");
      },
      onSecondary: closeModal,
    });
  };

  const handleClearRegistration = () => {
    handleStartNewRegistration();
  };

  return {
    authUser,
    loadingAuth,
    savedAttendee,
    anonCookieData,
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
    handleStartNewRegistration,
  };
};

export default useRegistrationForm;



