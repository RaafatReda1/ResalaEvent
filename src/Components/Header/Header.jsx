import { useState, useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useIsMobile from "../../hooks/useIsMobile";
import supabase from "@/utils/supabaseClient";
import {
  signInWithGoogle,
  signOutUser,
  fetchStudentByEmail,
  getRegistrationCookie,
  verifyStudentCookie,
} from "../Form/Actions";
import { QrCode, LogOut, User, FileText, Menu, X } from "lucide-react";
import styles from "./Header.module.css";

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = [
  { id: "home", label: "الرئيسية" },
  { id: "about", label: "عن الحدث" },
  { id: "speakers", label: "المتحدثون" },
  { id: "agenda", label: "البرنامج" },
];

const Header = () => {
  const isMobile = useIsMobile(768);
  const [activeSection, setActiveSection] = useState("home");
  const [authUser, setAuthUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);

  // ── Check registration state in DB (via signed-in Google email OR verified Cookie) ──
  const checkRegistration = async (user) => {
    try {
      if (user?.email) {
        const student = await fetchStudentByEmail(user.email);
        setIsRegistered(Boolean(student));
        return;
      }

      // If not signed in with Google -> check verified cookie in DB
      const cookieData = getRegistrationCookie();
      if (cookieData?.cookieToken) {
        const student = await verifyStudentCookie(cookieData.cookieToken);
        setIsRegistered(Boolean(student));
      } else {
        setIsRegistered(false);
      }
    } catch {
      setIsRegistered(false);
    }
  };

  // ── Listen to Supabase Auth state ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user || null;
      setAuthUser(user);
      checkRegistration(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const user = session?.user || null;
        setAuthUser(user);
        checkRegistration(user);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setLoadingAuth(true);
      await signInWithGoogle();
    } catch (err) {
      console.error("Google sign in error:", err);
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleGoogleSignOut = async (e) => {
    e.stopPropagation();
    try {
      setLoadingAuth(true);
      await signOutUser();
      setAuthUser(null);
    } catch (err) {
      console.error("Google sign out error:", err);
    } finally {
      setLoadingAuth(false);
    }
  };

  // ── Header Entrance Animation ──
  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      {
        opacity: 0,
        y: -30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      }
    );
  });

  // ── ScrollSpy: Track active section dynamically ──
  useEffect(() => {
    const sectionIds = ["home", "about", "issues", "speakers", "agenda", "register"];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Smooth Scroll Handler ──
  const scrollTo = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const avatarUrl = authUser?.user_metadata?.avatar_url || authUser?.user_metadata?.picture;
  const displayName = authUser?.user_metadata?.full_name || authUser?.user_metadata?.name || authUser?.email?.split("@")[0];

  return (
    <header className={styles.headerContainer} ref={containerRef}>
      <div className={styles.headerWrapper}>
        <div className={styles.glassNav}>
          {/* Brand / Logo Mark */}
          <a
            href="#home"
            onClick={(e) => scrollTo(e, "home")}
            className={styles.brand}
          >
            <img
              src="/activitylogoNoFill.jpeg"
              alt="شعار رسالة"
              className={styles.brandLogo}
              onError={(e) => {
                e.currentTarget.src = "/resalaLogoNofill.jpeg";
              }}
            />
          </a>

          {/* Desktop Arabic Navigation Links */}
          <nav className={styles.navLinks}>
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollTo(e, item.id)}
                  className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Action Buttons Group */}
          <div className={styles.headerActions}>
            {/* Google Auth Button in Header */}
            {authUser ? (
              <div
                className={styles.headerUserPill}
                onClick={(e) => scrollTo(e, "register")}
                title="عرض طلب التسجيل"
              >
                <div className={styles.headerUserAvatar}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className={styles.headerUserImg} />
                  ) : (
                    <User size={13} className="text-teal-300" />
                  )}
                  <span className={styles.headerUserDot} />
                </div>
                <span className={styles.headerUserName}>{displayName}</span>
                <button
                  type="button"
                  onClick={handleGoogleSignOut}
                  className={styles.headerSignOutBtn}
                  title="تسجيل الخروج"
                >
                  <LogOut size={12} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loadingAuth}
                className={styles.headerGoogleBtn}
                title="تسجيل الدخول باستخدام Google"
              >
                <div className={styles.headerGoogleIcon}>
                  <GoogleIcon />
                </div>
                <span className={styles.googleBtnText}>دخول Google</span>
              </button>
            )}

            {/* Main CTA Button -> Scrolls to #register */}
            <button
              className={`${styles.ctaBtn} ${isRegistered ? styles.ctaBtnRegistered : ""}`}
              type="button"
              onClick={(e) => scrollTo(e, "register")}
              title={isRegistered ? "عرض بياناتي" : "احجز مقعدك"}
            >
              <span className={styles.ctaIconWrap}>
                {isRegistered ? <FileText size={15} /> : <QrCode size={15} />}
              </span>
              <span className={styles.ctaTextWrap}>
                <span className={isRegistered ? styles.liveDotTeal : styles.liveDot} />
                <span>{isRegistered ? "عرض بياناتي" : "احجز مقعدك"}</span>
              </span>
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              className={styles.mobileMenuToggle}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="القائمة"
              title="القائمة"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className={styles.mobileDropdown}>
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollTo(e, item.id)}
                  className={`${styles.mobileNavItem} ${isActive ? styles.mobileActive : ""}`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className={styles.mobileActiveDot} />}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;


