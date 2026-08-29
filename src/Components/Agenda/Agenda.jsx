import { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {

  MousePointer,
} from "lucide-react";
import { CursorDrivenParticleTypography } from "@/Components/ui/cursor-driven-particles-typography";
import "./Agenda.css";

gsap.registerPlugin(ScrollTrigger);


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
        },
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
          "-=0.4",
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
          "-=0.5",
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
          "-=0.4",
        )
        .fromTo(
          statusRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.3",
        );
    },
    { scope: containerRef },
  );

  return (
    <section ref={containerRef} className="agendaSection" id="agenda">
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
                <span>المس، اسحب، أو اضغط بالماوس للتفاعل مع النقاط</span>
              </div>

              {/* Interactive Text Switchers */}
              <div className="textSwitchGroup">
                {["SOON", "قريباً", "ما وراء الطب"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setParticleText(t)}
                    className={`switchBtn ${particleText === t ? "activeSwitch" : ""}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="particleCanvasContainer">
              <CursorDrivenParticleTypography
                text={particleText}
                fontSize={
                  particleText === "ما وراء الطب"
                    ? 95
                    : particleText === "قريباً"
                    ? 135
                    : 145
                }
                fontFamily={
                  particleText === "SOON"
                    ? "Inter, system-ui, sans-serif"
                    : "Cairo, system-ui, sans-serif"
                }
                color="#3AB9AC"
                particleSize={2.4}
                particleDensity={6.5}
                dispersionStrength={20}
                returnSpeed={0.085}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
