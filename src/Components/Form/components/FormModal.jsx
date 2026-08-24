import { useEffect } from "react";
import { AlertTriangle, XCircle, HelpCircle, Sparkles, X, ArrowRight, ShieldCheck } from "lucide-react";
import styles from "../Form.module.css";


const FormModal = ({
  isOpen,
  type = "success", // 'success' | 'confirm_update' | 'confirm_cancel' | 'error' | 'duplicate_email'
  title,
  message,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  onClose,
  data,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalCard} ${styles[`modal_${type}`] || ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={styles.modalCloseBtn}
          title="إغلاق"
        >
          <X size={18} />
        </button>

        {/* Ambient Top Glow */}
        <div className={styles.modalGlow} />

        {/* Modal Icon Badge */}
        <div className={styles.modalIconWrap}>
          {type === "success" && (
            <div className={`${styles.modalIcon} ${styles.iconSuccess}`}>
              <Sparkles size={32} />
            </div>
          )}
          {type === "confirm_update" && (
            <div className={`${styles.modalIcon} ${styles.iconConfirm}`}>
              <ShieldCheck size={32} />
            </div>
          )}
          {type === "confirm_cancel" && (
            <div className={`${styles.modalIcon} ${styles.iconWarning}`}>
              <HelpCircle size={32} />
            </div>
          )}
          {type === "error" && (
            <div className={`${styles.modalIcon} ${styles.iconError}`}>
              <XCircle size={32} />
            </div>
          )}
          {type === "duplicate_email" && (
            <div className={`${styles.modalIcon} ${styles.iconWarning}`}>
              <AlertTriangle size={32} />
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className={styles.modalTitle}>{title}</h3>

        {/* Message */}
        <div className={styles.modalBody}>
          <p className={styles.modalMessage}>{message}</p>
        </div>

        {/* Action Buttons */}
        <div className={styles.modalActions}>
          {primaryLabel && (
            <button
              type="button"
              onClick={onPrimary || onClose}
              className={styles.modalPrimaryBtn}
            >
              <span>{primaryLabel}</span>
              <ArrowRight size={16} />
            </button>
          )}

          {secondaryLabel && (
            <button
              type="button"
              onClick={onSecondary || onClose}
              className={styles.modalSecondaryBtn}
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormModal;
