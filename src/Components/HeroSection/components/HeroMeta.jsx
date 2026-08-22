import { CalendarCheck } from "lucide-react";
import styles from "../HeroSection.module.css";

const HeroMeta = () => {
  return (
    <div className={styles.heroMeta}>
      <div className={styles.datePill}>
        <span> <CalendarCheck /> </span>
        <span>04 SEPTEMBER 2026</span>
      </div>

      <button className={styles.ctaButton}>
        احجز مقعدك الآن
      </button>
    </div>
  );
};

export default HeroMeta;
