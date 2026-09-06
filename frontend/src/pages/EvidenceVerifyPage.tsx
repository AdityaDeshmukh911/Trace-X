import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  ShieldCheck, Search, CheckCircle2, XCircle, 
  FileCheck, ShieldAlert, Award, Hash, ExternalLink 
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { verifyEvidence } from "../api/client";

export default function EvidenceVerifyPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  async function executeVerify(target: string) {
    const trimmed = target.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      const res = await verifyEvidence(trimmed);
      setResult(res);
    } catch (err: any) {
      setResult({ is_valid: false, message: err.message || "Verification request failed" });
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e?: React.FormEvent) {
    if (e) e.preventDefault();
    executeVerify(query);
  }

  useEffect(() => {
    const paramHash = searchParams.get("hash") || searchParams.get("verify") || searchParams.get("q") || searchParams.get("id");
    if (paramHash) {
      setQuery(paramHash);
      executeVerify(paramHash);
    }
  }, [searchParams]);

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
        {/* Header */}
        <header className="px-8 py-5 border-b border-slate-800 bg-slate-900/60 backdrop-blur flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center">
              <ShieldCheck className="text-emerald-400" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold">Judicial Electronic Evidence Verification Portal</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Statutory certificate validation under Section 65B Indian Evidence Act 1872 & Section 63 BSA (2023)
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full space-y-6">
          {/* Verification Form */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="text-emerald-400" size={17} />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Authenticate Evidence Digest or Investigation Reference
              </h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Enter any 64-character SHA-256 hexadecimal hash or 8-character TRACE-X Investigation ID printed on an official report.
            </p>

            <form onSubmit={handleVerify} className="flex gap-2">
              <input
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                placeholder="Paste SHA-256 hash or Investigation ID (e.g. 9E1C2FFF)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all"
              >
                <Search size={14} />
                {loading ? "Verifying..." : "Verify Digest"}
              </button>
            </form>
          </div>

          {/* Verification Result */}
          {result && (
            <div
              className={`rounded-2xl p-6 border transition-all ${
                result.is_valid
                  ? "bg-emerald-950/20 border-emerald-800"
                  : "bg-red-950/20 border-red-800"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                {result.is_valid ? (
                  <CheckCircle2 className="text-emerald-400" size={24} />
                ) : (
                  <XCircle className="text-red-400" size={24} />
                )}
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {result.is_valid
                      ? "Cryptographic Verification Passed — Authentic Record"
                      : "Evidence Digest Verification Failed"}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">{result.message}</p>
                </div>
              </div>

              {result.is_valid && (
                <div className="space-y-4 pt-4 border-t border-emerald-900/60">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Investigation ID</span>
                      <span className="text-white font-mono font-bold text-sm">{result.investigation_id}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Timestamp (UTC)</span>
                      <span className="text-slate-200 font-mono">{result.recorded_at}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Suspect Origin Wallet</span>
                      <span className="text-slate-200 font-mono break-all">{result.start_address}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">Adjudicated Risk</span>
                      <span className="text-red-400 font-bold font-mono">{result.risk_score}/100 ({result.risk_level})</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px]">
                    <span className="text-slate-400 block mb-1 uppercase text-[9px] font-bold">Canonical SHA-256 Digest</span>
                    <span className="font-mono text-emerald-400 break-all">{result.canonical_sha256}</span>
                  </div>

                  {/* Certificate badge */}
                  <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-700/60 flex items-start gap-3">
                    <Award className="text-emerald-400 shrink-0 mt-0.5" size={20} />
                    <div className="text-xs">
                      <p className="font-bold text-emerald-300 uppercase tracking-wide">
                        Statutory Electronic Evidence Certificate Validated
                      </p>
                      <p className="text-slate-300 mt-1 leading-relaxed text-[11px]">
                        This record is validated as court-admissible under Section 65B of the Indian Evidence Act, 1872
                        and Section 63 of the Bharatiya Sakshya Adhiniyam, 2023 (BSA). The electronic hash matches the
                        immutable database ledger created at the time of forensic examination.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
