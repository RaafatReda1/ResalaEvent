import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import useIsMobile from "../../hooks/useIsMobile";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import styles from "./Speakers.module.css";

gsap.registerPlugin(ScrollTrigger);

const speakers = [
  {
    name: "د. نجلاء فاروق",
    nameEn: "Dr. Naglaa Farouk",
    title: "رئيسة النشاط الطبي",
    titleEn: "Head of Medical Activity",
    imageSrc: "/drNagalaa.png",
    bgImage: "/drNaglaaFill.jpeg",
    accent: "#3AB9AC",
    accentRgb: "58,185,172",
    number: "01",
  },
  {
    name: "د. رانيا عبد الجليل",
    nameEn: "Dr. Rania Abd Al-Galil",
    title: "رئيسة النشاط الطبي",
    titleEn: "Head of Medical Activity",
    imageSrc: "/drRania.png",
    bgImage: "/drRaniaFill.jpeg",
    accent: "#E63946",
    accentRgb: "230,57,70",
    number: "02",
  },
  {
    name: "د. عمرو البركي",
    nameEn: "Dr. Amr Al-Braky",
    title: "المدير التنفيذي",
    titleEn: "Executive Director",
    imageSrc: "/amrNofill.png",
    bgImage: "/amrFilled.png",
    accent: "#EAB308",
    accentRgb: "234,179,8",
    number: "03",
  },
  {
    name: "د. حسام عيسي",
    nameEn: "Dr. Hossam Eissa",
    title: "مدير البرامج",
    titleEn: "Programs Director",
    imageSrc: "/hossamNoFill.png",
    bgImage: "/hossamFill.png",
    accent: "#8B5CF6",
    accentRgb: "139,92,246",
    number: "04",
  },
  {
    name: "د. منصور",
    nameEn: "Dr. Mansour",
    title: "مدير البرامج",
    titleEn: "Programs Director",
    imageSrc: "/drMansour.png",
    bgImage: "/drMansour.png",
    accent: "#2889ff",
    accentRgb: "40,137,255",
    number: "05",
  },
];

const SpeakerCard = ({ speaker, index, activeIndex, onHover, onLeave, isMobile }) => {
  const isActive = activeIndex === index;

  return (
    <div
      className={`${styles.speakerCard} ${isActive ? styles.speakerCardActive : ""}`}
      onMouseEnter={() => !isMobile && onHover(index)}
      onMouseLeave={() => !isMobile && onLeave()}
      onClick={() => isMobile && onHover(index)}
      style={{ "--accent": speaker.accent, "--accent-rgb": speaker.accentRgb }}
    >
      {/* Background photo layer */}
      <div
        className={styles.cardBgLayer}
        style={{ backgroundImage: `url(${speaker.bgImage})` }}
      />

      {/* Dynamic accent glow overlay */}
      <div
        className={styles.cardGlowOverlay}
        style={{
          background: `radial-gradient(ellipse at bottom, rgba(${speaker.accentRgb},0.65) 0%, rgba(${speaker.accentRgb},0.15) 50%, transparent 75%)`,
        }}
      />

      {/* Dark gradient scrim */}
      <div className={styles.cardScrim} />

      {/* Speaker Portrait */}
      <div className={styles.speakerImgWrapper}>
        <img
          src={speaker.imageSrc}
          alt={speaker.nameEn}
          className={styles.speakerImg}
          loading="lazy"
        />
      </div>

      {/* Number watermark */}
      <span className={styles.cardNumber}>
        {speaker.number}
      </span>

      {/* Collapsed Speaker Tag (Visible on desktop when not expanded) */}
      <div className={styles.speakerCollapsedLabel}>
        <span
          className={styles.collapsedBadge}
          style={{ borderColor: `rgba(${speaker.accentRgb},0.5)`, color: speaker.accent }}
        >
          {speaker.number}
        </span>
        <span className={styles.collapsedName}>{speaker.name}</span>
      </div>

      {/* Bottom accent glow bar */}
      <div
        className={styles.accentBar}
        style={{ background: `linear-gradient(90deg, transparent, ${speaker.accent}, transparent)` }}
      />

      {/* Expanded Full Info Panel */}
      <div className={styles.speakerInfo}>
        <span
          className={styles.speakerBadge}
          style={{
            color: speaker.accent,
            borderColor: `rgba(${speaker.accentRgb},0.5)`,
            background: `rgba(${speaker.accentRgb},0.14)`,
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
  const isMobile = useIsMobile(768);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef(null);
  const decorRef = useRef(null);
  const carouselTrackRef = useRef(null);

  // ── GSAP Entrance Animation ──
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
          { opacity: 0, y: 50, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
          },
          "-=0.4",
        );
    },
    { scope: sectionRef },
  );

  // ── Mobile Carousel Scroll Listener for Active Index Sync ──
  const handleCarouselScroll = useCallback(() => {
    if (!carouselTrackRef.current) return;
    const track = carouselTrackRef.current;
    const scrollLeft = Math.abs(track.scrollLeft);
    const cardWidth = track.firstElementChild?.offsetWidth || 280;
    const gap = 14;
    const newIndex = Math.round(scrollLeft / (cardWidth + gap));
    if (newIndex >= 0 && newIndex < speakers.length && newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex]);

  useEffect(() => {
    const track = carouselTrackRef.current;
    if (!track || !isMobile) return;

    track.addEventListener("scroll", handleCarouselScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleCarouselScroll);
  }, [isMobile, handleCarouselScroll]);

  // ── Scroll to specific speaker on mobile ──
  const scrollToSpeaker = (index) => {
    setActiveIndex(index);
    if (carouselTrackRef.current) {
      const track = carouselTrackRef.current;
      const card = track.children[index];
      if (card) {
        card.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % speakers.length;
    scrollToSpeaker(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + speakers.length) % speakers.length;
    scrollToSpeaker(prevIdx);
  };

  return (
    <section ref={sectionRef} className={styles.speakersSection} id="speakers">
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

      {/* Mobile Quick Selector Tabs */}
      {isMobile && (
        <div className={styles.mobileTabsWrapper}>
          {speakers.map((spk, idx) => {
            const isTabActive = activeIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                className={`${styles.mobileTabPill} ${isTabActive ? styles.mobileTabPillActive : ""}`}
                onClick={() => scrollToSpeaker(idx)}
                style={{
                  "--accent": spk.accent,
                  "--accent-rgb": spk.accentRgb,
                }}
              >
                <span className={styles.tabNumber}>{spk.number}</span>
                <span className={styles.tabName}>{spk.name}</span>
                {isTabActive && <span className={styles.tabGlow} />}
              </button>
            );
          })}
        </div>
      )}

      {/* Speaker cards container (Desktop row / Mobile swipeable track) */}
      <div
        ref={(el) => {
          cardsRef.current = el;
          carouselTrackRef.current = el;
        }}
        className={styles.speakersContainer}
      >
        {speakers.map((speaker, index) => (
          <SpeakerCard
            key={index}
            speaker={speaker}
            index={index}
            activeIndex={activeIndex}
            onHover={setActiveIndex}
            onLeave={() => !isMobile && setActiveIndex(0)}
            isMobile={isMobile}
          />
        ))}
      </div>

      {/* Mobile Navigation Controls: Dots & Arrows */}
      {isMobile && (
        <div className={styles.mobileNavControls}>
          <button
            type="button"
            className={styles.mobileNavArrow}
            onClick={handlePrev}
            aria-label="المتحدث السابق"
          >
            <ChevronRight size={20} />
          </button>

          <div className={styles.mobileDotsWrap}>
            {speakers.map((spk, idx) => {
              const isDotActive = activeIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.mobileDot} ${isDotActive ? styles.mobileDotActive : ""}`}
                  onClick={() => scrollToSpeaker(idx)}
                  aria-label={`انتقل إلى ${spk.name}`}
                  style={{
                    backgroundColor: isDotActive ? spk.accent : undefined,
                    boxShadow: isDotActive ? `0 0 10px ${spk.accent}` : undefined,
                  }}
                />
              );
            })}
          </div>

          <button
            type="button"
            className={styles.mobileNavArrow}
            onClick={handleNext}
            aria-label="المتحدث التالي"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
      )}
    </section>
  );
};

export default Speakers;

