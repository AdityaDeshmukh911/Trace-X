import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  UploadCloud, FileSpreadsheet, Download, CheckCircle2, 
  AlertTriangle, ArrowRight, Play, RefreshCw, Layers 
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { ingestCsv, downloadCsvTemplateFile, fetchIngestBatches } from "../api/client";
import { IngestBatch } from "../types";

const MOCK_NCRP_CSV = `complaint_id,wallet_address,chain,category,victim_loss_inr,victim_name,investigator
NCRP/2024/MH/00911,0xFraud_Origin_Task_Scam,ETH,Task Scam - Crypto,1250000,Rajesh Kumar,Insp. Aditya Prashant Deshmukh
NCRP/2024/KA/00742,0xPigButcher_Main,TRX,Investment Fraud - Pig Butchering,4500000,Anita Desai,Insp. Aditya Prashant Deshmukh
NCRP/2024/DL/00431,0xRugPull_Dev,ETH,Exchange Hack - Rug Pull,12000000,Virendra Sachdeva,SP Priya Nair
NCRP/2024/GJ/00519,0xTelegram_Job_Scam_Origin,ETH,Telegram Task Fraud,1850000,Sunil Mehta,SI Rohit Verma
NCRP/2024/TN/00688,0xFedEx_Impersonation_TRX,TRX,Digital Arrest Police Extortion,3200000,Dr. S. Venkat,Insp. K. Raman
`;

export default function IngestionPage() {
  const [csvText, setCsvText] = useState("");
  const [batches, setBatches] = useState<IngestBatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  function loadBatches() {
    fetchIngestBatches()
      .then((res) => setBatches(res.batches))
      .catch((e) => console.error(e));
  }

  useEffect(() => {
    loadBatches();
  }, []);

  async function handleProcess(textToProcess = csvText) {
    if (!textToProcess.trim()) {
      setError("Please paste or upload CSV complaints data.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await ingestCsv(textToProcess, "NCRP Police Intake Batch");
      setResult(res.batch);
      loadBatches();
    } catch (e: any) {
      setError(e?.message || "Batch processing failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleLoadPreset() {
    setCsvText(MOCK_NCRP_CSV);
    setError(null);
  }

  function handleTraceWallet(wallet: string, chain: string) {
    navigate("/", { state: { wallet, chain } });
  }

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
        {/* Header */}
        <header className="px-8 py-5 border-b border-slate-800 bg-slate-900/60 backdrop-blur flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800 flex items-center justify-center">
              <UploadCloud className="text-blue-400" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold">Bulk Complaint Ingestion Hub</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Ingest hundreds of wallet addresses from NCRP, State Cyber Cells, or bank fraud CSV feeds with automated queue tracing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={downloadCsvTemplateFile}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
            >
              <Download size={13} />
              CSV Template
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* Uploader Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="text-blue-400" size={18} />
                <h2 className="text-sm font-bold text-white uppercase tracking-wide">
                  Complaint Data Input (CSV / NCRP Format)
                </h2>
              </div>
              <button
                type="button"
                onClick={handleLoadPreset}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium underline"
              >
                Load Sample NCRP Batch (5 cases)
              </button>
            </div>

            <textarea
              className="w-full h-36 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 focus:outline-none focus:border-blue-500 placeholder:text-slate-600 leading-relaxed"
              placeholder="Paste CSV complaints with headers: complaint_id, wallet_address, chain, category, victim_loss_inr, victim_name..."
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
            />

            {error && (
              <div className="mt-3 p-3 bg-red-950/40 border border-red-800 rounded-xl text-xs text-red-400 flex items-center gap-2">
                <AlertTriangle size={14} />
                {error}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Auto-tracer will execute BFS hop traversal, typology classification, and alert triggers for every address in queue.
              </span>

              <button
                onClick={() => handleProcess()}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all"
              >
                {loading ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
                {loading ? "Processing & Auto-Tracing..." : "Ingest & Trace Queue"}
              </button>
            </div>
          </div>

          {/* Real-time Ingestion Results */}
          {result && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-400" size={18} />
                  <h3 className="text-sm font-bold text-white">
                    Batch Processed: {result.processed_records} / {result.total_records} Complaints Traced
                  </h3>
                </div>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 bg-red-950 border border-red-800 rounded-lg text-xs text-red-400 font-bold">
                    {result.high_risk_count} High Risk Flags
                  </span>
                  <span className="px-2.5 py-1 bg-blue-950 border border-blue-800 rounded-lg text-xs text-blue-400 font-bold">
                    Batch ID: {result.batch_id}
                  </span>
                </div>
              </div>

              {/* Table of Processed Items */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-semibold">
                    <tr>
                      <th className="p-3">Complaint ID</th>
                      <th className="p-3">Suspect Wallet</th>
                      <th className="p-3">Chain</th>
                      <th className="p-3">Detected Typology</th>
                      <th className="p-3">Risk Score</th>
                      <th className="p-3">Terminal VASP</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {result.results.map((r: any, idx: number) => {
                      const isHigh = r.risk_score >= 75;
                      return (
                        <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 font-mono text-white font-medium">{r.complaint_id}</td>
                          <td className="p-3 font-mono text-slate-300">{r.wallet_address}</td>
                          <td className="p-3 font-mono text-slate-400">{r.chain}</td>
                          <td className="p-3 text-slate-200">{r.typology}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded font-bold font-mono text-[10px] ${
                                isHigh ? "bg-red-950 text-red-400 border border-red-800" : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                              }`}
                            >
                              {r.risk_score} — {r.risk_level}
                            </span>
                          </td>
                          <td className="p-3 text-blue-300 font-semibold">{r.vasp_match}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleTraceWallet(r.wallet_address, r.chain)}
                              className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-600/40 rounded text-[11px] font-medium transition-colors"
                            >
                              Open Graph
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Past Ingestion Batches */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="text-slate-400" size={16} />
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Ingested Batch Archives ({batches.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {batches.map((b) => (
                <div key={b.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{b.batch_name}</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-1.5 py-0.2 rounded">
                      {b.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 mt-2">
                    <span>Records: {b.processed_records} / {b.total_records}</span>
                    <span className="text-red-400 font-semibold">{b.high_risk_count} High Risk</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">
                    {new Date(b.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
