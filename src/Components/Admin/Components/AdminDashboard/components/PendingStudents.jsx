import React from "react";
import { Clock, ExternalLink, User } from "lucide-react";
import { formatRelativeTime } from "@/utils/dashboardActions";
import SectionCard from "./SectionCard";
import styles from "../AdminDashboard.module.css";
import { Link } from "react-router-dom";

const PendingStudents = ({ students = [], loading }) => {
  const headerAction = (
    <Link
      to="/students"
      className="flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-bold text-xs bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors"
    >
      <span>عرض جميع الطلبات</span>
      <ExternalLink size={13} />
    </Link>
  );

  return (
    <SectionCard
      icon={Clock}
      iconBg="rgba(245, 158, 11, 0.12)"
      iconColor="#f59e0b"
      title="طلبات في انتظار المراجعة"
      subtitle="أحدث المسجلين الذين لم يتم اعتماد قبولهم بعد"
      actions={headerAction}
    >
      <div className={styles.tableResponsive}>
        {loading ? (
          <div className="flex flex-col gap-3 py-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`${styles.skeleton} ${styles.skeletonText}`}
                style={{ height: "45px" }}
              />
            ))}
          </div>
        ) : !students || students.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>لا توجد طلبات معلقة حالياً 🎉</p>
          </div>
        ) : (
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th>الطالب</th>
                <th>الجامعة</th>
                <th>الفرقة الدراسية</th>
                <th>نقطة التجمع</th>
                <th>تاريخ الإرسال</th>
                <th>الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {students.map((st) => (
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
                        <span className={styles.studentEmail}>{st.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="font-semibold text-slate-700">
                    {st.university || "—"}
                  </td>
                  <td className="font-semibold text-slate-700">
                    {st.academicYear || "—"}
                  </td>
                  <td className="font-semibold text-slate-700">
                    {st.place || "—"}
                  </td>
                  <td
                    className="text-slate-500 text-xs font-semibold whitespace-nowrap"
                    title={st.created_at}
                  >
                    {formatRelativeTime(st.created_at)}
                  </td>
                  <td>
                    <Link
                      to="/students"
                      className={styles.reviewActionBtn}
                    >
                      مراجعة
                    </Link>
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

export default PendingStudents;
