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

            <h3 className={styles.brandTitle}>
              أطباء الخير - رسالة - مدينة نصر
            </h3>

            <p className={styles.brandDesc}>
              نشاط تطوعي مكون من الدكاترة و طلاب الطب البشرى هدفنا نوصل للناس
              بالكشف والمتابعة وصرف العلاج مجانا، وننشر الوعي الطبي عن الأمراض
              وطرق الوقاية منها وعمل كورسات طبية رسالتنا إننا نزرع في نفسنا حب
              التطوع من دلوقتي، علشان بعد كام سنة نبقى الأطباء المتطوعين اللي
              يكملوا المسيرة
            </p>

            {/* Facebook Official Page Button */}
            <a
              href="https://www.facebook.com/share/14ue4x26FKc/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.fbButton}
              title="صفحتنا على فيسبوك"
            >
              <div className={styles.fbIconWrap}>
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <div className={styles.fbText}>
                <span className={styles.fbTitle}>صفحتنا على فيسبوك</span>
                <span className={styles.fbSub}>
                  أطباء الخير - رسالة مدينة نصر
                </span>
              </div>
              <ExternalLink size={14} className={styles.fbArrow} />
            </a>
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
            <strong>أطباء الخير - رسالة - مدينة نصر</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
