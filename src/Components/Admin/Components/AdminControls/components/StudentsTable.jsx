import React from "react";
import {
  Check,
  X,
  Clock,
  Eye,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  FileText,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { generateWhatsAppApprovalLink } from "@/utils/adminStudentActions";
import styles from "../AdminControls.module.css";

const StudentsTable = ({
  students = [],
  loading = false,
  selectedIds = [],
  expandedRowId = null,
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

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={styles.tableCard}>
      {/* Floating Bulk Actions Bar when items selected */}
      {selectedIds.length > 0 && (
        <div className={styles.bulkBar}>
          <div className={styles.bulkInfo}>
            <ShieldCheck size={18} />
            <span>تم تحديد ({selectedIds.length}) طلاب</span>
          </div>

          <div className={styles.bulkActions}>
            <button
              type="button"
              className={styles.bulkBtnApprove}
              onClick={() => onBulkApproval(true)}
            >
              <Check size={14} />
              <span>اعتماد وقبول المحدد</span>
            </button>

            <button
              type="button"
              className={styles.bulkBtnReject}
              onClick={() => onBulkApproval(false)}
            >
              <X size={14} />
              <span>رفض المحدد</span>
            </button>

            <button
              type="button"
              className={styles.bulkBtnDelete}
              onClick={onOpenBulkDelete}
            >
              <Trash2 size={14} />
              <span>حذف المحدد</span>
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className={styles.tableResponsive}>
        <table className={styles.studentsTable}>
          <thead>
            <tr>
              <th style={{ width: "44px", textAlign: "center" }}>
                <input
                  type="checkbox"
                  style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#0d9488" }}
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
                <td colSpan="8" style={{ textAlign: "center", padding: "48px", color: "#94a3b8", fontWeight: 700 }}>
                  جاري تحميل بيانات الطلاب...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "48px", color: "#94a3b8", fontWeight: 700 }}>
                  لا توجد نتائج مطابقة لشروط البحث والفلترة.
                </td>
              </tr>
            ) : (
              students.map((student) => {
                const isSelected = selectedIds.includes(student.id);
                const isExpanded = expandedRowId === student.id;
                const whatsAppLink = generateWhatsAppApprovalLink(student);

                return (
                  <React.Fragment key={student.id}>
                    {/* Main Row */}
                    <tr
                      className={`${styles.tableRow} ${
                        isExpanded ? styles.rowExpanded : ""
                      }`}
                      onClick={() => onToggleRowExpansion(student.id)}
                    >
                      {/* Checkbox */}
                      <td
                        style={{ textAlign: "center" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#0d9488" }}
                          checked={isSelected}
                          onChange={() => onToggleSelectOne(student.id)}
                        />
                      </td>

                      {/* Student Info: Name & Email Only (Professional, No "شهادة" word) */}
                      <td>
                        <div className={styles.studentCell}>
                          <span className={styles.studentNameText}>
                            {student.name || "بدون اسم"}
                          </span>
                          <span className={styles.studentEmailText}>
                            {student.email}
                          </span>
                        </div>
                      </td>

                      {/* University */}
                      <td>
                        <span style={{ fontWeight: 700, color: "#334155" }}>
                          {student.university || "—"}
                        </span>
                      </td>

                      {/* Academic Year */}
                      <td>
                        <span style={{
                          fontSize: "0.78rem",
                          fontWeight: 800,
                          background: "#f1f5f9",
                          color: "#334155",
                          padding: "4px 8px",
                          borderRadius: "6px",
                        }}>
                          {student.academicYear || "—"}
                        </span>
                      </td>

                      {/* Place */}
                      <td>
                        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#475569" }}>
                          {student.place || "—"}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        {student.isApproved === true && (
                          <span className={`${styles.statusBadge} ${styles.statusApproved}`}>
                            <Check size={12} />
                            <span>مقبول</span>
                          </span>
                        )}
                        {student.isApproved === null && (
                          <span className={`${styles.statusBadge} ${styles.statusPending}`}>
                            <Clock size={12} />
                            <span>في الانتظار</span>
                          </span>
                        )}
                        {student.isApproved === false && (
                          <span className={`${styles.statusBadge} ${styles.statusRejected}`}>
                            <X size={12} />
                            <span>مرفوض</span>
                          </span>
                        )}
                      </td>

                      {/* Created At */}
                      <td>
                        <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>
                          {formatDate(student.created_at)}
                        </span>
                      </td>

                      {/* Quick Actions (Clean & Spaced) */}
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className={styles.rowActionsClean}>
                          {/* Direct WhatsApp link */}
                          {student.phone && (
                            <a
                              href={whatsAppLink}
                              target="_blank"
                              rel="noreferrer"
                              className={styles.btnActionWhatsApp}
                              title="إرسال رسالة القبول عبر واتساب"
                            >
                              <MessageCircle size={15} />
                            </a>
                          )}

                          {/* Details Modal */}
                          <button
                            type="button"
                            className={styles.btnActionEye}
                            onClick={() => onOpenDetails(student)}
                            title="عرض التفاصيل والشهادة"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Accordion Expand / Collapse toggle */}
                          <button
                            type="button"
                            className={styles.expandToggleBtn}
                            onClick={() => onToggleRowExpansion(student.id)}
                            title={isExpanded ? "طي التفاصيل" : "عرض التفاصيل والشهادة بالأسفل"}
                          >
                            {isExpanded ? (
                              <ChevronUp size={15} />
                            ) : (
                              <ChevronDown size={15} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Accordion Drawer */}
                    {isExpanded && (
                      <tr>
                        <td colSpan="8" className={styles.drawerCell}>
                          <div className={styles.expandedDrawer}>
                            {/* Left: Certificate Preview */}
                            <div className={styles.drawerCertSection}>
                              <div className={styles.drawerCertTitle}>
                                <FileText size={15} />
                                <span>صورة الشهادة / بطاقة القيد المرفقة:</span>
                              </div>

                              {student.imgSrc ? (
                                <div>
                                  <img
                                    src={student.imgSrc}
                                    alt="شهادة الطالب"
                                    className={styles.drawerCertImage}
                                    onClick={() => onOpenDetails(student)}
                                    title="انقر للتكبير بالحجم الكامل"
                                  />
                                  <div className={styles.drawerCertImageFooter}>
                                    <span>انقر على الصورة للتكبير</span>
                                    <a
                                      href={student.imgSrc}
                                      target="_blank"
                                      rel="noreferrer"
                                      className={styles.drawerCertLink}
                                    >
                                      <ExternalLink size={12} />
                                      <span>فتح في نافذة مستقلة</span>
                                    </a>
                                  </div>
                                </div>
                              ) : (
                                <div className={styles.noCertBox}>
                                  <FileText size={26} />
                                  <span>لم يتم إرفاق صورة شهادة أو كارنيه</span>
                                </div>
                              )}
                            </div>

                            {/* Right: Full Details Grid & Actions */}
                            <div className={styles.drawerInfoSection}>
                              {/* Details Grid */}
                              <div className={styles.drawerDetailsGrid}>
                                <div className={styles.drawerDetailCard}>
                                  <span className={styles.drawerDetailLabel}>رقم الهاتف:</span>
                                  <span className={styles.drawerDetailVal} style={{ direction: "ltr", textAlign: "right" }}>
                                    {student.phone || "—"}
                                  </span>
                                </div>

                                <div className={styles.drawerDetailCard}>
                                  <span className={styles.drawerDetailLabel}>الجامعة / الكلية:</span>
                                  <span className={styles.drawerDetailVal}>
                                    {student.university || "—"}
                                  </span>
                                </div>

                                <div className={styles.drawerDetailCard}>
                                  <span className={styles.drawerDetailLabel}>الفرقة الدراسية:</span>
                                  <span className={styles.drawerDetailVal}>
                                    {student.academicYear || "—"}
                                  </span>
                                </div>

                                <div className={styles.drawerDetailCard}>
                                  <span className={styles.drawerDetailLabel}>نقطة التجمع / المقر:</span>
                                  <span className={styles.drawerDetailVal}>
                                    {student.place || "—"}
                                  </span>
                                </div>

                                <div className={styles.drawerDetailCard}>
                                  <span className={styles.drawerDetailLabel}>البريد الإلكتروني:</span>
                                  <span className={styles.drawerDetailVal} style={{ direction: "ltr", textAlign: "right", fontSize: "0.8rem" }}>
                                    {student.email}
                                  </span>
                                </div>

                                <div className={styles.drawerDetailCard}>
                                  <span className={styles.drawerDetailLabel}>تاريخ التسجيل:</span>
                                  <span className={styles.drawerDetailVal} style={{ fontSize: "0.8rem" }}>
                                    {formatDate(student.created_at)}
                                  </span>
                                </div>
                              </div>

                              {/* Drawer Bottom Actions */}
                              <div className={styles.drawerBottomActions}>
                                {/* Approval Buttons */}
                                <div className={styles.drawerApprovalGroup}>
                                  <button
                                    type="button"
                                    className={styles.drawerBtnApprove}
                                    onClick={() => onSingleApproval(student.id, true)}
                                  >
                                    <Check size={14} />
                                    <span>اعتماد وقبول الطالب</span>
                                  </button>

                                  <button
                                    type="button"
                                    className={styles.drawerBtnPending}
                                    onClick={() => onSingleApproval(student.id, null)}
                                  >
                                    <Clock size={14} />
                                    <span>إعادة للانتظار</span>
                                  </button>

                                  <button
                                    type="button"
                                    className={styles.drawerBtnReject}
                                    onClick={() => onSingleApproval(student.id, false)}
                                  >
                                    <X size={14} />
                                    <span>رفض الطلب</span>
                                  </button>

                                  {student.phone && (
                                    <a
                                      href={whatsAppLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className={styles.drawerBtnWhatsApp}
                                    >
                                      <MessageCircle size={14} />
                                      <span>إرسال واتساب</span>
                                    </a>
                                  )}
                                </div>

                                {/* Edit & Delete */}
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <button
                                    type="button"
                                    className={styles.drawerBtnEdit}
                                    onClick={() => onOpenEdit(student)}
                                  >
                                    <Edit2 size={13} />
                                    <span>تعديل البيانات</span>
                                  </button>

                                  <button
                                    type="button"
                                    className={styles.drawerBtnDelete}
                                    onClick={() => onOpenDelete(student)}
                                  >
                                    <Trash2 size={13} />
                                    <span>حذف</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
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
