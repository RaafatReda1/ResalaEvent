import React from "react";
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  VolumeX,
  Zap,
  Timer,
  RefreshCw,
  QrCode,
} from "lucide-react";
import styles from "./ScannerStatsHeader.module.css";

const ScannerStatsHeader = ({
  totalScannedCount,
  totalApprovedCount,
  sessionScansCount,
  duplicatesBlockedCount,
  soundEnabled,
  onToggleSound,
  autoCheckIn,
  onToggleAutoCheckIn,
  autoNext,
  onToggleAutoNext,
  onRefreshStats,
  isRefreshing,
}) => {
  return (
    <div className={styles.statsHeaderContainer}>
      {/* ── KPI Metric Cards ── */}
      <div className={styles.kpiCardsRow}>
        {/* Metric 1: Total Checked In */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrapTeal}>
            <CheckCircle2 size={20} />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>الحضور المؤكد (اليوم)</span>
            <span className={styles.kpiValueTeal}>{totalScannedCount}</span>
          </div>
        </div>

        {/* Metric 2: Total Approved in DB */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrapBlue}>
            <Users size={20} />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>إجمالي المقبولين</span>
            <span className={styles.kpiValueBlue}>{totalApprovedCount}</span>
          </div>
        </div>

        {/* Metric 3: Scans in this Session */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrapCyan}>
            <QrCode size={20} />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>مسح الجلسة الحالية</span>
            <span className={styles.kpiValueCyan}>{sessionScansCount}</span>
          </div>
        </div>

        {/* Metric 4: Duplicate Passes Caught */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrapAmber}>
            <AlertTriangle size={20} />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>تكرار تم رصده</span>
            <span className={styles.kpiValueAmber}>{duplicatesBlockedCount}</span>
          </div>
        </div>
      </div>

      {/* ── Settings & Fast Controls Bar ── */}
      <div className={styles.settingsRow}>
        <div className={styles.togglesGroup}>
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className={`${styles.togglePill} ${soundEnabled ? styles.pillActive : ""}`}
            title={soundEnabled ? "كتم المؤثرات الصوتية" : "تفعيل التنبيهات الصوتية"}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{soundEnabled ? "الصوت مفعل" : "صامت"}</span>
          </button>

          {/* Auto Check-in Toggle */}
          <button
            type="button"
            onClick={onToggleAutoCheckIn}
            className={`${styles.togglePill} ${autoCheckIn ? styles.pillActive : ""}`}
            title="تسجيل الحضور تلقائياً فور قراءة التذكرة الصحيحة"
          >
            <Zap size={16} />
            <span>{autoCheckIn ? "حضور تلقائي: مفعّل" : "حضور تلقائي: يدوي"}</span>
          </button>

          {/* Auto Next Toggle */}
          <button
            type="button"
            onClick={onToggleAutoNext}
            className={`${styles.togglePill} ${autoNext ? styles.pillActive : ""}`}
            title="إعادة تشغيل الكاميرا تلقائياً بعد 3 ثوانٍ لمسح الطالب التالي"
          >
            <Timer size={16} />
            <span>{autoNext ? "انتقال تلقائي (3ث)" : "انتقال يدوي"}</span>
          </button>
        </div>

        {/* Refresh Stats */}
        <button
          type="button"
          onClick={onRefreshStats}
          disabled={isRefreshing}
          className={styles.refreshBtn}
          title="تحديث الإحصائيات"
        >
          <RefreshCw size={15} className={isRefreshing ? styles.spinIcon : ""} />
          <span className={styles.refreshBtnText}>تحديث العداد</span>
        </button>
      </div>
    </div>
  );
};

export default ScannerStatsHeader;
