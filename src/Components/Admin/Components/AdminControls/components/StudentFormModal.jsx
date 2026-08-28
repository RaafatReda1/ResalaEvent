import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Save, UserPlus, Edit3 } from "lucide-react";
import { useStudentForm } from "./modals/form/useStudentForm";
import StudentFormFields from "./modals/form/StudentFormFields";
import StudentFormApprovalToggle from "./modals/form/StudentFormApprovalToggle";
import styles from "../AdminControls.module.css";

const StudentFormModal = ({ isOpen, onClose, student, onSave }) => {
  const { formData, saving, err, handleChange, handleSubmit } = useStudentForm(
    student,
    isOpen,
    onSave,
    onClose
  );

  // Body scroll lock while modal is open
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {student ? (
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Edit3 size={20} className="text-teal-600" />
                <span>تعديل بيانات الطالب: {student.name || student.email}</span>
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <UserPlus size={20} className="text-teal-600" />
                <span>إضافة طالب جديد يدوياً</span>
              </span>
            )}
          </h3>
          <button className={styles.closeModalBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Form Fields & Approval Toggle */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}>
          <div className={styles.modalBody}>
            {/* Error Alert */}
            {err && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#b91c1c",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #fecaca",
                }}
              >
                {err}
              </div>
            )}

            <div className={styles.formGrid}>
              <StudentFormFields formData={formData} onChange={handleChange} />
              <StudentFormApprovalToggle
                isApproved={formData.isApproved}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Footer Actions (Pinned) */}
          <div className={styles.modalFooterActions} style={{ justifyContent: "flex-end", gap: "10px" }}>
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
    </div>,
    document.body
  );
};

export default StudentFormModal;
