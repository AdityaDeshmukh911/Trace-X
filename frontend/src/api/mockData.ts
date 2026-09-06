import { TraceResult, Case, AlertItem, FreezeRequestItem, ClusterInfo, DossierReport, SystemSettings, SystemStats, IngestBatch } from "../types";

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

export const getMockTraceResult = (
  startAddress = "0xFraud_Origin_Task_Scam",
  chainArg = "ETH",
  hops = 5
): TraceResult => {
  let chain = (chainArg || "ETH").toUpperCase();
  const addr = (startAddress || "0xFraud_Origin_Task_Scam").trim();
  if (addr.startsWith("T") && addr.length > 20) chain = "TRX";
  else if ((addr.startsWith("1") || addr.startsWith("3") || addr.startsWith("bc1")) && addr.length > 20) chain = "BTC";
  else if (!["ETH", "TRX", "BTC"].includes(chain)) chain = "ETH";

  const invId = `INV-${Math.abs(addr.split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(16).substring(0, 8).toUpperCase()}`;
  const complaintId = `NCRP/2024/${chain}/${Math.floor(10000 + Math.random() * 89999)}`;

  const isPigButchering = addr.toLowerCase().includes("pigbutcher") || chain === "TRX";
  const isRansomware = addr.toLowerCase().includes("ransom") || chain === "BTC";
  const isTelegramJob = addr.toLowerCase().includes("telegram");

  let typologyName = "Task Scam / Deposit Multi-Hop Sweep";
  let vaspName = "Binance";
  let vaspLabel = "Binance Hot Wallet 6";
  let vaspAddress = "0x28C6c06298d514Db089934071355E5743bf21d60";
  let vaspJurisdiction = "Cayman Islands";
  let riskScore = 87;
  let mixerName = "Tornado.Cash 10 ETH Pool";
  let mixerAddress = "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b";
  let mixerFlag = "OFAC_SDN";
  let mule1Addr = `0xLayer1_Mule_${addr.slice(2, 6) || "A"}`;
  let mule2Addr = `0xLayer2_Splitter_${addr.slice(-4) || "B"}`;

  if (isPigButchering) {
    typologyName = "Investment Fraud (Pig Butchering / Sha Zhu Pan)";
    vaspName = "OKX";
    vaspLabel = "OKX Exchange Hot Wallet 3";
    vaspAddress = "TNDF91K98x2OkxHotWalletCluster03";
    vaspJurisdiction = "Seychelles";
    riskScore = 92;
    mixerName = "SunSwap Liquidity Pool";
    mixerAddress = "TKzY91SunSwapLiquidityPair992";
    mixerFlag = "HIGH_RISK_DEX_ROUTER";
    mule1Addr = `TMuleAggregator_${addr.slice(1, 5) || "41"}`;
    mule2Addr = `TTronSplitter_${addr.slice(-4) || "88"}`;
  } else if (isRansomware) {
    typologyName = "LockBit 3.0 Ransomware Payment Extortion";
    vaspName = "Kraken";
    vaspLabel = "Kraken Primary Liquidation Vault";
    vaspAddress = "bc1qKrakenHotVaultLiquidation99120";
    vaspJurisdiction = "United States";
    riskScore = 95;
    mixerName = "Wasabi CoinJoin Anonymizer";
    mixerAddress = "bc1qWasabiCoinJoinPoolMixer440";
    mixerFlag = "COINJOIN_PRIVACY";
    mule1Addr = `bc1q_peel_hop1_${addr.slice(-4) || "mule"}`;
    mule2Addr = `bc1q_peel_hop2_${addr.slice(3, 7) || "split"}`;
  } else if (isTelegramJob) {
    typologyName = "Telegram Part-Time Task & Prepaid Rating Fraud";
    vaspName = "CoinDCX";
    vaspLabel = "CoinDCX Custody Hot Wallet";
    vaspAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    vaspJurisdiction = "India (FIU-IND Registered)";
    riskScore = 84;
    mixerName = "Railgun Privacy Contract";
    mixerAddress = "0xfa7093cdd9ee6932b4eb2c9e1cde7ce00b1fa4b9";
    mixerFlag = "PRIVACY_ROUTER";
    mule1Addr = `0xTelegram_Mule_Layer1_${addr.slice(2, 6) || "9"}`;
    mule2Addr = `0xConsolidator_Splitter_${addr.slice(-4) || "2"}`;
  }

  const allNodes = [
    {
      id: addr,
      type: "SUSPECT" as const,
      label: "Origin Scam Deposit",
      chain,
      is_suspect: true,
      hop_distance: 0,
      risk_flags: ["VICTIM_DEPOSIT", "HIGH_RISK"]
    },
    {
      id: mule1Addr,
      type: "SUSPECT" as const,
      label: isRansomware ? "Peeling Chain Hop #1" : "Layer 1 Aggregator Mule",
      chain,
      is_suspect: true,
      hop_distance: 1,
      risk_flags: ["FAN_OUT", "MULE"]
    },
    {
      id: mule2Addr,
      type: "SUSPECT" as const,
      label: isRansomware ? "Peeling Chain Hop #2" : "Smurfing Funnel Account",
      chain,
      is_suspect: true,
      hop_distance: 2,
      risk_flags: ["SMURFING", "LAYERING"]
    },
    {
      id: mixerAddress,
      type: "MIXER" as const,
      label: mixerName,
      chain,
      is_suspect: false,
      hop_distance: 3,
      sanction_status: isRansomware || !isPigButchering ? "SANCTIONED_OFAC" : undefined,
      risk_flags: [mixerFlag, "OBFUSCATION"]
    },
    {
      id: vaspAddress,
      type: "EXCHANGE" as const,
      label: vaspLabel,
      chain,
      is_suspect: false,
      hop_distance: 4,
      vasp_name: vaspName,
      vasp_jurisdiction: vaspJurisdiction,
      risk_flags: ["VASP_HOT_WALLET"]
    }
  ];

  if (hops >= 6) {
    allNodes.push({
      id: `0xColdVault_${vaspName}`,
      type: "EXCHANGE" as const,
      label: `${vaspName} Cold Vault Multi-Sig`,
      chain,
      is_suspect: false,
      hop_distance: 5,
      vasp_name: vaspName,
      vasp_jurisdiction: vaspJurisdiction,
      risk_flags: ["COLD_STORAGE", "RESERVE"]
    });
  }

  const activeHopLimit = Math.max(2, Math.min(hops, allNodes.length - 1));
  const nodes = allNodes.slice(0, activeHopLimit + 1);

  const edgeAmounts = [14.5, 12.0, 10.0, 2.0, 1.5];
  const edges = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    const amt = edgeAmounts[i] || (10 / (i + 1));
    const txHash = `0x${Math.abs(Math.sin(i + 1) * 1e16).toString(16)}${Math.abs(Math.cos(i + 1) * 1e16).toString(16)}`;
    edges.push({
      id: `e${i + 1}`,
      source: nodes[i].id,
      target: nodes[i + 1].id,
      amount: parseFloat(amt.toFixed(2)),
      timestamp: new Date(Date.now() - (nodes.length - 1 - i) * 1800000).toISOString().replace("T", " ").substring(0, 19),
      chain,
      hash: txHash
    });
  }

  const sha256 = "d08037a48e707bd78fc32cf064ca98de9b618e86d683f474b920856df58c8d60";

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
      max_hop_depth: activeHopLimit,
      timestamp: new Date().toISOString()
    },
    narrative: `Forensic graph analysis confirms high-velocity fund dissipation originating from initial victim deposit at ${addr.slice(0, 14)}... on the ${chain} ledger. Proceeds were rapidly layered across ${activeHopLimit} intermediary hops, engaging ${mixerName} before terminal deposit aggregation at ${vaspName} exchange infrastructure (${vaspAddress.slice(0, 10)}...).`,
    typology: {
      typology_code: isRansomware ? "TYP_RANSOM_01" : isPigButchering ? "TYP_SHA_ZHU_PAN" : "TYP_TASK_MULE",
      typology_name: typologyName,
      confidence: 0.94,
      confidence_pct: "94%",
      threat_actor: isRansomware ? "LockBit / DarkSide Cyber Syndicate" : isPigButchering ? "Southeast Asia Pig Butchering Syndicate" : "Organized Telegram Task Scam Syndicate",
      legal_classification: "IPC Sec 419, 420, 120-B | IT Act Sec 66-D | Section 63 BSA 2023",
      indicators: ["RAPID_FAN_OUT", "OBFUSCATION", "CENTRALIZED_VASP_EXIT"],
      investigative_sop: [
        "1. Immediate Section 91 CrPC / 94 BNSS preservation notice to terminal VASP",
        "2. Trace upstream fiat ramps linking P2P accounts associated with intermediary mules",
        "3. Lodge CDR/IPDR lookup on suspect Telegram and WhatsApp operational numbers",
        "4. Freeze KYC beneficiary bank account mapped to VASP INR liquidation desk"
      ]
    },
    ml_anomaly: {
      ml_anomaly_index: 0.88,
      anomaly_tier: "CRITICAL_ANOMALY",
      z_score_velocity: "+3.42σ (High Velocity)",
      value_entropy_index: 0.91,
      graph_centrality_skew: 0.84,
      model_description: "Isolation Forest + Graph Neural Network Anomaly Detector v2.4",
      explanations: [
        "Velocity deviation exceeds 99.4th percentile of benign retail transfers",
        "High smurfing entropy indicates automated algorithmic splitting",
        "Unidirectional flow terminating directly into KYC-verified VASP hot wallet"
      ]
    },
    evidence: {
      canonical_sha256: sha256,
      certificate_65b: {
        certificate_id: `CERT-65B-${invId}`,
        statutory_act: "Section 63 Bharatiya Sakshya Adhiniyam, 2023 (formerly 65B IEA)",
        sha256_digest: sha256,
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
      risk_level: "CRITICAL",
      risk_factors: [
        { factor: "OFAC Sanctioned Entity / Privacy Obfuscator", points: 40, description: `Funds routed through ${mixerName} to break continuous on-chain audit trail.`, severity: "CRITICAL", icon: "AlertTriangle" },
        { factor: "Smurfing & Mule Layering", points: 25, description: "Structured rapid fan-out across multiple intermediary mule addresses.", severity: "HIGH", icon: "Split" },
        { factor: "Terminal VASP Liquidation Ramp", points: 22, description: `Identified exit ramp at centralized exchange ${vaspName} (${vaspAddress.slice(0, 10)}...).`, severity: "HIGH", icon: "Building2" }
      ],
      vasp: {
        name: vaspName,
        label: vaspLabel,
        address: vaspAddress,
        confidence: 0.99,
        confidence_pct: "99%",
        distance_hops: activeHopLimit,
        chain,
        jurisdiction: vaspJurisdiction,
        action: `Issue Section 91 CrPC / Section 94 BNSS Freeze Summons to ${vaspName} Compliance Desk`
      },
      secondary_vasps: [],
      chains_involved: [chain],
      total_transactions: edges.length,
      total_nodes: nodes.length,
      has_mixer: true,
      has_cross_chain: isPigButchering,
      max_hop_depth: activeHopLimit
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
