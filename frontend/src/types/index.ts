export type NodeType = "SUSPECT" | "MIXER" | "EXCHANGE" | "BRIDGE" | "DEX" | "UNKNOWN";
export type RiskLevel = "CRITICAL" | "HIGH" | "ELEVATED";
export type Severity  = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type CaseStatus = "ACTIVE" | "PENDING" | "CLOSED";
export type FreezeStatus = "DRAFT" | "SUBPOENA_GENERATED" | "FREEZE_REQUESTED" | "VASP_ACKNOWLEDGED" | "ASSETS_FROZEN" | "REJECTED";

export interface TraceNode {
  id: string;
  type: NodeType;
  label: string;
  chain: string;
  is_suspect: boolean;
  hop_distance: number;
  cluster_id?: string;
  sanction_status?: string;
  confidence?: number;
  vasp_name?: string;
  vasp_jurisdiction?: string;
  first_seen?: string;
  tx_count?: number;
  risk_flags?: string[];
}

export interface TraceEdge {
  id: string;
  source: string;
  target: string;
  amount: number;
  timestamp: string;
  chain: string;
  hash: string;
}

export interface RiskFactor {
  factor: string;
  points: number;
  description: string;
  severity: Severity;
  icon: string;
}

export interface VASPMatch {
  name: string;
  label: string;
  address: string;
  confidence: number;
  confidence_pct: string;
  distance_hops: number;
  chain: string;
  jurisdiction: string;
  action: string;
}

export interface Intelligence {
  risk_score: number;
  risk_level: RiskLevel;
  risk_factors: RiskFactor[];
  vasp: VASPMatch | null;
  secondary_vasps: VASPMatch[];
  chains_involved: string[];
  total_transactions: number;
  total_nodes: number;
  has_mixer: boolean;
  has_cross_chain: boolean;
  max_hop_depth: number;
}

export interface TraceMetadata {
  start_address: string;
  chain: string;
  total_nodes: number;
  total_edges: number;
  max_hop_depth: number;
  timestamp: string;
}

export interface TypologyClassification {
  typology_code: string;
  typology_name: string;
  confidence: number;
  confidence_pct: string;
  threat_actor: string;
  legal_classification: string;
  indicators: string[];
  investigative_sop: string[];
}

export interface MLAnomalyData {
  ml_anomaly_index: number;
  anomaly_tier: string;
  z_score_velocity: string;
  value_entropy_index: number;
  graph_centrality_skew: number;
  model_description: string;
  explanations: string[];
}

export interface EvidenceData {
  canonical_sha256: string;
  certificate_65b: {
    certificate_id: string;
    statutory_act: string;
    sha256_digest: string;
    verification_status: string;
    timestamp: string;
    certifying_officer: string;
    officer_badge: string;
    station: string;
    terminal_id: string;
    os_environment: string;
    attestation_text: string;
  };
}

export interface ClusterInfo {
  cluster_id: string;
  cluster_label: string;
  entity_type: string;
  heuristic: string;
  description?: string;
  confidence: number;
  address_count: number;
  member_addresses: string[];
  primary_hub?: string;
  risk_score: number;
}

export interface ClusteringData {
  clusters: ClusterInfo[];
  total_clusters: number;
}

export interface TraceResult {
  investigation_id: string;
  complaint_id?: string;
  nodes: TraceNode[];
  edges: TraceEdge[];
  intelligence: Intelligence;
  clustering?: ClusteringData;
  ml_anomaly?: MLAnomalyData;
  typology?: TypologyClassification;
  evidence?: EvidenceData;
  trace_metadata: TraceMetadata;
  narrative: string;
  narrative_source?: "LLM" | "TEMPLATE";
}

export interface Case {
  id: string;
  complaint_id: string;
  category: string;
  status: CaseStatus;
  suspect_wallet: string;
  chain: string;
  risk_score: number;
  investigator: string;
  created_at: string;
  victim_loss_inr: number;
  victim_name?: string;
}

export interface AlertItem {
  id: string;
  investigation_id?: string;
  severity: Severity;
  title: string;
  message: string;
  wallet_address: string;
  chain: string;
  risk_score: number;
  status: "UNREAD" | "ACKNOWLEDGED" | "ACTIONED";
  created_at: string;
}

export interface FreezeAuditEntry {
  timestamp: string;
  action: string;
  officer: string;
  notes: string;
}

export interface FreezeRequestItem {
  id: string;
  investigation_id: string;
  case_id?: string;
  vasp_name: string;
  wallet_address: string;
  chain: string;
  target_amount: number;
  currency: string;
  status: FreezeStatus;
  notice_number: string;
  crpc_section: string;
  investigator_name: string;
  created_at: string;
  updated_at: string;
  officer_notes?: string;
  notice_body?: string;
  audit_trail: FreezeAuditEntry[];
}

export interface IngestBatch {
  id: string;
  batch_id?: string;
  batch_name: string;
  total_records: number;
  processed_records: number;
  high_risk_count: number;
  status: string;
  created_at: string;
  flagged_high_risk?: number;
  processed_count?: number;
  auto_freeze_alerts?: number;
  records?: any[];
  results?: any[];
}

export interface AuthUser {
  name: string;
  role: string;
  badge: string;
}

export interface DossierReport {
  id: string;
  case_id?: string;
  title: string;
  target_address: string;
  chain: string;
  typology: string;
  risk_score: number;
  ml_anomaly_score: number;
  investigating_officer: string;
  police_station: string;
  sha256_hash: string;
  pdf_path?: string;
  status: "CERTIFIED" | "SUBMITTED_IN_COURT" | "FILED" | "DRAFT";
  created_at: string;
  evidence_metadata_json?: string;
}

export interface SystemSettings {
  investigator_name: string;
  investigator_badge: string;
  police_station: string;
  investigator_email: string;
  statutory_framework: string;
  jurisdiction: string;
  risk_alert_threshold: string;
  velocity_threshold_z: string;
  hop_limit: string;
  etherscan_key: string;
  trongrid_key: string;
  anthropic_key: string;
  sahyog_endpoint: string;
  auto_generate_certificates?: string;
  enable_live_rpc_fallback?: string;
}

export interface SystemStats {
  db_path: string;
  db_size_kb: number;
  wal_mode: boolean;
  counts: {
    cases: number;
    investigations: number;
    alerts: number;
    freeze_requests: number;
    clusters: number;
    indexed_addresses: number;
    reports: number;
  };
}
