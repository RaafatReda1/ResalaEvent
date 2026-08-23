import { useState, useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useIsMobile from "../../Hooks/useIsMobile";
import { QrCode, Sparkles } from "lucide-react";
import styles from "./Header.module.css";

gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = [
  { id: "home", label: "الرئيسية" },
  { id: "about", label: "عن الحدث" },
  { id: "speakers", label: "المتحدثون" },
  { id: "agenda", label: "البرنامج" },
];

const Header = () => {
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState("home");
  const containerRef = useRef(null);

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
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className={styles.headerContainer} ref={containerRef}>
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

        {/* Arabic Navigation Links */}
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

        {/* Action Button -> Scrolls to #register */}
        <button
          className={styles.ctaBtn}
          type="button"
          onClick={(e) => scrollTo(e, "register")}
        >
          {isMobile ? (
            <QrCode size={18} />
          ) : (
            <>
              <span className={styles.liveDot} />
              <span>احجز مقعدك الآن</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;

