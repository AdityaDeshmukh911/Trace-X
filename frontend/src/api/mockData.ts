import { TraceResult, Case, AlertItem, FreezeRequestItem, ClusterInfo, DossierReport, SystemSettings, SystemStats } from "../types";

export const MOCK_USER = {
  name: "Insp. Aditya Prashant Deshmukh",
  role: "Senior Cyber Investigator",
  badge: "MH-CYB-2241"
};

export const MOCK_CASES: Case[] = [
  {
    id: "CASE-2024-001",
    complaint_id: "NCRP/2024/MH/00441",
    category: "Task Scam — Crypto",
    status: "ACTIVE",
    suspect_wallet: "0xFraud_Origin_Task_Scam",
    chain: "ETH",
    risk_score: 87,
    investigator: "Insp. Aditya Prashant Deshmukh",
    victim_loss_inr: 1250000,
    victim_name: "Rajesh Kumar",
    created_at: "2024-01-15 09:30:00"
  },
  {
    id: "CASE-2024-002",
    complaint_id: "NCRP/2024/MH/00389",
    category: "Investment Fraud — Pig Butchering",
    status: "PENDING",
    suspect_wallet: "0xPigButcher_Main",
    chain: "TRX",
    risk_score: 72,
    investigator: "Insp. Aditya Prashant Deshmukh",
    victim_loss_inr: 4500000,
    victim_name: "Anita Desai",
    created_at: "2024-01-12 14:15:00"
  },
  {
    id: "CASE-2024-003",
    complaint_id: "NCRP/2024/DL/00218",
    category: "Exchange Hack — Rug Pull",
    status: "CLOSED",
    suspect_wallet: "0xRugPull_Dev",
    chain: "ETH",
    risk_score: 94,
    investigator: "SP Priya Nair",
    victim_loss_inr: 12000000,
    victim_name: "Virendra Sachdeva",
    created_at: "2024-01-08 11:00:00"
  },
  {
    id: "CASE-2024-004",
    complaint_id: "NCRP/2024/KA/00512",
    category: "Ransomware Payment",
    status: "ACTIVE",
    suspect_wallet: "0xRansomWallet_BTC",
    chain: "BTC",
    risk_score: 81,
    investigator: "Insp. Aditya Prashant Deshmukh",
    victim_loss_inr: 800000,
    victim_name: "MedTech Diagnostics",
    created_at: "2024-01-18 08:45:00"
  }
];

export const MOCK_ALERTS: AlertItem[] = [
  {
    id: "ALT-001",
    severity: "CRITICAL",
    title: "OFAC Mixer / Anonymization Service Intercepted",
    message: "Outgoing transaction from 0xFraud_Origin_Task_Scam swept 10.0 ETH into Tornado.Cash 10 ETH Pool.",
    wallet_address: "0xTornado_10ETH",
    chain: "ETH",
    risk_score: 98,
    status: "UNREAD",
    created_at: "Just now"
  },
  {
    id: "ALT-002",
    severity: "HIGH",
    title: "VASP Liquidation Alert: Binance Hot Wallet",
    message: "Illicit funds totaling 45,000 USDT routed to Binance Hot Wallet 6 via intermediary mule accounts.",
    wallet_address: "0x28C6c06298d514Db089934071355E5743bf21d60",
    chain: "ETH",
    risk_score: 85,
    status: "UNREAD",
    created_at: "12m ago"
  }
];

export const MOCK_FREEZES: FreezeRequestItem[] = [
  {
    id: "FRZ-2024-001",
    investigation_id: "INV-TASK-01",
    case_id: "CASE-2024-001",
    vasp_name: "Binance",
    wallet_address: "0x28C6c06298d514Db089934071355E5743bf21d60",
    chain: "ETH",
    target_amount: 45000,
    currency: "USDT",
    status: "FREEZE_REQUESTED",
    notice_number: "TRACEX/CRPC91/2024/0088",
    crpc_section: "Section 91 CrPC / Section 94 BNSS",
    investigator_name: "Insp. Aditya Prashant Deshmukh",
    created_at: "2024-01-16 10:00:00",
    updated_at: "2024-01-16 11:30:00",
    officer_notes: "Target deposit confirmed at hop 4 from task scam origin. 24-hr compliance notice sent.",
    audit_trail: [
      { timestamp: "2024-01-16 10:00:00", action: "DRAFT_CREATED", officer: "Insp. Aditya Prashant Deshmukh", notes: "Draft created" },
      { timestamp: "2024-01-16 11:30:00", action: "DISPATCHED", officer: "System", notes: "Sent to exchange compliance desk" }
    ]
  }
];

export const MOCK_REPORTS: DossierReport[] = [
  {
    id: "REP-2024-001",
    case_id: "CASE-2024-001",
    title: "Forensic Asset Attribution Brief — NCRP/2024/MH/00441",
    target_address: "0xFraud_Origin_Task_Scam",
    chain: "ETH",
    typology: "Task Scam / Deposit Multi-Hop Sweep",
    risk_score: 87,
    ml_anomaly_score: 0.88,
    investigating_officer: "Insp. Aditya Prashant Deshmukh",
    police_station: "State Cyber Police Station, Pune HQ",
    sha256_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    pdf_path: "/tmp/tracex_reports/TRACE-X_CASE-2024-001.pdf",
    status: "CERTIFIED",
    created_at: "2024-01-16 14:20:00",
    evidence_metadata_json: JSON.stringify({
      certificate_id: "CERT-65B-REP-2024-001",
      legal_act: "Section 63 Bharatiya Sakshya Adhiniyam, 2023 / Section 65B Indian Evidence Act",
      hash_algorithm: "SHA-256",
      node_version: "TRACE-X v2.1 Sovereign LEA Engine",
      verified: true
    })
  }
];

export const MOCK_SETTINGS: SystemSettings = {
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
};

export const MOCK_STATS: SystemStats = {
  db_path: "/data/tracex.db",
  db_size_kb: 489,
  wal_mode: true,
  counts: {
    cases: 6,
    investigations: 14,
    alerts: 11,
    freeze_requests: 5,
    clusters: 5,
    indexed_addresses: 76,
    reports: 4
  }
};

export const MOCK_CLUSTERS: ClusterInfo[] = [
  {
    cluster_id: "CLUST-MH-01",
    cluster_label: "Task Scam Mule Syndicate #441",
    entity_type: "MULE_NETWORK",
    heuristic: "MULTI_INPUT_FAN_OUT",
    confidence: 0.94,
    address_count: 7,
    member_addresses: ["0xFraud_Origin_Task_Scam", "0xLayer1_Mule_A", "0xLayer2_Splitter"],
    risk_score: 88
  },
  {
    cluster_id: "CLUST-BINANCE",
    cluster_label: "Binance Hot Wallet Cluster",
    entity_type: "VASP_CLUSTER",
    heuristic: "DEPOSIT_SWEEP",
    confidence: 0.99,
    address_count: 150000,
    member_addresses: ["0x28C6c06298d514Db089934071355E5743bf21d60"],
    risk_score: 12
  }
];

export const getMockTraceResult = (startAddress = "0xFraud_Origin_Task_Scam", chain = "ETH"): TraceResult => ({
  investigation_id: "INV-DEMO-LIVE",
  complaint_id: "NCRP/2024/MH/00441",
  nodes: [
    {
      id: startAddress,
      type: "SUSPECT",
      label: "Origin Scam Deposit",
      chain,
      is_suspect: true,
      hop_distance: 0,
      risk_flags: ["VICTIM_DEPOSIT", "HIGH_RISK"]
    },
    {
      id: "0xLayer1_Mule_A",
      type: "SUSPECT",
      label: "Layer 1 Aggregator Mule",
      chain,
      is_suspect: true,
      hop_distance: 1,
      risk_flags: ["FAN_OUT", "MULE"]
    },
    {
      id: "0xLayer2_Splitter",
      type: "SUSPECT",
      label: "Smurfing Funnel Account",
      chain,
      is_suspect: true,
      hop_distance: 2,
      risk_flags: ["SMURFING"]
    },
    {
      id: "0xTornado_10ETH",
      type: "MIXER",
      label: "Tornado.Cash 10 ETH Pool",
      chain,
      is_suspect: false,
      hop_distance: 3,
      sanction_status: "SANCTIONED_OFAC",
      risk_flags: ["MIXER", "OFAC_SDN"]
    },
    {
      id: "0x28C6c06298d514Db089934071355E5743bf21d60",
      type: "EXCHANGE",
      label: "Binance Hot Wallet 6",
      chain,
      is_suspect: false,
      hop_distance: 4,
      vasp_name: "Binance",
      vasp_jurisdiction: "Cayman Islands",
      risk_flags: ["VASP_HOT_WALLET"]
    }
  ],
  edges: [
    { id: "e1", source: startAddress, target: "0xLayer1_Mule_A", amount: 14.5, timestamp: "2024-01-15 09:45:00", chain, hash: "0x33e8b0a97005d723ea906e320e59e8965087ee82e3a85d93d06a" },
    { id: "e2", source: "0xLayer1_Mule_A", target: "0xLayer2_Splitter", amount: 12.0, timestamp: "2024-01-15 10:15:00", chain, hash: "0x25033a5d326db686560858536a522065a5a503505a85059a65" },
    { id: "e3", source: "0xLayer2_Splitter", target: "0xTornado_10ETH", amount: 10.0, timestamp: "2024-01-15 11:00:00", chain, hash: "0x989935e39d860e8e05c2020008c3e0800e008702965d95606" },
    { id: "e4", source: "0xLayer2_Splitter", target: "0x28C6c06298d514Db089934071355E5743bf21d60", amount: 2.0, timestamp: "2024-01-15 11:30:00", chain, hash: "0x3e037ab55955e8c865320923e59e508607a5033880683b48e" }
  ],
  trace_metadata: {
    start_address: startAddress,
    chain,
    total_nodes: 5,
    total_edges: 4,
    max_hop_depth: 5,
    timestamp: new Date().toISOString()
  },
  narrative: "Forensic analysis confirms high-velocity fund dissipation originating from initial victim deposit. Proceeds moved through two intermediate mule layers before partial mixing and final deposit into Binance exchange infrastructure.",
  intelligence: {
    risk_score: 87,
    risk_level: "CRITICAL",
    risk_factors: [
      { factor: "OFAC Sanctioned Entity", points: 40, description: "Funds interact with OFAC-sanctioned Tornado Cash privacy pool.", severity: "CRITICAL", icon: "AlertTriangle" },
      { factor: "Smurfing / Layering", points: 25, description: "Structured rapid fan-out across multiple intermediary mule addresses.", severity: "HIGH", icon: "Split" },
      { factor: "VASP Liquidation Exposure", points: 22, description: "Identified exit ramp at centralized exchange Binance.", severity: "HIGH", icon: "Building2" }
    ],
    vasp: {
      name: "Binance",
      label: "Binance Hot Wallet 6",
      address: "0x28C6c06298d514Db089934071355E5743bf21d60",
      confidence: 0.99,
      confidence_pct: "99%",
      distance_hops: 4,
      chain,
      jurisdiction: "Cayman Islands",
      action: "Issue Section 91 CrPC Freeze Summons"
    },
    secondary_vasps: [],
    chains_involved: [chain],
    total_transactions: 4,
    total_nodes: 5,
    has_mixer: true,
    has_cross_chain: false,
    max_hop_depth: 4
  }
});
