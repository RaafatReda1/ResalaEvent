import React from "react";
import { PRESET_TEMPLATES } from "./presetTemplates";
import styles from "./Presets.module.css";

const WhatsAppPresetBar = ({ onSelectPreset }) => (
  <div className={styles.presetBar}>
    <span className={styles.presetBarLabel}>⚡ قوالب جاهزة سريعة:</span>

    {PRESET_TEMPLATES.map((preset) => (
      <button
        key={preset.id}
        type="button"
        className={styles.presetBtn}
        onClick={() => onSelectPreset(preset.text)}
        title="تطبيق هذا القالب الجاهز"
      >
        {preset.name}
      </button>
    ))}
  </div>
);

export default WhatsAppPresetBar;
