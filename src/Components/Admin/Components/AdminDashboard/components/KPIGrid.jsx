import React from "react";
import { Users, UserCheck, Clock, Percent } from "lucide-react";
import KPICard from "./KPICard";
import styles from "../AdminDashboard.module.css";

const KPIGrid = ({ kpiData, loading }) => {
  const total = kpiData?.total ?? 0;
  const approved = kpiData?.approved ?? 0;
  const pending = kpiData?.pending ?? 0;
  const rate = kpiData?.approvalRate ?? "0.0";

  return (
    <div className={styles.kpiGrid}>
      {/* 1. Total Students */}
      <KPICard
        icon={Users}
        label="إجمالي الطلاب"
        value={total}
        badgeText="كل الاستمارات"
        color="#3ab9ac"
        loading={loading}
      />

      {/* 2. Approved Students */}
      <KPICard
        icon={UserCheck}
        label="الطلاب المقبولون"
        value={approved}
        badgeText={`${rate}% من الإجمالي`}
        badgeBg="rgba(34, 197, 94, 0.15)"
        badgeColor="#16a34a"
        color="#22c55e"
        loading={loading}
      />

      {/* 3. Pending Students */}
      <KPICard
        icon={Clock}
        label="في انتظار المراجعة"
        value={pending}
        badgeText="بحاجة لقرار"
        badgeBg="rgba(245, 158, 11, 0.15)"
        badgeColor="#d97706"
        color="#f59e0b"
        loading={loading}
      />

      {/* 4. Approval Rate */}
      <KPICard
        icon={Percent}
        label="نسبة القبول"
        value={`${rate}%`}
        badgeText="معدل الاعتماد"
        badgeBg="rgba(59, 130, 246, 0.15)"
        badgeColor="#2563eb"
        color="#3b82f6"
        loading={loading}
      />
    </div>
  );
};

export default KPIGrid;
