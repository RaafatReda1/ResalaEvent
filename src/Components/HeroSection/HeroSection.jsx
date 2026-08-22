import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./HeroSection.module.css";

// Questions/Thoughts list representing student anxiety before medical school
const THOUGHTS = [
  { id: 1, text: "هبدأ منين؟", x: "14%", y: "25%", rotate: "-5deg", variant: "card" },
  { id: 2, text: "هدرس إيه؟", x: "26%", y: "68%", rotate: "3deg", variant: "tag" },
  { id: 3, text: "أذاكر إزاي؟", x: "40%", y: "20%", rotate: "-2deg", variant: "plain" },
  { id: 4, text: "هل الطب صعب؟", x: "54%", y: "74%", rotate: "4deg", variant: "card" },
  { id: 5, text: "هعرف أواكب؟", x: "67%", y: "24%", rotate: "-4deg", variant: "tag" },
  { id: 6, text: "هعمل صحاب؟", x: "78%", y: "65%", rotate: "5deg", variant: "plain" },
  { id: 7, text: "نظام الكلية إيه؟", x: "36%", y: "79%", rotate: "-3deg", variant: "card" },
  { id: 8, text: "هل أنا اخترت صح؟", x: "85%", y: "26%", rotate: "2deg", variant: "tag" },
];

const HeroSection = () => {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const timelineTrackRef = useRef(null);
  const timelineBeamRef = useRef(null);
  const energyOrbGroupRef = useRef(null);
  const ripple1Ref = useRef(null);
  const ripple2Ref = useRef(null);
  const date03Ref = useRef(null);
  const date04Ref = useRef(null);

  useGSAP(
    () => {
      const path = pathRef.current;
      if (!path) return;

      const pathLength = path.getTotalLength();

      // 1. Initial SVG path properties
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      // SVG Timeline Beam Length (1450 - 150 = 1300)
      const beamLength = 1300;
      gsap.set(timelineBeamRef.current, {
        strokeDasharray: beamLength,
        strokeDashoffset: beamLength,
        opacity: 1,
      });

      // 2. Master GSAP Timeline
      const introTimeline = gsap.timeline();

      // SCENE 01: Draw the ECG heartbeat line (6 seconds)
      introTimeline.to(path, {
        strokeDashoffset: 0,
        duration: 6,
        ease: "power1.inOut",
      });

      // SCENE 02: Pop up thought bubbles one by one while ECG is drawing
      introTimeline.fromTo(
        `.${styles.thoughtItem}`,
        { opacity: 0, scale: 0.6 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          stagger: 0.55,
        },
        1.0
      );

      // SCENE 03: Final Heartbeat Pulse Peak (at ~90% of ECG drawing)
      introTimeline.to(
        path,
        {
          filter: "drop-shadow(0px 0px 30px rgba(58, 185, 172, 1))",
          strokeWidth: 5,
          duration: 0.35,
          yoyo: true,
          repeat: 1,
        },
        5.2
      );

      // SCENE 04: Heartbeat line flattens into the SVG timeline track!
      introTimeline.to(
        path,
        {
          scaleY: 0,
          transformOrigin: "800px 200px",
          opacity: 0,
          duration: 0.7,
          ease: "power2.inOut",
        },
        "+=0.2"
      );

      // Fade in base timeline track at the exact same moment
      introTimeline.to(
        timelineTrackRef.current,
        { opacity: 0.5, duration: 0.5 },
        "<"
      );

      // Reveal Date Badges (03 SEP & 04 SEP)
      introTimeline.fromTo(
        [date03Ref.current, date04Ref.current],
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)", stagger: 0.15 },
        "-=0.3"
      );

      // SCENE 05: Energy Orb & Progress Laser Beam Glide (from x=150 to x=1450)
      introTimeline.to(
        energyOrbGroupRef.current,
        { opacity: 1, duration: 0.3 },
        "<"
      );

      introTimeline.fromTo(
        energyOrbGroupRef.current,
        { x: 150, y: 200 },
        {
          x: 1450,
          y: 200,
          duration: 3.5,
          ease: "power1.inOut",
          onUpdate: function () {
            // Live update dynamic background spotlight following orb position
            const currentX = gsap.getProperty(energyOrbGroupRef.current, "x");
            const progressPercent = ((currentX - 150) / 1300) * 100;
            if (containerRef.current) {
              containerRef.current.style.setProperty("--spotlight-x", `${progressPercent}%`);
            }
          },
        },
        "<"
      );

      introTimeline.to(
        timelineBeamRef.current,
        {
          strokeDashoffset: 0,
          duration: 3.5,
          ease: "power1.inOut",
        },
        "<"
      );

      // SCENE 06: Move thought popups backwards towards the dimmed side & pop them away sequentially as timeline advances
      introTimeline.to(
        `.${styles.thoughtItem}`,
        {
          x: "-=70",
          scale: 0,
          opacity: 0,
          duration: 0.6,
          ease: "back.in(1.7)",
          stagger: {
            amount: 2.8,
            from: "start",
          },
        },
        "<" // Synchronized with energy orb forward glide
      );


      // Shockwave ripple animations for energy orb
      gsap.to(ripple1Ref.current, {
        scale: 2.4,
        opacity: 0,
        duration: 1.2,
        repeat: -1,
        ease: "power1.out",
      });

      gsap.to(ripple2Ref.current, {
        scale: 1.9,
        opacity: 0,
        duration: 0.9,
        repeat: -1,
        ease: "power1.out",
        delay: 0.3,
      });

      // Subtle floating movement for thoughts
      gsap.utils.toArray(`.${styles.thoughtItem}`).forEach((item, index) => {
        gsap.to(item, {
          y: index % 2 === 0 ? "-=8" : "+=8",
          duration: 2 + (index % 3) * 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.0 + index * 0.55,
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Background Ambient Spotlight reacting to energy orb movement */}
      <div className={styles.ambientSpotlight} />

      {/* SVG Canvas for ECG Path, Timeline, and Energy Orb */}
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
  );
};

export default HeroSection;



