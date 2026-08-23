import styles from "../Form.module.css";

const BackgroundDecor = () => {
  return (
    <>
      <div className={styles.bgGrid} />
      <div className={styles.bgCoronaLeft} />
      <div className={styles.bgCoronaRight} />
      <div className={styles.bgScanLine} />
    </>
  );
};

export default BackgroundDecor;
