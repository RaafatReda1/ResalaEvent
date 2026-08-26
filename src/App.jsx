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
  const [authChecking, setAuthChecking] = useState(true); // prevent flash

  const handleIntroComplete = () => {
    setIsIntroActive(false);
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 60);
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
          <Admin />
        ) : (
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
        )
      )}
      {/* Intro Loader Overlay — covers auth check delay too */}
      {(isIntroActive || authChecking) && <Loader onComplete={handleIntroComplete} />}
    </div>
  );
}

export default App;
