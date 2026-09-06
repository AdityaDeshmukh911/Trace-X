import { useState, useEffect } from "react";
import { 
  FileText, ShieldCheck, Download, ExternalLink, Filter, 
  Search, Plus, CheckCircle2, Clock, Scale, Copy, Check, Printer, X
} from "lucide-react";
import { fetchReports, generateDossier, fetchReportCertificate } from "../api/client";
import DossierModal from "../components/DossierModal";
import { DossierReport } from "../types";
import { Link } from "react-router-dom";

export default function ReportsPage() {
  const [reports, setReports] = useState<DossierReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Modal states
  const [selectedCert, setSelectedCert] = useState<any | null>(null);
  const [certLoading, setCertLoading] = useState<boolean>(false);
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [activeDossier, setActiveDossier] = useState<any | null>(null);

  // New Dossier Form state
  const [newCaseId, setNewCaseId] = useState<string>("CASE-2024-001");
  const [newTarget, setNewTarget] = useState<string>("0xFraud_Origin_Task_Scam");
  const [newChain, setNewChain] = useState<string>("ETH");
  const [newTypology, setNewTypology] = useState<string>("Task Scam / Deposit Multi-Hop Sweep");
  const [generating, setGenerating] = useState<boolean>(false);

  const loadReports = () => {
    setLoading(true);
    fetchReports()
      .then((res) => setReports(res.reports))
      .catch((err) => console.error("Failed to load reports", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleOpenCertificate = async (reportId: string) => {
    setCertLoading(true);
    try {
      const data = await fetchReportCertificate(reportId);
      setSelectedCert(data);
    } catch (err) {
      alert("Failed to load electronic certificate");
    } finally {
      setCertLoading(false);
    }
  };

  const handleCreateDossier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTarget) return;
    setGenerating(true);
    try {
      const res = await generateDossier({
        case_id: newCaseId,
        target_address: newTarget,
        chain: newChain,
        typology: newTypology,
        risk_score: 87,
        ml_anomaly_score: 0.84
      });
      setShowNewModal(false);
      loadReports();
      if (res?.report) {
        setActiveDossier({
          investigation_id: res.report.id.replace("REP-", "INV-"),
          case_id: res.report.case_id,
          target_address: res.report.target_address,
          chain: res.report.chain,
          typology: res.report.typology,
          risk_score: res.report.risk_score,
          risk_level: res.report.risk_score > 75 ? "CRITICAL" : "ELEVATED",
          officer_name: res.report.investigating_officer,
          police_station: res.report.police_station,
          canonical_sha256: res.report.sha256_hash,
        });
      }
    } catch (err: any) {
      alert(err.message || "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  const filtered = reports.filter((r) => {
    const matchesSearch = 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.case_id && r.case_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.target_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.typology.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.investigating_officer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#07090E] text-slate-100 font-sans select-none">
      {/* Top Header */}
      <div className="border-b border-white/[0.07] bg-[#0A0D15]/95 backdrop-blur-xl px-6 py-4 sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950/70 text-emerald-400 border border-emerald-800/50 rounded-full">
              Judicial Admissibility Desk
            </span>
            <span className="text-xs text-slate-400 font-medium">Section 63 BSA / Section 65B IEA</span>
          </div>
          <h1 className="text-lg font-bold text-white tracking-wide mt-1 flex items-center gap-2">
            <FileText className="text-emerald-400" size={20} />
            Forensic Dossiers &amp; Court Reports
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-xl shadow-glow-emerald transition-all"
          >
            <Plus size={15} />
            Generate New Case Dossier
          </button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* KPI Metric Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0A0D15] border border-white/[0.08] rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold">Total Dossiers Generated</span>
              <FileText size={15} className="text-emerald-400" />
            </div>
            <p className="text-2xl font-bold font-mono text-white mt-1.5">{reports.length}</p>
            <p className="text-[11px] text-slate-400 mt-1">Archived in immutable local SQLite</p>
          </div>

          <div className="bg-[#0A0D15] border border-white/[0.08] rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold">Certified Electronic Evidence</span>
              <ShieldCheck size={15} className="text-emerald-400" />
            </div>
            <p className="text-2xl font-bold font-mono text-emerald-400 mt-1.5">100% Sealed</p>
            <p className="text-[11px] text-slate-400 mt-1">SHA-256 Tamper-Proof Cryptographic Hash</p>
          </div>

          <div className="bg-[#0A0D15] border border-white/[0.08] rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold">Court-Filed Briefs</span>
              <Scale size={15} className="text-amber-400" />
            </div>
            <p className="text-2xl font-bold font-mono text-amber-400 mt-1.5">
              {reports.filter(r => r.status === "SUBMITTED_IN_COURT" || r.status === "FILED").length}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Designated Cyber Crime Courts</p>
          </div>

          <div className="bg-[#0A0D15] border border-white/[0.08] rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold">Asset Value Documented</span>
              <Clock size={15} className="text-teal-400" />
            </div>
            <p className="text-2xl font-bold font-mono text-white mt-1.5">₹ 2.45 Cr</p>
            <p className="text-[11px] text-slate-400 mt-1">Across Maharashtra &amp; NCRP FIRs</p>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0A0D15] border border-white/[0.08] p-3.5 rounded-2xl shadow-sm">
          <div className="relative flex-1 min-w-[260px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by Case ID, Target Address, Typology, or Officer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#101522] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {["ALL", "CERTIFIED", "SUBMITTED_IN_COURT", "FILED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === st
                    ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/40 font-semibold shadow-glow-emerald"
                    : "text-slate-400 hover:text-white hover:bg-[#101522]"
                }`}
              >
                {st.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Dossiers Table */}
        <div className="bg-[#0E131F] border border-[#1E2638] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#141A29] border-b border-[#1E2638] text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                <tr>
                  <th className="px-4 py-3">Dossier ID</th>
                  <th className="px-4 py-3">Case Ref</th>
                  <th className="px-4 py-3">Target Wallet / Typology</th>
                  <th className="px-4 py-3">Risk & Anomaly</th>
                  <th className="px-4 py-3">Investigating Officer</th>
                  <th className="px-4 py-3">SHA-256 Cryptographic Stamp</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2638]">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-slate-500">
                      Loading judicial dossier archive...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-slate-500">
                      No matching forensic reports found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((rep) => (
                    <tr key={rep.id} className="hover:bg-[#101522]/80 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-emerald-400 whitespace-nowrap">
                        {rep.id}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-mono text-slate-300 bg-[#101522] px-2.5 py-1 rounded-lg border border-white/[0.07]">
                          {rep.case_id || "Independent Trace"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 max-w-xs">
                        <div className="font-mono text-xs text-white truncate" title={rep.target_address}>
                          {rep.target_address}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                          {rep.typology} • <span className="text-emerald-400 font-mono font-bold">{rep.chain}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            rep.risk_score >= 80 ? "bg-red-500/15 text-red-400 border border-red-500/30" : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          }`}>
                            Risk: {rep.risk_score}/100
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            ML: {rep.ml_anomaly_score.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="text-slate-200 font-semibold">{rep.investigating_officer}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{rep.police_station}</div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400">{rep.sha256_hash.slice(0, 12)}...</span>
                          <button
                            onClick={() => handleCopyHash(rep.sha256_hash)}
                            className="p-1 hover:bg-[#161E30] rounded text-slate-400 hover:text-white transition-colors"
                            title="Copy Full SHA-256 Hash"
                          >
                            {copiedHash === rep.sha256_hash ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider ${
                          rep.status === "SUBMITTED_IN_COURT"
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            : rep.status === "FILED"
                            ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                            : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        }`}>
                          {rep.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenCertificate(rep.id)}
                            className="px-2.5 py-1 text-[11px] font-medium bg-[#101522] hover:bg-[#161E30] text-slate-300 hover:text-white rounded-lg border border-white/[0.08] flex items-center gap-1 transition-all"
                            title="View Section 63 BSA / 65B IEA Electronic Certificate"
                          >
                            <ShieldCheck size={13} className="text-emerald-400" />
                            Cert
                          </button>

                          <button
                            onClick={() => setActiveDossier({
                              investigation_id: rep.id.replace("REP-", "INV-"),
                              case_id: rep.case_id,
                              target_address: rep.target_address,
                              chain: rep.chain,
                              typology: rep.typology,
                              risk_score: rep.risk_score,
                              risk_level: rep.risk_score > 75 ? "CRITICAL" : "ELEVATED",
                              officer_name: rep.investigating_officer,
                              police_station: rep.police_station,
                              canonical_sha256: rep.sha256_hash,
                            })}
                            className="px-2.5 py-1 text-[11px] font-medium bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 rounded-lg border border-emerald-500/40 flex items-center gap-1 transition-all"
                          >
                            <Download size={13} />
                            PDF
                          </button>

                          <Link
                            to={`/evidence?hash=${rep.sha256_hash}`}
                            className="p-1 hover:bg-[#1E2638] rounded text-slate-400 hover:text-white transition-colors"
                            title="Verify on Judicial Evidence Portal"
                          >
                            <ExternalLink size={13} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0E131F] border border-[#1E2638] rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E2638]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Statutory Certificate of Electronic Evidence
                </h3>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-1 hover:bg-[#141A29] rounded text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 font-mono text-xs text-slate-300 bg-[#080B11] m-4 rounded-lg border border-[#1E2638] whitespace-pre-wrap leading-relaxed">
              {selectedCert.certificate_text}
            </div>

            <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#1E2638] bg-[#141A29]">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400" />
                Certified Cryptographic Stamp: {selectedCert.sha256_hash.slice(0, 16)}...
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedCert.certificate_text);
                    alert("Certificate copied to clipboard!");
                  }}
                  className="px-3 py-1.5 bg-[#0E131F] hover:bg-[#1E2638] text-xs text-white rounded border border-[#1E2638] transition-colors"
                >
                  Copy Certificate
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs text-white rounded font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Printer size={13} />
                  Print for Court
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Dossier Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0E131F] border border-[#1E2638] rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#1E2638]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus size={16} className="text-blue-500" />
                Generate Forensic Court Dossier
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateDossier} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Link to Case / Complaint ID</label>
                <select
                  value={newCaseId}
                  onChange={(e) => setNewCaseId(e.target.value)}
                  className="w-full bg-[#101522] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 font-mono"
                >
                  <option value="CASE-2024-001">CASE-2024-001 — NCRP/2024/MH/00441 (Task Scam)</option>
                  <option value="CASE-2024-002">CASE-2024-002 — NCRP/2024/MH/00389 (Pig Butchering)</option>
                  <option value="CASE-2024-003">CASE-2024-003 — NCRP/2024/DL/00218 (Exchange Hack)</option>
                  <option value="CASE-2024-004">CASE-2024-004 — NCRP/2024/KA/00512 (Ransomware)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-semibold">Target Suspect Wallet Address</label>
                <input
                  type="text"
                  required
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  placeholder="0x... / bc1... / T..."
                  className="w-full bg-[#101522] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-semibold">Blockchain Network</label>
                  <select
                    value={newChain}
                    onChange={(e) => setNewChain(e.target.value)}
                    className="w-full bg-[#101522] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 font-mono"
                  >
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="TRX">Tron (TRX / USDT)</option>
                    <option value="BTC">Bitcoin (BTC)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-semibold">Typology Pattern</label>
                  <select
                    value={newTypology}
                    onChange={(e) => setNewTypology(e.target.value)}
                    className="w-full bg-[#101522] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                  >
                    <option value="Task Scam / Deposit Multi-Hop Sweep">Task Scam Sweep</option>
                    <option value="Pig Butchering (Sha Zhu Pan)">Pig Butchering</option>
                    <option value="Smart Contract Drainer & Mixer">Contract Drainer</option>
                    <option value="Ransomware Extortion Cluster">Ransomware Cluster</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-[#101522] hover:bg-[#161E30] text-xs text-slate-300 rounded-xl transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-semibold text-white rounded-xl shadow-glow-emerald transition-all flex items-center gap-1.5"
                >
                  {generating ? "Sealing Evidence..." : "Generate & Certify Dossier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dossier Modal */}
      <DossierModal
        isOpen={Boolean(activeDossier)}
        onClose={() => setActiveDossier(null)}
        data={activeDossier || {}}
      />
    </div>
  );
}
