import React from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Dices,
  Flame,
  Sliders,
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
  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl space-y-5">
      {/* Top Header & Bit Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-sky-400" />
          <h2 className="text-base font-bold text-white tracking-wide">
            Simulation Control Deck
          </h2>
        </div>

        {/* Parameter Size Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-950/70 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 px-2">Key Size:</span>
          {[
            { id: "toy", label: "Toy (p=23)", hint: "Mental math & classroom proof" },
            { id: "64", label: "64-bit", hint: "Large number scaling" },
            { id: "128", label: "128-bit", hint: "Standard cryptographic security" },
            { id: "256", label: "256-bit", hint: "Astronomically hard to crack" },
          ].map((item) => (
            <Tooltip key={item.id} content={item.hint}>
              <button
                type="button"
                onClick={() => onSelectBitSize(item.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  bitSize === item.id
                    ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                {item.label}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Prime modulus p */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Prime Modulus (<span className="font-mono text-sky-400">p</span>)
          </label>
          <input
            type="text"
            value={p}
            onChange={(e) => onPChange(e.target.value)}
            className="w-full px-3 py-2 text-xs font-mono bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            placeholder="Prime number (e.g. 23)"
          />
        </div>

        {/* Generator g */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Generator (<span className="font-mono text-sky-400">g</span>)
          </label>
          <input
            type="text"
            value={g}
            onChange={(e) => onGChange(e.target.value)}
            className="w-full px-3 py-2 text-xs font-mono bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            placeholder="Generator (e.g. 5)"
          />
        </div>

        {/* Alice Private Key */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-sky-300">
              Alice Secret (<span className="font-mono">a</span>)
            </label>
            <button
              type="button"
              onClick={onRandomizePrivateKeys}
              className="text-[10px] text-slate-400 hover:text-sky-300 flex items-center gap-1"
            >
              <Dices className="w-3 h-3" /> Roll
            </button>
          </div>
          <input
            type="text"
            value={alicePrivate}
            onChange={(e) => onAlicePrivateChange(e.target.value)}
            className="w-full px-3 py-2 text-xs font-mono bg-sky-950/30 border border-sky-600/40 rounded-xl text-sky-200 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            placeholder="Alice private (e.g. 6)"
          />
        </div>

        {/* Bob Private Key */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-emerald-300">
              Bob Secret (<span className="font-mono">b</span>)
            </label>
            <button
              type="button"
              onClick={onRandomizePrivateKeys}
              className="text-[10px] text-slate-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <Dices className="w-3 h-3" /> Roll
            </button>
          </div>
          <input
            type="text"
            value={bobPrivate}
            onChange={(e) => onBobPrivateChange(e.target.value)}
            className="w-full px-3 py-2 text-xs font-mono bg-emerald-950/30 border border-emerald-600/40 rounded-xl text-emerald-200 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            placeholder="Bob private (e.g. 15)"
          />
        </div>
      </div>

      {/* Message and Tamper Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Alice's Outgoing Message
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            className="w-full px-3 py-2 text-xs font-sans bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            placeholder="Enter message to encrypt and transmit..."
          />
        </div>

        {mitm ? (
          <div>
            <label className="block text-xs font-medium text-rose-300 mb-1 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              Eve's Tampered Message (Injected)
            </label>
            <input
              type="text"
              value={tamperedMessage}
              onChange={(e) => onTamperedMessageChange(e.target.value)}
              className="w-full px-3 py-2 text-xs font-sans bg-rose-950/30 border border-rose-500/50 rounded-xl text-rose-200 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
              placeholder="Tampered payload forwarded to Bob..."
            />
          </div>
        ) : (
          <div className="flex items-center text-xs text-slate-400 bg-slate-950/40 rounded-xl px-3 py-2 border border-slate-800">
            <span>Honest Mode: Message will be delivered unmodified to Bob via symmetric key stream.</span>
          </div>
        )}
      </div>

      {/* Switches & Playback Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
        {/* Toggle Switches */}
        <div className="flex flex-wrap items-center gap-4">
          {/* MITM Switch */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={mitm}
              onClick={onToggleMitm}
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                mitm
                  ? "bg-rose-600 border-rose-400 shadow-lg shadow-rose-600/40"
                  : "bg-slate-800 border-slate-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out mt-0.5 ${
                  mitm ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
            <div className="flex flex-col">
              <span className={`text-xs font-bold uppercase tracking-wider ${mitm ? "text-rose-400" : "text-slate-300"}`}>
                MITM Mode {mitm ? "ON" : "OFF"}
              </span>
              <span className="text-[10px] text-slate-400">
                {mitm ? "Eve intercepts & modifies packets" : "Honest peer-to-peer exchange"}
              </span>
            </div>
          </div>

          {/* Authenticated DH Switch */}
          <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
            <button
              type="button"
              role="switch"
              aria-checked={authenticatedDh}
              onClick={onToggleAuthenticatedDh}
              className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                authenticatedDh
                  ? "bg-emerald-600 border-emerald-400 shadow-md shadow-emerald-600/30"
                  : "bg-slate-800 border-slate-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-0.5 ${
                  authenticatedDh ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <div className="flex flex-col">
              <span className={`text-xs font-semibold ${authenticatedDh ? "text-emerald-400" : "text-slate-400"}`}>
                Authenticated DH
              </span>
              <span className="text-[10px] text-slate-400">
                {authenticatedDh ? "Digital certificates enabled" : "Unauthenticated DH"}
              </span>
            </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-950/70 border border-slate-800 rounded-xl p-1 mr-2">
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-0.5 text-[11px] font-semibold rounded-md ${
                  playbackSpeed === s
                    ? "bg-slate-800 text-sky-400 border border-slate-700"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Step Back */}
          <Tooltip content="Previous step (← Arrow)">
            <button
              type="button"
              disabled={isAtStart}
              onClick={onPrev}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* Play / Pause */}
          <Tooltip content={isPlaying ? "Pause (Space)" : "Play animation (Space)"}>
            <button
              type="button"
              onClick={onTogglePlay}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-sky-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </button>
          </Tooltip>

          {/* Step Forward */}
          <Tooltip content="Next step (→ Arrow)">
            <button
              type="button"
              disabled={isAtEnd}
              onClick={onNext}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              aria-label="Next step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* Reset */}
          <Tooltip content="Reset simulation (R)">
            <button
              type="button"
              onClick={onReset}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              aria-label="Reset simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Progress Bar & Step Indicator */}
      <div className="pt-2">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
          <span>
            Step {totalSteps > 0 ? currentStepIndex + 1 : 0} of {totalSteps}
          </span>
          <span>{totalSteps > 1 ? Math.round(((currentStepIndex) / (totalSteps - 1)) * 100) : 0}% Complete</span>
        </div>
        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-300 ${
              mitm ? "bg-gradient-to-r from-sky-500 via-rose-500 to-rose-600" : "bg-gradient-to-r from-sky-500 to-emerald-500"
            }`}
            style={{
              width: `${totalSteps > 1 ? ((currentStepIndex) / (totalSteps - 1)) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
