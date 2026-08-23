import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Bus,
  CheckCircle2,
  Ticket,
  QrCode,
  Edit3,
} from "lucide-react";
import styles from "../Form.module.css";

const AttendeeProfile = ({
  savedAttendee,
  onStartEdit,
  onClearRegistration,
}) => {
  return (
    <div className={styles.profileCardContainer}>
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <div className={styles.profileAvatarWrapper}>
          {savedAttendee.image || savedAttendee.image_url || savedAttendee.imgSrc ? (
            <img
              src={
                savedAttendee.imgSrc ||
                savedAttendee.image ||
                savedAttendee.image_url
              }
              alt={savedAttendee.name}
              className={styles.profileAvatar}
            />
          ) : (
            <div className={styles.profileAvatar}>
              <User size={38} />
            </div>
          )}
        </div>

        <div className={styles.profileMeta}>
          <h3 className={styles.profileName}>{savedAttendee.name}</h3>
          <div className={styles.profileBadgesRow}>
            <span className={styles.profileBadge}>
              <CheckCircle2 size={13} />
              <span>مشارك مؤكد</span>
            </span>
            <span className={`${styles.profileBadge} ${styles.ticketBadge}`}>
              <Ticket size={13} />
              <span>
                تذكرة #
                {String(savedAttendee.id || "2026")
                  .slice(0, 8)
                  .toUpperCase()}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className={styles.profileGrid}>
        {/* Email */}
        <div className={styles.profileItem}>
          <div className={styles.profileItemIcon}>
            <Mail size={18} />
          </div>
          <div className={styles.profileItemContent}>
            <span className={styles.profileItemLabel}>البريد الإلكتروني</span>
            <span className={styles.profileItemValue}>{savedAttendee.email}</span>
          </div>
        </div>

        {/* Phone */}
        <div className={styles.profileItem}>
          <div className={styles.profileItemIcon}>
            <Phone size={18} />
          </div>
          <div className={styles.profileItemContent}>
            <span className={styles.profileItemLabel}>رقم الهاتف / واتساب</span>
            <span className={styles.profileItemValue}>{savedAttendee.phone}</span>
          </div>
        </div>

        {/* University */}
        <div className={styles.profileItem}>
          <div className={styles.profileItemIcon}>
            <GraduationCap size={18} />
          </div>
          <div className={styles.profileItemContent}>
            <span className={styles.profileItemLabel}>الجامعة / الكلية</span>
            <span className={styles.profileItemValue}>
              {savedAttendee.university}
            </span>
          </div>
        </div>

        {/* Branch / Bus Pickup */}
        <div className={styles.profileItem}>
          <div className={styles.profileItemIcon}>
            <Bus size={18} />
          </div>
          <div className={styles.profileItemContent}>
            <span className={styles.profileItemLabel}>نقطة التجمع (باص رسالة)</span>
            <span
              className={styles.profileItemValue}
              style={{ color: "#3ab9ac" }}
            >
              {savedAttendee.place}
            </span>
          </div>
        </div>
      </div>

      {/* ── QR Code Notification Banner ── */}
      <div className={styles.qrNoticeCard}>
        <div className={styles.qrNoticeIconBox}>
          <QrCode size={24} />
        </div>
        <div className={styles.qrNoticeContent}>
          <h4 className={styles.qrNoticeTitle}>
            تنبيه هام بخصوص كود الدخول (QR Code) وتأكيد الباص 📲
          </h4>
          <p className={styles.qrNoticeText}>
            سيقوم فريق تنظيم <strong>رسالة أطباء الخير</strong> بالتواصل معك
            قريباً عبر رقم الواتساب المسجل (
            <strong>{savedAttendee.phone}</strong>) لإرسال كود الـ QR الرسمي
            الخاص بدخول الإيفنت وتأكيد نقطة وموعد تحرك الباص من فرع (
            <strong>{savedAttendee.place}</strong>).
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.profileActions}>
        <button
          type="button"
          onClick={onStartEdit}
          className={styles.editBtn}
        >
          <Edit3 size={16} />
          <span>تعديل بيانات التسجيل أو الفرع</span>
        </button>

        <button
          type="button"
          onClick={onClearRegistration}
          className={styles.clearRegBtn}
        >
          تسجيل شخص آخر / حذف التذكرة
        </button>
      </div>
    </div>
  );
};

export default AttendeeProfile;
