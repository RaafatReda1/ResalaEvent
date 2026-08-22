import styles from "../HeroSection.module.css";

const LogoVisual = ({ logoWrapperRef, logoGlowRef }) => {
  return (
    <div className={styles.heroLeft}>
      <div ref={logoWrapperRef} className={styles.logoWrapper}>
        <div ref={logoGlowRef} className={styles.logoGlowRing} />
        <img
          src="/activitylogoNoFill.jpeg"
          alt="Resala Medical Activity Logo"
          className={styles.logoImage}
          onError={(e) => {
            e.currentTarget.src = "/resalaLogoNofill.jpeg";
          }}
        />
      </div>
    </div>
  );
};

export default LogoVisual;
