import styles from "../Loader.module.css";

const SkipButton = ({ onSkip }) => {
  return (
    <button onClick={onSkip} className={styles.skipBtn}>
      تخطي العرض | Skip Intro ✕
    </button>
  );
};

export default SkipButton;
