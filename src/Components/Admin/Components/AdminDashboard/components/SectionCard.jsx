import React from "react";
import styles from "../AdminDashboard.module.css";

const SectionCard = ({
  icon: Icon,
  iconBg = "rgba(58, 185, 172, 0.12)",
  iconColor = "#3ab9ac",
  title,
  subtitle,
  actions,
  children,
  className = "",
}) => {
  return (
    <div className={`${styles.sectionCard} ${className}`}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleWrap}>
          {Icon && (
            <div
              className={styles.cardIconCircle}
              style={{ background: iconBg, color: iconColor }}
            >
              <Icon size={20} />
            </div>
          )}
          <div>
            <h3 className={styles.cardTitle}>{title}</h3>
            {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
          </div>
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default SectionCard;
