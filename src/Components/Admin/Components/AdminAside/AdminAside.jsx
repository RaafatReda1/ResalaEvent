import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import gsap from "gsap";
import {
  LayoutDashboard,
  Users,
  ChevronLeft,
  LogOut,
  FileText,
} from "lucide-react";
import styles from "./AdminAside.module.css";
import supabase from "@/utils/supabaseClient";

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
  const location = useLocation();
  const asideRef = useRef(null);
  const logoRef = useRef(null);

  // Derive active link from URL
  const activeId =
    navLinks.find((l) => location.pathname.endsWith(l.id))?.id ?? "dashboard";

  // GSAP: Animate active item bounce on route change
  useEffect(() => {
    if (asideRef.current) {
      const activeEl = asideRef.current.querySelector(`.${styles.active}`);
      if (activeEl) {
        gsap.fromTo(
          activeEl.querySelector(`.${styles.icon}`),
          { scale: 0.8, rotate: -8 },
          { scale: 1.25, rotate: 0, duration: 0.4, ease: "back.out(2)" }
        );
      }
    }
  }, [activeId]);

  // GSAP: Gentle pulse animation on logo mount
  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: "elastic.out(1, 0.6)" }
      );
    }
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <aside
      ref={asideRef}
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}
    >
      {/* Logo Container & Toggle Button (Desktop only) */}
      <div className={styles.logoContainer}>
        <button
          type="button"
          className={styles.toggleBtn}
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "توسيع القائمة" : "طي القائمة"}
        >
          <ChevronLeft size={20} className={styles.toggleIcon} />
        </button>
      </div>

      {/* Nav links */}
      <nav className={styles.navMenu}>
        {navLinks.map((link) => {
          const isActive = activeId === link.id;
          return (
            <Link
              key={link.id}
              to={link.path}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              title={isCollapsed ? link.label : ""}
            >
              <span className={styles.icon}>{link.icon}</span>
              <span className={styles.label}>{link.label}</span>
              {/* Active background notch */}
              <span className={styles.notch} />
            </Link>
          );
        })}

        {/* Large Brand Logo */}
        <div className={styles.logoWrapper}>
          <img
            ref={logoRef}
            src="/activitylogoNoFill.jpeg"
            alt="رسالة"
            className={styles.logoImage}
            onError={(e) => {
              e.currentTarget.src = "/resalaLogoNofill.jpeg";
            }}
          />
        </div>
      </nav>

      {/* Logout */}
      <div className={styles.bottomLink}>
        <button
          type="button"
          className={styles.navItem}
          onClick={handleLogout}
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
