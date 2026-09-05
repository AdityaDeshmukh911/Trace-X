import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderOpen, AlertTriangle, Clock, CheckCircle, ArrowRight, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { fetchCases } from "../api/client";
import { Case, CaseStatus } from "../types";

const STATUS_BADGE: Record<CaseStatus, { label: string; cls: string }> = {
  ACTIVE:  { label: "ACTIVE",  cls: "bg-red-950 text-red-400 border-red-800" },
  PENDING: { label: "PENDING", cls: "bg-amber-950 text-amber-400 border-amber-800" },
  CLOSED:  { label: "CLOSED",  cls: "bg-slate-800 text-slate-400 border-slate-700" },
};

const STATUS_ICON: Record<CaseStatus, React.ReactNode> = {
  ACTIVE:  <AlertTriangle size={12} className="text-red-400" />,
  PENDING: <Clock size={12} className="text-amber-400" />,
  CLOSED:  <CheckCircle size={12} className="text-slate-400" />,
};

function riskColor(score: number) {
  if (score > 75) return "text-red-400";
  if (score > 55) return "text-amber-400";
  return "text-emerald-400";
}

export default function CaseListPage() {
  const [cases,   setCases]   = useState<Case[]>([]);
  const [search,  setSearch]  = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCases()
      .then((r) => setCases(r.cases))
      .catch(() => setCases([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = cases.filter(
    (c) =>
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.suspect_wallet.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderOpen size={22} className="text-blue-400" />
            <div>
              <h1 className="text-lg font-bold">Case Management</h1>
              <p className="text-slate-500 text-xs">NCRP-linked investigations · {cases.length} total</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-64">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              className="w-full bg-slate-800 border border-slate-700 text-sm text-white pl-8 pr-3 py-2 rounded-xl
                         focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
              placeholder="Search cases…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Active Cases",   value: cases.filter(c => c.status === "ACTIVE").length,  color: "text-red-400" },
            { label: "Pending Review", value: cases.filter(c => c.status === "PENDING").length, color: "text-amber-400" },
            { label: "Closed",         value: cases.filter(c => c.status === "CLOSED").length,  color: "text-slate-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4">
              <p className="text-slate-500 text-xs">{label}</p>
              <p className={`text-2xl font-bold font-mono mt-1 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Cases table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr_auto] text-[10px] text-slate-500 uppercase tracking-wider px-5 py-3 border-b border-slate-800 font-semibold">
            <span>Case / Complaint</span>
            <span>Category</span>
            <span>Status</span>
            <span>Risk Score</span>
            <span>Loss (INR)</span>
            <span>Investigator</span>
            <span />
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-600 text-sm">Loading cases…</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-600 text-sm">No cases match your search.</div>
          ) : (
            filtered.map((c, i) => {
              const { label: sLabel, cls: sCls } = STATUS_BADGE[c.status];
              return (
                <div
                  key={c.id}
                  className={`grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr_auto] items-center px-5 py-4 cursor-pointer
                    hover:bg-slate-800/50 transition-colors
                    ${i < filtered.length - 1 ? "border-b border-slate-800" : ""}`}
                  onClick={() => navigate("/", { state: { wallet: c.suspect_wallet, chain: c.chain } })}
                >
                  <div>
                    <p className="text-white text-sm font-semibold">{c.id}</p>
                    <p className="text-slate-500 text-[10px] font-mono mt-0.5">{c.complaint_id}</p>
                  </div>
                  <div>
                    <p className="text-slate-300 text-xs">{c.category}</p>
                    <p className="text-slate-600 text-[10px] font-mono mt-0.5 truncate">
                      {c.suspect_wallet.slice(0, 16)}…
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {STATUS_ICON[c.status]}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${sCls}`}>
                      {sLabel}
                    </span>
                  </div>
                  <p className={`text-sm font-bold font-mono ${riskColor(c.risk_score)}`}>
                    {c.risk_score}
                  </p>
                  <p className="text-slate-300 text-xs">
                    ₹ {(c.victim_loss_inr / 100000).toFixed(1)}L
                  </p>
                  <p className="text-slate-400 text-xs truncate">{c.investigator.split(" ").slice(-1)}</p>
                  <ArrowRight size={14} className="text-slate-600" />
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
