import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  User,
  ShieldCheck,
  Copy,
  Check,
  Send,
  Radio,
  FileCode,
  XCircle,
} from "lucide-react";
import type { SimulationStep, SimulationResult } from "../../lib/crypto";

interface VisualStageProps {
  simulation: SimulationResult | null;
  currentStep: SimulationStep | null;
  currentStepIndex: number;
  mitm: boolean;
  authenticatedDh: boolean;
}

export const VisualStage: React.FC<VisualStageProps> = ({
  simulation,
  currentStep,
  currentStepIndex,
  mitm,
  authenticatedDh,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const summary = simulation?.summary || {};
  const actor = currentStep?.actor;

  // Trigger confetti burst on honest key match
  useEffect(() => {
    if (simulation?.keys_match && currentStep?.action.includes("Match Verified")) {
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.6 },
        colors: ["#f97316", "#ffffff", "#10b981", "#3b82f6"],
      });
    }
  }, [currentStep?.step, currentStep?.action, simulation?.keys_match]);

  return (
    <div className="space-y-6">
      {/* ===================== PROMINENT PRESENTER ACTIVE STEP BANNER ===================== */}
      {currentStep && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0c0c14] border-2 border-orange-500/50 shadow-xl shadow-orange-500/10 text-left transition-all">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1 rounded-full bg-orange-500 text-white font-mono font-bold text-xs uppercase tracking-wider">
                Step {currentStep.step} of {simulation?.steps?.length || 8}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300">
                Actor: <strong className="text-white">{currentStep.actor}</strong>
              </span>
            </div>
            <span className="text-xs font-mono text-neutral-400">
              Live Stage Synchronization
            </span>
          </div>

          <div className="mt-3 space-y-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{currentStep.action}</span>
            </h3>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
              {currentStep.description}
            </p>

            {currentStep.formula && (
              <div className="mt-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-sm sm:text-base text-orange-300 font-bold overflow-x-auto select-all">
                <code>{currentStep.formula}</code>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== 3-STATION DEMO STAGE (LARGE, VISIBLE & CLEAN) ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* ===================== ALICE (3 Cols) ===================== */}
        <div className="lg:col-span-4 flex flex-col">
          <div
            className={`bg-[#0d0d14] rounded-2xl p-6 border-2 flex-1 flex flex-col justify-between transition-all duration-200 shadow-xl ${
              actor === "Alice"
                ? "border-blue-500 shadow-blue-500/20 glow-blue"
                : "border-neutral-800"
            }`}
          >
            <div>
              {/* Alice Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/50 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Alice</h3>
                    <span className="text-xs text-blue-300 font-medium">Initiator &bull; Party A</span>
                  </div>
                </div>

                {authenticatedDh && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40">
                    <ShieldCheck className="w-3.5 h-3.5" /> Cert A
                  </span>
                )}
              </div>

              {/* Alice Large Numerical Readouts */}
              <div className="mt-5 space-y-3.5 text-left">
                {/* Private Key a */}
                <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-between">
                  <div className="overflow-hidden pr-2">
                    <span className="text-xs text-neutral-400 font-medium block">Private Exponent (Secret)</span>
                    <span className="font-mono text-lg font-bold text-blue-300 break-all">
                      a = {summary.alice_private || "?"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(summary.alice_private || "", "a")}
                    className="p-1.5 text-neutral-500 hover:text-white shrink-0"
                  >
                    {copiedKey === "a" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Public Key A = g^a mod p */}
                <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-between">
                  <div className="overflow-hidden pr-2">
                    <span className="text-xs text-neutral-400 font-medium block">Public Value (A = g^a mod p)</span>
                    <span className="font-mono text-xl font-extrabold text-white break-all">
                      A = {summary.alice_public || "?"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(summary.alice_public || "", "A")}
                    className="p-1.5 text-neutral-500 hover:text-white shrink-0"
                  >
                    {copiedKey === "A" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Computed Shared Key K_A */}
                <div
                  className={`p-4 rounded-xl border-2 transition-all ${
                    simulation?.keys_match && currentStepIndex >= 4
                      ? "bg-emerald-950/30 border-emerald-500 shadow-md shadow-emerald-500/10"
                      : mitm && currentStepIndex >= 4
                      ? "bg-rose-950/30 border-rose-500 shadow-md shadow-rose-500/10"
                      : "bg-neutral-900/80 border-neutral-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-neutral-300 font-semibold uppercase tracking-wider">
                      Alice's Computed Secret Key
                    </span>
                    {simulation?.keys_match && currentStepIndex >= 4 && (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Keys Match!
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-2xl font-black text-blue-300 block break-all">
                    K_A = {summary.alice_shared || "Pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* Outgoing Message Stream */}
            <div className="mt-6 pt-4 border-t border-neutral-800 text-left">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-blue-400" /> Message Outbox
              </span>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <p className="font-sans text-sm text-neutral-100 font-medium">
                  "{summary.original_message || "Secret rendezvous at noon."}"
                </p>
                {summary.ciphertext_hex && currentStepIndex >= 5 && (
                  <p className="font-mono text-xs text-blue-400 break-all pt-1 select-all">
                    Cipher: 0x{summary.ciphertext_hex.slice(0, 32)}...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===================== CENTER: PUBLIC CHANNEL & EVE (4 Cols) ===================== */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="bg-[#0d0d14] rounded-2xl p-6 border-2 border-neutral-800 flex-1 flex flex-col justify-between shadow-xl">
            {/* Top Wire Header */}
            <div className="text-center pb-3 border-b border-neutral-800">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-xs font-bold text-orange-400">
                <Radio className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                Insecure Public Channel (Internet)
              </div>
              <div className="mt-2 text-sm font-mono text-neutral-300 flex items-center justify-center gap-4">
                <span>Modulus <strong className="text-orange-400 font-extrabold text-base truncate max-w-[130px] inline-block align-bottom" title={summary.p || "23"}>p = {summary.p && summary.p.length > 8 ? `${summary.p.slice(0, 4)}...${summary.p.slice(-3)}` : (summary.p || "23")}</strong></span>
                <span>Generator <strong className="text-orange-400 font-extrabold text-base">g = {summary.g || "5"}</strong></span>
              </div>
            </div>

            {/* Flying Animated Packet Corridor */}
            <div className="my-6 relative py-4">
              <div className="h-1 w-full bg-neutral-800 relative rounded-full">
                {/* Large Flying Packet */}
                <motion.div
                  animate={{
                    x: actor === "Alice" ? "15%" : actor === "Bob" ? "85%" : "50%",
                  }}
                  transition={{ type: "spring", stiffness: 120, damping: 15 }}
                  className="absolute -top-4 -translate-x-1/2 flex flex-col items-center"
                >
                  <div
                    className={`px-3.5 py-1.5 rounded-xl border-2 text-xs font-mono font-extrabold shadow-lg flex items-center gap-2 ${
                      mitm
                        ? "bg-rose-950 border-rose-500 text-white shadow-rose-500/30"
                        : "bg-neutral-900 border-orange-400 text-orange-300 shadow-orange-500/20"
                    }`}
                  >
                    <FileCode className="w-4 h-4 text-orange-400" />
                    <span>{currentStep?.packet?.payload || "Public Packet"}</span>
                  </div>
                </motion.div>
              </div>

              {/* Wire Direction labels */}
              <div className="flex justify-between items-center text-xs text-neutral-400 mt-6 font-mono px-2">
                <span className="text-blue-400 font-bold">&larr; Alice Wire</span>
                <span className="text-emerald-400 font-bold">Bob Wire &rarr;</span>
              </div>
            </div>

            {/* EVE THREAT INTERCEPTION PANEL (When MITM is ON) */}
            <AnimatePresence>
              {mitm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl p-4 sm:p-5 bg-rose-950/30 border-2 border-rose-500 shadow-xl shadow-rose-900/30 space-y-3 text-left glow-rose"
                >
                  {/* Eve Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-rose-900/50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500 flex items-center justify-center">
                        <User className="w-4 h-4 text-rose-400" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">Eve (Active MITM Adversary)</h4>
                        <span className="text-[11px] text-rose-300">Intercepts, Decrypts & Tampers</span>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-mono font-bold">
                      INTRUDER
                    </span>
                  </div>

                  {/* Eve's dual rogue keys */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-neutral-950 border border-rose-900/60 overflow-hidden">
                      <span className="text-[11px] text-neutral-400 font-sans block font-semibold">Eve &rarr; Alice Key</span>
                      <span className="text-rose-300 font-bold text-sm break-all">
                        E_A = {summary.eve_public_alice || "?"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-neutral-950 border border-rose-900/60 overflow-hidden">
                      <span className="text-[11px] text-neutral-400 font-sans block font-semibold">Eve &rarr; Bob Key</span>
                      <span className="text-rose-300 font-bold text-sm break-all">
                        E_B = {summary.eve_public_bob || "?"}
                      </span>
                    </div>
                  </div>

                  {/* Eve's Tampering Readout */}
                  <div className="p-3 rounded-xl bg-neutral-950 border border-rose-900/60 space-y-1.5 text-xs">
                    <p className="text-neutral-200">
                      <strong className="text-orange-400 font-bold">Eve Decrypts: </strong>
                      "{summary.eve_read_message || summary.original_message || "Intercepting..."}"
                    </p>
                    <p className="text-rose-300 font-semibold">
                      <strong className="text-rose-400 font-bold">Eve Forges: </strong>
                      "{summary.tampered_message || "Wire $1,000,000 to Eve..."}"
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Passive Observer Readout */}
            <div className="pt-3 text-xs text-neutral-400 flex items-center justify-between font-mono">
              <span>Publicly Interceptable:</span>
              <span className="text-orange-400 font-bold">p, g, A, B, Ciphertext</span>
            </div>
          </div>
        </div>

        {/* ===================== BOB (3 Cols) ===================== */}
        <div className="lg:col-span-4 flex flex-col">
          <div
            className={`bg-[#0d0d14] rounded-2xl p-6 border-2 flex-1 flex flex-col justify-between transition-all duration-200 shadow-xl ${
              actor === "Bob"
                ? "border-emerald-500 shadow-emerald-500/20 glow-emerald"
                : "border-neutral-800"
            }`}
          >
            <div>
              {/* Bob Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center">
                    <User className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Bob</h3>
                    <span className="text-xs text-emerald-300 font-medium">Responder &bull; Party B</span>
                  </div>
                </div>

                {authenticatedDh && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40">
                    <ShieldCheck className="w-3.5 h-3.5" /> Cert B
                  </span>
                )}
              </div>

              {/* Bob Large Numerical Readouts */}
              <div className="mt-5 space-y-3.5 text-left">
                {/* Private Key b */}
                <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-between">
                  <div className="overflow-hidden pr-2">
                    <span className="text-xs text-neutral-400 font-medium block">Private Exponent (Secret)</span>
                    <span className="font-mono text-lg font-bold text-emerald-300 break-all">
                      b = {summary.bob_private || "?"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(summary.bob_private || "", "b")}
                    className="p-1.5 text-neutral-500 hover:text-white shrink-0"
                  >
                    {copiedKey === "b" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Public Key B = g^b mod p */}
                <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-between">
                  <div className="overflow-hidden pr-2">
                    <span className="text-xs text-neutral-400 font-medium block">Public Value (B = g^b mod p)</span>
                    <span className="font-mono text-xl font-extrabold text-white break-all">
                      B = {summary.bob_public || "?"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(summary.bob_public || "", "B")}
                    className="p-1.5 text-neutral-500 hover:text-white shrink-0"
                  >
                    {copiedKey === "B" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Computed Shared Key K_B */}
                <div
                  className={`p-4 rounded-xl border-2 transition-all ${
                    simulation?.keys_match && currentStepIndex >= 4
                      ? "bg-emerald-950/30 border-emerald-500 shadow-md shadow-emerald-500/10"
                      : mitm && currentStepIndex >= 4
                      ? "bg-rose-950/30 border-rose-500 shadow-md shadow-rose-500/10"
                      : "bg-neutral-900/80 border-neutral-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-neutral-300 font-semibold uppercase tracking-wider">
                      Bob's Computed Secret Key
                    </span>
                    {simulation?.keys_match && currentStepIndex >= 4 && (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Keys Match!
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-2xl font-black text-emerald-300 block break-all">
                    K_B = {summary.bob_shared || "Pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* Incoming Message Inbox */}
            <div className="mt-6 pt-4 border-t border-neutral-800 text-left">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-emerald-400" /> Message Inbox
              </span>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <p
                  className={`font-sans text-sm font-medium ${
                    mitm && currentStepIndex >= 6 ? "text-rose-300 font-bold" : "text-neutral-100"
                  }`}
                >
                  "{summary.bob_received_message || "Awaiting incoming transmission..."}"
                </p>
                {mitm && currentStepIndex >= 6 && (
                  <p className="text-xs text-rose-400 font-semibold pt-1">
                    Warning: Bob received tampered payload from Eve without detecting tampering!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== LARGE STATUS BANNERS ===================== */}
      <AnimatePresence>
        {/* Honest match banner */}
        {!mitm && simulation?.keys_match && currentStepIndex >= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-5 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 flex items-center justify-between flex-wrap gap-4 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-extrabold text-white">
                  Diffie-Hellman Keys Match! Shared Secret Established: K = {summary.alice_shared}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-300 mt-0.5">
                  Alice and Bob computed identical key K = g^(ab) mod p. The symmetric channel is confirmed secure!
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950 px-4 py-1.5 rounded-full border border-emerald-500/40">
              CONFIDENTIAL CHANNEL VERIFIED
            </span>
          </motion.div>
        )}

        {/* MITM key mismatch banner */}
        {mitm && !authenticatedDh && currentStepIndex >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-5 rounded-2xl bg-rose-950/50 border-2 border-rose-500 shadow-2xl shadow-rose-900/30 flex items-center justify-between flex-wrap gap-4 text-left glow-rose"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500 flex items-center justify-center shrink-0">
                <XCircle className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-extrabold text-white">
                  Security Breach: Key Mismatch (K_Alice: {summary.alice_shared} &ne; K_Bob: {summary.bob_shared})
                </h4>
                <p className="text-xs sm:text-sm text-rose-200 mt-0.5">
                  Eve intercepted both public keys and substituted her own. Eve can read and alter every message undetected!
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-rose-300 bg-rose-950 px-4 py-1.5 rounded-full border border-rose-500/40">
              MITM ATTACK ACTIVE
            </span>
          </motion.div>
        )}

        {/* Authenticated DH Defense Banner */}
        {authenticatedDh && mitm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-5 rounded-2xl bg-neutral-900 border-2 border-orange-500 shadow-xl shadow-orange-500/10 flex items-center justify-between flex-wrap gap-4 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-extrabold text-white">
                  Attack Thwarted: Digital Certificate Authentication Succeeded
                </h4>
                <p className="text-xs sm:text-sm text-neutral-300 mt-0.5">
                  Eve cannot forge Alice or Bob's X.509 digital signature. The forged public keys were rejected and the handshake was terminated.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-orange-400 bg-orange-950/60 px-4 py-1.5 rounded-full border border-orange-500/40">
              DEFENSE ACTIVATED
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
