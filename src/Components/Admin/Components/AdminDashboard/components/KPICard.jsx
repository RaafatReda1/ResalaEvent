import React from "react";
import styles from "../AdminDashboard.module.css";

const KPICard = ({
  icon: Icon,
  label,
  value,
  badgeText,
  badgeBg = "rgba(58, 185, 172, 0.15)",
  badgeColor = "#2ea396",
  color = "#3ab9ac",
  loading = false,
}) => {
  return (
    <div
      className={styles.kpiCard}
      style={{ "--kpi-color": color }}
    >
      <div className={styles.kpiInfo}>
        <span className={styles.kpiLabel}>{label}</span>
        {loading ? (
          <div className={`${styles.skeleton} ${styles.skeletonKpi}`} />
        ) : (
          <span className={styles.kpiValue}>
            {typeof value === "number" ? value.toLocaleString("ar-EG") : value || "0"}
          </span>
        )}
        {badgeText && !loading && (
          <span
            className={styles.kpiBadge}
            style={{ background: badgeBg, color: badgeColor }}
          >
            {badgeText}
          </span>
        )}
      </div>

      <div
        className={styles.kpiIconWrapper}
        style={{
          background: `rgba(${
            color === "#3ab9ac"
              ? "58, 185, 172, 0.12"
              : color === "#22c55e"
              ? "34, 197, 94, 0.12"
              : color === "#f59e0b"
              ? "245, 158, 11, 0.12"
              : "59, 130, 246, 0.12"
          })`,
          color: color,
        }}
      >
        <Icon size={26} />
      </div>
    </div>
  );
};

export default KPICard;
