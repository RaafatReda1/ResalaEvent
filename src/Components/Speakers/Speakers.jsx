import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./Speakers.module.css";

gsap.registerPlugin(ScrollTrigger);

const speakers = [
  {
    name: "د. نجلاء فاروق",
    nameEn: "Dr. Naglaa Farouk",
    title: "رئيسة النشاط الطبي",
    titleEn: "Head of Medical Activity",
    imageSrc: "./drNagalaa.png",
    bgImage: "./drNagalaa.jpeg",
    accent: "#3AB9AC",
    accentRgb: "58,185,172",
    number: "01",
  },
  {
    name: "د. رانيا عبد الجليل",
    nameEn: "Dr. Rania Abd Al-Galil",
    title: "رئيسة النشاط الطبي",
    titleEn: "Head of Medical Activity",
    imageSrc: "./drRania.png",
    bgImage: "./drRania.jpeg",
    accent: "#E63946",
    accentRgb: "230,57,70",
    number: "02",
  },
  {
    name: "أ. معتصم",
    nameEn: "Br. Mo3tasem",
    title: "المدير التنفيذي",
    titleEn: "Executive Director",
    imageSrc: "./mon3mBlack.jpeg",
    bgImage: "./mon3mBg.jpeg",
    accent: "#EAB308",
    accentRgb: "234,179,8",
    number: "03",
  },
  {
    name: "أ. حسيب",
    nameEn: "Br. Hassib",
    title: "مدير البرامج",
    titleEn: "Programs Director",
    imageSrc: "./hassibBlack.jpeg",
    bgImage: "./hassibBg.jpeg",
    accent: "#8B5CF6",
    accentRgb: "139,92,246",
    number: "04",
  },
];

const SpeakerCard = ({ speaker, index, activeIndex, onHover, onLeave }) => {
  const cardRef   = useRef(null);
  const imgRef    = useRef(null);
  const infoRef   = useRef(null);
  const numberRef = useRef(null);
  const glowRef   = useRef(null);
  const isActive = activeIndex === index;

  useGSAP(
    () => {
      const img  = imgRef.current;
      const info = infoRef.current;
      const num  = numberRef.current;
      const glow = glowRef.current;

      if (!img || !info || !num || !glow) return;

      // Only kill tweens on the inner elements — NEVER on cardRef
      // so the parent ScrollTrigger entrance animation is never interrupted.
      gsap.killTweensOf([img, info, num, glow]);

      if (isActive) {
        gsap.to(img, {
          scale: 1.08,
          filter: "brightness(1) contrast(1.05) saturate(1.1)",
          duration: 0.6,
          ease: "power3.out",
          overwrite: "auto",
        });
        gsap.to(glow, {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(info, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          delay: 0.06,
          overwrite: "auto",
        });
        gsap.to(num, {
          opacity: 0.07,
          scale: 1.25,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else {
        gsap.to(img, {
          scale: 1,
          filter: "brightness(0.3) contrast(1) saturate(0.7)",
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto",
        });
        gsap.to(glow, {
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
          overwrite: "auto",
        });
        gsap.to(info, {
          opacity: 0,
          y: 20,
          duration: 0.25,
          ease: "power2.in",
          overwrite: "auto",
        });
        gsap.to(num, {
          opacity: 0.35,
          scale: 1,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    },
    { dependencies: [isActive], scope: cardRef },
  );

  return (
    <div
      ref={cardRef}
      className={`${styles.speakerCard} ${isActive ? styles.speakerCardActive : ""}`}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
      style={{ "--accent": speaker.accent, "--accent-rgb": speaker.accentRgb }}
    >
      {/* Background photo */}
      <div
        className={styles.cardBgLayer}
        style={{ backgroundImage: `url(${speaker.bgImage})` }}
      />

      {/* Accent glow */}
      <div
        ref={glowRef}
        className={styles.cardGlowOverlay}
        style={{
          background: `radial-gradient(ellipse at bottom, rgba(${speaker.accentRgb},0.5) 0%, transparent 68%)`,
        }}
      />

      {/* Dark scrim */}
      <div className={styles.cardScrim} />

      {/* Portrait — wrapper handles centering so GSAP scale never
           conflicts with CSS translateX(-50%) on the same element */}
      <div className={styles.speakerImgWrapper}>
        <img
          ref={imgRef}
          src={speaker.imageSrc}
          alt={speaker.nameEn}
          className={styles.speakerImg}
        />
      </div>

      {/* Number watermark */}
      <span ref={numberRef} className={styles.cardNumber}>
        {speaker.number}
      </span>

      {/* Bottom accent bar */}
      <div
        className={styles.accentBar}
        style={{ background: speaker.accent }}
      />

      {/* Info panel */}
      <div ref={infoRef} className={styles.speakerInfo}>
        <span
          className={styles.speakerBadge}
          style={{
            color: speaker.accent,
            borderColor: `rgba(${speaker.accentRgb},0.35)`,
          }}
        >
          {speaker.titleEn}
        </span>
        <h3 className={styles.speakerName}>{speaker.name}</h3>
        <p className={styles.speakerNameEn}>{speaker.nameEn}</p>
        <p className={styles.speakerTitle}>{speaker.title}</p>
        <div
          className={styles.speakerDivider}
          style={{
            background: `linear-gradient(90deg, ${speaker.accent}, transparent)`,
          }}
        />
      </div>
    </div>
  );
};

const Speakers = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef(null);
  const decorRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          once: true,
        },
      });

      tl.fromTo(
        decorRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          transformOrigin: "left center",
        },
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" },
          "-=0.45",
        )
        .fromTo(
          headingRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.85, ease: "power3.out" },
          "-=0.45",
        )
        .fromTo(
          Array.from(cardsRef.current?.children || []),
          { opacity: 0, y: 70, scale: 0.93 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.14,
          },
          "-=0.4",
        );
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.speakersSection}>
      {/* Background environment */}
      <div className={styles.bgBase} />
      <div className={styles.bgGrid} />
      <div className={styles.bgCoronaLeft} />
      <div className={styles.bgCoronaRight} />
      <div className={styles.bgScanLine} />
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />

      {/* Section heading */}
      <div className={styles.sectionHeading}>
        <div ref={decorRef} className={styles.headingDecor} />
        <p ref={subtitleRef} className={styles.sectionSubtitle}>
          FEATURED SPEAKERS
        </p>
        <h2 ref={headingRef} className={styles.sectionTitle}>
          المتحدثون
        </h2>
      </div>

      {/* Speaker cards */}
      <div ref={cardsRef} className={styles.speakersContainer}>
        {speakers.map((speaker, index) => (
          <SpeakerCard
            key={index}
            speaker={speaker}
            index={index}
            activeIndex={activeIndex}
            onHover={setActiveIndex}
            onLeave={() => setActiveIndex(null)}
          />
        ))}
      </div>
    </section>
  );
};

export default Speakers;
