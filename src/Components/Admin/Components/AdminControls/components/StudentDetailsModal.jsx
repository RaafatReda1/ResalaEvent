import React, { useState, useRef } from "react";
import {
  X,
  Check,
  Clock,
  MessageCircle,
  FileText,
  Phone,
  Mail,
  Building2,
  GraduationCap,
  MapPin,
  Calendar,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ExternalLink,
  Copy,
  CheckCheck,
  Move,
  RotateCcw,
} from "lucide-react";
import { generateWhatsAppApprovalLink } from "@/utils/adminStudentActions";
import styles from "../AdminControls.module.css";

const StudentDetailsModal = ({
  isOpen = false,
  onClose,
  student = null,
  onApprovalChange,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen || !student) return null;

  const whatsAppLink = generateWhatsAppApprovalLink(student);

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

  // Zoom & Rotation controls
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.3, 4));
  const handleZoomOut = () =>
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.3, 0.6);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return next;
    });

  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleResetImage = () => {
    setZoomLevel(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    setZoomLevel((prev) => {
      const next = Math.min(Math.max(prev + delta, 0.6), 4);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  // Touch handlers for mobile / tablets
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStartRef.current.x,
      y: e.touches[0].clientY - dragStartRef.current.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalIconBox}>
              <FileText size={22} />
            </div>
            <div>
              <h2 className={styles.modalTitle}>{student.name || "تفاصيل الطالب"}</h2>
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

        {/* Certificate Document Viewer with Drag & Move */}
        <div className={styles.modalCertSection}>
          <div className={styles.modalCertHeader}>
            <div className={styles.modalCertTitle}>
              <FileText size={16} />
              <span>معاينة شهادة القيد / بطاقة الترشيح:</span>
              <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600, marginRight: "8px" }}>
                (اسحب الصورة للتحريك ✋ أو استخدم عجلة الماوس للتكبير)
              </span>
            </div>

            {student.imgSrc && (
              <div className={styles.modalToolbar}>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className={styles.modalToolBtn}
                  title="تكبير (+)"
                >
                  <ZoomIn size={15} />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className={styles.modalToolBtn}
                  title="تصغير (-)"
                >
                  <ZoomOut size={15} />
                </button>
                <button
                  type="button"
                  onClick={handleRotate}
                  className={styles.modalToolBtn}
                  title="تدوير 90 درجة"
                >
                  <RotateCw size={15} />
                </button>
                <button
                  type="button"
                  onClick={handleResetImage}
                  className={styles.modalToolBtn}
                  style={{ fontSize: "0.75rem", fontWeight: 700, gap: "4px" }}
                  title="إعادة للوضع الافتراضي"
                >
                  <RotateCcw size={13} />
                  <span>إعادة ضبط</span>
                </button>
              </div>
            )}
          </div>

          {student.imgSrc ? (
            <div
              className={styles.modalCertViewer}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
              style={{
                cursor: isDragging ? "grabbing" : "grab",
                userSelect: "none",
                touchAction: "none",
              }}
            >
              <img
                src={student.imgSrc}
                alt="شهادة الطالب"
                draggable={false}
                className={styles.modalCertImg}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel}) rotate(${rotation}deg)`,
                  transition: isDragging ? "none" : "transform 0.15s ease-out",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "rgba(0, 0, 0, 0.6)",
                  color: "#ffffff",
                  fontSize: "0.72rem",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  pointerEvents: "none",
                }}
              >
                <Move size={12} />
                <span>{Math.round(zoomLevel * 100)}%</span>
              </div>

              <a
                href={student.imgSrc}
                target="_blank"
                rel="noreferrer"
                className={styles.modalCertFullLink}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={13} />
                <span>فتح بجودة أصلية</span>
              </a>
            </div>
          ) : (
            <div className={styles.noCertBox}>
              <FileText size={32} />
              <span>لم يتم إرفاق صورة شهادة أو كارنيه</span>
            </div>
          )}
        </div>

        {/* Student Info Grid */}
        <div className={styles.modalInfoGrid}>
          {/* Phone */}
          <div className={styles.modalInfoCard}>
            <div className={styles.modalInfoLabel}>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Phone size={12} />
                <span>رقم الهاتف:</span>
              </span>
            </div>
            <div className={styles.modalInfoVal} style={{ direction: "ltr", textAlign: "right" }}>
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
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#64748b" }}
                title="نسخ البريد"
              >
                {copiedEmail ? <CheckCheck size={13} color="#0d9488" /> : <Copy size={13} />}
              </button>
            </div>
            <div className={styles.modalInfoVal} style={{ direction: "ltr", textAlign: "right", fontSize: "0.8rem" }}>
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

          {/* Date */}
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

        {/* Modal Action Footer */}
        <div className={styles.modalFooterActions}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
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
