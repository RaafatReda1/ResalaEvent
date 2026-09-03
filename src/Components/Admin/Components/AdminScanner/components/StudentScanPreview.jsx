import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  User,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Calendar,
  MessageCircle,
  RotateCcw,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  ZoomIn,
  Copy,
  Check,
} from "lucide-react";
import { formatArabicDateTime, getRelativeArabicTime } from "../utils/scannerHelpers";
import styles from "./StudentScanPreview.module.css";

const StudentScanPreview = ({
  student,
  rawScannedCode,
  isNotFound,
  isLoading,
  onConfirmAttendance,
  onResetAttendance,
  onToggleApproval,
  onOpenFullRecord,
  onScanNext,
  autoNextActive,
  autoNextSecondsRemaining,
  isProcessingAction,
  adminName,
}) => {
  const [isPhotoZoomed, setIsPhotoZoomed] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    if (!rawScannedCode) return;
    navigator.clipboard.writeText(rawScannedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className={styles.previewCard}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <h3 className={styles.loadingTitle}>جاري فحص التذكرة والبحث في قاعدة البيانات...</h3>
          <p className={styles.loadingSub}>التحقق من صحة الكود وتفاصيل تسجيل الطالب</p>
        </div>
      </div>
    );
  }

  // 2. Not Found State
  if (isNotFound) {
    return (
      <div className={`${styles.previewCard} ${styles.cardNotFound}`}>
        <div className={styles.notFoundHeader}>
          <div className={styles.iconCircleRed}>
            <XCircle size={36} />
          </div>
          <h3 className={styles.notFoundTitle}>كود غير مسجل في قاعدة البيانات!</h3>
          <p className={styles.notFoundDesc}>
            لم يتم العثور على أي طالب مسجل بهذا الكود أو المعرّف. تأكد من صحة التذكرة أو ابحث برقم الهاتف.
          </p>
        </div>

        {rawScannedCode && (
          <div className={styles.rawCodeBox}>
            <span className={styles.rawCodeLabel}>الكود المقروء:</span>
            <code className={styles.rawCodeText}>{rawScannedCode}</code>
            <button
              type="button"
              onClick={handleCopyCode}
              className={styles.copyBtn}
              title="نسخ الكود"
            >
              {copiedCode ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        )}

        <div className={styles.cardFooterActions}>
          <button
            type="button"
            onClick={onScanNext}
            className={styles.primaryScanNextBtn}
          >
            <ArrowRight size={18} />
            <span>مسح كود آخر الآن</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. Idle State (No scan yet)
  if (!student) {
    return (
      <div className={`${styles.previewCard} ${styles.cardIdle}`}>
        <div className={styles.idleIllustration}>
          <div className={styles.idleIconPulse}>
            <ShieldCheck size={48} className={styles.idleShield} />
          </div>
          <h3 className={styles.idleTitle}>في انتظار مسح التذكرة...</h3>
          <p className={styles.idleDesc}>
            وجّه كاميرا الهاتف نحو رمز QR المطبوع أو المعروض على هاتف الطالب. سيتم عرض كافة بياناته وحالته فوراً.
          </p>
        </div>

        <div className={styles.idleTips}>
          <div className={styles.tipItem}>
            <span className={styles.tipDot} />
            <span>تنبيه فوري عند تكرار مسح التذكرة مسبقاً لمنع الدخول المزدوج.</span>
          </div>
          <div className={styles.tipItem}>
            <span className={styles.tipDot} />
            <span>يمكنك تسجيل الحضور بنقرة واحدة أو تفعيل ميزة الانتقال التلقائي.</span>
          </div>
          <div className={styles.tipItem}>
            <span className={styles.tipDot} />
            <span>في حال تعذر قراءة الكود، استخدم شريط البحث اليدوي أسفل الكاميرا.</span>
          </div>
        </div>
      </div>
    );
  }

  // 4. Student Found State
  const isAccepted = student.isApproved === true;
  const isPending = student.isApproved === null;
  const isRejected = student.isApproved === false;
  const hasAlreadyScanned = Boolean(student.hasScannedQr);

  const cleanPhone = student.phone ? String(student.phone).replace(/[^0-9]/g, "") : "";
  const formattedWhatsAppPhone = cleanPhone.startsWith("0")
    ? `2${cleanPhone}`
    : cleanPhone;

  return (
    <div className={styles.previewCard}>
      {/* ── Status Banner (Already Scanned Warning vs Valid First-time Pass) ── */}
      {hasAlreadyScanned ? (
        <div className={styles.warningBanner}>
          <div className={styles.bannerIconWrapAmber}>
            <AlertTriangle size={24} />
          </div>
          <div className={styles.bannerText}>
            <div className={styles.bannerTitleRow}>
              <h4 className={styles.bannerTitleAmber}>
                ⚠️ تنبيه: تم مسح هذا الكود مسبقاً!
              </h4>
              <span className={styles.usedPassBadge}>تذكرة مستخدمة</span>
            </div>
            <p className={styles.bannerSubAmber}>
              سُجّل الدخول بتاريخ: <strong>{formatArabicDateTime(student.scannedAt)}</strong>
              {student.scannedAt && (
                <span className={styles.relativeTimeBadge}>
                  ({getRelativeArabicTime(student.scannedAt)})
                </span>
              )}
              {student.adminScanner && (
                <span> • المشرف: <strong>{student.adminScanner}</strong></span>
              )}
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.successBanner}>
          <div className={styles.bannerIconWrapGreen}>
            <CheckCircle2 size={24} />
          </div>
          <div className={styles.bannerText}>
            <div className={styles.bannerTitleRow}>
              <h4 className={styles.bannerTitleGreen}>
                🎉 تذكرة صالحة - لم يتم مسحها من قبل!
              </h4>
              <span className={styles.validPassBadge}>دخول لأول مرة</span>
            </div>
            <p className={styles.bannerSubGreen}>
              جاهز لتسجيل الحضور وتأكيد دخول الطالب للحدث.
            </p>
          </div>
        </div>
      )}

      {/* ── Student Profile Header ── */}
      <div className={styles.studentProfileHeader}>
        <div className={styles.avatarSection}>
          {student.imgSrc ? (
            <div
              className={styles.avatarWrapClickable}
              onClick={() => setIsPhotoZoomed(true)}
              title="انقر لتكبير صورة الكارنيه / الصورة الشخصية"
            >
              <img
                src={student.imgSrc}
                alt={student.name || "صورة الطالب"}
                className={styles.avatarImg}
              />
              <div className={styles.zoomHoverOverlay}>
                <ZoomIn size={16} />
              </div>
            </div>
          ) : (
            <div className={styles.avatarFallback}>
              <User size={30} />
            </div>
          )}
        </div>

        <div className={styles.profileTextInfo}>
          <div className={styles.nameRow}>
            <h3 className={styles.studentName}>{student.name || "طالب غير مسمى"}</h3>
            {/* Approval Badge */}
            {isAccepted && (
              <span className={styles.badgeAccepted}>
                <CheckCircle2 size={13} />
                <span>مقبول بالحدث</span>
              </span>
            )}
            {isPending && (
              <span className={styles.badgePending}>
                <Clock size={13} />
                <span>قيد المراجعة</span>
              </span>
            )}
            {isRejected && (
              <span className={styles.badgeRejected}>
                <XCircle size={13} />
                <span>مرفوض</span>
              </span>
            )}
          </div>

          <div className={styles.quickDetailsRow}>
            {student.university && (
              <div className={styles.metaChip}>
                <GraduationCap size={14} className={styles.chipIcon} />
                <span>{student.university}</span>
                {student.academicYear && (
                  <span className={styles.yearSub}>({student.academicYear})</span>
                )}
              </div>
            )}

            {student.place && (
              <div className={styles.metaChip}>
                <MapPin size={14} className={styles.chipIcon} />
                <span>{student.place}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Student Contact & Registration Info Grid ── */}
      <div className={styles.detailsGrid}>
        {student.phone && (
          <div className={styles.detailItem}>
            <Phone size={15} className={styles.detailIcon} />
            <span className={styles.detailLabel}>الهاتف:</span>
            <span className={styles.detailVal}>{student.phone}</span>
            <a
              href={`https://wa.me/${formattedWhatsAppPhone}?text=${encodeURIComponent(
                `السلام عليكم د. ${student.name || ""}، بخصوص حضورك في إيفنت ما وراء الطب.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappIconBtn}
              title="محادثة واتساب سريعة"
            >
              <MessageCircle size={15} />
            </a>
          </div>
        )}

        {student.email && (
          <div className={styles.detailItem}>
            <Mail size={15} className={styles.detailIcon} />
            <span className={styles.detailLabel}>البريد:</span>
            <span className={styles.detailVal} title={student.email}>
              {student.email}
            </span>
          </div>
        )}

        <div className={styles.detailItem}>
          <Calendar size={15} className={styles.detailIcon} />
          <span className={styles.detailLabel}>تاريخ التقديم:</span>
          <span className={styles.detailVal}>
            {formatArabicDateTime(student.created_at)}
          </span>
        </div>

        <div className={styles.detailItem}>
          <ShieldCheck size={15} className={styles.detailIcon} />
          <span className={styles.detailLabel}>حالة الدخول:</span>
          <span
            className={
              hasAlreadyScanned ? styles.statusScannedText : styles.statusNotScannedText
            }
          >
            {hasAlreadyScanned ? "مسجل حضور بالفعل" : "لم يسجل الحضور بعد"}
          </span>
        </div>
      </div>

      {/* ── Auto Next Countdown Progress Bar (if active) ── */}
      {autoNextActive && autoNextSecondsRemaining > 0 && (
        <div className={styles.autoNextBar}>
          <div className={styles.autoNextText}>
            <span>سيتم مسح الطالب التالي تلقائياً خلال:</span>
            <strong>{autoNextSecondsRemaining} ثانية</strong>
          </div>
          <button
            type="button"
            onClick={onScanNext}
            className={styles.skipWaitBtn}
          >
            مسح الآن دون انتظار
          </button>
        </div>
      )}

      {/* ── Interactive Action Buttons Bar ── */}
      <div className={styles.actionsBar}>
        {/* Check-In / Mark Attended Button */}
        {!hasAlreadyScanned ? (
          <button
            type="button"
            disabled={isProcessingAction}
            onClick={() => onConfirmAttendance(student.id)}
            className={styles.confirmAttendanceBtn}
          >
            <CheckCircle2 size={18} />
            <span>تسجيل حضور الطالب الآن</span>
          </button>
        ) : (
          <button
            type="button"
            disabled={isProcessingAction}
            onClick={() => onResetAttendance(student.id)}
            className={styles.undoAttendanceBtn}
            title="إلغاء تسجيل الحضور وإعادة التذكرة كأنها لم تُمسح"
          >
            <RotateCcw size={17} />
            <span>إلغاء تسجيل الحضور (إعادة ضبط)</span>
          </button>
        )}

        {/* Change Approval Status fast button if not approved */}
        {!isAccepted && (
          <button
            type="button"
            disabled={isProcessingAction}
            onClick={() => onToggleApproval(student.id, true)}
            className={styles.quickApproveBtn}
            title="الموافقة على الطالب وتأكيد قبوله بالحدث"
          >
            <Check size={16} />
            <span>قبول الطالب فوراً</span>
          </button>
        )}

        {/* View Full Record Modal */}
        <button
          type="button"
          onClick={() => onOpenFullRecord(student)}
          className={styles.viewRecordBtn}
          title="عرض السجل الكامل وتفاصيل الاستمارة والشهادات"
        >
          <ExternalLink size={16} />
          <span>سجل الطالب الكامل</span>
        </button>

        {/* Scan Next Student */}
        <button
          type="button"
          onClick={onScanNext}
          className={styles.scanNextBtn}
          title="إنهاء مراجعة هذا الطالب والانتقال لمسح التالي"
        >
          <ArrowRight size={17} />
          <span>مسح الطالب التالي</span>
        </button>
      </div>

      {/* ── Lightbox Modal for Student Photo Zoom ── */}
      {isPhotoZoomed && (
        <div
          className={styles.zoomBackdrop}
          onClick={() => setIsPhotoZoomed(false)}
        >
          <div className={styles.zoomContainer}>
            <img
              src={student.imgSrc}
              alt="صورة مكبرة"
              className={styles.zoomedImg}
            />
            <button
              type="button"
              className={styles.closeZoomBtn}
              onClick={() => setIsPhotoZoomed(false)}
            >
              <XCircle size={28} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentScanPreview;
