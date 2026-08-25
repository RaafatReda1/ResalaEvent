import React from "react";
import { Table, Award } from "lucide-react";
import SectionCard from "./SectionCard";
import styles from "../AdminDashboard.module.css";

const ApprovalByUniversityTable = ({ data = [], loading }) => {
  return (
    <SectionCard
      icon={Award}
      iconBg="rgba(99, 102, 241, 0.12)"
      iconColor="#6366f1"
      title="نسبة القبول حسب الجامعة"
      subtitle="إحصائيات تفصيلية لمعدل قبول واكتمال طلاب كل جامعة"
    >
      <div className={styles.tableResponsive}>
        {loading ? (
          <div className="flex flex-col gap-3 py-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`${styles.skeleton} ${styles.skeletonText}`}
                style={{ height: "40px" }}
              />
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>لا توجد بيانات جامعات حالياً</p>
          </div>
        ) : (
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th>الجامعة</th>
                <th>إجمالي الطلاب</th>
                <th>المقبولين</th>
                <th>قيد المراجعة</th>
                <th>نسبة القبول</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.name}>
                  <td className="font-bold text-slate-800">{row.name}</td>
                  <td className="font-bold text-slate-700">
                    {row.total.toLocaleString("ar-EG")}
                  </td>
                  <td className="font-bold text-emerald-600">
                    {row.approved.toLocaleString("ar-EG")}
                  </td>
                  <td className="font-bold text-amber-600">
                    {row.pending.toLocaleString("ar-EG")}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full"
                          style={{ width: `${row.rate}%` }}
                        />
                      </div>
                      <span className="font-extrabold text-xs text-indigo-700">
                        {row.rate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </SectionCard>
  );
};

export default ApprovalByUniversityTable;
