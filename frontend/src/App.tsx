import React, { useEffect } from "react";
import { AppProvider } from "./state/AppContext";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { SimulatorSection } from "./components/SimulatorSection";
import { LearnExploreSection } from "./components/LearnExploreSection";
import { AboutSection } from "./components/AboutSection";
import { ToastContainer } from "./components/ToastContainer";
import { GuidedTourModal } from "./components/GuidedTourModal";
import { initSmoothScroll } from "./lib/smoothScroll";

export const AppContent: React.FC = () => {
  // Initialize Lenis buttery-smooth scrolling with natural easing
  useEffect(() => {
    const lenis = initSmoothScroll();
    return () => {
      lenis?.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050508] text-neutral-100 relative selection:bg-orange-500/30 selection:text-orange-200">
      <Navbar />

      <main>
        <HeroSection />
        <SimulatorSection />
        <LearnExploreSection />
        <AboutSection />
      </main>

      <ToastContainer />
      <GuidedTourModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
