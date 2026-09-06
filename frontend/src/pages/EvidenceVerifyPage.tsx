import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { 
  ShieldCheck, Search, CheckCircle2, XCircle, 
  FileCheck, ShieldAlert, Award, Hash, ExternalLink,
  Printer, ArrowLeft, Building2, UserCheck
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { verifyEvidence } from "../api/client";
import { useAuthStore } from "../store/authStore";
import logoImg from "../assets/logo.png";

export default function EvidenceVerifyPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const token = useAuthStore((s) => s.token);

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
    <div className="flex min-h-screen bg-slate-950 text-white font-sans">
      {token && <Sidebar />}

      <main className="flex-1 flex flex-col min-w-0 bg-slate-950 min-h-screen overflow-y-auto">
        {/* Header */}
        <header className="px-4 sm:px-8 py-4 sm:py-5 border-b border-slate-800 bg-slate-900/80 backdrop-blur flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-950/50">
              <ShieldCheck className="text-emerald-400" size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                  OFFICIAL REPOSITORY
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">GOVT OF INDIA &middot; NCRP / I4C</span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white mt-0.5">
                Judicial Electronic Evidence Verification Portal
              </h1>
              <p className="text-[11px] text-slate-400">
                Statutory certificate validation under Section 63 BSA (2023) & Section 65B Indian Evidence Act
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token ? (
              <Link
                to="/"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
              >
                <ArrowLeft size={13} />
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all"
              >
                Investigator Portal
              </Link>
            )}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Case Reference / FIR</span>
                      <span className="text-emerald-400 font-mono font-bold text-xs">{result.case_id || "NCRP/2024/MH/00441"}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Investigation ID</span>
                      <span className="text-white font-mono font-bold text-xs">{result.investigation_id}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Certified Timestamp</span>
                      <span className="text-slate-200 font-mono text-xs">{result.recorded_at}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Suspect Origin Address</span>
                      <span className="text-slate-200 font-mono text-xs break-all">{result.start_address}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Attributed Risk Assessment</span>
                      <span className="text-red-400 font-bold font-mono text-xs">{result.risk_score}/100 ({result.risk_level})</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Investigating Examiner</span>
                      <span className="text-slate-200 font-semibold text-xs">{result.officer_name || "Insp. Aditya Prashant Deshmukh"} ({result.badge || "MH-CYB-2241"})</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-400 uppercase text-[9px] font-bold">Canonical SHA-256 Digest (Section 63 BSA Stamp)</span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">MATCH CONFIRMED</span>
                    </div>
                    <span className="font-mono text-emerald-400 break-all text-xs selection:bg-emerald-800">{result.canonical_sha256}</span>
                  </div>

                  {/* Certificate badge */}
                  <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-700/60 flex items-start gap-3">
                    <Award className="text-emerald-400 shrink-0 mt-0.5" size={22} />
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-emerald-300 uppercase tracking-wide">
                        Statutory Electronic Evidence Certificate Validated
                      </p>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        This record is validated as court-admissible under <strong>Section 63 of Bharatiya Sakshya Adhiniyam, 2023 (BSA)</strong> and <strong>Section 65B of the Indian Evidence Act, 1872</strong>. The cryptographic SHA-256 digest mathematically matches the immutable forensic audit repository created during seizure and graph traversal.
                      </p>
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-emerald-900/60 text-[10px] text-emerald-400">
                        <span>Issuing Station: <strong>{result.police_station || "State Cyber Police Station, CID Pune HQ"}</strong></span>
                        <button
                          onClick={() => window.print()}
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-medium flex items-center gap-1 transition-colors"
                        >
                          <Printer size={12} />
                          Print Validation Stamp
                        </button>
                      </div>
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
