import React from "react";
import { renderWhatsAppHtml } from "./chatPreviewActions";
import styles from "./ChatPreview.module.css";

const PhoneFrame = ({ compiledMessage }) => (
  <div className={styles.phoneFrame}>
    <div className={styles.phoneBar}>
      <div className={styles.phoneAvatar}>ر</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span className={styles.phoneContactName}>أطباء الخير - رسالة</span>
        <span className={styles.phoneContactStatus}>متصل الآن (Online)</span>
      </div>
    </div>
    <div className={styles.chatArea}>
      <div className={styles.messageBubble}>
        <div dangerouslySetInnerHTML={renderWhatsAppHtml(compiledMessage)} />
        <div className={styles.messageTime}>
          <span>12:30 PM</span>
          <span className={styles.messageTick}>✓✓</span>
        </div>
      </div>
    </div>
  </div>
);

export default PhoneFrame;
