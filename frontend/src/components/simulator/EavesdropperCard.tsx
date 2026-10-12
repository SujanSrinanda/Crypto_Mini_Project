import React from "react";
import { Eye, Lock, Unlock } from "lucide-react";

interface EavesdropperCardProps {
  p: string;
  g: string;
  alicePublic: string;
  bobPublic: string;
  ciphertextHex: string;
  alicePrivate: string;
  bobPrivate: string;
  sharedSecret: string;
  mitm: boolean;
}

export const EavesdropperCard: React.FC<EavesdropperCardProps> = ({
  p,
  g,
  alicePublic,
  bobPublic,
  ciphertextHex,
  alicePrivate,
  bobPrivate,
  sharedSecret,
  mitm,
}) => {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-sm text-white">What Does an Eavesdropper Know?</h3>
        </div>
        <span className="text-[11px] text-amber-400 font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
          {mitm ? "Active Attacker Intercepting" : "Passive Cryptanalysis Audit"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* PUBLIC DATA (KNOWN TO EVERYONE) */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/30 space-y-2.5">
          <div className="flex items-center justify-between font-bold text-amber-300 pb-1.5 border-b border-slate-800">
            <span className="flex items-center gap-1.5">
              <Unlock className="w-4 h-4 text-amber-400" /> Public Values (Open Channel)
            </span>
            <span className="text-[10px] text-amber-400 font-normal">Interceptable</span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400 font-sans">Modulus (p):</span>
              <span className="text-amber-200 select-all font-bold">{p || "23"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400 font-sans">Generator (g):</span>
              <span className="text-amber-200 select-all font-bold">{g || "5"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400 font-sans">Alice Public (A):</span>
              <span className="text-amber-200 select-all truncate max-w-[140px]">
                {alicePublic || "Pending..."}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400 font-sans">Bob Public (B):</span>
              <span className="text-amber-200 select-all truncate max-w-[140px]">
                {bobPublic || "Pending..."}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400 font-sans">Ciphertext:</span>
              <span className="text-amber-200 select-all truncate max-w-[140px]">
                {ciphertextHex ? `0x${ciphertextHex.slice(0, 14)}...` : "None"}
              </span>
            </div>
          </div>
        </div>

        {/* PRIVATE SECRETS (CRYPTOGRAPHICALLY HIDDEN) */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30 space-y-2.5">
          <div className="flex items-center justify-between font-bold text-emerald-300 pb-1.5 border-b border-slate-800">
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-400" /> Private Secrets (Vaulted)
            </span>
            <span className="text-[10px] text-emerald-400 font-normal">Infeasible to solve</span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400 font-sans">Alice Secret Exponent (a):</span>
              <span className="text-emerald-400 blur-xs hover:blur-none transition-all cursor-pointer font-bold select-all">
                {alicePrivate ? `[HIDDEN: a=${alicePrivate}]` : "[ENCRYPTED]"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400 font-sans">Bob Secret Exponent (b):</span>
              <span className="text-emerald-400 blur-xs hover:blur-none transition-all cursor-pointer font-bold select-all">
                {bobPrivate ? `[HIDDEN: b=${bobPrivate}]` : "[ENCRYPTED]"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400 font-sans">Shared Secret (K):</span>
              <span className="text-emerald-400 blur-xs hover:blur-none transition-all cursor-pointer font-bold select-all">
                {sharedSecret ? `[HIDDEN: K=${sharedSecret}]` : "[UNCOMPUTABLE]"}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400 font-sans">To crack K, Eve must solve:</span>
              <span className="text-sky-300 font-mono">log_g(A) mod p</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
        <strong>The Discrete Logarithm Problem (DLP):</strong> Even though Eve knows <span className="text-amber-300 font-mono">g</span> and <span className="text-amber-300 font-mono">A = g^a mod p</span>, calculating <span className="text-emerald-300 font-mono">a</span> requires computing modular discrete logarithms. For 256-bit or 2048-bit primes, there is no known classical polynomial-time algorithm to solve this!
      </div>
    </div>
  );
};
