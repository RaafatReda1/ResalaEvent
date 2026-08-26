import React from "react";
import styles from "../../../AdminControls.module.css";

const StudentFormApprovalToggle = ({ isApproved, onChange }) => {
  return (
    <div className={styles.formFieldFull}>
      <label className={styles.fieldLabel}>حالة القبول والاعتماد</label>
      <select
        className={styles.filterSelect}
        value={
          isApproved === true
            ? "approved"
            : isApproved === false
            ? "rejected"
            : "pending"
        }
        onChange={(e) => {
          const val = e.target.value;
          onChange(
            "isApproved",
            val === "approved" ? true : val === "rejected" ? false : null
          );
        }}
      >
        <option value="pending">⏳ في انتظار المراجعة (Pending)</option>
        <option value="approved">✅ مقبول (Approved)</option>
        <option value="rejected">❌ مرفوض (Rejected)</option>
      </select>
    </div>
  );
};

export default StudentFormApprovalToggle;
