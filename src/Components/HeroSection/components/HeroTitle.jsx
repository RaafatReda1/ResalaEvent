import styles from "../HeroSection.module.css";

const HeroTitle = () => {
  return (
    <>
      <h1 className={styles.heroTitle}>
        YOUR JOURNEY
        <span>INTO MEDICINE STARTS HERE.</span>
      </h1>
      <p className={styles.heroSubtitle}>
        تجربة التوجيه الطبي الأكثر تكاملاً والمصممة خصيصاً لجيل المستقبل من طلاب كلية الطب.
      </p>
    </>
  );
};

export default HeroTitle;
