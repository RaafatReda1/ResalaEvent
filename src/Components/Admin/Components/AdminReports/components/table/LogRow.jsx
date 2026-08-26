import React from "react";
import {
  Crown,
  Shield,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Key,
  FileText,
  Settings,
  Link2,
  Ghost,
} from "lucide-react";
import styles from "../../AdminReports.module.css";

const LogRow = ({
  log,
  isExpanded = false,
  isSudoAdmin = false,
  onToggleExpand,
  onOpenDetails,
  onOpenDelete,
}) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#1e293b" }}>
            {d.toLocaleDateString("ar-EG", { day: "numeric", month: "long" })}
          </span>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600, direction: "ltr", textAlign: "right" }}>
            {d.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </div>
      );
    } catch {
      return dateStr;
    }
  };

  // Resolve Role Avatar & Colors
  const getRoleInfo = (role) => {
    switch (role) {
      case "sudo_admin":
        return {
          label: "مسؤول رئيسي Sudo",
          badgeClass: styles.roleSudo,
          icon: <Crown size={12} />,
          avatarBg: "#fef3c7",
          avatarColor: "#b45309",
          avatarInitial: "👑",
        };
      case "admin":
        return {
          label: "مشرف",
          badgeClass: styles.roleAdmin,
          icon: <Shield size={12} />,
          avatarBg: "#e0f2fe",
          avatarColor: "#0369a1",
          avatarInitial: "م",
        };
      default:
        // anonymous — public visitor with no session
        if (role === "anonymous") {
          return {
            label: "زائر غير معروف",
            badgeClass: styles.roleAnonymous,
            icon: <Ghost size={12} />,
            avatarBg: "#f8fafc",
            avatarColor: "#94a3b8",
            avatarInitial: "?",
          };
        }
        return {
          label: "طالب",
          badgeClass: styles.roleStudent,
          icon: <GraduationCap size={12} />,
          avatarBg: "#f1f5f9",
          avatarColor: "#475569",
          avatarInitial: "ط",
        };
    }
  };

  // Resolve Category Badge
  const getCategoryBadge = (cat, type) => {
    if (type?.includes("DELETE") || type?.includes("PURGE")) {
      return (
        <span className={`${styles.actionBadge} ${styles.badgeDanger}`}>
          <AlertTriangle size={12} />
          <span>حذف / إزالة</span>
        </span>
      );
    }
    if (cat === "AUTH") {
      return (
        <span className={`${styles.actionBadge} ${styles.badgeAuth}`}>
          <Key size={12} />
          <span>دخول / خروج</span>
        </span>
      );
    }
    if (cat === "STUDENT_ACTION") {
      return (
        <span className={`${styles.actionBadge} ${styles.badgeStudent}`}>
          <GraduationCap size={12} />
          <span>استمارة طالب</span>
        </span>
      );
    }
    if (cat === "SETTINGS") {
      return (
        <span className={`${styles.actionBadge} ${styles.badgeSettings}`}>
          <Settings size={12} />
          <span>إعدادات النظام</span>
        </span>
      );
    }
    if (cat === "LINK_CLICK") {
      return (
        <span className={`${styles.actionBadge} ${styles.badgeLinkClick}`}>
          <Link2 size={12} />
          <span>نقر رابط</span>
        </span>
      );
    }
    return (
      <span className={`${styles.actionBadge} ${styles.badgeAdmin}`}>
        <FileText size={12} />
        <span>إجراء إشرافي</span>
      </span>
    );
  };

  const roleInfo = getRoleInfo(log.actor_role);

  return (
    <tr
      className={`${styles.logRow} ${isExpanded ? styles.logRowExpanded : ""}`}
      onClick={onToggleExpand}
    >
      {/* 1. Timestamp */}
      <td style={{ whiteSpace: "nowrap" }}>
        {formatDate(log.created_at)}
      </td>

      {/* 2. Actor Cell */}
      <td>
        <div className={styles.actorCell}>
          <div
            className={styles.actorAvatar}
            style={{ background: roleInfo.avatarBg, color: roleInfo.avatarColor }}
          >
            {roleInfo.avatarInitial}
          </div>
          <div className={styles.actorDetails}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className={styles.actorName}>
                {log.actor_name || "مستخدم غير مسمى"}
              </span>
              <span className={`${styles.roleBadge} ${roleInfo.badgeClass}`}>
                {roleInfo.icon}
                <span>{roleInfo.label}</span>
              </span>
            </div>
            <span className={styles.actorEmail}>{log.actor_email || "—"}</span>
          </div>
        </div>
      </td>

      {/* 3. Category & Action Type */}
      <td>{getCategoryBadge(log.action_category, log.action_type)}</td>

      {/* 4. Description with proper text direction */}
      <td style={{ direction: "rtl", textAlign: "right" }}>
        <span
          style={{
            fontSize: "0.84rem",
            fontWeight: 700,
            color: "#1e293b",
            lineHeight: "1.5",
            display: "inline-block",
          }}
          dir="rtl"
        >
          {log.description}
        </span>
      </td>

      {/* 5. Target Entity */}
      <td>
        {log.target_name ? (
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 800,
              background: "#f1f5f9",
              color: "#334155",
              padding: "4px 8px",
              borderRadius: "6px",
              display: "inline-block",
            }}
          >
            {log.target_name}
          </span>
        ) : (
          <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>—</span>
        )}
      </td>

      {/* 6. Quick Actions */}
      <td onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}>
          {/* Eye View Details */}
          <button
            type="button"
            className={styles.btnSecondary}
            style={{ padding: "5px 8px" }}
            onClick={() => onOpenDetails(log)}
            title="معاينة كامل تفاصيل السجل"
          >
            <Eye size={13} />
          </button>

          {/* Sudo Delete Single Log */}
          {isSudoAdmin && (
            <button
              type="button"
              className={styles.btnDanger}
              style={{ padding: "5px 8px" }}
              onClick={() => onOpenDelete(log)}
              title="حذف هذا السجل (صلاحية Sudo Admin)"
            >
              <Trash2 size={13} />
            </button>
          )}

          {/* Toggle Expand Arrow */}
          <button
            type="button"
            className={styles.btnSecondary}
            style={{ padding: "5px 8px" }}
            onClick={onToggleExpand}
            title={isExpanded ? "طي التفاصيل" : "عرض ملخص الإجراء"}
          >
            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default LogRow;
