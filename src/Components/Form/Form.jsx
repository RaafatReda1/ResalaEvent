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
import AnonSavedNotice from "./components/AnonSavedNotice";
import FormModal from "./components/FormModal";
import GoogleAuthButton from "./components/GoogleAuthButton";
import styles from "./Form.module.css";

gsap.registerPlugin(ScrollTrigger);

const Form = () => {
  const {
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
    handleGoogleSignIn,
    handleGoogleSignOut,
    handleChange,
    handleBranchSelect,
    handleFileChange,
    handleRemoveFile,
    handleSubmit,
    handleTriggerUpdateConfirm,
    handleCancelEdit,
    handleStartNewRegistration,
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

      {/* 2. Interactive Glassmorphic Modals & Popups */}
      <FormModal {...modalConfig} onClose={closeModal} />

      <div className={styles.formContainer}>
        {/* 3. Header (Badge, Title, Subtitle) */}
        <FormHeader
          headerRef={headerRef}
          authUser={authUser}
          savedAttendee={savedAttendee}
          anonCookieData={anonCookieData}
          isEditing={isEditing}
        />

        {/* 4. Main Glassmorphic Card Container */}
        <div ref={formCardRef} className={styles.glassFormCard}>
          {/* Google Sign In / User Status Button (Shown when not in Anon Notice mode) */}
          {(!anonCookieData || authUser || (authUser && savedAttendee)) && (
            <GoogleAuthButton
              authUser={authUser}
              onSignIn={handleGoogleSignIn}
              onSignOut={handleGoogleSignOut}
              loadingAuth={loadingAuth}
            />
          )}

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

          {/* VIEW A: Verified / Signed-In Attendee Profile (STRICTLY requires active auth session) */}
          {!isVerifying && authUser && savedAttendee && !isEditing ? (
            <div className={styles.viewFade} key="profile">
              <AttendeeProfile
                savedAttendee={savedAttendee}
                onStartEdit={() => setIsEditing(true)}
              />
            </div>
          ) : !isVerifying && !authUser && anonCookieData ? (
            /* VIEW B: Anon Registration Cookie Detected -> Prompt Sign In (NO edit button, NO full profile) */
            <div className={styles.viewFade} key="anon-saved">
              <AnonSavedNotice
                anonData={anonCookieData}
                onSignIn={handleGoogleSignIn}
                onStartNew={handleStartNewRegistration}
                loadingAuth={loadingAuth}
              />
            </div>
          ) : !isVerifying ? (
            /* VIEW C: Fresh Registration Form (or Edit Form for authenticated users only) */
            <div className={styles.viewFade} key="form">
              <RegistrationForm
                authUser={authUser}
                isEditing={Boolean(authUser && isEditing)}
                form={form}
                file={file}
                filePreview={filePreview}
                existingImgUrl={
                  (authUser && (savedAttendee?.imgSrc || savedAttendee?.["imgSrc"] || savedAttendee?.image || savedAttendee?.image_url)) ||
                  filePreview ||
                  null
                }
                loading={loading}
                loadingStage={loadingStage}
                onChange={handleChange}
                onSelectBranch={handleBranchSelect}
                onFileChange={handleFileChange}
                onRemoveFile={handleRemoveFile}
                onSubmit={handleSubmit}
                onTriggerUpdateConfirm={handleTriggerUpdateConfirm}
                onCancelEdit={handleCancelEdit}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Form;

