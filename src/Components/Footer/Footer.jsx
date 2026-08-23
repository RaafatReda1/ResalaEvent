import {
  MapPin,
  Phone,
  Calendar,
  ExternalLink,
  Heart,
  ChevronLeft,
  MessageCircle,
} from "lucide-react";
import styles from "./Footer.module.css";

const Footer = () => {
  const scrollTo = (e, targetId) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className={styles.footerSection}>
      {/* Background Decor */}
      <div className={styles.bgGrid} />
      <div className={styles.bgCorona} />

      <div className={styles.footerContainer}>
        {/* Top Grid */}
        <div className={styles.footerGrid}>
          {/* Column 1: Brand & Logos */}
          <div className={styles.brandCol}>
            <div className={styles.logosRow}>
              <img
                src="/resalaLogoNofill.jpeg"
                alt="شعار جمعية رسالة"
                className={styles.logoItem}
              />
              <img
                src="/activitylogoNoFill.jpeg"
                alt="شعار النشاط الطبي"
                className={styles.logoItem}
                onError={(e) => {
                  e.currentTarget.src = "/doctorsShieldLogo.png";
                }}
              />
            </div>

            <h3 className={styles.brandTitle}>رسالة أطباء الخير — مدينة نصر</h3>

            <p className={styles.brandDesc}>
              النشاط الطبي لجمعية رسالة للأعمال الخيرية. نهدف إلى تقديم الرعاية
              الصحية للمستحقين، وتأهيل جيل متميز من الكوادر الطبية المتطوعة
              لخدمة المجتمع ونشر الأمل.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className={styles.linksCol}>
            <h4 className={styles.colHeader}>روابط سريعة</h4>
            <ul className={styles.linksList}>
              <li>
                <a
                  href="#home"
                  onClick={(e) => scrollTo(e, "home")}
                  className={styles.linkItem}
                >
                  <ChevronLeft size={16} />
                  <span>الرئيسية</span>
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => scrollTo(e, "about")}
                  className={styles.linkItem}
                >
                  <ChevronLeft size={16} />
                  <span>عن الحدث والنشاط</span>
                </a>
              </li>
              <li>
                <a
                  href="#speakers"
                  onClick={(e) => scrollTo(e, "speakers")}
                  className={styles.linkItem}
                >
                  <ChevronLeft size={16} />
                  <span>المتحدثون والضيوف</span>
                </a>
              </li>
              <li>
                <a
                  href="#agenda"
                  onClick={(e) => scrollTo(e, "agenda")}
                  className={styles.linkItem}
                >
                  <ChevronLeft size={16} />
                  <span>برنامج الإيفنت</span>
                </a>
              </li>
              <li>
                <a
                  href="#register"
                  onClick={(e) => scrollTo(e, "register")}
                  className={styles.linkItem}
                >
                  <ChevronLeft size={16} />
                  <span>تسجيل الحضور</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Event Info & Contacts */}
          <div className={styles.contactCol}>
            <h4 className={styles.colHeader}>تفاصيل الحدث والتواصل</h4>

            {/* Event Date */}
            <div className={styles.contactCard}>
              <div className={styles.contactIconBox}>
                <Calendar size={20} />
              </div>
              <div className={styles.contactInfo}>
                <span className={styles.contactLabel}>موعد الإيفنت</span>
                <span className={styles.contactValue}>
                  الجمعة، 04 سبتمبر 2026 (04 Sep 2026)
                </span>
              </div>
            </div>

            {/* Location */}
            <div className={styles.contactCard}>
              <div className={styles.contactIconBox}>
                <MapPin size={20} />
              </div>
              <div className={styles.contactInfo}>
                <span className={styles.contactLabel}>مكان الإيفنت</span>
                <span className={styles.contactValue}>
                  مدرسة رسالة في المقطم
                </span>
                <a
                  href="https://maps.app.goo.gl/h7u2CFnssncX2WPB6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapBtn}
                >
                  <span>عرض الموقع على خرائط Google</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>

            {/* Phone & WhatsApp */}
            <div className={styles.contactCard}>
              <div className={styles.contactIconBox}>
                <Phone size={20} />
              </div>
              <div className={styles.contactInfo}>
                <span className={styles.contactLabel}>للاستفسار والحجز</span>
                <a href="tel:01015544101" className={styles.contactValue}>
                  01015544101
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <a
            href="https://www.facebook.com/raafat.reda.366930"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.devBadge}
            title="تواصل مع مطور الموقع"
          >
            <span className={styles.devName}>Raafat Shahin</span>

            <span>Designed & Developed by</span>
            <ExternalLink size={13} />
          </a>
          <p className={styles.copyrightText}>
            جميع الحقوق محفوظة © 2026 لـ{" "}
            <strong>رسالة أطباء الخير — مدينة نصر</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
