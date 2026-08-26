import React from "react";
import { Sliders } from "lucide-react";
import { NAME_MODES } from "./settingsActions";
import styles from "./Settings.module.css";

const WhatsAppSmartSettings = ({
  nameMode = "first",
  onNameModeChange,
  autoArabic = true,
  onAutoArabicChange,
}) => (
  <div className={styles.settingsBox}>
    <div className={styles.settingsTitle}>
      <Sliders size={14} />
      <span>إعدادات الاسم والمعالجة الذكية:</span>
    </div>

    {/* Name mode buttons */}
    <div className={styles.nameModeRow}>
      <span className={styles.nameModeLabel}>صيغة الاسم في الرسالة:</span>
      <div className={styles.nameModeBtns}>
        {NAME_MODES.map((mode) => (
          <button
            key={mode.value}
            type="button"
            className={`${styles.nameModeBtn} ${
              nameMode === mode.value ? styles.active : ""
            }`}
            onClick={() => onNameModeChange(mode.value)}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>

    {/* Arabic auto-conversion toggle */}
    <label className={styles.arabicToggleRow}>
      <input
        type="checkbox"
        className={styles.arabicToggleCheckbox}
        checked={autoArabic}
        onChange={(e) => onAutoArabicChange(e.target.checked)}
      />
      <span>
        تعريب الأسماء المكتوبة بالإنجليزية تلقائياً (مثال: LOJAIN ← لوجين)
      </span>
    </label>
  </div>
);

export default WhatsAppSmartSettings;
