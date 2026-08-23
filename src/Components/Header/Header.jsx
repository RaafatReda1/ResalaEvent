import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Header.module.css";
import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import useIsMobile from "../../Hooks/useIsMobile";
import { QrCode } from "lucide-react";
const Header = () => {
  const isMobile = useIsMobile();

  gsap.registerPlugin(ScrollTrigger);
  const contaienrRef = useRef(null);
  useGSAP(() => {
    gsap.fromTo(
      contaienrRef.current,
      {
        opacity: 0,
        y: -20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: contaienrRef.current,
          start: "+=150px",
          end: "+=600px",
          scrub: true,
          markers: true,
        },
      },
    );
  });

  return (
    <header className={styles.headerContainer} ref={contaienrRef}>
      <div className={styles.glassNav}>
        {/* Brand / Logo Mark */}
        <a href="#home" className={styles.brand}>
          <img
            src="/activitylogoNoFill.jpeg"
            alt="شعار رسالة"
            className={styles.brandLogo}
            onError={(e) => {
              e.currentTarget.src = "/resalaLogoNofill.jpeg";
            }}
          />
          <span className={styles.brandText}>رسالة ميديكال</span>
        </a>

        {/* Arabic Navigation Links */}
        <nav className={styles.navLinks}>
          <a href="#home" className={`${styles.navItem} ${styles.active}`}>
            الرئيسية
          </a>
          <a href="#about" className={styles.navItem}>
            عن الحدث
          </a>
          <a href="#speakers" className={styles.navItem}>
            المتحدثون
          </a>
          <a href="#agenda" className={styles.navItem}>
            البرنامج
          </a>
        </nav>

        {/* Action Button */}
        <button className={styles.ctaBtn} type="button">
          {isMobile ? (<QrCode />) : (<><span className={styles.liveDot} /> احجز مقعدك الان</>)}
        </button>
      </div>
    </header>
  );
};

export default Header;
