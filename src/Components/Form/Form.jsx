import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { useRegistrationForm } from "./hooks/useRegistrationForm";
import BackgroundDecor from "./components/BackgroundDecor";
import FormHeader from "./components/FormHeader";
import FormAlerts from "./components/FormAlerts";
import AttendeeProfile from "./components/AttendeeProfile";
import RegistrationForm from "./components/RegistrationForm";
import styles from "./Form.module.css";

gsap.registerPlugin(ScrollTrigger);

const Form = () => {
  const {
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
  } = useRegistrationForm();

  const containerRef = useRef(null);
  const formCardRef = useRef(null);
  const headerRef = useRef(null);

  // ── GSAP Entrance Animation ──
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

  return (
    <section ref={containerRef} className={styles.formSection} id="register">
      {/* 1. Ambient Background Decor Layers */}
      <BackgroundDecor />

      <div className={styles.formContainer}>
        {/* 2. Header (Badge, Title, Subtitle) */}
        <FormHeader
          headerRef={headerRef}
          savedAttendee={savedAttendee}
          isEditing={isEditing}
        />

        {/* 3. Main Glassmorphic Card Container */}
        <div ref={formCardRef} className={styles.glassFormCard}>
          {/* Alerts: Error & Success Messages */}
          <FormAlerts errorMsg={errorMsg} successToast={successToast} />

          {/* DB Verification Spinner */}
          {isVerifying && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-10 h-10 border-4 border-teal-400/30 border-t-teal-400 rounded-full animate-spin" />
              <p className="text-slate-400 text-sm font-semibold tracking-wide">
                جاري التحقق من بيانات التسجيل...
              </p>
            </div>
          )}

          {/* VIEW A / B — hidden while verifying */}
          {!isVerifying && savedAttendee && !isEditing ? (
            <AttendeeProfile
              savedAttendee={savedAttendee}
              onStartEdit={() => setIsEditing(true)}
              onClearRegistration={handleClearRegistration}
            />
          ) : !isVerifying ? (
            /* VIEW B: Registration Form / Edit Mode */
            <RegistrationForm
              isEditing={isEditing}
              form={form}
              file={file}
              filePreview={filePreview}
              loading={loading}
              onChange={handleChange}
              onSelectBranch={handleBranchSelect}
              onFileChange={handleFileChange}
              onRemoveFile={handleRemoveFile}
              onSubmit={handleSubmit}
              onUpdate={handleUpdate}
              onCancelEdit={() => setIsEditing(false)}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Form;
