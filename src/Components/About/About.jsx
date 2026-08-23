import MagicRings from "./Background/MagicRings";
import styles from "./About.module.css";
import { Quote } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const aboutSectionRef = useRef(null);
  const quotesStageRef = useRef(null);

  const texts = [
    "مين نشاط اطباء الخير ده؟",
    "ده نشاط تابع لجمعيه رساله هدفه مساعده اكبر عدد من الناس",
    "مين اصلا جمعيه رساله؟",
    "ده جميعه طبيه هدفها مساعده الطلاب علي تسهيل فتره دراستهم",
    "كمان هدفها تجميع عدد كبير من المتطوعين لمساعده الناس",
    "كلام كتير بقا يتكتب هنا حسب الرغبه"
  ];

  useGSAP(
    () => {
      const lines = gsap.utils.toArray(".textLine");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutSectionRef.current,
          start: "top top",
          end: "+=400% ", // سكرول ممتد وسلس لعرض الجمل الأربعة بحرية
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      // ── 1. ظهور أيقونات الاقتباس بتأثير فاخر ──
      tl.fromTo(
        ".upperQuoteIcon",
        { opacity: 0, scale: 0.3, rotate: -45, y: -20 },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        0,
      ).fromTo(
        ".lowerQuoteIcon",
        { opacity: 0, scale: 0.3, rotate: 135, y: 20 },
        {
          opacity: 1,
          scale: 1,
          rotate: 180,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        0,
      );

      // ── 2. أنيماشن الجمل بالتتابع ──
      lines.forEach((line) => {
        const words = line.querySelectorAll(".word");

        // ظهور السطر بالكامل
        tl.set(line, { opacity: 1 });

        // دخول الكلمات واحدة تلو الأخرى بتأثير 3D ثلاثي الأبعاد مع سينمائية الباور
        tl.fromTo(
          words,
          {
            opacity: 0,
            y: 45,
            scale: 0.85,
            filter: "blur(12px)",
            rotateX: 65,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            rotateX: 0,
            duration: 0.7,
            stagger: 0.09,
            ease: "power3.out",
          },
        );

        // ثبات الجملة لوهلة للقراءة المريحة
        tl.to({}, { duration: 0.5 });

        // خروج الجملة بسلاسة قبل الجملة التالية
        tl.to(words, {
          opacity: 0,
          y: -35,
          scale: 0.95,
          filter: "blur(8px)",
          rotateX: -45,
          duration: 0.5,
          stagger: 0.04,
          ease: "power2.in",
        });

        // إخفاء السطر بعد انتهاء خروج كلماته
        tl.set(line, { opacity: 0 });
      });

      // تحديث تلقائي للحسابات بعد استقرار الواجهة
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);

      return () => clearTimeout(timer);
    },
    { scope: aboutSectionRef },
  );

  return (
    <div
      className={styles.aboutContainer}
      id="about"
      ref={aboutSectionRef}
    >

      <MagicRings />

      <div ref={quotesStageRef} className={styles.quotesStage}>
        <Quote
          className={`upperQuoteIcon ${styles.upperQuoteIcon}`}
          size={38}
        />

        <div className={styles.aboutTextWrapper}>
          {texts.map((text, i) => (
            <div className={`textLine ${styles.textLine}`} key={i}>
              {text.split(" ").map((word, j) => (
                <span className={`word ${styles.word}`} key={j}>
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>

        <Quote
          className={`lowerQuoteIcon ${styles.lowerQuoteIcon}`}
          size={38}
        />
      </div>
    </div>
  );
};

export default About;
