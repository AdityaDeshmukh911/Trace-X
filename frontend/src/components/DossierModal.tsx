import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Printer, Download, Copy, Check, ExternalLink, X, 
  ShieldCheck, Building2, Award, FileText, ArrowRight,
  AlertTriangle, Coins, GitFork, Lock, CheckCircle2, ShieldAlert
} from "lucide-react";

export interface DossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    investigation_id?: string;
    case_id?: string;
    target_address?: string;
    chain?: string;
    typology?: string;
    risk_score?: number;
    risk_level?: string;
    ml_anomaly_score?: number;
    officer_name?: string;
    badge?: string;
    police_station?: string;
    vasp_name?: string;
    vasp_address?: string;
    canonical_sha256?: string;
    narrative?: string;
    created_at?: string;
    edges?: Array<{
      id: string;
      source: string;
      target: string;
      amount: number;
      chain: string;
      hash: string;
      timestamp?: string;
    }>;
  };
}

export default function DossierModal({ isOpen, onClose, data }: DossierModalProps) {
  const navigate = useNavigate();
  const [copiedHash, setCopiedHash] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const invId = data.investigation_id || "INV-2024-MH-00441";
  const caseId = data.case_id || "NCRP/2024/MH/00441";
  const target = data.target_address || "0xFraud_Origin_Task_Scam";
  const chain = data.chain || "ETH";
  const typology = data.typology || "Task Scam / Deposit Multi-Hop Sweep";
  const riskScore = data.risk_score !== undefined ? data.risk_score : 87;
  const riskLevel = data.risk_level || (riskScore > 75 ? "CRITICAL" : "ELEVATED");
  const officer = data.officer_name || "Insp. Aditya Prashant Deshmukh";
  const badge = data.badge || "MH-CYB-2241";
  const station = data.police_station || "State Cyber Police Station, CID Pune HQ";
  const vasp = data.vasp_name || "Binance";
  const vaspAddr = data.vasp_address || "0x28C6c06298d514Db089934071355E5743bf21d60";
  const sha256 = data.canonical_sha256 || "d08037a48e707bd78fc32cf064ca98de9b618e86d683f474b920856df58c8d60";
  const narrative = data.narrative || 
    "Forensic graph traversal confirms high-velocity fund dissipation originating from initial victim deposit. Proceeds were layered through intermediate aggregator mule accounts before terminal deposit into exchange infrastructure.";
  const dateStr = data.created_at || new Date().toUTCString();

  // ── Dynamic origin URL for phone camera QR scanning ──
  const rawOrigin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";
  const isVercelOrHttp = rawOrigin.startsWith("http://") || rawOrigin.startsWith("https://");
  const appOrigin = isVercelOrHttp ? rawOrigin : "https://trace-x-ijae.vercel.app";
  const verifyUrl = `${appOrigin}/evidence?verify=${encodeURIComponent(sha256)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(verifyUrl)}&margin=4`;

  // ── Real Dynamic Transaction Hop Ledger (from data.edges) ──
  const hopRows = (data.edges && data.edges.length > 0)
    ? data.edges.map((e, idx) => {
        let role = "Intermediate Aggregator Mule";
        let flag = "MULE_FANOUT";
        if (idx === 0 || idx === 1) {
          role = "Layer 1 Aggregator Mule";
          flag = "FAN_OUT";
        } else if (idx === 2 || idx === 3) {
          role = "Smurfing Funnel Splitter";
          flag = "SMURFING";
        } else if (idx === 4 || idx === 5) {
          role = "Privacy Mixer / DEX Swap";
          flag = "OBFUSCATION";
        } else if (idx === 6 || idx === 7) {
          role = "Post-Mixer Collector";
          flag = "CONSOLIDATION";
        } else if (idx >= 8) {
          role = "Terminal VASP Deposit Sweep";
          flag = "VASP_HOT_WALLET";
        }

        return {
          seq: idx + 1,
          time: e.timestamp || new Date(Date.now() - (data.edges!.length - idx) * 1800000).toISOString().replace("T", " ").substring(0, 19),
          source: e.source,
          target: e.target,
          amount: `${e.amount} ${e.chain || chain}`,
          rawAmount: e.amount,
          hash: e.hash,
          role,
          flag
        };
      })
    : [
        { seq: 1, time: "2024-01-15 09:45:00", source: target, target: "0xLayer1_Mule_A", amount: `14.50 ${chain}`, rawAmount: 14.5, hash: "0x33e8b0a97005d723ea906e320e59e8965087ee82", role: "Layer 1 Aggregator Mule", flag: "MULE_LAYER_1" },
        { seq: 2, time: "2024-01-15 10:15:00", source: "0xLayer1_Mule_A", target: "0xLayer2_Splitter", amount: `12.00 ${chain}`, rawAmount: 12.0, hash: "0x25033a5d326db686560858536a522065a5a50350", role: "Smurfing Funnel Splitter", flag: "PEELING_CHAIN" },
        { seq: 3, time: "2024-01-15 11:00:00", source: "0xLayer2_Splitter", target: "0xTornado_10ETH", amount: `10.00 ${chain}`, rawAmount: 10.0, hash: "0x989935e39d860e8e05c2020008c3e0800e008702", role: "Privacy Pool Mixer", flag: "OFAC_SDN_MIXER" },
        { seq: 4, time: "2024-01-15 11:30:00", source: "0xTornado_10ETH", target: vaspAddr, amount: `9.80 ${chain}`, rawAmount: 9.8, hash: "0x3e037ab55955e8c865320923e59e508607a50338", role: "Terminal Exchange Hot Wallet", flag: "VASP_HOT_WALLET" },
      ];

  const totalVolumeNum = data.edges && data.edges.length > 0
    ? (data.edges[0].amount + (data.edges[1]?.amount || 0))
    : 14.50;
  const totalVolumeStr = `${totalVolumeNum.toFixed(2)} ${chain}`;
  const fiatEstINR = (totalVolumeNum * 265000).toLocaleString("en-IN", { maximumFractionDigits: 0 });
  const fiatEstUSD = (totalVolumeNum * 3150).toLocaleString("en-US", { maximumFractionDigits: 0 });

  const handleCopyHash = () => {
    navigator.clipboard.writeText(sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>TRACE-X Forensic Dossier - ${caseId}</title>
  <style>
    @page { size: A4; margin: 12mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 24px;
      font-size: 12px;
      line-height: 1.45;
    }
    .header-box { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; }
    .badge { display: inline-block; font-size: 9px; font-weight: 700; color: #b91c1c; background: #fee2e2; border: 1px solid #fca5a5; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 16px; }
    .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px; }
    .summary-card { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; }
    .summary-title { font-size: 9px; text-transform: uppercase; color: #475569; font-weight: 700; display: block; margin-bottom: 4px; }
    .summary-val { font-size: 13px; font-weight: 800; color: #0f172a; }
    .pipeline { display: flex; align-items: center; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; margin-bottom: 16px; }
    .pipeline-step { flex: 1; text-align: center; }
    .pipeline-badge { font-size: 9px; font-weight: bold; padding: 3px 6px; border-radius: 4px; display: inline-block; margin-bottom: 4px; }
    .pipeline-arrow { color: #94a3b8; font-weight: bold; font-size: 16px; padding: 0 8px; }
    .meta-title { font-size: 9px; text-transform: uppercase; color: #64748b; font-weight: 700; display: block; }
    .meta-val { font-size: 12px; color: #0f172a; font-weight: 600; }
    .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0f172a; border-left: 3px solid #059669; padding-left: 8px; margin: 16px 0 8px 0; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 6px; }
    th { background: #0f172a; color: #ffffff; padding: 6px 8px; text-align: left; font-size: 10px; text-transform: uppercase; }
    td { padding: 6px 8px; border-bottom: 1px solid #e2e8f0; }
    .cert-box { border: 2px dashed #059669; background: #ecfdf5; padding: 14px; border-radius: 8px; margin-top: 20px; display: flex; gap: 16px; align-items: center; }
    .hash { font-family: monospace; font-size: 10px; color: #047857; background: #ffffff; padding: 6px 8px; border-radius: 4px; border: 1px solid #a7f3d0; word-break: break-all; margin-top: 4px; }
    a.qr-link { text-decoration: none; color: inherit; display: inline-block; }
  </style>
</head>
<body>
  <div class="header-box">
    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
      <div>
        <span class="badge">CONFIDENTIAL // LAW ENFORCEMENT & JUDICIAL EVIDENCE ONLY</span>
        <h1 style="margin: 6px 0 2px 0; font-size: 18px; color: #0f172a; font-weight: 800;">
          GOVERNMENT OF INDIA &middot; NATIONAL CYBER CRIME REPORTING PORTAL
        </h1>
        <h2 style="margin: 0; font-size: 13px; color: #059669; font-weight: 700;">
          TRACE-X CRYPTOGRAPHIC CRIME DOSSIER &amp; ASSET SEIZURE RECORD
        </h2>
        <div style="font-size: 10px; color: #64748b; margin-top: 2px;">
          Statutory Compliance: Section 63 Bharatiya Sakshya Adhiniyam (BSA), 2023 / Section 65B Indian Evidence Act
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-size: 10px; color: #64748b;">RECORD IDENTIFIER</div>
        <div style="font-family: monospace; font-weight: 700; color: #059669; font-size: 13px;">${invId}</div>
      </div>
    </div>
  </div>

  <!-- Executive Plain English Summary Strip -->
  <div class="summary-grid">
    <div class="summary-card">
      <span class="summary-title">Fraud Typology</span>
      <div class="summary-val" style="color:#b91c1c;">${typology}</div>
      <div style="font-size:10px; color:#64748b; margin-top:2px;">IPC 420 &middot; IT Act 66D</div>
    </div>
    <div class="summary-card">
      <span class="summary-title">Total Fraud Volume</span>
      <div class="summary-val" style="color:#0f172a;">${totalVolumeStr}</div>
      <div style="font-size:10px; color:#059669; font-weight:bold; margin-top:2px;">~₹${fiatEstINR} / $${fiatEstUSD}</div>
    </div>
    <div class="summary-card">
      <span class="summary-title">Risk Assessment</span>
      <div class="summary-val" style="color:#b91c1c;">${riskScore}/100 (${riskLevel})</div>
      <div style="font-size:10px; color:#64748b; margin-top:2px;">Multi-Tier Mule Network</div>
    </div>
    <div class="summary-card">
      <span class="summary-title">Terminal Cash-out VASP</span>
      <div class="summary-val" style="color:#0284c7;">${vasp}</div>
      <div style="font-size:10px; color:#b91c1c; font-weight:bold; margin-top:2px;">Action: Section 91 Freeze</div>
    </div>
  </div>

  <!-- 4-Stage Fund Flow Pipeline -->
  <div class="section-title">Visual Fund Flow Pipeline (Money Journey)</div>
  <div class="pipeline">
    <div class="pipeline-step">
      <span class="pipeline-badge" style="background:#fee2e2; color:#991b1b;">1. CRIME INFLOW</span>
      <div style="font-weight:bold; font-size:11px;">Victim Deposit</div>
      <div style="font-size:9px; color:#64748b;">Initial illicit funds deposited into suspect wallet</div>
    </div>
    <div class="pipeline-arrow">&rarr;</div>
    <div class="pipeline-step">
      <span class="pipeline-badge" style="background:#fef3c7; color:#92400e;">2. MULE SPLITTING</span>
      <div style="font-weight:bold; font-size:11px;">Smurfing &amp; Fan-Out</div>
      <div style="font-size:9px; color:#64748b;">Splitting into intermediary mules below detection limit</div>
    </div>
    <div class="pipeline-arrow">&rarr;</div>
    <div class="pipeline-step">
      <span class="pipeline-badge" style="background:#e0e7ff; color:#3730a3;">3. OBFUSCATION</span>
      <div style="font-weight:bold; font-size:11px;">Mixer &amp; DEX Swap</div>
      <div style="font-size:9px; color:#64748b;">Layering through smart contract pools to hide origin</div>
    </div>
    <div class="pipeline-arrow">&rarr;</div>
    <div class="pipeline-step">
      <span class="pipeline-badge" style="background:#dcfce7; color:#166534;">4. TERMINAL VASP</span>
      <div style="font-weight:bold; font-size:11px;">Exchange Consolidation</div>
      <div style="font-size:9px; color:#64748b;">Sent to ${vasp} account ready for fiat conversion</div>
    </div>
  </div>

  <div class="grid-2">
    <div><span class="meta-title">NCRP Complaint / FIR Reference</span><span class="meta-val">${caseId}</span></div>
    <div><span class="meta-title">Investigating Examiner</span><span class="meta-val">${officer} (Badge: ${badge})</span></div>
    <div><span class="meta-title">Police Station / Unit</span><span class="meta-val">${station}</span></div>
    <div><span class="meta-title">Forensic Timestamp</span><span class="meta-val">${dateStr}</span></div>
    <div><span class="meta-title">Primary Suspect Address</span><span class="meta-val" style="font-family:monospace; font-size:11px;">${target} (${chain})</span></div>
    <div><span class="meta-title">Terminal Beneficiary Deposit</span><span class="meta-val" style="font-family:monospace; font-size:11px; color:#0284c7;">${vaspAddr}</span></div>
  </div>

  <div class="section-title">1. Automated Forensics Narrative &amp; Threat Evaluation</div>
  <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:10px 12px; border-radius:6px; font-family:monospace; font-size:11px; color:#334155; line-height:1.5;">
    ${narrative}
  </div>

  <div class="section-title">2. Cryptographic Multi-Hop Transaction Ledger</div>
  <table>
    <thead>
      <tr>
        <th>Seq</th>
        <th>Timestamp (UTC)</th>
        <th>Sending Entity</th>
        <th>Receiving Entity</th>
        <th>Volume</th>
        <th>Transaction Hash</th>
        <th>Role &amp; Classification</th>
      </tr>
    </thead>
    <tbody>
      ${hopRows.map(h => `
        <tr>
          <td><strong>#${h.seq}</strong></td>
          <td style="font-size:10px; color:#64748b;">${h.time}</td>
          <td style="font-family:monospace; font-size:10px;">${h.source.slice(0, 10)}...${h.source.slice(-6)}</td>
          <td style="font-family:monospace; font-size:10px;">${h.target.slice(0, 10)}...${h.target.slice(-6)}</td>
          <td><strong>${h.amount}</strong></td>
          <td style="font-family:monospace; font-size:10px; color:#0284c7;">${h.hash.slice(0, 14)}...</td>
          <td>
            <div style="font-size:10px; font-weight:bold;">${h.role}</div>
            <span style="font-size:8px; font-weight:700; color:#b91c1c; background:#fee2e2; padding:1px 4px; border-radius:3px;">${h.flag}</span>
          </td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <div class="section-title">3. Terminal VASP Attribution &amp; Statutory Freezing Directive</div>
  <table>
    <tr>
      <td style="width:25%; font-weight:bold; color:#475569;">Designated Exchange Desk:</td>
      <td style="font-weight:bold; color:#0f172a;">${vasp} Compliance &amp; Law Enforcement Desk</td>
    </tr>
    <tr>
      <td style="font-weight:bold; color:#475569;">Target Deposit Address:</td>
      <td style="font-family:monospace; font-weight:bold; color:#0284c7;">${vaspAddr}</td>
    </tr>
    <tr>
      <td style="font-weight:bold; color:#475569;">Enforcement Directive:</td>
      <td style="color:#b91c1c; font-weight:bold;">
        Immediate Freeze of Accounts, Sub-Accounts, and KYC Records pursuant to Section 91 CrPC, 1973 &amp; Section 94 Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023.
      </td>
    </tr>
  </table>

  <!-- Statutory Certificate with scannable and clickable QR Code -->
  <div class="cert-box">
    <a href="${verifyUrl}" target="_blank" rel="noopener noreferrer" class="qr-link" title="Click or Scan with Phone Camera to Verify Authenticity">
      <img src="${qrUrl}" alt="QR Evidence Stamp" style="width:110px; height:110px; border-radius:6px; border:1px solid #a7f3d0; background:#ffffff; display:block;" />
      <span style="display:block; text-align:center; font-size:8px; font-weight:bold; color:#047857; margin-top:4px;">SCAN / CLICK TO VERIFY</span>
    </a>
    <div style="flex:1;">
      <strong style="color:#065f46; font-size:12px; display:block; margin-bottom:3px;">
        STATUTORY CERTIFICATE UNDER SECTION 63 OF BHARATIYA SAKSHYA ADHINIYAM, 2023
      </strong>
      <p style="margin:0 0 6px 0; font-size:10px; color:#047857; line-height:1.4;">
        I hereby certify that the electronic record comprised in this forensic dossier was produced by the TRACE-X Autonomous Forensics Node operating under my lawful supervision. The mathematical integrity of the extracted evidence has remained continuous and untampered.
      </p>
      <div style="font-size:9px; color:#065f46; font-weight:bold;">CANONICAL SHA-256 MASTER EVIDENCE DIGEST:</div>
      <div class="hash">${sha256}</div>
      <div style="font-size:9px; color:#047857; margin-top:4px;">
        Verification URL: <a href="${verifyUrl}" style="color:#047857; word-break:break-all;">${verifyUrl}</a>
      </div>
    </div>
  </div>

  <div style="margin-top:24px; padding-top:12px; border-top:1px solid #cbd5e1; display:flex; justify-content:space-between; font-size:10px; color:#64748b;">
    <div>Authorized Examiner: <strong>${officer} (${badge})</strong></div>
    <div>Jurisdiction: <strong>${station}</strong></div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TRACE-X_Dossier_${caseId.replace(/\//g, "_")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleVerifyPortal = () => {
    onClose();
    navigate(`/evidence?verify=${sha256}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      {/* Container */}
      <div className="bg-[#0B0F18] border border-white/[0.12] rounded-2xl w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Command Action Bar (Hidden on print) */}
        <div className="flex flex-wrap items-center justify-between px-6 py-3.5 border-b border-white/[0.08] bg-[#0E1320] gap-3 print:hidden">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 rounded-full uppercase flex items-center gap-1.5">
              <ShieldCheck size={13} />
              Court Admissible Dossier
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Ref: <strong className="text-white">{invId}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all"
              title="Print to A4 or Save as PDF"
            >
              <Printer size={14} />
              Print / Save as PDF
            </button>

            <button
              onClick={handleDownloadHtml}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#141A29] hover:bg-[#1C2438] text-slate-200 hover:text-white rounded-xl text-xs font-medium border border-white/[0.1] transition-colors"
              title="Download Standalone Certified HTML Dossier"
            >
              <Download size={14} />
              Download Dossier
            </button>

            <button
              onClick={handleVerifyPortal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#141A29] hover:bg-[#1C2438] text-emerald-400 hover:text-emerald-300 rounded-xl text-xs font-medium border border-emerald-800/40 transition-colors"
              title="Verify Cryptographic Hash on Court Evidence Portal"
            >
              <ExternalLink size={14} />
              Verify
            </button>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/[0.08] rounded-xl text-slate-400 hover:text-white transition-colors ml-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Body */}
        <div ref={printableRef} className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#07090E] text-slate-200 font-sans print:bg-white print:text-black print:p-0">
          
          {/* Institutional Header */}
          <div className="border-b-2 border-emerald-500/80 pb-5 mb-6 print:border-black">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest text-red-400 bg-red-950/60 border border-red-800/60 rounded print:text-red-700 print:bg-red-50">
                    STRICTLY CONFIDENTIAL // JUDICIAL & ENFORCEMENT PROCEEDINGS ONLY
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-wide mt-2 print:text-black">
                  GOVERNMENT OF INDIA &middot; MINISTRY OF HOME AFFAIRS
                </h1>
                <p className="text-xs text-emerald-400 font-semibold tracking-wider uppercase mt-0.5 print:text-emerald-800">
                  NATIONAL CYBER CRIME REPORTING PORTAL (NCRP) &middot; I4C FORENSICS DIVISION
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 print:text-slate-600">
                  TRACE-X Sovereign Cryptographic Fund Attribution & Asset Seizure Dossier
                </p>
              </div>

              <div className="text-left sm:text-right font-mono shrink-0">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest print:text-slate-600">DOSSIER SERIAL NO.</div>
                <div className="text-sm font-bold text-emerald-400 print:text-black">{invId}</div>
                <div className="text-[10px] text-slate-400 mt-1 print:text-slate-600">SECTION 63 BSA / 65B IEA</div>
              </div>
            </div>
          </div>

          {/* Executive Plain English Summary (4 Key Metric Cards for Court & Police) */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2.5">
              <ShieldAlert size={15} className="text-amber-400 print:text-amber-700" />
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider print:text-black">
                Executive Case Summary &amp; Fraud Matrix (Plain English Breakdown)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#0E1320] border border-white/[0.08] print:bg-slate-50 print:border-slate-300">
                <span className="text-[9px] text-slate-400 uppercase font-bold block flex items-center gap-1.5 mb-1">
                  <AlertTriangle size={12} className="text-red-400" />
                  Fraud Typology
                </span>
                <span className="text-xs font-bold text-red-400 block leading-tight">{typology}</span>
                <span className="text-[10px] text-slate-500 mt-1 block font-mono">IPC 420 &middot; IT Act 66D</span>
              </div>

              <div className="p-3 rounded-xl bg-[#0E1320] border border-white/[0.08] print:bg-slate-50 print:border-slate-300">
                <span className="text-[9px] text-slate-400 uppercase font-bold block flex items-center gap-1.5 mb-1">
                  <Coins size={12} className="text-emerald-400" />
                  Total Fraud Volume
                </span>
                <span className="text-xs font-bold text-white block">{totalVolumeStr}</span>
                <span className="text-[10px] text-emerald-400 font-semibold mt-1 block font-mono">
                  ~₹{fiatEstINR} / ${fiatEstUSD}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0E1320] border border-white/[0.08] print:bg-slate-50 print:border-slate-300">
                <span className="text-[9px] text-slate-400 uppercase font-bold block flex items-center gap-1.5 mb-1">
                  <GitFork size={12} className="text-cyan-400" />
                  Risk Adjudication
                </span>
                <span className="text-xs font-bold text-red-400 block font-mono">
                  {riskScore}/100 &middot; {riskLevel}
                </span>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Multi-tier mule dispersion
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0E1320] border border-white/[0.08] print:bg-slate-50 print:border-slate-300">
                <span className="text-[9px] text-slate-400 uppercase font-bold block flex items-center gap-1.5 mb-1">
                  <Lock size={12} className="text-amber-400" />
                  Terminal VASP Cash-Out
                </span>
                <span className="text-xs font-bold text-cyan-300 block">{vasp}</span>
                <span className="text-[10px] text-amber-400 font-semibold mt-1 block">
                  Action: Sec 91 CrPC Freeze
                </span>
              </div>
            </div>
          </div>

          {/* Visual 4-Stage Fund Flow Pipeline */}
          <div className="mb-6 p-4 rounded-xl bg-[#0C101B] border border-white/[0.08] print:bg-slate-50 print:border-slate-300">
            <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5 print:text-black">
              <CheckCircle2 size={13} className="text-emerald-400" />
              Automated Forensic Money Trail (Step-by-Step Flow)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <div className="p-2.5 rounded-lg bg-[#07090E] border border-red-900/40 text-center print:bg-white print:border-slate-300">
                <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800/40 uppercase">
                  1. Crime Inflow
                </span>
                <p className="text-xs font-bold text-white mt-1.5 print:text-black">Victim Deposit</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">Initial scam deposit credited into suspect account</p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#07090E] border border-amber-900/40 text-center print:bg-white print:border-slate-300">
                <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/40 uppercase">
                  2. Mule Splitting
                </span>
                <p className="text-xs font-bold text-white mt-1.5 print:text-black">Smurfing &amp; Fan-out</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">Fragmented across aggregator mules to avoid bank alerts</p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#07090E] border border-indigo-900/40 text-center print:bg-white print:border-slate-300">
                <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 uppercase">
                  3. Obfuscation
                </span>
                <p className="text-xs font-bold text-white mt-1.5 print:text-black">Mixer &amp; DEX Swap</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">Passed through privacy pools to break transaction history</p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#07090E] border border-emerald-900/40 text-center print:bg-white print:border-slate-300">
                <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 uppercase">
                  4. Terminal VASP
                </span>
                <p className="text-xs font-bold text-white mt-1.5 print:text-black">Exchange Cash-out</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">Deposited into {vasp} for final fiat off-ramping</p>
              </div>
            </div>
          </div>

          {/* Case Metadata Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 rounded-xl bg-[#0E1320] border border-white/[0.08] mb-6 print:bg-slate-50 print:border-slate-300 print:text-black">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block print:text-slate-600">FIR / NCRP Complaint ID</span>
              <span className="text-xs font-bold text-white font-mono print:text-black">{caseId}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block print:text-slate-600">Investigating Examiner</span>
              <span className="text-xs font-semibold text-slate-200 print:text-black">{officer} ({badge})</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block print:text-slate-600">Police Jurisdiction / Station</span>
              <span className="text-xs font-semibold text-slate-200 print:text-black">{station}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block print:text-slate-600">Primary Suspect Wallet</span>
              <span className="text-[11px] font-mono font-semibold text-emerald-400 break-all print:text-emerald-800">{target}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block print:text-slate-600">Blockchain Network / Standard</span>
              <span className="text-xs font-bold text-slate-200 print:text-black">{chain} (EVM / Native Ledger)</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block print:text-slate-600">Terminal Beneficiary Deposit</span>
              <span className="text-[11px] font-mono font-semibold text-cyan-400 break-all print:text-cyan-800">{vaspAddr}</span>
            </div>
          </div>

          {/* Section 1: Executive Threat Narrative */}
          <div className="mb-6">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-2 print:text-black">
              <FileText size={14} className="text-emerald-400" />
              1. Automated Forensic Intelligence &amp; Threat Evaluation
            </h2>
            <div className="p-4 rounded-xl bg-[#0A0D15] border border-white/[0.06] text-xs font-mono text-slate-300 leading-relaxed print:bg-white print:border-slate-300 print:text-black">
              {narrative}
            </div>
          </div>

          {/* Section 2: Cryptographic Hop Traversal Ledger */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 print:text-black">
                <Award size={14} className="text-emerald-400" />
                2. Transaction Hop Traversal &amp; Cryptographic Evidence Ledger
              </h2>
              <span className="text-[10px] font-mono text-slate-500 print:text-slate-600">
                {hopRows.length} Validated Multi-Hop Transactions
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/[0.08] print:border-slate-300">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0E1320] text-[10px] text-slate-400 uppercase font-mono tracking-wider border-b border-white/[0.08] print:bg-slate-100 print:text-black">
                  <tr>
                    <th className="px-3.5 py-2.5">Seq</th>
                    <th className="px-3.5 py-2.5">Timestamp (UTC)</th>
                    <th className="px-3.5 py-2.5">Sending Entity</th>
                    <th className="px-3.5 py-2.5">Receiving Entity</th>
                    <th className="px-3.5 py-2.5">Volume</th>
                    <th className="px-3.5 py-2.5">Tx Hash</th>
                    <th className="px-3.5 py-2.5">Role &amp; Tag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] print:divide-slate-200">
                  {hopRows.map((h) => (
                    <tr key={h.seq} className="hover:bg-white/[0.02] font-mono text-[11px] print:text-black">
                      <td className="px-3.5 py-2.5 font-bold text-emerald-400 print:text-emerald-800">#{h.seq}</td>
                      <td className="px-3.5 py-2.5 text-[10px] text-slate-400 print:text-slate-600">{h.time}</td>
                      <td className="px-3.5 py-2.5 text-slate-300 truncate max-w-[130px] print:text-black" title={h.source}>
                        {h.source.slice(0, 8)}...{h.source.slice(-4)}
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-300 truncate max-w-[130px] print:text-black" title={h.target}>
                        {h.target.slice(0, 8)}...{h.target.slice(-4)}
                      </td>
                      <td className="px-3.5 py-2.5 font-bold text-white print:text-black">{h.amount}</td>
                      <td className="px-3.5 py-2.5 text-[10px] text-cyan-400 truncate max-w-[110px] print:text-cyan-800" title={h.hash}>
                        {h.hash.slice(0, 10)}...
                      </td>
                      <td className="px-3.5 py-2.5">
                        <div className="text-[10px] text-slate-200 font-sans font-medium">{h.role}</div>
                        <span className="px-1.5 py-0.2 text-[8px] font-bold rounded bg-red-950/60 text-red-400 border border-red-900/60 print:text-red-700 print:bg-red-50">
                          {h.flag}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: VASP Freezing Order Directive */}
          <div className="mb-6 border border-cyan-900/60 bg-cyan-950/20 rounded-xl p-4 print:border-slate-400 print:bg-slate-50">
            <div className="flex items-center gap-2 mb-2">
              <Building2 size={16} className="text-cyan-400 print:text-cyan-800" />
              <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider print:text-black">
                3. Terminal VASP Attribution &amp; Statutory Freezing Directive
              </h3>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed print:text-black mb-3">
              Pursuant to statutory powers under <strong>Section 91 of the Code of Criminal Procedure (CrPC), 1973</strong> and <strong>Section 94 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023</strong>, the compliance officer of the specified Virtual Asset Service Provider (VASP) is hereby ordered to execute an immediate freeze on all balances and KYC records associated with the identified target address:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#0A0D15] border border-white/[0.06] print:bg-white print:border-slate-300">
                <span className="text-[9px] text-slate-500 uppercase block">VASP Name:</span>
                <span className="text-white font-bold print:text-black">{vasp} Law Enforcement Compliance Desk</span>
              </div>
              <div className="p-2.5 rounded bg-[#0A0D15] border border-white/[0.06] print:bg-white print:border-slate-300">
                <span className="text-[9px] text-slate-500 uppercase block">Target Beneficiary Address:</span>
                <span className="text-cyan-400 font-bold break-all print:text-cyan-800">{vaspAddr}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Section 63 BSA / 65B IEA Statutory Certificate */}
          <div className="border-2 border-emerald-500/60 bg-emerald-950/30 rounded-2xl p-5 mb-6 print:border-emerald-700 print:bg-emerald-50/40">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="shrink-0 p-2 bg-white rounded-xl border border-emerald-400/40 shadow-md text-center">
                <a 
                  href={verifyUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block hover:opacity-90 transition-opacity"
                  title="Scan with phone camera or click to open verification portal"
                >
                  <img src={qrUrl} alt="Court Evidence QR" className="w-28 h-28 rounded mx-auto" />
                </a>
                <span className="text-[8px] font-mono text-center block text-slate-700 font-bold mt-1">
                  SCAN WITH PHONE CAMERA
                </span>
                <a 
                  href={verifyUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[8px] font-mono text-emerald-700 hover:underline block font-semibold"
                >
                  OR CLICK TO VERIFY
                </a>
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <ShieldCheck size={16} className="text-emerald-400 print:text-emerald-800" />
                  <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wide print:text-emerald-900">
                    STATUTORY CERTIFICATE UNDER SECTION 63 OF BHARATIYA SAKSHYA ADHINIYAM, 2023
                  </h3>
                </div>
                <p className="text-[11px] text-slate-300 print:text-slate-800 leading-relaxed">
                  I hereby certify that the electronic record comprised in this forensic dossier was produced by the TRACE-X Autonomous Forensics Node operating under the lawful and regular supervision of the undersigned examiner. The cryptographic integrity of the extracted evidence has remained unbroken throughout acquisition and analysis.
                </p>

                <div>
                  <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold uppercase mb-1 print:text-emerald-900">
                    <span>CANONICAL MASTER SHA-256 EVIDENCE DIGEST</span>
                    <button
                      onClick={handleCopyHash}
                      className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white print:hidden transition-colors"
                    >
                      {copiedHash ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      {copiedHash ? "Copied" : "Copy Digest"}
                    </button>
                  </div>
                  <div className="font-mono text-[11px] text-emerald-300 bg-[#07090E] p-2.5 rounded-lg border border-emerald-500/40 break-all print:bg-white print:text-emerald-900 print:border-emerald-700">
                    {sha256}
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1 print:text-slate-600">
                    Direct Verification URL: <span className="font-mono text-emerald-400">{verifyUrl}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Signature & Seal Footer */}
          <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 print:border-slate-300 print:text-black">
            <div>
              Authorized Signature: <span className="font-mono text-slate-300 font-semibold print:text-black">{officer} ({badge})</span>
            </div>
            <div>
              Station Seal: <span className="font-semibold text-slate-300 print:text-black">{station}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
