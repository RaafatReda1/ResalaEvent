import React from "react";
import { Link2, ExternalLink, Clock } from "lucide-react";
import SectionCard from "./SectionCard";
import parentStyles from "../AdminDashboard.module.css";
import styles from "./UniversityChart.module.css"; // reuse bar chart styles

const THEMES = [
  { bar: "linear-gradient(90deg, #1877f2, #42a0f5)", text: "#1250a8", badge: "#dbeafe", icon: "📘" },
  { bar: "linear-gradient(90deg, #0d9488, #2dd4bf)",  text: "#0f766e", badge: "#ccfbf1", icon: "📍" },
  { bar: "linear-gradient(90deg, #7c3aed, #a78bfa)",  text: "#5b21b6", badge: "#ede9fe", icon: "👤" },
];

const formatRelative = (iso) => {
  if (!iso) return null;
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "منذ لحظات";
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hrs = Math.floor(mins / 60);
  if (hrs  < 24) return `منذ ${hrs} ساعة`;
  const days = Math.floor(hrs / 24);
  return `منذ ${days} يوم`;
};

const LinkClicksChart = ({ data = [], loading }) => {
  const total    = data.reduce((s, d) => s + d.count, 0);
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <SectionCard
      icon={Link2}
      iconBg="rgba(13, 148, 136, 0.12)"
      iconColor="#0d9488"
      title="نقرات الروابط الخارجية"
      subtitle="إجمالي مرات الضغط على روابط الفوتر من الزوار والمسجّلين"
      actions={
        total > 0 && (
          <span style={{
            background: "#f0fdfa", color: "#0d9488",
            border: "1px solid #99f6e4", borderRadius: "20px",
            padding: "3px 12px", fontSize: "0.78rem", fontWeight: 700,
          }}>
            {total.toLocaleString("ar-EG")} نقرة
          </span>
        )
      }
    >
      <div className={parentStyles.chartBox} style={{ height: "auto" }}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "8px 0" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={`${parentStyles.skeleton} ${parentStyles.skeletonText}`}
                style={{ height: 58, borderRadius: 14 }} />
            ))}
          </div>
        ) : total === 0 ? (
          <div className={parentStyles.emptyState}>
            <Link2 size={28} style={{ color: "#cbd5e1", marginBottom: 8 }} />
            <p className={parentStyles.emptyStateText}>
              لم يتم تسجيل أي نقرات بعد
            </p>
            <p style={{ fontSize: "0.78rem", color: "#94a3b8", margin: 0 }}>
              ستظهر الإحصائيات بعد أول نقرة على روابط الموقع
            </p>
          </div>
        ) : (
          <div className={styles.container}>
            {data.map((item, index) => {
              const theme      = THEMES[index % THEMES.length];
              const fillPct    = ((item.count / maxCount) * 100).toFixed(0);
              const totalPct   = total > 0 ? ((item.count / total) * 100).toFixed(1) : "0";
              const rankClass  = index === 0 ? styles.rank1 : index === 1 ? styles.rank2 : styles.rankOther;

              return (
                <div key={item.actionType} className={styles.item}>
                  <div className={styles.topRow}>
                    {/* Label + icon */}
                    <div className={styles.nameGroup}>
                      <span className={`${styles.rank} ${rankClass}`}>{item.icon}</span>
                      <a href={item.href} target="_blank" rel="noopener noreferrer"
                        style={{ color: theme.text, fontWeight: 700, fontSize: "0.85rem",
                                 textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}
                        title={item.href}>
                        {item.label}
                        <ExternalLink size={11} style={{ opacity: 0.6 }} />
                      </a>
                    </div>

                    {/* Counts */}
                    <div className={styles.badgesGroup}>
                      <span className={styles.countBadge}
                        style={{ background: theme.badge, color: theme.text }}>
                        {item.count.toLocaleString("ar-EG")} نقرة
                      </span>
                      <span className={styles.percentBadge}>({totalPct}%)</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className={styles.barBg}>
                    <div className={styles.barFill}
                      style={{ width: `${fillPct}%`, background: theme.bar }} />
                  </div>

                  {/* Last clicked */}
                  {item.lastClickedAt && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4,
                                  fontSize: "0.72rem", color: "#94a3b8", marginTop: 2 }}>
                      <Clock size={10} />
                      <span>آخر نقرة: {formatRelative(item.lastClickedAt)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default LinkClicksChart;
