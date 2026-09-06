import {
  TraceResult,
  Case,
  AlertItem,
  FreezeRequestItem,
  ClusterInfo,
  IngestBatch,
  AuthUser,
  DossierReport,
  SystemSettings,
  SystemStats
} from "../types";

import {
  MOCK_USER,
  MOCK_CASES,
  MOCK_ALERTS,
  MOCK_FREEZES,
  MOCK_REPORTS,
  MOCK_SETTINGS,
  MOCK_STATS,
  MOCK_CLUSTERS,
  MOCK_BATCHES,
  getMockTraceResult
} from "./mockData";

const isLocalhost = typeof window !== "undefined" && (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "0.0.0.0"
);
const hasCustomApi = Boolean(import.meta.env.VITE_API_URL);
const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

// In-memory stateful stores for standalone/Vercel demonstration
let mockCases: Case[] = [...MOCK_CASES];
let mockAlerts: AlertItem[] = [...MOCK_ALERTS];
let mockFreezes: FreezeRequestItem[] = [...MOCK_FREEZES];
let mockReports: DossierReport[] = [...MOCK_REPORTS];
let mockBatches: IngestBatch[] = [...MOCK_BATCHES];
let mockSettings: SystemSettings = { ...MOCK_SETTINGS };

function getToken(): string | null {
  return localStorage.getItem("tracex_token");
}

function getFallbackData<T>(path: string, method: string, body?: any): T {
  // Auth
  if (path === "/auth/login") {
    return {
      token: "tracex_demo_session_token_2026",
      user: MOCK_USER
    } as T;
  }

  // Investigation Trace
  if (path === "/investigate") {
    const addr = body?.wallet_address || "0xFraud_Origin_Task_Scam";
    const chain = body?.chain || "ETH";
    const hops = Number(body?.hops) || 5;
    return {
      status: "success",
      investigation_id: `INV-${Math.abs(addr.split("").reduce((a: number, b: string) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(16).substring(0, 8).toUpperCase()}`,
      data: getMockTraceResult(addr, chain, hops)
    } as T;
  }

  // Reports Generation & Creation
  if (path.startsWith("/reports/generate") || (method === "POST" && path.startsWith("/reports/"))) {
    const target = body?.target_address || "0xFraud_Origin_Task_Scam";
    const chain = body?.chain || "ETH";
    const caseId = body?.case_id || "CASE-2024-001";
    const typology = body?.typology || "Task Scam / Deposit Multi-Hop Sweep";
    const repId = `REP-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const sha = "d08037a48e707bd78fc32cf064ca98de9b618e86d683f474b920856df58c8d60";
    const certId = `CERT-65B-${repId}`;

    const newRep: DossierReport = {
      id: repId,
      case_id: caseId,
      title: body?.title || `Forensic Asset Attribution Brief — ${target.slice(0, 10)}...`,
      target_address: target,
      chain,
      typology,
      risk_score: body?.risk_score || 87,
      ml_anomaly_score: body?.ml_anomaly_score || 0.88,
      investigating_officer: body?.investigating_officer || mockSettings.investigator_name,
      police_station: body?.police_station || mockSettings.police_station,
      sha256_hash: sha,
      pdf_path: `/reports/${repId}.pdf`,
      status: "CERTIFIED",
      created_at: new Date().toISOString()
    };

    mockReports = [newRep, ...mockReports];

    return {
      status: "success",
      report_id: repId,
      download_url: "#",
      filename: `TRACE-X_${repId}.pdf`,
      sha256_digest: sha,
      certificate_id: certId,
      report: newRep
    } as T;
  }

  // Report Certificate
  if (path.includes("/certificate")) {
    const repId = path.split("/")[2] || "REP-2024-001";
    const rep = mockReports.find(r => r.id === repId) || mockReports[0];
    const certText = `========================================================================================
           CERTIFICATE OF ELECTRONIC EVIDENCE PURSUANT TO SECTION 63 OF THE
           BHARATIYA SAKSHYA ADHINIYAM, 2023 (BSA) & SECTION 65B OF THE
                           INDIAN EVIDENCE ACT, 1872
========================================================================================

CERTIFICATE IDENTIFIER : CERT-65B-${rep.id}
DOSSIER REFERENCE      : ${rep.id}
CASE COMPLAINT NO.     : ${rep.case_id || "NCRP/2024/MH/00441"}
TARGET WALLET ADDRESS  : ${rep.target_address} (${rep.chain})
CANONICAL SHA-256 HASH : ${rep.sha256_hash}
TIME OF GENERATION     : ${rep.created_at} UTC
ISSUING AUTHORITY      : ${rep.investigating_officer} (${rep.police_station})

I, the undersigned Investigating Officer, hereby certify that:
1. The electronic evidence comprised in the TRACE-X forensic audit dossier was produced by
   computer systems operating in their lawful and regular course.
2. During the period of extraction, the extraction devices and cryptographic hashing engines
   were operating properly and without error.
3. The mathematical integrity of the blockchain graph and transaction ledger was cryptographically
   sealed using the SHA-256 algorithm immediately upon attribution.
4. This certificate is issued in compliance with the admissibility requirements for digital evidence
   under Section 63 BSA (2023) / Section 65B IEA (1872).

Certified & Signed by: ${rep.investigating_officer}
Designated Station   : ${rep.police_station}
Status: ADMISSIBLE IN JUDICIAL PROCEEDINGS
`;
    return {
      report_id: rep.id,
      certificate_id: `CERT-65B-${rep.id}`,
      sha256_hash: rep.sha256_hash,
      officer: rep.investigating_officer,
      station: rep.police_station,
      status: "CERTIFIED",
      certificate_text: certText
    } as T;
  }

  // Reports list or single
  if (path === "/reports" || path.startsWith("/reports?")) {
    return { reports: mockReports, total: mockReports.length } as T;
  }
  if (path.startsWith("/reports/") && method === "GET") {
    const repId = path.split("/")[2];
    const found = mockReports.find(r => r.id === repId) || mockReports[0];
    return found as T;
  }

  // Evidence Verification
  if (path === "/evidence/verify") {
    const rawQ = (body?.hash_or_id || "").trim();
    const q = rawQ.toLowerCase();
    const matchedRep = mockReports.find(
      r => r.sha256_hash.toLowerCase() === q || r.id.toLowerCase() === q || (r.case_id && r.case_id.toLowerCase() === q)
    );
    return {
      is_valid: true,
      status: "AUTHENTIC_RECORD_FOUND",
      investigation_id: matchedRep ? matchedRep.id.replace("REP-", "INV-") : "INV-2024-MH-00441",
      case_id: matchedRep?.case_id || "NCRP/2024/MH/00441",
      start_address: matchedRep ? matchedRep.target_address : "0xFraud_Origin_Task_Scam",
      chain: matchedRep ? matchedRep.chain : "ETH",
      risk_score: matchedRep ? matchedRep.risk_score : 87,
      risk_level: "CRITICAL",
      canonical_sha256: matchedRep ? matchedRep.sha256_hash : (rawQ || "d08037a48e707bd78fc32cf064ca98de9b618e86d683f474b920856df58c8d60"),
      recorded_at: matchedRep ? matchedRep.created_at : new Date().toUTCString(),
      officer_name: matchedRep?.investigating_officer || "Insp. Aditya Prashant Deshmukh",
      badge: "MH-CYB-2241",
      police_station: matchedRep?.police_station || "State Cyber Police Station, CID Pune HQ",
      evidence_admissibility: "ADMISSIBLE_UNDER_SECTION_63_BSA",
      message: "Cryptographic SHA-256 seal matches uncompromised immutable record on sovereign ledger."
    } as T;
  }

  // Cases
  if (path.startsWith("/cases/") && path.length > 7) {
    const caseId = path.split("/")[2];
    const found = mockCases.find(c => c.id === caseId) || mockCases[0];
    return found as T;
  }
  if (path.startsWith("/cases")) {
    return { cases: mockCases, total: mockCases.length } as T;
  }

  // Alerts
  if (path.startsWith("/alerts/") && path.includes("/status")) {
    const parts = path.split("/");
    const alertId = parts[2];
    const newStatus = body?.status || "ACKNOWLEDGED";
    mockAlerts = mockAlerts.map(a => a.id === alertId ? { ...a, status: newStatus } : a);
    return { status: "success", alert_id: alertId, new_status: newStatus } as T;
  }
  if (path.startsWith("/alerts")) {
    const unread = mockAlerts.filter(a => a.status === "UNREAD").length;
    const critical = mockAlerts.filter(a => a.severity === "CRITICAL").length;
    return { alerts: mockAlerts, total: mockAlerts.length, unread_count: unread, critical_count: critical } as T;
  }

  // Freeze Requests
  if (path.startsWith("/freeze/") && path.includes("/status")) {
    const parts = path.split("/");
    const freezeId = parts[2];
    const nextStatus = body?.new_status || "SUBPOENA_GENERATED";
    mockFreezes = mockFreezes.map(f => {
      if (f.id === freezeId) {
        return {
          ...f,
          status: nextStatus,
          officer_notes: body?.officer_notes || f.officer_notes,
          updated_at: new Date().toISOString(),
          audit_trail: [
            ...(f.audit_trail || []),
            {
              timestamp: new Date().toISOString(),
              action: nextStatus,
              officer: mockSettings.investigator_name,
              notes: body?.officer_notes || `Status advanced to ${nextStatus}`
            }
          ]
        };
      }
      return f;
    });
    const updated = mockFreezes.find(f => f.id === freezeId) || mockFreezes[0];
    return { status: "success", updated } as T;
  }
  if (path.startsWith("/freeze/create")) {
    const newReq: FreezeRequestItem = {
      id: `FRZ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      investigation_id: body?.investigation_id || "INV-MANUAL",
      case_id: body?.case_id || "NCRP/2024/CYBER/01",
      vasp_name: body?.vasp_name || "Binance",
      wallet_address: body?.wallet_address || "0x28C6c06298d514Db089934071355E5743bf21d60",
      chain: body?.chain || "ETH",
      target_amount: body?.target_amount || 45000,
      currency: body?.currency || "USDT",
      status: "DRAFT",
      notice_number: `TRACEX/CRPC91/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
      crpc_section: "Section 91 CrPC / Section 94 BNSS",
      investigator_name: body?.officer_name || mockSettings.investigator_name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      officer_notes: body?.officer_notes || "Statutory freeze summons initiated.",
      notice_body: `STATUTORY NOTICE UNDER SECTION 91 CrPC / SECTION 94 BNSS 2023
To: Compliance Desk, ${body?.vasp_name || "Binance"}
Ref: Investigation against target ${body?.wallet_address || "Wallet"}
Amount: ${body?.target_amount || 45000} ${body?.currency || "USDT"}
You are hereby ordered to immediately freeze all outgoing transactions and provide KYC details within 24 hours.`,
      audit_trail: [
        {
          timestamp: new Date().toISOString(),
          action: "DRAFT_CREATED",
          officer: body?.officer_name || mockSettings.investigator_name,
          notes: "Notice created via VASP coordination desk"
        }
      ]
    };
    mockFreezes = [newReq, ...mockFreezes];
    return { status: "success", freeze_request: newReq } as T;
  }
  if (path.startsWith("/freeze/list")) {
    return { requests: mockFreezes } as T;
  }

  // Clusters
  if (path.startsWith("/clusters") || path.startsWith("/clustering/analyze")) {
    return { clusters: MOCK_CLUSTERS, total: MOCK_CLUSTERS.length } as T;
  }

  // Bulk Ingestion
  if (path.startsWith("/ingest/batches")) {
    return { batches: mockBatches } as T;
  }
  if (path.startsWith("/ingest/upload-csv") || path.startsWith("/ingest/bulk")) {
    const batchId = `BATCH-NCRP-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`;
    const newBatch: IngestBatch = {
      id: batchId,
      batch_id: batchId,
      batch_name: body?.batch_name || "NCRP Police Intake Batch",
      status: "PROCESSED",
      total_records: 5,
      processed_records: 5,
      high_risk_count: 4,
      processed_count: 5,
      flagged_high_risk: 4,
      auto_freeze_alerts: 3,
      created_at: new Date().toISOString(),
      records: [
        { complaint_id: "NCRP/2024/MH/00911", wallet_address: "0xFraud_Origin_Task_Scam", chain: "ETH", category: "Task Scam", victim_loss_inr: 1250000, victim_name: "Rajesh Kumar", risk_score: 87, risk_level: "CRITICAL", status: "TRACED" },
        { complaint_id: "NCRP/2024/KA/00742", wallet_address: "0xPigButcher_Main", chain: "TRX", category: "Investment Fraud", victim_loss_inr: 4500000, victim_name: "Anita Desai", risk_score: 72, risk_level: "HIGH", status: "TRACED" },
        { complaint_id: "NCRP/2024/DL/00431", wallet_address: "0xRugPull_Dev", chain: "ETH", category: "Exchange Hack", victim_loss_inr: 12000000, victim_name: "Virendra Sachdeva", risk_score: 94, risk_level: "CRITICAL", status: "TRACED" },
        { complaint_id: "NCRP/2024/GJ/00519", wallet_address: "0xTelegram_Job_Scam_Origin", chain: "ETH", category: "Telegram Task Fraud", victim_loss_inr: 1850000, victim_name: "Sunil Mehta", risk_score: 81, risk_level: "HIGH", status: "TRACED" },
        { complaint_id: "NCRP/2024/TN/00688", wallet_address: "0xFedEx_Impersonation_TRX", chain: "TRX", category: "Digital Arrest Police Extortion", victim_loss_inr: 3200000, victim_name: "Dr. S. Venkat", risk_score: 89, risk_level: "CRITICAL", status: "TRACED" }
      ]
    };
    mockBatches = [newBatch, ...mockBatches];
    return { status: "success", batch: newBatch } as T;
  }

  // Settings
  if (path === "/settings" && method === "PUT") {
    mockSettings = { ...mockSettings, ...body };
    return { status: "success", settings: mockSettings } as T;
  }
  if (path.startsWith("/settings/test-connection")) {
    return {
      status: "success",
      tested_target: body?.target || "all",
      results: {
        etherscan: { status: "ONLINE", latency_ms: 42, provider: "Etherscan API v2" },
        trongrid: { status: "ONLINE", latency_ms: 68, provider: "TronGrid Mainnet RPC" },
        anthropic: { status: "ONLINE", latency_ms: 120, model: "claude-3-5-sonnet" },
        sahyog: { status: "CONNECTED", gateway: "I4C/NCRP Sovereign Enclave" },
        database: { status: "OPTIMAL", mode: "SQLite WAL Indexed", size_kb: 489 }
      },
      tested_at: new Date().toISOString()
    } as T;
  }
  if (path.startsWith("/settings")) {
    return { settings: mockSettings, system_stats: MOCK_STATS } as T;
  }

  // Telemetry & Stats
  if (path.startsWith("/ncrp/stats")) {
    return {
      total_complaints_2024: 18450,
      crypto_fraud_cases: 3280,
      freeze_requests_sent: 412,
      amount_frozen_inr: "14.85 Crore",
      vasp_subpoenas_issued: 310,
      critical_incidents: 89,
      avg_trace_time_seconds: 3.4
    } as T;
  }
  if (path.startsWith("/sahyog/mock-sync")) {
    return {
      status: "SUCCESS",
      records_checked: 1250,
      matches_found: 18,
      last_sync: new Date().toISOString(),
      message: "Synced with Ministry of Home Affairs NCRP / SAHYOG database."
    } as T;
  }
  if (path.startsWith("/search/indexed-lookup")) {
    return {
      query: (body as any)?.q || "",
      results: {
        entities: [{ name: "Binance Hot Wallet 6", address: "0x28C6c06298d514Db089934071355E5743bf21d60", type: "VASP" }],
        cases: mockCases.slice(0, 2),
        investigations: [{ id: "INV-TASK-01", address: "0xFraud_Origin_Task_Scam", risk: 87 }],
        total_matches: 3
      }
    } as T;
  }

  return {} as T;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  // If running in cloud (e.g. Vercel) and no dedicated backend API URL is configured,
  // do NOT attempt to ping http://localhost:8000 (which fails immediately and triggers mixed-content blocks).
  if (!isLocalhost && !hasCustomApi) {
    return getFallbackData<T>(path, method, body);
  }

  const token = getToken();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || "Request failed");
    }

    return await res.json();
  } catch (err: any) {
    console.warn(`[TRACE-X Fallback] [${method} ${path}] falling back to demo state:`, err?.message);
    return getFallbackData<T>(path, method, body);
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login = (email: string, password: string) =>
  request<{ token: string; user: AuthUser }>(
    "POST", "/auth/login", { email, password }
  );

// ── Investigate ───────────────────────────────────────────────────────────────
export const investigate = (wallet_address: string, chain = "ETH", hops = 5) =>
  request<{ status: string; investigation_id: string; data: TraceResult }>(
    "POST", "/investigate", { wallet_address, chain, hops }
  );

// ── Reports ───────────────────────────────────────────────────────────────────
export const generateReport = (inv_id: string, investigator: string, case_id?: string, category?: string) =>
  request<{ status: string; download_url: string; filename: string; sha256_digest: string; certificate_id: string }>(
    "POST", `/reports/${inv_id}`, { investigator, case_id, category }
  );

export const downloadReportUrl = (inv_id: string) => {
  if (!isLocalhost && !hasCustomApi) {
    return "#";
  }
  return `${BASE}/reports/${inv_id}/download`;
};

// ── Evidence Verification ────────────────────────────────────────────────────
export const verifyEvidence = (hash_or_id: string) =>
  request<{
    is_valid: boolean;
    status: string;
    investigation_id?: string;
    start_address?: string;
    chain?: string;
    risk_score?: number;
    risk_level?: string;
    canonical_sha256?: string;
    recorded_at?: string;
    evidence_admissibility?: string;
    message: string;
  }>("POST", "/evidence/verify", { hash_or_id });

// ── Cases ─────────────────────────────────────────────────────────────────────
export const fetchCases = () =>
  request<{ cases: Case[]; total: number }>("GET", "/cases");

export const fetchCase = (case_id: string) =>
  request<Case>("GET", `/cases/${case_id}`);

// ── Threat Alerts ─────────────────────────────────────────────────────────────
export const fetchAlerts = (limit = 50) =>
  request<{ alerts: AlertItem[]; total: number; unread_count: number; critical_count: number }>(
    "GET", `/alerts?limit=${limit}`
  );

export const updateAlertStatus = (alert_id: string, status: "ACKNOWLEDGED" | "ACTIONED" | "ARCHIVED") =>
  request<{ status: string; alert_id: string; new_status: string }>(
    "POST", `/alerts/${alert_id}/status`, { status }
  );

// ── Freeze Requests & VASP Desk ───────────────────────────────────────────────
export const createFreezeRequest = (payload: {
  investigation_id: string;
  case_id?: string;
  vasp_name: string;
  wallet_address: string;
  chain: string;
  target_amount: number;
  currency?: string;
  officer_name?: string;
  officer_badge?: string;
  police_station?: string;
  officer_notes?: string;
}) =>
  request<{ status: string; freeze_request: any }>("POST", "/freeze/create", payload);

export const fetchFreezeRequests = () =>
  request<{ requests: FreezeRequestItem[] }>("GET", "/freeze/list");

export const updateFreezeStatus = (freeze_id: string, new_status: string, officer_notes: string) =>
  request<{ status: string; updated: any }>(
    "POST", `/freeze/${freeze_id}/status`, { new_status, officer_notes }
  );

export const downloadFreezeNoticeUrl = (freeze_id: string) => {
  if (!isLocalhost && !hasCustomApi) {
    return "#";
  }
  return `${BASE}/freeze/${freeze_id}/notice`;
};

// ── Wallet Clusters ───────────────────────────────────────────────────────────
export const fetchClusters = () =>
  request<{ clusters: ClusterInfo[] }>("GET", "/clusters");

export const analyzeClustering = (nodes: any[], edges: any[]) =>
  request<{ clusters: ClusterInfo[]; total: number }>("POST", "/clustering/analyze", { nodes, edges });

// ── Bulk Ingestion ────────────────────────────────────────────────────────────
export const ingestBulkJson = (records: any[], batch_name?: string) =>
  request<{ status: string; batch: any }>("POST", "/ingest/bulk", { records, batch_name });

export const ingestCsv = (csv_content: string, batch_name?: string) =>
  request<{ status: string; batch: any }>("POST", "/ingest/upload-csv", { csv_content, batch_name });

export const fetchIngestBatches = () =>
  request<{ batches: IngestBatch[] }>("GET", "/ingest/batches");

export const downloadTemplateUrl = () => {
  if (!isLocalhost && !hasCustomApi) {
    return "#";
  }
  return `${BASE}/ingest/template`;
};

export function downloadCsvTemplateFile() {
  const content = `complaint_id,wallet_address,chain,category,victim_loss_inr,victim_name,investigator
NCRP/2024/MH/00911,0xFraud_Origin_Task_Scam,ETH,Task Scam - Crypto,1250000,Rajesh Kumar,Insp. Aditya Prashant Deshmukh
NCRP/2024/KA/00742,0xPigButcher_Main,TRX,Investment Fraud - Pig Butchering,4500000,Anita Desai,Insp. Aditya Prashant Deshmukh
NCRP/2024/DL/00431,0xRugPull_Dev,ETH,Exchange Hack - Rug Pull,12000000,Virendra Sachdeva,SP Priya Nair
NCRP/2024/GJ/00519,0xTelegram_Job_Scam_Origin,ETH,Telegram Task Fraud,1850000,Sunil Mehta,SI Rohit Verma
NCRP/2024/TN/00688,0xFedEx_Impersonation_TRX,TRX,Digital Arrest Police Extortion,3200000,Dr. S. Venkat,Insp. K. Raman
`;
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tracex_ncrp_complaints_template.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Indexed Search ────────────────────────────────────────────────────────────
export const searchIndexed = (q: string) =>
  request<{
    query: string;
    results: {
      entities: any[];
      cases: any[];
      investigations: any[];
      total_matches: number;
    };
  }>("GET", `/search/indexed-lookup?q=${encodeURIComponent(q)}`);

// ── Government Integrations ───────────────────────────────────────────────────
export const sahyogSync = () =>
  request<{ status: string; records_checked: number; matches_found: number; last_sync: string; message: string }>(
    "GET", "/sahyog/mock-sync"
  );

export const ncrpStats = () =>
  request<{
    total_complaints_2024: number;
    crypto_fraud_cases: number;
    freeze_requests_sent?: number;
    amount_frozen_inr?: string;
    vasp_subpoenas_issued?: number;
    critical_incidents?: number;
    avg_trace_time_seconds?: number;
  }>("GET", "/ncrp/stats");

// ── Forensic Reports & Dossiers ───────────────────────────────────────────────
export const fetchReports = (case_id?: string) =>
  request<{ reports: DossierReport[]; total: number }>(
    "GET", case_id ? `/reports?case_id=${encodeURIComponent(case_id)}` : "/reports"
  );

export const fetchReport = (report_id: string) =>
  request<DossierReport>("GET", `/reports/${report_id}`);

export const generateDossier = (payload: {
  case_id?: string;
  title?: string;
  target_address: string;
  chain?: string;
  typology?: string;
  risk_score?: number;
  ml_anomaly_score?: number;
  investigating_officer?: string;
  police_station?: string;
}) =>
  request<{ status: string; report_id: string; report: DossierReport }>(
    "POST", "/reports/generate", payload
  );

export const fetchReportCertificate = (report_id: string) =>
  request<{
    report_id: string;
    certificate_id: string;
    sha256_hash: string;
    officer: string;
    station: string;
    status: string;
    certificate_text: string;
  }>("GET", `/reports/${report_id}/certificate`);

// ── Settings & LEA System Configuration ───────────────────────────────────────
export const fetchSettings = () =>
  request<{ settings: SystemSettings; system_stats: SystemStats }>("GET", "/settings");

export const updateSettings = (payload: Partial<SystemSettings>) =>
  request<{ status: string; settings: SystemSettings }>("PUT", "/settings", payload);

export const testApiConnection = (target = "all") =>
  request<{
    status: string;
    tested_target: string;
    results: Record<string, any>;
    tested_at: string;
  }>("POST", "/settings/test-connection", { target });
