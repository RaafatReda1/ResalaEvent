import { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Sparkles,
  Mic,
  Stethoscope,
  Award,
  BookOpen,
  MousePointer,
} from "lucide-react";
import { CursorDrivenParticleTypography } from "@/components/ui/cursor-driven-particles-typography";
import "./Agenda.css";

gsap.registerPlugin(ScrollTrigger);

const TEASER_SESSIONS = [
  {
    number: "01",
    title: "الجلسة الافتتاحية",
    titleEn: "Opening Ceremony",
    desc: "كلمات ترحيبية واستعراض لأبرز إنجازات وتطلعات النشاط الطبي لجمعية رسالة.",
    icon: Mic,
  },
  {
    number: "02",
    title: "المحاضرات الرئيسية",
    titleEn: "Keynote Sessions",
    desc: "طروحات طبية متقدمة وتجارب ميدانية ملهمة من قادة وخبراء الرعاية الصحية.",
    icon: Stethoscope,
  },
  {
    number: "03",
    title: "الورش التفاعلية",
    titleEn: "Interactive Workshops",
    desc: "تدريب عملي ومناقشات حية لتطوير مهارات المتطوعين والفرق الطبية الميدانية.",
    icon: BookOpen,
  },
  {
    number: "04",
    title: "حفل التكريم والختام",
    titleEn: "Honoring & Closing",
    desc: "الاحتفاء بنجوم العطاء وتكريم النماذج الملهمة في مسيرة النشاط الطبي.",
    icon: Award,
  },
];

export default function Agenda() {
  const [particleText, setParticleText] = useState("SOON");
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const showcaseRef = useRef(null);
  const particleBoxRef = useRef(null);
  const cardsRef = useRef(null);
  const statusRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.fromTo(
        headerRef.current?.children || [],
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.15,
        }
      )
        .fromTo(
          showcaseRef.current,
          { opacity: 0, y: 50, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .fromTo(
          particleBoxRef.current,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .fromTo(
          Array.from(cardsRef.current?.children || []),
          { opacity: 0, y: 35, scale: 0.92 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "back.out(1.2)",
            stagger: 0.12,
          },
          "-=0.4"
        )
        .fromTo(
          statusRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.3"
        );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="agendaSection">
      {/* ── Background Environment Layers ── */}
      <div className="bgGrid" />
      <div className="bgCoronaLeft" />
      <div className="bgCoronaRight" />
      <div className="bgScanLine" />

      <div className="agendaContent">
        {/* ── Section Header ── */}
        <div ref={headerRef} className="sectionHeader">
          <div className="badgePill">
            <span className="badgeDot" />
            <span className="badgeText">EVENT AGENDA • قريباً</span>
          </div>

          <h2 className="mainTitle">جدول الفعاليات يُعلن قريباً</h2>

          <p className="subtitle">
            نعمل حالياً على إعداد جدول متكامل يجمع بين الجلسات العلمية الملهمة،
            ورش العمل التفاعلية، والقصص الإنسانية المؤثرة لصناع الأمل في رسالة.
          </p>
        </div>

        {/* ── Main Showcase Glass Card ── */}
        <div ref={showcaseRef} className="showcaseCard">
          {/* ── Interactive Particle Canvas ── */}
          <div ref={particleBoxRef} className="particleTypographyWrapper">
            <div className="particleControls">
              <div className="particleHint">
                <MousePointer size={14} className="animate-bounce" />
              </div>
             
            </div>

            <div className="particleCanvasContainer">
              <CursorDrivenParticleTypography
                text={particleText}
                fontSize={particleText === "قريباً" ? 170 : 150}
                fontFamily={particleText === "قريباً" ? "Tajawal, sans-serif" : "Inter, sans-serif"}
                color="#3AB9AC"
                particleSize={1.8}
                particleDensity={4}
                dispersionStrength={22}
                returnSpeed={0.09}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
