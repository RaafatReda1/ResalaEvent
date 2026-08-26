import React from "react";
import { Sparkles } from "lucide-react";
import { AVAILABLE_VARIABLES } from "./variablesConfig";
import HealthBadge from "./HealthBadge";
import VariableChip from "./VariableChip";
import styles from "./Palette.module.css";

const WhatsAppVariablesPalette = ({ isHealthy = true, onInsertTag }) => (
  <div className={styles.paletteWrapper}>
    <div className={styles.paletteTopRow}>
      <span className={styles.paletteTitle}>
        <Sparkles size={15} />
        <span>إدراج معلومات الطالب (انقر على أي معلومة لإضافتها مباشرة دون كتابة):</span>
      </span>
      <HealthBadge isHealthy={isHealthy} />
    </div>

    <div className={styles.chipsGrid}>
      {AVAILABLE_VARIABLES.map((v) => (
        <VariableChip
          key={v.tag}
          tag={v.tag}
          label={v.label}
          iconName={v.iconName}
          onInsert={onInsertTag}
        />
      ))}
    </div>
  </div>
);

export default WhatsAppVariablesPalette;
