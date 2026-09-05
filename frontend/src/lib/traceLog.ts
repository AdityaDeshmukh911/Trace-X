import { TraceResult } from "../types";

export interface LogStep {
  delay: number;
  level: "INFO" | "WARN" | "CRITICAL" | "SUCCESS";
  msg: string;
}

/**
 * Builds the animated "trace log" shown on the loading screen — FROM THE
 * ACTUAL API RESPONSE, not a fixed canned script. Previously this component
 * always played the identical sequence (mixer hit, bridge hop, 92% VASP
 * match...) regardless of what was actually traced, which meant a clean
 * wallet with no mixer/bridge would still show a "mixer detected" line.
 * This function only emits a line for something that is genuinely present
 * in `result`.
 */
export function buildTraceLog(result: TraceResult, wallet: string, chain: string): LogStep[] {
  const steps: LogStep[] = [];
  let t = 0;
  const push = (level: LogStep["level"], msg: string, gap = 420) => {
    t += gap;
    steps.push({ delay: t, level, msg });
  };

  const { intelligence: intel, nodes, edges } = result;

  push("INFO", `Initiating blockchain scan on ${chain} network...`, 0);
  push("INFO", "Resolving origin wallet entity type...");

  const outgoing = edges.filter((e) => e.source === wallet);
  if (outgoing.length >= 3) {
    push("WARN", `⚠  Fan-out detected: ${outgoing.length} outgoing transfers from origin`);
  }

  const maxHop = intel.max_hop_depth ?? 0;
  for (let h = 1; h <= Math.min(maxHop, 5); h++) {
    const atHop = nodes.filter((n) => n.hop_distance === h).length;
    if (atHop > 0) {
      push("INFO", `HOP ${h} — tracing ${atHop} downstream address${atHop > 1 ? "es" : ""}...`);
    }
  }

  const mixer = nodes.find((n) => n.type === "MIXER");
  if (mixer) {
    push("CRITICAL", `🔴 CRITICAL: ${mixer.label} detected at hop ${mixer.hop_distance}`);
  }

  const dex = nodes.find((n) => n.type === "DEX");
  if (dex) {
    push("INFO", `Swap detected via ${dex.label}`);
  }

  const bridge = nodes.find((n) => n.type === "BRIDGE");
  if (bridge) {
    const chains = intel.chains_involved?.length ? intel.chains_involved : [chain];
    const from = chains[0];
    const to = chains.length > 1 ? chains[chains.length - 1] : chain;
    push("WARN", `🌉 Cross-chain bridge detected: ${from} → ${to} via ${bridge.label}`);
  }

  if (intel.vasp) {
    push("SUCCESS", `🔵 VASP MATCH: ${intel.vasp.name} identified (${intel.vasp.confidence_pct} confidence)`);
  }

  if (intel.secondary_vasps?.length) {
    push("INFO", `Secondary VASP candidate: ${intel.secondary_vasps[0].name}`);
  }

  push("SUCCESS", `✅ Trace complete. Risk Score: ${intel.risk_score} — ${intel.risk_level}`, 500);

  return steps;
}

/** Shown briefly while the real API call is in flight, before the actual
 * result (and therefore the real log above) is known. */
export const CONNECTING_STEPS: LogStep[] = [
  { delay: 0, level: "INFO", msg: "Connecting to blockchain node..." },
];
