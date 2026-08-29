import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./Loader.module.css";
import SkipButton from "./components/SkipButton";
import ThoughtsContainer from "./components/ThoughtsContainer";
import EcgCanvas from "./components/EcgCanvas";
import DateBadges from "./components/DateBadges";

const Loader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const timelineTrackRef = useRef(null);
  const timelineBeamRef = useRef(null);
  const energyOrbGroupRef = useRef(null);
  const ripple1Ref = useRef(null);
  const ripple2Ref = useRef(null);
  const date03Ref = useRef(null);
  const date04Ref = useRef(null);
  const masterTimelineRef = useRef(null);

  const isFinishingRef = useRef(false);

  const finishIntro = () => {
    if (isFinishingRef.current) return;
    isFinishingRef.current = true;

    if (!containerRef.current) {
      if (onComplete) onComplete();
      return;
    }

    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });
  };

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

      // 2. Master GSAP Timeline with graceful, cinematic pacing
      const masterTl = gsap.timeline({
        delay: 0.5, // Smooth initialization and settling buffer
        onComplete: () => {
          finishIntro();
        },
      });
      masterTimelineRef.current = masterTl;

      // SCENE 00: Ambient spotlight gently breathing in
      masterTl.fromTo(
        `.${styles.ambientSpotlight}`,
        { opacity: 0.3, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "power1.out" },
        0
      );

      // SCENE 01: Smooth, rhythmic & elegant drawing of the ECG heartbeat (2.6s)
      masterTl.to(
        path,
        {
          strokeDashoffset: 0,
          duration: 2.6,
          ease: "power2.inOut",
        },
        0.2
      );

      // SCENE 02: Thought popups popping out in relaxed, readable sequence
      masterTl.fromTo(
        `.${styles.thoughtItem}`,
        { opacity: 0, scale: 0.6, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.8)",
          stagger: 0.14,
        },
        0.6
      );

      // SCENE 03: Final Heartbeat Pulse Flash
      masterTl.to(
        path,
        {
          strokeWidth: 4.5,
          duration: 0.25,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
        },
        2.4
      );

      // SCENE 04: Heartbeat line smoothly flattens into the SVG timeline track
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
        { opacity: 0.45, duration: 0.35 },
        "<"
      );

      masterTl.fromTo(
        [date03Ref.current, date04Ref.current],
        { opacity: 0, scale: 0.75 },
        { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.7)", stagger: 0.12 },
        "-=0.2"
      );

      // SCENE 05: Energy Orb shoots across line to 04 SEP (1.8s graceful laser glide)
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
          duration: 1.8,
          ease: "power2.inOut",
        },
        "<"
      );

      masterTl.to(
        timelineBeamRef.current,
        {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: "power2.inOut",
        },
        "<"
      );

      // SCENE 06: Thoughts drift and dissolve gracefully
      masterTl.to(
        `.${styles.thoughtItem}`,
        {
          x: "-=50",
          scale: 0.45,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
          stagger: {
            amount: 1.0,
            from: "start",
          },
        },
        "<+=0.2"
      );

      // SCENE 07: Arrival impact pulse on 04 SEP & fade out 03 SEP
      masterTl.to(
        date03Ref.current,
        {
          opacity: 0,
          scale: 0.85,
          duration: 0.35,
          ease: "power2.out",
        },
        "-=0.2"
      );

      masterTl.to(
        date04Ref.current,
        {
          scale: 1.25,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        },
        "<"
      );

      // Comfortable pause on 04 SEP highlight before smooth fade-out
      masterTl.to({}, { duration: 0.6 });

      // Energy orb ripple shockwaves
      gsap.to(ripple1Ref.current, {
        scale: 2.3,
        opacity: 0,
        duration: 1.0,
        repeat: -1,
        ease: "power1.out",
      });

      gsap.to(ripple2Ref.current, {
        scale: 1.8,
        opacity: 0,
        duration: 0.8,
        repeat: -1,
        ease: "power1.out",
        delay: 0.2,
      });
    },
    { scope: containerRef }
  );

  const handleSkipIntro = () => {
    if (masterTimelineRef.current) {
      masterTimelineRef.current.kill();
    }
    finishIntro();
  };

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Background ambient lighting */}
      <div className={styles.ambientSpotlight} />
      <div className={styles.bgGlowLeft} />
      <div className={styles.bgGlowRight} />

      {/* Skip Intro Control Sub-component */}
      <SkipButton onSkip={handleSkipIntro} />

      {/* SVG Canvas Sub-component */}
      <EcgCanvas
        pathRef={pathRef}
        timelineTrackRef={timelineTrackRef}
        timelineBeamRef={timelineBeamRef}
        energyOrbGroupRef={energyOrbGroupRef}
        ripple1Ref={ripple1Ref}
        ripple2Ref={ripple2Ref}
      />

      {/* Date Node Badges Sub-component */}
      <DateBadges ref={date03Ref} date04Ref={date04Ref} />

      {/* Floating Thoughts Sub-component */}
      <ThoughtsContainer />
    </div>
  );
};

export default Loader;
