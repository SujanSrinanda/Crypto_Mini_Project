import React, { useState, useEffect, useCallback } from "react";
import { ControlsPanel } from "./simulator/ControlsPanel";
import { VisualStage } from "./simulator/VisualStage";
import { MathLog } from "./simulator/MathLog";
import { EavesdropperCard } from "./simulator/EavesdropperCard";
import { useSimulation } from "../hooks/useSimulation";
import {
  generatePrivateKeyLocal,
  parseBigInt,
} from "../lib/crypto";
import type { SimulationResult } from "../lib/crypto";
import { runSimulation, fetchParams } from "../lib/api";
import { useApp } from "../state/AppContext";

export const SimulatorSection: React.FC = () => {
  const { engine, addToast } = useApp();

  // State
  const [bitSize, setBitSize] = useState<string>("toy");
  const [p, setP] = useState<string>("23");
  const [g, setG] = useState<string>("5");
  const [alicePrivate, setAlicePrivate] = useState<string>("6");
  const [bobPrivate, setBobPrivate] = useState<string>("15");
  const [eveAlicePrivate, setEveAlicePrivate] = useState<string>("8");
  const [eveBobPrivate, setEveBobPrivate] = useState<string>("11");
  const [message, setMessage] = useState<string>("Secret rendezvous at noon.");
  const [tamperedMessage, setTamperedMessage] = useState<string>(
    "Wire $1,000,000 to Eve immediately."
  );
  const [mitm, setMitm] = useState<boolean>(false);
  const [authenticatedDh, setAuthenticatedDh] = useState<boolean>(false);

  // Simulation output
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);

  // Simulation playback hook
  const {
    steps,
    currentStepIndex,
    currentStep,
    isPlaying,
    playbackSpeed,
    isAtStart,
    isAtEnd,
    togglePlay,
    next,
    prev,
    jumpToStep,
    reset,
    setSpeed,
  } = useSimulation(simulation?.steps || [], 2200);

  // Load parameter set
  const loadParamSet = useCallback(
    async (bits: string) => {
      setBitSize(bits);
      try {
        const { data } = await fetchParams(bits, engine);
        setP(data.p);
        setG(data.g);

        // Generate clean random private keys for the new modulus
        const pBig = parseBigInt(data.p);
        const aBig = generatePrivateKeyLocal(pBig);
        const bBig = generatePrivateKeyLocal(pBig);
        setAlicePrivate(aBig.toString());
        setBobPrivate(bBig.toString());
        setEveAlicePrivate(generatePrivateKeyLocal(pBig).toString());
        setEveBobPrivate(generatePrivateKeyLocal(pBig).toString());
      } catch (err: any) {
        addToast(err.message || "Failed to load parameters", "error");
      }
    },
    [engine, addToast]
  );

  // Randomize private keys
  const randomizeKeys = useCallback(() => {
    try {
      const pBig = parseBigInt(p);
      const aBig = generatePrivateKeyLocal(pBig);
      const bBig = generatePrivateKeyLocal(pBig);
      const eaBig = generatePrivateKeyLocal(pBig);
      const ebBig = generatePrivateKeyLocal(pBig);
      setAlicePrivate(aBig.toString());
      setBobPrivate(bBig.toString());
      setEveAlicePrivate(eaBig.toString());
      setEveBobPrivate(ebBig.toString());
      addToast("Generated new cryptographic private keys", "info");
    } catch {
      // ignore
    }
  }, [p, addToast]);

  // Execute simulation when inputs change
  const executeSimulation = useCallback(async () => {
    if (!p || !g) return;
    try {
      const { result } = await runSimulation(
        {
          p,
          g,
          mitm,
          authenticatedDh,
          message,
          tamperedMessage,
          alicePrivate,
          bobPrivate,
          eveAlicePrivate,
          eveBobPrivate,
        },
        engine
      );
      setSimulation(result);
    } catch (err: any) {
      addToast(err.message || "Simulation error", "error");
    }
  }, [
    p,
    g,
    mitm,
    authenticatedDh,
    message,
    tamperedMessage,
    alicePrivate,
    bobPrivate,
    eveAlicePrivate,
    eveBobPrivate,
    engine,
    addToast,
  ]);

  // Run initial simulation and re-run on dependencies
  useEffect(() => {
    executeSimulation();
  }, [executeSimulation]);

  // Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        setMitm((prevMitm) => !prevMitm);
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        reset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, next, prev, reset]);

  return (
    <section id="simulator" className="py-12 md:py-16 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
            Interactive Centerpiece
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
            Diffie-Hellman & MITM Simulator
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 mt-2">
            Watch mathematical values travel across the public channel. Toggle Man-in-the-Middle mode to inspect how Eve intercepts and rewrites the session.
          </p>
        </div>

        {/* Controls Panel */}
        <ControlsPanel
          bitSize={bitSize}
          onSelectBitSize={loadParamSet}
          p={p}
          g={g}
          onPChange={setP}
          onGChange={setG}
          alicePrivate={alicePrivate}
          bobPrivate={bobPrivate}
          onAlicePrivateChange={setAlicePrivate}
          onBobPrivateChange={setBobPrivate}
          onRandomizePrivateKeys={randomizeKeys}
          message={message}
          onMessageChange={setMessage}
          mitm={mitm}
          onToggleMitm={() => setMitm(!mitm)}
          tamperedMessage={tamperedMessage}
          onTamperedMessageChange={setTamperedMessage}
          authenticatedDh={authenticatedDh}
          onToggleAuthenticatedDh={() => setAuthenticatedDh(!authenticatedDh)}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          onNext={next}
          onPrev={prev}
          onReset={reset}
          playbackSpeed={playbackSpeed}
          onSpeedChange={setSpeed}
          currentStepIndex={currentStepIndex}
          totalSteps={steps.length}
          isAtStart={isAtStart}
          isAtEnd={isAtEnd}
        />

        {/* Main Simulator & Math Log Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Visual Stage + Eavesdropper Card (8 cols on XL) */}
          <div className="xl:col-span-8 space-y-6">
            <VisualStage
              simulation={simulation}
              currentStep={currentStep}
              currentStepIndex={currentStepIndex}
              mitm={mitm}
              authenticatedDh={authenticatedDh}
            />

            <EavesdropperCard
              p={p}
              g={g}
              alicePublic={simulation?.summary?.alice_public || ""}
              bobPublic={simulation?.summary?.bob_public || ""}
              ciphertextHex={simulation?.summary?.ciphertext_hex || ""}
              alicePrivate={simulation?.summary?.alice_private || ""}
              bobPrivate={simulation?.summary?.bob_private || ""}
              sharedSecret={simulation?.summary?.alice_shared || ""}
              mitm={mitm}
            />
          </div>

          {/* Math Log Side Panel (4 cols on XL) */}
          <div className="xl:col-span-4">
            <MathLog
              steps={steps}
              currentStepIndex={currentStepIndex}
              onJumpToStep={jumpToStep}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
