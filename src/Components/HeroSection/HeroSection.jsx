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

  useGSAP(
    () => {
      const heroTl = gsap.timeline();

      // Reveal Left Logo with smooth scale and blur-to-sharp animation
      heroTl.fromTo(
        logoWrapperRef.current,
        {
          opacity: 0,
          scale: 0.7,
          filter: "blur(20px)",
        },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.0,
          ease: "back.out(1.6)",
        }
      );

      // Reveal Right Content (Emotional Message, Headline, Date & CTA)
      heroTl.fromTo(
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
          duration: 1.0,
          ease: "power3.out",
        },
        "-=0.6"
      );

      // Continuous 3D Floating motion for Activity Logo
      gsap.to(logoWrapperRef.current, {
        y: "-=12",
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Continuous pulse for Logo Glow Ring
      gsap.to(logoGlowRef.current, {
        scale: 1.25,
        opacity: 0.7,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={styles.heroContainer}>
      {/* Background Ambient Lighting */}
      <div className={styles.bgSpotlight} />
      <div className={styles.bgGlowLeft} />
      <div className={styles.bgGlowRight} />

      {/* MAIN HERO SPLIT LAYOUT */}
      <div className={styles.heroLayout}>
        {/* LEFT SIDE: Activity Logo Sub-component */}
        <LogoVisual logoWrapperRef={logoWrapperRef} logoGlowRef={logoGlowRef} />

        {/* RIGHT SIDE: Hero Editorial Content Sub-components */}
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
