import { forwardRef } from "react";
import styles from "../Loader.module.css";

const DateBadges = forwardRef(({ date04Ref }, date03Ref) => {
  return (
    <>
      <div ref={date03Ref} className={`${styles.dateBadge} ${styles.date03}`}>
        <span className={styles.badgeDot} />
        <span className={styles.badgeText}>03 SEP</span>
      </div>

      <div ref={date04Ref} className={`${styles.dateBadge} ${styles.date04}`}>
        <span className={styles.badgeDotTarget} />
        <div className={styles.dateTextWrapper}>
          <span className={styles.badgeSub}>EVENT DAY</span>
          <span className={styles.badgeTextTarget}>04 SEP</span>
        </div>
      </div>
    </>
  );
});

DateBadges.displayName = "DateBadges";

export default DateBadges;
