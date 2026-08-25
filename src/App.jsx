import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./App.css";
import Loader from "./Components/Loader/Loader";
import HeroSection from "./Components/HeroSection/HeroSection";
import Header from "./Components/Header/Header";
import About from "./Components/About/About";
import Speakers from "./Components/Speakers/Speakers";
import Issues from "./Components/Issues/Issues";
import Agenda from "./Components/Agenda/Agenda";
import Form from "./Components/Form/Form";
import Footer from "./Components/Footer/Footer";
import FloatingWhatsApp from "./Components/FloatingWhatsApp/FloatingWhatsApp";
import { Analytics } from "@vercel/analytics/react";
import { checkIsAdmin } from "./utils/checkIsAdmin";
import Admin from "./Components/Admin/Admin";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isIntroActive, setIsIntroActive] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleIntroComplete = () => {
    setIsIntroActive(false);
    // Smoothly refresh ScrollTrigger so all section coordinates accurately calculate
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 60);
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const result = await checkIsAdmin();
      setIsAdmin(result);
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
      {/* 1. Main Website — Pre-rendered and ready in background for 60fps instant readiness */}
      {!isAdmin ? (
        <>
          <main>
            <Header />
            <HeroSection />
            <About />
            <Issues />
            <Speakers />
            <Agenda />
            <Form />
            <Footer />
          </main>
          <FloatingWhatsApp />
          <Analytics />
        </>
      ) : (
        <Admin />
      )}
      {/* 2. Intro Loader Overlay */}
      {isIntroActive && <Loader onComplete={handleIntroComplete} />}
    </div>
  );
}

export default App;
