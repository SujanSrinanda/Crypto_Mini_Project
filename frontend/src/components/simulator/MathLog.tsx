import React from "react";
import { BookOpen, Copy, Check, ChevronRight } from "lucide-react";
import type { SimulationStep } from "../../lib/crypto";

interface MathLogProps {
  steps: SimulationStep[];
  currentStepIndex: number;
  onJumpToStep: (stepNumber: number) => void;
}

export const MathLog: React.FC<MathLogProps> = ({
  steps,
  currentStepIndex,
  onJumpToStep,
}) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const copyStep = (step: SimulationStep, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${step.action}\n${step.description}\nFormula: ${step.formula || "N/A"}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getActorBadge = (actor: string) => {
    switch (actor) {
      case "Alice":
        return "bg-sky-500/20 text-sky-300 border-sky-500/30";
      case "Bob":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "Eve":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      case "Channel":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      default:
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col h-[650px] shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-sm text-white">Live Mathematical Log</h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          {steps.length} Steps Recorded
        </span>
      </div>

      {/* Steps List */}
      <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-2.5">
        {steps.map((item, idx) => {
          const isActive = idx === currentStepIndex;

          return (
            <div
              key={item.step}
              onClick={() => onJumpToStep(item.step)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                isActive
                  ? "bg-slate-800/90 border-sky-500 shadow-md shadow-sky-500/10 ring-1 ring-sky-500/30"
                  : "bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700"
              }`}
            >
              {/* Step & Actor Badges */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                      isActive ? "bg-sky-500 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    Step {item.step}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getActorBadge(
                      item.actor
                    )}`}
                  >
                    {item.actor}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => copyStep(item, idx, e)}
                  className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                  aria-label="Copy step details"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Title */}
              <h4 className="text-xs font-bold text-slate-100 flex items-center justify-between">
                <span>{item.action}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
              </h4>

              {/* Plain English explanation */}
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                {item.description}
              </p>

              {/* Formula */}
              {item.formula && (
                <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-slate-950/90 border border-slate-800 font-mono text-[11px] text-indigo-300 overflow-x-auto select-all">
                  <code>{item.formula}</code>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
