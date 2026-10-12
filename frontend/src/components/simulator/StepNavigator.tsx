import React from "react";
import {
  KeyRound,
  ShieldAlert,
  Radio,
  FileCode,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import type { SimulationStep } from "../../lib/crypto";

interface StepNavigatorProps {
  steps: SimulationStep[];
  currentStepIndex: number;
  onSelectStep: (stepNumber: number) => void;
  mitm: boolean;
}

export const getStepShortTitle = (step: SimulationStep): string => {
  const action = step.action.toLowerCase();
  if (action.includes("parameter")) return "Public values (p, g)";
  if (action.includes("alice generates private") || action.includes("alice private")) return "Alice private key (a)";
  if (action.includes("bob generates private") || action.includes("bob private")) return "Bob private key (b)";
  if (action.includes("computes public value a") || action.includes("alice public")) return "Alice public value (A)";
  if (action.includes("computes public value b") || action.includes("bob public")) return "Bob public value (B)";
  if (action.includes("exchange")) return "Public values exchange";
  if (action.includes("certificate") || action.includes("signature")) return "Certificate defense check";
  if (action.includes("eve generates") || action.includes("dual rogue")) return "Enter Eve: Rogue keys";
  if (action.includes("intercepted mid-flight") || action.includes("interception")) return "Packets intercepted";
  if (action.includes("substitut")) return "Eve key substitution";
  if (action.includes("alice computes shared") || action.includes("alice calculates shared")) return "Alice shared secret (K_A)";
  if (action.includes("bob computes shared") || action.includes("bob calculates shared")) return "Bob shared secret (K_B)";
  if (action.includes("eve calculates both")) return "Eve computes both secrets";
  if (action.includes("match verified")) return "Shared secrets match!";
  if (action.includes("alice encrypts")) return "Alice encrypts message";
  if (action.includes("eve decrypts") || action.includes("eve intercepts & decrypts")) return "Eve decrypts message";
  if (action.includes("eve tampers") || action.includes("tampered")) return "Eve tampers payload";
  if (action.includes("bob decrypts")) return "Bob decrypts message";
  return step.action;
};

export const StepNavigator: React.FC<StepNavigatorProps> = ({
  steps,
  currentStepIndex,
  onSelectStep,
  mitm,
}) => {
  const getStepIcon = (step: SimulationStep) => {
    if (step.actor === "Eve") return <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />;
    if (step.actor === "Channel") return <Radio className="w-4 h-4 text-orange-400 shrink-0" />;
    if (step.action.toLowerCase().includes("encrypt") || step.action.toLowerCase().includes("decrypt"))
      return <FileCode className="w-4 h-4 text-emerald-400 shrink-0" />;
    if (step.action.toLowerCase().includes("shared") || step.action.toLowerCase().includes("match"))
      return <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />;
    return <KeyRound className="w-4 h-4 text-blue-400 shrink-0" />;
  };

  return (
    <div className="bg-[#0c0c12] rounded-2xl border-2 border-neutral-800 p-4 sm:p-5 shadow-2xl space-y-3.5 text-left sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
            <span>Protocol Step Progression</span>
            {mitm && (
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase font-mono font-bold">
                MITM Mode
              </span>
            )}
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Click any step to inspect &amp; animate stage
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
          {steps.length > 0 ? `${currentStepIndex + 1}/${steps.length}` : "0"}
        </span>
      </div>

      {/* Step Buttons List */}
      <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
        {steps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isEveStep = step.actor === "Eve" || step.action.toLowerCase().includes("eve") || step.alert_type === "danger";

          // Dynamic styling matching the wireframe in Image 1
          let buttonClasses = "w-full text-left px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer font-sans text-xs sm:text-sm flex items-center justify-between gap-3 ";

          if (isActive) {
            if (isEveStep) {
              // Active Eve step: Dark red with glowing red border (like Step 5 in user mockup)
              buttonClasses += "bg-rose-950/70 border-rose-500 text-white shadow-lg shadow-rose-500/25 ring-1 ring-rose-500";
            } else if (step.actor === "Alice") {
              // Active Alice step: Dark blue with blue border (like Step 2 in user mockup)
              buttonClasses += "bg-blue-950/70 border-blue-500 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-500";
            } else if (step.actor === "Bob") {
              // Active Bob step: Dark emerald with emerald border
              buttonClasses += "bg-emerald-950/70 border-emerald-500 text-white shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-500";
            } else {
              // Active Channel/System step: Vibrant orange border
              buttonClasses += "bg-orange-950/60 border-orange-500 text-white shadow-lg shadow-orange-500/25 ring-1 ring-orange-500";
            }
          } else {
            if (isEveStep) {
              // Inactive Eve step: Subtle dark red border (like Step 5 in user mockup)
              buttonClasses += "bg-[#180a0e] border-rose-950 text-rose-300 hover:border-rose-800 hover:bg-rose-950/30";
            } else {
              // Standard inactive step (like Step 1, 3, 4 in user mockup)
              buttonClasses += "bg-[#09090e] border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white hover:bg-neutral-900/60";
            }
          }

          return (
            <button
              key={step.step}
              type="button"
              onClick={() => onSelectStep(step.step)}
              className={buttonClasses}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {getStepIcon(step)}
                <div className="truncate">
                  <span className="font-semibold block truncate">
                    Step {step.step}: {getStepShortTitle(step)}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono block truncate">
                    {step.actor} &bull; {step.formula ? step.formula.replace(/\\bmod/g, "mod").replace(/\\quad/g, " ").replace(/\\implies/g, "→").slice(0, 36) : step.action}
                  </span>
                </div>
              </div>

              {isActive ? (
                <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0 animate-ping" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
