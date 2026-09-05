import { useState, useEffect } from "react";
import { 
  Settings, User, Scale, Cpu, Sliders, Database, 
  Save, CheckCircle2, RefreshCw, Shield, AlertTriangle, Key, HardDrive, Check, FileText
} from "lucide-react";
import { fetchSettings, updateSettings, testApiConnection } from "../api/client";
import { SystemSettings, SystemStats } from "../types";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<string>("officer");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Settings State
  const [settings, setSettings] = useState<SystemSettings>({
    investigator_name: "Insp. Aditya Prashant Deshmukh",
    investigator_badge: "MH-CYBER-8841",
    police_station: "State Cyber Police Station, CID Pune HQ",
    investigator_email: "aditya.deshmukh@mahapolice.gov.in",
    statutory_framework: "BNSS_94",
    jurisdiction: "Special Designated Court for Cyber Offenses, Pune",
    risk_alert_threshold: "75",
    velocity_threshold_z: "3.0",
    hop_limit: "5",
    etherscan_key: "C5X91K882NV91_ACTIVE",
    trongrid_key: "TG_SEC_990142_ACTIVE",
    anthropic_key: "sk-ant-prod-881920_ENABLED",
    sahyog_endpoint: "https://sahyog.cybercrime.gov.in/api/v2",
    auto_generate_certificates: "true",
    enable_live_rpc_fallback: "true"
  });

  const [stats, setStats] = useState<SystemStats | null>(null);

  // Test connection state
  const [testingConn, setTestingConn] = useState<boolean>(false);
  const [connResults, setConnResults] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    fetchSettings()
      .then((res) => {
        setSettings(res.settings);
        setStats(res.system_stats);
      })
      .catch((err) => console.error("Failed to load settings", err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: keyof SystemSettings, val: string) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateSettings(settings);
      setSettings(res.settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTestingConn(true);
    try {
      const res = await testApiConnection("all");
      setConnResults(res.results);
    } catch (err) {
      alert("Health check failed");
    } finally {
      setTestingConn(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#07090E] text-slate-100 font-sans select-none">
      {/* Header */}
      <div className="border-b border-white/[0.07] bg-[#0A0D15]/95 backdrop-blur-xl px-6 py-4 sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950/70 text-emerald-400 border border-emerald-800/50 rounded-full">
              System Administration
            </span>
            <span className="text-xs text-slate-400">Station Identity &amp; Detection Engine Config</span>
          </div>
          <h1 className="text-lg font-bold text-white tracking-wide mt-1 flex items-center gap-2">
            <Settings className="text-emerald-400" size={20} />
            LEA System Configuration &amp; Settings
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
              <Check size={14} />
              Configuration Persisted to SQLite
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-xl shadow-glow-emerald transition-all"
          >
            <Save size={15} />
            {saving ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-white/[0.07] gap-2 overflow-x-auto">
          {[
            { id: "officer", label: "Investigating Officer Profile", icon: User },
            { id: "legal", label: "Statutory Law & Court Notice", icon: Scale },
            { id: "api", label: "Blockchain Nodes & API Keys", icon: Cpu },
            { id: "rules", label: "Risk & Alert Rules", icon: Sliders },
            { id: "system", label: "Database & Diagnostics", icon: Database },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === id
                  ? "border-emerald-500 text-emerald-300 bg-emerald-950/30 font-semibold"
                  : "border-transparent text-slate-400 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab 1: Officer Profile */}
        {activeTab === "officer" && (
          <div className="bg-[#0A0D15] border border-white/[0.08] rounded-2xl p-6 space-y-6 shadow-xl">
            <div>
              <h2 className="text-sm font-bold text-white">Investigating Officer &amp; Cyber Cell Credentials</h2>
              <p className="text-xs text-slate-400 mt-1">
                These credentials are automatically embedded in all judicial reports, Section 63 BSA / Section 65B IEA certificates, and Section 91 CrPC subpoenas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-semibold">Designated Officer Name &amp; Rank</label>
                <input
                  type="text"
                  value={settings.investigator_name}
                  onChange={(e) => handleChange("investigator_name", e.target.value)}
                  className="w-full bg-[#101522] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-semibold">Police Service / Badge Number</label>
                <input
                  type="text"
                  value={settings.investigator_badge}
                  onChange={(e) => handleChange("investigator_badge", e.target.value)}
                  className="w-full bg-[#101522] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-semibold">Police Station / Cyber Crime Unit</label>
                <input
                  type="text"
                  value={settings.police_station}
                  onChange={(e) => handleChange("police_station", e.target.value)}
                  className="w-full bg-[#101522] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-semibold">Official Government Dispatch Email</label>
                <input
                  type="email"
                  value={settings.investigator_email}
                  onChange={(e) => handleChange("investigator_email", e.target.value)}
                  className="w-full bg-[#101522] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                />
              </div>
            </div>

            <div className="p-4 bg-[#101522] border border-white/[0.06] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-white">Cryptographic Digital Signature Seal</p>
                  <p className="text-[11px] text-slate-400">RSA-2048 / SHA-256 Digital Certificate Active for Investigating Officer</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full">
                ACTIVE &amp; SEALED
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Legal Framework */}
        {activeTab === "legal" && (
          <div className="bg-[#0A0D15] border border-white/[0.08] rounded-2xl p-6 space-y-6 shadow-xl">
            <div>
              <h2 className="text-sm font-bold text-white">Statutory Law &amp; Judicial Notice Configuration</h2>
              <p className="text-xs text-slate-400 mt-1">
                Select the applicable procedural criminal code for generating formal freeze directives to Virtual Asset Service Providers (VASPs).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#101522] border border-white/[0.06] rounded-xl">
                <label className="block text-xs font-bold text-white mb-2">Procedural Law Regime</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="statutory_framework"
                      value="BNSS_94"
                      checked={settings.statutory_framework === "BNSS_94"}
                      onChange={() => handleChange("statutory_framework", "BNSS_94")}
                      className="accent-emerald-500"
                    />
                    <span>
                      <strong className="text-white">Section 94 BNSS, 2023</strong> (Bharatiya Nagarik Suraksha Sanhita) — <em>Recommended for FIRs from 1 July 2024</em>
                    </span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="statutory_framework"
                      value="CRPC_91"
                      checked={settings.statutory_framework === "CRPC_91"}
                      onChange={() => handleChange("statutory_framework", "CRPC_91")}
                      className="accent-emerald-500"
                    />
                    <span>
                      <strong className="text-white">Section 91 CrPC, 1973</strong> (Code of Criminal Procedure) — <em>For legacy pending cases</em>
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-semibold">Designated Judicial Jurisdiction Court</label>
                <input
                  type="text"
                  value={settings.jurisdiction}
                  onChange={(e) => handleChange("jurisdiction", e.target.value)}
                  className="w-full bg-[#101522] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Court name pre-printed on all statutory orders and judicial exhibits.
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#07090E] border border-white/[0.06] rounded-xl">
              <p className="text-xs font-mono font-bold text-slate-400 mb-1.5">Statutory Summons Notice Header Preview:</p>
              <div className="font-mono text-xs text-amber-400 leading-relaxed bg-[#0A0D15] p-3 rounded-lg border border-amber-500/20">
                {settings.statutory_framework === "BNSS_94"
                  ? "NOTICE UNDER SECTION 94 OF BHARATIYA NAGARIK SURAKSHA SANHITA, 2023 READ WITH SECTION 69 OF THE IT ACT, 2000"
                  : "STATUTORY SUMMONS UNDER SECTION 91 OF THE CODE OF CRIMINAL PROCEDURE, 1973 (CrPC)"
                }
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: API Keys */}
        {activeTab === "api" && (
          <div className="bg-[#0A0D15] border border-white/[0.08] rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">Blockchain Nodes &amp; External Intelligence Feeds</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Configure live RPC access keys. When keys are empty or unconfigured, the system automatically falls back to deterministic local mock telemetry.
                </p>
              </div>
              <button
                onClick={handleTestConnection}
                disabled={testingConn}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#101522] hover:bg-[#161E30] text-xs text-emerald-400 border border-emerald-500/30 rounded-xl transition-all font-semibold"
              >
                <RefreshCw size={13} className={testingConn ? "animate-spin" : ""} />
                {testingConn ? "Testing..." : "Test All Connections"}
              </button>
            </div>

            {connResults && (
              <div className="p-4 bg-[#101522] border border-white/[0.06] rounded-xl grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(connResults).map(([key, val]: [string, any]) => (
                  <div key={key} className="p-2.5 bg-[#0A0D15] rounded-lg border border-white/[0.06]">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase text-slate-400">{key.replace(/_/g, " ")}</span>
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={11} />
                        {val.status}
                      </span>
                    </div>
                    {val.latency_ms && (
                      <p className="text-[10px] font-mono text-slate-500 mt-0.5">{val.latency_ms}ms ping</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-semibold flex items-center gap-1">
                  <Key size={12} className="text-cyan-400" />
                  Etherscan API Key (Ethereum Trace)
                </label>
                <input
                  type="password"
                  value={settings.etherscan_key}
                  onChange={(e) => handleChange("etherscan_key", e.target.value)}
                  className="w-full bg-[#101522] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-semibold flex items-center gap-1">
                  <Key size={12} className="text-red-400" />
                  TronGrid API Key (USDT-TRC20 Trace)
                </label>
                <input
                  type="password"
                  value={settings.trongrid_key}
                  onChange={(e) => handleChange("trongrid_key", e.target.value)}
                  className="w-full bg-[#101522] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-semibold flex items-center gap-1">
                  <Key size={12} className="text-amber-400" />
                  AI Narrative Key (Claude / Gemini)
                </label>
                <input
                  type="password"
                  value={settings.anthropic_key}
                  onChange={(e) => handleChange("anthropic_key", e.target.value)}
                  className="w-full bg-[#101522] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-semibold flex items-center gap-1">
                  <Key size={12} className="text-emerald-400" />
                  SAHYOG / I4C Portal Endpoint
                </label>
                <input
                  type="text"
                  value={settings.sahyog_endpoint}
                  onChange={(e) => handleChange("sahyog_endpoint", e.target.value)}
                  className="w-full bg-[#101522] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Risk & Detection Rules */}
        {activeTab === "rules" && (
          <div className="bg-[#0A0D15] border border-white/[0.08] rounded-2xl p-6 space-y-6 shadow-xl">
            <div>
              <h2 className="text-sm font-bold text-white">Detection Heuristics &amp; Automated Threat Rules</h2>
              <p className="text-xs text-slate-400 mt-1">
                Tune the risk sensitivity algorithms that generate incident alerts and triage bulk complaint CSVs.
              </p>
            </div>

            <div className="space-y-5 max-w-2xl">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span className="font-semibold">Minimum Threat Alert Risk Threshold</span>
                  <span className="font-mono text-emerald-400 font-bold">{settings.risk_alert_threshold}/100</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={settings.risk_alert_threshold}
                  onChange={(e) => handleChange("risk_alert_threshold", e.target.value)}
                  className="w-full accent-emerald-500"
                />
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Addresses exceeding this risk score immediately trigger an alert banner and notify duty officers.
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span className="font-semibold">Velocity Anomaly Z-Score Sensitivity</span>
                  <span className="font-mono text-amber-400 font-bold">{settings.velocity_threshold_z}σ</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="4.5"
                  step="0.5"
                  value={settings.velocity_threshold_z}
                  onChange={(e) => handleChange("velocity_threshold_z", e.target.value)}
                  className="w-full accent-emerald-500"
                />
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Flags fund movements occurring faster than normal human transaction distributions (rapid automated mule sweeps).
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span className="font-semibold">Default Max Automated BFS Hop Limit</span>
                  <span className="font-mono text-teal-400 font-bold">{settings.hop_limit} Hops</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="6"
                  step="1"
                  value={settings.hop_limit}
                  onChange={(e) => handleChange("hop_limit", e.target.value)}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Database & Diagnostics */}
        {activeTab === "system" && stats && (
          <div className="bg-[#0A0D15] border border-white/[0.08] rounded-2xl p-6 space-y-6 shadow-xl">
            <div>
              <h2 className="text-sm font-bold text-white">Persistent SQLite Database &amp; Local Engine Storage</h2>
              <p className="text-xs text-slate-400 mt-1">
                Diagnostics for the offline-capable persistent embedded database. Zero external database servers required.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-[#101522] rounded-xl border border-white/[0.06]">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <HardDrive size={15} />
                  <span>Database Size</span>
                </div>
                <p className="text-xl font-bold font-mono text-white mt-1">{stats.db_size_kb} KB</p>
                <p className="text-[10px] text-slate-500 mt-0.5">WAL Mode Active</p>
              </div>

              <div className="p-4 bg-[#101522] rounded-xl border border-white/[0.06]">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Database size={15} />
                  <span>Indexed Entities</span>
                </div>
                <p className="text-xl font-bold font-mono text-emerald-400 mt-1">{stats.counts.indexed_addresses}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Curated VASPs &amp; Mixers</p>
              </div>

              <div className="p-4 bg-[#101522] rounded-xl border border-white/[0.06]">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Shield size={15} />
                  <span>Active Cases</span>
                </div>
                <p className="text-xl font-bold font-mono text-amber-400 mt-1">{stats.counts.cases}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">NCRP Complaints</p>
              </div>

              <div className="p-4 bg-[#101522] rounded-xl border border-white/[0.06]">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <FileText size={15} />
                  <span>Court Dossiers</span>
                </div>
                <p className="text-xl font-bold font-mono text-teal-400 mt-1">{stats.counts.reports}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Certified Evidence</p>
              </div>
            </div>

            <div className="p-4 bg-[#101522] rounded-xl border border-white/[0.06] font-mono text-xs text-slate-300">
              <span className="text-slate-500">DATABASE PATH:</span> {stats.db_path}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
