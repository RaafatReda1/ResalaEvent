import React, { useState, useEffect } from "react";
import { X, Save, UserPlus, Edit3 } from "lucide-react";
import styles from "../AdminControls.module.css";

const StudentFormModal = ({ isOpen, onClose, student, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    university: "",
    academicYear: "",
    place: "",
    imgSrc: "",
    isApproved: null,
  });

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        email: student.email || "",
        phone: student.phone || "",
        university: student.university || "",
        academicYear: student.academicYear || "",
        place: student.place || "",
        imgSrc: student.imgSrc || "",
        isApproved: student.isApproved,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        university: "",
        academicYear: "",
        place: "",
        imgSrc: "",
        isApproved: null,
      });
    }
    setErr("");
  }, [student, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email?.trim()) {
      setErr("البريد الإلكتروني مطلوب!");
      return;
    }
    try {
      setSaving(true);
      setErr("");
      await onSave(formData);
    } catch (error) {
      console.error(error);
      setErr(error.message || "حدث خطأ أثناء حفظ البيانات");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {student ? (
              <span className="flex items-center gap-2">
                <Edit3 size={20} className="text-teal-600" />
                تعديل بيانات الطالب: {student.name || student.email}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus size={20} className="text-teal-600" />
                إضافة طالب جديد يدوياً
              </span>
            )}
          </h3>
          <button className={styles.closeModalBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Error */}
        {err && (
          <div className="bg-red-50 text-red-700 text-xs font-bold p-3 rounded-xl border border-red-200">
            {err}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label className={styles.fieldLabel}>اسم الطالب</label>
              <input
                type="text"
                placeholder="الاسم ثلاثي أو رباعي"
                className={styles.fieldInput}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.fieldLabel}>رقم الهاتف / واتساب</label>
              <input
                type="text"
                placeholder="01012345678"
                className={styles.fieldInput}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.fieldLabel}>الجامعة / الكلية</label>
              <input
                type="text"
                placeholder="مثال: جامعة الأزهر - طب القاهرة"
                className={styles.fieldInput}
                value={formData.university}
                onChange={(e) =>
                  setFormData({ ...formData, university: e.target.value })
                }
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.fieldLabel}>الفرقة الدراسية</label>
              <input
                type="text"
                placeholder="مثال: الفرقة الثالثة"
                className={styles.fieldInput}
                value={formData.academicYear}
                onChange={(e) =>
                  setFormData({ ...formData, academicYear: e.target.value })
                }
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.fieldLabel}>نقطة التجمع / الفرع</label>
              <input
                type="text"
                placeholder="مثال: فرع الدقي، فرع مصر الجديدة..."
                className={styles.fieldInput}
                value={formData.place}
                onChange={(e) =>
                  setFormData({ ...formData, place: e.target.value })
                }
              />
            </div>

            <div className={styles.formFieldFull}>
              <label className={styles.fieldLabel}>رابط الصورة الشخصية / البطاقة</label>
              <input
                type="text"
                placeholder="https://..."
                className={styles.fieldInput}
                value={formData.imgSrc}
                onChange={(e) =>
                  setFormData({ ...formData, imgSrc: e.target.value })
                }
              />
            </div>

            <div className={styles.formFieldFull}>
              <label className={styles.fieldLabel}>حالة القبول</label>
              <select
                className={styles.filterSelect}
                value={
                  formData.isApproved === true
                    ? "approved"
                    : formData.isApproved === false
                    ? "rejected"
                    : "pending"
                }
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    isApproved:
                      val === "approved" ? true : val === "rejected" ? false : null,
                  });
                }}
              >
                <option value="pending">في انتظار المراجعة (Pending)</option>
                <option value="approved">مقبول (Approved)</option>
                <option value="rejected">مرفوض (Rejected)</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={onClose}
              disabled={saving}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={saving}
            >
              <Save size={16} />
              <span>{saving ? "جاري الحفظ..." : "حفظ البيانات"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFormModal;
