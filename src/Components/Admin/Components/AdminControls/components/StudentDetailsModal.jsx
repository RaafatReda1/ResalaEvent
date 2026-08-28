import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Check,
  Clock,
  MessageCircle,
  FileText,
  QrCode,
  Download,
  Copy,
} from "lucide-react";
import { generateCustomWhatsAppLink } from "@/utils/whatsAppTemplateManager";
import {
  generateStudentQRDataURL,
  downloadQRCode,
  copyQRCodeToClipboard,
  processAndCopyStudentQR,
} from "@/utils/qrCodeManager";
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
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  // Body scroll lock while modal is open
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    let isMounted = true;
    if (student?.id) {
      generateStudentQRDataURL(student).then((url) => {
        if (isMounted) setQrDataUrl(url);
      });
    } else {
      setQrDataUrl(null);
    }
    return () => {
      isMounted = false;
    };
  }, [student?.id, student?.name, student?.university, student?.academicYear]);

  if (!isOpen || !student) return null;

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

  const handleDownloadQR = () => {
    if (qrDataUrl) {
      const cleanName = student.name ? student.name.replace(/\s+/g, "_") : student.id;
      downloadQRCode(qrDataUrl, `pass_${cleanName}_${student.id}.png`);
    }
  };

  const handleCopyQR = async () => {
    if (qrDataUrl) {
      const ok = await copyQRCodeToClipboard(qrDataUrl);
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

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

  return createPortal(
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

        {/* 2. Modal Body (Scrollable) */}
        <div className={styles.modalBody}>
          {/* Interactive Certificate Viewer with Drag & Wheel Zoom */}
          <CertificateViewer imgSrc={student.imgSrc} />

          {/* Structured Details Cards Grid */}
          <StudentInfoGrid student={student} />

          {/* QR Code Card (Always available, status-aware) */}
          <div className={styles.drawerQRCard} style={{ margin: "4px 0 0 0" }}>
            <div className={styles.drawerQRTitle}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <QrCode size={16} />
                <span>رمز الدخول الخاص بالفعالية (QR Code)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {student.isApproved === true ? (
                  <span style={{ fontSize: "0.74rem", color: "#16a34a", fontWeight: 800 }}>مقبول ✅</span>
                ) : (
                  <span style={{ fontSize: "0.74rem", color: "#d97706", fontWeight: 800 }}>في الانتظار ⏳</span>
                )}
                <span className={styles.qrBadgeId}>Student ID: #{student.id}</span>
              </div>
            </div>

            <div className={styles.drawerQRContent}>
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Code #${student.id}`}
                  className={styles.drawerQRImage}
                  style={{ width: 100, height: 100 }}
                />
              ) : (
                <div
                  style={{
                    width: 100,
                    height: 100,
                    background: "#f1f5f9",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    color: "#94a3b8",
                  }}
                >
                  جاري التوليد...
                </div>
              )}

              <div className={styles.drawerQRActions}>
                <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "4px" }}>
                  رمز مشفر يحتوي على الرقم التعريفي للطالب (ID: {student.id}) لمسحه عند بوابة الدخول.
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    className={styles.drawerBtnQRDownload}
                    onClick={handleDownloadQR}
                    title="تحميل صورة الرمز على الجهاز"
                  >
                    <Download size={14} />
                    <span>تحميل الرمز</span>
                  </button>

                  <button
                    type="button"
                    className={`${styles.drawerBtnQRCopy} ${copied ? styles.copied : ""}`}
                    onClick={handleCopyQR}
                    title="نسخ صورة الرمز مباشرة للحافظة للصق في واتساب"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? "تم النسخ!" : "نسخ للحافظة"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Action Buttons Footer (Pinned) */}
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
            <button
              type="button"
              onClick={handleWhatsAppSend}
              className={styles.drawerBtnWhatsApp}
              style={{ padding: "9px 16px" }}
              title={
                student.isApproved === true
                  ? "تحميل ونسخ رمز الـ QR ثم فتح محادثة الواتساب"
                  : "إرسال رسالة عبر واتساب"
              }
            >
              <MessageCircle size={15} />
              <span>إرسال رسالة القبول عبر واتساب</span>
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default StudentDetailsModal;
