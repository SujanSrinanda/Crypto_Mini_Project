import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, BookOpen, Key, ShieldCheck, Flame } from "lucide-react";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background cyber orbs and mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-600/20 via-indigo-600/15 to-emerald-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-12 left-10 w-72 h-72 bg-sky-500/10 blur-[90px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Module badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-sky-500/30 text-sky-300 text-xs font-semibold tracking-wide shadow-lg shadow-sky-500/5 mb-6"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
          </span>
          Cryptography & Network Security &bull; Module 2 Project
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight md:leading-[1.12]"
        >
          See how two strangers agree on a{" "}
          <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent underline decoration-sky-500/30 decoration-wavy">
            secret in public
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          An interactive laboratory simulating the <strong>Diffie-Hellman Key Exchange (DHKE)</strong> and demonstrating the classic <strong>Man-in-the-Middle (MITM)</strong> attack with live modular math, packet interception, and authenticated defense.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#simulator"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-semibold text-sm shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Interactive Demo</span>
          </a>

          <a
            href="#analogy"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 text-slate-200 hover:text-white font-medium text-sm border border-slate-700/80 hover:border-slate-600 transition-all duration-200"
          >
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>How It Works (Paint Analogy)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>

        {/* Value Prop Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left"
        >
          <div className="glass-panel p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">No Pre-Shared Key</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate symmetric encryption keys across an open, eavesdropped channel.
              </p>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Discrete Log Hardness</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Computing <span className="font-mono text-emerald-300">g^x mod p</span> is easy; reversing it is practically impossible.
              </p>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Active MITM Threat</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Without digital certificates, an active attacker completely takes over the key exchange.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
