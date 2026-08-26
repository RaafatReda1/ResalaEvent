import React, { useState } from "react";
import {
  Phone,
  Mail,
  Building2,
  GraduationCap,
  MapPin,
  Calendar,
  Copy,
  CheckCheck,
} from "lucide-react";
import styles from "../../AdminControls.module.css";

const StudentInfoGrid = ({ student }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!student) return null;

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

  const handleCopyEmail = () => {
    if (!student.email) return;
    navigator.clipboard.writeText(student.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className={styles.modalInfoGrid}>
      {/* Phone */}
      <div className={styles.modalInfoCard}>
        <div className={styles.modalInfoLabel}>
          <span style={{ display: "flex", alignitems: "center", gap: "4px" }}>
            <Phone size={12} />
            <span>رقم الهاتف:</span>
          </span>
        </div>
        <div
          className={styles.modalInfoVal}
          style={{ direction: "ltr", textAlign: "right" }}
        >
          {student.phone || "—"}
        </div>
      </div>

      {/* Email */}
      <div className={styles.modalInfoCard}>
        <div className={styles.modalInfoLabel}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Mail size={12} />
            <span>البريد الإلكتروني:</span>
          </span>
          <button
            type="button"
            onClick={handleCopyEmail}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#64748b",
            }}
            title="نسخ البريد"
          >
            {copiedEmail ? (
              <CheckCheck size={13} color="#0d9488" />
            ) : (
              <Copy size={13} />
            )}
          </button>
        </div>
        <div
          className={styles.modalInfoVal}
          style={{ direction: "ltr", textAlign: "right", fontSize: "0.8rem" }}
        >
          {student.email || "—"}
        </div>
      </div>

      {/* University */}
      <div className={styles.modalInfoCard}>
        <div className={styles.modalInfoLabel}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Building2 size={12} />
            <span>الجامعة / الكلية:</span>
          </span>
        </div>
        <div className={styles.modalInfoVal}>
          {student.university || "—"}
        </div>
      </div>

      {/* Academic Year */}
      <div className={styles.modalInfoCard}>
        <div className={styles.modalInfoLabel}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <GraduationCap size={12} />
            <span>الفرقة الدراسية:</span>
          </span>
        </div>
        <div className={styles.modalInfoVal}>
          {student.academicYear || "—"}
        </div>
      </div>

      {/* Place */}
      <div className={styles.modalInfoCard}>
        <div className={styles.modalInfoLabel}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <MapPin size={12} />
            <span>نقطة التجمع:</span>
          </span>
        </div>
        <div className={styles.modalInfoVal}>
          {student.place || "—"}
        </div>
      </div>

      {/* Registration Date */}
      <div className={styles.modalInfoCard}>
        <div className={styles.modalInfoLabel}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Calendar size={12} />
            <span>تاريخ التسجيل:</span>
          </span>
        </div>
        <div className={styles.modalInfoVal} style={{ fontSize: "0.8rem" }}>
          {formatDate(student.created_at)}
        </div>
      </div>
    </div>
  );
};

export default StudentInfoGrid;
