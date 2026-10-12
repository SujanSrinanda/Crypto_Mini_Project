import React, { useState } from "react";
import {
  Palette,
  Timer,
  ShieldCheck,
  Zap,
  TrendingUp,
  Lock,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  FileCheck2,
} from "lucide-react";
import { solveDiscreteLogClient } from "../lib/crypto";
import { ScrollReveal } from "./common/ScrollReveal";

export const LearnExploreSection: React.FC = () => {
  // 1. Paint Analogy State
  const [paintStep, setPaintStep] = useState<number>(0);

  // 2. Brute Force Demo State
  const [bruteModulus, setBruteModulus] = useState<number>(23);
  const [bruteGenerator, setBruteGenerator] = useState<number>(5);
  const [targetPublic, setTargetPublic] = useState<number>(8);
  const [bruteResult, setBruteResult] = useState<{
    running: boolean;
    found: boolean;
    privateKey: bigint | null;
    steps: number;
    timeMs: number;
  } | null>(null);

  const runBruteForce = () => {
    setBruteResult({ running: true, found: false, privateKey: null, steps: 0, timeMs: 0 });
    setTimeout(() => {
      const res = solveDiscreteLogClient(
        BigInt(bruteModulus),
        BigInt(bruteGenerator),
        BigInt(targetPublic),
        100000
      );
      setBruteResult({
        running: false,
        found: res.found,
        privateKey: res.privateKey,
        steps: res.steps,
        timeMs: res.timeMs,
      });
    }, 150);
  };

  const paintStepsData = [
    {
      title: "Step 1: Common Paint Agreed Upon",
      desc: "Alice and Bob agree on a common base color (Yellow). This color is public knowledge; Eve sees it clearly.",
      aliceColor: "#eab308", // Yellow
      bobColor: "#eab308",
      eveView: "Yellow (Common)",
    },
    {
      title: "Step 2: Secret Colors Added",
      desc: "Alice adds her secret color (Cyan/Blue) into her pot. Bob adds his secret color (Red/Orange) into his pot.",
      aliceColor: "#0284c7", // Alice mixed
      bobColor: "#ea580c", // Bob mixed
      eveView: "Eve sees nothing yet (secrets are hidden)",
    },
    {
      title: "Step 3: Public Mixture Exchange",
      desc: "Alice sends her mixture to Bob; Bob sends his mixture to Alice. Eve intercepts both mixtures on the wire, but paint mixing is a one-way function—she cannot unmix them to isolate the secret colors!",
      aliceColor: "#0284c7",
      bobColor: "#ea580c",
      eveView: "Eve sees Alice's Mix and Bob's Mix (Cannot separate!)",
    },
    {
      title: "Step 4: Final Shared Secret Mixture",
      desc: "Alice adds her original secret color (Cyan) to Bob's received mixture. Bob adds his secret color (Red) to Alice's received mixture. Both pots end up with the EXACT same brown-teal secret shade!",
      aliceColor: "#4338ca", // Identical combined color
      bobColor: "#4338ca",
      eveView: "Eve CANNOT produce this final color without the secret dyes!",
    },
  ];

  return (
    <div className="space-y-20 py-12 md:py-16">
      {/* ===================== PART 1: PAINT-MIXING ANALOGY ===================== */}
      <section id="analogy" className="scroll-mt-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <ScrollReveal direction="up" delay={0.05} distance={20}>
            <div className="text-center max-w-3xl mx-auto mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                Intuitive Mental Model
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
                The Paint-Mixing Analogy
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 mt-2">
                How do you combine secrets in plain sight? Think of modular exponentiation like mixing paint: combining pigments is effortless, but separating them back into their original ingredients is virtually impossible.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.15} distance={28}>
            <div className="bg-[#0c0c12] rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-2xl space-y-8">
              {/* Visual Pots */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
                {/* Alice Pot */}
                <div className="p-5 rounded-2xl bg-blue-950/20 border border-blue-900/50 space-y-3">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Alice's Paint Bucket
                  </span>
                  <div
                    className="w-24 h-24 mx-auto rounded-full shadow-2xl transition-all duration-500 flex items-center justify-center border-4 border-neutral-900"
                    style={{
                      backgroundColor: paintStepsData[paintStep].aliceColor,
                      boxShadow: `0 0 25px ${paintStepsData[paintStep].aliceColor}66`,
                    }}
                  >
                    <Palette className="w-8 h-8 text-white/80" />
                  </div>
                  <p className="text-xs text-neutral-300 font-medium">
                    {paintStep === 0 && "Common Yellow Base"}
                    {paintStep === 1 && "Yellow + Secret Cyan"}
                    {paintStep === 2 && "Transmitting Mix to Bob"}
                    {paintStep === 3 && "Final Secret Mix (Shared)"}
                  </p>
                </div>

                {/* Public Channel / Eve */}
                <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/50 space-y-3">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                    Eve's Observation
                  </span>
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-[#08080c] border border-neutral-800 flex items-center justify-center shadow-inner">
                    <Lock className="w-7 h-7 text-rose-400" />
                  </div>
                  <p className="text-xs text-rose-300 font-medium">
                    {paintStepsData[paintStep].eveView}
                  </p>
                </div>

                {/* Bob Pot */}
                <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/50 space-y-3">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Bob's Paint Bucket
                  </span>
                  <div
                    className="w-24 h-24 mx-auto rounded-full shadow-2xl transition-all duration-500 flex items-center justify-center border-4 border-neutral-900"
                    style={{
                      backgroundColor: paintStepsData[paintStep].bobColor,
                      boxShadow: `0 0 25px ${paintStepsData[paintStep].bobColor}66`,
                    }}
                  >
                    <Palette className="w-8 h-8 text-white/80" />
                  </div>
                  <p className="text-xs text-neutral-300 font-medium">
                    {paintStep === 0 && "Common Yellow Base"}
                    {paintStep === 1 && "Yellow + Secret Red"}
                    {paintStep === 2 && "Transmitting Mix to Alice"}
                    {paintStep === 3 && "Final Secret Mix (Shared)"}
                  </p>
                </div>
              </div>

              {/* Explanation box */}
              <div className="p-4 rounded-2xl bg-[#08080c] border border-neutral-800 text-center">
                <h4 className="text-sm font-bold text-orange-400">
                  {paintStepsData[paintStep].title}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl mx-auto">
                  {paintStepsData[paintStep].desc}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setPaintStep((prev) => (prev > 0 ? prev - 1 : 0))}
                  disabled={paintStep === 0}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white disabled:opacity-40 transition-colors"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPaintStep((prev) => (prev < paintStepsData.length - 1 ? prev + 1 : 0))
                  }
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>{paintStep === paintStepsData.length - 1 ? "Restart Analogy" : "Next Mixture Step"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setPaintStep(0)}
                  className="p-2.5 text-neutral-400 hover:text-white rounded-xl bg-neutral-900 border border-neutral-700 transition-colors"
                  aria-label="Reset paint analogy"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===================== PART 2: WHY IS IT HARD? DISCRETE LOG ===================== */}
      <section id="complexity" className="scroll-mt-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <ScrollReveal direction="up" delay={0.05} distance={20}>
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                Mathematical Foundation
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
                Why is Diffie-Hellman Hard to Crack?
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 mt-2">
                The security of Diffie-Hellman relies entirely on the <strong>Discrete Logarithm Problem (DLP)</strong>. Calculating powers modulo a prime is simple; reversing it without the exponent is computationally infeasible.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Interactive Brute-Force Cracker (5 cols) */}
            <div className="lg:col-span-5">
              <ScrollReveal direction="up" delay={0.12} distance={25}>
                <div className="bg-[#0c0c12] rounded-3xl p-6 border border-neutral-800 shadow-xl space-y-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
                    <Timer className="w-5 h-5 text-orange-400" />
                    <h3 className="font-bold text-base text-white">
                      Live Discrete-Log Cracker (Toy Prime)
                    </h3>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Given public values <span className="font-mono text-orange-400">p = {bruteModulus}</span>, <span className="font-mono text-orange-400">g = {bruteGenerator}</span>, and public key <span className="font-mono text-blue-300">A = {targetPublic}</span>, brute-force search for private exponent <span className="font-mono text-emerald-300">a</span> such that <span className="font-mono">5^a mod 23 = {targetPublic}</span>.
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="text-neutral-400 block mb-1 font-medium">Modulus p</label>
                      <input
                        type="number"
                        value={bruteModulus}
                        onChange={(e) => setBruteModulus(Number(e.target.value) || 23)}
                        className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 font-mono text-xs focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-neutral-400 block mb-1 font-medium">Generator g</label>
                      <input
                        type="number"
                        value={bruteGenerator}
                        onChange={(e) => setBruteGenerator(Number(e.target.value) || 5)}
                        className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 font-mono text-xs focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-neutral-400 block mb-1 font-medium">Public Key A</label>
                      <input
                        type="number"
                        value={targetPublic}
                        onChange={(e) => setTargetPublic(Number(e.target.value) || 8)}
                        className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 font-mono text-xs focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={runBruteForce}
                    className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Run Brute-Force Attack</span>
                  </button>

                  {/* Cracker Results */}
                  {bruteResult && (
                    <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-2 font-mono">
                      <div className="flex justify-between">
                        <span className="text-neutral-400 font-sans">Status:</span>
                        <span className="text-emerald-400 font-bold">
                          {bruteResult.found ? "Cracked Successfully!" : "Search exhausted"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400 font-sans">Recovered Private Key:</span>
                        <span className="text-blue-300 font-bold">
                          a = {bruteResult.privateKey?.toString() || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400 font-sans">Trial Iterations:</span>
                        <span className="text-orange-400">{bruteResult.steps} steps</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400 font-sans">Execution Time:</span>
                        <span className="text-emerald-300">
                          {bruteResult.timeMs.toFixed(3)} milliseconds
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </div>

            {/* Exponential Complexity Table (7 cols) */}
            <div className="lg:col-span-7">
              <ScrollReveal direction="up" delay={0.2} distance={25}>
                <div className="bg-[#0c0c12] rounded-3xl p-6 border border-neutral-800 shadow-xl space-y-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-base text-white">
                      Exponential Cracking Time by Bit Size
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-neutral-800 text-neutral-400 font-mono">
                          <th className="pb-2.5">Key Length</th>
                          <th className="pb-2.5">Modulus Size</th>
                          <th className="pb-2.5">Brute Force Ops</th>
                          <th className="pb-2.5">Estimated Time to Break</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/80 font-mono">
                        <tr>
                          <td className="py-2.5 text-blue-400 font-bold">Toy (5-bit)</td>
                          <td className="py-2.5 text-neutral-200">p = 23</td>
                          <td className="py-2.5 text-neutral-400">~ 23 ops</td>
                          <td className="py-2.5 text-emerald-400 font-sans">&lt; 0.001 ms (Instant)</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 text-blue-400 font-bold">64-bit</td>
                          <td className="py-2.5 text-neutral-200">~ 1.84 &times; 10^19</td>
                          <td className="py-2.5 text-neutral-400">~ 2^32 (Pollard's rho)</td>
                          <td className="py-2.5 text-orange-400 font-sans">~ 5 to 30 minutes on GPU</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 text-blue-400 font-bold">128-bit</td>
                          <td className="py-2.5 text-neutral-200">~ 3.40 &times; 10^38</td>
                          <td className="py-2.5 text-neutral-400">~ 2^64 ops</td>
                          <td className="py-2.5 text-rose-400 font-sans">~ 1,500 computer-years</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 text-blue-400 font-bold">256-bit</td>
                          <td className="py-2.5 text-neutral-200">~ 1.15 &times; 10^77</td>
                          <td className="py-2.5 text-neutral-400">~ 2^128 ops</td>
                          <td className="py-2.5 text-purple-400 font-sans">
                            ~ 3 &times; 10^21 years (Older than Universe)
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 text-emerald-400 font-bold">2048-bit (TLS)</td>
                          <td className="py-2.5 text-neutral-200">&gt; 10^616</td>
                          <td className="py-2.5 text-neutral-400">GNFS Sub-exponential</td>
                          <td className="py-2.5 text-emerald-300 font-sans font-bold">
                            Astronomically Impossible
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#08080c] border border-neutral-800 text-xs text-neutral-300 leading-relaxed">
                    <strong className="text-white">Why safe primes matter:</strong> If <span className="font-mono text-orange-400">p - 1</span> has small prime factors, attackers can use the <em>Pohlig-Hellman algorithm</em> to solve the discrete log in each small subgroup rapidly. Safe primes (<span className="font-mono text-orange-400">p = 2q + 1</span> where <span className="font-mono text-orange-400">q</span> is prime) eliminate small subgroups, forcing attackers to search the full prime group.
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PART 3: DEFENSE (AUTHENTICATION & TLS) ===================== */}
      <section id="defense" className="scroll-mt-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <ScrollReveal direction="up" delay={0.05} distance={20}>
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Countermeasure & Real-World Protocol
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
                Defense: How Authentication Prevents MITM
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 mt-2">
                Diffie-Hellman by itself provides confidentiality, but <strong>zero authentication</strong>. Anyone in the middle can swap public keys. Here is how modern cryptographic standards solve this vulnerability.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: The Root Flaw */}
            <ScrollReveal direction="up" delay={0.1} distance={25}>
              <div className="bg-[#0c0c12] rounded-2xl p-6 border border-neutral-800 space-y-3 shadow-lg hover:border-neutral-700 transition-colors h-full">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 w-fit">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-white">The Root Flaw of DH</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  When Bob receives public value <span className="font-mono text-blue-300">A</span>, there is nothing cryptographically proving it was created by Alice. In unauthenticated DH, Eve can substitute <span className="font-mono text-rose-400">E_B</span> and Bob has no mathematical way to distinguish Eve from Alice.
                </p>
              </div>
            </ScrollReveal>

            {/* Card 2: Digital Signatures & X.509 */}
            <ScrollReveal direction="up" delay={0.2} distance={25}>
              <div className="bg-[#0c0c12] rounded-2xl p-6 border border-neutral-800 space-y-3 shadow-lg hover:border-neutral-700 transition-colors h-full">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-white">Digital Signatures & PKI</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Before sending public value <span className="font-mono text-blue-300">A</span>, Alice cryptographically signs it with her long-term private RSA/ECDSA key. Bob verifies Alice's signature using her trusted Certificate Authority (CA) certificate. Eve cannot forge this signature!
                </p>
              </div>
            </ScrollReveal>

            {/* Card 3: Modern TLS 1.3 */}
            <ScrollReveal direction="up" delay={0.3} distance={25}>
              <div className="bg-[#0c0c12] rounded-2xl p-6 border border-neutral-800 space-y-3 shadow-lg hover:border-neutral-700 transition-colors h-full">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-white">Modern TLS 1.3 (ECDHE)</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Every HTTPS website uses <strong>Ephemeral Elliptic-Curve Diffie-Hellman (ECDHE)</strong>. The keys are ephemeral (discarded after session for Perfect Forward Secrecy) while the server's identity is authenticated via digital certificates.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};
