import { useRef, useEffect } from 'react';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { HelpCircle, AlertTriangle, Bell, CheckCircle2, Compass, Users, Sparkles, BookOpen } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './Issues.module.css';

gsap.registerPlugin(ScrollTrigger);

const Issues = () => {
  const containerRef = useRef(null);
  const currentSceneRef = useRef(1);

  // Initialize Rive with GirlState State Machine
  const { rive, RiveComponent } = useRive({
    src: '/phoneGirl.riv',
    stateMachines: 'GirlState',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  // Access Rive State Machine Inputs for interactive continuous head movement
  const headTD = useStateMachineInput(rive, 'GirlState', 'Head_TD');
  const headLR = useStateMachineInput(rive, 'GirlState', 'Head_LR');

  // Pose switching fallback function
  const updateRivePose = (sceneNumber, progress = 0) => {
    if (!rive) return;
    try {
      // 1. If State Machine Inputs are available, drive character head direction & emotion smoothly
      if (headTD && headLR) {
        if (sceneNumber === 1) {
          // Scene 1: Look down at phone anxious
          headTD.value = -70;
          headLR.value = 0;
        } else if (sceneNumber === 2) {
          // Scene 2: Look up & smile at notification
          headTD.value = 70;
          headLR.value = 0;
        } else if (sceneNumber === 3) {
          // Scene 3: Look around dynamically left and right as popups appear
          headTD.value = 20;
          const swing = Math.sin(progress * 25) * 65;
          headLR.value = swing;
        }
        return;
      }

      // 2. Fallback to direct animation playback if State Machine inputs are unmapped
      const anims = rive.animationNames || [];
      let targetAnim = anims[0];
      if (sceneNumber === 1) {
        targetAnim = anims.find(a => a.includes('Idle') || a.includes('idle')) || anims[0];
      } else if (sceneNumber === 2) {
        targetAnim = anims.find(a => a.includes('up') || a.includes('Look_up')) || anims[1] || anims[0];
      } else if (sceneNumber === 3) {
        targetAnim = anims.find(a => a.includes('Sides') || a.includes('Smile')) || anims[2] || anims[0];
      }

      if (targetAnim && !rive.isPlaying(targetAnim)) {
        rive.play(targetAnim);
      }
    } catch (err) {
      console.warn('Rive update error:', err);
    }
  };

  // Sync initial scene pose as soon as Rive instance finishes HTTP loading
  useEffect(() => {
    if (rive) {
      updateRivePose(currentSceneRef.current);
    }
  }, [rive, headTD, headLR]);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=350%', // 350vh scroll distance for full narrative timing
          scrub: 0.8,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
          markers: true, // Development markers
          onUpdate: (self) => {
            const p = self.progress;
            let targetScene = 1;
            if (p < 0.30) {
              targetScene = 1;
            } else if (p >= 0.30 && p < 0.60) {
              targetScene = 2;
            } else {
              targetScene = 3;
            }

            if (currentSceneRef.current !== targetScene) {
              currentSceneRef.current = targetScene;
              if (containerRef.current) {
                containerRef.current.setAttribute('data-scene', String(targetScene));
              }
            }

            // Continuously drive head position and emotions during scroll
            updateRivePose(targetScene, p);
          },
        },
      });

      // ═════════════════════════════════════════════════════════════
      // SCENE 1: ANXIETY & TENSION (0.00 ➔ 0.30)
      // ═════════════════════════════════════════════════════════════

      // Anxiety Card 1 enters
      tl.fromTo(
        '.cardAnxiety1',
        { opacity: 0, y: 35, scale: 0.85, filter: 'blur(10px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.08, ease: 'power3.out' },
        0.02
      );

      // Anxiety Card 2 enters
      tl.fromTo(
        '.cardAnxiety2',
        { opacity: 0, y: 35, scale: 0.85, filter: 'blur(10px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.08, ease: 'power3.out' },
        0.09
      );

      // Anxiety Card 3 enters
      tl.fromTo(
        '.cardAnxiety3',
        { opacity: 0, y: 35, scale: 0.85, filter: 'blur(10px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.08, ease: 'power3.out' },
        0.16
      );

      // Fade out ALL Anxiety Cards before Scene 2 starts
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
        0.25
      );

      // ═════════════════════════════════════════════════════════════
      // SCENE 2: RESALA NOTIFICATION FLASH (0.30 ➔ 0.60)
      // ═════════════════════════════════════════════════════════════

      // Notification Card pops up in center
      tl.fromTo(
        '.resalaNotifCard',
        { opacity: 0, y: -50, scale: 0.7, filter: 'blur(12px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.12, ease: 'back.out(1.6)' },
        0.32
      );

      // Notification Card shrinks and fades out before Scene 3 starts
      tl.to(
        '.resalaNotifCard',
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
      // SCENE 3: CELEBRATION & ACTIVITIES (0.60 ➔ 1.00)
      // ═════════════════════════════════════════════════════════════

      // Activity 1 pops in (Top Right)
      tl.fromTo(
        '.cardHope1',
        { opacity: 0, y: 40, scale: 0.8, filter: 'blur(10px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.08, ease: 'power3.out' },
        0.62
      );

      // Activity 2 pops in (Top Left)
      tl.fromTo(
        '.cardHope2',
        { opacity: 0, y: 40, scale: 0.8, filter: 'blur(10px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.08, ease: 'power3.out' },
        0.70
      );

      // Activity 3 pops in (Bottom Right)
      tl.fromTo(
        '.cardHope3',
        { opacity: 0, y: 40, scale: 0.8, filter: 'blur(10px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.08, ease: 'power3.out' },
        0.78
      );

      // Activity 4 pops in (Bottom Left)
      tl.fromTo(
        '.cardHope4',
        { opacity: 0, y: 40, scale: 0.8, filter: 'blur(10px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.08, ease: 'power3.out' },
        0.86
      );

      // Hold Scene 3 visible until end
      tl.to({}, { duration: 0.06 }, 0.94);

      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);

      return () => clearTimeout(timer);
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className={styles.issuesSection} data-scene="1">
      {/* Mood Light Overlay & Ambient Grid */}
      <div className={styles.moodOverlay} />
      <div className={styles.bgGrid} />

      {/* Header Badges & Titles per Scene */}
      <div className={styles.headerWrapper}>
        <div className={`${styles.sceneBadge} ${styles.badgeScene1}`}>
          <AlertTriangle size={16} />
          <span>التحديات والأوهام في سنة أولى طب</span>
        </div>
        <div className={`${styles.sceneBadge} ${styles.badgeScene2}`}>
          <Bell size={16} />
          <span>إشعار خاص بحدث "ما وراء الطب"</span>
        </div>
        <div className={`${styles.sceneBadge} ${styles.badgeScene3}`}>
          <Sparkles size={16} />
          <span>ماذا يقدم لك حدث "ما وراء الطب"؟</span>
        </div>

        <h2 className={`${styles.sceneTitle} ${styles.titleScene1}`}>تائه في بداية طريق الطب؟ لست وحدك!</h2>
        <h2 className={`${styles.sceneTitle} ${styles.titleScene2}`}>وصلتك الدعوة للحضور الأكبر!</h2>
        <h2 className={`${styles.sceneTitle} ${styles.titleScene3}`}>دليلك الشامل لتحويل الحيرة إلى ثقة ونجاح</h2>
      </div>

      {/* Stage: Rive Girl Character + Chronological Popups */}
      <div className={styles.stageContainer}>
        {/* Rive Canvas Character (Transparent background) */}
        <div className={styles.riveWrapper}>
          <RiveComponent className={styles.riveCanvas} />
        </div>

        {/* Popups Layer (Isolated per Scene) */}
        <div className={styles.popupsLayer}>
          {/* SCENE 1: Anxiety Popups */}
          <div className={`cardAnxiety1 ${styles.anxietyCard} ${styles.cardTopRight}`}>
            <div className={styles.anxietyIcon}><HelpCircle size={20} /></div>
            <span>"إزاي أظبط وقتي بين الكم الرهيب للمواد؟"</span>
          </div>

          <div className={`cardAnxiety2 ${styles.anxietyCard} ${styles.cardBottomLeft}`}>
            <div className={styles.anxietyIcon}><AlertTriangle size={20} /></div>
            <span>"حاسس إني تايه ومش عارف أبدأ ذاكرة منين!"</span>
          </div>

          <div className={`cardAnxiety3 ${styles.anxietyCard} ${styles.cardCenterRight}`}>
            <div className={styles.anxietyIcon}><HelpCircle size={20} /></div>
            <span>"هل الدراسة هتاخد كل حياتي الشخصية؟"</span>
          </div>

          {/* SCENE 2: Resala Notification Card Popup */}
          <div className={`resalaNotifCard ${styles.notificationCard}`}>
            <div className={styles.notifIconWrapper}>
              <Bell size={24} />
              <div className={styles.notifPulse} />
            </div>
            <div className={styles.notifContent}>
              <span className={styles.notifTitle}>إشعار هام من حدث "ما وراء الطب" 🎉</span>
              <span className={styles.notifBody}>
                تم إرسال دعوتك الخاصة لمؤتمر التوجيه الطبي الأكبر لدفعات كلية الطب!
              </span>
            </div>
          </div>

          {/* SCENE 3: Hope & Activity Feature Cards */}
          <div className={`cardHope1 ${styles.hopeCard} ${styles.hopePos1}`}>
            <div className={styles.hopeIcon}><Compass size={22} /></div>
            <div>
              <div className={styles.hopeTextTitle}>خارطة طريق السنوات الأولى</div>
              <div className={styles.hopeTextDesc}>خطط دراسية مجربة من الأوائل</div>
            </div>
          </div>

          <div className={`cardHope2 ${styles.hopeCard} ${styles.hopePos2}`}>
            <div className={styles.hopeIcon}><Users size={22} /></div>
            <div>
              <div className={styles.hopeTextTitle}>جلسات توجيه فردية</div>
              <div className={styles.hopeTextDesc}>تواصل مباشر مع استشاريين وأطباء</div>
            </div>
          </div>

          <div className={`cardHope3 ${styles.hopeCard} ${styles.hopePos3}`}>
            <div className={styles.hopeIcon}><BookOpen size={22} /></div>
            <div>
              <div className={styles.hopeTextTitle}>ورش عمل تفاعلية</div>
              <div className={styles.hopeTextDesc}>تطوير المهارات الطبية والشخصية</div>
            </div>
          </div>

          <div className={`cardHope4 ${styles.hopeCard} ${styles.hopePos4}`}>
            <div className={styles.hopeIcon}><CheckCircle2 size={22} /></div>
            <div>
              <div className={styles.hopeTextTitle}>بيئة محفزة وداعمة</div>
              <div className={styles.hopeTextDesc}>زملاء ومجتمع طبي متكامل يساندك</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Issues;