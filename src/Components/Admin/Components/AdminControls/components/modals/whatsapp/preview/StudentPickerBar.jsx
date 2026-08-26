import React from "react";
import { Shuffle } from "lucide-react";
import styles from "./ChatPreview.module.css";

const StudentPickerBar = ({ allStudents = [], selectedStudentId, onSelectStudent, onPickRandomStudent }) => (
  <div className={styles.studentPickerBar}>
    <div className={styles.studentPickerLeft}>
      <span className={styles.studentPickerLabel}>فحص على الطالب:</span>
      <select
        className={styles.studentSelect}
        value={selectedStudentId}
        onChange={(e) => onSelectStudent(e.target.value)}
      >
        {allStudents.map((s) => (
          <option key={s.id} value={s.id}>{s.name || s.email}</option>
        ))}
      </select>
    </div>
    <button
      type="button"
      className={styles.randomBtn}
      onClick={onPickRandomStudent}
      title="اختيار طالب عشوائي"
    >
      <Shuffle size={12} />
      <span>🎲 طالب عشوائي</span>
    </button>
  </div>
);

export default StudentPickerBar;
