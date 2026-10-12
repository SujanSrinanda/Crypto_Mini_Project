import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { useApp } from "../state/AppContext";
import { Tooltip } from "./Tooltip";

export const Navbar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    engine,
    setEngine,
    backendOnline,
    openTour,
  } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Simulator", href: "#simulator" },
    { label: "Paint Analogy", href: "#analogy" },
    { label: "Discrete Log", href: "#complexity" },
    { label: "MITM Defense", href: "#defense" },
    { label: "Viva Questions", href: "#syllabus" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#050508]/90 backdrop-blur-md border-b border-neutral-800 shadow-lg shadow-black/60"
          : "bg-[#050508] border-b border-neutral-800/50"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo with Orange Key Icon */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-700/80 p-0.5 shadow-sm group-hover:border-orange-500/60 transition-colors">
                <div className="w-full h-full bg-[#0a0a0f] rounded-[10px] flex items-center justify-center">
                  <KeyRound className="w-4 h-4 text-orange-500 group-hover:text-orange-400 transition-colors" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white">
                  KeyExchange<span className="text-orange-500">Lab</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  Module 2
                </span>
              </div>
            </a>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-neutral-300 hover:text-white transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Engine Pill Switcher */}
            <Tooltip content={engine === "api" ? "FastAPI Server Active" : "In-Browser BigInt Active"}>
              <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-full p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setEngine("api")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
                    engine === "api"
                      ? "bg-neutral-800 text-white shadow-sm"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                  aria-label="Switch to FastAPI Server Engine"
                >
                  <Server className="w-3.5 h-3.5 text-orange-400" />
                  <span>API</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      backendOnline ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setEngine("local")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
                    engine === "local"
                      ? "bg-neutral-800 text-white shadow-sm"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                  aria-label="Switch to In-Browser BigInt Engine"
                >
                  <Cpu className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Local</span>
                </button>
              </div>
            </Tooltip>

            {/* Tour Button */}
            <Tooltip content="Walkthrough guide">
              <button
                type="button"
                onClick={openTour}
                className="p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-900 border border-neutral-800 transition-colors"
                aria-label="Start guided tour"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </Tooltip>

            {/* Theme Toggle */}
            <Tooltip content={`Toggle ${theme === "dark" ? "Light" : "Dark"} mode`}>
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-900 border border-neutral-800 transition-colors"
                aria-label="Toggle color theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </Tooltip>

            {/* Launch Demo CTA in Vibrant Orange */}
            <a
              href="#simulator"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all duration-150 shadow-md shadow-orange-500/25"
            >
              <span>Launch Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-300 rounded-lg bg-neutral-900 border border-neutral-800"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pt-2 pb-6 bg-[#050508] border-b border-neutral-800">
          <div className="flex flex-col gap-2 pt-2 pb-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
