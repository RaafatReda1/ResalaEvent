import React from "react";
import {
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  Award,
  AlertTriangle,
} from "lucide-react";
import styles from "../../AdminControls.module.css";

const PresetFilterCards = ({
  presetFilter = "all",
  onSelectPreset,
  presetStats = {},
}) => {
  const cards = [
    {
      key: "all",
      title: "جميع الطلاب",
      count: presetStats.total || 0,
      icon: <Users size={16} className="text-teal-600" />,
      badgeStyle: {},
    },
    {
      key: "pending",
      title: "في الانتظار",
      count: presetStats.pending || 0,
      icon: <Clock size={16} className="text-amber-500" />,
      badgeStyle: { background: "#fef3c7", color: "#b45309" },
    },
    {
      key: "today",
      title: "مسجلي اليوم",
      count: presetStats.today || 0,
      icon: <Calendar size={16} className="text-blue-500" />,
      badgeStyle: { background: "#e0f2fe", color: "#0369a1" },
    },
    {
      key: "approved",
      title: "المقبولين",
      count: presetStats.approved || 0,
      icon: <CheckCircle2 size={16} className="text-emerald-600" />,
      badgeStyle: { background: "#dcfce7", color: "#15803d" },
    },
    {
      key: "has_cert",
      title: "مرفق شهادة",
      count: presetStats.hasCert || 0,
      icon: <Award size={16} className="text-indigo-600" />,
      badgeStyle: { background: "#ede9fe", color: "#6d28d9" },
    },
    {
      key: "incomplete",
      title: "بيانات ناقصة",
      count: presetStats.incomplete || 0,
      icon: <AlertTriangle size={16} className="text-rose-500" />,
      badgeStyle: { background: "#ffe4e6", color: "#be123c" },
    },
  ];

  return (
    <div className={styles.presetGrid}>
      {cards.map((c) => (
        <div
          key={c.key}
          className={`${styles.presetCard} ${
            presetFilter === c.key ? styles.activePreset : ""
          }`}
          onClick={() => onSelectPreset(c.key)}
        >
          <div className={styles.presetLeft}>
            {c.icon}
            <span className={styles.presetTitle}>{c.title}</span>
          </div>
          <span
            className={styles.presetBadge}
            style={presetFilter !== c.key ? c.badgeStyle : {}}
          >
            {c.count}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PresetFilterCards;
