import React from "react";
import { ArrowDown, BookOpen, KeyRound, Shield, Lock, Unlock, Play } from "lucide-react";
import { ScrollReveal } from "./common/ScrollReveal";
import { scrollToTarget } from "../lib/smoothScroll";

export const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-neutral-800/80 bg-[#050508]">
      {/* Subtle warm ambient back-light */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-neutral-800/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading, Subtitle & Orange CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Pill Tag in Orange */}
            <ScrollReveal direction="down" delay={0.05} distance={16}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                Cryptography &amp; Network Security &bull; Module 2 Project
              </div>
            </ScrollReveal>

            {/* Main Title */}
            <ScrollReveal direction="up" delay={0.12} distance={24}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Agreeing on a secret
                <br />
                <span className="text-orange-500 drop-shadow-[0_0_35px_rgba(249,115,22,0.3)]">
                  in plain sight.
                </span>
              </h1>
            </ScrollReveal>

            {/* Subtitle */}
            <ScrollReveal direction="up" delay={0.2} distance={20}>
              <p className="text-base sm:text-lg text-neutral-300 max-w-xl leading-relaxed font-normal">
                An interactive laboratory simulating the <strong>Diffie-Hellman Key Exchange (DHKE)</strong> and demonstrating the classic <strong>Man-in-the-Middle (MITM)</strong> attack with modular math, packet interception, and digital certificate defense.
              </p>
            </ScrollReveal>

            {/* CTA Buttons */}
            <ScrollReveal direction="up" delay={0.28} distance={20}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => scrollToTarget("#simulator", -84)}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Interactive Demo</span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollToTarget("#analogy", -84)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 hover:text-white hover:border-neutral-700 font-medium text-sm transition-all duration-150"
                >
                  <BookOpen className="w-4 h-4 text-orange-400" />
                  <span>How It Works (Paint Analogy)</span>
                  <ArrowDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>
              </div>
            </ScrollReveal>

            {/* Bottom Proof Line */}
            <ScrollReveal direction="up" delay={0.35} distance={16}>
              <div className="pt-6 border-t border-neutral-900 flex flex-wrap items-center gap-5 text-xs text-neutral-400">
                <span className="text-neutral-500 uppercase tracking-wider font-semibold text-[11px]">
                  Core Topics:
                </span>
                <span className="flex items-center gap-1.5 text-neutral-200">
                  <KeyRound className="w-3.5 h-3.5 text-orange-400" /> Modular Exponentiation
                </span>
                <span className="flex items-center gap-1.5 text-neutral-200">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" /> Discrete Log Hardness
                </span>
                <span className="flex items-center gap-1.5 text-neutral-200">
                  <Unlock className="w-3.5 h-3.5 text-rose-400" /> MITM Interception
                </span>
                <span className="flex items-center gap-1.5 text-neutral-200">
                  <Shield className="w-3.5 h-3.5 text-orange-400" /> PKI Certificates
                </span>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Cryptographic Key Convergence Visual */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <ScrollReveal direction="left" delay={0.25} distance={32}>
              <div className="relative w-full max-w-[420px] aspect-square rounded-3xl bg-[#0c0c12] border border-neutral-800 p-6 flex flex-col justify-between shadow-2xl overflow-hidden hover:border-neutral-700/80 transition-all duration-300">
                {/* Subtle orange ambient glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />

                {/* Top Party Indicators */}
                <div className="flex justify-between items-center z-10">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/40">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-blue-200">Alice (a=6)</span>
                  </div>

                  <div className="text-[11px] font-mono text-orange-300 bg-neutral-900 px-3 py-1 rounded-lg border border-neutral-800 font-bold">
                    p = 23, g = 5
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
                    <span className="text-xs font-mono font-bold text-emerald-200">Bob (b=15)</span>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                </div>

                {/* Center Cryptographic Visual Conduit */}
                <div className="relative my-auto py-6 flex items-center justify-center z-10">
                  {/* SVG Connecting Tracks */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 180" fill="none">
                    <path
                      d="M 40 40 C 90 90, 110 90, 160 90"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                      className="opacity-75"
                    />
                    <path
                      d="M 280 40 C 230 90, 210 90, 160 90"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                      className="opacity-75"
                    />
                  </svg>

                  {/* Central Shared Vault in Vivid Orange */}
                  <div className="relative z-20 w-32 h-32 rounded-2xl bg-[#14141d] border-2 border-orange-500/80 shadow-2xl shadow-orange-500/20 flex flex-col items-center justify-center text-center p-3 transform hover:scale-105 transition-transform duration-300">
                    <KeyRound className="w-8 h-8 text-orange-400 drop-shadow mb-1" />
                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                      Shared Secret
                    </span>
                    <span className="text-sm font-mono font-extrabold text-orange-300">
                      K = g^(ab) mod p
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold mt-0.5">
                      K = 2 (MATCH!)
                    </span>
                  </div>
                </div>

                {/* Bottom Public Exchange Summary */}
                <div className="z-10 bg-neutral-900/90 border border-neutral-800 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex justify-between text-neutral-200">
                    <span>Public Transmissions:</span>
                    <span className="font-mono text-orange-400 font-bold">A = 8, B = 19</span>
                  </div>
                  <div className="flex justify-between text-neutral-400 text-[11px]">
                    <span>Passive Observer:</span>
                    <span className="text-amber-400 font-medium">Cannot deduce a, b, or K</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
