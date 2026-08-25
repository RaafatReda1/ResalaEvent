import React from "react";
import { UserPlus, User } from "lucide-react";
import { formatRelativeTime, getStatusInfo } from "@/utils/dashboardActions";
import SectionCard from "./SectionCard";
import styles from "../AdminDashboard.module.css";

const RecentRegistrations = ({ students = [], loading }) => {
  return (
    <SectionCard
      icon={UserPlus}
      iconBg="rgba(59, 130, 246, 0.12)"
      iconColor="#3b82f6"
      title="أحدث التسجيلات"
      subtitle="آخر 10 طلاب قاموا بملء استمارة الحضور"
    >
      <div className={styles.tableResponsive}>
        {loading ? (
          <div className="flex flex-col gap-3 py-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`${styles.skeleton} ${styles.skeletonText}`}
                style={{ height: "45px" }}
              />
            ))}
          </div>
        ) : !students || students.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>لا توجد تسجيلات حتى الآن</p>
          </div>
        ) : (
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th>الطالب</th>
                <th>الجامعة</th>
                <th>الفرقة</th>
                <th>الحالة</th>
                <th>تاريخ التسجيل</th>
              </tr>
            </thead>
            <tbody>
              {students.map((st) => {
                const status = getStatusInfo(st.isApproved);

                return (
                  <tr key={st.id}>
                    <td>
                      <div className={styles.studentAvatarCell}>
                        {st.imgSrc ? (
                          <img
                            src={st.imgSrc}
                            alt={st.name}
                            className={styles.studentThumb}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div
                            className={`${styles.studentThumb} flex items-center justify-center text-slate-400`}
                          >
                            <User size={18} />
                          </div>
                        )}
                        <div className={styles.studentNameBlock}>
                          <span className={styles.studentName}>
                            {st.name || "بدون اسم"}
                          </span>
                          <span className={styles.studentEmail}>
                            {st.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="font-semibold text-slate-700">
                      {st.university || "—"}
                    </td>
                    <td className="font-semibold text-slate-700">
                      {st.academicYear || "—"}
                    </td>
                    <td>
                      <span
                        className={styles.statusPill}
                        style={{ background: status.bg, color: status.color }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: status.color,
                          }}
                        />
                        <span>{status.label}</span>
                      </span>
                    </td>
                    <td
                      className="text-slate-500 text-xs font-semibold whitespace-nowrap"
                      title={st.created_at}
                    >
                      {formatRelativeTime(st.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </SectionCard>
  );
};

export default RecentRegistrations;
