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
          src="/mawaraanew.png"
          alt="مَا وَرَاءَ الطِّبِّ"
          className={styles.calligraphyImage}
          onError={(e) => {
            e.currentTarget.src = "/maWaraaTitleOriginal.png";
          }}
        />
      </div>

      <p className={styles.heroSubtitle}>
        خَلفَ كُل طَبيب… رِحْلة وَخَلف كُل رِحلَة… حِكَاية
      </p>
    </div>
  );
};

export default HeroTitle;
