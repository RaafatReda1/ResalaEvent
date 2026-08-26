import React from "react";
import {
  FileText,
  ExternalLink,
  Check,
  Clock,
  X,
  MessageCircle,
  Edit2,
  Trash2,
} from "lucide-react";
import { generateCustomWhatsAppLink } from "@/utils/whatsAppTemplateManager";
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
  if (!student) return null;

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
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noreferrer"
                className={styles.drawerBtnWhatsApp}
                title="إرسال رسالة القبول المخصصة عبر واتساب"
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
  );
};

export default StudentDrawer;
