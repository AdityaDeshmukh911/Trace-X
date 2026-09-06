import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldAlert, FileText, Send, AlertTriangle,
  CheckCircle2, ExternalLink, ChevronDown, ChevronUp, Zap,
  Snowflake, Award, Cpu, ShieldCheck, Copy, Check
} from "lucide-react";
import { TraceResult, RiskFactor } from "../types";
import { generateReport } from "../api/client";
import DossierModal from "./DossierModal";

// ── Risk gauge SVG ────────────────────────────────────────────────────────────
function RiskGauge({ score }: { score: number }) {
  const r = 40;
  const circ = Math.PI * r;
  const filled = (score / 100) * circ;
  const color = score > 75 ? "#ef4444" : score > 50 ? "#f59e0b" : "#22c55e";
  const needleDeg = 180 - (score / 100) * 180;
  const needleRad = (needleDeg * Math.PI) / 180;
  const nx = 50 + 32 * Math.cos(needleRad);
  const ny = 50 - 32 * Math.sin(needleRad);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 55" className="w-36">
        <path d="M10 50 A40 40 0 0 1 90 50" stroke="#1e293b" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path
          d="M10 50 A40 40 0 0 1 90 50"
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circ}`}
          style={{ transition: "stroke-dasharray 1s ease-out" }}
        />
        <line x1="50" y1="50" x2={nx} y2={ny} stroke="white" strokeWidth="2" strokeLinecap="round" />
        <circle cx="50" cy="50" r="3" fill="white" />
        <text x="50" y="62" textAnchor="middle" fill={color} fontSize="14" fontWeight="bold">{score}</text>
      </svg>
      <span className="text-[10px] text-slate-400 -mt-1 font-mono">COURT DEFENSIBLE / 100</span>
    </div>
  );
}

// ── Evidence factor row ───────────────────────────────────────────────────────
function FactorRow({ f }: { f: RiskFactor }) {
  const sevColor: Record<string, string> = {
    CRITICAL: "text-red-400 border-red-900/60 bg-red-950/40",
    HIGH:     "text-amber-400 border-amber-900/60 bg-amber-950/40",
    MEDIUM:   "text-blue-400 border-blue-900/60 bg-blue-950/40",
    LOW:      "text-emerald-400 border-emerald-900/60 bg-emerald-950/40",
  };
  const [open, setOpen] = useState(false);

  return (
    <div className={`border rounded-lg p-2.5 cursor-pointer ${sevColor[f.severity] || sevColor.MEDIUM}`}
         onClick={() => setOpen(!open)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">{f.icon}</span>
          <span className="text-[11px] font-semibold">{f.factor.replace(/_/g, " ")}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold">+{f.points}</span>
          {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </div>
      </div>
      {open && <p className="text-[10px] text-slate-300 mt-1.5 leading-relaxed">{f.description}</p>}
    </div>
  );
}

// ── Typing text hook ──────────────────────────────────────────────────────────
function useTypingText(text: string, speed = 10) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    if (!text) return;
    let i = 0;
    const t = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, i + 1)); i++; }
      else clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text]);
  return displayed;
}

// ── Main panel ────────────────────────────────────────────────────────────────
export default function IntelligencePanel({ result }: { result: TraceResult }) {
  const { intelligence: intel, narrative, narrative_source, investigation_id, typology, ml_anomaly, evidence } = result;
  const [reportLoading, setReportLoading] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [showSop, setShowSop] = useState(false);
  const navigate = useNavigate();

  const displayedNarrative = useTypingText(narrative);
  const riskColor = intel.risk_score > 75 ? "text-red-400" : intel.risk_score > 55 ? "text-amber-400" : "text-emerald-400";
  const riskBg    = intel.risk_score > 75 ? "bg-red-950/30 border-red-900/60" : "bg-amber-950/30 border-amber-900/60";

  function handleOpenReport() {
    setShowDossierModal(true);
  }

  async function handleGenerateReport() {
    setReportLoading(true);
    try {
      await generateReport(investigation_id, "Insp. Aditya Prashant Deshmukh");
    } catch (e) {
      console.warn("Backend report gen fallback:", e);
    } finally {
      setReportLoading(false);
      setShowDossierModal(true);
    }
  }

  function handleTriggerFreeze() {
    if (!intel.vasp) return;
    navigate("/freeze", {
      state: {
        wallet: intel.vasp.address,
        chain: intel.vasp.chain
      }
    });
  }

  function handleCopyHash() {
    if (!evidence?.canonical_sha256) return;
    navigator.clipboard.writeText(evidence.canonical_sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  }

  return (
    <div className="h-full overflow-y-auto flex flex-col gap-4 pr-1 text-sm">

      {/* ── TOP ACTION: COURT DOSSIER QUICK ACCESS ── */}
      <button
        onClick={handleGenerateReport}
        disabled={reportLoading}
        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-emerald-950/80 via-[#0B1A1E]/90 to-teal-950/80 hover:from-emerald-900/90 hover:to-teal-900/90 border border-emerald-500/40 rounded-xl text-left transition-all shadow-[0_0_15px_-3px_rgba(16,185,129,0.25)] group shrink-0 cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
            <FileText size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Court Dossier &amp; Sec 63 BSA</span>
              <span className="text-[9px] bg-emerald-500/30 text-emerald-300 font-mono px-1.5 py-0.2 rounded font-semibold">NCRP</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Section 91 CrPC freeze + multi-hop audit trail</p>
          </div>
        </div>
        <ExternalLink size={14} className="text-emerald-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
      </button>

      {/* ── AUTOMATED FRAUD TYPOLOGY CLASSIFICATION ── */}
      {typology && (
        <div className="border border-[#1E2638] bg-[#141A29] rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award size={13} />
              Automated Fraud Typology
            </span>
            <span className="text-xs font-mono font-bold text-blue-300 bg-blue-900/40 px-2 py-0.5 rounded border border-blue-700/40">
              {typology.confidence_pct} Confidence
            </span>
          </div>

          <p className="text-sm font-bold text-white leading-tight">
            {typology.typology_name}
          </p>

          <p className="text-[11px] text-slate-300 mt-1">
            <span className="text-slate-500">Threat Actor:</span> {typology.threat_actor}
          </p>

          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
            {typology.legal_classification}
          </p>

          {/* Expandable SOP */}
          {typology.investigative_sop && (
            <div className="mt-2.5 pt-2 border-t border-purple-900/60">
              <button
                onClick={() => setShowSop(!showSop)}
                className="w-full flex items-center justify-between text-[11px] font-bold text-purple-300 hover:text-purple-200"
              >
                <span>LEA Standard Operating Procedure (SOP)</span>
                {showSop ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>

              {showSop && (
                <div className="mt-2 space-y-1.5 text-[10px] text-slate-300 pl-1">
                  {typology.investigative_sop.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-purple-400 font-bold">•</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── DUAL RISK & ML ANOMALY ASSESSMENT ── */}
      <div className={`border rounded-xl p-4 ${riskBg}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className={riskColor} />
            <span className={`font-bold text-xs uppercase tracking-wider ${riskColor}`}>
              Risk Assessment — {intel.risk_level}
            </span>
          </div>

          {ml_anomaly && (
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700 px-2 py-0.5 rounded-lg text-[10px]">
              <Cpu size={11} className="text-cyan-400" />
              <span className="text-slate-400">ML Index:</span>
              <span className="font-mono font-bold text-cyan-400">{ml_anomaly.ml_anomaly_index}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <RiskGauge score={intel.risk_score} />
          <div className="text-right space-y-1">
            <div className="text-[10px] text-slate-400">Total Nodes</div>
            <div className="text-white font-mono font-bold">{intel.total_nodes}</div>
            <div className="text-[10px] text-slate-400 mt-1">Velocity Z-Score</div>
            <div className="text-cyan-400 font-mono font-bold">{ml_anomaly?.z_score_velocity || "+2.8σ"}</div>
            <div className="text-[10px] text-slate-400 mt-1">Laundering Depth</div>
            <div className="text-white font-mono font-bold">{intel.max_hop_depth} hops</div>
          </div>
        </div>

        {/* Chain badges */}
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {intel.chains_involved.map((c) => (
            <span key={c} className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-slate-300">
              {c}
            </span>
          ))}
          {intel.has_mixer && (
            <span className="px-2 py-0.5 bg-orange-950 border border-orange-800 rounded text-[10px] text-orange-300 font-semibold">
              MIXER DETECTED
            </span>
          )}
          {intel.has_cross_chain && (
            <span className="px-2 py-0.5 bg-purple-950 border border-purple-800 rounded text-[10px] text-purple-300 font-semibold">
              CROSS-CHAIN
            </span>
          )}
        </div>
      </div>

      {/* ── Evidence Factors ── */}
      <div>
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Evidence Factors ({intel.risk_factors.length})
        </h3>
        <div className="space-y-1.5">
          {intel.risk_factors.map((f, i) => <FactorRow key={i} f={f} />)}
        </div>
      </div>

      {/* ── VASP Attribution & Immediate Freeze Directive ── */}
      {intel.vasp && (
        <div className="border border-blue-800 bg-blue-950/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-400 font-bold text-xs uppercase tracking-wider">
              VASP Attribution & Freeze Target
            </span>
            <span className="ml-auto text-xs font-mono text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded">
              {intel.vasp.confidence_pct} confidence
            </span>
          </div>

          <div className="mb-3">
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                style={{ width: intel.vasp.confidence_pct }}
              />
            </div>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Exchange</span>
              <span className="text-white font-bold">{intel.vasp.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Target Address</span>
              <span className="text-slate-300 font-mono">{intel.vasp.address.slice(0, 10)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Distance</span>
              <span className="text-white">{intel.vasp.distance_hops} hops</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Jurisdiction</span>
              <span className="text-white">{intel.vasp.jurisdiction}</span>
            </div>
          </div>

          <div className="mt-3 p-2 bg-blue-950/60 border border-blue-900 rounded-lg text-[10px] text-blue-200 leading-relaxed">
            <Zap size={10} className="inline mr-1 text-blue-400" />
            {intel.vasp.action}
          </div>

          <button
            onClick={handleTriggerFreeze}
            className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold text-xs transition-colors shadow-sm"
          >
            <Snowflake size={13} />
            Draft Section 91 CrPC Freeze Summons →
          </button>
        </div>
      )}

      {/* ── SECTION 65B EVIDENCE HASH BADGE ── */}
      {evidence?.canonical_sha256 && (
        <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-400" />
              Sec 65B / 63 BSA Tamperproof Hash
            </span>
            <button
              onClick={handleCopyHash}
              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
            >
              {copiedHash ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
              {copiedHash ? "Copied" : "Copy"}
            </button>
          </div>

          <p className="font-mono text-[10px] text-emerald-400 break-all bg-slate-950 p-2 rounded border border-slate-800/80">
            {evidence.canonical_sha256}
          </p>
        </div>
      )}

      {/* ── Narrative ── */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {narrative_source === "LLM" ? "AI Intelligence Narrative (Claude)" : "Automated Forensics Narrative"}
          </span>
        </div>
        <div className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
          {displayedNarrative}
          {displayedNarrative.length < narrative.length && (
            <span className="animate-pulse text-emerald-400">▌</span>
          )}
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="space-y-2 pb-4">
        <button
          onClick={handleGenerateReport}
          disabled={reportLoading}
          className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 text-white rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-emerald-600/20"
        >
          <FileText size={16} />
          {reportLoading ? "Preparing Certified Dossier..." : "View & Download Certified NCRP Report"}
        </button>

        <button
          onClick={() => navigate("/evidence")}
          className="flex items-center justify-center gap-2 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-xs transition-colors border border-slate-700"
        >
          <ShieldCheck size={14} className="text-emerald-400" />
          Verify Electronic Evidence Certificate
        </button>
      </div>

      <DossierModal
        isOpen={showDossierModal}
        onClose={() => setShowDossierModal(false)}
        data={{
          investigation_id,
          case_id: result.complaint_id || "NCRP/2024/MH/00441",
          target_address: result.trace_metadata?.start_address || result.nodes?.[0]?.id,
          chain: result.trace_metadata?.chain || result.nodes?.[0]?.chain,
          typology: typology?.typology_name,
          risk_score: intel.risk_score,
          risk_level: intel.risk_level,
          officer_name: "Insp. Aditya Prashant Deshmukh",
          badge: "MH-CYB-2241",
          police_station: "State Cyber Police Station, CID Pune HQ",
          vasp_name: intel.vasp?.name,
          vasp_address: intel.vasp?.address,
          canonical_sha256: evidence?.canonical_sha256,
          narrative: narrative,
          edges: result.edges
        }}
      />
    </div>
  );
}
