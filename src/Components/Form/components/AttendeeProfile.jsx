import { Edit3 } from "lucide-react";
import ProfileDetailsGrid from "./ProfileDetailsGrid";
import QRNoticeCard from "./QRNoticeCard";
import styles from "../Form.module.css";

const AttendeeProfile = ({
  savedAttendee,
  onStartEdit,
  onClearRegistration,
}) => {
  return (
    <div className={styles.profileCardContainer}>
      {/* 1. Header & Avatar */}

      {/* 2. Attendee Info Grid */}
      <ProfileDetailsGrid attendee={savedAttendee} />

      {/* 3. WhatsApp & QR Notice Banner */}
      <QRNoticeCard
        phone={savedAttendee.phone}
        place={savedAttendee.place}
      />

      {/* 4. Action Buttons */}
      <div className={styles.profileActions}>
        <button
          type="button"
          onClick={onStartEdit}
          className={styles.editBtn}
        >
          <Edit3 size={16} />
          <span>تعديل بيانات التسجيل أو الفرع</span>
        </button>
        
      </div>
    </div>
  );
};

export default AttendeeProfile;

