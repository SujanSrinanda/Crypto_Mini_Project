import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  KeyRound,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { scrollToTarget } from "../lib/smoothScroll";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("simulator");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const isManualScrolling = useRef<boolean>(false);
  const manualScrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      setIsScrolled(scrollY > 40);

      // Don't fight programmatic clicks while smooth scrolling is active
      if (isManualScrolling.current) return;

      // If near the top, highlight Simulator
      if (scrollY < 250) {
        setActiveSection("simulator");
        return;
      }

      // Check sections from bottom to top using accurate viewport geometry
      const sections = ["syllabus", "defense", "complexity", "analogy", "simulator"];
      const triggerPoint = window.innerHeight * 0.35;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerPoint) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (manualScrollTimer.current) clearTimeout(manualScrollTimer.current);
    };
  }, []);

  const handleNavClick = (href: string, id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    isManualScrolling.current = true;

    if (manualScrollTimer.current) clearTimeout(manualScrollTimer.current);
    manualScrollTimer.current = setTimeout(() => {
      isManualScrolling.current = false;
    }, 1100);

    scrollToTarget(href, -78);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out ${
        isScrolled
          ? "bg-[#050508]/85 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.7)]"
          : "bg-[#050508]/70 backdrop-blur-xl border-b border-white/[0.05]"
      }`}
    >
      {/* Ambient Top Glow Line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent pointer-events-none" />

      {/* Main Bar Container with smooth height transition */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-[height] duration-300 ease-out ${
            isScrolled ? "h-[68px]" : "h-[86px]"
          }`}
        >
          {/* ===================== BRAND LOGO ===================== */}
          <div className="flex items-center gap-3 relative shrink-0">
            {/* Ambient logo glow */}
            <div className="absolute -left-4 -top-2 w-24 h-20 bg-orange-500/15 blur-2xl rounded-full pointer-events-none" />

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveSection("simulator");
                isManualScrolling.current = true;
                if (manualScrollTimer.current) clearTimeout(manualScrollTimer.current);
                manualScrollTimer.current = setTimeout(() => {
                  isManualScrolling.current = false;
                }, 1100);
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

              <div className="flex items-center gap-2.5 whitespace-nowrap">
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
            className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-neutral-950/70 border border-white/[0.08] shadow-inner"
            aria-label="Main Navigation"
          >
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
                  className={`relative px-4 py-2 rounded-full text-[14px] font-semibold whitespace-nowrap transition-colors duration-200 select-none ${
                    isActive
                      ? "text-white font-bold"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {/* Active Animated Pill (Framer Motion) */}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/20 via-orange-500/25 to-orange-500/20 border border-orange-500/40 shadow-[0_0_16px_rgba(249,115,22,0.25)]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                        mass: 0.8,
                      }}
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
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Primary Launch Demo CTA with Orange Glow */}
            <button
              type="button"
              onClick={() => handleNavClick("#simulator", "simulator")}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-[13px] shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
            >
              <span>Launch Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* ===================== MOBILE HAMBURGER TOGGLE ===================== */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-neutral-300 rounded-xl bg-neutral-900 border border-neutral-700/80 shadow-md hover:text-white transition-colors"
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
            className="lg:hidden overflow-hidden bg-[#07070c]/95 backdrop-blur-2xl border-b border-neutral-800 shadow-2xl"
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

              {/* Mobile CTA */}
              <div className="pt-3 border-t border-neutral-800/80">
                <button
                  type="button"
                  onClick={() => handleNavClick("#simulator", "simulator")}
                  className="w-full py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/30"
                >
                  <span>Launch Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
