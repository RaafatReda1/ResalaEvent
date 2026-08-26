import React from "react";
import {
  ListFilter,
  GraduationCap,
  ShieldCheck,
  AlertOctagon,
  KeyRound,
  Link2,
} from "lucide-react";
import styles from "../../AdminReports.module.css";

const ReportsPresetCards = ({ presetFilter = "all", onSelectPreset, stats = {} }) => {
  const cards = [
    {
      id: "all",
      label: "جميع السجلات",
      count: stats.total || 0,
      icon: <ListFilter size={18} color="#0f766e" />,
      bg: "#f0fdfa",
    },
    {
      id: "students",
      label: "نشاطات واستمارات الطلاب",
      count: stats.studentActions || 0,
      icon: <GraduationCap size={18} color="#0284c7" />,
      bg: "#f0f9ff",
    },
    {
      id: "admins",
      label: "إجراءات واعتمادات المشرفين",
      count: stats.adminOperations || 0,
      icon: <ShieldCheck size={18} color="#16a34a" />,
      bg: "#f0fdf4",
    },
    {
      id: "deletions",
      label: "عمليات الحذف والـ Sudo",
      count: stats.deletions || 0,
      icon: <AlertOctagon size={18} color="#dc2626" />,
      bg: "#fef2f2",
    },
    {
      id: "auth",
      label: "سجلات الدخول والخروج",
      count: stats.authLogs || 0,
      icon: <KeyRound size={18} color="#d97706" />,
      bg: "#fffbeb",
    },
    {
      id: "linkClicks",
      label: "نقرات الروابط (الزوار)",
      count: stats.linkClicks || 0,
      icon: <Link2 size={18} color="#0d9488" />,
      bg: "#f0fdfa",
    },
  ];

  return (
    <div className={styles.statsGrid}>
      {cards.map((c) => {
        const isActive = presetFilter === c.id;
        return (
          <div
            key={c.id}
            className={`${styles.statCard} ${isActive ? styles.statCardActive : ""}`}
            onClick={() => onSelectPreset(isActive ? "all" : c.id)}
          >
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>{c.label}</span>
              <span className={styles.statCount}>{c.count}</span>
            </div>
            <div className={styles.statIconBox} style={{ background: c.bg }}>
              {c.icon}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportsPresetCards;
