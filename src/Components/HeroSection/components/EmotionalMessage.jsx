import styles from "../HeroSection.module.css";

const EmotionalMessage = () => {
  return (
    <div className={styles.emotionalMessage}>
      <span className={styles.messageSub}>أنت مش لازم تعرف كل حاجة لوحدك.</span>
      <span className={styles.messageMain}>إحنا هنا عشان نساعدك تبدأ أول خطوة.</span>
    </div>
  );
};

export default EmotionalMessage;
