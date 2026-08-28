import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Trash2, X } from "lucide-react";
import styles from "../AdminControls.module.css";

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  student,
  selectedCount = 0,
  onConfirm,
}) => {
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

  const isSingle = Boolean(student);

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalCard}
        style={{ maxWidth: "460px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={22} />
            <h3 className={styles.modalTitle} style={{ color: "#dc2626" }}>
              تأكيد الحذف النهائي
            </h3>
          </div>
          <button className={styles.closeModalBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-3 py-2">
          {isSingle ? (
            <p className="text-sm font-semibold text-slate-700 m-0">
              هل أنت متأكد من رغبتك في حذف بيانات الطالب{" "}
              <strong className="text-slate-900">
                "{student.name || student.email}"
              </strong>
              ؟ هذا الإجراء نهائي ولا يمكن التراجع عنه.
            </p>
          ) : (
            <p className="text-sm font-semibold text-slate-700 m-0">
              هل أنت متأكد من حذف{" "}
              <strong className="text-red-600">({selectedCount})</strong> طلاب
              محددين نهائياً من قاعدة البيانات؟
            </p>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button type="button" className={styles.btnSecondary} onClick={onClose}>
            إلغاء
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            style={{ background: "#ef4444" }}
            onClick={onConfirm}
          >
            <Trash2 size={16} />
            <span>نعم، تأكيد الحذف</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteConfirmModal;
