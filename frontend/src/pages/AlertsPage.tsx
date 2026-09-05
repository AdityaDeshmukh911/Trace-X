import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BellRing, AlertTriangle, ShieldAlert, CheckCircle2, 
  ArrowUpRight, Snowflake, Filter, Clock, RefreshCw 
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { fetchAlerts, updateAlertStatus } from "../api/client";
import { AlertItem, Severity } from "../types";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "CRITICAL" | "HIGH" | "UNREAD">("ALL");
  const [actioningId, setActioningId] = useState<string | null>(null);
  const navigate = useNavigate();

  function loadAlerts() {
    setLoading(true);
    fetchAlerts(100)
      .then((res) => setAlerts(res.alerts))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAlerts();
    const timer = setInterval(loadAlerts, 15000); // 15s poll
    return () => clearInterval(timer);
  }, []);

  async function handleAcknowledge(alertId: string) {
    setActioningId(alertId);
    try {
      await updateAlertStatus(alertId, "ACKNOWLEDGED");
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, status: "ACKNOWLEDGED" } : a))
      );
    } catch (e) {
      console.error(e);
    } finally {
      setActioningId(null);
    }
  }

  function handleInvestigate(wallet: string, chain: string) {
    navigate("/", { state: { wallet, chain } });
  }

  function handleInitiateFreeze(wallet: string, chain: string) {
    navigate("/freeze", { state: { wallet, chain } });
  }

  const filtered = alerts.filter((a) => {
    if (filter === "CRITICAL") return a.severity === "CRITICAL";
    if (filter === "HIGH") return a.severity === "HIGH";
    if (filter === "UNREAD") return a.status === "UNREAD";
    return true;
  });

  const criticalCount = alerts.filter((a) => a.severity === "CRITICAL").length;
  const unreadCount = alerts.filter((a) => a.status === "UNREAD").length;

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
        {/* Header */}
        <header className="px-8 py-5 border-b border-slate-800 bg-slate-900/60 backdrop-blur flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800 flex items-center justify-center">
              <BellRing className="text-red-400" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold">Real-Time Threat Incident Center</h1>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated threat intelligence feed triggered on high risk, mixers, and OFAC anomalies
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAlerts}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </header>

        {/* Metric strip */}
        <div className="grid grid-cols-4 gap-4 px-8 py-4 border-b border-slate-800/80 bg-slate-900/30 shrink-0">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Incidents</p>
              <p className="text-xl font-bold font-mono text-white mt-0.5">{alerts.length}</p>
            </div>
            <ShieldAlert size={22} className="text-slate-500" />
          </div>

          <div className="bg-red-950/20 border border-red-900/60 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-red-400 uppercase font-semibold">Critical Threat Alerts</p>
              <p className="text-xl font-bold font-mono text-red-400 mt-0.5">{criticalCount}</p>
            </div>
            <AlertTriangle size={22} className="text-red-400" />
          </div>

          <div className="bg-amber-950/20 border border-amber-900/60 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-amber-400 uppercase font-semibold">Unread Alerts</p>
              <p className="text-xl font-bold font-mono text-amber-400 mt-0.5">{unreadCount}</p>
            </div>
            <Clock size={22} className="text-amber-400" />
          </div>

          <div className="bg-emerald-950/20 border border-emerald-900/60 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-emerald-400 uppercase font-semibold">Actioned / Acknowledged</p>
              <p className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                {alerts.filter((a) => a.status !== "UNREAD").length}
              </p>
            </div>
            <CheckCircle2 size={22} className="text-emerald-400" />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-8 py-3 flex items-center gap-2 border-b border-slate-800/60 shrink-0">
          <Filter size={13} className="text-slate-500 mr-1" />
          <span className="text-xs text-slate-400 font-medium mr-2">Filter By:</span>
          {[
            { key: "ALL", label: `All Alerts (${alerts.length})` },
            { key: "CRITICAL", label: `Critical (${criticalCount})` },
            { key: "HIGH", label: `High Risk (${alerts.filter((a) => a.severity === "HIGH").length})` },
            { key: "UNREAD", label: `Unread (${unreadCount})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filter === key
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto px-8 py-5 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <CheckCircle2 size={36} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No alerts matching current filter.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const isCrit = item.severity === "CRITICAL";
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCrit
                      ? "bg-red-950/20 border-red-900/60 hover:border-red-700"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isCrit
                              ? "bg-red-950 text-red-400 border border-red-800"
                              : "bg-amber-950 text-amber-400 border border-amber-800"
                          }`}
                        >
                          {item.severity}
                        </span>

                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                          {item.chain}
                        </span>

                        <span className="text-xs font-mono font-bold text-white">
                          Risk: {item.risk_score}/100
                        </span>

                        {item.status === "UNREAD" ? (
                          <span className="text-[9px] bg-blue-950 text-blue-400 border border-blue-800 px-1.5 py-0.2 rounded font-bold">
                            NEW
                          </span>
                        ) : (
                          <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">
                            {item.status}
                          </span>
                        )}

                        <span className="text-[11px] text-slate-500 ml-auto">
                          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed mb-2.5">{item.message}</p>

                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                        <span className="text-slate-500">Suspect Wallet:</span>
                        <span className="text-slate-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 truncate max-w-sm">
                          {item.wallet_address}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button
                        onClick={() => handleInvestigate(item.wallet_address, item.chain)}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        Deep Trace
                        <ArrowUpRight size={13} />
                      </button>

                      <button
                        onClick={() => handleInitiateFreeze(item.wallet_address, item.chain)}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
                      >
                        <Snowflake size={13} />
                        Freeze Notice
                      </button>

                      {item.status === "UNREAD" && (
                        <button
                          onClick={() => handleAcknowledge(item.id)}
                          disabled={actioningId === item.id}
                          className="px-3 py-1 text-[11px] text-slate-400 hover:text-slate-200 text-center transition-colors"
                        >
                          Mark Acknowledged
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
