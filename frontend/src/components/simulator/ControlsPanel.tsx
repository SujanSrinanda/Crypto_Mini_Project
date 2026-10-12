import React from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Dices,
  Flame,
  ShieldCheck,
} from "lucide-react";
import { Tooltip } from "../Tooltip";

interface ControlsPanelProps {
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

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  bitSize,
  onSelectBitSize,
  p,
  g,
  onPChange,
  onGChange,
  alicePrivate,
  bobPrivate,
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
  return (
    <div className="bg-[#0c0c12] border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
      {/* Top Deck: Key Size & Mode Switches */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Parameter Mode:
          </span>
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-full p-1 text-xs">
            <button
              type="button"
              onClick={() => onSelectBitSize("toy")}
              className={`px-4 py-1.5 rounded-full font-bold transition-all ${
                bitSize === "toy"
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Toy Mode (p = 23, g = 5) &bull; Classroom Mental Math
            </button>
            <button
              type="button"
              onClick={() => onSelectBitSize("256")}
              className={`px-4 py-1.5 rounded-full font-bold transition-all ${
                bitSize === "256"
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Standard 256-Bit Prime
            </button>
          </div>
        </div>

        {/* Attack and Defense Toggles */}
        <div className="flex flex-wrap items-center gap-3">
          {/* MITM Attack Button */}
          <button
            type="button"
            onClick={onToggleMitm}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              mitm
                ? "bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-600/30 ring-2 ring-rose-500/30"
                : "bg-neutral-900 border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-600"
            }`}
          >
            <Flame className={`w-4 h-4 ${mitm ? "text-white fill-white" : "text-rose-400"}`} />
            <span>MITM ATTACK: {mitm ? "ACTIVE (EVE INTERCEPTING)" : "OFF"}</span>
          </button>

          {/* Authenticated DH Button */}
          <button
            type="button"
            onClick={onToggleAuthenticatedDh}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              authenticatedDh
                ? "bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-500/30"
                : "bg-neutral-900 border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-600"
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${authenticatedDh ? "text-white" : "text-emerald-400"}`} />
            <span>PKI DEFENSE: {authenticatedDh ? "ENABLED" : "OFF"}</span>
          </button>
        </div>
      </div>

      {/* Inputs Strip: Large, legible text */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Modulus & Generator */}
        <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800">
          <span className="text-neutral-400 block mb-1 font-semibold uppercase tracking-wider text-[11px]">
            Public Parameters
          </span>
          <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-neutral-200 pt-0.5">
            <span className="text-neutral-400 font-bold">p =</span>
            <Tooltip content={`Modulus p: ${p}`}>
              <input
                type="text"
                value={p.length > 10 ? `${p.slice(0, 4)}...${p.slice(-3)}` : p}
                onChange={(e) => onPChange(e.target.value)}
                readOnly={p.length > 10}
                className="w-24 px-2 py-1 bg-neutral-950 border border-neutral-700 rounded-lg text-orange-400 font-bold text-center focus:outline-none focus:border-orange-500 text-xs sm:text-sm font-mono truncate cursor-default"
              />
            </Tooltip>
            <span className="text-neutral-400 font-bold">g =</span>
            <input
              type="text"
              value={g}
              onChange={(e) => onGChange(e.target.value)}
              className="w-10 px-1.5 py-1 bg-neutral-950 border border-neutral-700 rounded-lg text-orange-400 font-bold text-center focus:outline-none focus:border-orange-500 text-xs sm:text-sm font-mono"
            />
          </div>
        </div>

        {/* Private Exponents */}
        <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
              Private Exponents
            </span>
            <button
              type="button"
              onClick={onRandomizePrivateKeys}
              className="text-[11px] text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
            >
              <Dices className="w-3.5 h-3.5" /> Randomize
            </button>
          </div>
          <div className="flex items-center justify-between font-mono text-xs sm:text-sm pt-0.5">
            <Tooltip content={`Alice private exponent: ${alicePrivate}`}>
              <span className="text-blue-400 font-bold truncate max-w-[110px]">
                a = {alicePrivate.length > 8 ? `${alicePrivate.slice(0, 4)}...${alicePrivate.slice(-3)}` : alicePrivate}
              </span>
            </Tooltip>
            <span className="text-neutral-600 font-bold">&bull;</span>
            <Tooltip content={`Bob private exponent: ${bobPrivate}`}>
              <span className="text-emerald-400 font-bold truncate max-w-[110px]">
                b = {bobPrivate.length > 8 ? `${bobPrivate.slice(0, 4)}...${bobPrivate.slice(-3)}` : bobPrivate}
              </span>
            </Tooltip>
          </div>
        </div>

        {/* Alice's Message */}
        <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800">
          <span className="text-neutral-400 block mb-1 font-semibold uppercase tracking-wider text-[11px]">
            Alice's Outgoing Message
          </span>
          <input
            type="text"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            className="w-full px-2.5 py-1 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 text-xs focus:outline-none focus:border-orange-500"
            placeholder="Type message to encrypt..."
          />
        </div>

        {/* Tampered message / Channel status */}
        <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800">
          <span className={`block mb-1 font-semibold uppercase tracking-wider text-[11px] ${mitm ? "text-rose-400" : "text-neutral-400"}`}>
            {mitm ? "Eve's Tampered Text (Forwarded to Bob)" : "Channel State"}
          </span>
          {mitm ? (
            <input
              type="text"
              value={tamperedMessage}
              onChange={(e) => onTamperedMessageChange(e.target.value)}
              className="w-full px-2.5 py-1 bg-neutral-950 border border-rose-800 rounded-lg text-rose-200 text-xs focus:outline-none focus:border-rose-400"
              placeholder="Tampered payload forwarded..."
            />
          ) : (
            <span className="text-emerald-400 text-xs font-medium block pt-1">
              Direct Peer-to-Peer &bull; Untampered Channel
            </span>
          )}
        </div>
      </div>

      {/* Main Playback Bar (Large & Prominent for Presenting) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        {/* Step Counter Badge */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-700 font-mono text-xs font-bold text-white">
            STEP {totalSteps > 0 ? currentStepIndex + 1 : 0} OF {totalSteps}
          </div>
          <span className="text-xs text-neutral-400 font-medium hidden sm:inline">
            {totalSteps > 1 ? Math.round((currentStepIndex / (totalSteps - 1)) * 100) : 0}% of Protocol Completed
          </span>
        </div>

        {/* Primary Large Player Buttons */}
        <div className="flex items-center gap-3">
          {/* Step Back */}
          <Tooltip content="Previous step (Left Arrow)">
            <button
              type="button"
              disabled={isAtStart}
              onClick={onPrev}
              className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Tooltip>

          {/* Big Play / Pause Button in Vibrant Orange */}
          <button
            type="button"
            onClick={onTogglePlay}
            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isPlaying ? "PAUSE" : "PLAY DEMO"}</span>
          </button>

          {/* Step Forward */}
          <Tooltip content="Next step (Right Arrow)">
            <button
              type="button"
              disabled={isAtEnd}
              onClick={onNext}
              className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
              aria-label="Next step"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </Tooltip>

          {/* Reset */}
          <Tooltip content="Reset simulation (R)">
            <button
              type="button"
              onClick={onReset}
              className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-neutral-200 transition-all ml-1"
              aria-label="Reset simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* Speed Toggle */}
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-1 text-xs ml-2 font-mono">
            {[1, 2].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSpeedChange(s)}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  playbackSpeed === s
                    ? "bg-neutral-800 text-orange-400"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
