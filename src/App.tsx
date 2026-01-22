import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { Navbar, Footer, CustomCursor } from './components/layout';
import { Hero, About, Projects, Skills, Contact } from './components/sections';
import './styles/globals.css';

function AppContent() {
  useSmoothScroll();

  useEffect(() => {
    document.body.classList.add('loaded');
  }, []);

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
