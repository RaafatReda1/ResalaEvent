import { useRef } from "react";
import {
  AlertTriangle,
  Bell,
  Sparkles,
  BookOpen,
  TrendingDown,
  Compass,
  Mail,
  Map,
  Users,
  Microscope,
  Shield,
  Award,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./Issues.module.css";

gsap.registerPlugin(ScrollTrigger);

// Prevent mobile address-bar resize jumps during scroll
ScrollTrigger.config({ ignoreMobileResize: true });

const Issues = () => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      // Pinned master timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=300%",
          scrub: 0.6,
          pin: true,
          pinSpacing: true,
          anticipatePin: 0,
          invalidateOnRefresh: true,
        },
      });

      // ─────────────────────────────────────────────────────────────
      // ACT 1: Anxiety & Overwhelm (0.00 -> 0.28)
      // ─────────────────────────────────────────────────────────────
      tl.fromTo(
        ".headerScene1",
        { opacity: 0, y: 25, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.08,
          ease: "power2.out",
        },
        0,
      );
      tl.fromTo(
        ".moodAnxietyBg",
        { opacity: 0 },
        { opacity: 1, duration: 0.08 },
        0,
      );
      tl.fromTo(
        ".emoji1",
        { scale: 0.3, opacity: 0, rotate: -15 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.08,
          ease: "back.out(1.8)",
        },
        0,
      );

      // Act 1 Cards entrance
      tl.fromTo(
        ".cardAnxiety1",
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.06, ease: "power3.out" },
        0.03,
      );
      tl.fromTo(
        ".cardAnxiety2",
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.06, ease: "power3.out" },
        0.08,
      );
      tl.fromTo(
        ".cardAnxiety3",
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.06, ease: "power3.out" },
        0.13,
      );

      // Act 1 Reading pause
      tl.to({}, { duration: 0.06 }, 0.19);

      // Act 1 Exit
      tl.to(
        [".cardAnxiety1", ".cardAnxiety2", ".cardAnxiety3"],
        {
          opacity: 0,
          y: -20,
          scale: 0.92,
          duration: 0.05,
          stagger: 0.01,
          ease: "power2.in",
        },
        0.25,
      );
      tl.to(
        ".headerScene1",
        { opacity: 0, y: -15, filter: "blur(4px)", duration: 0.05 },
        0.25,
      );
      tl.to(".moodAnxietyBg", { opacity: 0, duration: 0.06 }, 0.25);
      tl.to(
        ".emoji1",
        { scale: 0.4, opacity: 0, rotate: 15, duration: 0.05 },
        0.26,
      );

      // ─────────────────────────────────────────────────────────────
      // ACT 2: The VIP Invitation Breakthrough (0.32 -> 0.60)
      // ─────────────────────────────────────────────────────────────
      tl.fromTo(
        ".headerScene2",
        { opacity: 0, y: 25, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.08,
          ease: "power2.out",
        },
        0.32,
      );
      tl.fromTo(
        ".moodNotifBg",
        { opacity: 0 },
        { opacity: 1, duration: 0.08 },
        0.32,
      );
      tl.fromTo(
        ".emoji2",
        { scale: 0.3, opacity: 0, rotate: -10 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.08,
          ease: "back.out(2)",
        },
        0.32,
      );

      // Move avatar stage slightly up in Act 2 mobile for perfect harmony with ticket
      tl.fromTo(".heroAvatarStage", { y: 0 }, { y: 0, duration: 0.08 }, 0.32);

      // Ticket entrance
      tl.fromTo(
        ".resalaTicketCard",
        { opacity: 0, y: 35, scale: 0.88, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.09,
          ease: "back.out(1.6)",
        },
        0.36,
      );

      // Act 2 Reading pause
      tl.to({}, { duration: 0.08 }, 0.45);

      // Act 2 Exit
      tl.to(
        ".resalaTicketCard",
        {
          opacity: 0,
          y: -20,
          scale: 0.92,
          filter: "blur(4px)",
          duration: 0.05,
          ease: "power2.in",
        },
        0.54,
      );
      tl.to(
        ".headerScene2",
        { opacity: 0, y: -15, filter: "blur(4px)", duration: 0.05 },
        0.54,
      );
      tl.to(".moodNotifBg", { opacity: 0, duration: 0.06 }, 0.54);
      tl.to(".emoji2", { scale: 0.4, opacity: 0, duration: 0.05 }, 0.55);

      // ─────────────────────────────────────────────────────────────
      // ACT 3: Hope & The 4 Pillars (0.62 -> 1.00)
      // ─────────────────────────────────────────────────────────────
      tl.fromTo(
        ".headerScene3",
        { opacity: 0, y: 25, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.08,
          ease: "power2.out",
        },
        0.62,
      );
      tl.fromTo(
        ".moodCelebBg",
        { opacity: 0 },
        { opacity: 1, duration: 0.08 },
        0.62,
      );
      tl.fromTo(
        ".emoji3",
        { scale: 0.3, opacity: 0, rotate: 10 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.08,
          ease: "back.out(1.8)",
        },
        0.62,
      );

      // Act 3 Cards staggered entrance
      tl.fromTo(
        ".cardHope1",
        { opacity: 0, y: 25, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.06, ease: "power3.out" },
        0.65,
      );
      tl.fromTo(
        ".cardHope2",
        { opacity: 0, y: 25, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.06, ease: "power3.out" },
        0.7,
      );
      tl.fromTo(
        ".cardHope3",
        { opacity: 0, y: 25, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.06, ease: "power3.out" },
        0.75,
      );
      tl.fromTo(
        ".cardHope4",
        { opacity: 0, y: 25, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.06, ease: "power3.out" },
        0.8,
      );

      // Act 3 Comfortable Reading Hold
      tl.to({}, { duration: 0.12 }, 0.8);

      // Act 3 Smooth Finale Exit — Eliminates ANY jump on phone when reaching next section!
      tl.to(
        [".cardHope1", ".cardHope2", ".cardHope3", ".cardHope4"],
        {
          opacity: 0,
          y: -20,
          scale: 0.95,
          duration: 0.05,
          stagger: 0.01,
          ease: "power2.in",
        },
        0.92,
      );
      tl.to(
        ".headerScene3",
        { opacity: 0, y: -15, filter: "blur(4px)", duration: 0.05 },
        0.92,
      );
      tl.to(".emoji3", { opacity: 0, scale: 0.8, duration: 0.05 }, 0.93);
      tl.to(".moodCelebBg", { opacity: 0, duration: 0.06 }, 0.93);

      // Clean end buffer
      tl.to({}, { duration: 0.02 }, 0.98);
    },
    { scope: containerRef },
  );

  return (
    <section ref={containerRef} className={styles.issuesSection} id="issues">
      {/* Background Mood Auras */}
      <div className={`moodAnxietyBg ${styles.moodBg} ${styles.moodAnxiety}`} />
      <div
        className={`moodNotifBg ${styles.moodBg} ${styles.moodNotification}`}
      />
      <div
        className={`moodCelebBg ${styles.moodBg} ${styles.moodCelebration}`}
      />
      <div className={styles.bgGrid} />

      {/* Header Scenes Wrapper */}
      <div className={styles.headerWrapper}>
        <div className={`headerScene1 ${styles.headerScene}`}>
          <div className={`${styles.sceneBadge} ${styles.badgeAct1}`}>
            <AlertTriangle size={15} />
            <span>رحلة الطالب في سنة أولى طب</span>
          </div>
          <h2 className={styles.mainTitle}>ضغوط البدايات والتخبط الأكاديمي</h2>
        </div>

        <div className={`headerScene2 ${styles.headerScene}`}>
          <div className={`${styles.sceneBadge} ${styles.badgeAct2}`}>
            <Bell size={15} />
            <span>نقطة التحول والفرصة الحقيقية</span>
          </div>
          <h2 className={styles.mainTitle}>
            دعوة خاصة لتحويل الحيرة إلى تميز{" "}
          </h2>
        </div>

        <div className={`headerScene3 ${styles.headerScene}`}>
          <div className={`${styles.sceneBadge} ${styles.badgeAct3}`}>
            <Sparkles size={15} />
            <span>ركائز النجاح مع "ما وراء الطب"</span>
          </div>
          <h2 className={styles.mainTitle}>كيف يُشكل هذا الحدث مستقبلك؟ </h2>
        </div>
      </div>

      {/* ── STAGE ARENA ── */}
      <div className={styles.stageContainer}>
        {/* Central Character Avatar with Smooth Multi-Emoji Crossfade */}
        <div className={`heroAvatarStage ${styles.heroAvatarStage}`}>
          <div className={styles.avatarPulseRing} />
          <div className={styles.avatarInnerGlow} />
          <span className={`emoji1 ${styles.emojiAvatar}`}>🤯</span>
          <span
            className={`emoji2 ${styles.emojiAvatar} ${styles.emojiHidden}`}
          >
            😲
          </span>
          <span
            className={`emoji3 ${styles.emojiAvatar} ${styles.emojiHidden}`}
          >
            🤩
          </span>
        </div>

        {/* ── ACT 1 ITEMS ── */}
        <div
          className={`cardAnxiety1 ${styles.contentCard} ${styles.anxietyCard} ${styles.act1Pos1}`}
        >
          <div className={`${styles.cardIconBox} ${styles.iconBoxAnxiety}`}>
            <BookOpen size={20} />
          </div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>تراكم المواد الأكاديمية</h3>
            <p className={styles.cardDesc}>
              صعوبة تنظيم الوقت بين التكليفات والكم الهائل للمناهج الطبية.
            </p>
          </div>
        </div>

        <div
          className={`cardAnxiety2 ${styles.contentCard} ${styles.anxietyCard} ${styles.act1Pos2}`}
        >
          <div className={`${styles.cardIconBox} ${styles.iconBoxAnxiety}`}>
            <TrendingDown size={20} />
          </div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>الرهبة من الامتحانات</h3>
            <p className={styles.cardDesc}>
              التوتر المستمر من الكويزات الخاطفة والخوف الدائم من تدني الدرجات.
            </p>
          </div>
        </div>

        <div
          className={`cardAnxiety3 ${styles.contentCard} ${styles.anxietyCard} ${styles.act1Pos3}`}
        >
          <div className={`${styles.cardIconBox} ${styles.iconBoxAnxiety}`}>
            <Compass size={20} />
          </div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>غياب الخطة الموجهة والحيرة</h3>
            <p className={styles.cardDesc}>
              السير بدون بوصلة أكاديمية أو مرشد يوضح لك خطوتك القادمة.
            </p>
          </div>
        </div>

        {/* ── ACT 2 VIP INVITATION TICKET ── */}
        <div className={`resalaTicketCard ${styles.ticketCard}`}>
          <div className={styles.ticketGlowBorder} />
          <div className={styles.ticketHeader}>
            <div className={styles.ticketBadge}>
              <Award size={13} />
              <span>VIP INVITATION</span>
            </div>
            <div className={styles.ticketIconBox}>
              <Mail size={20} />
              <div className={styles.ticketPulseRing} />
            </div>
          </div>
          <div className={styles.ticketContent}>
            <h3 className={styles.ticketTitle}>
              دعوة خاصة لحضور مؤتمر "ما وراء الطب"
            </h3>
            <p className={styles.ticketBody}>
              انضم لأقوى حدث توجيهي طبي شامل يبني رؤيتك الأكاديمية والمهنية،
              ويصلك بنخبة استشاريين وقادة المجال لاختصار سنوات الخبرة.
            </p>
          </div>
        </div>

        {/* ── ACT 3 THE 4 PILLARS OF HOPE ── */}
        <div
          className={`cardHope1 ${styles.contentCard} ${styles.hopeCard} ${styles.act3Pos1}`}
        >
          <div className={`${styles.cardIconBox} ${styles.iconBoxHope}`}>
            <Map size={20} />
          </div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>تايه ومش عارف تبدأ؟</h3>
            <p className={styles.cardDesc}>
              خلي اللي سبقوك ينورولك أول الطريق.
            </p>
          </div>
        </div>

        <div
          className={`cardHope2 ${styles.contentCard} ${styles.hopeCard} ${styles.act3Pos2}`}
        >
          <div className={`${styles.cardIconBox} ${styles.iconBoxHope}`}>
            <Users size={20} />
          </div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>هتحس إن الكتب مش بتخلص؟</h3>
            <p className={styles.cardDesc}>
              اتعلم إزاي تذاكر بذكاء… مش إزاي تذاكر أكتر.
            </p>
          </div>
        </div>

        <div
          className={`cardHope3 ${styles.contentCard} ${styles.hopeCard} ${styles.act3Pos3}`}
        >
          <div className={`${styles.cardIconBox} ${styles.iconBoxHope}`}>
            <Microscope size={20} />
          </div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>الامتحانات مخوفاك؟</h3>
            <p className={styles.cardDesc}>
              اسمع من دكاترة عدّوا من نفس الـstress ووصلوا.
            </p>
          </div>
        </div>

        <div
          className={`cardHope4 ${styles.contentCard} ${styles.hopeCard} ${styles.act3Pos4}`}
        >
          <div className={`${styles.cardIconBox} ${styles.iconBoxHope}`}>
            <Shield size={20} />
          </div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>
              {" "}
              مش عارف الطبيب المفروض يبقى إيه؟
            </h3>
            <p className={styles.cardDesc}>
              شوف الطب من عين اللي عاشه… مش بس من عين الكتاب.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Issues;
