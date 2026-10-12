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
  AlertTriangle,
  Dices,
} from "lucide-react";
import type { SimulationStep, SimulationResult } from "../../lib/crypto";

interface VisualStageProps {
  simulation: SimulationResult | null;
  currentStep: SimulationStep | null;
  currentStepIndex: number;
  totalSteps: number;
  steps: SimulationStep[];
  onSelectStep: (idx: number) => void;
  mitm: boolean;
  authenticatedDh: boolean;
  // Customizable parameters
  p: string;
  g: string;
  onPChange: (val: string) => void;
  onGChange: (val: string) => void;
  alicePrivate: string;
  onAlicePrivateChange: (val: string) => void;
  bobPrivate: string;
  onBobPrivateChange: (val: string) => void;
  eveAlicePrivate: string;
  onEveAlicePrivateChange: (val: string) => void;
  eveBobPrivate: string;
  onEveBobPrivateChange: (val: string) => void;
  message: string;
  onMessageChange: (val: string) => void;
  tamperedMessage: string;
  onTamperedMessageChange: (val: string) => void;
  onRandomizePrivateKeys: () => void;
}

export const VisualStage: React.FC<VisualStageProps> = ({
  simulation,
  currentStep,
  currentStepIndex,
  totalSteps,
  steps,
  onSelectStep,
  mitm,
  authenticatedDh,
  p,
  g,
  onPChange,
  onGChange,
  alicePrivate,
  onAlicePrivateChange,
  bobPrivate,
  onBobPrivateChange,
  eveAlicePrivate,
  onEveAlicePrivateChange,
  eveBobPrivate,
  onEveBobPrivateChange,
  message,
  onMessageChange,
  tamperedMessage,
  onTamperedMessageChange,
  onRandomizePrivateKeys,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const summary = simulation?.summary || {};
  const actor = currentStep?.actor;

  // Reveal encrypted transmission only after keys are established / message steps are reached
  const showMessages =
    currentStepIndex >= 6 ||
    (currentStep?.action?.toLowerCase().includes("message") ?? false) ||
    (currentStep?.action?.toLowerCase().includes("secret") ?? false);

  // Trigger confetti burst on honest key match verification
  useEffect(() => {
    if (simulation?.keys_match && currentStep?.action?.includes("Match")) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#f97316", "#ffffff", "#10b981", "#3b82f6"],
      });
    }
  }, [currentStep?.step, currentStep?.action, simulation?.keys_match]);

  const cleanFormula = currentStep?.formula
    ? currentStep.formula
        .replace(/\\bmod/g, "mod")
        .replace(/\\quad/g, " ")
        .replace(/\\implies/g, "→")
        .replace(/\\in/g, "∈")
        .replace(/\\text\{/g, "")
        .replace(/\}/g, "")
        .replace(/\{/g, "")
    : "";

  return (
    <div className="space-y-3">
      {/* ===================== 3-STATION MAIN STAGE (ALICE | CHANNEL / EVE | BOB) ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-3.5 items-stretch text-left">
        {/* ===================== 1. ALICE (INITIATOR) ===================== */}
        <div
          className={`rounded-2xl p-3.5 sm:p-4 border transition-all duration-300 flex flex-col justify-start space-y-2.5 shadow-xl ${
            actor === "Alice"
              ? "bg-[#0b1220] border-blue-500 shadow-blue-500/20 ring-1 ring-blue-500/40"
              : "bg-[#0a0a10] border-neutral-800"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800/90">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-950 border border-blue-500/50 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h4 className="font-bold text-[15px] sm:text-base text-white leading-tight">Alice</h4>
                <span className="text-xs text-blue-300 font-medium">Initiator (Party A)</span>
              </div>
            </div>

            {authenticatedDh && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                <ShieldCheck className="w-3.5 h-3.5" /> Cert A
              </span>
            )}
          </div>

          {/* Numeric Values Grid (Customizable Private 'a' + Calculated Public 'A') */}
          <div className="grid grid-cols-2 gap-2 font-mono">
            {/* Customizable Private a */}
            <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800/90 flex items-center justify-between">
              <div className="min-w-0 pr-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400 font-sans font-semibold">Private (a)</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-sm font-bold text-blue-300">a=</span>
                  <input
                    type="text"
                    value={alicePrivate}
                    onChange={(e) => onAlicePrivateChange(e.target.value)}
                    className="w-16 px-1.5 py-0.5 bg-neutral-900 border border-blue-500/40 focus:border-blue-400 rounded text-blue-300 font-mono text-sm font-bold focus:outline-none transition-colors"
                    title="Customize Alice private exponent (secret integer)"
                    aria-label="Alice private exponent"
                  />
                </div>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={onRandomizePrivateKeys}
                  className="text-neutral-500 hover:text-blue-400 p-1"
                  title="Roll random private key"
                >
                  <Dices className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(alicePrivate, "a")}
                  className="text-neutral-500 hover:text-white p-1"
                  title="Copy private exponent"
                >
                  {copiedKey === "a" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Automatically Calculated Public A = g^a mod p */}
            <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800/90 flex items-center justify-between">
              <div className="min-w-0 pr-1">
                <span className="text-[11px] text-neutral-400 font-sans block font-semibold truncate" title="A = g^a mod p">
                  Public (A = g^a mod p)
                </span>
                <span className="text-sm sm:text-[15px] font-bold text-white truncate block mt-0.5">
                  A = {summary.alice_public || "?"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(summary.alice_public || "", "A")}
                className="text-neutral-500 hover:text-white shrink-0 p-1"
                title="Copy public value"
              >
                {copiedKey === "A" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Automatically Calculated Shared Key K_A = B^a mod p */}
          <div
            className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
              simulation?.keys_match && currentStepIndex >= 4
                ? "bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-500/10"
                : mitm && currentStepIndex >= 4
                ? "bg-rose-950/40 border-rose-500 shadow-md shadow-rose-500/10"
                : "bg-neutral-950 border-neutral-800"
            }`}
          >
            <div>
              <span className="text-[11px] text-neutral-400 uppercase font-semibold block leading-none">
                Alice Computed Key {mitm ? "(E_A^a mod p)" : "(B^a mod p)"}
              </span>
              <span className="font-mono text-sm sm:text-base font-black text-blue-300 block mt-1">
                K_A = {summary.alice_shared || "Pending..."}
              </span>
            </div>
            {simulation?.keys_match && currentStepIndex >= 4 && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-500/40">
                <Check className="w-3.5 h-3.5" /> Match
              </span>
            )}
            {mitm && currentStepIndex >= 4 && (
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1 bg-rose-950 px-2 py-0.5 rounded-md border border-rose-500/40">
                <AlertTriangle className="w-3.5 h-3.5" /> Compromised
              </span>
            )}
          </div>

          {/* Outbox Message Strip (Customizable message, appears when message phase is reached) */}
          <AnimatePresence>
            {showMessages && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-1 overflow-hidden"
              >
                <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs sm:text-[13px] gap-2">
                  <span className="text-neutral-400 flex items-center gap-1.5 font-semibold shrink-0">
                    <Send className="w-3.5 h-3.5 text-blue-400" /> Outbox:
                  </span>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => onMessageChange(e.target.value)}
                    className="flex-1 px-2 py-0.5 bg-neutral-900 border border-neutral-700 focus:border-blue-500 rounded text-neutral-100 text-xs focus:outline-none"
                    placeholder="Alice's plaintext message"
                    title="Customize Alice's plaintext message"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ===================== 2. PUBLIC CHANNEL / EVE ADVERSARY ===================== */}
        <div
          className={`rounded-2xl p-3.5 sm:p-4 border transition-all duration-300 flex flex-col justify-start space-y-2.5 shadow-xl ${
            mitm
              ? "bg-[#140a0f] border-rose-900/80 ring-1 ring-rose-500/30"
              : actor === "Channel"
              ? "bg-[#140e0a] border-orange-500/80 ring-1 ring-orange-500/30"
              : "bg-[#0a0a10] border-neutral-800"
          }`}
        >
          {/* Header (with directly editable p & g parameters) */}
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800/90">
            <div className="flex items-center gap-2">
              {mitm ? (
                <div className="w-8 h-8 rounded-xl bg-rose-950 border border-rose-500/50 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-rose-400" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-orange-950 border border-orange-500/50 flex items-center justify-center shrink-0">
                  <Radio className="w-4 h-4 text-orange-400 animate-pulse" />
                </div>
              )}
              <div>
                <h4 className="font-bold text-[15px] sm:text-base text-white leading-tight">
                  {mitm ? "Eve (MITM Adversary)" : "Public Channel"}
                </h4>
                <span className="text-xs text-neutral-400 font-medium">
                  {mitm ? "Man-in-the-Middle Attack" : "Insecure Public Network"}
                </span>
              </div>
            </div>

            {/* Directly Customizable p and g */}
            {mitm ? (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-mono font-bold text-[10px] uppercase tracking-wider animate-pulse">
                INTRUDER
              </span>
            ) : (
              <div className="flex items-center gap-1 font-mono text-xs font-bold text-orange-300 bg-neutral-950 px-2 py-0.5 rounded-lg border border-neutral-800">
                <span className="text-neutral-400">p=</span>
                <input
                  type="text"
                  value={p}
                  onChange={(e) => onPChange(e.target.value)}
                  className="w-12 px-1 py-0.5 bg-neutral-900 border border-neutral-700 focus:border-orange-500 rounded text-orange-300 text-xs font-bold text-center focus:outline-none"
                  title="Customize Prime modulus p"
                  aria-label="Prime modulus p"
                />
                <span className="text-neutral-400 ml-1">g=</span>
                <input
                  type="text"
                  value={g}
                  onChange={(e) => onGChange(e.target.value)}
                  className="w-8 px-1 py-0.5 bg-neutral-900 border border-neutral-700 focus:border-orange-500 rounded text-orange-300 text-xs font-bold text-center focus:outline-none"
                  title="Customize Generator base g"
                  aria-label="Generator base g"
                />
              </div>
            )}
          </div>

          {/* Flying Packet Animation on Wire */}
          <div className="py-1.5">
            <div className="h-1.5 w-full bg-neutral-800 relative rounded-full">
              <motion.div
                animate={{
                  x: actor === "Alice" ? "15%" : actor === "Bob" ? "85%" : "50%",
                }}
                transition={{ type: "spring", stiffness: 140, damping: 16 }}
                className="absolute -top-3.5 -translate-x-1/2 flex flex-col items-center"
              >
                <div
                  className={`px-2.5 py-1 rounded-xl border text-xs sm:text-[13px] font-mono font-bold shadow-lg flex items-center gap-1.5 ${
                    mitm
                      ? "bg-rose-950 border-rose-500 text-white shadow-rose-500/30"
                      : "bg-neutral-900 border-orange-400 text-orange-300 shadow-orange-500/20"
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-orange-400" />
                  <span className="truncate max-w-[140px]">
                    {currentStep?.packet?.payload || "Public Packet"}
                  </span>
                </div>
              </motion.div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-neutral-500 mt-2.5 font-mono">
              <span>&larr; Alice Wire</span>
              <span>Bob Wire &rarr;</span>
            </div>
          </div>

          {/* Eve Active Intercept Details (when MITM is ON - directly customizable rogue exponents) */}
          {mitm ? (
            <div className="space-y-1.5 font-mono text-xs">
              <div className="grid grid-cols-2 gap-1.5">
                <div className="p-1.5 rounded-lg bg-neutral-950 border border-rose-900/60">
                  <span className="text-[10px] text-neutral-400 block font-sans">Eve Exponent (e_A):</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-rose-300 font-bold">e_A=</span>
                    <input
                      type="text"
                      value={eveAlicePrivate}
                      onChange={(e) => onEveAlicePrivateChange(e.target.value)}
                      className="w-12 px-1 py-0.5 bg-neutral-900 border border-rose-800/80 rounded text-rose-300 text-xs font-bold focus:border-rose-500 focus:outline-none"
                      title="Eve's rogue exponent for Alice"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">E_A={summary.eve_public_alice || "?"}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-neutral-950 border border-rose-900/60">
                  <span className="text-[10px] text-neutral-400 block font-sans">Eve Exponent (e_B):</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-rose-300 font-bold">e_B=</span>
                    <input
                      type="text"
                      value={eveBobPrivate}
                      onChange={(e) => onEveBobPrivateChange(e.target.value)}
                      className="w-12 px-1 py-0.5 bg-neutral-900 border border-rose-800/80 rounded text-rose-300 text-xs font-bold focus:border-rose-500 focus:outline-none"
                      title="Eve's rogue exponent for Bob"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">E_B={summary.eve_public_bob || "?"}</span>
                </div>
              </div>
              <div className="p-1.5 rounded-lg bg-neutral-950 border border-rose-900/60 text-xs flex items-center gap-1.5">
                <span className="text-rose-400 font-bold shrink-0">Forged:</span>
                <input
                  type="text"
                  value={tamperedMessage}
                  onChange={(e) => onTamperedMessageChange(e.target.value)}
                  className="flex-1 px-1.5 py-0.5 bg-neutral-900 border border-rose-900 focus:border-rose-500 rounded text-rose-200 text-xs focus:outline-none"
                  title="Eve's tampered/forged message"
                />
              </div>
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs text-neutral-400 leading-relaxed font-mono">
              <span className="text-neutral-500 block font-sans font-semibold text-[10px] uppercase">
                Public Interception Ledger:
              </span>
              <span className="text-orange-400 font-bold block mt-0.5 truncate">
                p = {p}, g = {g}, A = {summary.alice_public || "?"}, B = {summary.bob_public || "?"}
              </span>
            </div>
          )}

          {/* Channel Wire Footer Tag */}
          <div className="pt-1 border-t border-neutral-800 text-xs text-neutral-400 flex items-center justify-between font-mono">
            <span>Security:</span>
            <span className={mitm ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
              {mitm ? "Attacker Injected" : "Eavesdropper-Observable"}
            </span>
          </div>
        </div>

        {/* ===================== 3. BOB (RESPONDER) ===================== */}
        <div
          className={`rounded-2xl p-3.5 sm:p-4 border transition-all duration-300 flex flex-col justify-start space-y-2.5 shadow-xl ${
            actor === "Bob"
              ? "bg-[#0a1812] border-emerald-500 shadow-emerald-500/20 ring-1 ring-emerald-500/40"
              : "bg-[#0a0a10] border-neutral-800"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800/90">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-[15px] sm:text-base text-white leading-tight">Bob</h4>
                <span className="text-xs text-emerald-300 font-medium">Responder (Party B)</span>
              </div>
            </div>

            {authenticatedDh && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                <ShieldCheck className="w-3.5 h-3.5" /> Cert B
              </span>
            )}
          </div>

          {/* Numeric Values Grid (Customizable Private 'b' + Calculated Public 'B') */}
          <div className="grid grid-cols-2 gap-2 font-mono">
            {/* Customizable Private b */}
            <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800/90 flex items-center justify-between">
              <div className="min-w-0 pr-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400 font-sans font-semibold">Private (b)</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-sm font-bold text-emerald-300">b=</span>
                  <input
                    type="text"
                    value={bobPrivate}
                    onChange={(e) => onBobPrivateChange(e.target.value)}
                    className="w-16 px-1.5 py-0.5 bg-neutral-900 border border-emerald-500/40 focus:border-emerald-400 rounded text-emerald-300 font-mono text-sm font-bold focus:outline-none transition-colors"
                    title="Customize Bob private exponent (secret integer)"
                    aria-label="Bob private exponent"
                  />
                </div>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={onRandomizePrivateKeys}
                  className="text-neutral-500 hover:text-emerald-400 p-1"
                  title="Roll random private key"
                >
                  <Dices className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(bobPrivate, "b")}
                  className="text-neutral-500 hover:text-white p-1"
                  title="Copy private exponent"
                >
                  {copiedKey === "b" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Automatically Calculated Public B = g^b mod p */}
            <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800/90 flex items-center justify-between">
              <div className="min-w-0 pr-1">
                <span className="text-[11px] text-neutral-400 font-sans block font-semibold truncate" title="B = g^b mod p">
                  Public (B = g^b mod p)
                </span>
                <span className="text-sm sm:text-[15px] font-bold text-white truncate block mt-0.5">
                  B = {summary.bob_public || "?"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(summary.bob_public || "", "B")}
                className="text-neutral-500 hover:text-white shrink-0 p-1"
                title="Copy public value"
              >
                {copiedKey === "B" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Automatically Calculated Shared Key K_B = A^b mod p */}
          <div
            className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
              simulation?.keys_match && currentStepIndex >= 4
                ? "bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-500/10"
                : mitm && currentStepIndex >= 4
                ? "bg-rose-950/40 border-rose-500 shadow-md shadow-rose-500/10"
                : "bg-neutral-950 border-neutral-800"
            }`}
          >
            <div>
              <span className="text-[11px] text-neutral-400 uppercase font-semibold block leading-none">
                Bob Computed Key {mitm ? "(E_B^b mod p)" : "(A^b mod p)"}
              </span>
              <span className="font-mono text-sm sm:text-base font-black text-emerald-300 block mt-1">
                K_B = {summary.bob_shared || "Pending..."}
              </span>
            </div>
            {simulation?.keys_match && currentStepIndex >= 4 && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-500/40">
                <Check className="w-3.5 h-3.5" /> Match
              </span>
            )}
            {mitm && currentStepIndex >= 4 && (
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1 bg-rose-950 px-2 py-0.5 rounded-md border border-rose-500/40">
                <AlertTriangle className="w-3.5 h-3.5" /> Compromised
              </span>
            )}
          </div>

          {/* Inbox Message Strip (Appears gracefully when message phase is reached) */}
          <AnimatePresence>
            {showMessages && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-1 overflow-hidden"
              >
                <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs sm:text-[13px]">
                  <span className="text-neutral-400 flex items-center gap-1.5 font-semibold shrink-0">
                    <FileCode className="w-3.5 h-3.5 text-emerald-400" /> Inbox:
                  </span>
                  <span
                    className={`font-medium truncate ml-2 text-right ${
                      mitm && currentStepIndex >= 6 ? "text-rose-300 font-bold" : "text-neutral-200"
                    }`}
                  >
                    "{summary.bob_received_message || "Awaiting transmission..."}"
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ===================== STEP EXPLANATION BOX (MATCHING PAINT-MIXING ANALOGY STYLE) ===================== */}
      {currentStep && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#08080c] border border-neutral-800 shadow-inner text-left space-y-2">
          {/* Header Row: Step Pill, Actor Pill, Formula */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800/80 pb-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white font-mono font-bold text-xs uppercase tracking-wider">
                Step {currentStep.step} of {totalSteps}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-semibold">
                Actor: {currentStep.actor}
              </span>
            </div>

            {cleanFormula && (
              <span className="font-mono text-xs sm:text-sm font-bold text-orange-300 bg-neutral-950 px-3 py-0.5 rounded-xl border border-neutral-800 select-all">
                {cleanFormula}
              </span>
            )}
          </div>

          {/* Step Title & Detailed Description with slightly increased readable font */}
          <div>
            <h4 className="text-[16px] sm:text-lg font-bold text-white tracking-tight">
              {currentStep.action}
            </h4>
            <p className="text-xs sm:text-[14px] text-neutral-200 mt-0.5 leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Interactive Step Scrubber Track */}
          <div className="pt-0.5 flex items-center justify-center gap-1.5 flex-wrap">
            {steps.map((st, idx) => (
              <button
                key={st.step}
                type="button"
                onClick={() => onSelectStep(idx)}
                title={`Step ${st.step}: ${st.action}`}
                className={`h-2 rounded-full transition-all duration-200 ${
                  idx === currentStepIndex
                    ? "w-8 bg-orange-500 shadow-md shadow-orange-500/50"
                    : idx < currentStepIndex
                    ? "w-3 bg-neutral-600 hover:bg-neutral-500"
                    : "w-3 bg-neutral-800 hover:bg-neutral-700"
                }`}
                aria-label={`Jump to Step ${st.step}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ===================== STATUS NOTIFICATION BANNER ===================== */}
      <AnimatePresence>
        {!mitm && simulation?.keys_match && currentStepIndex >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/80 flex items-center justify-between text-xs sm:text-sm text-left shadow-lg"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-white font-bold">
                Keys Match Verified: K_A = K_B = {summary.alice_shared}
              </span>
              <span className="text-emerald-300 text-xs hidden sm:inline">
                (Identical secret established over unencrypted public channel)
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded-lg border border-emerald-500/40">
              SECURE
            </span>
          </motion.div>
        )}

        {mitm && !authenticatedDh && currentStepIndex >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-3.5 py-1.5 rounded-xl bg-rose-950/70 border border-rose-500 flex items-center justify-between text-xs sm:text-sm text-left shadow-lg glow-rose"
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="text-white font-bold">
                Security Compromised: K_A ({summary.alice_shared}) &ne; K_B ({summary.bob_shared})
              </span>
              <span className="text-rose-200 text-xs hidden sm:inline">
                (Eve substituted public keys; all messages decrypted &amp; tampered!)
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-rose-300 bg-rose-900/80 px-2 py-0.5 rounded-lg border border-rose-500/40">
              MITM BREACH
            </span>
          </motion.div>
        )}

        {authenticatedDh && mitm && (
          <motion.div
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-3.5 py-1.5 rounded-xl bg-orange-950/50 border border-orange-500/80 flex items-center justify-between text-xs sm:text-sm text-left shadow-lg"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
              <span className="text-white font-bold">
                PKI Signature Verification: MITM Tampering Detected &amp; Thwarted!
              </span>
              <span className="text-neutral-300 text-xs hidden sm:inline">
                (Digital certificates ensured authenticity)
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-orange-400 bg-orange-900/60 px-2 py-0.5 rounded-lg border border-orange-500/40">
              PKI ACTIVE
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
