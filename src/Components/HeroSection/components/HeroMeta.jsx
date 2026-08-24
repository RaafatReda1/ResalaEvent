import { useState, useEffect } from "react";
import { CalendarCheck, FileText } from "lucide-react";
import supabase from "@/utils/supabaseClient";
import {
  fetchStudentByEmail,
  getRegistrationCookie,
  verifyStudentCookie,
} from "../../Form/Actions";
import styles from "../HeroSection.module.css";

const HeroMeta = () => {
  const [isRegistered, setIsRegistered] = useState(false);

  // ── Check registration state (via signed-in Google email OR verified Cookie) ──
  const checkRegistration = async (user) => {
    try {
      if (user?.email) {
        const student = await fetchStudentByEmail(user.email);
        setIsRegistered(Boolean(student));
        return;
      }

      // If not signed in with Google -> check verified cookie in DB
      const cookieData = getRegistrationCookie();
      if (cookieData?.cookieToken) {
        const student = await verifyStudentCookie(cookieData.cookieToken);
        setIsRegistered(Boolean(student));
      } else {
        setIsRegistered(false);
      }
    } catch {
      setIsRegistered(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user || null;
      checkRegistration(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const user = session?.user || null;
        checkRegistration(user);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  return (
    <div className={styles.heroMeta}>
      <div className={styles.datePill}>
        <span className={styles.dateIcon}>
          <CalendarCheck size={17} />
        </span>
        <span>04 SEPTEMBER 2026</span>
      </div>

      {/* Premium Magnetic CTA Button */}
      <button
        className={`${styles.ctaButton} ${isRegistered ? styles.ctaButtonRegistered : ""}`}
        type="button"
        onClick={() => {
          const target = document.getElementById("register");
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }}
      >
        <span className={`${styles.ctaBtnInner} ${isRegistered ? styles.ctaBtnInnerRegistered : ""}`}>
          {/* Moving shimmer sweep */}
          <span className={styles.ctaBtnShine} />
          {/* Pulse live-dot */}
          <span className={isRegistered ? styles.btnPulseDotTeal : styles.btnPulseDot} />
          <span>{isRegistered ? "عرض بياناتي" : "احجز مقعدك الآن"}</span>
        </span>
      </button>
    </div>
  );
};

export default HeroMeta;

