import React from "react";
import { GraduationCap } from "lucide-react";
import SectionCard from "./SectionCard";
import parentStyles from "../AdminDashboard.module.css";
import styles from "./UniversityChart.module.css";

const GRADIENT_COLORS = [
  { bar: "linear-gradient(90deg, #3ab9ac, #2dd4bf)", text: "#0f766e", badge: "#ccfbf1" },
  { bar: "linear-gradient(90deg, #0284c7, #38bdf8)", text: "#0369a1", badge: "#e0f2fe" },
  { bar: "linear-gradient(90deg, #16a34a, #4ade80)", text: "#15803d", badge: "#dcfce7" },
  { bar: "linear-gradient(90deg, #6366f1, #818cf8)", text: "#4338ca", badge: "#e0e7ff" },
  { bar: "linear-gradient(90deg, #8b5cf6, #a78bfa)", text: "#6d28d9", badge: "#ede9fe" },
  { bar: "linear-gradient(90deg, #d946ef, #f472b6)", text: "#a21caf", badge: "#fae8ff" },
  { bar: "linear-gradient(90deg, #ea580c, #fb923c)", text: "#c2410c", badge: "#ffedd5" },
  { bar: "linear-gradient(90deg, #e11d48, #fb7185)", text: "#be123c", badge: "#ffe4e6" },
  { bar: "linear-gradient(90deg, #eab308, #fde047)", text: "#a16207", badge: "#fef9c3" },
  { bar: "linear-gradient(90deg, #64748b, #94a3b8)", text: "#334155", badge: "#f1f5f9" },
];

const UniversityChart = ({ data = [], loading }) => {
  const maxCount = data.length > 0 ? Math.max(...data.map((d) => d.value), 1) : 1;
  const totalStudents = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <SectionCard
      icon={GraduationCap}
      iconBg="rgba(58, 185, 172, 0.12)"
      iconColor="#3ab9ac"
      title="الطلاب حسب الجامعة"
      subtitle="توزيع الحضور على الجامعات بعد الفلترة الذكية وتوحيد الأسماء"
    >
      <div className={parentStyles.chartBox} style={{ height: "auto" }}>
        {loading ? (
          <div className="flex flex-col gap-3 py-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`${parentStyles.skeleton} ${parentStyles.skeletonText}`}
                style={{ height: "54px", borderRadius: "14px" }}
              />
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <div className={parentStyles.emptyState}>
            <p className={parentStyles.emptyStateText}>لا توجد بيانات جامعات مسجلة</p>
          </div>
        ) : (
          <div className={styles.container}>
            {data.map((item, index) => {
              const theme = GRADIENT_COLORS[index % GRADIENT_COLORS.length];
              const fillPercent = ((item.value / maxCount) * 100).toFixed(0);
              const totalPercent = totalStudents > 0 ? ((item.value / totalStudents) * 100).toFixed(1) : "0";

              const rankClass =
                index === 0
                  ? styles.rank1
                  : index === 1
                  ? styles.rank2
                  : index === 2
                  ? styles.rank3
                  : styles.rankOther;

              return (
                <div key={item.name} className={styles.item}>
                  <div className={styles.topRow}>
                    <div className={styles.nameGroup}>
                      <span className={`${styles.rank} ${rankClass}`}>
                        {index + 1}
                      </span>
                      <span className={styles.name} title={item.name}>
                        {item.name}
                      </span>
                    </div>

                    <div className={styles.badgesGroup}>
                      <span
                        className={styles.countBadge}
                        style={{ background: theme.badge, color: theme.text }}
                      >
                        {item.value.toLocaleString("ar-EG")} طالب
                      </span>
                      <span className={styles.percentBadge}>
                        ({totalPercent}%)
                      </span>
                    </div>
                  </div>

                  <div className={styles.barBg}>
                    <div
                      className={styles.barFill}
                      style={{
                        width: `${fillPercent}%`,
                        background: theme.bar,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default UniversityChart;
