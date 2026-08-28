import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Trash2, X } from "lucide-react";
import styles from "../../AdminReports.module.css";

const DeleteLogModal = ({ isOpen = false, onClose, log, onConfirmDelete }) => {
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

  if (!isOpen || !log) return null;

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} style={{ maxWidth: "460px" }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#dc2626" }}>
            <AlertTriangle size={20} />
            <h3 className={styles.modalTitle} style={{ color: "#dc2626" }}>
              تأكيد حذف السجل (Sudo Admin)
            </h3>
          </div>
          <button type="button" className={styles.closeModalBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "6px 0" }}>
          <p style={{ fontSize: "0.84rem", color: "#334155", margin: 0 }}>
            هل أنت متأكد من رغبتك في حذف السجل رقم <strong>#{log.id}</strong>؟
          </p>
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              padding: "10px 12px",
              borderRadius: "8px",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            "{log.description}"
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button type="button" className={styles.btnSecondary} onClick={onClose}>
            إلغاء
          </button>
          <button
            type="button"
            className={styles.btnDanger}
            onClick={onConfirmDelete}
          >
            <Trash2 size={16} />
            <span>نعم، حذف السجل</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteLogModal;
