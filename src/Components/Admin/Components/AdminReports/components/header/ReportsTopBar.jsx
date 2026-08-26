import React from "react";
import {
  ShieldAlert,
  Download,
  RotateCw,
  Trash2,
  Crown,
  Shield,
  FileSpreadsheet,
} from "lucide-react";
import styles from "../../AdminReports.module.css";

const ReportsTopBar = ({
  isSudoAdmin = false,
  adminProfile = null,
  onRefresh,
  onExportCSV,
  onOpenPurge,
  loading = false,
  totalCount = 0,
}) => {
  return (
    <div className={styles.topBar}>
      {/* Title & Badge */}
      <div className={styles.topBarLeft}>
        <div className={styles.titleIcon}>
          <ShieldAlert size={24} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1 className={styles.pageTitle}>سجل النشاطات والرقابة (Audit Trail)</h1>
            {isSudoAdmin ? (
              <span className={`${styles.roleBadge} ${styles.roleSudo}`}>
                <Crown size={12} />
                <span>مسؤول رئيسي (Sudo)</span>
              </span>
            ) : (
              <span className={`${styles.roleBadge} ${styles.roleAdmin}`}>
                <Shield size={12} />
                <span>مشرف معتمد</span>
              </span>
            )}
          </div>
          <p className={styles.pageSubtitle}>
            تتبع وتسجيل فوري لجميع حركات الطلاب وإجراءات المشرفين (إجمالي: {totalCount} سجل)
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.topBarActions}>
        {/* Purge Logs (Sudo Only) */}
        {isSudoAdmin && (
          <button
            type="button"
            className={styles.btnDanger}
            onClick={onOpenPurge}
            title="تنظيف السجلات القديمة (صلاحية Sudo Admin فقط)"
          >
            <Trash2 size={15} />
            <span>تنظيف السجلات القديمة</span>
          </button>
        )}

        {/* Export CSV */}
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={onExportCSV}
          title="تصدير السجلات المفلترة كملف Excel / CSV"
        >
          <FileSpreadsheet size={15} />
          <span>تصدير CSV</span>
        </button>

        {/* Refresh */}
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={onRefresh}
          disabled={loading}
          title="تحديث قائمة السجلات"
        >
          <RotateCw size={15} className={loading ? "animate-spin" : ""} />
          <span>{loading ? "جاري التحديث..." : "تحديث"}</span>
        </button>
      </div>
    </div>
  );
};

export default ReportsTopBar;
