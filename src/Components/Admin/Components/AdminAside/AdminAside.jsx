import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ChevronLeft,
  LogOut,
  FileText,
} from "lucide-react";
import styles from "./AdminAside.module.css";
import { Link } from "react-router-dom";

const navLinks = [
  {
    id: "dashboard",
    icon: <LayoutDashboard size={22} />,
    label: "لوحة التحكم",
    path: "/dashboard",
  },
  {
    id: "students",
    icon: <Users size={22} />,
    label: "المسجلين",
    path: "/students",
  },
  {
    id: "reports",
    icon: <FileText size={22} />,
    label: "التقارير",
    path: "/reports",
  },
];

const AdminAside = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeId, setActiveId] = useState("dashboard");

  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}
    >
      {/* Logo + toggle */}
      <div className={styles.logoContainer}>
        <button
          className={styles.toggleBtn}
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "توسيع" : "طي القائمة"}
        >
          <ChevronLeft size={20} className={styles.toggleIcon} />
        </button>
      </div>

      {/* Nav links */}
      <nav className={styles.navMenu}>
        {navLinks.map((link) => (
          <Link
            key={link.id}
            to={link.path}
            onClick={() => setActiveId(link.id)}
            className={`${styles.navItem} ${
              activeId === link.id ? styles.active : ""
            }`}
            title={isCollapsed ? link.label : ""}
          >
            <span className={styles.icon}>{link.icon}</span>
            <span className={styles.label}>{link.label}</span>

            {/* Active background notch */}
            <span className={styles.notch} />
          </Link>
        ))}

        <div className={styles.logoWrapper}>
          <img
            src="/activitylogoNoFill.jpeg"
            alt="رسالة"
            className={styles.logoImage}
          />
        </div>
      </nav>

      {/* Logout */}
      <div className={styles.bottomLink}>
        <button
          className={styles.navItem}
          title={isCollapsed ? "تسجيل الخروج" : ""}
        >
          <span className={styles.icon}>
            <LogOut size={22} />
          </span>
          <span className={styles.label}>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminAside;
