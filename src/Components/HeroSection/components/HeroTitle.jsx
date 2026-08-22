import styles from "../HeroSection.module.css";

const HeroTitle = () => {
  return (
    <div className={styles.titleContainer}>
      <span className={styles.englishSubtitle}>YOUR JOURNEY INTO MEDICINE</span>

      {/* Calligraphy Title with Organic Liquid Glass Droplets */}
      <div className={styles.calligraphyWrapper}>
        {/* Background Liquid Glass Droplets */}
        <div className={styles.liquidDropletBack} />
        <div className={styles.liquidDropletFront} />

        <img
          src="/maWaraaTitle.png"
          alt="مَا وَرَاءَ الطِّبِّ - Calligraphy Title"
          className={styles.calligraphyImage}
          onError={(e) => {
            e.currentTarget.src = "/maWaraaTitleOriginal.png";
          }}
        />
      </div>

      <p className={styles.heroSubtitle}>
        تجربة التوجيه الطبي الأكثر تكاملاً والمصممة خصيصاً لجيل المستقبل من طلاب كلية الطب.
      </p>
    </div>
  );
};

export default HeroTitle;
