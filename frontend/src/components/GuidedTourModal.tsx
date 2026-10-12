import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Check, Sparkles } from "lucide-react";
import { useApp } from "../state/AppContext";

export const GuidedTourModal: React.FC = () => {
  const { isTourOpen, closeTour } = useApp();
  const [tourIndex, setTourIndex] = useState(0);

  const tourSteps = [
    {
      title: "Welcome to KeyExchange Lab!",
      description:
        "This interactive simulator demonstrates how two strangers (Alice & Bob) can create an identical secret key over an open, unencrypted channel without an eavesdropper discovering it.",
      target: "Hero & Overview",
    },
    {
      title: "1. Control Deck & Key Sizes",
      description:
        "Select your parameter size: choose 'Toy (p=23)' for classroom mental math, or 64/128/256-bit for real-world cryptographic scaling. You can edit primes p and g directly or roll dice to randomize private keys.",
      target: "Simulation Controls",
    },
    {
      title: "2. The Visual Stage (Alice, Channel, Bob)",
      description:
        "Alice and Bob each hold a private secret vault (click the eye icon to reveal). They compute public values A = g^a mod p and B = g^b mod p, sending them over the wire with glowing packets.",
      target: "Visual Stage Columns",
    },
    {
      title: "3. Man-in-the-Middle (MITM) Mode",
      description:
        "Flip the MITM switch! Eve slides into the public channel, intercepts packets mid-flight, generates two rogue key pairs, and tricks Alice and Bob into establishing separate keys with her.",
      target: "Active MITM Attack",
    },
    {
      title: "4. Message Tampering & Interception",
      description:
        "Alice encrypts a message. In honest mode, Bob receives it intact. In MITM mode, Eve decrypts Alice's message, alters it in real time, and re-encrypts it for Bob, who receives the fraudulent text unknowingly!",
      target: "Message Stream",
    },
    {
      title: "5. Authenticated DH Defense",
      description:
        "Toggle 'Authenticated DH' to attach digital certificates and signatures to public keys. Watch how Eve's forged keys fail verification and get rejected immediately!",
      target: "Defense Countermeasure",
    },
    {
      title: "6. Live Math Log & Viva Prep",
      description:
        "Click any row in the live Math Log to jump the animation to that exact moment. Scroll down to review the paint analogy, discrete log cracking demo, and 8 comprehensive viva questions.",
      target: "Math Log & Viva Voce",
    },
  ];

  if (!isTourOpen) return null;

  const current = tourSteps[tourIndex];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="relative max-w-md w-full glass-panel rounded-3xl p-6 sm:p-7 border border-slate-700/80 shadow-2xl space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Step {tourIndex + 1} of {tourSteps.length}
            </span>
            <button
              type="button"
              onClick={closeTour}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">{current.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{current.description}</p>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5 pt-2">
            {tourSteps.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setTourIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === tourIndex ? "w-6 bg-sky-400" : "w-1.5 bg-slate-700 hover:bg-slate-500"
                }`}
                aria-label={`Jump to step ${i + 1}`}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              type="button"
              disabled={tourIndex === 0}
              onClick={() => setTourIndex((prev) => prev - 1)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white disabled:opacity-30 flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back
            </button>

            {tourIndex < tourSteps.length - 1 ? (
              <button
                type="button"
                onClick={() => setTourIndex((prev) => prev + 1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-white shadow-md shadow-sky-500/20 flex items-center gap-1.5"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={closeTour}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-white shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Get Started!</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
