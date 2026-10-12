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
    <div className="bg-[#0c0c12] rounded-2xl p-6 border-2 border-neutral-800 shadow-xl space-y-4 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <Eye className="w-5 h-5 text-orange-400" />
          <h3 className="font-extrabold text-base text-white">What Does an Eavesdropper Know?</h3>
        </div>
        <span className="text-xs text-orange-400 font-bold px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 font-mono">
          {mitm ? "Active Interception Audit" : "Passive Eavesdropping Audit"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
        {/* PUBLIC DATA (KNOWN TO EVERYONE) */}
        <div className="p-4 rounded-xl bg-neutral-900/90 border border-orange-500/30 space-y-3">
          <div className="flex items-center justify-between font-bold text-orange-300 pb-2 border-b border-neutral-800">
            <span className="flex items-center gap-2 text-sm">
              <Unlock className="w-4 h-4 text-orange-400" /> Public Values (Open Channel)
            </span>
            <span className="text-[11px] text-orange-400 uppercase font-semibold">Interceptable</span>
          </div>

          <div className="space-y-2 font-mono">
            <div className="flex justify-between py-1 border-b border-neutral-800/80">
              <span className="text-neutral-400 font-sans">Modulus (p):</span>
              <span className="text-orange-300 font-bold text-sm select-all">{p || "23"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-800/80">
              <span className="text-neutral-400 font-sans">Generator (g):</span>
              <span className="text-orange-300 font-bold text-sm select-all">{g || "5"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-800/80">
              <span className="text-neutral-400 font-sans">Alice Public (A):</span>
              <span className="text-orange-300 font-bold text-sm select-all truncate max-w-[160px]">
                {alicePublic || "Pending..."}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-800/80">
              <span className="text-neutral-400 font-sans">Bob Public (B):</span>
              <span className="text-orange-300 font-bold text-sm select-all truncate max-w-[160px]">
                {bobPublic || "Pending..."}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-400 font-sans">Ciphertext:</span>
              <span className="text-orange-300 font-bold text-xs select-all truncate max-w-[160px]">
                {ciphertextHex ? `0x${ciphertextHex.slice(0, 16)}...` : "None"}
              </span>
            </div>
          </div>
        </div>

        {/* PRIVATE SECRETS (CRYPTOGRAPHICALLY INFEASIBLE TO RECOVER) */}
        <div className="p-4 rounded-xl bg-neutral-900/90 border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between font-bold text-emerald-300 pb-2 border-b border-neutral-800">
            <span className="flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4 text-emerald-400" /> Private Secrets (Vaulted)
            </span>
            <span className="text-[11px] text-emerald-400 uppercase font-semibold">Mathematically Hidden</span>
          </div>

          <div className="space-y-2 font-mono">
            <div className="flex justify-between py-1 border-b border-neutral-800/80">
              <span className="text-neutral-400 font-sans">Alice Secret Exponent (a):</span>
              <span className="text-emerald-400 font-bold text-sm select-all">
                {alicePrivate ? `a = ${alicePrivate}` : "[UNKNOWN]"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-800/80">
              <span className="text-neutral-400 font-sans">Bob Secret Exponent (b):</span>
              <span className="text-emerald-400 font-bold text-sm select-all">
                {bobPrivate ? `b = ${bobPrivate}` : "[UNKNOWN]"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-800/80">
              <span className="text-neutral-400 font-sans">Shared Secret (K):</span>
              <span className="text-emerald-400 font-bold text-sm select-all">
                {sharedSecret ? `K = ${sharedSecret}` : "[UNCOMPUTABLE]"}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-400 font-sans">To crack K, Eve must solve:</span>
              <span className="text-orange-300 font-bold text-xs">log_g(A) mod p (DLP)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 leading-relaxed font-sans">
        <strong className="text-orange-400">The Discrete Logarithm Trapdoor:</strong> Even though the entire public wire sees <span className="text-orange-300 font-mono">p, g, A, B</span>, solving for <span className="text-emerald-400 font-mono">a</span> or <span className="text-emerald-400 font-mono">b</span> requires computing discrete logarithms modulo $p$. For standard 256-bit or 2048-bit primes, no known classical algorithm can compute this in polynomial time!
      </div>
    </div>
  );
};
