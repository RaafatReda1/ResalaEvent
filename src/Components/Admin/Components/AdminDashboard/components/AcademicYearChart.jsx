import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";
import { BookOpen } from "lucide-react";
import SectionCard from "./SectionCard";
import styles from "../AdminDashboard.module.css";

const YEAR_COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#ec4899", "#f43f5e"];

const AcademicYearChart = ({ data, loading }) => {
  return (
    <SectionCard
      icon={BookOpen}
      iconBg="rgba(59, 130, 246, 0.12)"
      iconColor="#3b82f6"
      title="الطلاب حسب السنة الدراسية"
      subtitle="توزيع الحضور حسب الفرق الدراسية"
    >
      <div className={styles.chartBox}>
        {loading ? (
          <div
            className={styles.skeleton}
            style={{ width: "100%", height: "100%", borderRadius: "14px" }}
          />
        ) : !data || data.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>لا توجد بيانات للفرق الدراسية</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 15, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#334155", fontSize: 11, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                formatter={(value) => [`${value} طالب`, "العدد"]}
                labelStyle={{ fontWeight: 800, color: "#0f172a" }}
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  direction: "rtl",
                  textAlign: "right",
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={YEAR_COLORS[index % YEAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </SectionCard>
  );
};

export default AcademicYearChart;
