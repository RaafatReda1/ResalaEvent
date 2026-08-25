import styles from "../Form.module.css";

const FormHeader = ({ headerRef, authUser, savedAttendee, anonCookieData, isEditing }) => {
  const isVerifiedAttendee = Boolean(authUser && savedAttendee);
  const isAnonSaved = Boolean(!authUser && anonCookieData);

  return (
    <div ref={headerRef} className={styles.sectionHeader}>
      <div className={styles.badgePill}>
        <span className={styles.badgeDot} />
        <span className={styles.badgeText}>
          {isVerifiedAttendee && !isEditing
            ? "طلب التسجيل مسجل • REGISTRATION CONFIRMED"
            : isAnonSaved
            ? "بياناتك محفوظة • SAVED REGISTRATION"
            : "انضم الآن • EVENT REGISTRATION"}
        </span>
      </div>

      <h2 className={styles.mainTitle}>
        {isVerifiedAttendee && !isEditing
          ? "بيانات طلب تسجيلك"
          : isVerifiedAttendee && isEditing
          ? "تعديل بيانات التسجيل"
          : isAnonSaved
          ? "بيانات تسجيلك محفوظة"
          : "سجّل حضورك في الإيفنت"}
      </h2>

      <p className={styles.subtitle}>
        {isVerifiedAttendee && !isEditing
          ? "تم استلام طلبك وهو قيد مراجعة مسؤولي الإيفنت. يمكنك مراجعة بياناتك أو تعديل نقطة التجمع في أي وقت."
          : isAnonSaved
          ? "تم استلام طلبك من هذا المتصفح. سجّل الدخول بحساب Google لعرض بطاقة الحضور أو تعديل بياناتك."
          : "كن جزءاً من أكبر تجمع لملائكة الرحمة وصناع الأمل في النشاط الطبي لجمعية رسالة."}
      </p>
    </div>
  );
};

export default FormHeader;

