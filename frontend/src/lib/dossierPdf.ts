export interface DossierData {
  investigation_id?: string;
  case_id?: string;
  target_address?: string;
  chain?: string;
  typology?: string;
  risk_score?: number;
  risk_level?: string;
  officer_name?: string;
  badge?: string;
  police_station?: string;
  vasp_name?: string;
  vasp_address?: string;
  canonical_sha256?: string;
  narrative?: string;
  nodes_count?: number;
  edges_count?: number;
}

export function openReportDossier(data: DossierData = {}) {
  const invId = data.investigation_id || "INV-2024-MH-00441";
  const caseId = data.case_id || "NCRP/2024/MH/00441";
  const target = data.target_address || "0xFraud_Origin_Task_Scam";
  const chain = data.chain || "ETH";
  const typology = data.typology || "Task Scam / Deposit Multi-Hop Sweep";
  const riskScore = data.risk_score !== undefined ? data.risk_score : 100;
  const riskLevel = data.risk_level || "CRITICAL";
  const officer = data.officer_name || "Insp. Aditya Prashant Deshmukh";
  const badge = data.badge || "MH-CYB-2241";
  const station = data.police_station || "State Cyber Police Station, CID Pune HQ";
  const vasp = data.vasp_name || "OKX / Binance Exchange Cluster";
  const vaspAddr = data.vasp_address || "0x28C6c06298d514Db089934071355E5743bf21d60";
  const sha256 = data.canonical_sha256 || "d08037a48e707bd78fc32cf064ca98de9b618e86d683f474b920856df58c8d60";
  const narrative = data.narrative || "Forensic analysis confirms high-velocity fund dissipation originating from initial victim deposit. Proceeds moved through intermediate mule layers before partial mixing in Tornado Cash and final deposit into centralized exchange infrastructure.";
  const dateStr = new Date().toUTCString();

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
    `https://adityadeshmukh911.github.io/Trace-X/?verify=${sha256}`
  )}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>TRACE-X Forensic Dossier - ${caseId}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      color: #0f172a;
      background: #f8fafc;
      margin: 0;
      padding: 24px;
      font-size: 13px;
      line-height: 1.5;
    }
    .print-bar {
      background: #0f172a;
      color: #fff;
      padding: 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 12px;
      margin-bottom: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .print-btn {
      background: #059669;
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .print-btn:hover { background: #047857; }
    .sheet {
      background: #ffffff;
      padding: 36px;
      border-radius: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.06);
      border: 1px solid #e2e8f0;
      max-width: 820px;
      margin: 0 auto;
    }
    .header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 14px;
      margin-bottom: 20px;
    }
    .badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      font-family: monospace;
      color: #b91c1c;
      background: #fee2e2;
      border: 1px solid #fca5a5;
      padding: 2px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      background: #f1f5f9;
      padding: 14px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .meta-item span {
      display: block;
      font-size: 10px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 600;
    }
    .meta-item strong {
      font-size: 13px;
      color: #0f172a;
    }
    .section-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0f172a;
      border-left: 4px solid #059669;
      padding-left: 8px;
      margin: 20px 0 10px 0;
    }
    .narrative-box {
      background: #fafafa;
      border: 1px solid #e5e7eb;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      color: #334155;
    }
    .cert-box {
      border: 2px dashed #059669;
      background: #ecfdf5;
      padding: 18px;
      border-radius: 10px;
      margin-top: 24px;
      display: flex;
      gap: 20px;
      align-items: center;
    }
    .hash-text {
      word-break: break-all;
      font-family: monospace;
      font-size: 11px;
      color: #047857;
      background: #ffffff;
      padding: 8px;
      border-radius: 6px;
      border: 1px solid #a7f3d0;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .print-bar { display: none; }
      .sheet { border: none; box-shadow: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <div>
      <strong>TRACE-X Forensic Intelligence Report Viewer</strong>
      <span style="opacity: 0.7; margin-left: 10px; font-size: 11px;">MHA NCRP ENCLAVE &middot; CERTIFIED RECORD</span>
    </div>
    <button class="print-btn" onclick="window.print()">&#128438; Print / Save as PDF</button>
  </div>

  <div class="sheet">
    <div class="header">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <span class="badge">CONFIDENTIAL // LAW ENFORCEMENT & JUDICIAL ADMISSIBILITY ONLY</span>
          <h1 style="margin: 8px 0 2px 0; font-size: 22px; color: #0f172a; font-weight: 800;">
            TRACE-X FORENSIC INTELLIGENCE DOSSIER
          </h1>
          <p style="margin: 0; color: #64748b; font-size: 12px;">
            Statutory Crypto Fund Attribution & Electronic Evidence Record
          </p>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 11px; color: #64748b;">REF ID</div>
          <div style="font-family: monospace; font-weight: 700; color: #059669; font-size: 14px;">${invId}</div>
        </div>
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-item">
        <span>FIR / NCRP Complaint ID</span>
        <strong>${caseId}</strong>
      </div>
      <div class="meta-item">
        <span>Investigating Officer</span>
        <strong>${officer} (${badge})</strong>
      </div>
      <div class="meta-item">
        <span>Police Jurisdiction</span>
        <strong>${station}</strong>
      </div>
      <div class="meta-item">
        <span>Examination Timestamp</span>
        <strong>${dateStr}</strong>
      </div>
      <div class="meta-item">
        <span>Target Origin Wallet</span>
        <strong style="font-family: monospace; font-size: 11px;">${target} (${chain})</strong>
      </div>
      <div class="meta-item">
        <span>Attributed Fraud Typology</span>
        <strong style="color: #b91c1c;">${typology} (Score: ${riskScore}/100 - ${riskLevel})</strong>
      </div>
    </div>

    <div class="section-title">1. Forensic Intelligence & Threat Summary</div>
    <div class="narrative-box">
      ${narrative}
    </div>

    <div class="section-title">2. Terminal VASP Attribution & Immediate Freezing Directive</div>
    <table style="width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px;">
      <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px; font-weight: 600; color: #64748b;">Attributed VASP / Exchange</td>
        <td style="padding: 8px; font-weight: 700; color: #0f172a;">${vasp}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px; font-weight: 600; color: #64748b;">Target Deposit Address</td>
        <td style="padding: 8px; font-family: monospace;">${vaspAddr}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px; font-weight: 600; color: #64748b;">Statutory Enforcement Action</td>
        <td style="padding: 8px; color: #b91c1c; font-weight: 700;">
          Direct Emergency Account Freeze under Section 91 CrPC & Section 94 BNSS (2023)
        </td>
      </tr>
    </table>

    <div class="cert-box">
      <img src="${qrUrl}" alt="Verification QR" style="width: 110px; height: 110px; border-radius: 8px; border: 1px solid #a7f3d0;" />
      <div style="flex: 1;">
        <strong style="color: #065f46; font-size: 13px; display: block; margin-bottom: 4px;">
          STATUTORY CERTIFICATE UNDER SECTION 63 OF BHARATIYA SAKSHYA ADHINIYAM, 2023
        </strong>
        <p style="margin: 0 0 8px 0; font-size: 11px; color: #047857; line-height: 1.4;">
          This electronic record has been produced by the TRACE-X Autonomous Forensics Node operating under cryptographic supervision of the undersigned examiner. The integrity of this electronic data trail has remained unbroken.
        </p>
        <div style="font-size: 10px; color: #065f46; margin-bottom: 3px; font-weight: 600;">CANONICAL SHA-256 MASTER EVIDENCE HASH:</div>
        <div class="hash-text">${sha256}</div>
      </div>
    </div>

    <div style="margin-top: 24px; padding-top: 14px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 11px; color: #64748b;">
      <div>Authorized Officer Signature: _______________________</div>
      <div>Official Seal: State Cyber Police Station</div>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const blobUrl = URL.createObjectURL(blob);
  const win = window.open(blobUrl, "_blank");
  if (!win) {
    window.location.href = blobUrl;
  }
}
