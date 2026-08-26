import React, { useState } from "react";
import {
  Check,
  Clock,
  X,
  Eye,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  QrCode,
} from "lucide-react";
import { generateCustomWhatsAppLink } from "@/utils/whatsAppTemplateManager";
import { processAndCopyStudentQR } from "@/utils/qrCodeManager";
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
  const [qrLoading, setQrLoading] = useState(false);

  const whatsAppLink = generateCustomWhatsAppLink(
    student,
    whatsAppTemplate,
    whatsAppNameOptions
  );

  const handleWhatsAppSend = async (e) => {
    e.preventDefault();
    try {
      await processAndCopyStudentQR(student);
    } catch (err) {
      console.error("Failed to generate/copy QR on WhatsApp send:", err);
    }
    if (whatsAppLink) {
      window.open(whatsAppLink, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownloadQR = async (e) => {
    e.stopPropagation();
    try {
      setQrLoading(true);
      await processAndCopyStudentQR(student);
    } catch (err) {
      console.error("Failed to download QR:", err);
    } finally {
      setQrLoading(false);
    }
  };

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
      <td className={styles.colCheckbox} onClick={(e) => e.stopPropagation()}>
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
      <td className={styles.colStudent}>
        <div className={styles.studentCell}>
          <span className={styles.studentNameText}>
            {student.name || "بدون اسم"}
          </span>
          <span className={styles.studentEmailText}>{student.email}</span>
        </div>
      </td>

      {/* University */}
      <td className={styles.colUniversity}>
        <span className={styles.metaLabelMobile}>الجامعة: </span>
        <span style={{ fontWeight: 700, color: "#334155" }}>
          {student.university || "—"}
        </span>
      </td>

      {/* Academic Year */}
      <td className={styles.colAcademicYear}>
        <span className={styles.metaLabelMobile}>الفرقة: </span>
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
      <td className={styles.colPlace}>
        <span className={styles.metaLabelMobile}>المقر: </span>
        <span
          style={{ fontSize: "0.82rem", fontWeight: 600, color: "#475569" }}
        >
          {student.place || "—"}
        </span>
      </td>

      {/* Status */}
      <td className={styles.colStatus}>
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
      <td className={styles.colDate}>
        <span className={styles.metaLabelMobile}>التسجيل: </span>
        <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 700 }}>
          {formatDate(student.created_at)}
        </span>
      </td>

      {/* Quick Actions */}
      <td className={styles.colActions} onClick={(e) => e.stopPropagation()}>
        <div className={styles.rowActionsClean}>
          {/* QR Code Action (Always available, highlighted when approved) */}
          <button
            type="button"
            className={`${styles.btnActionQR} ${
              student.isApproved === true ? styles.btnActionQRApproved : ""
            }`}
            onClick={handleDownloadQR}
            disabled={qrLoading}
            title={
              student.isApproved === true
                ? "تحميل ونسخ رمز الـ QR للطالب المعتمد"
                : "توليد وتحميل رمز الـ QR للطالب"
            }
          >
            <QrCode size={16} />
            <span className={styles.actionBtnLabelMobile}>رمز QR</span>
          </button>

          {/* Direct WhatsApp link with customized template */}
          {student.phone && (
            <button
              type="button"
              onClick={handleWhatsAppSend}
              className={styles.btnActionWhatsApp}
              title="تحميل ونسخ رمز الـ QR ثم فتح محادثة الواتساب"
            >
              <MessageCircle size={16} />
              <span className={styles.actionBtnLabelMobile}>واتساب</span>
            </button>
          )}

          {/* Details Modal */}
          <button
            type="button"
            className={styles.btnActionEye}
            onClick={() => onOpenDetails(student)}
            title="عرض التفاصيل والشهادة"
          >
            <Eye size={16} />
            <span className={styles.actionBtnLabelMobile}>التفاصيل</span>
          </button>

          {/* Accordion Expand / Collapse toggle */}
          <button
            type="button"
            className={styles.expandToggleBtn}
            onClick={onToggleExpand}
            title={isExpanded ? "طي التفاصيل" : "عرض التفاصيل والشهادة بالأسفل"}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span className={styles.actionBtnLabelMobile}>
              {isExpanded ? "طي" : "المزيد"}
            </span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default StudentRow;

