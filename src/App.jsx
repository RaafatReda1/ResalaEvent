import { useState } from 'react';
import './App.css';
import Loader from './Components/Loader/Loader';
import HeroSection from './Components/HeroSection/HeroSection';
import Header from './Components/Header/Header';
import About from './Components/About/About';
import Speakers from './Components/Speakers/Speakers';
import Issues from './Components/Issues/Issues';
import Agenda from './Components/Agenda/Agenda';
import Form from './Components/Form/Form';
import Footer from './Components/Footer/Footer';
import FloatingWhatsApp from './Components/FloatingWhatsApp/FloatingWhatsApp';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  return (
    <div style={{ backgroundColor: 'var(--navy-900)', minHeight: '100vh', overflowX: 'hidden' }}>
      {!isIntroComplete ? (
        <Loader onComplete={() => setIsIntroComplete(true)} />
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
      )}
    </div>
  );
}

export default App;
