import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import useIsMobile from "../../hooks/useIsMobile";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Speakers.module.css";

gsap.registerPlugin(ScrollTrigger);

const speakers = [
  {
    name: "أ.د. مدحت مرسي",
    nameEn: "Prof. Dr. Medhat Morsy",
    title: "أستاذ التشريح والأجنة بكلية طب قصر العيني – جامعة القاهرة",
    titleEn:
      "Professor of Anatomy and Embryology at Kasr Al-Ainy, Cairo University, and Head of Anatomy Departments at Nahda and Ahram Canadian Universities.",
    imageSrc: "/drMedhatNofill2.png",
    accent: "#3AB9AC",
    accentRgb: "58,185,172",
    number: "01",
  },
  {
    name: "أ.د. نجلاء فاروق",
    nameEn: "Prof. Dr. Naglaa Farouk",
    title: "رئيسة قسم الميكرو بجامعة الأزهر",
    titleEn: "Head of Microbiology Department",
    imageSrc: "/drNagalaa.png",
    accent: "#E63946",
    accentRgb: "230,57,70",
    number: "02",
  },
  {
    name: "أ.م.د. رانيا عبد الجليل",
    nameEn: "Dr. Rania Abd Al-Galil",
    title: "أستاذ مساعد بقسم الأناتومي بالأزهر",
    titleEn: "Assistant Professor of Anatomical Sciences",
    imageSrc: "/drRania2.png",
    accent: "#EAB308",
    accentRgb: "234,179,8",
    number: "03",
  },
  {
    name: "د. هشام عصمت",
    nameEn: "Dr. Hesham Esmat",
    title: "محاضر في الكيمياء الحيوية بعدة جامعات",
    titleEn:
      "Lecturer of Biochemistry at several universities, including Kasr Al-Ainy, Cairo University, and Helwan University",
    imageSrc: "/drHeshamNofill2.png",
    accent: "#8B5CF6",
    accentRgb: "139,92,246",
    number: "04",
  },
  {
    name: "د. منصور الجزار",
    nameEn: "Dr. Mansour Al-Jazar",
    title: "طبيب امتياز بمستشفى أسيوط",
    titleEn: "Intern Doctor at Asyut Hospital",
    imageSrc: "/drMansour.png",
    accent: "#2889FF",
    accentRgb: "40,137,255",
    number: "05",
  },
  {
    name: "د. عمرو البركي",
    nameEn: "Dr. Amr Al-Braky",
    title: "طبيب امتياز بمستشفى الدمرداش",
    titleEn: "Intern Doctor at Demerdash Hospital",
    imageSrc: "/amrNofill.png",
    accent: "#F97316",
    accentRgb: "249,115,22",
    number: "06",
  },
  {
    name: "د. حسام عيسى",
    nameEn: "Dr. Hossam Eissa",
    title: "طبيب امتياز بمستشفى الدمرداش",
    titleEn: "Intern Doctor at Demerdash Hospital",
    imageSrc: "/hossamNoFill.png",
    accent: "#14B8A6",
    accentRgb: "20,184,166",
    number: "07",
  },
];

const SpeakerCard = ({
  speaker,
  index,
  isExpanded,
  isMobileActive,
  onHover,
  onCardClick,
  isMobile,
}) => {
  return (
    <div
      className={`${styles.speakerCard} ${
        isExpanded ? styles.speakerCardExpanded : ""
      } ${isMobile && isMobileActive ? styles.speakerCardMobileActive : ""}`}
      onMouseEnter={() => !isMobile && onHover(index)}
      onClick={() => isMobile && onCardClick(index)}
      style={{ "--accent": speaker.accent, "--accent-rgb": speaker.accentRgb }}
    >
      {/* Studio stage backlight halo */}
      <div
        className={styles.cardBacklightHalo}
        style={{
          background: `radial-gradient(circle at 50% 35%, rgba(${speaker.accentRgb}, 0.35) 0%, rgba(${speaker.accentRgb}, 0.08) 55%, transparent 75%)`,
        }}
      />

      {/* Dynamic accent glow overlay */}
      <div
        className={styles.cardGlowOverlay}
        style={{
          background: `radial-gradient(ellipse at bottom, rgba(${speaker.accentRgb},0.5) 0%, rgba(${speaker.accentRgb},0.1) 50%, transparent 75%)`,
        }}
      />

      {/* Dark gradient scrim */}
      <div className={styles.cardScrim} />

      {/* Speaker Portrait Cutout */}
      <div className={styles.speakerImgWrapper}>
        <img
          src={speaker.imageSrc}
          alt={speaker.nameEn}
          className={styles.speakerImg}
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Number watermark */}
      <span className={styles.cardNumber}>{speaker.number}</span>

      {/* Collapsed Speaker Tag (Visible on desktop when not expanded) */}
      <div className={styles.speakerCollapsedLabel}>
        <span
          className={styles.collapsedBadge}
          style={{
            borderColor: `rgba(${speaker.accentRgb},0.5)`,
            color: speaker.accent,
          }}
        >
          {speaker.number}
        </span>
        <span className={styles.collapsedName}>{speaker.name}</span>
      </div>

      {/* Bottom accent glow bar */}
      <div
        className={styles.accentBar}
        style={{
          background: `linear-gradient(90deg, transparent, ${speaker.accent}, transparent)`,
        }}
      />

      {/* Expanded / Full Info Panel */}
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
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const mobileActiveIndexRef = useRef(0);

  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef(null);
  const decorRef = useRef(null);
  const carouselTrackRef = useRef(null);
  const tabsWrapperRef = useRef(null);

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
          duration: 0.6,
          ease: "power3.out",
          transformOrigin: "left center",
        },
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
          "-=0.35",
        )
        .fromTo(
          headingRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.35",
        )
        .fromTo(
          Array.from(cardsRef.current?.children || []),
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.08,
          },
          "-=0.3",
        );
    },
    { scope: sectionRef },
  );

  // ── Throttled Mobile Carousel Scroll Listener ──
  const handleCarouselScroll = useCallback(() => {
    if (!carouselTrackRef.current) return;
    const track = carouselTrackRef.current;
    const cardWidth = track.firstElementChild?.clientWidth || 280;
    const scrollPos = Math.abs(track.scrollLeft);
    const closestIndex = Math.min(
      speakers.length - 1,
      Math.max(0, Math.round(scrollPos / (cardWidth + 14)))
    );

    if (closestIndex !== mobileActiveIndexRef.current) {
      mobileActiveIndexRef.current = closestIndex;
      setMobileActiveIndex(closestIndex);
      if (tabsWrapperRef.current?.children[closestIndex]) {
        tabsWrapperRef.current.children[closestIndex].scrollIntoView({
          behavior: "smooth",
          inline: "nearest",
          block: "nearest",
        });
      }
    }
  }, []);

  useEffect(() => {
    const track = carouselTrackRef.current;
    if (!track || !isMobile) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleCarouselScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [isMobile, handleCarouselScroll]);

  // ── Scroll to specific speaker on mobile ──
  const scrollToSpeaker = (index) => {
    mobileActiveIndexRef.current = index;
    setMobileActiveIndex(index);
    if (carouselTrackRef.current) {
      const targetCard = carouselTrackRef.current.children[index];
      if (targetCard) {
        targetCard.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
    if (tabsWrapperRef.current?.children[index]) {
      tabsWrapperRef.current.children[index].scrollIntoView({
        behavior: "smooth",
        inline: "nearest",
        block: "nearest",
      });
    }
  };

  const handleNext = () => {
    const nextIdx = (mobileActiveIndex + 1) % speakers.length;
    scrollToSpeaker(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (mobileActiveIndex - 1 + speakers.length) % speakers.length;
    scrollToSpeaker(prevIdx);
  };

  return (
    <section ref={sectionRef} className={styles.speakersSection} id="speakers">
      {/* Background environment */}
      <div className={styles.bgBase} />
      <div className={styles.bgGrid} />
      <div className={styles.bgCoronaLeft} />
      <div className={styles.bgCoronaRight} />

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
        <div ref={tabsWrapperRef} className={styles.mobileTabsWrapper}>
          {speakers.map((spk, idx) => {
            const isTabActive = mobileActiveIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                className={`${styles.mobileTabPill} ${
                  isTabActive ? styles.mobileTabPillActive : ""
                }`}
                onClick={() => scrollToSpeaker(idx)}
                style={{
                  "--accent": spk.accent,
                  "--accent-rgb": spk.accentRgb,
                }}
              >
                <span className={styles.tabNumber}>{spk.number}</span>
                <span className={styles.tabName}>{spk.name}</span>
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
        onMouseLeave={() => !isMobile && setHoveredIndex(null)}
      >
        {speakers.map((speaker, index) => (
          <SpeakerCard
            key={index}
            speaker={speaker}
            index={index}
            isExpanded={!isMobile && hoveredIndex === index}
            isMobileActive={isMobile && mobileActiveIndex === index}
            onHover={setHoveredIndex}
            onCardClick={scrollToSpeaker}
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
              const isDotActive = mobileActiveIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.mobileDot} ${
                    isDotActive ? styles.mobileDotActive : ""
                  }`}
                  onClick={() => scrollToSpeaker(idx)}
                  aria-label={`انتقل إلى ${spk.name}`}
                  style={{
                    backgroundColor: isDotActive ? spk.accent : undefined,
                    boxShadow: isDotActive
                      ? `0 0 10px ${spk.accent}`
                      : undefined,
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
