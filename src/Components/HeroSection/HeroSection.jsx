import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./HeroSection.module.css";
import LogoVisual from "./components/LogoVisual";
import EmotionalMessage from "./components/EmotionalMessage";
import HeroTitle from "./components/HeroTitle";
import HeroMeta from "./components/HeroMeta";

const HeroSection = () => {
  const containerRef = useRef(null);
  const logoWrapperRef = useRef(null);
  const logoGlowRef = useRef(null);
  const heroRightRef = useRef(null);
  const glassPanelRef = useRef(null);

  useGSAP(
    () => {
      // ── Logo Reveal ──────────────────────────────────────────
      gsap.fromTo(
        logoWrapperRef.current,
        { opacity: 0, scale: 0.7, filter: "blur(20px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.1, ease: "back.out(1.6)", delay: 0.1 }
      );

      // ── Glass Panel Reveal ────────────────────────────────────
      gsap.fromTo(
        glassPanelRef.current,
        { opacity: 0, y: 30, rotate: -10 },
        { opacity: 1, y: 0, rotate: -6, duration: 1.4, ease: "power3.out", delay: 0.2 }
      );

      // ── Right Content: staggered children ────────────────────
      // Animate heroRight children one by one using stagger on direct children
      gsap.fromTo(
        heroRightRef.current.children,
        { opacity: 0, y: 35, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.14,
          delay: 0.3,
        }
      );

      // ── Floating logo loop ────────────────────────────────────
      gsap.to(logoWrapperRef.current, {
        y: "-=14",
        duration: 3.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // ── Glow ring pulse loop ──────────────────────────────────
      gsap.to(logoGlowRef.current, {
        scale: 1.22,
        opacity: 0.65,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // ── Glass panel slow drift ────────────────────────────────
      gsap.to(glassPanelRef.current, {
        y: "-=18",
        rotate: -4,
        duration: 5,
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
      <div className={styles.bgGrid} />
      <div className={styles.bgSpotlight} />
      <div className={styles.bgGlowLeft} />
      <div className={styles.bgGlowRight} />

      {/* Floating decorative glass panel */}
      <div ref={glassPanelRef} className={styles.glassPanelLeft} />

      {/* HERO SPLIT LAYOUT */}
      <div className={styles.heroLayout}>
        {/* LEFT: Activity Logo */}
        <LogoVisual logoWrapperRef={logoWrapperRef} logoGlowRef={logoGlowRef} />

        {/* RIGHT: Editorial Content */}
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
