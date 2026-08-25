import React from "react";
import { MapPin } from "lucide-react";
import SectionCard from "./SectionCard";
import styles from "../AdminDashboard.module.css";

const PlaceChart = ({ data, totalStudents = 0, loading }) => {
  return (
    <SectionCard
      icon={MapPin}
      iconBg="rgba(230, 57, 70, 0.12)"
      iconColor="#e63946"
      title="الطلاب حسب نقطة التجمع / الفرع"
      subtitle="توزيع رغبات التحرك والباصات"
    >
      <div className={styles.chartBox} style={{ overflowY: "auto" }}>
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`${styles.skeleton} ${styles.skeletonText}`}
                style={{ height: "36px" }}
              />
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>لا توجد بيانات نقاط تجمع</p>
          </div>
        ) : (
          <div className={styles.rankedList}>
            {data.map((item, index) => {
              const percent =
                totalStudents > 0
                  ? ((item.value / totalStudents) * 100).toFixed(1)
                  : 0;

              return (
                <div key={item.name} className={styles.rankedItem}>
                  <span className={styles.rankBadge}>{index + 1}</span>
                  <span className={styles.rankName}>{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={styles.rankCount}>
                      {item.value.toLocaleString("ar-EG")} طالب
                    </span>
                    <span className={styles.rankPercent}>({percent}%)</span>
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

export default PlaceChart;
