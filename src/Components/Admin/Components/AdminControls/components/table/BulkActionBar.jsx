import React from "react";
import { ShieldCheck, Check, X, Trash2 } from "lucide-react";
import styles from "../../AdminControls.module.css";

const BulkActionBar = ({
  selectedCount = 0,
  onBulkApproval,
  onOpenBulkDelete,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className={styles.bulkBar}>
      <div className={styles.bulkInfo}>
        <ShieldCheck size={18} />
        <span>تم تحديد ({selectedCount}) طلاب</span>
      </div>

      <div className={styles.bulkActions}>
        <button
          type="button"
          className={styles.bulkBtnApprove}
          onClick={() => onBulkApproval(true)}
        >
          <Check size={14} />
          <span>اعتماد وقبول المحدد</span>
        </button>

        <button
          type="button"
          className={styles.bulkBtnReject}
          onClick={() => onBulkApproval(false)}
        >
          <X size={14} />
          <span>رفض المحدد</span>
        </button>

        <button
          type="button"
          className={styles.bulkBtnDelete}
          onClick={onOpenBulkDelete}
        >
          <Trash2 size={14} />
          <span>حذف المحدد</span>
        </button>
      </div>
    </div>
  );
};

export default BulkActionBar;
