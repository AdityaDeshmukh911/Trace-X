import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  Snowflake, FileText, CheckCircle, Clock, 
  Send, Building2, Copy, Download, ShieldCheck, Plus, AlertCircle
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { 
  fetchFreezeRequests, 
  createFreezeRequest, 
  updateFreezeStatus,
  downloadFreezeNoticeUrl 
} from "../api/client";
import { FreezeRequestItem, FreezeStatus } from "../types";

const STAGES: { key: FreezeStatus; label: string }[] = [
  { key: "DRAFT", label: "Draft Notice" },
  { key: "SUBPOENA_GENERATED", label: "Subpoena Issued" },
  { key: "FREEZE_REQUESTED", label: "Dispatched to VASP" },
  { key: "VASP_ACKNOWLEDGED", label: "VASP Verified" },
  { key: "ASSETS_FROZEN", label: "Assets Frozen" },
];

export default function FreezeWorkflowPage() {
  const location = useLocation();
  const [requests, setRequests] = useState<FreezeRequestItem[]>([]);
  const [selected, setSelected] = useState<FreezeRequestItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // New request modal state
  const [showNewModal, setShowNewModal] = useState(false);
  const [newWallet, setNewWallet] = useState("");
  const [newVasp, setNewVasp] = useState("Binance");
  const [newChain, setNewChain] = useState("ETH");
  const [newAmount, setNewAmount] = useState("45000");

  useEffect(() => {
    const incoming = location.state as { wallet?: string; chain?: string } | null;
    if (incoming?.wallet) {
      setNewWallet(incoming.wallet);
      if (incoming.chain) setNewChain(incoming.chain);
      setShowNewModal(true);
    }
  }, [location.state]);

  function loadRequests() {
    setLoading(true);
    fetchFreezeRequests()
      .then((res) => {
        setRequests(res.requests);
        if (res.requests.length > 0 && !selected) {
          setSelected(res.requests[0]);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function handleCreate() {
    if (!newWallet) return;
    try {
      const res = await createFreezeRequest({
        investigation_id: "MANUAL",
        case_id: "NCRP/2024/CYBER/01",
        vasp_name: newVasp,
        wallet_address: newWallet,
        chain: newChain,
        target_amount: parseFloat(newAmount) || 10000,
        currency: "USDT",
        officer_name: "Insp. Aditya Prashant Deshmukh",
        officer_badge: "CY-MH-4019",
        police_station: "Cyber Crime Unit MIT AOE",
        officer_notes: "Statutory freeze directive initiated under Section 91 CrPC / Section 94 BNSS."
      });
      setShowNewModal(false);
      loadRequests();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleAdvanceStatus(nextStatus: FreezeStatus, note: string) {
    if (!selected) return;
    try {
      await updateFreezeStatus(selected.id, nextStatus, note);
      loadRequests();
    } catch (e) {
      console.error(e);
    }
  }

  function handleCopyNotice() {
    if (!selected?.notice_body) return;
    navigator.clipboard.writeText(selected.notice_body);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  function handleDownloadTxt() {
    if (!selected) return;
    const blob = new Blob([selected.notice_body || "Statutory Freeze Notice"], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Freeze_Notice_${(selected.notice_number || "CRPC91").replace(/\//g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
        {/* Header */}
        <header className="px-8 py-5 border-b border-slate-800 bg-slate-900/60 backdrop-blur flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center">
              <Snowflake className="text-cyan-400" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold">VASP Coordination & Asset Freezing Desk</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Statutory Subpoena & Seizure directives under Section 91 CrPC / Section 94 BNSS (2023)
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all"
          >
            <Plus size={14} />
            New Statutory Freeze Notice
          </button>
        </header>

        {/* 2-Column Content */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left Column: List of Requests */}
          <div className="w-80 border-r border-slate-800 overflow-y-auto p-4 space-y-2.5 shrink-0 bg-slate-900/30">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Active Freeze Summons ({requests.length})
            </p>

            {requests.map((r) => {
              const isSel = selected?.id === r.id;
              const isFrozen = r.status === "ASSETS_FROZEN";
              return (
                <div
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSel
                      ? "bg-blue-950/40 border-blue-600"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Building2 size={13} className="text-cyan-400" />
                      {r.vasp_name}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        isFrozen
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : "bg-cyan-950 text-cyan-400 border border-cyan-800"
                      }`}
                    >
                      {r.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  <p className="text-[11px] font-mono text-slate-400 truncate mt-1">
                    {r.wallet_address}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono">
                    <span>{r.target_amount.toLocaleString()} {r.currency}</span>
                    <span>{r.chain}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Request Details & Lifecycle */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {selected ? (
              <>
                {/* Status Bar */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono">REF: {selected.notice_number}</span>
                      <h2 className="text-base font-bold text-white mt-0.5">
                        Statutory Directive to {selected.vasp_name} ({selected.target_amount.toLocaleString()} {selected.currency})
                      </h2>
                    </div>

                    <div className="flex gap-2">
                      {selected.status === "SUBPOENA_GENERATED" && (
                        <button
                          onClick={() => handleAdvanceStatus("FREEZE_REQUESTED", "Dispatched to VASP compliance portal via secure LEA bridge.")}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium"
                        >
                          <Send size={12} />
                          Dispatch Notice to VASP
                        </button>
                      )}

                      {selected.status === "FREEZE_REQUESTED" && (
                        <button
                          onClick={() => handleAdvanceStatus("VASP_ACKNOWLEDGED", "VASP compliance officer acknowledged receipt and verified wallet presence.")}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-medium"
                        >
                          <CheckCircle size={12} />
                          Log VASP Verification
                        </button>
                      )}

                      {selected.status === "VASP_ACKNOWLEDGED" && (
                        <button
                          onClick={() => handleAdvanceStatus("ASSETS_FROZEN", "Exchange debit freeze confirmed. Custodial balance locked pending court disposal.")}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium"
                        >
                          <Snowflake size={12} />
                          Confirm Assets Frozen
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 5-Step Progress Trail */}
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-800 -z-0" />
                    {STAGES.map((s, i) => {
                      const curIndex = STAGES.findIndex((st) => st.key === selected.status);
                      const isPast = curIndex >= i;
                      const isCurrent = curIndex === i;

                      return (
                        <div key={s.key} className="flex flex-col items-center gap-2 relative z-10">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isCurrent
                                ? "bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20 shadow-lg shadow-cyan-500/40"
                                : isPast
                                ? "bg-emerald-500 text-slate-950"
                                : "bg-slate-800 text-slate-500 border border-slate-700"
                            }`}
                          >
                            {isPast ? "✓" : i + 1}
                          </div>
                          <span className={`text-[10px] font-semibold whitespace-nowrap ${isPast ? "text-white" : "text-slate-500"}`}>
                            {s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Notice Text Viewer */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="text-cyan-400" size={17} />
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Section 91 CrPC / Section 94 BNSS Legal Directive Form
                      </h3>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleCopyNotice}
                        className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs border border-slate-700 transition-colors"
                      >
                        <Copy size={12} />
                        {copied ? "Copied!" : "Copy Summons"}
                      </button>

                      <button
                        onClick={handleDownloadTxt}
                        className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs border border-slate-700 transition-colors"
                      >
                        <Download size={12} />
                        Download TXT
                      </button>
                    </div>
                  </div>

                  <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                    {selected.notice_body}
                  </pre>
                </div>

                {/* Audit Trail */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Statutory Action & Compliance Audit Trail
                  </h3>
                  <div className="space-y-3">
                    {selected.audit_trail.map((entry, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs">
                        <Clock size={14} className="text-slate-500 mt-0.5 shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{entry.action}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(entry.timestamp).toLocaleString()}
                            </span>
                            <span className="text-[10px] text-blue-400 font-medium">by {entry.officer}</span>
                          </div>
                          <p className="text-slate-300 text-[11px] mt-0.5">{entry.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-slate-500">
                <Snowflake size={40} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select a freeze request to view statutory directive.</p>
              </div>
            )}
          </div>
        </div>

        {/* New Freeze Modal */}
        {showNewModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Snowflake className="text-cyan-400" size={16} />
                  Draft Section 91 CrPC Freeze Order
                </h3>
                <button onClick={() => setShowNewModal(false)} className="text-slate-500 hover:text-white text-sm">✕</button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Target Exchange / VASP</label>
                  <select
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                    value={newVasp}
                    onChange={(e) => setNewVasp(e.target.value)}
                  >
                    <option value="Binance">Binance (Cayman Islands)</option>
                    <option value="WazirX">WazirX (India FIU-IND RE-0019)</option>
                    <option value="CoinDCX">CoinDCX (India FIU-IND RE-0024)</option>
                    <option value="OKX">OKX (Seychelles)</option>
                    <option value="Coinbase">Coinbase (United States)</option>
                    <option value="KuCoin">KuCoin (Seychelles)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Target Wallet / Deposit Address</label>
                  <input
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                    value={newWallet}
                    onChange={(e) => setNewWallet(e.target.value)}
                    placeholder="0x..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Blockchain Network</label>
                    <input
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                      value={newChain}
                      onChange={(e) => setNewChain(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Seizure Amount (USDT)</label>
                    <input
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                >
                  Generate Statutory Notice
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
