import { TraceResult, TraceNode, TraceEdge, Case, AlertItem, FreezeRequestItem, ClusterInfo, DossierReport, SystemSettings, SystemStats, IngestBatch } from "../types";

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

function deriveRealisticAddress(chain: string, role: string, seed: number): string {
  const str = `${role}:${seed}:${chain}`;
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  const hexPart = (
    Math.abs(h1).toString(16).padStart(8, "0") +
    Math.abs(h2).toString(16).padStart(8, "0") +
    Math.abs(h1 ^ h2).toString(16).padStart(8, "0") +
    Math.abs(Math.imul(h1, 31)).toString(16).padStart(8, "0") +
    Math.abs(Math.imul(h2, 37)).toString(16).padStart(8, "0")
  ).substring(0, 40);

  if (chain === "TRX") {
    const b58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    let sub = "";
    for (let i = 0; i < hexPart.length - 1; i += 2) {
      sub += b58[parseInt(hexPart.substring(i, i + 2), 16) % b58.length];
    }
    while (sub.length < 33) {
      sub += b58[(sub.length * 17 + seed) % b58.length];
    }
    return "T" + sub.substring(0, 33);
  } else if (chain === "BTC") {
    const b32 = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
    let sub = "";
    for (let i = 0; i < hexPart.length - 1; i += 2) {
      sub += b32[parseInt(hexPart.substring(i, i + 2), 16) % b32.length];
    }
    while (sub.length < 38) {
      sub += b32[(sub.length * 13 + seed) % b32.length];
    }
    return "bc1q" + sub.substring(0, 38);
  } else {
    return "0x" + hexPart;
  }
}

function deriveTxHash(chain: string, idx: number, seed: number): string {
  let h = "";
  for (let k = 0; k < 4; k++) {
    h += Math.abs((seed ^ (idx * 1337 + k * 98765)) * 16807).toString(16).padStart(8, "0");
  }
  const full = h.padEnd(64, "0").substring(0, 64);
  return chain === "BTC" || chain === "TRX" ? full : `0x${full}`;
}

export const getMockTraceResult = (
  startAddress = "0xFraud_Origin_Task_Scam",
  chainArg = "ETH",
  hops = 5
): TraceResult => {
  const effectiveHops = Math.max(2, Math.min(Number(hops) || 5, 6));
  const addr = (startAddress || "0xFraud_Origin_Task_Scam").trim();

  // ── Chain detection ──
  let chain = (chainArg || "ETH").toUpperCase();
  if (addr.startsWith("T") && addr.length > 20) chain = "TRX";
  else if ((addr.startsWith("1") || addr.startsWith("3") || addr.startsWith("bc1")) && addr.length > 20) chain = "BTC";
  else if (addr.startsWith("0x") && !["ETH", "TRX", "BTC"].includes(chain)) chain = "ETH";

  // ── Deterministic numeric seed from address ──
  let seed = 0;
  for (let i = 0; i < addr.length; i++) {
    seed = ((seed << 5) - seed + addr.charCodeAt(i)) & 0x7fffffff;
  }

  const invId = `INV-${Math.abs(seed).toString(16).substring(0, 8).toUpperCase()}`;
  const complaintId = `NCRP/2024/${chain}/${(10000 + (seed % 89999)).toString()}`;

  // ── Determine Forensic Archetype (0 to 4) ──
  const low = addr.toLowerCase();
  let arch = 0;
  if (low.includes("pig") || low.includes("butcher") || low.includes("romance")) {
    arch = 2; // Pig Butchering / Romance Fraud
  } else if (low.includes("ransom") || (!low.includes("clean") && chain === "BTC")) {
    arch = 3; // Ransomware Peeling Chain
  } else if (low.includes("task") || low.includes("mule") || low.includes("telegram") || low.includes("job")) {
    arch = 1; // Task Scam Mule Fan-Out
  } else if (low.includes("clean") || low.includes("safe") || low.includes("stake") || low.includes("retail")) {
    arch = 4; // Compliant Retail / Staking Flow
  } else if (low.includes("mixer") || low.includes("tornado") || low.includes("heist") || low.includes("hack") || low.includes("rug")) {
    arch = 0; // Exploit / Mixer Obfuscation
  } else if (chain === "TRX") {
    arch = (seed % 2 === 0) ? 2 : 1;
  } else {
    arch = seed % 5;
  }

  // ── Financial Volume ──
  let totalDeposit = 14.5;
  let fiatRate = 292000;
  if (chain === "ETH") {
    totalDeposit = Number(((seed % 2800) / 100 + 4.25).toFixed(2));
    fiatRate = 292000;
  } else if (chain === "TRX") {
    totalDeposit = Math.round((seed % 350000) + 35000);
    fiatRate = 12.8;
  } else if (chain === "BTC") {
    totalDeposit = Number(((seed % 240) / 100 + 0.22).toFixed(3));
    fiatRate = 5650000;
  }
  const fiatINR = Math.round(totalDeposit * fiatRate);

  // ── Terminal VASP Selection ──
  const vasps = [
    { name: "Binance", label: "Binance Hot Wallet 6", addr: deriveRealisticAddress(chain, "Binance_Hot_Vault", seed), jur: "Cayman Islands", conf: 0.99 },
    { name: "CoinDCX", label: "CoinDCX Settlement Vault", addr: deriveRealisticAddress(chain, "CoinDCX_Settlement_Vault", seed), jur: "India (FIU-IND Registered)", conf: 0.96 },
    { name: "OKX", label: "OKX Mainnet Sweep Vault", addr: deriveRealisticAddress(chain, "OKX_Sweep_Vault", seed), jur: "Seychelles", conf: 0.97 },
    { name: "WazirX", label: "WazirX Treasury Settlement Node", addr: deriveRealisticAddress(chain, "WazirX_Treasury_Node", seed), jur: "India (FIU-IND Registered)", conf: 0.94 },
    { name: "Kraken", label: "Kraken Primary Liquidation Vault", addr: deriveRealisticAddress(chain, "Kraken_Liquidation_Vault", seed), jur: "United States", conf: 0.95 }
  ];
  const vasp = vasps[seed % vasps.length];

  const now = Date.now();
  const makeTs = (hAgo: number) =>
    new Date(now - hAgo * 3600000).toISOString().replace("T", " ").substring(0, 19);

  let allGraphNodes: TraceNode[] = [];
  let allEdges: TraceEdge[] = [];
  let typologyCode = "TYP_TASK_MULE";
  let typologyName = "Part-Time Task Scam & Prepaid Rating Fraud";
  let threatActor = "Organized Telegram / WhatsApp Task Syndicate";
  let legalClass = "IPC Sec 419, 420, 120-B | IT Act Sec 66-D | Section 63 BSA 2023";
  let riskScore = 88;
  let riskLevel: "CRITICAL" | "HIGH" | "ELEVATED" | "LOW" = "CRITICAL";
  let anomalyTier = "CRITICAL_ANOMALY";
  let anomalyIndex = 0.88;
  let zScore = "+3.42σ (High Velocity)";

  // ═══════════════════════════════════════════════════════════════════════════
  // ARCHETYPE 0: DeFi Exploit / OFAC Mixer Obfuscation (6 nodes, 5 edges)
  // ═══════════════════════════════════════════════════════════════════════════
  if (arch === 0) {
    typologyCode = "TYP_OFAC_MIXER_HEIST";
    typologyName = "DeFi Smart Contract Exploit & OFAC Mixer Obfuscation";
    threatActor = "Advanced Persistent Cyber Heist Syndicate";
    legalClass = "IT Act Sec 43, 66 | IPC Sec 379, 420, 120-B | Section 3/4 PMLA 2002";
    riskScore = Math.min(99, 93 + (seed % 6));
    riskLevel = "CRITICAL";
    anomalyTier = "CRITICAL_ANOMALY";
    anomalyIndex = 0.96;
    zScore = "+4.85σ (Extreme Exploit Outflow)";

    const m1 = deriveRealisticAddress(chain, "peel_collector", seed);
    const mixerName = chain === "ETH" ? "Tornado.Cash 100 ETH Pool" : chain === "BTC" ? "Wasabi CoinJoin Anonymizer" : "SunSwap Anonymization Vault";
    const mx = deriveRealisticAddress(chain, "mixer_pool", seed);
    const pm = deriveRealisticAddress(chain, "post_mixer_sweep", seed);
    const vc = deriveRealisticAddress(chain, "vasp_cold_vault", seed);

    allGraphNodes = [
      { id: addr, type: "SUSPECT", label: "Origin Exploit Wallet", chain, is_suspect: true, hop_distance: 0, risk_flags: ["ILLICIT_HEIST", "VICTIM_DRAIN"] },
      { id: m1, type: "SUSPECT", label: "High-Speed Peeling Intermediary", chain, is_suspect: true, hop_distance: 1, risk_flags: ["PEELING_INTERMEDIARY"] },
      { id: mx, type: "MIXER", label: mixerName, chain, is_suspect: false, hop_distance: 2, sanction_status: "OFAC_SDN", risk_flags: ["MIXER", "OFAC_SDN"] },
      { id: pm, type: "SUSPECT", label: "Post-Mixer Sweep Collector", chain, is_suspect: true, hop_distance: 3, risk_flags: ["POST_MIXER_SWEEP"] },
      { id: vasp.addr, type: "EXCHANGE", label: vasp.label, chain, is_suspect: false, hop_distance: 4, vasp_name: vasp.name, vasp_jurisdiction: vasp.jur, confidence: vasp.conf, risk_flags: ["VASP_HOT_WALLET", "EXIT_RAMP"] },
      { id: vc, type: "EXCHANGE", label: `${vasp.name} Reserve Cold Vault`, chain, is_suspect: false, hop_distance: 5, vasp_name: vasp.name, vasp_jurisdiction: vasp.jur, confidence: 0.99, risk_flags: ["COLD_STORAGE"] }
    ];

    allEdges = [
      { id: "e1", source: addr, target: m1, amount: Number((totalDeposit * 0.96).toFixed(2)), timestamp: makeTs(36), chain, hash: deriveTxHash(chain, 1, seed) },
      { id: "e2", source: m1, target: mx, amount: Number((totalDeposit * 0.90).toFixed(2)), timestamp: makeTs(28), chain, hash: deriveTxHash(chain, 2, seed) },
      { id: "e3", source: mx, target: pm, amount: Number((totalDeposit * 0.86).toFixed(2)), timestamp: makeTs(18), chain, hash: deriveTxHash(chain, 3, seed) },
      { id: "e4", source: pm, target: vasp.addr, amount: Number((totalDeposit * 0.82).toFixed(2)), timestamp: makeTs(8), chain, hash: deriveTxHash(chain, 4, seed) },
      { id: "e5", source: vasp.addr, target: vc, amount: Number((totalDeposit * 0.70).toFixed(2)), timestamp: makeTs(2), chain, hash: deriveTxHash(chain, 5, seed) }
    ];
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ARCHETYPE 1: Task Scam Mule Fan-Out & Smurfing (10 nodes, 10 edges)
  // ═══════════════════════════════════════════════════════════════════════════
  else if (arch === 1) {
    typologyCode = "TYP_TASK_MULE_FANOUT";
    typologyName = "Part-Time Task Scam & Prepaid Rating Fraud (Mule Fan-Out)";
    threatActor = "Organized Telegram Task Fraud Cartel (Southeast Asia)";
    legalClass = "IPC Sec 419, 420, 120-B | IT Act Sec 66-D | Section 63 BSA 2023";
    riskScore = Math.min(94, 85 + (seed % 7));
    riskLevel = "CRITICAL";
    anomalyTier = "HIGH_RISK_ANOMALY";
    anomalyIndex = 0.88;
    zScore = "+3.45σ (High Velocity Structuring)";

    const mA = deriveRealisticAddress(chain, "mule_primary", seed);
    const mB = deriveRealisticAddress(chain, "mule_secondary", seed);
    const mC = deriveRealisticAddress(chain, "mule_tertiary", seed);
    const con = deriveRealisticAddress(chain, "smurfing_hub", seed);
    const p2p = deriveRealisticAddress(chain, "p2p_settlement", seed);
    const dexName = chain === "ETH" ? "Uniswap V3 Router" : chain === "BTC" ? "THORChain Vault" : "JustLend Protocol Gateway";
    const dex = deriveRealisticAddress(chain, "dex_router", seed);
    const otc = deriveRealisticAddress(chain, "otc_aggregator", seed);
    const vc = deriveRealisticAddress(chain, "cold_reserve_multisig", seed);

    allGraphNodes = [
      { id: addr, type: "SUSPECT", label: "Victim Fraud Intake Deposit", chain, is_suspect: true, hop_distance: 0, risk_flags: ["TASK_SCAM", "ORIGIN_DEPOSIT"] },
      { id: mA, type: "SUSPECT", label: "Layer-1 Primary Mule", chain, is_suspect: true, hop_distance: 1, risk_flags: ["MULE", "FAN_OUT"] },
      { id: mB, type: "SUSPECT", label: "Layer-1 Secondary Mule", chain, is_suspect: true, hop_distance: 1, risk_flags: ["MULE", "FAN_OUT"] },
      { id: mC, type: "SUSPECT", label: "Layer-1 Tertiary Mule", chain, is_suspect: true, hop_distance: 1, risk_flags: ["MULE", "FAN_OUT"] },
      { id: con, type: "SUSPECT", label: "Smurfing Consolidation Hub", chain, is_suspect: true, hop_distance: 2, risk_flags: ["SMURFING", "LAYERING"] },
      { id: p2p, type: "SUSPECT", label: "P2P Settlement Gateway", chain, is_suspect: true, hop_distance: 2, risk_flags: ["P2P_RAMP", "LAYERING"] },
      { id: dex, type: "DEX", label: dexName, chain, is_suspect: false, hop_distance: 3, risk_flags: ["DEX_ROUTER", "SWAP"] },
      { id: otc, type: "SUSPECT", label: "OTC Aggregator Wallet", chain, is_suspect: true, hop_distance: 3, risk_flags: ["OTC_BROKER"] },
      { id: vasp.addr, type: "EXCHANGE", label: vasp.label, chain, is_suspect: false, hop_distance: 4, vasp_name: vasp.name, vasp_jurisdiction: vasp.jur, confidence: vasp.conf, risk_flags: ["VASP_HOT_WALLET", "EXIT_RAMP"] },
      { id: vc, type: "EXCHANGE", label: `${vasp.name} Cold Multi-Sig Vault`, chain, is_suspect: false, hop_distance: 5, vasp_name: vasp.name, vasp_jurisdiction: vasp.jur, confidence: 0.99, risk_flags: ["COLD_STORAGE"] }
    ];

    allEdges = [
      { id: "e1", source: addr, target: mA, amount: Number((totalDeposit * 0.40).toFixed(2)), timestamp: makeTs(40), chain, hash: deriveTxHash(chain, 10, seed) },
      { id: "e2", source: addr, target: mB, amount: Number((totalDeposit * 0.35).toFixed(2)), timestamp: makeTs(39), chain, hash: deriveTxHash(chain, 11, seed) },
      { id: "e3", source: addr, target: mC, amount: Number((totalDeposit * 0.25).toFixed(2)), timestamp: makeTs(38), chain, hash: deriveTxHash(chain, 12, seed) },
      { id: "e4", source: mA, target: con, amount: Number((totalDeposit * 0.38).toFixed(2)), timestamp: makeTs(30), chain, hash: deriveTxHash(chain, 13, seed) },
      { id: "e5", source: mB, target: con, amount: Number((totalDeposit * 0.33).toFixed(2)), timestamp: makeTs(29), chain, hash: deriveTxHash(chain, 14, seed) },
      { id: "e6", source: mC, target: p2p, amount: Number((totalDeposit * 0.23).toFixed(2)), timestamp: makeTs(28), chain, hash: deriveTxHash(chain, 15, seed) },
      { id: "e7", source: con, target: dex, amount: Number((totalDeposit * 0.42).toFixed(2)), timestamp: makeTs(18), chain, hash: deriveTxHash(chain, 16, seed) },
      { id: "e8", source: con, target: otc, amount: Number((totalDeposit * 0.26).toFixed(2)), timestamp: makeTs(17), chain, hash: deriveTxHash(chain, 17, seed) },
      { id: "e9", source: p2p, target: otc, amount: Number((totalDeposit * 0.21).toFixed(2)), timestamp: makeTs(16), chain, hash: deriveTxHash(chain, 18, seed) },
      { id: "e10", source: dex, target: vasp.addr, amount: Number((totalDeposit * 0.40).toFixed(2)), timestamp: makeTs(8), chain, hash: deriveTxHash(chain, 19, seed) },
      { id: "e11", source: otc, target: vasp.addr, amount: Number((totalDeposit * 0.44).toFixed(2)), timestamp: makeTs(7), chain, hash: deriveTxHash(chain, 20, seed) },
      { id: "e12", source: vasp.addr, target: vc, amount: Number((totalDeposit * 0.70).toFixed(2)), timestamp: makeTs(2), chain, hash: deriveTxHash(chain, 21, seed) }
    ];
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ARCHETYPE 2: Pig Butchering / Romance Fraud DEX Swaps (8 nodes, 8 edges)
  // ═══════════════════════════════════════════════════════════════════════════
  else if (arch === 2) {
    typologyCode = "TYP_SHA_ZHU_PAN";
    typologyName = "Investment Fraud / Sha Zhu Pan (Pig Butchering DEX Funnel)";
    threatActor = "Mekong Delta Transnational Pig Butchering Cartel";
    legalClass = "IPC Sec 420, 384, 120-B | IT Act Sec 66-C, 66-D | Section 63 BSA 2023";
    riskScore = Math.min(96, 89 + (seed % 6));
    riskLevel = "CRITICAL";
    anomalyTier = "CRITICAL_ANOMALY";
    anomalyIndex = 0.92;
    zScore = "+3.91σ (Rapid Tether Conversion)";

    const h1 = deriveRealisticAddress(chain, "romance_handler_alpha", seed);
    const h2 = deriveRealisticAddress(chain, "romance_handler_beta", seed);
    const dexName = chain === "TRX" ? "SunSwap High-Slippage Pool" : "Uniswap V3 Router";
    const dp = deriveRealisticAddress(chain, "dex_liquidity_pool", seed);
    const br = deriveRealisticAddress(chain, "cross_chain_stargate", seed);
    const trc = deriveRealisticAddress(chain, "trc20_aggregator_mule", seed);
    const bc = deriveRealisticAddress(chain, "secondary_bridge_collector", seed);
    const vc = deriveRealisticAddress(chain, "vasp_reserve_vault", seed);

    allGraphNodes = [
      { id: addr, type: "SUSPECT", label: "Fake Trading Platform Deposit", chain, is_suspect: true, hop_distance: 0, risk_flags: ["ROMANCE_FRAUD", "PIG_BUTCHERING"] },
      { id: h1, type: "SUSPECT", label: "Regional Syndicate Collector Alpha", chain, is_suspect: true, hop_distance: 1, risk_flags: ["SYNDICATE_COLLECTOR"] },
      { id: h2, type: "SUSPECT", label: "Regional Syndicate Collector Beta", chain, is_suspect: true, hop_distance: 1, risk_flags: ["SYNDICATE_COLLECTOR"] },
      { id: dp, type: "DEX", label: dexName, chain, is_suspect: false, hop_distance: 2, risk_flags: ["HIGH_RISK_DEX", "SWAP"] },
      { id: br, type: "BRIDGE", label: "Stargate Cross-Chain Gateway", chain, is_suspect: false, hop_distance: 2, risk_flags: ["CROSS_CHAIN_BRIDGE"] },
      { id: trc, type: "SUSPECT", label: "TRC-20 Aggregator Mule", chain, is_suspect: true, hop_distance: 3, risk_flags: ["USDT_AGGREGATOR"] },
      { id: bc, type: "SUSPECT", label: "Secondary Chain Collector", chain, is_suspect: true, hop_distance: 3, risk_flags: ["BRIDGE_OUTPUT"] },
      { id: vasp.addr, type: "EXCHANGE", label: vasp.label, chain, is_suspect: false, hop_distance: 4, vasp_name: vasp.name, vasp_jurisdiction: vasp.jur, confidence: vasp.conf, risk_flags: ["VASP_HOT_WALLET", "EXIT_RAMP"] },
      { id: vc, type: "EXCHANGE", label: `${vasp.name} Cold Reserve Vault`, chain, is_suspect: false, hop_distance: 5, vasp_name: vasp.name, vasp_jurisdiction: vasp.jur, confidence: 0.99, risk_flags: ["COLD_STORAGE"] }
    ];

    allEdges = [
      { id: "e1", source: addr, target: h1, amount: Number((totalDeposit * 0.58).toFixed(2)), timestamp: makeTs(38), chain, hash: deriveTxHash(chain, 30, seed) },
      { id: "e2", source: addr, target: h2, amount: Number((totalDeposit * 0.42).toFixed(2)), timestamp: makeTs(37), chain, hash: deriveTxHash(chain, 31, seed) },
      { id: "e3", source: h1, target: dp, amount: Number((totalDeposit * 0.54).toFixed(2)), timestamp: makeTs(26), chain, hash: deriveTxHash(chain, 32, seed) },
      { id: "e4", source: h2, target: br, amount: Number((totalDeposit * 0.40).toFixed(2)), timestamp: makeTs(25), chain, hash: deriveTxHash(chain, 33, seed) },
      { id: "e5", source: dp, target: trc, amount: Number((totalDeposit * 0.50).toFixed(2)), timestamp: makeTs(16), chain, hash: deriveTxHash(chain, 34, seed) },
      { id: "e6", source: br, target: bc, amount: Number((totalDeposit * 0.38).toFixed(2)), timestamp: makeTs(15), chain, hash: deriveTxHash(chain, 35, seed) },
      { id: "e7", source: trc, target: vasp.addr, amount: Number((totalDeposit * 0.48).toFixed(2)), timestamp: makeTs(6), chain, hash: deriveTxHash(chain, 36, seed) },
      { id: "e8", source: bc, target: vasp.addr, amount: Number((totalDeposit * 0.36).toFixed(2)), timestamp: makeTs(5), chain, hash: deriveTxHash(chain, 37, seed) },
      { id: "e9", source: vasp.addr, target: vc, amount: Number((totalDeposit * 0.65).toFixed(2)), timestamp: makeTs(2), chain, hash: deriveTxHash(chain, 38, seed) }
    ];
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ARCHETYPE 3: Ransomware Extortion Peeling Chain (8 nodes, 8 edges)
  // ═══════════════════════════════════════════════════════════════════════════
  else if (arch === 3) {
    typologyCode = "TYP_RANSOM_01";
    typologyName = "LockBit 3.0 Ransomware Extortion & CoinJoin Laundering";
    threatActor = "LockBit / BlackCat Ransomware-as-a-Service Syndicate";
    legalClass = "IPC Sec 384, 385, 420, 120-B | IT Act Sec 43, 66, 66-F | Section 63 BSA 2023";
    riskScore = Math.min(99, 94 + (seed % 5));
    riskLevel = "CRITICAL";
    anomalyTier = "EXTREME_OUTLIER";
    anomalyIndex = 0.98;
    zScore = "+4.75σ (Critical UTXO Peel Chain)";

    const p1 = deriveRealisticAddress(chain, "peel_hop1", seed);
    const aff = deriveRealisticAddress(chain, "affiliate_cut", seed);
    const p2 = deriveRealisticAddress(chain, "peel_hop2", seed);
    const cjmName = chain === "BTC" ? "Wasabi CoinJoin Anonymizer" : "Tornado Cash 10 ETH";
    const cjm = deriveRealisticAddress(chain, "coinjoin_pool", seed);
    const pmc = deriveRealisticAddress(chain, "post_coinjoin_collector", seed);
    const p2b = deriveRealisticAddress(chain, "high_risk_otc_broker", seed);

    allGraphNodes = [
      { id: addr, type: "SUSPECT", label: "Ransom Extortion Payment Wallet", chain, is_suspect: true, hop_distance: 0, risk_flags: ["RANSOMWARE_PAYMENT", "EXTORTION"] },
      { id: p1, type: "SUSPECT", label: "Peeling Chain Hop 1", chain, is_suspect: true, hop_distance: 1, risk_flags: ["PEELING_FORWARD"] },
      { id: aff, type: "SUSPECT", label: "Affiliate Syndicate Share", chain, is_suspect: true, hop_distance: 1, risk_flags: ["AFFILIATE_SHARE"] },
      { id: p2, type: "SUSPECT", label: "Peeling Chain Hop 2", chain, is_suspect: true, hop_distance: 2, risk_flags: ["PEELING_FORWARD"] },
      { id: cjm, type: "MIXER", label: cjmName, chain, is_suspect: false, hop_distance: 2, sanction_status: "HIGH_RISK_PRIVACY", risk_flags: ["MIXER", "COINJOIN"] },
      { id: pmc, type: "SUSPECT", label: "Post-CoinJoin Collector", chain, is_suspect: true, hop_distance: 3, risk_flags: ["POST_MIXER_SWEEP"] },
      { id: p2b, type: "SUSPECT", label: "High-Risk OTC Broker", chain, is_suspect: true, hop_distance: 4, risk_flags: ["P2P_CASHOUT"] },
      { id: vasp.addr, type: "EXCHANGE", label: vasp.label, chain, is_suspect: false, hop_distance: 5, vasp_name: vasp.name, confidence: vasp.conf, vasp_jurisdiction: vasp.jur, risk_flags: ["VASP_HOT_WALLET", "EXIT_RAMP"] }
    ];

    allEdges = [
      { id: "e1", source: addr, target: p1, amount: Number((totalDeposit * 0.85).toFixed(3)), timestamp: makeTs(36), chain, hash: deriveTxHash(chain, 40, seed) },
      { id: "e2", source: addr, target: aff, amount: Number((totalDeposit * 0.15).toFixed(3)), timestamp: makeTs(35), chain, hash: deriveTxHash(chain, 41, seed) },
      { id: "e3", source: p1, target: p2, amount: Number((totalDeposit * 0.72).toFixed(3)), timestamp: makeTs(25), chain, hash: deriveTxHash(chain, 42, seed) },
      { id: "e4", source: p1, target: cjm, amount: Number((totalDeposit * 0.11).toFixed(3)), timestamp: makeTs(24), chain, hash: deriveTxHash(chain, 43, seed) },
      { id: "e5", source: p2, target: pmc, amount: Number((totalDeposit * 0.68).toFixed(3)), timestamp: makeTs(15), chain, hash: deriveTxHash(chain, 44, seed) },
      { id: "e6", source: cjm, target: pmc, amount: Number((totalDeposit * 0.10).toFixed(3)), timestamp: makeTs(14), chain, hash: deriveTxHash(chain, 45, seed) },
      { id: "e7", source: pmc, target: p2b, amount: Number((totalDeposit * 0.74).toFixed(3)), timestamp: makeTs(6), chain, hash: deriveTxHash(chain, 46, seed) },
      { id: "e8", source: p2b, target: vasp.addr, amount: Number((totalDeposit * 0.70).toFixed(3)), timestamp: makeTs(2), chain, hash: deriveTxHash(chain, 47, seed) }
    ];
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ARCHETYPE 4: Compliant Retail / DeFi Staking Flow (5 nodes, 4 edges, CLEAN)
  // ═══════════════════════════════════════════════════════════════════════════
  else {
    typologyCode = "TYP_COMPLIANT_RETAIL";
    typologyName = "Compliant Retail Activity & Proof-of-Stake Staking";
    threatActor = "Verified Non-Adversarial Retail Investor";
    legalClass = "Compliant Digital Asset Transaction (No Predicate Offence)";
    riskScore = Math.min(28, 18 + (seed % 9));
    riskLevel = "LOW";
    anomalyTier = "NORMAL_RETAIL";
    anomalyIndex = 0.16;
    zScore = "+0.42σ (Normal Retail Volume)";

    const dx = deriveRealisticAddress(chain, "uniswap_router", seed);
    const stk = deriveRealisticAddress(chain, "staking_contract", seed);
    const cld = deriveRealisticAddress(chain, "cold_hardware_vault", seed);
    const cex = deriveRealisticAddress(chain, "compliant_exchange_vault", seed);

    allGraphNodes = [
      { id: addr, type: "UNKNOWN", label: "Verified Retail User Wallet", chain, is_suspect: false, hop_distance: 0, risk_flags: ["RETAIL_USER", "COMPLIANT"] },
      { id: dx, type: "DEX", label: "Uniswap V3 Protocol Router", chain, is_suspect: false, hop_distance: 1, risk_flags: ["DEX_ROUTER", "VERIFIED_PROTOCOL"] },
      { id: stk, type: "UNKNOWN", label: "Lido Staked Asset Protocol", chain, is_suspect: false, hop_distance: 2, risk_flags: ["STAKING_CONTRACT", "AUDITED"] },
      { id: cld, type: "UNKNOWN", label: "Hardware Cold Storage", chain, is_suspect: false, hop_distance: 3, risk_flags: ["PERSONAL_COLD_STORAGE"] },
      { id: cex, type: "EXCHANGE", label: "CoinDCX FIU-IND Compliant Exchange", chain, is_suspect: false, hop_distance: 4, vasp_name: "CoinDCX", vasp_jurisdiction: "India (FIU-IND Registered)", confidence: 0.99, risk_flags: ["FIU_IND_COMPLIANT", "KYC_VERIFIED"] }
    ];

    allEdges = [
      { id: "e1", source: addr, target: dx, amount: Number((totalDeposit * 0.98).toFixed(2)), timestamp: makeTs(40), chain, hash: deriveTxHash(chain, 50, seed) },
      { id: "e2", source: dx, target: stk, amount: Number((totalDeposit * 0.95).toFixed(2)), timestamp: makeTs(30), chain, hash: deriveTxHash(chain, 51, seed) },
      { id: "e3", source: stk, target: cld, amount: Number((totalDeposit * 0.90).toFixed(2)), timestamp: makeTs(15), chain, hash: deriveTxHash(chain, 52, seed) },
      { id: "e4", source: cld, target: cex, amount: Number((totalDeposit * 0.45).toFixed(2)), timestamp: makeTs(4), chain, hash: deriveTxHash(chain, 53, seed) }
    ];
  }

  // ── Filter nodes strictly by requested hops ──
  const nodes = allGraphNodes.filter((n) => n.hop_distance <= effectiveHops);
  const nodeIds = new Set(nodes.map((n) => n.id));
  const edges = allEdges.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target));

  // ── Deterministic SHA-256 Digest ──
  let sha = "";
  for (let k = 0; k < 8; k++) {
    sha += Math.abs((seed ^ (effectiveHops * 100 + k * 87654)) * 2654435761).toString(16).padStart(8, "0");
  }
  const canonical_sha256 = sha.substring(0, 64);

  // ── Case Specific Narrative ──
  const narrative = `Forensic graph analysis of wallet ${addr} on the ${chain} ledger confirms ${typologyName}. 
An initial ledger movement of ${totalDeposit} ${chain} (approx. ₹${fiatINR.toLocaleString("en-IN")}) was detected. 
Proceeds traversed ${nodes.length} distinct graph nodes via ${edges.length} structured transactions over ${effectiveHops} hops. 
${
  riskScore > 70
    ? `Terminal fund liquidation reached regulated exchange ${vasp.name} (${vasp.addr.slice(0, 10)}...) under jurisdiction of ${vasp.jur}. Immediate statutory freeze summons under Section 91 CrPC / Section 94 BNSS is advised.`
    : `Transaction flow is compliant with standard retail/staking activity with no illicit mixer or sanctioned entity interaction.`
}`;

  return {
    investigation_id: invId,
    complaint_id: complaintId,
    nodes,
    edges,
    trace_metadata: {
      start_address: addr,
      chain,
      total_nodes: nodes.length,
      total_edges: edges.length,
      max_hop_depth: effectiveHops,
      timestamp: new Date().toISOString()
    },
    narrative,
    typology: {
      typology_code: typologyCode,
      typology_name: typologyName,
      confidence: 0.96,
      confidence_pct: "96%",
      threat_actor: threatActor,
      legal_classification: legalClass,
      indicators: [
        `Graph depth: ${effectiveHops} hops traced across ${nodes.length} nodes`,
        `Edge density: ${edges.length} verified transactions mapped`,
        `Typology classification: ${typologyName}`,
        riskScore > 70 ? "Terminal liquidation: Regulated VASP hot wallet identified" : "Compliant non-adversarial activity"
      ],
      investigative_sop: [
        `1. Serve Section 91 CrPC / Section 94 BNSS preservation requisition to ${vasp.name} compliance desk`,
        "2. Interdict Layer-1 and Layer-2 mule UPI/IMPS withdrawal gateways across partner banks",
        "3. Lodge CDR / IPDR requisition with telecom providers for suspect phone/IP clusters",
        "4. Synchronize incident cryptographic hash with I4C NCRP national portal"
      ]
    },
    ml_anomaly: {
      ml_anomaly_index: anomalyIndex,
      anomaly_tier: anomalyTier,
      z_score_velocity: zScore,
      value_entropy_index: 0.92,
      graph_centrality_skew: 0.86,
      model_description: "Isolation Forest + Graph Neural Network Anomaly Detector v2.4",
      explanations: [
        `Velocity index deviation: ${zScore}`,
        riskScore > 70 ? "Algorithmic smurfing and laundering structuring detected" : "Standard retail liquidity distribution",
        `Terminal node attribution confidence: ${Math.round(vasp.conf * 100)}%`
      ]
    },
    evidence: {
      canonical_sha256,
      certificate_65b: {
        certificate_id: `CERT-65B-${invId}`,
        statutory_act: "Section 63 Bharatiya Sakshya Adhiniyam, 2023 (formerly 65B IEA)",
        sha256_digest: canonical_sha256,
        verification_status: "CRYPTOGRAPHICALLY_VERIFIED",
        timestamp: new Date().toISOString(),
        certifying_officer: "Insp. Aditya Prashant Deshmukh",
        officer_badge: "MH-CYB-2241",
        station: "State Cyber Police Station, CID Pune HQ",
        terminal_id: "MH-CYBER-TERM-04",
        os_environment: "Ubuntu LTS 22.04 / TRACE-X Engine Core 2.0",
        attestation_text: "I hereby certify that the electronic ledger extraction and hash verification were conducted under controlled forensic conditions without system tampering or data alteration."
      }
    },
    intelligence: {
      risk_score: riskScore,
      risk_level: riskLevel,
      risk_factors: [
        {
          factor: riskScore > 70 ? "High-Velocity Cyber Laundering" : "Compliant Asset Transfer",
          points: riskScore > 70 ? 40 : 10,
          description: riskScore > 70 ? `Funds structured across ${nodes.length} multi-hop nodes.` : "Compliant retail transfer pattern.",
          severity: riskScore > 70 ? "CRITICAL" : "LOW",
          icon: "AlertTriangle"
        },
        {
          factor: "VASP Exit Attribution",
          points: 25,
          description: `Terminal exit ramp attributed to ${vasp.name} (${vasp.addr.slice(0, 10)}...).`,
          severity: "HIGH",
          icon: "Building2"
        }
      ],
      vasp: {
        name: vasp.name,
        label: vasp.label,
        address: vasp.addr,
        confidence: vasp.conf,
        confidence_pct: `${Math.round(vasp.conf * 100)}%`,
        distance_hops: Math.min(effectiveHops, 5),
        chain,
        jurisdiction: vasp.jur,
        action: `Issue Section 91 CrPC / Section 94 BNSS Freeze Summons to ${vasp.name} Compliance Desk`
      },
      secondary_vasps: [],
      chains_involved: [chain],
      total_transactions: edges.length,
      total_nodes: nodes.length,
      has_mixer: arch === 0 || arch === 3,
      has_cross_chain: arch === 2,
      max_hop_depth: effectiveHops
    }
  };
};

export const MOCK_BATCHES: IngestBatch[] = [
  {
    id: "BATCH-NCRP-2024-01",
    batch_id: "BATCH-NCRP-2024-01",
    batch_name: "NCRP National Intake Batch #881",
    status: "PROCESSED",
    total_records: 5,
    processed_records: 5,
    high_risk_count: 4,
    processed_count: 5,
    flagged_high_risk: 4,
    auto_freeze_alerts: 3,
    created_at: "2024-01-16 10:30:00 UTC",
    records: [
      { complaint_id: "NCRP/2024/MH/00911", wallet_address: "0xFraud_Origin_Task_Scam", chain: "ETH", category: "Task Scam", victim_loss_inr: 1250000, victim_name: "Rajesh Kumar", risk_score: 87, risk_level: "CRITICAL", status: "TRACED" },
      { complaint_id: "NCRP/2024/KA/00742", wallet_address: "0xPigButcher_Main", chain: "TRX", category: "Investment Fraud", victim_loss_inr: 4500000, victim_name: "Anita Desai", risk_score: 72, risk_level: "HIGH", status: "TRACED" },
      { complaint_id: "NCRP/2024/DL/00431", wallet_address: "0xRugPull_Dev", chain: "ETH", category: "Exchange Hack", victim_loss_inr: 12000000, victim_name: "Virendra Sachdeva", risk_score: 94, risk_level: "CRITICAL", status: "TRACED" },
      { complaint_id: "NCRP/2024/GJ/00519", wallet_address: "0xTelegram_Job_Scam_Origin", chain: "ETH", category: "Telegram Task Fraud", victim_loss_inr: 1850000, victim_name: "Sunil Mehta", risk_score: 81, risk_level: "HIGH", status: "TRACED" },
      { complaint_id: "NCRP/2024/TN/00688", wallet_address: "0xFedEx_Impersonation_TRX", chain: "TRX", category: "Digital Arrest Police Extortion", victim_loss_inr: 3200000, victim_name: "Dr. S. Venkat", risk_score: 89, risk_level: "CRITICAL", status: "TRACED" }
    ]
  }
];
