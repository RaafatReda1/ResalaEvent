import { QrCode } from "lucide-react";
import styles from "../Form.module.css";

const QRNoticeCard = ({ phone, place }) => {
  return (
    <div className={styles.qrNoticeCard}>
      <div className={styles.qrNoticeIconBox}>
        <QrCode size={24} />
      </div>
      <div className={styles.qrNoticeContent}>
        <h4 className={styles.qrNoticeTitle}>
          تنبيه بخصوص مراجعة الطلب وكود الدخول (QR Code)
        </h4>
        <p className={styles.qrNoticeText}>
          طلبك الآن قيد مراجعة المنظمين. سيقوم فريق تنظيم <strong>رسالة أطباء الخير</strong> بالتواصل معك
          قريباً عبر رقم الواتساب المسجل (<strong>{phone}</strong>) لتأكيد القبول وإرسال
          كود الـ QR وتأكيد نقطة وموعد تحرك الباص
          من (<strong>{place}</strong>).
        </p>
      </div>
    </div>
  );
};

export default QRNoticeCard;
