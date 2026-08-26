import React from "react";
import { X, Check, Clock, MessageCircle, FileText } from "lucide-react";
import { generateCustomWhatsAppLink } from "@/utils/whatsAppTemplateManager";
import CertificateViewer from "./modals/CertificateViewer";
import StudentInfoGrid from "./modals/StudentInfoGrid";
import styles from "../AdminControls.module.css";

const StudentDetailsModal = ({
  isOpen = false,
  onClose,
  student = null,
  whatsAppTemplate,
  whatsAppNameOptions,
  onApprovalChange,
}) => {
  if (!isOpen || !student) return null;

  const whatsAppLink = generateCustomWhatsAppLink(
    student,
    whatsAppTemplate,
    whatsAppNameOptions
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* 1. Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalIconBox}>
              <FileText size={22} />
            </div>
            <div>
              <h2 className={styles.modalTitle}>
                {student.name || "تفاصيل الطالب"}
              </h2>
              <p className={styles.modalSubtitle}>
                تاريخ التسجيل: {formatDate(student.created_at)}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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

            <button
              type="button"
              className={styles.closeModalBtn}
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 2. Interactive Certificate Viewer with Drag & Wheel Zoom */}
        <CertificateViewer imgSrc={student.imgSrc} />

        {/* 3. Structured Details Cards Grid */}
        <StudentInfoGrid student={student} />

        {/* 4. Action Buttons Footer */}
        <div className={styles.modalFooterActions}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              className={styles.drawerBtnApprove}
              onClick={() => onApprovalChange(student.id, true)}
            >
              <Check size={14} />
              <span>اعتماد وقبول الطالب</span>
            </button>

            <button
              type="button"
              className={styles.drawerBtnPending}
              onClick={() => onApprovalChange(student.id, null)}
            >
              <Clock size={14} />
              <span>إعادة للانتظار</span>
            </button>

            <button
              type="button"
              className={styles.drawerBtnReject}
              onClick={() => onApprovalChange(student.id, false)}
            >
              <X size={14} />
              <span>رفض الطلب</span>
            </button>
          </div>

          {student.phone && (
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noreferrer"
              className={styles.drawerBtnWhatsApp}
              style={{ padding: "9px 16px" }}
              title="إرسال رسالة القبول المخصصة عبر واتساب"
            >
              <MessageCircle size={15} />
              <span>إرسال رسالة القبول عبر واتساب</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;
