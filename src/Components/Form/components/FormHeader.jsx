import styles from "../Form.module.css";

const FormHeader = ({ headerRef, savedAttendee, isEditing }) => {
  return (
    <div ref={headerRef} className={styles.sectionHeader}>
      <div className={styles.badgePill}>
        <span className={styles.badgeDot} />
        <span className={styles.badgeText}>
          {savedAttendee && !isEditing
            ? "تذكرة الحضور المؤكدة • ATTENDEE TICKET"
            : "انضم الآن • EVENT REGISTRATION"}
        </span>
      </div>

      <h2 className={styles.mainTitle}>
        {savedAttendee && !isEditing
          ? "بيانات حضورك في الإيفنت"
          : isEditing
          ? "تعديل بيانات التسجيل"
          : "سجّل حضورك في الإيفنت"}
      </h2>

      <p className={styles.subtitle}>
        {savedAttendee && !isEditing
          ? "تم تأكيد تسجيلك وحفظ تذكرتك. يمكنك مراجعة بياناتك أو تعديل نقطة التجمع في أي وقت."
          : "كن جزءاً من أكبر تجمع لملائكة الرحمة وصناع الأمل في النشاط الطبي لجمعية رسالة."}
      </p>
    </div>
  );
};

export default FormHeader;
