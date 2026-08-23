import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./HeroSection.module.css";
import SideRays from "./SideRays";
import LogoVisual from "./components/LogoVisual";
import EmotionalMessage from "./components/EmotionalMessage";
import HeroTitle from "./components/HeroTitle";
import HeroMeta from "./components/HeroMeta";

const HeroSection = () => {
  const containerRef = useRef(null);
  const logoWrapperRef = useRef(null);
  const logoGlowRef = useRef(null);
  const heroRightRef = useRef(null);
  const glassCardRef = useRef(null);

  useGSAP(
    () => {
      // ── Logo reveal (transform + opacity ONLY — no filter) ──
      gsap.fromTo(logoWrapperRef.current,
        { opacity: 0, scale: 0.75 },
        { opacity: 1, scale: 1, duration: 1.0, ease: "back.out(1.5)", delay: 0.1 }
      );

      // ── Glass card reveal ────────────────────────────────────
      gsap.set(glassCardRef.current, { rotate: -8 });
      gsap.fromTo(glassCardRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.4, ease: "power3.out" }
      );

      // ── Right children stagger (transform + opacity ONLY) ────
      const kids = Array.from(heroRightRef.current.children);
      gsap.fromTo(kids,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.15,
          delay: 0.2,
        }
      );

      // ── Continuous loops (transform + opacity only) ──────────
      gsap.to(logoWrapperRef.current, {
        y: -14,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(logoGlowRef.current, {
        scale: 1.2,
        opacity: 0.55,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(glassCardRef.current, {
        y: -22,
        rotate: -5,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={styles.heroContainer}>
      {/* Background layers */}
      <div className={styles.bgBase} />
      {/* SideRays WebGL background */}
      <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
        <SideRays
          speed={2.5}
          rayColor1="#EAB308"
          rayColor2="#96c8ff"
          intensity={2}
          spread={2}
          origin="top-right"
          tilt={0}
          saturation={1.5}
          blend={0.75}
          falloff={1.6}
          opacity={1.0}
        />
      </div>

      <div className={styles.bgGrid} />
      <div className={styles.bgCoronaRight} />
      <div className={styles.bgCoronaLeft} />
      <div className={styles.bgScanLine} />
      <div className={styles.bgGlassOrb} />
      <div className={styles.bgGlassOrb2} />
      <div ref={glassCardRef} className={styles.bgGlassCard} />

      {/* Hero split layout */}
      <div className={styles.heroLayout}>
        <LogoVisual logoWrapperRef={logoWrapperRef} logoGlowRef={logoGlowRef} />

        <div ref={heroRightRef} className={styles.heroRight}>
          <EmotionalMessage />
          <HeroTitle />
          <HeroMeta />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
