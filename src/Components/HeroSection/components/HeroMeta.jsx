import { CalendarCheck } from "lucide-react";
import styles from "../HeroSection.module.css";

const HeroMeta = () => {
  return (
    <div className={styles.heroMeta}>
      <div className={styles.datePill}>
        <span className={styles.dateIcon}>
          <CalendarCheck size={18} />
        </span>
        <span>04 SEPTEMBER 2026</span>
      </div>

      <button className={styles.ctaButton}>
        <span className={styles.btnPulseDot} />
        احجز مقعدك الآن
      </button>
    </div>
  );
};

export default HeroMeta;
