import React from "react";
import {
  UserCheck, Sparkles, FileText, MapPin,
  Building2, GraduationCap, Phone, Mail,
} from "lucide-react";
import styles from "./Palette.module.css";

const ICON_MAP = {
  UserCheck:     <UserCheck size={14} />,
  Sparkles:      <Sparkles size={14} />,
  FileText:      <FileText size={14} />,
  MapPin:        <MapPin size={14} />,
  Building2:     <Building2 size={14} />,
  GraduationCap: <GraduationCap size={14} />,
  Phone:         <Phone size={14} />,
  Mail:          <Mail size={14} />,
};

const VariableChip = ({ tag, label, iconName, onInsert }) => (
  <button
    type="button"
    className={styles.variableChip}
    onClick={() => onInsert(tag)}
    title={`إدراج ${tag} في موضع المؤشر`}
  >
    <div className={styles.chipLeft}>
      <span className={styles.chipIcon}>{ICON_MAP[iconName]}</span>
      <span className={styles.chipLabel}>{label}</span>
    </div>
    <span className={styles.chipTag}>{tag}</span>
  </button>
);

export default VariableChip;
