import React from "react";
import PreviewHeader from "./PreviewHeader";
import StudentPickerBar from "./StudentPickerBar";
import PhoneFrame from "./PhoneFrame";
import styles from "./ChatPreview.module.css";

const WhatsAppChatPreview = ({
  compiledMessage = "",
  allStudents = [],
  selectedStudentId = "",
  onSelectStudent,
  onPickRandomStudent,
  copied = false,
  onCopyText,
}) => (
  <div className={styles.previewWrapper}>
    <PreviewHeader copied={copied} onCopyText={onCopyText} />
    <StudentPickerBar
      allStudents={allStudents}
      selectedStudentId={selectedStudentId}
      onSelectStudent={onSelectStudent}
      onPickRandomStudent={onPickRandomStudent}
    />
    <PhoneFrame compiledMessage={compiledMessage} />
  </div>
);

export default WhatsAppChatPreview;
