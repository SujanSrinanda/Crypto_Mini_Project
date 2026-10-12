import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  User,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  Send,
  Zap,
  Radio,
  FileCode,
  ArrowRight,
  ArrowLeft,
  XCircle,
} from "lucide-react";
import type { SimulationStep, SimulationResult } from "../../lib/crypto";
import { Tooltip } from "../Tooltip";

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
  const [revealAliceSecret, setRevealAliceSecret] = useState(false);
  const [revealBobSecret, setRevealBobSecret] = useState(false);
  const [revealEveSecret, setRevealEveSecret] = useState(false);
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
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#38bdf8", "#34d399", "#818cf8"],
      });
    }
  }, [currentStep?.step, currentStep?.action, simulation?.keys_match]);

  return (
    <div className="relative py-4 space-y-6">
      {/* 3-Column Character & Channel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* ===================== ALICE COLUMN (3 Cols) ===================== */}
        <div className="lg:col-span-4 flex flex-col">
          <motion.div
            layout
            className={`glass-panel rounded-2xl p-5 border flex-1 flex flex-col justify-between transition-all duration-300 ${
              actor === "Alice"
                ? "border-sky-500 shadow-xl shadow-sky-500/20 glow-alice"
                : "border-sky-900/40"
            }`}
          >
            {/* Alice Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-sky-900/40">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 p-0.5 shadow-md shadow-sky-500/30">
                      <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                        <User className="w-6 h-6 text-sky-400" />
                      </div>
                    </div>
                    {actor === "Alice" && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white flex items-center gap-2">
                      Alice
                      <span className="text-[10px] px-2 py-0.5 font-medium rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        Initiator
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">Sender & Party A</p>
                  </div>
                </div>

                {authenticatedDh && (
                  <Tooltip content="Possesses valid X.509 Digital Certificate">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-500/30">
                      <ShieldCheck className="w-3.5 h-3.5" /> Cert A
                    </span>
                  </Tooltip>
                )}
              </div>

              {/* Private Key Vault */}
              <div className="mt-4 p-3.5 rounded-xl bg-sky-950/20 border border-sky-800/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-sky-300">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-sky-400" /> Private Secret Vault (a)
                  </span>
                  <button
                    type="button"
                    onClick={() => setRevealAliceSecret(!revealAliceSecret)}
                    className="text-slate-400 hover:text-sky-300 transition-colors p-1"
                    aria-label="Toggle Alice secret visibility"
                  >
                    {revealAliceSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="flex items-center justify-between bg-slate-950/80 px-3 py-2 rounded-lg border border-sky-900/40">
                  <span
                    className={`font-mono text-xs text-sky-200 transition-all select-all ${
                      revealAliceSecret ? "" : "blur-sm select-none"
                    }`}
                  >
                    {summary.alice_private ? `a = ${summary.alice_private}` : "Generating..."}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(summary.alice_private || "", "alice_a")}
                    className="text-slate-500 hover:text-sky-300 transition-colors"
                  >
                    {copiedKey === "alice_a" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Public Value Computation: A = g^a mod p */}
              <div className="mt-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <span className="text-xs font-semibold text-slate-300">
                  Public Value (<span className="font-mono text-sky-400">A = g^a mod p</span>)
                </span>
                <div className="flex items-center justify-between bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800">
                  <span className="font-mono text-xs text-slate-200 truncate pr-2 select-all">
                    {summary.alice_public ? `A = ${summary.alice_public}` : "Pending calculation..."}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(summary.alice_public || "", "alice_pub")}
                    className="text-slate-500 hover:text-sky-300 transition-colors shrink-0"
                  >
                    {copiedKey === "alice_pub" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Shared Secret Computation: K_A */}
              <div
                className={`mt-4 p-3.5 rounded-xl border transition-all ${
                  simulation?.keys_match
                    ? "bg-emerald-950/20 border-emerald-500/40"
                    : mitm
                    ? "bg-rose-950/20 border-rose-500/40"
                    : "bg-slate-900/60 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">
                    Alice's Computed Secret (<span className="font-mono text-sky-400">K_A</span>)
                  </span>
                  {simulation?.keys_match && currentStepIndex >= 4 && (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Valid Match
                    </span>
                  )}
                  {mitm && currentStepIndex >= 4 && (
                    <span className="text-[10px] text-rose-400 font-bold flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> Shared with Eve
                    </span>
                  )}
                </div>
                <div className="bg-slate-950/90 px-3 py-2 rounded-lg border border-slate-800 font-mono text-xs text-sky-300 truncate select-all">
                  {summary.alice_shared ? `K_A = ${summary.alice_shared}` : "Awaiting exchange..."}
                </div>
              </div>
            </div>

            {/* Outgoing Message Encryption Box */}
            <div className="mt-5 pt-4 border-t border-slate-800/80">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                <Send className="w-3.5 h-3.5 text-sky-400" /> Message Outbox
              </span>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Plaintext</span>
                  <p className="font-sans text-slate-200 mt-0.5 truncate">
                    "{summary.original_message || "Secret rendezvous at noon."}"
                  </p>
                </div>
                {summary.ciphertext_hex && currentStepIndex >= 5 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Ciphertext Hex (Stream XOR)
                    </span>
                    <p className="font-mono text-[11px] text-sky-300 break-all select-all mt-0.5">
                      0x{summary.ciphertext_hex.slice(0, 36)}...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ===================== CENTER: PUBLIC CHANNEL (4 Cols) ===================== */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800/90 flex-1 flex flex-col justify-between relative overflow-hidden">
            {/* Top Wire Parameters Badge */}
            <div className="text-center pb-3 border-b border-slate-800/80">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300">
                <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                Insecure Public Channel (Internet)
              </span>
              <div className="mt-2 text-xs font-mono text-slate-400 flex items-center justify-center gap-4">
                <span>p = <strong className="text-amber-300">{summary.p || "23"}</strong></span>
                <span>g = <strong className="text-amber-300">{summary.g || "5"}</strong></span>
              </div>
            </div>

            {/* Live Packet Animation Area */}
            <div className="my-6 relative py-4">
              <div className="h-0.5 w-full bg-gradient-to-r from-sky-500/40 via-amber-400/40 to-emerald-500/40 relative">
                {/* Traveling Packet */}
                <motion.div
                  animate={{
                    x: actor === "Alice" ? "15%" : actor === "Bob" ? "85%" : mitm ? "50%" : "50%",
                  }}
                  transition={{ type: "spring", stiffness: 120, damping: 15 }}
                  className="absolute -top-4 -translate-x-1/2 flex flex-col items-center"
                >
                  <div
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-md ${
                      mitm
                        ? "bg-rose-950/90 border-rose-500 text-rose-300 shadow-rose-500/30"
                        : "bg-slate-900/90 border-amber-400 text-amber-300 shadow-amber-400/20"
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>{currentStep?.packet?.payload || "Packet"}</span>
                  </div>
                </motion.div>
              </div>

              {/* Wire Direction arrows */}
              <div className="flex justify-between items-center text-[10px] text-slate-500 mt-6 px-2 font-mono">
                <span className="flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-sky-400" /> Alice &rarr; Wire
                </span>
                <span className="flex items-center gap-1">
                  Wire &larr; Bob <ArrowLeft className="w-3 h-3 text-emerald-400" />
                </span>
              </div>
            </div>

            {/* EVE INTERCEPTOR BOX (When MITM Mode is ON) */}
            <AnimatePresence>
              {mitm && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl p-4 bg-rose-950/30 border border-rose-500/50 shadow-xl shadow-rose-500/10 glow-eve space-y-3"
                >
                  {/* Eve Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-rose-900/40">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 p-0.5 shadow-md shadow-rose-500/30">
                        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                          <User className="w-5 h-5 text-rose-400" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                          Eve (Active MITM)
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
                            Rogue Proxy
                          </span>
                        </h4>
                        <p className="text-[10px] text-rose-300/80">Intercepts & Injects Keys</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setRevealEveSecret(!revealEveSecret)}
                      className="text-slate-400 hover:text-rose-300 p-1"
                      aria-label="Toggle Eve secret visibility"
                    >
                      {revealEveSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Eve's dual rogue keys */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-lg bg-slate-950/80 border border-rose-900/40">
                      <span className="text-[10px] text-slate-400 block font-sans">Eve-Alice Pair</span>
                      <span className={`text-rose-300 ${revealEveSecret ? "" : "blur-xs"}`}>
                        e_A={summary.eve_alice_private || "?"} &rarr; E_A={summary.eve_public_alice || "?"}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950/80 border border-rose-900/40">
                      <span className="text-[10px] text-slate-400 block font-sans">Eve-Bob Pair</span>
                      <span className={`text-rose-300 ${revealEveSecret ? "" : "blur-xs"}`}>
                        e_B={summary.eve_bob_private || "?"} &rarr; E_B={summary.eve_public_bob || "?"}
                      </span>
                    </div>
                  </div>

                  {/* Eve reads and tampers */}
                  <div className="p-2.5 rounded-lg bg-slate-950/90 border border-rose-900/50 space-y-1.5 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">
                        Eve Eavesdropped
                      </span>
                      <p className="text-slate-200 italic font-sans truncate">
                        "{summary.eve_read_message || summary.original_message || "Awaiting interception..."}"
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-rose-400 tracking-wider">
                        Eve Injected Payload
                      </span>
                      <p className="text-rose-200 font-sans truncate">
                        "{summary.tampered_message || "Wire $1,000,000 to Eve..."}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Channel Passive Observer Badge */}
            <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Publicly Visible:</span>
              <span className="font-mono text-amber-300 font-semibold">
                p, g, A, B, Ciphertext
              </span>
            </div>
          </div>
        </div>

        {/* ===================== BOB COLUMN (3 Cols) ===================== */}
        <div className="lg:col-span-4 flex flex-col">
          <motion.div
            layout
            className={`glass-panel rounded-2xl p-5 border flex-1 flex flex-col justify-between transition-all duration-300 ${
              actor === "Bob"
                ? "border-emerald-500 shadow-xl shadow-emerald-500/20 glow-bob"
                : "border-emerald-900/40"
            }`}
          >
            {/* Bob Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-emerald-900/40">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 p-0.5 shadow-md shadow-emerald-500/30">
                      <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                        <User className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>
                    {actor === "Bob" && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white flex items-center gap-2">
                      Bob
                      <span className="text-[10px] px-2 py-0.5 font-medium rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Responder
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">Receiver & Party B</p>
                  </div>
                </div>

                {authenticatedDh && (
                  <Tooltip content="Possesses valid X.509 Digital Certificate">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-500/30">
                      <ShieldCheck className="w-3.5 h-3.5" /> Cert B
                    </span>
                  </Tooltip>
                )}
              </div>

              {/* Private Key Vault */}
              <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" /> Private Secret Vault (b)
                  </span>
                  <button
                    type="button"
                    onClick={() => setRevealBobSecret(!revealBobSecret)}
                    className="text-slate-400 hover:text-emerald-300 transition-colors p-1"
                    aria-label="Toggle Bob secret visibility"
                  >
                    {revealBobSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="flex items-center justify-between bg-slate-950/80 px-3 py-2 rounded-lg border border-emerald-900/40">
                  <span
                    className={`font-mono text-xs text-emerald-200 transition-all select-all ${
                      revealBobSecret ? "" : "blur-sm select-none"
                    }`}
                  >
                    {summary.bob_private ? `b = ${summary.bob_private}` : "Generating..."}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(summary.bob_private || "", "bob_b")}
                    className="text-slate-500 hover:text-emerald-300 transition-colors"
                  >
                    {copiedKey === "bob_b" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Public Value Computation: B = g^b mod p */}
              <div className="mt-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <span className="text-xs font-semibold text-slate-300">
                  Public Value (<span className="font-mono text-emerald-400">B = g^b mod p</span>)
                </span>
                <div className="flex items-center justify-between bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800">
                  <span className="font-mono text-xs text-slate-200 truncate pr-2 select-all">
                    {summary.bob_public ? `B = ${summary.bob_public}` : "Pending calculation..."}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(summary.bob_public || "", "bob_pub")}
                    className="text-slate-500 hover:text-emerald-300 transition-colors shrink-0"
                  >
                    {copiedKey === "bob_pub" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Shared Secret Computation: K_B */}
              <div
                className={`mt-4 p-3.5 rounded-xl border transition-all ${
                  simulation?.keys_match
                    ? "bg-emerald-950/20 border-emerald-500/40"
                    : mitm
                    ? "bg-rose-950/20 border-rose-500/40"
                    : "bg-slate-900/60 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">
                    Bob's Computed Secret (<span className="font-mono text-emerald-400">K_B</span>)
                  </span>
                  {simulation?.keys_match && currentStepIndex >= 4 && (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Valid Match
                    </span>
                  )}
                  {mitm && currentStepIndex >= 4 && (
                    <span className="text-[10px] text-rose-400 font-bold flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> Shared with Eve
                    </span>
                  )}
                </div>
                <div className="bg-slate-950/90 px-3 py-2 rounded-lg border border-slate-800 font-mono text-xs text-emerald-300 truncate select-all">
                  {summary.bob_shared ? `K_B = ${summary.bob_shared}` : "Awaiting exchange..."}
                </div>
              </div>
            </div>

            {/* Incoming Message Decryption Box */}
            <div className="mt-5 pt-4 border-t border-slate-800/80">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                <FileCode className="w-3.5 h-3.5 text-emerald-400" /> Message Inbox
              </span>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Decrypted Plaintext
                  </span>
                  <p
                    className={`font-sans mt-0.5 truncate font-medium ${
                      mitm && currentStepIndex >= 6 ? "text-rose-400 font-semibold" : "text-emerald-200"
                    }`}
                  >
                    "{summary.bob_received_message || "Awaiting incoming transmission..."}"
                  </p>
                </div>
                {mitm && currentStepIndex >= 6 && (
                  <span className="text-[10px] text-rose-400 block font-semibold">
                    Warning: Bob received tampered payload without detecting Eve!
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===================== STATUS ALERT / MATCH BANNER ===================== */}
      <AnimatePresence>
        {/* Honest match banner */}
        {!mitm && simulation?.keys_match && currentStepIndex >= 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 shadow-xl shadow-emerald-500/10 flex items-center justify-between flex-wrap gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-200">
                  Diffie-Hellman Keys Match! Shared Secret Established
                </h4>
                <p className="text-xs text-emerald-300/80 font-mono mt-0.5">
                  K_Alice ({summary.alice_shared}) == K_Bob ({summary.bob_shared}) = g^(ab) mod p. Eavesdropper cannot deduce this without solving the Discrete Logarithm.
                </p>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-emerald-900/60 border border-emerald-600/40 text-xs font-mono text-emerald-200">
              Session Confirmed
            </div>
          </motion.div>
        )}

        {/* MITM key mismatch banner */}
        {mitm && !authenticatedDh && currentStepIndex >= 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/60 shadow-xl shadow-rose-500/20 flex items-center justify-between flex-wrap gap-4 glow-eve"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                <XCircle className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-rose-200">
                  Critical MITM Breach: Alice and Bob Share Different Keys!
                </h4>
                <p className="text-xs text-rose-300/80 font-mono mt-0.5">
                  K_Alice ({summary.alice_shared}) &ne; K_Bob ({summary.bob_shared}). Eve intercepts, decrypts, tampers with messages, and re-encrypts seamlessly!
                </p>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-rose-900/60 border border-rose-600/40 text-xs font-mono text-rose-200 font-bold">
              Man-In-The-Middle Active
            </div>
          </motion.div>
        )}

        {/* Authenticated DH Defense Banner */}
        {authenticatedDh && mitm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-2xl bg-sky-950/60 border border-sky-400/60 shadow-xl shadow-sky-500/20 flex items-center justify-between flex-wrap gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-sky-200">
                  Authenticated DH Active: MITM Impersonation Blocked!
                </h4>
                <p className="text-xs text-sky-300/80 font-sans mt-0.5">
                  Public keys are bound to cryptographic X.509 certificates. Eve cannot forge digital signatures on forged public keys, thwarting the attack completely.
                </p>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-sky-900/60 border border-sky-500/40 text-xs font-mono text-sky-200 font-bold">
              Signature Enforced
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
