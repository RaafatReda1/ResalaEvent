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

  useGSAP(
    () => {
      const path = pathRef.current;
      if (!path) return;

      const pathLength = path.getTotalLength();

      // 1. Prepare initial stroke state for ECG path
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      // 2. Create GSAP Master Timeline for Scene 01 & Scene 02
      const introTimeline = gsap.timeline();

      // SCENE 01: Draw the ECG heartbeat line
      introTimeline.to(path, {
        strokeDashoffset: 0,
        duration: 7,
        ease: "power1.inOut",
      });

      // SCENE 02: Pop up thought bubbles one by one while ECG is drawing
      // We use `stagger` so each thought pops up 0.65s after the previous one
      introTimeline.fromTo(
        `.${styles.thoughtItem}`,
        {
          opacity: 0,
          scale: 0.6,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)", // Gives elastic "pop" feel
          stagger: 0.65,
        },
        1.0 // Position parameter: start 1 second into ECG drawing
      );

      // Subtle floating movement for thoughts after appearing (like floating in mind)
      gsap.utils.toArray(`.${styles.thoughtItem}`).forEach((item, index) => {
        gsap.to(item, {
          y: index % 2 === 0 ? "-=8" : "+=8",
          duration: 2 + (index % 3) * 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.0 + index * 0.65,
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={styles.container}>
      {/* SCENE 01: ECG Path */}
      <div className={styles.svgWrapper}>
        <svg viewBox="0 0 1600 400" xmlns="http://www.w3.org/2000/svg">
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
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
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


