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
          end: '+=350%', // 350vh scroll distance for full smooth narrative pacing
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

            setCurrentAct(act);
          },
        },
      });

      // ═════════════════════════════════════════════════════════════
      // ACT 1: ANXIETY & STUDENT STRUGGLES (0.00 ➔ 0.30)
      // ═════════════════════════════════════════════════════════════

      // Header 1 Fades In
      tl.fromTo(
        '.headerScene1',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.1, ease: 'power3.out' },
        0
      );

      // Background Crimson Glow
      tl.fromTo('.moodAnxietyBg', { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0);

      // Avatar scale & wiggle
      tl.fromTo(
        '.emojiAvatarItem',
        { scale: 0.6, rotate: -15 },
        { scale: 1, rotate: 0, duration: 0.1, ease: 'back.out(1.7)' },
        0
      );

      // Anxiety Cards enter with stagger — no filter blur for mobile perf
      tl.fromTo(
        '.cardAnxiety1',
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.08, ease: 'power3.out' },
        0.02
      );

      tl.fromTo(
        '.cardAnxiety2',
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.08, ease: 'power3.out' },
        0.09
      );

      tl.fromTo(
        '.cardAnxiety3',
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.08, ease: 'power3.out' },
        0.16
      );

      // Smooth Fade Out of Act 1 Header & Cards before Act 2
      tl.to(
        ['.cardAnxiety1', '.cardAnxiety2', '.cardAnxiety3'],
        {
          opacity: 0,
          y: -20,
          scale: 0.92,
          duration: 0.06,
          stagger: 0.015,
          ease: 'power2.in',
        },
        0.26
      );

      tl.to(
        '.headerScene1',
        { opacity: 0, y: -18, duration: 0.06 },
        0.26
      );

      tl.to('.moodAnxietyBg', { opacity: 0, duration: 0.08 }, 0.26);

      // ═════════════════════════════════════════════════════════════
      // ACT 2: THE GOLDEN RESALA INVITATION (0.30 ➔ 0.60)
      // ═════════════════════════════════════════════════════════════

      // Header 2 Fades In
      tl.fromTo(
        '.headerScene2',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.1, ease: 'power3.out' },
        0.30
      );

      // Background Notification Gold Flash
      tl.fromTo('.moodNotifBg', { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.30);

      // Avatar bounce
      tl.to(
        '.emojiAvatarItem',
        { scale: 1.18, rotate: 10, duration: 0.08, ease: 'bounce.out' },
        0.30
      );

      // Golden Ticket enters with spring pop
      tl.fromTo(
        '.resalaTicketCard',
        { opacity: 0, y: -40, scale: 0.82 },
        { opacity: 1, y: 0, scale: 1, duration: 0.12, ease: 'back.out(1.8)' },
        0.32
      );

      // Smooth Fade Out of Act 2 Ticket & Header before Act 3
      tl.to(
        '.resalaTicketCard',
        {
          opacity: 0,
          y: -20,
          scale: 0.9,
          duration: 0.08,
          ease: 'power2.in',
        },
        0.54
      );

      tl.to(
        '.headerScene2',
        { opacity: 0, y: -18, duration: 0.06 },
        0.54
      );

      tl.to('.moodNotifBg', { opacity: 0, duration: 0.08 }, 0.54);

      // ═════════════════════════════════════════════════════════════
      // ACT 3: CELEBRATION & EVENT PILLARS (0.60 ➔ 1.00)
      // ═════════════════════════════════════════════════════════════

      // Header 3 Fades In
      tl.fromTo(
        '.headerScene3',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.1, ease: 'power3.out' },
        0.60
      );

      // Background Emerald Celebration Glow
      tl.fromTo('.moodCelebBg', { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.60);

      // Avatar joy scale
      tl.to(
        '.emojiAvatarItem',
        { scale: 1.2, rotate: 0, duration: 0.08, ease: 'power2.out' },
        0.60
      );

      // Feature Cards enter — no blur for mobile perf
      tl.fromTo(
        '.cardHope1',
        { opacity: 0, y: 30, scale: 0.88 },
        { opacity: 1, y: 0, scale: 1, duration: 0.08, ease: 'power3.out' },
        0.62
      );

      tl.fromTo(
        '.cardHope2',
        { opacity: 0, y: 30, scale: 0.88 },
        { opacity: 1, y: 0, scale: 1, duration: 0.08, ease: 'power3.out' },
        0.70
      );

      tl.fromTo(
        '.cardHope3',
        { opacity: 0, y: 30, scale: 0.88 },
        { opacity: 1, y: 0, scale: 1, duration: 0.08, ease: 'power3.out' },
        0.78
      );

      tl.fromTo(
        '.cardHope4',
        { opacity: 0, y: 30, scale: 0.88 },
        { opacity: 1, y: 0, scale: 1, duration: 0.08, ease: 'power3.out' },
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
    <section ref={containerRef} className={styles.issuesSection}>
      {/* Background Mood Glow Overlays */}
      <div className={`moodAnxietyBg ${styles.moodBg} ${styles.moodAnxiety}`} />
      <div className={`moodNotifBg ${styles.moodBg} ${styles.moodNotification}`} />
      <div className={`moodCelebBg ${styles.moodBg} ${styles.moodCelebration}`} />
      <div className={styles.bgGrid} />

      {/* Header Narrative Scenes (Smooth Morphing via GSAP) */}
      <div className={styles.headerWrapper}>
        {/* Header Scene 1 */}
        <div className={`headerScene1 ${styles.headerScene}`}>
          <div className={`${styles.sceneBadge} ${styles.badgeAct1}`}>
            <AlertTriangle size={16} />
            <span>رحلة الطالب في سنة أولى طب</span>
          </div>
          <h2 className={styles.mainTitle}>ضغوط البدايات والتخبط الأكاديمي</h2>
        </div>

        {/* Header Scene 2 */}
        <div className={`headerScene2 ${styles.headerScene}`}>
          <div className={`${styles.sceneBadge} ${styles.badgeAct2}`}>
            <Bell size={16} />
            <span>نقطة التحول والفرصة الحقيقية</span>
          </div>
          <h2 className={styles.mainTitle}>دعوة خاصة لتحويل الحيرة إلى تميز 🎉</h2>
        </div>

        {/* Header Scene 3 */}
        <div className={`headerScene3 ${styles.headerScene}`}>
          <div className={`${styles.sceneBadge} ${styles.badgeAct3}`}>
            <Sparkles size={16} />
            <span>ركائز النجاح مع حدث "ما وراء الطب"</span>
          </div>
          <h2 className={styles.mainTitle}>كيف يُشكل هذا الحدث مستقبلك؟ ✨</h2>
        </div>
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
          {/* ACT 1: Professional Challenge Cards */}
          <div className={`cardAnxiety1 ${styles.anxietyCard} ${styles.anxietyPos1}`}>
            <div className={styles.anxietyIconBox}>💔</div>
            <div>
              <div className={styles.cardTitleText}>تراكم المواد الأكاديمية</div>
              <div className={styles.cardBodyText}>
                صعوبة تنظيم الوقت بين التكليفات والكم الرهيب للمناهج السريرية.
              </div>
            </div>
          </div>

          <div className={`cardAnxiety2 ${styles.anxietyCard} ${styles.anxietyPos2}`}>
            <div className={styles.anxietyIconBox}>📉</div>
            <div>
              <div className={styles.cardTitleText}>الرهبة من نظام الامتحانات</div>
              <div className={styles.cardBodyText}>
                التوتر المستمر من الكويزات الخاطفة والخوف من تدني الدرجات.
              </div>
            </div>
          </div>

          <div className={`cardAnxiety3 ${styles.anxietyCard} ${styles.anxietyPos3}`}>
            <div className={styles.anxietyIconBox}>🌀</div>
            <div>
              <div className={styles.cardTitleText}>غياب الخطة الموجهة</div>
              <div className={styles.cardBodyText}>
                السير بدون بوصلة أكاديمية أو مرشد يوضح لك خطوتك التالية.
              </div>
            </div>
          </div>

          {/* ACT 2: Golden Resala Invitation Ticket */}
          <div className={`resalaTicketCard ${styles.ticketCard}`}>
            <div className={styles.ticketIconBox}>
              📩
              <div className={styles.ticketPulse} />
            </div>
            <div className={styles.ticketContent}>
              <span className={styles.ticketTitle}>دعوة خاصة لحضور مؤتمر "ما وراء الطب" 🎉</span>
              <span className={styles.ticketBody}>
                انضم لأقوى حدث توجيهي طبي يبني رؤيتك الأكاديمية والشخصية ويصلك بنخبة قادة المجال.
              </span>
            </div>
          </div>

          {/* ACT 3: Professional Feature Pillars */}
          <div className={`cardHope1 ${styles.hopeCard} ${styles.hopePos1}`}>
            <div className={styles.hopeIconBox}>🗺️</div>
            <div>
              <div className={styles.hopeTextTitle}>خارطة طريق الأوائل</div>
              <div className={styles.hopeTextDesc}>
                استراتيجيات مذاكرة مجربة وخطط إدارة الوقت في السنوات الأولى.
              </div>
            </div>
          </div>

          <div className={`cardHope2 ${styles.hopeCard} ${styles.hopePos2}`}>
            <div className={styles.hopeIconBox}>👥</div>
            <div>
              <div className={styles.hopeTextTitle}>جلسات توجيه مباشر (Mentorship)</div>
              <div className={styles.hopeTextDesc}>
                حوارات شخصية ونقاشات مفتوحة مع أطباء واستشاريين كبار.
              </div>
            </div>
          </div>

          <div className={`cardHope3 ${styles.hopeCard} ${styles.hopePos3}`}>
            <div className={styles.hopeIconBox}>🔬</div>
            <div>
              <div className={styles.hopeTextTitle}>ورش عمل تطبيقية وطبية</div>
              <div className={styles.hopeTextDesc}>
                بناء المهارات الطبية والشخصية والبحث العلمي المبكر.
              </div>
            </div>
          </div>

          <div className={`cardHope4 ${styles.hopeCard} ${styles.hopePos4}`}>
            <div className={styles.hopeIconBox}>🛡️</div>
            <div>
              <div className={styles.hopeTextTitle}>مجتمع طبي داعم ومحفز</div>
              <div className={styles.hopeTextDesc}>
                بيئة تفاعلية تجمعك بزملاء ونخبة يشاركونك الشغف ويساندونك.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Issues;