import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./HeroSection.module.css";

// Questions/Thoughts list representing student anxiety before medical school
const THOUGHTS = [
  { id: 1, text: "هبدأ منين؟", x: "14%", y: "24%", rotate: "-5deg", variant: "card" },
  { id: 2, text: "هدرس إيه؟", x: "26%", y: "68%", rotate: "3deg", variant: "tag" },
  { id: 3, text: "أذاكر إزاي؟", x: "40%", y: "18%", rotate: "-2deg", variant: "plain" },
  { id: 4, text: "هل الطب صعب؟", x: "54%", y: "74%", rotate: "4deg", variant: "card" },
  { id: 5, text: "هعرف أواكب؟", x: "67%", y: "22%", rotate: "-4deg", variant: "tag" },
  { id: 6, text: "هعمل صحاب؟", x: "78%", y: "65%", rotate: "5deg", variant: "plain" },
  { id: 7, text: "نظام الكلية إيه؟", x: "36%", y: "80%", rotate: "-3deg", variant: "card" },
  { id: 8, text: "هل أنا اخترت صح؟", x: "85%", y: "26%", rotate: "2deg", variant: "tag" },
];

const HeroSection = () => {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const introOverlayRef = useRef(null);
  const timelineTrackRef = useRef(null);
  const timelineBeamRef = useRef(null);
  const energyOrbGroupRef = useRef(null);
  const ripple1Ref = useRef(null);
  const ripple2Ref = useRef(null);
  const date03Ref = useRef(null);
  const date04Ref = useRef(null);

  // Main Hero Layout Refs
  const heroLayoutRef = useRef(null);
  const logoWrapperRef = useRef(null);
  const logoGlowRef = useRef(null);
  const heroRightRef = useRef(null);
  const introTimelineRef = useRef(null);

  useGSAP(
    () => {
      const path = pathRef.current;
      if (!path) return;

      const pathLength = path.getTotalLength();

      // 1. Initial SVG path stroke setup
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      const beamLength = 1300;
      gsap.set(timelineBeamRef.current, {
        strokeDasharray: beamLength,
        strokeDashoffset: beamLength,
        opacity: 1,
      });

      // 2. Master GSAP Cinematic Timeline (Paced for high-energy pro performance)
      const masterTl = gsap.timeline();
      introTimelineRef.current = masterTl;

      // SCENE 01: Fast, rhythmic drawing of the ECG heartbeat (3.5s)
      masterTl.to(path, {
        strokeDashoffset: 0,
        duration: 3.5,
        ease: "power2.inOut",
      });

      // SCENE 02: Thought popups pop out in snappy sequence
      masterTl.fromTo(
        `.${styles.thoughtItem}`,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "back.out(2)",
          stagger: 0.22,
        },
        0.6
      );

      // SCENE 03: Final Heartbeat Pulse Flash (0.25s)
      masterTl.to(
        path,
        {
          filter: "drop-shadow(0px 0px 35px rgba(58, 185, 172, 1))",
          strokeWidth: 5,
          duration: 0.25,
          yoyo: true,
          repeat: 1,
        },
        3.0
      );

      // SCENE 04: Heartbeat line flattens into the SVG timeline track
      masterTl.to(
        path,
        {
          scaleY: 0,
          transformOrigin: "800px 200px",
          opacity: 0,
          duration: 0.5,
          ease: "power3.inOut",
        },
        "+=0.1"
      );

      masterTl.to(
        timelineTrackRef.current,
        { opacity: 0.4, duration: 0.3 },
        "<"
      );

      masterTl.fromTo(
        [date03Ref.current, date04Ref.current],
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)", stagger: 0.1 },
        "-=0.2"
      );

      // SCENE 05: Energy Orb shoots across line to 04 SEP (2.2s laser glide)
      masterTl.to(
        energyOrbGroupRef.current,
        { opacity: 1, duration: 0.2 },
        "<"
      );

      masterTl.fromTo(
        energyOrbGroupRef.current,
        { x: 150, y: 200 },
        {
          x: 1450,
          y: 200,
          duration: 2.2,
          ease: "power2.inOut",
          onUpdate: function () {
            const currentX = gsap.getProperty(energyOrbGroupRef.current, "x");
            const progressPercent = ((currentX - 150) / 1300) * 100;
            if (containerRef.current) {
              containerRef.current.style.setProperty("--spotlight-x", `${progressPercent}%`);
            }
          },
        },
        "<"
      );

      masterTl.to(
        timelineBeamRef.current,
        {
          strokeDashoffset: 0,
          duration: 2.2,
          ease: "power2.inOut",
        },
        "<"
      );

      // SCENE 06: Thoughts drift backwards to the left and dissolve into mist
      masterTl.to(
        `.${styles.thoughtItem}`,
        {
          x: "-=80",
          scale: 0.2,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
          stagger: {
            amount: 1.6,
            from: "start",
          },
        },
        "<"
      );

      // SCENE 07: Arrival impact flash on 04 SEP badge
      masterTl.to(
        date04Ref.current,
        {
          scale: 1.2,
          duration: 0.25,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        }
      );

      // SCENE 08 & 10: Smooth Transition from Intro Canvas to Main Hero Layout
      masterTl.to(
        introOverlayRef.current,
        {
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: () => {
            if (introOverlayRef.current) {
              introOverlayRef.current.style.display = "none";
            }
          },
        },
        "+=0.2"
      );

      masterTl.to(
        heroLayoutRef.current,
        {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        "<"
      );

      // Reveal Logo on the LEFT SIDE of the Hero layout (Scene 08) with activitylogoNoFill.jpeg
      masterTl.fromTo(
        logoWrapperRef.current,
        {
          opacity: 0,
          scale: 0.6,
          filter: "blur(20px)",
        },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "back.out(1.6)",
        },
        "-=0.4"
      );

      // Reveal RIGHT SIDE Hero Content (Headline, Arabic message, CTA) (Scene 09 & 10)
      masterTl.fromTo(
        heroRightRef.current,
        {
          opacity: 0,
          x: 40,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
        },
        "-=0.6"
      );

      // Shockwave ripple loops
      gsap.to(ripple1Ref.current, {
        scale: 2.4,
        opacity: 0,
        duration: 1.0,
        repeat: -1,
        ease: "power1.out",
      });

      gsap.to(ripple2Ref.current, {
        scale: 1.9,
        opacity: 0,
        duration: 0.8,
        repeat: -1,
        ease: "power1.out",
        delay: 0.2,
      });

      // Pulse animation for logo glow ring
      gsap.to(logoGlowRef.current, {
        scale: 1.25,
        opacity: 0.7,
        duration: 2.0,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Subtle floating movement for logo
      gsap.to(logoWrapperRef.current, {
        y: "-=10",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Subtle floating movement for thoughts
      gsap.utils.toArray(`.${styles.thoughtItem}`).forEach((item, index) => {
        gsap.to(item, {
          y: index % 2 === 0 ? "-=8" : "+=8",
          duration: 2 + (index % 3) * 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.6 + index * 0.22,
        });
      });
    },
    { scope: containerRef }
  );

  const handleSkipIntro = () => {
    if (introTimelineRef.current) {
      introTimelineRef.current.progress(1);
    }
  };

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Dynamic Background Spotlight */}
      <div className={styles.ambientSpotlight} />
      <div className={styles.bgGlowLeft} />
      <div className={styles.bgGlowRight} />

      {/* Skip Intro Control */}
      <button onClick={handleSkipIntro} className={styles.skipBtn}>
        تخطي العرض | Skip Intro ✕
      </button>

      {/* INTRO OVERLAY: Scenes 01 to 08 (Cinematic Intro) */}
      <div ref={introOverlayRef} className={styles.introOverlay}>
        <div className={styles.svgWrapper}>
          <svg viewBox="0 0 1600 400" xmlns="http://www.w3.org/2000/svg" className={styles.svgElement}>
            <defs>
              <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--teal-500)" />
                <stop offset="40%" stopColor="var(--teal-200)" />
                <stop offset="80%" stopColor="var(--teal-300)" />
                <stop offset="100%" stopColor="var(--teal-400)" />
              </linearGradient>

              <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--teal-500)" />
                <stop offset="100%" stopColor="var(--teal-300)" />
              </linearGradient>

              <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* SCENE 01 & 03: ECG Path */}
            <path
              ref={pathRef}
              className={styles.ecgPath}
              d="M0,200 L15,206 L30,196 L48,204 L68,197 L90,200
                 C96,188 102,188 108,190 C110,192 112,200 114,200
                 L124,200 L130,208 L138,110 L148,245 L156,200 L164,200
                 C172,178 180,178 184,180 C190,182 198,200 204,200
                 L214,205 L226,196 L241,203 L258,197 L275,206 L292,198 L310,204 L328,197 L340,200
                 C346,192 352,192 358,194 C360,196 362,200 364,200
                 L374,200 L380,205 L388,145 L398,225 L406,200 L414,200
                 C422,190 430,190 434,188 C440,186 448,200 454,200
                 L470,207 L488,195 L505,203 L525,196 L548,206 L570,197 L595,204 L620,195 L648,205 L675,198 L700,203 L720,197 L740,200
                 C746,186 752,186 758,188 C761,192 763,197 764,200
                 L774,200 L780,210 L788,70 L798,270 L806,200 L814,200
                 C822,180 830,175 835,175 C842,175 848,200 854,200
                 L868,206 L885,195 L902,204 L920,196 L940,207 L960,197 L980,204 L1000,195 L1020,205 L1040,200
                 C1046,182 1052,182 1058,185 C1061,188 1063,197 1064,200
                 L1074,200 L1080,215 L1088,15 L1098,310 L1106,200 L1114,200
                 C1122,178 1130,165 1136,165 C1144,165 1150,200 1154,200
                 L1600,200"
              fill="none"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* SCENE 04: SVG Base Track Line */}
            <line
              ref={timelineTrackRef}
              x1="150"
              y1="200"
              x2="1450"
              y2="200"
              className={styles.timelineTrack}
              strokeLinecap="round"
            />

            {/* SCENE 05: Glowing Progress Laser Beam */}
            <line
              ref={timelineBeamRef}
              x1="150"
              y1="200"
              x2="1450"
              y2="200"
              className={styles.timelineBeam}
              strokeLinecap="round"
            />

            {/* SCENE 05: Energy Orb travelling along timeline */}
            <g ref={energyOrbGroupRef} className={styles.energyOrbGroup}>
              <circle ref={ripple1Ref} r="18" fill="none" stroke="var(--teal-300)" strokeWidth="1.5" opacity="0.6" />
              <circle ref={ripple2Ref} r="10" fill="none" stroke="var(--teal-200)" strokeWidth="2" opacity="0.8" />
              <circle r="6" fill="var(--gray-0)" filter="url(#laserGlow)" />
            </g>
          </svg>

          {/* Date Node Badges */}
          <div ref={date03Ref} className={`${styles.dateBadge} ${styles.date03}`}>
            <span className={styles.badgeDot} />
            <span className={styles.badgeText}>03 SEP</span>
          </div>

          <div ref={date04Ref} className={`${styles.dateBadge} ${styles.date04}`}>
            <span className={styles.badgeDotTarget} />
            <div className={styles.dateTextWrapper}>
              <span className={styles.badgeSub}>EVENT DAY</span>
              <span className={styles.badgeTextTarget}>04 SEP 2026</span>
            </div>
          </div>
        </div>

        {/* SCENE 02: Floating Thought Popups */}
        <div className={styles.thoughtsContainer}>
          {THOUGHTS.map((thought) => (
            <div
              key={thought.id}
              className={`${styles.thoughtItem} ${styles[thought.variant]}`}
              style={{
                left: thought.x,
                top: thought.y,
                transform: `rotate(${thought.rotate})`,
              }}
            >
              {thought.text}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN HERO LAYOUT (Revealed in Scene 08, 09, 10) */}
      <div ref={heroLayoutRef} className={styles.heroLayout}>
        {/* LEFT SIDE: Activity Logo NoFill Visual Focus (Scene 08) */}
        <div className={styles.heroLeft}>
          <div ref={logoWrapperRef} className={styles.logoWrapper}>
            <div ref={logoGlowRef} className={styles.logoGlowRing} />
            <img
              src="/activitylogoNoFill.jpeg"
              alt="Resala Medical Activity Logo"
              className={styles.logoImage}
              onError={(e) => {
                // Fallback options
                e.currentTarget.src = "/resalaLogoNofill.jpeg";
              }}
            />
          </div>
        </div>

        {/* RIGHT SIDE: Emotional Message, Editorial Headline, Date & CTA (Scene 09 & 10) */}
        <div ref={heroRightRef} className={styles.heroRight}>
          <div className={styles.emotionalMessage}>
            <span className={styles.messageSub}>أنت مش لازم تعرف كل حاجة لوحدك.</span>
            <span className={styles.messageMain}>إحنا هنا عشان نساعدك تبدأ أول خطوة.</span>
          </div>

          <h1 className={styles.heroTitle}>
            YOUR JOURNEY
            <span>INTO MEDICINE STARTS HERE.</span>
          </h1>

          <p className={styles.heroSubtitle}>
            تجربة التوجيه الطبي الأكثر تكاملاً والمصممة خصيصاً لجيل المستقبل من طلاب كلية الطب.
          </p>

          <div className={styles.heroMeta}>
            <div className={styles.datePill}>
              <span>📅</span>
              <span>04 SEPTEMBER 2026</span>
            </div>

            <button className={styles.ctaButton}>
              احجز مقعدك الآن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;




