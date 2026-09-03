import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Sparkles,
  HeartHandshake,
  Calendar,
  Clock,
  QrCode,
  CalendarPlus,
  ExternalLink,
  MessageCircle,
  BellRing,
  Award,
  ArrowDownCircle,
  CheckCircle2,
  Share2,
} from "lucide-react";
import styles from "./ClosedRegistration.module.css";

gsap.registerPlugin(ScrollTrigger);

const ClosedRegistration = () => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const acceptedCardRef = useRef(null);
  const missedCardRef = useRef(null);
  const footerNoticeRef = useRef(null);

  // GSAP Reveal Animations
  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 78%",
          once: true,
        },
      });

      // 1. Header elements reveal
      tl.fromTo(
        headerRef.current?.children || [],
        { opacity: 0, y: 35, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.14,
        }
      )
        // 2. Both Main Message Cards glide in with stagger
        .fromTo(
          [acceptedCardRef.current, missedCardRef.current],
          { opacity: 0, y: 45, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.18,
          },
          "-=0.4"
        )
        // 3. Bottom Notice Card & Quick actions
        .fromTo(
          footerNoticeRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.3"
        );
    },
    { scope: containerRef }
  );

  // Google Calendar Link generator for the event
  const handleAddToCalendar = () => {
    const title = encodeURIComponent("إيفنت ما وراء الطب - أطباء الخير جمعية رسالة");
    const details = encodeURIComponent(
      "رحلة لاكتشاف ما وراء البالطو الطبي، تجارب وحكايات ملهمة مع كبار الأطباء والرواد. تنظيم أطباء الخير - جمعية رسالة."
    );
    const location = encodeURIComponent("القاهرة، مصر - أطباء الخير رسالة");
    // Date: 04 September 2026 (From 13:00 to 20:00 Cairo time)
    const dates = "20260904T110000Z/20260904T180000Z";
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
    window.open(googleCalendarUrl, "_blank", "noopener,noreferrer");
  };

  const scrollToSection = (e, targetId) => {
    e.preventDefault();
    if (window.lenis) {
      window.lenis.scrollTo(`#${targetId}`, { offset: -40, duration: 1.2 });
    } else {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleShareEvent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "إيفنت ما وراء الطب | أطباء الخير",
          text: "اكتملت مقاعد إيفنت ما وراء الطب! ترقبوا تغطيتنا للحدث واشتركوا في الفعاليات القادمة.",
          url: window.location.origin,
        });
      } catch {
        // User cancelled or share not supported
      }
    } else {
      navigator.clipboard.writeText(window.location.origin);
      alert("تم نسخ رابط الموقع بنجاح! يمكنك مشاركته مع أصدقائك.");
    }
  };

  return (
    <section ref={containerRef} className={styles.closedSection} id="register">
      {/* ── Ambient Background FX ── */}
      <div className={styles.bgGrid} />
      <div className={styles.bgOrbTeal} />
      <div className={styles.bgOrbAmber} />
      <div className={styles.bgScanLine} />

      <div className={styles.contentContainer}>
        {/* ── Section Header ── */}
        <div ref={headerRef} className={styles.headerWrap}>
          {/* Status Badge */}
          <div className={styles.statusBadge}>
            <span className={styles.pulseGlow} />
            <span className={styles.radarDot} />
            <span className={styles.badgeText}>اكتملت المقاعد • انتهى التسجيل</span>
          </div>

          <h2 className={styles.mainTitle}>
            شكراً لإقبالكم الاستثنائي!
            <span className={styles.gradientSubtitle}> تم اكتمال العدد المطلوب بنجاح ✨</span>
          </h2>

          <p className={styles.subLead}>
            نظراً للاهتمام البالغ وثقتكم الغالية برحلة <strong>«ما وراء الطب»</strong>،
            أغلقنا باب التسجيل بعد الوصول لكامل الطاقة الاستيعابية للقاعة.
            فخورون جداً بشغفكم ورغبتكم في صناعة أثر حقيقي!
          </p>
        </div>

        {/* ── The Two Core Friendly Messages ── */}
        <div className={styles.cardsGrid}>
          {/* 🌟 Card 1: To Accepted Attendees */}
          <div ref={acceptedCardRef} className={`${styles.messageCard} ${styles.acceptedCard}`}>
            <div className={styles.cardHeaderGlow} />

            <div className={styles.cardTop}>
              <div className={styles.iconWrapperTeal}>
                <Sparkles size={24} className={styles.cardIconTeal} />
              </div>
              <div className={styles.cardTagTeal}>
                <Award size={14} />
                <span>إلى من حالفهم الحظ وتم قبولهم</span>
              </div>
            </div>

            <h3 className={styles.cardTitle}>
              شرف كبير وفرحة عظيمة بحضوركم معنا! 🌟
            </h3>

            <p className={styles.cardBody}>
              أهلاً بأطباء وقادة المستقبل! وجودكم معنا في هذا الحدث يُمثّل شرفاً حقيقياً لفريق
              أطباء الخير. أعددنا لكم برنامجاً غنياً بالتجارب الحية والإلهام الواقعي من رواد الطب
              ليكون هذا اليوم نقطة تحول حقيقية في مسيرتكم العلمية والإنسانية.
            </p>

            <div className={styles.infoPillsContainer}>
              <div className={styles.infoPill}>
                <Calendar size={16} className={styles.pillIcon} />
                <span className={styles.pillLabel}>الموعد:</span>
                <span className={styles.pillValue}>الجمعة، 04 سبتمبر 2026</span>
              </div>

              <div className={styles.infoPill}>
                <Clock size={16} className={styles.pillIcon} />
                <span className={styles.pillLabel}>الاستقبال:</span>
                <span className={styles.pillValue}>يُرجى الحضور مبكراً لضمان سهولة الدخول</span>
              </div>

              <div className={styles.infoPill}>
                <QrCode size={16} className={styles.pillIcon} />
                <span className={styles.pillLabel}>التأكيد:</span>
                <span className={styles.pillValue}>احتفظ برسالة القبول أو الباركود للدخول</span>
              </div>
            </div>

            <div className={styles.cardActionRow}>
              <button
                type="button"
                onClick={handleAddToCalendar}
                className={styles.calendarBtn}
                title="إضافة تذكير بموعد الحدث إلى تقويم Google"
              >
                <CalendarPlus size={16} />
                <span>إضافة لتقويم Google</span>
              </button>

              <button
                type="button"
                onClick={(e) => scrollToSection(e, "agenda")}
                className={styles.agendaBtn}
                title="الاطلاع على فقرات وبرنامج اليوم"
              >
                <ArrowDownCircle size={16} />
                <span>استعراض البرنامج</span>
              </button>
            </div>
          </div>

          {/* 💫 Card 2: To Those Who Couldn't Make It */}
          <div ref={missedCardRef} className={`${styles.messageCard} ${styles.missedCard}`}>
            <div className={styles.cardHeaderGlowAmber} />

            <div className={styles.cardTop}>
              <div className={styles.iconWrapperAmber}>
                <HeartHandshake size={24} className={styles.cardIconAmber} />
              </div>
              <div className={styles.cardTagAmber}>
                <BellRing size={14} />
                <span>لمن لم يسعفه الوقت للتسجيل</span>
              </div>
            </div>

            <h3 className={styles.cardTitle}>
              خيرها في غيرها.. والقادم أجمل بكثير! 💫
            </h3>

            <p className={styles.cardBody}>
              إلى كل بطل حاول التسجيل ولم يسعفه الوقت بسبب امتلاء المقاعد: لا تجعل الحماس يتوقف
              هنا! رغبتك وشغفك هما أثمن ما نعتز به، ونعتذر بصدق لمن لم يدرك الحجز هذه المرة. نعدكم
              بأن رحلة الخير مستمرة وبأن هذه الفعالية هي البداية فقط لمفاجآت وورش عمل قادمة.
            </p>

            <div className={styles.featurePointsList}>
              <div className={styles.featurePoint}>
                <CheckCircle2 size={16} className={styles.pointCheck} />
                <span>فعاليات ومؤتمرات طبية موسّعة قادمة بمقاعد أكبر.</span>
              </div>
              <div className={styles.featurePoint}>
                <CheckCircle2 size={16} className={styles.pointCheck} />
                <span>الأولوية لمتابعي قنواتنا في معرفة مواعيد التسجيل القادمة.</span>
              </div>
              <div className={styles.featurePoint}>
                <CheckCircle2 size={16} className={styles.pointCheck} />
                <span>باب التطوع والمشاركة في نشاط أطباء الخير مفتوح دائماً.</span>
              </div>
            </div>

            <div className={styles.cardActionRow}>
              <a
                href="https://www.facebook.com/share/1ALqf8W1rA/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.facebookFollowBtn}
                title="تابع صفحتنا على فيسبوك لتكون أول من يعلم بالفعاليات القادمة"
              >
                <ExternalLink size={16} />
                <span>تابع صفحة أطباء الخير على فيسبوك</span>
              </a>

              <button
                type="button"
                onClick={handleShareEvent}
                className={styles.shareBtn}
                title="مشاركة تفاصيل الإيفنت مع زملائك"
              >
                <Share2 size={16} />
                <span>مشاركة الحدث</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Footer Support & Already Registered Notice ── */}
        <div ref={footerNoticeRef} className={styles.footerNoticeBar}>
          <div className={styles.footerNoticeInfo}>
            <div className={styles.supportIconWrap}>
              <MessageCircle size={22} />
            </div>
            <div className={styles.supportTextWrap}>
              <h4 className={styles.supportTitle}>
                هل سجلت مسبقاً ولديك أي استفسار أو مشكلة في التأكيد؟
              </h4>
              <p className={styles.supportSub}>
                فريق تنظيم «أطباء الخير» متواجد للإجابة عن أسئلتكم ومساعدتكم على مدار الساعة.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/201015544101?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D9%84%D8%AF%D9%8A%20%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%A8%D8%AE%D8%B5%D9%88%D8%B5%20%D8%AA%D8%B3%D8%AC%D9%8A%D9%84%D9%8A%20%D9%81%D9%8A%20%D8%A5%D9%8A%D9%81%D9%86%D8%AA%20%D9%85%D8%A7%20%D9%88%D8%B1%D8%A7%D8%A1%20%D8%A7%D9%84%D8%B7%D8%A8."
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactOrganizerBtn}
          >
            <MessageCircle size={17} />
            <span>تواصل مع الدعم الفني والتنظيم</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ClosedRegistration;
