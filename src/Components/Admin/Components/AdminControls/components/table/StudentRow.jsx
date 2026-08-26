import React from "react";
import {
  Check,
  Clock,
  X,
  Eye,
  ChevronDown,
  ChevronUp,
  MessageCircle,
} from "lucide-react";
import { generateCustomWhatsAppLink } from "@/utils/whatsAppTemplateManager";
import styles from "../../AdminControls.module.css";

const StudentRow = ({
  student,
  isSelected = false,
  isExpanded = false,
  whatsAppTemplate,
  whatsAppNameOptions,
  onToggleSelect,
  onToggleExpand,
  onOpenDetails,
}) => {
  const whatsAppLink = generateCustomWhatsAppLink(
    student,
    whatsAppTemplate,
    whatsAppNameOptions
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("ar-EG", {
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
    <tr
      className={`${styles.tableRow} ${isExpanded ? styles.rowExpanded : ""}`}
      onClick={onToggleExpand}
    >
      {/* Checkbox */}
      <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          style={{
            width: "16px",
            height: "16px",
            cursor: "pointer",
            accentColor: "#0d9488",
          }}
          checked={isSelected}
          onChange={onToggleSelect}
        />
      </td>

      {/* Student Info: Name & Email Only */}
      <td>
        <div className={styles.studentCell}>
          <span className={styles.studentNameText}>
            {student.name || "بدون اسم"}
          </span>
          <span className={styles.studentEmailText}>{student.email}</span>
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
        <span
          style={{
            fontSize: "0.78rem",
            fontWeight: 800,
            background: "#f1f5f9",
            color: "#334155",
            padding: "4px 8px",
            borderRadius: "6px",
          }}
        >
          {student.academicYear || "—"}
        </span>
      </td>

      {/* Place */}
      <td>
        <span
          style={{ fontSize: "0.82rem", fontWeight: 600, color: "#475569" }}
        >
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

      {/* Registration Date */}
      <td>
        <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>
          {formatDate(student.created_at)}
        </span>
      </td>

      {/* Quick Actions */}
      <td onClick={(e) => e.stopPropagation()}>
        <div className={styles.rowActionsClean}>
          {/* Direct WhatsApp link with customized template */}
          {student.phone && (
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noreferrer"
              className={styles.btnActionWhatsApp}
              title="إرسال رسالة القبول المخصصة عبر واتساب"
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
            onClick={onToggleExpand}
            title={isExpanded ? "طي التفاصيل" : "عرض التفاصيل والشهادة بالأسفل"}
          >
            {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default StudentRow;
