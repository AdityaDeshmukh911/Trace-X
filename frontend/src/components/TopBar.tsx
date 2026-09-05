import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, RefreshCw, CheckCircle2, ShieldCheck, 
  BellRing, AlertTriangle, ArrowRight, ExternalLink 
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { ncrpStats, sahyogSync, fetchAlerts } from "../api/client";
import { AlertItem } from "../types";

interface NcrpStats {
  total_complaints_2024: number;
  crypto_fraud_cases: number;
  freeze_requests_sent?: number;
  amount_frozen_inr?: string;
  vasp_subpoenas_issued?: number;
  critical_incidents?: number;
  avg_trace_time_seconds?: number;
}

const QUICK_WALLETS = [
  { label: "Task Scam (ETH)",        addr: "0xFraud_Origin_Task_Scam", chain: "ETH" },
  { label: "Pig Butchering (TRX)",   addr: "0xPigButcher_Main",        chain: "TRX" },
  { label: "Telegram Job Scam (ETH)",addr: "0xTelegram_Job_Scam_Origin", chain: "ETH" },
  { label: "Ransomware (BTC)",       addr: "0xRansomWallet_BTC",       chain: "BTC" }
];

interface Props {
  chain: string;
  setChain: (c: string) => void;
  wallet: string;
  setWallet: (w: string) => void;
  loading: boolean;
  onTrace: (addr?: string, chainOverride?: string) => void;
}

export default function TopBar({ chain, setChain, wallet, setWallet, loading, onTrace }: Props) {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [stats, setStats]           = useState<NcrpStats | null>(null);
  const [syncing, setSyncing]       = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [alerts, setAlerts]         = useState<AlertItem[]>([]);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  useEffect(() => {
    ncrpStats()
      .then(setStats)
      .catch(() => setStats(null));

    fetchAlerts(5)
      .then((res) => setAlerts(res.alerts))
      .catch(() => {});
  }, []);

  async function handleSahyogSync() {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await sahyogSync();
      setSyncResult(`${res.matches_found} matches / ${res.records_checked.toLocaleString()} records`);
    } catch {
      setSyncResult("Sync failed");
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncResult(null), 4000);
    }
  }

  const unreadCount = alerts.filter((a) => a.status === "UNREAD").length;

  return (
    <header className="border-b border-white/[0.07] bg-[#0A0D15]/95 backdrop-blur-xl shrink-0 relative z-30 font-sans select-none">
      {/* ── Status strip: NCRP stats + SAHYOG + Alerts ── */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-white/[0.05] text-[11px] bg-[#0C101A]/40">
        <div className="flex items-center gap-5 overflow-x-auto">
          {stats ? (
            <>
              <span className="text-slate-500 whitespace-nowrap">
                NCRP 2024: <span className="text-slate-200 font-mono font-bold">{stats.total_complaints_2024.toLocaleString()}</span>
              </span>
              <span className="text-slate-500 whitespace-nowrap">
                Crypto Fraud: <span className="text-amber-400 font-mono font-bold">{stats.crypto_fraud_cases.toLocaleString()}</span>
              </span>
              {stats.amount_frozen_inr && (
                <span className="text-slate-500 whitespace-nowrap">
                  Seized/Frozen: <span className="text-emerald-400 font-mono font-bold">{stats.amount_frozen_inr}</span>
                </span>
              )}
              {stats.vasp_subpoenas_issued !== undefined && (
                <span className="text-slate-500 whitespace-nowrap hidden lg:inline">
                  Sec 91 Summons: <span className="text-teal-400 font-mono font-bold">{stats.vasp_subpoenas_issued}</span>
                </span>
              )}
            </>
          ) : (
            <span className="text-slate-500 font-mono text-[10px]">Connecting to NCRP Telemetry...</span>
          )}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={handleSahyogSync}
            disabled={syncing}
            className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 disabled:opacity-60 transition-colors text-[11px]"
            title="Synchronize with Ministry of Home Affairs SAHYOG Portal"
          >
            {syncing ? <RefreshCw size={12} className="animate-spin text-emerald-400" /> : <ShieldCheck size={13} className="text-emerald-500" />}
            <span className="font-semibold">{syncing ? "Syncing SAHYOG..." : "MHA SAHYOG Sync"}</span>
          </button>

          {syncResult && (
            <span className="flex items-center gap-1 text-emerald-400 font-mono text-[10px] bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
              <CheckCircle2 size={11} /> {syncResult}
            </span>
          )}

          {/* Alert Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationMenu(!showNotificationMenu)}
              className="relative p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Threat Alerts"
            >
              <BellRing size={15} className={unreadCount > 0 ? "text-amber-400 animate-pulse" : ""} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-obsidian-950 rounded-full text-[9px] font-mono font-extrabold flex items-center justify-center shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotificationMenu && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-[#0B0F17] border border-white/[0.1] rounded-2xl shadow-2xl p-3.5 z-50 backdrop-blur-2xl">
                <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/[0.08]">
                  <span className="text-xs font-bold text-white tracking-wide">Live Threat Incidents</span>
                  <button
                    onClick={() => { setShowNotificationMenu(false); navigate("/alerts"); }}
                    className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    View All ({alerts.length})
                    <ArrowRight size={10} />
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {alerts.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => { setShowNotificationMenu(false); navigate("/alerts"); }}
                      className="p-2.5 bg-[#101522]/80 rounded-xl border border-white/[0.06] hover:border-emerald-500/40 cursor-pointer transition-colors text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded ${
                          a.severity === "CRITICAL" 
                            ? "bg-red-950/60 text-red-400 border border-red-800/50" 
                            : "bg-amber-950/60 text-amber-400 border border-amber-800/50"
                        }`}>
                          {a.severity}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Risk {a.risk_score}</span>
                      </div>
                      <p className="text-white text-[11px] font-medium truncate">{a.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Search & Preset Bar ── */}
      <div className="flex items-center gap-3 px-6 py-3">
        {/* Preset chips */}
        <div className="hidden xl:flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-slate-500 uppercase font-mono font-bold mr-1">Suspect Presets:</span>
          {QUICK_WALLETS.map((q) => (
            <button
              key={q.addr}
              onClick={() => {
                setWallet(q.addr);
                setChain(q.chain);
                onTrace(q.addr, q.chain);
              }}
              className="px-2.5 py-1 text-[11px] rounded-lg bg-[#111624] text-slate-300 hover:bg-emerald-950/40 hover:text-emerald-300 hover:border-emerald-500/40 border border-white/[0.07] transition-all font-mono flex items-center gap-1.5"
            >
              <span className={`text-[9px] font-bold px-1 rounded ${
                q.chain === "ETH" ? "bg-cyan-950 text-cyan-400 border border-cyan-800/50" :
                q.chain === "TRX" ? "bg-red-950 text-red-400 border border-red-800/50" :
                "bg-amber-950 text-amber-400 border border-amber-800/50"
              }`}>{q.chain}</span>
              <span>{q.label.replace(` (${q.chain})`, "")}</span>
            </button>
          ))}
        </div>

        {/* Trace input */}
        <div className="flex-1 flex items-center gap-2">
          {/* Chain Selector */}
          <select
            value={chain}
            onChange={(e) => setChain(e.target.value)}
            disabled={loading}
            className="bg-[#111624] border border-white/[0.09] text-xs font-mono font-bold text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 shrink-0 cursor-pointer transition-all"
          >
            <option value="ETH">ETH (Ethereum Mainnet)</option>
            <option value="TRX">TRX (TRON TRC20)</option>
            <option value="BTC">BTC (Bitcoin UTXO)</option>
          </select>

          {/* Wallet address */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              className="w-full bg-[#111624] border border-white/[0.09] rounded-xl pl-9 pr-4 py-2.5 font-mono text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
              placeholder="Enter suspect wallet address or transaction hash to trace (e.g. 0xFraud_Origin_Task_Scam)..."
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) onTrace();
              }}
            />
          </div>

          {/* Investigate action */}
          <button
            onClick={() => onTrace()}
            disabled={loading || !wallet.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-[0_0_20px_-3px_rgba(16,185,129,0.35)] transition-all shrink-0 flex items-center gap-2"
          >
            {loading ? <RefreshCw size={13} className="animate-spin" /> : <Search size={13} />}
            {loading ? "Tracing Graph..." : "Investigate →"}
          </button>
        </div>
      </div>
    </header>
  );
}
