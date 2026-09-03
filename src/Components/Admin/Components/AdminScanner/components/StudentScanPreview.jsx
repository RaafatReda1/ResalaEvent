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
  Shield,
  Building2,
  ScanLine,
  Hash,
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

  // ── Loading State ──
  if (isLoading) {
    return (
      <div className={styles.previewCard}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingPulse}>
            <ScanLine size={28} />
          </div>
          <h3 className={styles.loadingTitle}>جاري فحص التذكرة...</h3>
          <p className={styles.loadingSub}>التحقق من قاعدة البيانات وبيانات التسجيل</p>
          <div className={styles.loadingDots}>
            <span /><span /><span />
          </div>
        </div>
      </div>
    );
  }

  // ── Not Found State ──
  if (isNotFound) {
    return (
      <div className={`${styles.previewCard} ${styles.cardNotFound}`}>
        <div className={styles.notFoundHeader}>
          <div className={styles.iconCircleRed}>
            <XCircle size={32} />
          </div>
          <div>
            <h3 className={styles.notFoundTitle}>كود غير مسجل</h3>
            <p className={styles.notFoundDesc}>
              لم يتم العثور على طالب مسجل بهذا الكود. تأكد من التذكرة أو ابحث برقم الهاتف.
            </p>
          </div>
        </div>

        {rawScannedCode && (
          <div className={styles.rawCodeBox}>
            <span className={styles.rawCodeLabel}>الكود المقروء:</span>
            <code className={styles.rawCodeText}>{rawScannedCode}</code>
            <button type="button" onClick={handleCopyCode} className={styles.copyBtn}>
              {copiedCode ? <Check size={13} /> : <Copy size={13} />}
            </button>
          </div>
        )}

        <button type="button" onClick={onScanNext} className={styles.primaryScanNextBtn}>
          <ScanLine size={16} />
          <span>مسح كود آخر</span>
        </button>
      </div>
    );
  }

  // ── Idle State ──
  if (!student) {
    return (
      <div className={`${styles.previewCard} ${styles.cardIdle}`}>
        <div className={styles.idleIconPulse}>
          <ShieldCheck size={40} className={styles.idleShield} />
        </div>
        <h3 className={styles.idleTitle}>في انتظار مسح التذكرة</h3>
        <p className={styles.idleDesc}>
          وجّه الكاميرا نحو رمز QR المعروض على هاتف الطالب وسيتم عرض بياناته فوراً.
        </p>
        <div className={styles.idleTips}>
          {[
            "تنبيه فوري عند مسح تذكرة سبق استخدامها",
            "يمكنك الموافقة على الطالب مباشرة من هذه الشاشة",
            "استخدم شريط البحث أسفل الكاميرا للبحث اليدوي",
          ].map((tip, i) => (
            <div key={i} className={styles.tipItem}>
              <span className={styles.tipDot} />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Student Found ──
  const isAccepted = student.isApproved === true;
  const isPending = student.isApproved === null;
  const isRejected = student.isApproved === false;
  const hasAlreadyScanned = Boolean(student.hasScannedQr);
  const shortId = student.id ? student.id.split("-")[0].toUpperCase() : "";

  const cleanPhone = student.phone ? String(student.phone).replace(/[^0-9]/g, "") : "";
  const waPhone = cleanPhone.startsWith("0") ? `2${cleanPhone}` : cleanPhone;
  const waLink = waPhone
    ? `https://wa.me/${waPhone}?text=${encodeURIComponent(`السلام عليكم د. ${student.name || ""}، بخصوص حضورك في إيفنت ما وراء الطب.`)}`
    : null;

  return (
    <div className={styles.previewCard}>

      {/* ── Status Banner ── */}
      {hasAlreadyScanned ? (
        <div className={styles.warningBanner}>
          <div className={styles.bannerIconWrapAmber}>
            <AlertTriangle size={20} />
          </div>
          <div className={styles.bannerText}>
            <div className={styles.bannerTitleRow}>
              <h4 className={styles.bannerTitleAmber}>تذكرة مستخدمة مسبقاً</h4>
              <span className={styles.usedPassBadge}>مكررة</span>
            </div>
            <p className={styles.bannerSubAmber}>
              سُجّل الدخول:{" "}
              <strong>{formatArabicDateTime(student.scannedAt)}</strong>
              {student.scannedAt && (
                <span className={styles.relativeTimeBadge}>
                  ({getRelativeArabicTime(student.scannedAt)})
                </span>
              )}
              {student.adminScanner && <> · بواسطة <strong>{student.adminScanner}</strong></>}
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.successBanner}>
          <div className={styles.bannerIconWrapGreen}>
            <CheckCircle2 size={20} />
          </div>
          <div className={styles.bannerText}>
            <div className={styles.bannerTitleRow}>
              <h4 className={styles.bannerTitleGreen}>تذكرة صالحة — أول مسح</h4>
              <span className={styles.validPassBadge}>دخول جديد ✓</span>
            </div>
            <p className={styles.bannerSubGreen}>جاهز لتأكيد دخول الطالب للحدث.</p>
          </div>
        </div>
      )}

      {/* ── Student Profile ── */}
      <div className={styles.profileSection}>
        {/* Avatar */}
        <div className={styles.avatarCol}>
          {student.imgSrc ? (
            <div
              className={styles.avatarWrapClickable}
              onClick={() => setIsPhotoZoomed(true)}
              title="تكبير الصورة"
            >
              <img src={student.imgSrc} alt={student.name} className={styles.avatarImg} />
              <div className={styles.zoomOverlay}><ZoomIn size={14} /></div>
            </div>
          ) : (
            <div className={`${styles.avatarFallback} ${isAccepted ? styles.avatarAccepted : isRejected ? styles.avatarRejected : styles.avatarPending}`}>
              <User size={26} />
            </div>
          )}
          {/* Scan status dot on avatar */}
          <div className={`${styles.avatarStatusDot} ${hasAlreadyScanned ? styles.dotUsed : styles.dotFresh}`} />
        </div>

        {/* Info */}
        <div className={styles.profileInfo}>
          {/* Name + Badges row */}
          <div className={styles.nameRow}>
            <h3 className={styles.studentName}>{student.name || "طالب غير مسمى"}</h3>
            {isAccepted && (
              <span className={`${styles.statusPill} ${styles.pillAccepted}`}>
                <CheckCircle2 size={11} /> مقبول
              </span>
            )}
            {isPending && (
              <span className={`${styles.statusPill} ${styles.pillPending}`}>
                <Clock size={11} /> قيد المراجعة
              </span>
            )}
            {isRejected && (
              <span className={`${styles.statusPill} ${styles.pillRejected}`}>
                <XCircle size={11} /> مرفوض
              </span>
            )}
          </div>

          {/* Short ID */}
          <div className={styles.shortIdRow}>
            <Hash size={12} />
            <code className={styles.shortIdCode}>{shortId}</code>
            <button type="button" className={styles.copyIdBtn} onClick={handleCopyCode} title="نسخ الكود">
              {copiedCode ? <Check size={11} /> : <Copy size={11} />}
            </button>
          </div>

          {/* Meta chips */}
          <div className={styles.metaChipsRow}>
            {student.university && (
              <span className={styles.metaChip}>
                <Building2 size={11} />
                {student.university}
                {student.academicYear && <em className={styles.yearSub}> ({student.academicYear})</em>}
              </span>
            )}
            {student.place && (
              <span className={styles.metaChip}>
                <MapPin size={11} />
                {student.place}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Info Grid ── */}
      <div className={styles.infoGrid}>
        {student.phone && (
          <div className={styles.infoCell}>
            <div className={styles.infoCellIcon}><Phone size={13} /></div>
            <div className={styles.infoCellBody}>
              <span className={styles.infoCellLabel}>الهاتف</span>
              <div className={styles.infoCellValueRow}>
                <span className={styles.infoCellValue} dir="ltr">{student.phone}</span>
                {waLink && (
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className={styles.waIconBtn} title="واتساب">
                    <MessageCircle size={13} />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {student.email && (
          <div className={styles.infoCell}>
            <div className={styles.infoCellIcon}><Mail size={13} /></div>
            <div className={styles.infoCellBody}>
              <span className={styles.infoCellLabel}>البريد الإلكتروني</span>
              <span className={styles.infoCellValue} dir="ltr" title={student.email}>
                {student.email}
              </span>
            </div>
          </div>
        )}

        <div className={styles.infoCell}>
          <div className={styles.infoCellIcon}><Calendar size={13} /></div>
          <div className={styles.infoCellBody}>
            <span className={styles.infoCellLabel}>تاريخ التقديم</span>
            <span className={styles.infoCellValue}>{formatArabicDateTime(student.created_at)}</span>
          </div>
        </div>

        <div className={styles.infoCell}>
          <div className={`${styles.infoCellIcon} ${hasAlreadyScanned ? styles.iconGreen : styles.iconGray}`}>
            <Shield size={13} />
          </div>
          <div className={styles.infoCellBody}>
            <span className={styles.infoCellLabel}>حالة الدخول</span>
            <span className={hasAlreadyScanned ? styles.statusGreenText : styles.statusGrayText}>
              {hasAlreadyScanned ? "✓ مسجل حضور بالفعل" : "— لم يُسجَّل بعد"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Auto-Next Countdown Bar ── */}
      {autoNextActive && autoNextSecondsRemaining > 0 && (
        <div className={styles.autoNextBar}>
          <div className={styles.autoNextProgress}>
            <div
              className={styles.autoNextProgressFill}
              style={{ width: `${(autoNextSecondsRemaining / 3) * 100}%` }}
            />
          </div>
          <div className={styles.autoNextText}>
            <span>الانتقال التلقائي للطالب التالي خلال</span>
            <strong>{autoNextSecondsRemaining}s</strong>
          </div>
          <button type="button" onClick={onScanNext} className={styles.skipWaitBtn}>
            تخطى الانتظار
          </button>
        </div>
      )}

      {/* ── Action Buttons ── */}
      <div className={styles.actionsSection}>
        {/* Primary CTA */}
        {!hasAlreadyScanned ? (
          <button
            type="button"
            disabled={isProcessingAction}
            onClick={() => onConfirmAttendance(student.id)}
            className={styles.btnConfirm}
          >
            <CheckCircle2 size={18} />
            <span>تسجيل حضور الطالب الآن</span>
          </button>
        ) : (
          <button
            type="button"
            disabled={isProcessingAction}
            onClick={() => onResetAttendance(student.id)}
            className={styles.btnUndo}
          >
            <RotateCcw size={16} />
            <span>إلغاء تسجيل الحضور</span>
          </button>
        )}

        {/* Secondary Row */}
        <div className={styles.secondaryBtnsRow}>
          {!isAccepted && (
            <button
              type="button"
              disabled={isProcessingAction}
              onClick={() => onToggleApproval(student.id, true)}
              className={styles.btnApprove}
            >
              <Check size={14} />
              <span>قبول الطالب</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenFullRecord(student)}
            className={styles.btnRecord}
          >
            <ExternalLink size={14} />
            <span>السجل الكامل</span>
          </button>

          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnWa}
            >
              <MessageCircle size={14} />
              <span>واتساب</span>
            </a>
          )}

          <button
            type="button"
            onClick={onScanNext}
            className={styles.btnNext}
          >
            <ArrowRight size={14} />
            <span>التالي</span>
          </button>
        </div>
      </div>

      {/* ── Photo Zoom Lightbox ── */}
      {isPhotoZoomed && (
        <div className={styles.zoomBackdrop} onClick={() => setIsPhotoZoomed(false)}>
          <div className={styles.zoomContainer} onClick={(e) => e.stopPropagation()}>
            <img src={student.imgSrc} alt="صورة مكبرة" className={styles.zoomedImg} />
            <button
              type="button"
              className={styles.closeZoomBtn}
              onClick={() => setIsPhotoZoomed(false)}
            >
              <XCircle size={26} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentScanPreview;
