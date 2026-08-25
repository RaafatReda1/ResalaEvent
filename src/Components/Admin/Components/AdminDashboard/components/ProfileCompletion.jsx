import React from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import SectionCard from "./SectionCard";
import styles from "../AdminDashboard.module.css";

const ProfileCompletion = ({ completionData, loading }) => {
  const total = completionData?.total ?? 0;
  const complete = completionData?.complete ?? 0;
  const incomplete = completionData?.incomplete ?? 0;
  const rate = completionData?.rate ?? "0.0";
  const missing = completionData?.missing ?? [];

  return (
    <SectionCard
      icon={CheckCircle2}
      iconBg="rgba(34, 197, 94, 0.12)"
      iconColor="#22c55e"
      title="جودة واكتمال بيانات الطلاب"
      subtitle="نسبة الاستمارات التي تحتوي على كافة البيانات المطلوبة"
    >
      <div className="flex flex-col gap-5">
        {/* Progress Bar & Header Stats */}
        <div className={styles.completionProgressWrap}>
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-700 text-sm">
              معدل اكتمال الملفات
            </span>
            <span className="font-extrabold text-teal-600 text-base">
              {rate}%
            </span>
          </div>

          <div className={styles.completionBarBg}>
            <div
              className={styles.completionBarFill}
              style={{ width: `${loading ? 0 : rate}%` }}
            />
          </div>

          <div className={styles.completionStatsRow}>
            <span>
              ✅ مكتملة: <strong>{complete.toLocaleString("ar-EG")}</strong>
            </span>
            <span>
              ⚠️ غير مكتملة: <strong>{incomplete.toLocaleString("ar-EG")}</strong>
            </span>
          </div>
        </div>

        {/* Missing Data Breakdown Checklist */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertTriangle size={14} className="text-amber-500" />
            <span>تفصيل الحقول الناقصة:</span>
          </h4>

          {loading ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`${styles.skeleton} ${styles.skeletonText}`}
                  style={{ height: "30px" }}
                />
              ))}
            </div>
          ) : missing.length === 0 ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-xl text-center">
              🎉 جميع استمارات الطلاب تحتوي على كافة البيانات كاملة!
            </div>
          ) : (
            <div className={styles.missingList}>
              {missing.map((item) => (
                <div key={item.key} className={styles.missingItem}>
                  <span>{item.label}</span>
                  <span className={styles.missingBadge}>
                    {item.count.toLocaleString("ar-EG")} طالب
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
};

export default ProfileCompletion;
