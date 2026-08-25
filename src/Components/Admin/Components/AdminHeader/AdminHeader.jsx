import { useEffect, useState } from "react";
import { Bell, LogOut, User } from "lucide-react";
import styles from "./AdminHeader.module.css";
import supabase from "@/utils/supabaseClient";

const AdminHeader = () => {
  const [showNotif, setShowNotif] = useState(false);
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session.user);
      setAvatarUrl(session.user.user_metadata.avatar_url);
      console.log(session);
    };
    getUser();
  }, []);

  const displayName = user?.user_metadata?.name || "المشرف";

  return (
    <header className={styles.header}>
      {/* Left: page title */}
      <div className={styles.leftSection}>
        <h2 className={styles.pageTitle}>لوحة التحكم</h2>
      </div>

      {/* Right: icons + profile */}
      <div className={styles.rightSection}>
        <div className={styles.iconGroup}>
          {/* Notifications */}
          <div style={{ position: "relative" }}>
            <button
              className={styles.iconBtn}
              onClick={() => setShowNotif((v) => !v)}
              title="الإشعارات"
            >
              <Bell size={20} />
            </button>
          </div>

          {/* Sign out */}
          <button className={styles.iconBtn} title="تسجيل الخروج">
            <LogOut size={20} />
          </button>
        </div>

        <div className={styles.divider} />

        {/* Profile */}
        <div className={styles.profileSection}>
          <div className={styles.profileInfo}>
            <span className={styles.name}>{displayName}</span>
            <span className={styles.role}>مشرف النظام</span>
          </div>
          <div className={styles.avatarWrapper}>
            <img
              src={avatarUrl}
              alt={displayName}
              className={styles.avatar}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <User size={18} className={styles.avatarFallback} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
