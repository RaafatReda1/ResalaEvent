import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FileText, Copy, CheckCheck, X } from "lucide-react";
import styles from "../../AdminReports.module.css";

const LogDetailsModal = ({ isOpen = false, onClose, log }) => {
  const [copied, setCopied] = useState(false);

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

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} style={{ maxWidth: "680px" }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FileText size={20} className="text-teal-600" />
            <h3 className={styles.modalTitle}>تفاصيل السجل الكاملة #{log.id}</h3>
          </div>
          <button type="button" className={styles.closeModalBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#334155" }}>
              {log.description}
            </span>
            <button
              type="button"
              className={styles.btnSecondary}
              style={{ padding: "4px 10px", fontSize: "0.74rem" }}
              onClick={handleCopyJson}
            >
              {copied ? (
                <>
                  <CheckCheck size={12} color="#0d9488" />
                  <span style={{ color: "#0d9488" }}>تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>نسخ كـ JSON</span>
                </>
              )}
            </button>
          </div>

          <pre className={styles.jsonCodeBox} style={{ maxHeight: "360px" }}>
            {JSON.stringify(log, null, 2)}
          </pre>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button type="button" className={styles.btnPrimary} onClick={onClose}>
            إغلاق
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LogDetailsModal;
