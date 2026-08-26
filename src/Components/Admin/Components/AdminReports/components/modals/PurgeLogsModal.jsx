import React, { useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import styles from "../../AdminReports.module.css";

const PurgeLogsModal = ({ isOpen = false, onClose, onConfirmPurge }) => {
  const [days, setDays] = useState(30);
  const [purging, setPurging] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setPurging(true);
      await onConfirmPurge(Number(days));
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#dc2626" }}>
            <AlertTriangle size={22} />
            <h3 className={styles.modalTitle} style={{ color: "#dc2626" }}>
              تنظيف وحذف السجلات القديمة (Sudo Admin)
            </h3>
          </div>
          <button type="button" className={styles.closeModalBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <p style={{ fontSize: "0.86rem", color: "#334155", lineHeight: "1.6", margin: 0 }}>
            بصفتك مسجلاً بصلاحية <strong>مسؤول رئيسي (Sudo Admin)</strong>، يمكنك تنظيف السجلات التاريخية القديمة لتوفير مساحة في قاعدة البيانات مع الحفاظ على السجلات الحديثة.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#0f172a" }}>
              اختر نطاق حذف السجلات القديمة:
            </label>
            <select
              className={styles.filterSelect}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            >
              <option value={7}>حذف السجلات الأقدم من أسبوع (7 أيام)</option>
              <option value={15}>حذف السجلات الأقدم من أسبوعين (15 يوماً)</option>
              <option value={30}>حذف السجلات الأقدم من شهر (30 يوماً) - موصى به</option>
              <option value={60}>حذف السجلات الأقدم من شهرين (60 يوماً)</option>
              <option value={90}>حذف السجلات الأقدم من 3 أشهر (90 يوماً)</option>
            </select>
          </div>

          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              padding: "10px 14px",
              borderRadius: "10px",
              fontSize: "0.78rem",
              color: "#991b1b",
              fontWeight: 700,
            }}
          >
            ⚠️ تحذير: هذا الإجراء نهائي وسيتم تسجيل عملية التنظيف نفسها في سجل الرقابة تلقائياً.
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onClose}
            disabled={purging}
          >
            إلغاء
          </button>
          <button
            type="button"
            className={styles.btnDanger}
            onClick={handleConfirm}
            disabled={purging}
          >
            <Trash2 size={16} />
            <span>{purging ? "جاري التنظيف..." : `تأكيد تنظيف السجلات`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurgeLogsModal;
