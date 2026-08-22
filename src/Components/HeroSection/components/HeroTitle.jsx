import styles from "../HeroSection.module.css";

const HeroTitle = () => {
  return (
    <div className={styles.titleContainer}>
      <span className={styles.englishSubtitle}>YOUR JOURNEY INTO MEDICINE</span>

      {/* Calligraphy with organic liquid glass blobs + diamond accent */}
      <div className={styles.calligraphyWrapper}>
        <div className={styles.liquidDropletBack} />
        <div className={styles.liquidDropletFront} />
        <div className={styles.liquidAccentDot} />
        <img
          src="/maWaraaTitle.png"
          alt="مَا وَرَاءَ الطِّبِّ"
          className={styles.calligraphyImage}
          onError={(e) => { e.currentTarget.src = "/maWaraaTitleOriginal.png"; }}
        />
      </div>

      <p className={styles.heroSubtitle}>
        تجربة التوجيه الطبي الأكثر تكاملاً والمصممة خصيصاً لجيل المستقبل من طلاب كلية الطب.
      </p>
    </div>
  );
};

export default HeroTitle;
