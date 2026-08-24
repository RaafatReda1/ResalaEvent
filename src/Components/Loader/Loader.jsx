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
      duration: 0.5,
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

      // 2. Master GSAP Timeline (Scenes 01 to 07 without Date Merge)
      const masterTl = gsap.timeline({
        onComplete: () => {
          finishIntro();
        },
      });
      masterTimelineRef.current = masterTl;

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

      // SCENE 07: Arrival impact pulse on 04 SEP & fade out 03 SEP (No merging!)
      masterTl.to(
        date03Ref.current,
        {
          opacity: 0,
          scale: 0.8,
          duration: 0.4,
          ease: "power2.out",
        }
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

      // Pause briefly at 04 SEP highlight before transitioning to Hero
      masterTl.to({}, { duration: 0.5 });

      // Shockwave ripple loops for energy orb
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
    if (masterTimelineRef.current) {
      masterTimelineRef.current.kill();
    }
    finishIntro();
  };

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Dynamic Background Spotlight */}
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
