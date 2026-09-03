import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  X,
  Loader2,
} from "lucide-react";
import styles from "./AdminModal.module.css";

const AdminModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "info", // 'info' | 'success' | 'warning' | 'danger' | 'confirm'
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  isLoading = false,
}) => {
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

  const isConfirmation = Boolean(onConfirm) || type === "confirm" || type === "danger";

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={24} className={styles.iconSuccess} />;
      case "danger":
      case "warning":
        return <AlertTriangle size={24} className={styles.iconDanger} />;
      case "error":
        return <XCircle size={24} className={styles.iconDanger} />;
      default:
        return <Info size={24} className={styles.iconInfo} />;
    }
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className={styles.closeBtn} onClick={onClose} aria-label="إغلاق">
          <X size={18} />
        </button>

        <div className={styles.header}>
          <div className={styles.iconWrap}>{getIcon()}</div>
          <h3 className={styles.title}>{title}</h3>
        </div>

        <div className={styles.body}>
          {typeof message === "string" ? <p className={styles.message}>{message}</p> : message}
        </div>

        <div className={styles.actions}>
          {isConfirmation ? (
            <>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
                disabled={isLoading}
              >
                {cancelText}
              </button>
              <button
                type="button"
                className={type === "danger" ? styles.dangerBtn : styles.confirmBtn}
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 size={16} className={styles.spin} /> : confirmText}
              </button>
            </>
          ) : (
            <button type="button" className={styles.confirmBtn} onClick={onClose}>
              حسناً
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AdminModal;
