import { CalendarCheck } from "lucide-react";
import styles from "../HeroSection.module.css";

const HeroMeta = () => {
  return (
    <div className={styles.heroMeta}>
      <div className={styles.datePill}>
        <span className={styles.dateIcon}>
          <CalendarCheck size={17} />
        </span>
        <span>04 SEPTEMBER 2026</span>
      </div>

      {/* Premium Magnetic CTA Button — 3-layer architecture */}
      <button
        className={styles.ctaButton}
        type="button"
        onClick={() => {
          const target = document.getElementById("register");
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }}
      >
        <span className={styles.ctaBtnInner}>
          {/* Moving shimmer sweep */}
          <span className={styles.ctaBtnShine} />
          {/* Pulse live-dot */}
          <span className={styles.btnPulseDot} />
          احجز مقعدك الآن
        </span>
      </button>
    </div>
  );
};

export default HeroMeta;
