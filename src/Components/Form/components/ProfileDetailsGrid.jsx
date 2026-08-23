import { Mail, Phone, GraduationCap, Bus } from "lucide-react";
import styles from "../Form.module.css";

const ProfileDetailsGrid = ({ attendee }) => {
  return (
    <div className={styles.profileGrid}>
      {/* Email */}
      <div className={styles.profileItem}>
        <div className={styles.profileItemIcon}>
          <Mail size={18} />
        </div>
        <div className={styles.profileItemContent}>
          <span className={styles.profileItemLabel}>البريد الإلكتروني</span>
          <span className={styles.profileItemValue}>{attendee.email}</span>
        </div>
      </div>

      {/* Phone */}
      <div className={styles.profileItem}>
        <div className={styles.profileItemIcon}>
          <Phone size={18} />
        </div>
        <div className={styles.profileItemContent}>
          <span className={styles.profileItemLabel}>رقم الهاتف / واتساب</span>
          <span className={styles.profileItemValue}>{attendee.phone}</span>
        </div>
      </div>

      {/* University */}
      <div className={styles.profileItem}>
        <div className={styles.profileItemIcon}>
          <GraduationCap size={18} />
        </div>
        <div className={styles.profileItemContent}>
          <span className={styles.profileItemLabel}>الجامعة / الكلية</span>
          <span className={styles.profileItemValue}>{attendee.university}</span>
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
            {attendee.place}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailsGrid;
