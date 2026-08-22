import { useState } from 'react';
import './App.css';
import Loader from './Components/Loader/Loader';
import HeroSection from './Components/HeroSection/HeroSection';

function App() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  return (
    <main style={{ backgroundColor: 'var(--navy-900)', minHeight: '100vh', overflowX: 'hidden' }}>
      {!isIntroComplete ? (
        <Loader onComplete={() => setIsIntroComplete(true)} />
      ) : (
        <HeroSection />
      )}
    </main>
  );
}

export default App;
