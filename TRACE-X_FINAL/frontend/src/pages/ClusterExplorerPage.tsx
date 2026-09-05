import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GitBranch, Shield, ArrowUpRight, Search, Copy, Check, Users, Network } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { fetchClusters } from "../api/client";
import { ClusterInfo } from "../types";

export default function ClusterExplorerPage() {
  const [clusters, setClusters] = useState<ClusterInfo[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ClusterInfo | null>(null);
  const [copiedAddr, setCopiedAddr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClusters()
      .then((res) => {
        setClusters(res.clusters);
        if (res.clusters.length > 0) setSelected(res.clusters[0]);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  function handleTrace(addr: string) {
    navigate("/", { state: { wallet: addr } });
  }

  function handleCopy(addr: string) {
    navigator.clipboard.writeText(addr);
    setCopiedAddr(addr);
    setTimeout(() => setCopiedAddr(null), 2000);
  }

  const filtered = clusters.filter(
    (c) =>
      c.cluster_label.toLowerCase().includes(search.toLowerCase()) ||
      c.cluster_id.toLowerCase().includes(search.toLowerCase()) ||
      c.member_addresses.some((a) => a.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
        {/* Header */}
        <header className="px-8 py-5 border-b border-slate-800 bg-slate-900/60 backdrop-blur flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800 flex items-center justify-center">
              <Network className="text-purple-400" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold">Wallet Clustering & Sybil Ring Explorer</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Heuristic entity attribution: Bitcoin Common-Input Co-Spend & EVM Deposit Sweep grouping
              </p>
            </div>
          </div>

          <div className="relative w-64">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              placeholder="Search clusters or addresses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* 2-Column Explorer */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left: Cluster List */}
          <div className="w-84 border-r border-slate-800 overflow-y-auto p-4 space-y-2.5 shrink-0 bg-slate-900/30">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Discovered Clusters ({filtered.length})
            </p>

            {filtered.map((c) => {
              const isSel = selected?.cluster_id === c.cluster_id;
              const isHigh = c.risk_score >= 75;
              return (
                <div
                  key={c.cluster_id}
                  onClick={() => setSelected(c)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSel
                      ? "bg-purple-950/40 border-purple-600"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white truncate max-w-[180px]">
                      {c.cluster_label}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                        isHigh
                          ? "bg-red-950 text-red-400 border border-red-800"
                          : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      }`}
                    >
                      Risk {c.risk_score}
                    </span>
                  </div>

                  <p className="text-[10px] text-purple-400 font-mono mt-0.5">
                    {c.cluster_id}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <Users size={12} className="text-slate-500" />
                      {c.address_count} addresses
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Conf: {Math.round(c.confidence * 100)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Cluster Detail */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {selected ? (
              <>
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xs font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
                        {selected.cluster_id}
                      </span>
                      <h2 className="text-base font-bold text-white mt-1.5">{selected.cluster_label}</h2>
                      <p className="text-xs text-slate-400 mt-0.5">{selected.description}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Attribution Heuristic</div>
                      <span className="text-xs text-blue-300 font-medium">{selected.heuristic}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] block uppercase">Entity Classification</span>
                      <span className="text-white font-semibold font-mono">{selected.entity_type}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block uppercase">Mathematical Confidence</span>
                      <span className="text-emerald-400 font-bold font-mono">{Math.round(selected.confidence * 100)}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block uppercase">Associated Wallets</span>
                      <span className="text-white font-bold font-mono">{selected.address_count} Nodes</span>
                    </div>
                  </div>
                </div>

                {/* Member Wallets Table */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                    Clustered Member Addresses ({selected.member_addresses.length})
                  </h3>

                  <div className="space-y-2">
                    {selected.member_addresses.map((addr, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-400">
                            {idx + 1}
                          </span>
                          <span className="font-mono text-xs text-slate-200">{addr}</span>
                          {idx === 0 && (
                            <span className="text-[9px] bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.2 rounded font-bold">
                              PRIMARY HUB
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(addr)}
                            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 rounded-lg transition-colors"
                            title="Copy address"
                          >
                            {copiedAddr === addr ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                          </button>

                          <button
                            onClick={() => handleTrace(addr)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-600/30 rounded-lg text-xs font-medium transition-colors"
                          >
                            Trace
                            <ArrowUpRight size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-slate-500">
                <Network size={40} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select a cluster to inspect member addresses.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
