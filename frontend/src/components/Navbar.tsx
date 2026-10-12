import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  HelpCircle,
  Menu,
  X,
  Server,
  Cpu,
  KeyRound,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useApp } from "../state/AppContext";
import { Tooltip } from "./Tooltip";
import { scrollToTarget } from "../lib/smoothScroll";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export const Navbar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    engine,
    setEngine,
    backendOnline,
    openTour,
  } = useApp();

  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("simulator");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const navLinks: NavItem[] = [
    { id: "simulator", label: "Simulator", href: "#simulator" },
    { id: "analogy", label: "Paint Analogy", href: "#analogy" },
    { id: "complexity", label: "Discrete Log", href: "#complexity" },
    { id: "defense", label: "MITM Defense", href: "#defense" },
    { id: "syllabus", label: "Viva Questions", href: "#syllabus" },
  ];

  // Track scroll position for shrink effect and active section detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 25);

      // Section spy
      const sections = navLinks.map((l) => l.id);
      const scrollPosition = scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string, id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    scrollToTarget(href, -84);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ease-out ${
        isScrolled
          ? "bg-[#050508]/85 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.7)]"
          : "bg-[#050508]/70 backdrop-blur-xl border-b border-white/[0.05]"
      }`}
    >
      {/* Ambient Top Glow Line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent pointer-events-none" />

      {/* Main Bar Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-300 ease-out ${
            isScrolled ? "h-[68px]" : "h-[86px]"
          }`}
        >
          {/* ===================== BRAND LOGO ===================== */}
          <div className="flex items-center gap-3 relative">
            {/* Subtle ambient logo glow */}
            <div className="absolute -left-4 -top-2 w-24 h-20 bg-orange-500/15 blur-2xl rounded-full pointer-events-none" />

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("body", 0);
              }}
              className="flex items-center gap-3 group relative z-10"
              aria-label="KeyExchange Lab Home"
            >
              <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-700/80 p-0.5 shadow-md group-hover:border-orange-500/80 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.35)] transition-all duration-300 transform group-hover:scale-105">
                <div className="w-full h-full bg-[#09090f] rounded-[14px] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <KeyRound className="w-5 h-5 text-orange-500 group-hover:text-orange-400 group-hover:rotate-12 transition-all duration-300" />
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[17px] font-extrabold tracking-tight text-white group-hover:text-white/95 transition-colors">
                  KeyExchange<span className="text-orange-500">Lab</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/25 shadow-sm shadow-orange-500/10">
                  <Sparkles className="w-2.5 h-2.5 text-orange-400" /> Module 2
                </span>
              </div>
            </a>
          </div>

          {/* ===================== CENTER NAV MENU ITEMS ===================== */}
          <nav
            className="hidden md:flex items-center gap-2 lg:gap-3 px-3 py-1.5 rounded-full bg-neutral-950/60 border border-white/[0.06] shadow-inner"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              const isHovered = hoveredLink === link.id;

              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href, link.id);
                  }}
                  onMouseEnter={() => setHoveredLink(link.id)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`relative px-4 py-2 rounded-full text-[14px] lg:text-[15px] font-semibold transition-colors duration-200 ${
                    isActive
                      ? "text-white font-bold"
                      : "text-neutral-400 hover:text-neutral-100"
                  }`}
                >
                  {/* Active Animated Pill (Framer Motion) */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/20 via-orange-500/25 to-orange-500/20 border border-orange-500/40 shadow-[0_0_16px_rgba(249,115,22,0.3)]"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 32,
                      }}
                    />
                  )}

                  {/* Hover Pill when not active */}
                  {!isActive && isHovered && (
                    <motion.div
                      layoutId="hoverNavIndicator"
                      className="absolute inset-0 rounded-full bg-white/[0.05]"
                      transition={{ duration: 0.15 }}
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-1.5">
                    {link.label}
                  </span>
                </a>
              );
            })}
          </nav>

          {/* ===================== RIGHT ACTION CONTROLS ===================== */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Engine Pill Switcher */}
            <Tooltip content={engine === "api" ? "FastAPI Server Active (Port 8000)" : "In-Browser BigInt Active"}>
              <div className="flex items-center bg-neutral-900/90 border border-neutral-700/70 rounded-full p-1 text-xs shadow-inner">
                <button
                  type="button"
                  onClick={() => setEngine("api")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold transition-all ${
                    engine === "api"
                      ? "bg-neutral-800 text-white shadow-sm ring-1 ring-white/10"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                  aria-label="Switch to FastAPI Server Engine"
                >
                  <Server className="w-3.5 h-3.5 text-orange-400" />
                  <span>API</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      backendOnline ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setEngine("local")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold transition-all ${
                    engine === "local"
                      ? "bg-neutral-800 text-white shadow-sm ring-1 ring-white/10"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                  aria-label="Switch to In-Browser BigInt Engine"
                >
                  <Cpu className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Local</span>
                </button>
              </div>
            </Tooltip>

            {/* Guided Tour Walkthrough Button */}
            <Tooltip content="Quick walkthrough guide">
              <button
                type="button"
                onClick={openTour}
                className="p-2.5 text-neutral-400 hover:text-white rounded-full bg-neutral-900/90 border border-neutral-700/70 hover:border-neutral-600 transition-all shadow-sm transform hover:scale-105 active:scale-95"
                aria-label="Start guided tour"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </Tooltip>

            {/* Color Theme Toggle */}
            <Tooltip content={`Toggle ${theme === "dark" ? "Light" : "Dark"} mode`}>
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2.5 text-neutral-400 hover:text-white rounded-full bg-neutral-900/90 border border-neutral-700/70 hover:border-neutral-600 transition-all shadow-sm transform hover:scale-105 active:scale-95"
                aria-label="Toggle color theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </Tooltip>

            {/* Primary Launch Demo CTA with Orange Glow */}
            <button
              type="button"
              onClick={() => handleNavClick("#simulator", "simulator")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-[13px] shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Launch Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* ===================== MOBILE HAMBURGER TOGGLE ===================== */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-neutral-300 rounded-xl bg-neutral-900 border border-neutral-700/80 shadow-md"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-orange-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Accent Gradient Line */}
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/25 to-transparent pointer-events-none" />

      {/* ===================== MOBILE GLASSMORPHIC DRAWER MENU ===================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-[#07070c]/95 backdrop-blur-2xl border-b border-neutral-800 shadow-2xl"
          >
            <div className="px-5 pt-3 pb-6 space-y-3">
              <div className="flex flex-col gap-1.5 pt-1">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <a
                      key={link.id}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(link.href, link.id);
                      }}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                        isActive
                          ? "bg-orange-500/15 text-orange-400 border border-orange-500/30 font-bold"
                          : "text-neutral-300 hover:text-white hover:bg-neutral-900"
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-orange-400 shadow-sm shadow-orange-400" />}
                    </a>
                  );
                })}
              </div>

              {/* Mobile Engine Switcher & CTA */}
              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-full p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setEngine("api")}
                    className={`px-3 py-1 rounded-full font-bold ${
                      engine === "api" ? "bg-neutral-800 text-white" : "text-neutral-400"
                    }`}
                  >
                    API
                  </button>
                  <button
                    type="button"
                    onClick={() => setEngine("local")}
                    className={`px-3 py-1 rounded-full font-bold ${
                      engine === "local" ? "bg-neutral-800 text-white" : "text-neutral-400"
                    }`}
                  >
                    Local
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleNavClick("#simulator", "simulator")}
                  className="px-4 py-2 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/30"
                >
                  <span>Launch Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
