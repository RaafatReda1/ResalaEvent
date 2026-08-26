import { useEffect, useState, useRef } from "react";
import { Bell, LogOut, User, Clock } from "lucide-react";
import { useLocation } from "react-router-dom";
import styles from "./AdminHeader.module.css";
import supabase from "@/utils/supabaseClient";

// Map route paths to Arabic page titles
const PAGE_TITLES = {
  "/dashboard": "لوحة التحكم",
  "/students":  "المسجلين",
  "/reports":   "التقارير",
};

const AdminHeader = () => {
  const location = useLocation();
  const [showNotif, setShowNotif]     = useState(false);
  const [user,      setUser]          = useState(null);
  const [avatarUrl, setAvatarUrl]     = useState(null);
  const [adminName, setAdminName]     = useState("");
  const [isSudo,    setIsSudo]        = useState(false);
  const [pending,   setPending]       = useState([]);
  const notifRef = useRef(null);

  // Derive page title from URL
  const pageTitle =
    Object.entries(PAGE_TITLES).find(([path]) =>
      location.pathname.endsWith(path.replace("/", ""))
    )?.[1] ?? "لوحة التحكم";

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUser(session.user);
      setAvatarUrl(session.user.user_metadata?.avatar_url || null);

      // Fetch admin record for name + sudo flag
      const { data: adminData } = await supabase
        .from("admins")
        .select("name, sudo")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (adminData) {
        setAdminName(adminData.name || session.user.user_metadata?.name || "المشرف");
        setIsSudo(Boolean(adminData.sudo));
      }
    };
    init();
  }, []);

  // Fetch pending students count for the notification badge
  useEffect(() => {
    const fetchPending = async () => {
      const { data } = await supabase
        .from("students")
        .select("id, name, created_at")
        .is("isApproved", null)
        .order("created_at", { ascending: false })
        .limit(10);
      setPending(data || []);
    };
    fetchPending();

    // Realtime subscription for live badge updates
    const channel = supabase
      .channel("pending-students-header")
      .on("postgres_changes", { event: "*", schema: "public", table: "students" },
        () => fetchPending())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const displayName = adminName || user?.user_metadata?.name || "المشرف";
  const roleLabel   = isSudo ? "مسؤول رئيسي (Sudo)" : "مشرف النظام";

  return (
    <header className={styles.header}>
      {/* Left: page title */}
      <div className={styles.leftSection}>
        <h2 className={styles.pageTitle}>{pageTitle}</h2>
      </div>

      {/* Right: icons + profile */}
      <div className={styles.rightSection}>
        <div className={styles.iconGroup}>

          {/* ── Notifications Bell ── */}
          <div style={{ position: "relative" }} ref={notifRef}>
            <button
              className={styles.iconBtn}
              onClick={() => setShowNotif((v) => !v)}
              title={`${pending.length} طالب في الانتظار`}
            >
              <Bell size={20} />
              {pending.length > 0 && (
                <span className={`${styles.badge} ${styles.alert}`}>
                  {pending.length > 9 ? "9+" : pending.length}
                </span>
              )}
            </button>

            {/* Notification popover */}
            {showNotif && (
              <div className={styles.notifPopover}>
                <div className={styles.notifHeader}>
                  <Clock size={14} />
                  <span>طلاب في انتظار الموافقة</span>
                  <span className={styles.notifCount}>{pending.length}</span>
                </div>
                {pending.length === 0 ? (
                  <p className={styles.notifEmpty}>لا توجد طلبات معلقة 🎉</p>
                ) : (
                  <ul className={styles.notifList}>
                    {pending.map((s) => (
                      <li key={s.id} className={styles.notifItem}>
                        <span className={styles.notifDot} />
                        <span className={styles.notifName}>{s.name || "بدون اسم"}</span>
                        <span className={styles.notifDate}>
                          {new Date(s.created_at).toLocaleDateString("ar-EG", {
                            day: "numeric", month: "short",
                          })}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* ── Logout ── */}
          <button
            className={styles.iconBtn}
            title="تسجيل الخروج"
            onClick={handleLogout}
          >
            <LogOut size={20} />
          </button>
        </div>

        <div className={styles.divider} />

        {/* Profile */}
        <div className={styles.profileSection}>
          <div className={styles.profileInfo}>
            <span className={styles.name}>{displayName}</span>
            <span className={styles.role}>{roleLabel}</span>
          </div>
          <div className={styles.avatarWrapper}>
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt={displayName}
                className={styles.avatar}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            )}
            {!avatarUrl && (
              <div className={styles.avatarInitial}>
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
