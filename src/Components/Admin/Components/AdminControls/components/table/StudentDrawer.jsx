import React, { useState, useEffect } from "react";
import {
  FileText,
  ExternalLink,
  Check,
  Clock,
  X,
  MessageCircle,
  Edit2,
  Trash2,
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
import styles from "../../AdminControls.module.css";

const StudentDrawer = ({
  student,
  whatsAppTemplate,
  whatsAppNameOptions,
  onOpenDetails,
  onOpenEdit,
  onOpenDelete,
  onSingleApproval,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [copied, setCopied] = useState(false);

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

  if (!student) return null;

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
    <div className={styles.expandedDrawer}>
      {/* Left: Certificate Preview & QR Code */}
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

        {/* QR Code Section (Always available, status-aware) */}
        <div className={styles.drawerQRCard}>
          <div className={styles.drawerQRTitle}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <QrCode size={15} />
              <span>رمز الدخول (QR Code)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {student.isApproved === true ? (
                <span style={{ fontSize: "0.72rem", color: "#16a34a", fontWeight: 800 }}>مقبول ✅</span>
              ) : (
                <span style={{ fontSize: "0.72rem", color: "#d97706", fontWeight: 800 }}>في الانتظار ⏳</span>
              )}
              <span className={styles.qrBadgeId}>ID: #{student.id}</span>
            </div>
          </div>

          <div className={styles.drawerQRContent}>
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR Code #${student.id}`}
                className={styles.drawerQRImage}
              />
            ) : (
              <div
                style={{
                  width: 90,
                  height: 90,
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
              <button
                type="button"
                className={styles.drawerBtnQRDownload}
                onClick={handleDownloadQR}
                title="تحميل صورة الرمز على الجهاز"
              >
                <Download size={13} />
                <span>تحميل الرمز</span>
              </button>

              <button
                type="button"
                className={`${styles.drawerBtnQRCopy} ${copied ? styles.copied : ""}`}
                onClick={handleCopyQR}
                title="نسخ صورة الرمز مباشرة للحافظة للصق في واتساب"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span>{copied ? "تم النسخ!" : "نسخ للحافظة"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Full Details Grid & Actions */}
      <div className={styles.drawerInfoSection}>
        {/* Details Grid */}
        <div className={styles.drawerDetailsGrid}>
          <div className={styles.drawerDetailCard}>
            <span className={styles.drawerDetailLabel}>رقم الهاتف:</span>
            <span
              className={styles.drawerDetailVal}
              style={{ direction: "ltr", textAlign: "right" }}
            >
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
            <span
              className={styles.drawerDetailVal}
              style={{ direction: "ltr", textAlign: "right", fontSize: "0.8rem" }}
            >
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
              <button
                type="button"
                onClick={handleWhatsAppSend}
                className={styles.drawerBtnWhatsApp}
                title={
                  student.isApproved === true
                    ? "تحميل ونسخ رمز الـ QR ثم فتح محادثة الواتساب"
                    : "إرسال رسالة عبر واتساب"
                }
              >
                <MessageCircle size={14} />
                <span>إرسال واتساب</span>
              </button>
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
  );
};

export default StudentDrawer;

