import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Activity, Network, AlertTriangle, GitBranch, Clock, Check, FileText } from "lucide-react";
import Sidebar           from "../components/Sidebar";
import TopBar             from "../components/TopBar";
import GraphVisualizer    from "../components/GraphVisualizer";
import TimelineView       from "../components/TimelineView";
import IntelligencePanel  from "../components/IntelligencePanel";
import LoadingSequence    from "../components/LoadingSequence";
import NodeDetailModal    from "../components/NodeDetailModal";
import DossierModal       from "../components/DossierModal";
import { TraceNode, TraceResult } from "../types";
import { investigate }  from "../api/client";
import { buildTraceLog, LogStep } from "../lib/traceLog";

type Stage = "idle" | "loading" | "result";
type ViewTab = "graph" | "timeline" | "ledger";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [wallet,           setWallet]           = useState("");
  const [chain,            setChain]            = useState("ETH");
  const [hops,             setHops]             = useState<number>(5);
  const [stage,            setStage]            = useState<Stage>("idle");
  const [result,           setResult]           = useState<TraceResult | null>(null);
  const [modalNode,        setModalNode]        = useState<TraceNode | null>(null);
  const [panelOpen,        setPanelOpen]        = useState(false);
  const [activeTab,        setActiveTab]        = useState<ViewTab>("graph");
  const [error,            setError]            = useState<string | null>(null);
  const [traceSteps,       setTraceSteps]       = useState<LogStep[] | undefined>(undefined);
  const [copiedTx,         setCopiedTx]         = useState<string | null>(null);
  const [showDossierModal, setShowDossierModal] = useState(false);

  async function handleTrace(addr = wallet, chainArg = chain, hopsArg = hops) {
    const target = (addr || wallet || result?.trace_metadata?.start_address || "").trim();
    if (!target) return;
    setWallet(target);
    setChain(chainArg);
    setHops(hopsArg);
    setError(null);
    setResult(null);
    setModalNode(null);
    setPanelOpen(false);
    setActiveTab("graph");
    setTraceSteps(undefined);
    setStage("loading");

    try {
      const res = await investigate(target, chainArg, hopsArg);
      const data = res.data as TraceResult;

      const steps = buildTraceLog(data, target, chainArg);
      setTraceSteps(steps);
      const revealDelayMs = steps[steps.length - 1]?.delay ?? 0;
      await new Promise((r) => setTimeout(r, revealDelayMs + 500));

      setResult(data);
      setStage("result");
      setPanelOpen(true);
    } catch (e: any) {
      setError(e?.message ?? "Trace failed");
      setStage("idle");
    }
  }

  useEffect(() => {
    const incoming = location.state as { wallet?: string; chain?: string } | null;
    if (incoming?.wallet) {
      const c = incoming.chain || "ETH";
      setWallet(incoming.wallet);
      setChain(c);
      handleTrace(incoming.wallet, c);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, []);

  function handleNodeClick(node: TraceNode) {
    setModalNode(node);
  }

  const handleCopy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedTx(txt);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  const stats = result ? [
    { label: "Nodes Traced",   value: result.intelligence.total_nodes,        icon: Network },
    { label: "Transactions",   value: result.intelligence.total_transactions,  icon: Activity },
    { label: "Risk Score",     value: `${result.intelligence.risk_score}/100`, icon: AlertTriangle,
      color: result.intelligence.risk_score > 75 ? "text-red-400" : "text-amber-400" },
    { label: "VASP Match",     value: result.intelligence.vasp?.name ?? "—",   icon: ChevronRight },
  ] : [];

  return (
    <div className="flex h-screen bg-[#07090E] text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar
          chain={chain}
          setChain={setChain}
          wallet={wallet}
          setWallet={setWallet}
          loading={stage === "loading"}
          onTrace={handleTrace}
        />

        {/* ── Stats strip ── */}
        {stats.length > 0 && (
          <div className="flex border-b border-white/[0.06] bg-[#0C101A]/60 shrink-0">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex-1 flex items-center gap-3 px-5 py-2.5 border-r border-white/[0.06] last:border-0">
                <Icon size={15} className={color ?? "text-slate-400"} />
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-mono tracking-widest font-semibold">{label}</p>
                  <p className={`text-xs font-bold font-mono ${color ?? "text-white"}`}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Main canvas with Floating Toolbar ── */}
        <div className="flex-1 flex overflow-hidden relative p-4 gap-4">
          <div className="flex-1 relative overflow-hidden flex flex-col">

            {/* Floating Top Canvas Control Strip */}
            {stage === "result" && result && (
              <div className="mb-3 flex items-center justify-between gap-3 bg-[#0B0F18]/90 backdrop-blur-md border border-white/[0.08] px-4 py-2 rounded-2xl z-20 shadow-xl shrink-0">
                {/* View Mode Switcher */}
                <div className="flex items-center gap-1 bg-[#101522] p-1 rounded-xl border border-white/[0.08]">
                  <button
                    onClick={() => setActiveTab("graph")}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                      activeTab === "graph"
                        ? "bg-emerald-600 text-white font-semibold shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <GitBranch size={13} /> Graph Canvas
                  </button>
                  <button
                    onClick={() => setActiveTab("ledger")}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                      activeTab === "ledger"
                        ? "bg-emerald-600 text-white font-semibold shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Activity size={13} /> Transaction Ledger
                  </button>
                  <button
                    onClick={() => setActiveTab("timeline")}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                      activeTab === "timeline"
                        ? "bg-emerald-600 text-white font-semibold shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Clock size={13} /> Temporal Timeline
                  </button>
                </div>

                {/* Hop Depth Controls */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Hop Depth:</span>
                  <div className="flex items-center gap-1 bg-[#101522] p-1 rounded-xl border border-white/[0.08]">
                    {[2, 3, 4, 5, 6].map((h) => (
                      <button
                        key={h}
                        onClick={() => {
                          setHops(h);
                          handleTrace(wallet || result?.trace_metadata?.start_address, chain, h);
                        }}
                        className={`px-2.5 py-0.5 text-xs font-mono rounded-lg transition-all ${
                          hops === h
                            ? "bg-emerald-600 text-white font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Direct Dossier and Reports Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowDossierModal(true)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl transition-all shadow-[0_0_15px_-3px_rgba(16,185,129,0.35)] cursor-pointer"
                    title="View, Print and Download Section 63 BSA Forensic Dossier"
                  >
                    <FileText size={13} />
                    View Court Dossier
                  </button>

                  <button
                    onClick={() => navigate("/reports")}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#121724] hover:bg-[#161D2E] text-slate-300 hover:text-white border border-white/[0.08] rounded-xl transition-all shadow-sm"
                  >
                    <ChevronRight size={13} />
                    Reports Archive
                  </button>
                </div>
              </div>
            )}

            {/* Canvas View Content */}
            <div className="flex-1 relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0D15]">
              {stage === "idle" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-8">
                  <div className="w-16 h-16 rounded-2xl bg-[#101522] border border-emerald-500/30 shadow-[0_0_25px_-5px_rgba(16,185,129,0.25)] flex items-center justify-center">
                    <Network size={28} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold tracking-wide text-base">Enter a suspect wallet address above to trace funds</p>
                    <p className="text-slate-400 text-xs mt-1.5 max-w-md mx-auto leading-relaxed">
                      TRACE-X executes multi-hop BFS graph traversal, de-anonymizes terminal VASPs (Binance, WazirX, CoinDCX), and seals Section 63 BSA / 65B electronic evidence.
                    </p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] px-3 py-1 bg-[#101522] border border-white/[0.08] rounded-full text-emerald-400 font-mono">
                      Multi-hop BFS
                    </span>
                    <span className="text-[10px] px-3 py-1 bg-[#101522] border border-white/[0.08] rounded-full text-amber-400 font-mono">
                      VASP Attribution
                    </span>
                    <span className="text-[10px] px-3 py-1 bg-[#101522] border border-white/[0.08] rounded-full text-teal-400 font-mono">
                      Section 63 BSA Certified
                    </span>
                  </div>
                </div>
              )}

              {stage === "loading" && (
                <div className="absolute inset-0 p-8">
                  <LoadingSequence walletAddress={wallet} steps={traceSteps} />
                </div>
              )}

              {stage === "result" && result && activeTab === "graph" && (
                <GraphVisualizer
                  traceNodes={result.nodes}
                  traceEdges={result.edges}
                  onNodeClick={handleNodeClick}
                  panelOpen={panelOpen}
                />
              )}

              {stage === "result" && result && activeTab === "timeline" && (
                <TimelineView edges={result.edges} nodes={result.nodes} />
              )}

              {/* Transaction Ledger Table */}
              {stage === "result" && result && activeTab === "ledger" && (
                <div className="w-full h-full overflow-y-auto p-4">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#141A29] border-b border-[#1E2638] text-[11px] uppercase tracking-wider text-slate-400 font-mono sticky top-0">
                      <tr>
                        <th className="px-3 py-2.5">Seq</th>
                        <th className="px-3 py-2.5">Timestamp</th>
                        <th className="px-3 py-2.5">Source Sender</th>
                        <th className="px-3 py-2.5">Flow</th>
                        <th className="px-3 py-2.5">Destination Recipient</th>
                        <th className="px-3 py-2.5">Amount Transferred</th>
                        <th className="px-3 py-2.5">Tx Hash</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E2638]">
                      {result.edges.map((e, idx) => (
                        <tr key={e.id} className="hover:bg-[#141A29]/60 transition-colors font-mono">
                          <td className="px-3 py-2.5 text-slate-500">#{idx + 1}</td>
                          <td className="px-3 py-2.5 text-slate-400 whitespace-nowrap text-[11px]">{e.timestamp}</td>
                          <td className="px-3 py-2.5 text-slate-300">
                            <span className="text-white font-medium">{e.source.slice(0, 10)}...</span>
                          </td>
                          <td className="px-3 py-2.5 text-emerald-400 font-bold">→</td>
                          <td className="px-3 py-2.5 text-slate-300">
                            <span className="text-white font-medium">{e.target.slice(0, 10)}...</span>
                          </td>
                          <td className="px-3 py-2.5 font-bold text-emerald-400">
                            {e.amount} {e.chain}
                          </td>
                          <td className="px-3 py-2.5 text-slate-400 text-[11px]">
                            <button
                              onClick={() => handleCopy(e.hash)}
                              className="flex items-center gap-1 hover:text-white"
                            >
                              <span>{e.hash.slice(0, 10)}...</span>
                              {copiedTx === e.hash ? <Check size={11} className="text-emerald-400" /> : <Activity size={11} />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {error && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-950/90 border border-red-800 text-red-300 text-xs px-4 py-2 rounded-xl shadow-lg">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* ── Intelligence panel (slide-in from right) ── */}
          <div className={`
            border border-white/[0.08] bg-[#0A0D15] rounded-2xl overflow-y-auto
            transition-all duration-300 ease-in-out shrink-0 shadow-2xl
            ${panelOpen ? "w-96 px-4 pt-4" : "w-0 px-0 pt-0 border-0"}
          `}>
            {panelOpen && result && (
              <>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.06]">
                  <span className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Forensic Intelligence &amp; Dossier
                  </span>
                  <button
                    onClick={() => setPanelOpen(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <IntelligencePanel result={result} />
              </>
            )}
          </div>

          {result && !panelOpen && (
            <button
              onClick={() => setPanelOpen(true)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2.5 py-4 rounded-xl text-xs font-mono font-bold tracking-widest transition-all shadow-[0_0_20px_-3px_rgba(16,185,129,0.4)]"
            >
              INTEL
            </button>
          )}
        </div>
      </main>

      <NodeDetailModal node={modalNode} onClose={() => setModalNode(null)} />

      {result && (
        <DossierModal
          isOpen={showDossierModal}
          onClose={() => setShowDossierModal(false)}
          data={{
            investigation_id: result.investigation_id,
            case_id: result.complaint_id || "NCRP/2024/MH/00441",
            target_address: result.trace_metadata?.start_address || result.nodes?.[0]?.id,
            chain: result.trace_metadata?.chain || result.nodes?.[0]?.chain,
            typology: result.typology?.typology_name,
            risk_score: result.intelligence.risk_score,
            risk_level: result.intelligence.risk_level,
            officer_name: "Insp. Aditya Prashant Deshmukh",
            badge: "MH-CYB-2241",
            police_station: "State Cyber Police Station, CID Pune HQ",
            vasp_name: result.intelligence.vasp?.name,
            vasp_address: result.intelligence.vasp?.address,
            canonical_sha256: result.evidence?.canonical_sha256,
            narrative: result.narrative,
            edges: result.edges
          }}
        />
      )}
    </div>
  );
}
