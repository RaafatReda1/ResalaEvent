import { User, Mail, Phone, GraduationCap, Lock, BookOpen } from "lucide-react";
import styles from "../Form.module.css";

const ACADEMIC_YEAR_OPTIONS = [
  { value: "فرقة أولى", label: "فرقة أولى" },
  { value: "فرقة تانية", label: "فرقة تانية" },
  { value: "فرقة تالتة", label: "فرقة تالتة" },
  { value: "فرقة رابعة", label: "فرقة رابعة" },
  { value: "فرقة خامسة", label: "فرقة خامسة" },
];

const RegistrationInputs = ({ form, onChange, isEditing, authUser }) => {
  const isEmailLocked = isEditing || Boolean(authUser?.email);

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

      {/* Email — locked when editing or when signed in with Google */}
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>
          <span className={styles.labelIcon}>
            <Mail size={16} />
          </span>
          <span>البريد الإلكتروني *</span>
          {authUser?.email ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.7rem",
                color: "#3ab9ac",
                marginRight: "auto",
                background: "rgba(58,185,172,0.12)",
                border: "1px solid rgba(58,185,172,0.25)",
                borderRadius: "6px",
                padding: "2px 8px",
              }}
            >
              <Lock size={11} /> البريد المسجل
            </span>
          ) : isEditing ? (
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
          ) : null}
        </label>
        <div className={styles.inputWrapper}>
          <input
            type="email"
            name="email"
            value={form.email}
            placeholder="name@example.com"
            onChange={onChange}
            required
            readOnly={isEmailLocked}
            className={styles.inputField}
            style={isEmailLocked ? { opacity: 0.6, cursor: "not-allowed", pointerEvents: "none" } : {}}
          />
          <div className={styles.inputIcon}>
            {isEmailLocked ? <Lock size={18} /> : <Mail size={18} />}
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

      {/* Academic Year — فرقة أولى only */}
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>
          <span className={styles.labelIcon}>
            <BookOpen size={16} />
          </span>
          <span>السنة الدراسية *</span>

        </label>
        <div className={styles.inputWrapper}>
          <select
            name="academicYear"
            value={form.academicYear}
            onChange={onChange}
            required
            className={styles.inputField}
            style={{ cursor: "pointer", appearance: "none", WebkitAppearance: "none" }}
          >
            <option value="" disabled>اختر السنة الدراسية...</option>
            {ACADEMIC_YEAR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className={styles.inputIcon} style={{ pointerEvents: "none" }}>
            <BookOpen size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationInputs;



