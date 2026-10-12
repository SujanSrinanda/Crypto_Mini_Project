import React, { useState, useEffect } from "react";
import {
  Shield,
  Sun,
  Moon,
  Server,
  Cpu,
  HelpCircle,
  Menu,
  X,
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
    { label: "Analogy", href: "#analogy" },
    { label: "Discrete Log", href: "#complexity" },
    { label: "Defense", href: "#defense" },
    { label: "Syllabus & Viva", href: "#syllabus" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/80 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-emerald-400 p-0.5 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-sky-400 group-hover:text-sky-300 transition-colors" />
                </div>
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-sky-400 via-indigo-200 to-emerald-400 bg-clip-text text-transparent">
                  KeyExchange<span className="text-white"> Lab</span>
                </span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Module 2
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-xs lg:text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Engine Switcher */}
            <Tooltip content={engine === "api" ? "Using FastAPI Backend" : "Using In-Browser BigInt"}>
              <div className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-xl p-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => setEngine("api")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    engine === "api"
                      ? "bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  aria-label="Switch to FastAPI Server Engine"
                >
                  <Server className="w-3.5 h-3.5" />
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
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    engine === "local"
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  aria-label="Switch to In-Browser BigInt Engine"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>In-Browser</span>
                </button>
              </div>
            </Tooltip>

            {/* Guided Tour Launcher */}
            <Tooltip content="Start interactive walkthrough">
              <button
                type="button"
                onClick={openTour}
                className="p-2 text-slate-300 hover:text-sky-300 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/30 transition-all duration-150"
                aria-label="Start guided tour"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </Tooltip>

            {/* Theme Toggle */}
            <Tooltip content={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}>
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 text-slate-300 hover:text-amber-300 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/30 transition-all duration-150"
                aria-label="Toggle color theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </Tooltip>

            {/* GitHub Repo Link */}
            <Tooltip content="View source on GitHub">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 text-slate-300 hover:text-white rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all duration-150 flex items-center justify-center"
                aria-label="GitHub Repository"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            </Tooltip>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-300 rounded-lg bg-slate-900 border border-slate-800"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 rounded-lg bg-slate-900 border border-slate-800"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pt-2 pb-6 bg-slate-950/95 border-b border-slate-800 backdrop-blur-xl">
          <div className="flex flex-col gap-2 pt-2 pb-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900 rounded-lg"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile engine switcher */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
            <span className="text-slate-400">Crypto Engine:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setEngine("api")}
                className={`px-3 py-1.5 rounded-lg font-medium ${
                  engine === "api" ? "bg-sky-500/20 text-sky-300 border border-sky-500/30" : "bg-slate-900 text-slate-400"
                }`}
              >
                Server API
              </button>
              <button
                onClick={() => setEngine("local")}
                className={`px-3 py-1.5 rounded-lg font-medium ${
                  engine === "local" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "bg-slate-900 text-slate-400"
                }`}
              >
                In-Browser
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
