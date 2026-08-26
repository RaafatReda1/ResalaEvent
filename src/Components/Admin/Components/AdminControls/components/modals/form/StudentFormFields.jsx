import React from "react";
import styles from "../../../AdminControls.module.css";

const StudentFormFields = ({ formData, onChange }) => {
  return (
    <>
      <div className={styles.formField}>
        <label className={styles.fieldLabel}>اسم الطالب</label>
        <input
          type="text"
          placeholder="الاسم ثلاثي أو رباعي"
          className={styles.fieldInput}
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </div>

      <div className={styles.formField}>
        <label className={styles.fieldLabel}>البريد الإلكتروني *</label>
        <input
          type="email"
          required
          placeholder="example@domain.com"
          className={styles.fieldInput}
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </div>

      <div className={styles.formField}>
        <label className={styles.fieldLabel}>رقم الهاتف / واتساب</label>
        <input
          type="text"
          placeholder="01012345678"
          className={styles.fieldInput}
          value={formData.phone}
          onChange={(e) => onChange("phone", e.target.value)}
        />
      </div>

      <div className={styles.formField}>
        <label className={styles.fieldLabel}>الجامعة / الكلية</label>
        <input
          type="text"
          placeholder="مثال: جامعة الأزهر - طب القاهرة"
          className={styles.fieldInput}
          value={formData.university}
          onChange={(e) => onChange("university", e.target.value)}
        />
      </div>

      <div className={styles.formField}>
        <label className={styles.fieldLabel}>الفرقة الدراسية</label>
        <input
          type="text"
          placeholder="مثال: الفرقة الثالثة"
          className={styles.fieldInput}
          value={formData.academicYear}
          onChange={(e) => onChange("academicYear", e.target.value)}
        />
      </div>

      <div className={styles.formField}>
        <label className={styles.fieldLabel}>نقطة التجمع / المقر</label>
        <input
          type="text"
          placeholder="مثال: مسرح رسالة بالمقطم، فرع مصدق..."
          className={styles.fieldInput}
          value={formData.place}
          onChange={(e) => onChange("place", e.target.value)}
        />
      </div>

      <div className={styles.formFieldFull}>
        <label className={styles.fieldLabel}>
          رابط صورة شهادة القيد / الكارنيه
        </label>
        <input
          type="text"
          placeholder="https://..."
          className={styles.fieldInput}
          value={formData.imgSrc}
          onChange={(e) => onChange("imgSrc", e.target.value)}
        />
      </div>
    </>
  );
};

export default StudentFormFields;
