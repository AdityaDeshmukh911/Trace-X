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

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

function getToken(): string | null {
  return localStorage.getItem("tracex_token");
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }

  return res.json();
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

export const downloadReportUrl = (inv_id: string) =>
  `${BASE}/reports/${inv_id}/download`;

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

export const downloadFreezeNoticeUrl = (freeze_id: string) =>
  `${BASE}/freeze/${freeze_id}/notice`;

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

export const downloadTemplateUrl = () =>
  `${BASE}/ingest/template`;

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

