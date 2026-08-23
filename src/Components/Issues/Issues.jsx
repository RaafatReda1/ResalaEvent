import { useRef, useState } from 'react';
import { HelpCircle, AlertTriangle, Bell, Compass, Users, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './Issues.module.css';

gsap.registerPlugin(ScrollTrigger);

const Issues = () => {
  const containerRef = useRef(null);
  const [currentAct, setCurrentAct] = useState(1); // 1: Anxiety, 2: Notification, 3: Celebration & Hope

  // Emoji Hero symbols for each act
  const heroEmojis = {
    1: '🤯',
    2: '😲',
    3: '🤩',
  };

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=300%', // 300vh scroll distance for full narrative pacing
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
          markers: false,
          onUpdate: (self) => {
            const p = self.progress;
            let act = 1;
            if (p < 0.30) {
              act = 1;
            } else if (p >= 0.30 && p < 0.60) {
              act = 2;
            } else {
              act = 3;
            }

            if (containerRef.current) {
              containerRef.current.setAttribute('data-act', String(act));
            }
            setCurrentAct(act);
          },
        },
      });

      // ═════════════════════════════════════════════════════════════
      // ACT 1: ANXIETY & STUDENT STRUGGLES (0.00 ➔ 0.30)
      // ═════════════════════════════════════════════════════════════

      // Avatar scale & wiggle
      tl.fromTo(
        '.emojiAvatarItem',
        { scale: 0.6, rotate: -15 },
        { scale: 1, rotate: 0, duration: 0.1, ease: 'back.out(1.7)' },
        0
      );

      // Anxiety Cards enter
      tl.fromTo(
        '.cardAnxiety1',
        { opacity: 0, y: 40, scale: 0.85, filter: 'blur(10px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.08, ease: 'power3.out' },
        0.02
      );

      tl.fromTo(
        '.cardAnxiety2',
        { opacity: 0, y: 40, scale: 0.85, filter: 'blur(10px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.08, ease: 'power3.out' },
        0.09
      );

      tl.fromTo(
        '.cardAnxiety3',
        { opacity: 0, y: 40, scale: 0.85, filter: 'blur(10px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.08, ease: 'power3.out' },
        0.16
      );

      // Fade out ALL Anxiety Cards before Act 2
      tl.to(
        ['.cardAnxiety1', '.cardAnxiety2', '.cardAnxiety3'],
        {
          opacity: 0,
          y: -25,
          scale: 0.9,
          filter: 'blur(8px)',
          duration: 0.06,
          stagger: 0.02,
          ease: 'power2.in',
        },
        0.26
      );

      // ═════════════════════════════════════════════════════════════
      // ACT 2: THE GOLDEN RESALA INVITATION (0.30 ➔ 0.60)
      // ═════════════════════════════════════════════════════════════

      // Avatar bounce
      tl.to(
        '.emojiAvatarItem',
        { scale: 1.15, rotate: 10, duration: 0.08, ease: 'bounce.out' },
        0.30
      );

      // Golden Ticket enters
      tl.fromTo(
        '.resalaTicketCard',
        { opacity: 0, y: -60, scale: 0.7, filter: 'blur(12px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.12, ease: 'back.out(1.8)' },
        0.32
      );

      // Golden Ticket fades out before Act 3
      tl.to(
        '.resalaTicketCard',
        {
          opacity: 0,
          y: -30,
          scale: 0.85,
          filter: 'blur(8px)',
          duration: 0.08,
          ease: 'power2.in',
        },
        0.54
      );

      // ═════════════════════════════════════════════════════════════
      // ACT 3: CELEBRATION & EVENT FEATURES (0.60 ➔ 1.00)
      // ═════════════════════════════════════════════════════════════

      // Avatar joy scale
      tl.to(
        '.emojiAvatarItem',
        { scale: 1.25, rotate: 0, duration: 0.08, ease: 'power2.out' },
        0.60
      );

      // Feature Card 1 enters (Top Right)
      tl.fromTo(
        '.cardHope1',
        { opacity: 0, y: 40, scale: 0.8, filter: 'blur(10px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.08, ease: 'power3.out' },
        0.62
      );

      // Feature Card 2 enters (Top Left)
      tl.fromTo(
        '.cardHope2',
        { opacity: 0, y: 40, scale: 0.8, filter: 'blur(10px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.08, ease: 'power3.out' },
        0.70
      );

      // Feature Card 3 enters (Bottom Right)
      tl.fromTo(
        '.cardHope3',
        { opacity: 0, y: 40, scale: 0.8, filter: 'blur(10px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.08, ease: 'power3.out' },
        0.78
      );

      // Feature Card 4 enters (Bottom Left)
      tl.fromTo(
        '.cardHope4',
        { opacity: 0, y: 40, scale: 0.8, filter: 'blur(10px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.08, ease: 'power3.out' },
        0.86
      );

      tl.to({}, { duration: 0.06 }, 0.94);

      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);

      return () => clearTimeout(timer);
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className={styles.issuesSection} data-act="1">
      {/* Dynamic Ambient Glow & Background Grid */}
      <div className={styles.moodOverlay} />
      <div className={styles.bgGrid} />

      {/* Header Narrative Badges & Titles */}
      <div className={styles.headerWrapper}>
        <div className={`${styles.badge} ${styles.badgeAct1}`}>
          <AlertTriangle size={16} />
          <span>التحديات والأوهام في سنة أولى طب</span>
        </div>
        <div className={`${styles.badge} ${styles.badgeAct2}`}>
          <Bell size={16} />
          <span>إشعار هام من حدث "ما وراء الطب"</span>
        </div>
        <div className={`${styles.badge} ${styles.badgeAct3}`}>
          <Sparkles size={16} />
          <span>ماذا يقدم لك حدث "ما وراء الطب"؟</span>
        </div>

        <h2 className={`${styles.mainTitle} ${styles.titleAct1}`}>تائه في بداية طريق الطب؟ لست وحدك!</h2>
        <h2 className={`${styles.mainTitle} ${styles.titleAct2}`}>وصلتك الدعوة للحضور الأكبر! 🎉</h2>
        <h2 className={`${styles.mainTitle} ${styles.titleAct3}`}>دليلك الشامل لتحويل الحيرة إلى ثقة ونجاح ✨</h2>
      </div>

      {/* Central Interactive Stage */}
      <div className={styles.stageContainer}>
        {/* Central Glowing Orb & Emoji Hero */}
        <div className={styles.heroAvatarStage}>
          <div className={styles.avatarPulseRing} />
          <span className={`emojiAvatarItem ${styles.emojiAvatar}`}>
            {heroEmojis[currentAct]}
          </span>
        </div>

        {/* Floating Narrative Cards Layer */}
        <div className={styles.floatingLayer}>
          {/* ACT 1: Anxiety Popups */}
          <div className={`cardAnxiety1 ${styles.anxietyCard} ${styles.anxietyPos1}`}>
            <span className={styles.anxietyBadgeIcon}>💔</span>
            <span>"المواد ضخمة جداً ومش قادر أظبط وقتي!"</span>
          </div>

          <div className={`cardAnxiety2 ${styles.anxietyCard} ${styles.anxietyPos2}`}>
            <span className={styles.anxietyBadgeIcon}>📉</span>
            <span>"خايف أسقط في الكويزات وأحس إني مش قد الكلية..."</span>
          </div>

          <div className={`cardAnxiety3 ${styles.anxietyCard} ${styles.anxietyPos3}`}>
            <span className={styles.anxietyBadgeIcon}>🌀</span>
            <span>"تايه في سنة أولى ومش عارف مين يوجهني صح!"</span>
          </div>

          {/* ACT 2: Golden Resala Invitation Ticket */}
          <div className={`resalaTicketCard ${styles.ticketCard}`}>
            <div className={styles.ticketIconBox}>
              📩
              <div className={styles.ticketPulse} />
            </div>
            <div className={styles.ticketContent}>
              <span className={styles.ticketTitle}>دعوة خاصة لحدث "ما وراء الطب" 🎉</span>
              <span className={styles.ticketBody}>
                أكبر مؤتمر توجيه طبي متكامل لطلاب كلية الطب — خطتك للنجاح والتفوق تبدأ هنا!
              </span>
            </div>
          </div>

          {/* ACT 3: Hope & Activity Feature Cards */}
          <div className={`cardHope1 ${styles.hopeCard} ${styles.hopePos1}`}>
            <div className={styles.hopeBadgeIcon}>🗺️</div>
            <div>
              <div className={styles.hopeTextTitle}>خارطة طريق السنوات الأولى</div>
              <div className={styles.hopeTextDesc}>خطط تنظيم وقت واستراتيجيات مذاكرة مجربة</div>
            </div>
          </div>

          <div className={`cardHope2 ${styles.hopeCard} ${styles.hopePos2}`}>
            <div className={styles.hopeBadgeIcon}>👥</div>
            <div>
              <div className={styles.hopeTextTitle}>جلسات توجيه فردية (Mentorship)</div>
              <div className={styles.hopeTextDesc}>تواصل مباشر مع استشاريين وأطباء كبار</div>
            </div>
          </div>

          <div className={`cardHope3 ${styles.hopeCard} ${styles.hopePos3}`}>
            <div className={styles.hopeBadgeIcon}>🔬</div>
            <div>
              <div className={styles.hopeTextTitle}>ورش عمل تفاعلية وطبية</div>
              <div className={styles.hopeTextDesc}>تطوير المهارات العلمية والعملية والشخصية</div>
            </div>
          </div>

          <div className={`cardHope4 ${styles.hopeCard} ${styles.hopePos4}`}>
            <div className={styles.hopeBadgeIcon}>🛡️</div>
            <div>
              <div className={styles.hopeTextTitle}>مجتمع طبي محفز وداعِم</div>
              <div className={styles.hopeTextDesc}>زملاء يشاركونك الشغف ويساندونك طوال الطريق</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Issues;