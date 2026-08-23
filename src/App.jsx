import { useState } from 'react';
import './App.css';
import Loader from './Components/Loader/Loader';
import HeroSection from './Components/HeroSection/HeroSection';
import Header from './Components/Header/Header';
import About from './Components/About/About';

function App() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  return (
    <div style={{ backgroundColor: 'var(--navy-900)', minHeight: '100vh', overflowX: 'hidden' }}>
      {!isIntroComplete ? (
        <Loader onComplete={() => setIsIntroComplete(true)} />
      ) : (
        <main>
          <Header />
          <HeroSection />
          <About />
        </main>
      )}
    </div>
  );
}

export default App;
