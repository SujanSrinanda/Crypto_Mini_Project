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
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "Bob":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "Eve":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      case "Channel":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      default:
        return "bg-neutral-800 text-neutral-300 border-neutral-700";
    }
  };

  return (
    <div className="bg-[#0c0c12] rounded-2xl p-6 border-2 border-neutral-800 flex flex-col h-[650px] shadow-xl text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-orange-400" />
          <h3 className="font-extrabold text-base text-white">Live Mathematical Step Log</h3>
        </div>
        <span className="text-xs text-neutral-400 font-mono font-bold">
          {steps.length} Steps Logged
        </span>
      </div>

      {/* Steps List */}
      <div className="flex-1 overflow-y-auto mt-4 pr-1.5 space-y-3">
        {steps.map((item, idx) => {
          const isActive = idx === currentStepIndex;

          return (
            <div
              key={item.step}
              onClick={() => onJumpToStep(item.step)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                isActive
                  ? "bg-neutral-900 border-orange-500 shadow-lg shadow-orange-500/10 ring-1 ring-orange-500/40"
                  : "bg-neutral-950/70 border-neutral-800/80 hover:bg-neutral-900/60 hover:border-neutral-700"
              }`}
            >
              {/* Step & Actor Badges */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                      isActive ? "bg-orange-500 text-white" : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    Step {item.step}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getActorBadge(
                      item.actor
                    )}`}
                  >
                    {item.actor}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => copyStep(item, idx, e)}
                  className="text-neutral-500 hover:text-white p-1"
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
              <h4 className="text-sm font-bold text-white flex items-center justify-between">
                <span>{item.action}</span>
                {isActive && <ChevronRight className="w-4 h-4 text-orange-400 shrink-0" />}
              </h4>

              {/* Plain English explanation */}
              <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
                {item.description}
              </p>

              {/* Formula */}
              {item.formula && (
                <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-xs text-orange-300 font-bold overflow-x-auto select-all">
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
