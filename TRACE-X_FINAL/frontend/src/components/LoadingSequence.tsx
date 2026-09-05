import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { LogStep, CONNECTING_STEPS } from "../lib/traceLog";

const LEVEL_STYLE: Record<LogStep["level"], string> = {
  INFO:     "text-slate-400",
  WARN:     "text-amber-400",
  CRITICAL: "text-red-400 font-semibold",
  SUCCESS:  "text-emerald-400 font-semibold",
};

interface Props {
  walletAddress: string;
  /** Real step log built from the actual API response by buildTraceLog().
   *  Until the response arrives this is undefined and a brief generic
   *  "connecting" placeholder is shown instead — never a canned script
   *  claiming findings (mixer hits, VASP matches, etc.) that may not
   *  actually be true of this wallet. */
  steps?: LogStep[];
}

export default function LoadingSequence({ walletAddress, steps }: Props) {
  const activeSteps = steps && steps.length ? steps : CONNECTING_STEPS;
  const [visible, setVisible] = useState<number[]>([]);
  const [dots, setDots] = useState(".");

  // Re-run the reveal animation whenever the step list changes — i.e. once,
  // the moment the placeholder is swapped for the real, data-driven log.
  useEffect(() => {
    setVisible([]);
    const timers = activeSteps.map((step, i) =>
      setTimeout(() => setVisible((v) => [...v, i]), step.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [activeSteps]);

  useEffect(() => {
    const dotTimer = setInterval(() =>
      setDots((d) => (d.length >= 3 ? "." : d + ".")), 400
    );
    return () => clearInterval(dotTimer);
  }, []);

  const short = `${walletAddress.slice(0, 12)}...${walletAddress.slice(-8)}`;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      {/* Animated shield */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
        <div className="relative bg-[#101522] border border-emerald-500/40 rounded-2xl p-6 shadow-[0_0_35px_-5px_rgba(16,185,129,0.3)]">
          <Shield size={48} className="text-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Target wallet */}
      <div className="text-center">
        <p className="text-slate-500 text-xs uppercase font-mono tracking-widest mb-1">Tracing Wallet Target</p>
        <p className="text-white font-mono text-sm font-semibold">{short}</p>
      </div>

      {/* Trace log terminal */}
      <div className="w-full max-w-2xl bg-[#07090E] border border-white/[0.08] rounded-2xl p-5 font-mono text-xs space-y-2 min-h-[240px] shadow-2xl">
        <div className="text-slate-500 border-b border-white/[0.06] pb-2.5 mb-3 flex justify-between text-[11px]">
          <span className="font-semibold text-slate-400">TRACE-X Multi-Hop BFS Engine — Telemetry Feed</span>
          <span className="text-emerald-400 font-bold">●  RUNNING{dots}</span>
        </div>
        {activeSteps.map((step, i) =>
          visible.includes(i) ? (
            <div key={i} className={`flex gap-3 ${LEVEL_STYLE[step.level]}`}>
              <span className="text-slate-600 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{step.msg}</span>
            </div>
          ) : null
        )}
        {visible.length < activeSteps.length && (
          <div className="text-emerald-500 animate-pulse">▌</div>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-2xl">
        <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1.5">
          <span>Multi-hop graph traversal in progress</span>
          <span className="text-emerald-400 font-bold">{Math.round((visible.length / activeSteps.length) * 100)}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#101522] rounded-full overflow-hidden border border-white/[0.05]">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(16,185,129,0.5)]"
            style={{ width: `${(visible.length / activeSteps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
