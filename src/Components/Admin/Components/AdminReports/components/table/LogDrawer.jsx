import React, { useState } from "react";
import {
  Laptop,
  Clock,
  User,
  Activity,
  Code2,
  ChevronDown,
  ChevronUp,
  Globe,
  MapPin,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Copy,
  CheckCheck,
} from "lucide-react";
import styles from "../../AdminReports.module.css";

const LogDrawer = ({ log }) => {
  const [showRawJson, setShowRawJson] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!log) return null;

  const client = log.metadata?.client || {};
  const metadataWithoutClient = { ...log.metadata };
  delete metadataWithoutClient.client;
  delete metadataWithoutClient.timestamp;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(log.metadata || {}, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert technical platform/browser names to friendly Arabic labels
  const getDeviceLabel = (platform = "") => {
    const p = platform.toLowerCase();
    if (p.includes("win")) return "كمبيوتر (Windows)";
    if (p.includes("mac")) return "ماك (MacBook / Apple)";
    if (p.includes("iphone") || p.includes("ipad")) return "هاتف آيفون (iOS)";
    if (p.includes("android") || p.includes("linux")) return "هاتف أندرويد";
    return platform || "جهاز مكتبي";
  };

  // Map route URLs to Arabic readable names
  const getPageName = (url = "") => {
    if (url.includes("students")) return "صفحة إدارة وقبول الطلاب";
    if (url.includes("reports")) return "صفحة التقارير وسجل الرقابة";
    if (url.includes("dashboard")) return "لوحة الإحصائيات العامة";
    if (url === "/" || url === "") return "استمارة التسجيل الرئيسية";
    return url;
  };

  return (
    <div className={styles.drawerContainer}>
      {/* 1. Human-Readable Activity Summary Banner */}
      <div className={styles.drawerSummaryBanner}>
        <div className={styles.drawerSummaryIcon}>
          <Activity size={20} />
        </div>
        <div className={styles.drawerSummaryText}>
          <span className={styles.drawerSummaryTitle}>ملخص تفاصيل الإجراء:</span>
          <p className={styles.drawerSummaryDesc}>
            {log.description}
          </p>
        </div>
      </div>

      {/* 2. Structured Clean Info Cards Grid */}
      <div className={styles.drawerGrid}>
        {/* Device & Browser */}
        <div className={styles.drawerCard}>
          <div className={styles.drawerCardHeader}>
            <Laptop size={15} color="#0d9488" />
            <span className={styles.drawerCardLabel}>الجهاز والمتصفح</span>
          </div>
          <span className={styles.drawerCardVal}>
            {getDeviceLabel(client.platform)} • {client.browser || "Chrome"}
          </span>
        </div>

        {/* Action Location / Page */}
        <div className={styles.drawerCard}>
          <div className={styles.drawerCardHeader}>
            <Globe size={15} color="#0284c7" />
            <span className={styles.drawerCardLabel}>الموقع داخل المنصة</span>
          </div>
          <span className={styles.drawerCardVal}>
            {getPageName(client.url)}
          </span>
        </div>

        {/* Target Entity */}
        <div className={styles.drawerCard}>
          <div className={styles.drawerCardHeader}>
            <User size={15} color="#7c3aed" />
            <span className={styles.drawerCardLabel}>الطالب / الحساب المستهدف</span>
          </div>
          <span className={styles.drawerCardVal}>
            {log.target_name || (log.target_id ? `طالب رقم #${log.target_id}` : "إعدادات النظام العامة")}
          </span>
        </div>

        {/* Exact Time */}
        <div className={styles.drawerCard}>
          <div className={styles.drawerCardHeader}>
            <Clock size={15} color="#d97706" />
            <span className={styles.drawerCardLabel}>التوقيت بالتفصيل</span>
          </div>
          <span className={styles.drawerCardVal} style={{ direction: "ltr", textAlign: "right" }}>
            {new Date(log.created_at).toLocaleTimeString("ar-EG", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}{" "}
            ({new Date(log.created_at).toLocaleDateString("ar-EG", { day: "numeric", month: "long" })})
          </span>
        </div>
      </div>

      {/* 3. Optional Additional Metadata Diff (if any) */}
      {Object.keys(metadataWithoutClient).length > 0 && (
        <div className={styles.metadataPillsWrapper}>
          <span style={{ fontSize: "0.76rem", fontWeight: 800, color: "#475569" }}>
            البيانات المرفقة بالعملية:
          </span>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {Object.entries(metadataWithoutClient).map(([key, val]) => (
              <span key={key} className={styles.metaPill}>
                <strong>{key}:</strong> {typeof val === "object" ? JSON.stringify(val) : String(val)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4. Collapsible Developer Raw JSON (Hidden by default for clean UX) */}
      <div style={{ marginTop: "4px" }}>
        <button
          type="button"
          className={styles.toggleJsonBtn}
          onClick={() => setShowRawJson(!showRawJson)}
        >
          <Code2 size={14} />
          <span>{showRawJson ? "إخفاء التفاصيل البرمجية (JSON)" : "عرض التفاصيل البرمجية المتقدمة (JSON للمطورين)"}</span>
          {showRawJson ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showRawJson && (
          <div style={{ marginTop: "8px", position: "relative" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#1e293b",
                padding: "6px 12px",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 700 }}>
                Raw Audit Metadata
              </span>
              <button
                type="button"
                onClick={handleCopyJson}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#38bdf8",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {copied ? (
                  <>
                    <CheckCheck size={12} color="#4ade80" />
                    <span style={{ color: "#4ade80" }}>تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>نسخ</span>
                  </>
                )}
              </button>
            </div>
            <pre className={styles.jsonCodeBox} style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
              {JSON.stringify(log.metadata || {}, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogDrawer;
