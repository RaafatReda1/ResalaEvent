import React from "react";
import LogRow from "./LogRow";
import LogDrawer from "./LogDrawer";
import styles from "../../AdminReports.module.css";

const LogsTable = ({
  logs = [],
  loading = false,
  expandedLogId = null,
  isSudoAdmin = false,
  onToggleExpand,
  onOpenDetails,
  onOpenDelete,
}) => {
  return (
    <div className={styles.tableCard}>
      <div className={styles.tableResponsive}>
        <table className={styles.logsTable}>
          <thead>
            <tr>
              <th style={{ width: "160px" }}>تاريخ ووقت الإجراء</th>
              <th style={{ width: "240px" }}>المستخدم / المشرف</th>
              <th style={{ width: "140px" }}>فئة النشاط</th>
              <th>بيان الإجراء المتخذ</th>
              <th style={{ width: "160px" }}>الطرف المستهدف</th>
              <th style={{ width: "110px", textAlign: "center" }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "48px",
                    color: "#94a3b8",
                    fontWeight: 700,
                  }}
                >
                  جاري تحميل سجل النشاطات...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "48px",
                    color: "#94a3b8",
                    fontWeight: 700,
                  }}
                >
                  لا توجد سجلات مطابقة للبحث أو الفلترة المحددة.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const isExpanded = expandedLogId === log.id;
                return (
                  <React.Fragment key={log.id}>
                    <LogRow
                      log={log}
                      isExpanded={isExpanded}
                      isSudoAdmin={isSudoAdmin}
                      onToggleExpand={() => onToggleExpand(log.id)}
                      onOpenDetails={onOpenDetails}
                      onOpenDelete={onOpenDelete}
                    />
                    {isExpanded && (
                      <tr>
                        <td colSpan="6" className={styles.drawerCell}>
                          <LogDrawer log={log} onOpenDetails={onOpenDetails} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogsTable;
