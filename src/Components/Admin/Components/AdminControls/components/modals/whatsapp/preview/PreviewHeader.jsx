import React from "react";
import { MessageCircle, Copy, CheckCheck } from "lucide-react";
import styles from "./ChatPreview.module.css";

const PreviewHeader = ({ copied, onCopyText }) => (
  <div className={styles.previewHeader}>
    <span className={styles.previewTitle}>
      <MessageCircle size={15} />
      <span>معاينة حية للمحادثة على واتساب:</span>
    </span>
    <button type="button" className={styles.copyBtn} onClick={onCopyText} title="نسخ نص الرسالة">
      {copied ? (
        <><CheckCheck size={14} /><span className={styles.copiedText}>تم النسخ</span></>
      ) : (
        <><Copy size={13} /><span>نسخ النص</span></>
      )}
    </button>
  </div>
);

export default PreviewHeader;
