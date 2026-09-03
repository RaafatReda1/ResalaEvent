import React from "react";
import { History, CheckCircle2, AlertTriangle, XCircle, Clock } from "lucide-react";
import styles from "./RecentScansList.module.css";

const RecentScansList = ({ recentScans = [], onSelectStudent, activeStudentId }) => {
  if (recentScans.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <History size={16} className={styles.headerIcon} />
          <h4 className={styles.title}>سجل المسح اللحظي (هذه الجلسة)</h4>
        </div>
        <p className={styles.emptyText}>لم يتم مسح أي طالب في هذه الجلسة بعد.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <History size={16} className={styles.headerIcon} />
        <h4 className={styles.title}>سجل المسح اللحظي (هذه الجلسة)</h4>
        <span className={styles.countBadge}>{recentScans.length}</span>
      </div>

      <div className={styles.scansScrollList}>
        {recentScans.map((item, idx) => {
          const isSelected = activeStudentId === item.student?.id;
          const isSuccess = item.type === "success";
          const isDuplicate = item.type === "duplicate";
          const isNotFound = item.type === "not_found";

          return (
            <div
              key={`${item.id || idx}-${item.timestamp}`}
              onClick={() => item.student && onSelectStudent(item.student)}
              className={`${styles.scanItem} ${
                isSelected ? styles.itemSelected : ""
              } ${!item.student ? styles.itemDisabled : ""}`}
              title={item.student ? "انقر لعرض ومراجعة بيانات الطالب" : ""}
            >
              <div className={styles.itemIconWrap}>
                {isSuccess && <CheckCircle2 size={16} className={styles.iconGreen} />}
                {isDuplicate && <AlertTriangle size={16} className={styles.iconAmber} />}
                {isNotFound && <XCircle size={16} className={styles.iconRed} />}
              </div>

              <div className={styles.itemInfo}>
                <span className={styles.itemName}>
                  {item.student?.name || (isNotFound ? "كود غير معروف" : "بدون اسم")}
                </span>
                <span className={styles.itemSub}>
                  {item.student?.university || item.rawCode?.substring(0, 16) || ""}
                </span>
              </div>

              <div className={styles.itemMeta}>
                <span
                  className={`${styles.statusPill} ${
                    isSuccess
                      ? styles.pillGreen
                      : isDuplicate
                      ? styles.pillAmber
                      : styles.pillRed
                  }`}
                >
                  {isSuccess
                    ? "تم تسجيله"
                    : isDuplicate
                    ? "مكرر مسبقاً"
                    : "غير موجود"}
                </span>
                <span className={styles.timeText}>
                  <Clock size={11} />
                  <span>
                    {new Date(item.timestamp).toLocaleTimeString("ar-EG", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentScansList;
