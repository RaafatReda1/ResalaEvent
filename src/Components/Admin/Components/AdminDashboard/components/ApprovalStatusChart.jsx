import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import SectionCard from "./SectionCard";
import styles from "../AdminDashboard.module.css";

const STATUS_COLORS = {
  Approved: "#22c55e",
  Pending: "#f59e0b",
  Rejected: "#ef4444",
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div
        style={{
          background: "#0f172a",
          color: "#ffffff",
          padding: "8px 12px",
          borderRadius: "8px",
          fontSize: "0.82rem",
          fontWeight: 700,
          textAlign: "right",
          direction: "rtl",
        }}
      >
        <p style={{ margin: 0, color: item.payload.color }}>
          {item.name}: {item.value} ({item.payload.percent}%)
        </p>
      </div>
    );
  }
  return null;
};

const ApprovalStatusChart = ({ kpiData, loading }) => {
  const approved = kpiData?.approved ?? 0;
  const pending = kpiData?.pending ?? 0;
  const rejected = kpiData?.rejected ?? 0;
  const total = kpiData?.total ?? 0;

  const chartData = [
    {
      name: "مقبول",
      value: approved,
      color: STATUS_COLORS.Approved,
      percent: total > 0 ? ((approved / total) * 100).toFixed(1) : 0,
    },
    {
      name: "قيد المراجعة",
      value: pending,
      color: STATUS_COLORS.Pending,
      percent: total > 0 ? ((pending / total) * 100).toFixed(1) : 0,
    },
  ];

  if (rejected > 0) {
    chartData.push({
      name: "مرفوض",
      value: rejected,
      color: STATUS_COLORS.Rejected,
      percent: total > 0 ? ((rejected / total) * 100).toFixed(1) : 0,
    });
  }

  const hasData = total > 0;

  return (
    <SectionCard
      icon={PieIcon}
      iconBg="rgba(34, 197, 94, 0.12)"
      iconColor="#22c55e"
      title="حالة الطلاب"
      subtitle="توزيع قرارات القبول والمراجعة"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ width: "100%", height: 180, position: "relative" }}>
          {loading ? (
            <div
              className={styles.skeleton}
              style={{ width: "100%", height: "100%", borderRadius: "50%" }}
            />
          ) : !hasData ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyStateText}>لا توجد بيانات كافية</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legend Breakdown List */}
        <div className={styles.donutLegend}>
          {chartData.map((item) => (
            <div key={item.name} className={styles.legendItem}>
              <div className={styles.legendIndicator}>
                <span
                  className={styles.legendDot}
                  style={{ background: item.color }}
                />
                <span>{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={styles.legendCount}>
                  {item.value.toLocaleString("ar-EG")}
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  ({item.percent}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
};

export default ApprovalStatusChart;
