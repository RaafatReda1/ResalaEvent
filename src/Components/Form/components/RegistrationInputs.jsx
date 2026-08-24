import { User, Mail, Phone, GraduationCap, Lock } from "lucide-react";
import styles from "../Form.module.css";

const RegistrationInputs = ({ form, onChange, isEditing }) => {
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

      {/* Email — locked when editing */}
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>
          <span className={styles.labelIcon}>
            <Mail size={16} />
          </span>
          <span>البريد الإلكتروني *</span>
          {isEditing && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.7rem",
                color: "#94a3b8",
                marginRight: "auto",
                background: "rgba(148,163,184,0.12)",
                borderRadius: "6px",
                padding: "2px 8px",
              }}
            >
              <Lock size={11} /> لا يمكن تعديل البريد
            </span>
          )}
        </label>
        <div className={styles.inputWrapper}>
          <input
            type="email"
            name="email"
            value={form.email}
            placeholder="name@example.com"
            onChange={onChange}
            required
            readOnly={isEditing}
            className={styles.inputField}
            style={isEditing ? { opacity: 0.45, cursor: "not-allowed", pointerEvents: "none" } : {}}
          />
          <div className={styles.inputIcon}>
            {isEditing ? <Lock size={18} /> : <Mail size={18} />}
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
          <span>الجامعة*</span>
        </label>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="university"
            value={form.university}
            placeholder="مثال: طب حلوان"
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
