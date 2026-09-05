import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Shield, Eye, EyeOff, AlertCircle, Lock, 
  ArrowRight, ShieldCheck, Cpu, Terminal, CheckCircle2, UserCheck 
} from "lucide-react";
import { login as apiLogin } from "../api/client";
import { useAuthStore } from "../store/authStore";
import logoImg from "../assets/logo.png";

export default function LoginPage() {
  const [email,    setEmail]    = useState("aditya@mitaoe.ac.in");
  const [password, setPassword] = useState("tracex@2024");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const authLogin  = useAuthStore((s) => s.login);
  const navigate   = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token, user } = await apiLogin(email, password);
      authLogin(token, user);
      navigate("/");
    } catch (err: any) {
      setError(err.message ?? "Authentication failed. Verify credentials.");
    } finally {
      setLoading(false);
    }
  }

  function applyPreset(em: string, pw: string) {
    setEmail(em);
    setPassword(pw);
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex items-center justify-center p-4 lg:p-10 relative overflow-hidden font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* Ambient background glow & telemetry grid */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#151D2A_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch z-10">
        
        {/* Left Enclave: Platform Intelligence & Legitimacy Showcase */}
        <div className="lg:col-span-6 flex flex-col justify-between p-8 lg:p-10 rounded-3xl bg-gradient-to-b from-[#0E131F]/90 to-[#0A0D15]/95 border border-white/[0.08] shadow-2xl backdrop-blur-xl">
          <div>
            {/* National LEA Badge Strip */}
            <div className="flex items-center gap-2.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-mono tracking-widest text-emerald-400 font-bold uppercase">
                MHA NCRP ENCLAVE · NODE #04-MH
              </span>
            </div>

            {/* Logo & Headline */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-[#111726] border border-emerald-500/30 p-2.5 shadow-[0_0_25px_-5px_rgba(16,185,129,0.3)] flex items-center justify-center">
                <img src={logoImg} alt="TRACE-X Emblem" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  TRACE-X
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                    LEA v2.1
                  </span>
                </h1>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Sovereign Blockchain Forensics & Fund Attribution
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed mb-8">
              Built for Law Enforcement Agencies, State Cyber Cells, and Financial Intelligence Units to dismantle illicit crypto syndicates, track multi-hop laundering, and generate court-admissible dossiers.
            </p>

            {/* Feature Highlights with Rich Jewel Accents */}
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl bg-[#111726]/60 border border-white/[0.06] flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                  <Terminal size={15} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">Multi-Hop BFS Traversal Engine</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">De-anonymizes peel chains, mixers, and bridges across BTC, ETH, and TRON.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111726]/60 border border-white/[0.06] flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                  <ShieldCheck size={15} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">Section 63 BSA / 65B IEA Evidentiary Vault</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Automated judicial dossiers with SHA-256 custody seals for Indian trial courts.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111726]/60 border border-white/[0.06] flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 shrink-0">
                  <Cpu size={15} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">VASP Attribution & Sec 91 Summons Rail</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Direct identification and freeze workflow across FIU-IND registered exchanges.</p>
                </div>
              </div>
            </div>
          </div>

          {/* System Telemetry Footer */}
          <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              HSM PROTOCOL: SECURE
            </span>
            <span>LATENCY: 14MS</span>
            <span>AIR-GAPPED SHA-256</span>
          </div>
        </div>

        {/* Right Enclave: Officer Authentication Terminal */}
        <div className="lg:col-span-6 flex flex-col justify-center p-8 lg:p-10 rounded-3xl bg-[#0B0F17]/95 border border-white/[0.09] shadow-2xl backdrop-blur-xl">
          
          <div className="mb-6">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold block mb-1">
              Law Enforcement Access Terminal
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Investigator Authentication</h2>
            <p className="text-xs text-slate-400 mt-1">
              Verify credentials to establish a cryptographic LEA operational session.
            </p>
          </div>

          {/* Statutory Law Advisory Banner */}
          <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-3 mb-6 flex items-start gap-2.5">
            <AlertCircle size={15} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-amber-200/90 text-[11px] leading-relaxed">
              <strong className="text-amber-300 font-semibold">LEGAL ADVISORY:</strong> Access restricted to authorized cyber investigators. Unauthorized access is punishable under Section 43 &amp; 66 of the Information Technology Act 2000.
            </p>
          </div>

          {/* Quick-Fill Officer Credentials Pills */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold">
                Quick-Select Profile:
              </span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 size={10} /> Ready for SIH Evaluation
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => applyPreset("aditya@mitaoe.ac.in", "tracex@2024")}
                className={`px-3 py-2 text-left rounded-xl border transition-all text-xs flex items-center gap-2 ${
                  email === "aditya@mitaoe.ac.in"
                    ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                    : "bg-[#111726]/40 border-white/[0.06] text-slate-400 hover:text-slate-200"
                }`}
              >
                <UserCheck size={14} className="text-emerald-400 shrink-0" />
                <div className="truncate">
                  <p className="font-semibold truncate">Insp. Aditya Prashant Deshmukh</p>
                  <p className="text-[9px] font-mono text-slate-500 truncate">Cyber Cell (Lead)</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset("investigator@lea.gov.in", "tracex@2024")}
                className={`px-3 py-2 text-left rounded-xl border transition-all text-xs flex items-center gap-2 ${
                  email === "investigator@lea.gov.in"
                    ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                    : "bg-[#111726]/40 border-white/[0.06] text-slate-400 hover:text-slate-200"
                }`}
              >
                <Shield size={14} className="text-amber-400 shrink-0" />
                <div className="truncate">
                  <p className="font-semibold truncate">Forensic Examiner</p>
                  <p className="text-[9px] font-mono text-slate-500 truncate">NCRP Analyst</p>
                </div>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                Investigator Email / SSO ID
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#121724] border border-white/[0.09] text-white text-xs px-4 py-3 rounded-xl
                           focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 
                           placeholder:text-slate-600 transition-all font-mono"
                placeholder="officer@mitaoe.ac.in"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                Access Passphrase
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#121724] border border-white/[0.09] text-white text-xs px-4 py-3 pr-10 rounded-xl
                             focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 
                             placeholder:text-slate-600 transition-all font-mono"
                  placeholder="••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-950/50 border border-red-800/60 rounded-xl px-3.5 py-2.5">
                <AlertCircle size={14} className="text-red-400 shrink-0" />
                <p className="text-red-300 text-xs font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500
                         disabled:opacity-60 text-white font-semibold text-xs tracking-wide rounded-xl transition-all
                         shadow-[0_0_25px_-5px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Validating Forensic Credentials…</span>
                </>
              ) : (
                <>
                  <Lock size={14} className="text-emerald-200" />
                  <span>Authenticate &amp; Enter Operations Console</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Credential summary footer */}
          <div className="mt-5 text-center">
            <p className="text-slate-500 text-[10px] font-mono">
              Secured with SHA-256 JWT Authentication &middot; Session TTL: 24h
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

