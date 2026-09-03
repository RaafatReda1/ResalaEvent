import { useEffect, useState, lazy, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import "./App.css";
import Loader from "./Components/Loader/Loader";
import HeroSection from "./Components/HeroSection/HeroSection";
import Header from "./Components/Header/Header";
import About from "./Components/About/About";
import Speakers from "./Components/Speakers/Speakers";
import Issues from "./Components/Issues/Issues";
import Agenda from "./Components/Agenda/Agenda";
import Form from "./Components/Form/Form";
import ClosedRegistration from "./Components/ClosedRegistration/ClosedRegistration";
import Footer from "./Components/Footer/Footer";
import FloatingWhatsApp from "./Components/FloatingWhatsApp/FloatingWhatsApp";
import { Analytics } from "@vercel/analytics/react";
import { checkIsAdmin } from "./utils/checkIsAdmin";

const Admin = lazy(() => import("./Components/Admin/Admin"));

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isIntroActive, setIsIntroActive] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true); // prevent flash

  // ── GSAP Smooth Scrolling with Lenis ──
  useEffect(() => {
    if (isAdmin) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.3,
    });

    window.lenis = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      window.lenis = null;
    };
  }, [isAdmin]);

  const handleIntroComplete = () => {
    setIsIntroActive(false);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      window.lenis?.resize();
    });
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const result = await checkIsAdmin();
      setIsAdmin(result);
      setAuthChecking(false);
    };
    checkAdmin();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "var(--navy-900)",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* Show nothing until auth check resolves — prevents public-site flash for admins */}
      {!authChecking && (
        isAdmin ? (
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-slate-900 text-teal-400">
                <div className="w-8 h-8 border-4 border-teal-400/30 border-t-teal-400 rounded-full animate-spin" />
              </div>
            }
          >
            <Admin />
          </Suspense>
        ) : (
          <>
            <main>
              <Header />
              <HeroSection />
              <About />
              <Issues />
              <Speakers />
              <Agenda />
              {/* <Form /> */}
              <ClosedRegistration />
              <Footer />
            </main>
            <FloatingWhatsApp />
            <Analytics />
          </>
        )
      )}
      {/* Intro Loader Overlay — covers auth check delay too */}
      {(isIntroActive || authChecking) && <Loader onComplete={handleIntroComplete} />}
    </div>
  );
}

export default App;
