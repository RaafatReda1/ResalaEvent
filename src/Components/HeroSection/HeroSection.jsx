import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./HeroSection.module.css";

const HeroSection = () => {
  const containerRef = useRef(null);
  const pathRef = useRef(null);

  // GSAP animation for Scene 01: Drawing the ECG line smoothly
  useGSAP(
    () => {
      const path = pathRef.current;
      if (!path) return;

      // 1. Get the total pixel length of the SVG path
      const pathLength = path.getTotalLength();

      // 2. Set up initial path stroke state (completely hidden)
      // strokeDasharray creates dash pattern equal to pathLength
      // strokeDashoffset pushes the visible line off-screen
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      // 3. Animate strokeDashoffset to 0, which draws the ECG line from left to right
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 5,
        ease: "power1.inOut",
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={styles.container}>
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
    </div>
  );
};

export default HeroSection;

