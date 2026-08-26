import React from "react";
import BulkActionBar from "./table/BulkActionBar";
import StudentRow from "./table/StudentRow";
import StudentDrawer from "./table/StudentDrawer";
import styles from "../AdminControls.module.css";

const StudentsTable = ({
  students = [],
  loading = false,
  selectedIds = [],
  expandedRowId = null,
  whatsAppTemplate,
  whatsAppNameOptions,
  onToggleSelectAll,
  onToggleSelectOne,
  onToggleRowExpansion,
  onOpenDetails,
  onOpenEdit,
  onOpenDelete,
  onSingleApproval,
  onBulkApproval,
  onOpenBulkDelete,
  sortBy,
  sortAsc,
  onSortChange,
}) => {
  const allSelected =
    students.length > 0 && selectedIds.length === students.length;

  return (
    <div className={styles.tableCard}>
      {/* 1. Floating Bulk Actions Bar */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        onBulkApproval={onBulkApproval}
        onOpenBulkDelete={onOpenBulkDelete}
      />

      {/* 2. Table Container */}
      <div className={styles.tableResponsive}>
        <table className={styles.studentsTable}>
          <thead>
            <tr>
              <th style={{ width: "44px", textAlign: "center" }}>
                <input
                  type="checkbox"
                  style={{
                    width: "16px",
                    height: "16px",
                    cursor: "pointer",
                    accentColor: "#0d9488",
                  }}
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                />
              </th>
              <th>بيانات الطالب</th>
              <th
                style={{ cursor: "pointer", userSelect: "none" }}
                onClick={() => onSortChange("university")}
              >
                الجامعة {sortBy === "university" ? (sortAsc ? "↑" : "↓") : ""}
              </th>
              <th>الفرقة</th>
              <th>نقطة التجمع</th>
              <th
                style={{ cursor: "pointer", userSelect: "none" }}
                onClick={() => onSortChange("isApproved")}
              >
                الحالة {sortBy === "isApproved" ? (sortAsc ? "↑" : "↓") : ""}
              </th>
              <th
                style={{ cursor: "pointer", userSelect: "none" }}
                onClick={() => onSortChange("created_at")}
              >
                تاريخ التسجيل {sortBy === "created_at" ? (sortAsc ? "↑" : "↓") : ""}
              </th>
              <th style={{ textAlign: "center", width: "120px" }}>إجراءات</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "48px",
                    color: "#94a3b8",
                    fontWeight: 700,
                  }}
                >
                  جاري تحميل بيانات الطلاب...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "48px",
                    color: "#94a3b8",
                    fontWeight: 700,
                  }}
                >
                  لا توجد نتائج مطابقة لشروط البحث والفلترة.
                </td>
              </tr>
            ) : (
              students.map((student) => {
                const isSelected = selectedIds.includes(student.id);
                const isExpanded = expandedRowId === student.id;

                return (
                  <React.Fragment key={student.id}>
                    {/* Primary Row */}
                    <StudentRow
                      student={student}
                      isSelected={isSelected}
                      isExpanded={isExpanded}
                      whatsAppTemplate={whatsAppTemplate}
                      whatsAppNameOptions={whatsAppNameOptions}
                      onToggleSelect={() => onToggleSelectOne(student.id)}
                      onToggleExpand={() => onToggleRowExpansion(student.id)}
                      onOpenDetails={onOpenDetails}
                    />

                    {/* Expandable Accordion Drawer */}
                    {isExpanded && (
                      <tr>
                        <td colSpan="8" className={styles.drawerCell}>
                          <StudentDrawer
                            student={student}
                            whatsAppTemplate={whatsAppTemplate}
                            whatsAppNameOptions={whatsAppNameOptions}
                            onOpenDetails={onOpenDetails}
                            onOpenEdit={onOpenEdit}
                            onOpenDelete={onOpenDelete}
                            onSingleApproval={onSingleApproval}
                          />
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

export default StudentsTable;
