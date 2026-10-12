import React, { useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Flame,
  ShieldCheck,
  SlidersHorizontal,
  Dices,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Tooltip } from "../Tooltip";

interface MiniControlsProps {
  bitSize: string;
  onSelectBitSize: (bits: string) => void;
  p: string;
  g: string;
  onPChange: (val: string) => void;
  onGChange: (val: string) => void;
  alicePrivate: string;
  bobPrivate: string;
  onAlicePrivateChange: (val: string) => void;
  onBobPrivateChange: (val: string) => void;
  onRandomizePrivateKeys: () => void;
  message: string;
  onMessageChange: (val: string) => void;
  mitm: boolean;
  onToggleMitm: () => void;
  tamperedMessage: string;
  onTamperedMessageChange: (val: string) => void;
  authenticatedDh: boolean;
  onToggleAuthenticatedDh: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  currentStepIndex: number;
  totalSteps: number;
  isAtStart: boolean;
  isAtEnd: boolean;
}

export const MiniControls: React.FC<MiniControlsProps> = ({
  bitSize,
  onSelectBitSize,
  p,
  g,
  onPChange,
  onGChange,
  alicePrivate,
  bobPrivate,
  onAlicePrivateChange,
  onBobPrivateChange,
  onRandomizePrivateKeys,
  message,
  onMessageChange,
  mitm,
  onToggleMitm,
  tamperedMessage,
  onTamperedMessageChange,
  authenticatedDh,
  onToggleAuthenticatedDh,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  onReset,
  playbackSpeed,
  onSpeedChange,
  currentStepIndex,
  totalSteps,
  isAtStart,
  isAtEnd,
}) => {
  const [paramsExpanded, setParamsExpanded] = useState<boolean>(false);

  return (
    <div className="space-y-3">
      {/* Primary Centered Control Deck (matching Paint-Mixing Analogy style) */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-left">
        {/* Previous Step Button */}
        <Tooltip content="Previous step (Left Arrow)">
          <button
            type="button"
            disabled={isAtStart}
            onClick={onPrev}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
          >
            Previous
          </button>
        </Tooltip>

        {/* Step Counter Badge */}
        <span className="text-xs font-mono font-bold text-neutral-400 px-2.5 py-1.5 bg-neutral-950 rounded-xl border border-neutral-800">
          {currentStepIndex + 1} / {totalSteps}
        </span>

        {/* PROMINENT NEXT STEP BUTTON (exact user request!) */}
        <Tooltip content={isAtEnd ? "Restart simulation (R)" : "Advance to next step (Right Arrow)"}>
          <button
            type="button"
            onClick={isAtEnd ? onReset : onNext}
            className="px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{isAtEnd ? "Restart Demo" : "Next Protocol Step"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </Tooltip>

        {/* Play Demo / Pause Button */}
        <Tooltip content={isPlaying ? "Pause simulation (Space)" : "Auto-play demo (Space)"}>
          <button
            type="button"
            onClick={onTogglePlay}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border flex items-center gap-2 transition-all ${
              isPlaying
                ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm"
                : "bg-neutral-900 border-neutral-700 text-neutral-200 hover:text-white"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 text-amber-400" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-orange-400 fill-orange-400/20" />
                <span>Play Demo</span>
              </>
            )}
          </button>
        </Tooltip>

        {/* Reset Button */}
        <Tooltip content="Reset simulation (R)">
          <button
            type="button"
            onClick={onReset}
            className="p-2.5 text-neutral-400 hover:text-white rounded-xl bg-neutral-900 border border-neutral-700 transition-colors"
            aria-label="Reset simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </Tooltip>

        {/* Playback Speed Pill */}
        <div className="inline-flex rounded-xl bg-neutral-950 p-1 border border-neutral-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => onSpeedChange(1)}
            className={`px-2 py-1 rounded-lg font-bold transition-all ${
              playbackSpeed === 1
                ? "bg-neutral-800 text-white"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            1x
          </button>
          <button
            type="button"
            onClick={() => onSpeedChange(2)}
            className={`px-2 py-1 rounded-lg font-bold transition-all ${
              playbackSpeed === 2
                ? "bg-neutral-800 text-white"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            2x
          </button>
        </div>

        <div className="h-6 w-px bg-neutral-800 hidden sm:block mx-1" />

        {/* MITM Attack Mode Toggle */}
        <Tooltip content="Toggle Man-in-the-Middle Attack (M)">
          <button
            type="button"
            onClick={onToggleMitm}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-all ${
              mitm
                ? "bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/30"
                : "bg-neutral-900 text-neutral-400 border-neutral-700 hover:text-white"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>MITM: {mitm ? "ACTIVE" : "OFF"}</span>
          </button>
        </Tooltip>

        {/* PKI Defense Mode Toggle */}
        <Tooltip content="Toggle Public Key Infrastructure (Digital Signatures)">
          <button
            type="button"
            onClick={onToggleAuthenticatedDh}
            className={`px-3 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-all ${
              authenticatedDh
                ? "bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30"
                : "bg-neutral-900 text-neutral-400 border-neutral-700 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PKI: {authenticatedDh ? "ON" : "OFF"}</span>
          </button>
        </Tooltip>

        {/* Toy Prime vs 256-Bit RFC Switch */}
        <div className="inline-flex rounded-xl bg-neutral-950 p-1 border border-neutral-800 text-xs">
          <button
            type="button"
            onClick={() => onSelectBitSize("toy")}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              bitSize === "toy"
                ? "bg-orange-500 text-white shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Toy (p=23)
          </button>
          <button
            type="button"
            onClick={() => onSelectBitSize("256")}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              bitSize === "256"
                ? "bg-orange-500 text-white shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            256-Bit
          </button>
        </div>

        {/* Configure Values Drawer Toggle */}
        <button
          type="button"
          onClick={() => setParamsExpanded(!paramsExpanded)}
          className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-all ${
            paramsExpanded
              ? "bg-neutral-800 border-neutral-600 text-white"
              : "bg-neutral-900 border-neutral-700 text-neutral-300 hover:text-white"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
          <span>Config</span>
          {paramsExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Expandable Custom Parameters Drawer */}
      {paramsExpanded && (
        <div className="p-4 rounded-2xl bg-[#08080c] border border-neutral-800 shadow-inner grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-left animate-in fade-in duration-200">
          <div>
            <label className="text-[11px] text-neutral-400 font-medium block mb-1">
              Public Prime (p) &amp; Base (g)
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={p}
                onChange={(e) => onPChange(e.target.value)}
                placeholder="p"
                className="w-1/2 px-2.5 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 font-mono text-xs focus:border-orange-500 focus:outline-none"
              />
              <input
                type="text"
                value={g}
                onChange={(e) => onGChange(e.target.value)}
                placeholder="g"
                className="w-1/2 px-2.5 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 font-mono text-xs focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] text-neutral-400 font-medium">
                Private Exponents (a, b)
              </label>
              <button
                type="button"
                onClick={onRandomizePrivateKeys}
                className="text-[10px] text-orange-400 hover:text-orange-300 flex items-center gap-1 font-semibold"
              >
                <Dices className="w-3 h-3" /> Roll
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={alicePrivate}
                onChange={(e) => onAlicePrivateChange(e.target.value)}
                placeholder="Alice a"
                className="w-1/2 px-2.5 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-blue-300 font-mono text-xs focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                value={bobPrivate}
                onChange={(e) => onBobPrivateChange(e.target.value)}
                placeholder="Bob b"
                className="w-1/2 px-2.5 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-emerald-300 font-mono text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-neutral-400 font-medium block mb-1">
              Alice's Secret Message
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 text-xs focus:border-orange-500 focus:outline-none"
            />
          </div>

          {mitm && (
            <div>
              <label className="text-[11px] text-rose-400 font-medium block mb-1">
                Eve's Tampered Message
              </label>
              <input
                type="text"
                value={tamperedMessage}
                onChange={(e) => onTamperedMessageChange(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-neutral-950 border border-rose-900/80 rounded-lg text-rose-200 text-xs focus:border-rose-500 focus:outline-none"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
