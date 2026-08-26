import React from "react";
import { ShieldCheck } from "lucide-react";
import styles from "./Palette.module.css";

const HealthBadge = ({ isHealthy }) => (
  <span className={`${styles.healthBadge} ${isHealthy ? styles.healthOk : styles.healthError}`}>
    {isHealthy ? (
      <><ShieldCheck size={13} /><span>القالب سليم 100%</span></>
    ) : (
      <span>⚠️ يوجد خطأ في أقواس المتغيرات</span>
    )}
  </span>
);

export default HealthBadge;
