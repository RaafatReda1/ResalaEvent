import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TrendingUp, Clock, Calendar } from "lucide-react";
import SectionCard from "./SectionCard";
import styles from "../AdminDashboard.module.css";

const PERIOD_OPTIONS = [
  { id: "24h", label: "بالساعات (يوم محدد)" },
  { id: "7d", label: "آخر 7 أيام" },
  { id: "30d", label: "آخر 30 يوم" },
  { id: "6m", label: "آخر 6 شهور" },
  { id: "1y", label: "آخر سنة" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#0f172a",
          color: "#ffffff",
          padding: "8px 14px",
          borderRadius: "10px",
          fontSize: "0.85rem",
          fontWeight: 700,
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          textAlign: "right",
          direction: "rtl",
        }}
      >
        <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.75rem" }}>
          {label}
        </p>
        <p style={{ margin: "4px 0 0", color: "#3ab9ac" }}>
          {payload[0].value} طالب مسجل
        </p>
      </div>
    );
  }
  return null;
};

const RegistrationTrend = ({
  data,
  period,
  onPeriodChange,
  trendDate,
  onDateChange,
  loading,
}) => {
  const isHourly = period === "24h";

  const periodControls = (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
      {/* Date picker for hourly mode */}
      {isHourly && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "#f1f5f9",
            padding: "4px 10px",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
          }}
        >
          <Calendar size={14} className="text-teal-600" />
          <input
            type="date"
            value={trendDate || new Date().toISOString().split("T")[0]}
            onChange={(e) => onDateChange && onDateChange(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "0.82rem",
              fontWeight: 700,
              color: "#0f172a",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          />
        </div>
      )}

      {/* Period Tabs */}
      <div className={styles.periodTabs}>
        {PERIOD_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            className={`${styles.periodBtn} ${
              period === opt.id ? styles.activePeriod : ""
            }`}
            onClick={() => onPeriodChange(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <SectionCard
      icon={isHourly ? Clock : TrendingUp}
      title={
        isHourly
          ? `تدفق التسجيلات بالساعات ليوم (${trendDate || "اليوم"})`
          : "تسجيلات الطلاب مع الوقت"
      }
      subtitle={
        isHourly
          ? "معدل تدفق استمارات التسجيل خلال كل ساعة من ساعات اليوم الـ 24 (من 12 ص حتى 11 م)"
          : "معدل نمو استمارات التسجيل خلال الفترة المحددة"
      }
      actions={periodControls}
    >
      <div className={styles.chartBox}>
        {loading ? (
          <div
            className={styles.skeleton}
            style={{ width: "100%", height: "100%", borderRadius: "14px" }}
          />
        ) : !data || data.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>لا توجد بيانات تسجيل لهذه الفترة</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3ab9ac" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3ab9ac" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval={isHourly ? 2 : "preserveEnd"}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="students"
                stroke="#3ab9ac"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#trendGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </SectionCard>
  );
};

export default RegistrationTrend;
