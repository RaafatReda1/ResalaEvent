import { User, Mail, Phone, GraduationCap } from "lucide-react";
import styles from "../Form.module.css";

const RegistrationInputs = ({ form, onChange }) => {
  return (
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
          <span>الجامعة / الكلية *</span>
        </label>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="university"
            value={form.university}
            placeholder="مثال: طب قصر العيني / صيدلة القاهرة"
            onChange={onChange}
            required
            className={styles.inputField}
          />
          <div className={styles.inputIcon}>
            <GraduationCap size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationInputs;
