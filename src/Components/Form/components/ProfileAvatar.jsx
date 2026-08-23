import { User, CheckCircle2, Ticket } from "lucide-react";
import styles from "../Form.module.css";

const ProfileAvatar = ({ attendee }) => {
  const imgSrc = attendee.imgSrc || attendee.image || attendee.image_url;

  return (
    <div className={styles.profileHeader}>
      <div className={styles.profileAvatarWrapper}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={attendee.name}
            className={styles.profileAvatar}
          />
        ) : (
          <div className={styles.profileAvatar}>
            <User size={38} />
          </div>
        )}
      </div>

      <div className={styles.profileMeta}>
        <h3 className={styles.profileName}>{attendee.name}</h3>
        <div className={styles.profileBadgesRow}>
          <span className={styles.profileBadge}>
            <CheckCircle2 size={13} />
            <span>مشارك مؤكد</span>
          </span>
          <span className={`${styles.profileBadge} ${styles.ticketBadge}`}>
            <Ticket size={13} />
            <span>
              تذكرة #
              {String(attendee.id || "2026")
                .slice(0, 8)
                .toUpperCase()}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileAvatar;
