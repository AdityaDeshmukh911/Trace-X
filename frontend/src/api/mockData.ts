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

  // ── Typology & Modus Operandi ──
  const isTaskScamPreset = addr.toLowerCase().includes("task") || addr === "0xFraud_Origin_Task_Scam";
  const isPigButcherPreset = addr.toLowerCase().includes("pigbutcher") || addr === "0xPigButcher_Main";
  const isRansomwarePreset = addr.toLowerCase().includes("ransom") || addr === "0xRansomWallet_BTC";
  const isJobScamPreset = addr.toLowerCase().includes("telegram") || addr === "0xTelegram_Job_Scam_Origin";

  let typologyCode = "TYP_TASK_MULE";
  let typologyName = "Part-Time Task Scam & Prepaid Rating Fraud";
  let threatActor = "Organized Telegram / WhatsApp Task Syndicate";
  let legalClass = "IPC Sec 419, 420, 120-B | IT Act Sec 66-D | Section 63 BSA 2023";

  if (isPigButcherPreset || (!isTaskScamPreset && !isRansomwarePreset && (chain === "TRX" || seed % 4 === 1))) {
    typologyCode = "TYP_SHA_ZHU_PAN";
    typologyName = "Investment & Romance Fraud (Pig Butchering / Sha Zhu Pan)";
    threatActor = "Southeast Asia Industrial Fraud Compound (Mekong Region)";
    legalClass = "IPC Sec 420, 384, 120-B | IT Act Sec 66-C, 66-D | Section 63 BSA 2023";
  } else if (isRansomwarePreset || (!isTaskScamPreset && (chain === "BTC" || seed % 4 === 2))) {
    typologyCode = "TYP_RANSOM_01";
    typologyName = "LockBit 3.0 Ransomware Extortion & Asset Laundering";
    threatActor = "LockBit / BlackCat Ransomware-as-a-Service Syndicate";
    legalClass = "IPC Sec 384, 385, 420, 120-B | IT Act Sec 43, 66, 66-F | Section 63 BSA 2023";
  } else if (isJobScamPreset || seed % 4 === 3) {
    typologyCode = "TYP_DIGITAL_ARREST";
    typologyName = "Digital Arrest & CBI / Police Impersonation Extortion";
    threatActor = "Cross-Border Cyber Extortion Cartel";
    legalClass = "IPC Sec 170, 384, 419, 420, 120-B | IT Act Sec 66-D | Section 63 BSA 2023";
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
    { name: "Binance", label: "Binance Hot Wallet 6", addr: chain === "TRX" ? "TNDF91K98x2OkxHotWalletCluster03" : chain === "BTC" ? "bc1qBinanceHotVaultLiquidation99120" : "0x28C6c06298d514Db089934071355E5743bf21d60", jur: "Cayman Islands", conf: 0.99 },
    { name: "CoinDCX", label: "CoinDCX Custody Settlement Vault", addr: chain === "TRX" ? "TCoinDCXHotSettlementVault01" : chain === "BTC" ? "bc1qCoinDCXCustodyVault881" : "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", jur: "India (FIU-IND Registered)", conf: 0.96 },
    { name: "OKX", label: "OKX Mainnet Hot Wallet 3", addr: chain === "TRX" ? "TOkxMainnetSweepVaultCluster09" : chain === "BTC" ? "bc1qOkxMainnetSweepVault551" : "0x6cC5f688a30d3790e63a50BFC07fC24285564a86", jur: "Seychelles", conf: 0.97 },
    { name: "WazirX", label: "WazirX Treasury Settlement Node", addr: chain === "TRX" ? "TWazirXTreasuryNodeIndia44" : chain === "BTC" ? "bc1qWazirXTreasuryNodeIndia22" : "0x5B5634C42055806a59e9107ED44D43c426E58258", jur: "India (FIU-IND Registered)", conf: 0.94 },
    { name: "Kraken", label: "Kraken Primary Liquidation Vault", addr: chain === "TRX" ? "TKrakenLiquidationHub881" : chain === "BTC" ? "bc1qKrakenPrimaryVault992" : "0x267be1C1D684F78cb4F6a176C4911b741E4Ffdc0", jur: "United States", conf: 0.95 }
  ];
  const vasp = vasps[seed % vasps.length];

  // ── Mixer / Privacy Infrastructure ──
  let mixerName = "Tornado.Cash 10 ETH Pool";
  let mixerAddr = "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b";
  let mixerFlags = ["MIXER", "OFAC_SDN"];
  let dexName = "Uniswap V3 Liquidity Router";
  let dexAddr = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

  if (chain === "TRX") {
    mixerName = "SunSwap High-Slippage Pool";
    mixerAddr = "TKzY91SunSwapLiquidityPair992";
    mixerFlags = ["MIXER", "HIGH_RISK_DEX"];
    dexName = "JustLend Protocol Gateway";
    dexAddr = "TJLendLiquidityPoolContract771";
  } else if (chain === "BTC") {
    mixerName = "Wasabi CoinJoin Anonymizer";
    mixerAddr = "bc1qWasabiCoinJoinPoolMixer440";
    mixerFlags = ["MIXER", "COINJOIN_PRIVACY"];
    dexName = "THORChain Cross-Chain Vault";
    dexAddr = "bc1qThorChainLiquidityVault119";
  }

  // ── Intermediary Wallets Deterministic Generation ──
  const pfx = chain === "TRX" ? "T" : chain === "BTC" ? "bc1q" : "0x";
  const mule1Addr = `${pfx}Mule1_${addr.slice(2, 6) || "9A"}_Aggregator`;
  const mule2Addr = `${pfx}Mule2_${addr.slice(-4) || "8F"}_Funnel`;
  const split1Addr = `${pfx}Splitter_${addr.slice(3, 7) || "4B"}_Layer`;
  const p2pAddr = `${pfx}P2P_${addr.slice(-3) || "3C"}_Settlement`;
  const postMixerAddr = `${pfx}PostMixer_${addr.slice(2, 5) || "7D"}_Sweep`;
  const bridgeAddr = `${pfx}Bridge_${chain === "ETH" ? "Wormhole" : "Allbridge"}_Router`;
  const vaspColdVault = `${pfx}ColdStorage_${vasp.name}_MultiSig`;

  // ── All 6 Hops Graph Nodes ──
  const allGraphNodes = [
    // Hop 0
    { id: addr, type: "SUSPECT" as const, label: "Origin Scam Deposit", chain, is_suspect: true, hop_distance: 0, risk_flags: ["VICTIM_DEPOSIT", "HIGH_RISK"] },
    // Hop 1
    { id: mule1Addr, type: "SUSPECT" as const, label: "Layer 1 Aggregator Mule", chain, is_suspect: true, hop_distance: 1, risk_flags: ["FAN_OUT", "MULE"] },
    { id: mule2Addr, type: "SUSPECT" as const, label: "Layer 1 Secondary Mule", chain, is_suspect: true, hop_distance: 1, risk_flags: ["FAN_OUT", "MULE"] },
    // Hop 2
    { id: split1Addr, type: "SUSPECT" as const, label: "Smurfing Funnel Splitter", chain, is_suspect: true, hop_distance: 2, risk_flags: ["SMURFING", "LAYERING"] },
    { id: p2pAddr, type: "SUSPECT" as const, label: "P2P Settlement Collector", chain, is_suspect: true, hop_distance: 2, risk_flags: ["P2P_RAMP", "LAYERING"] },
    // Hop 3
    { id: mixerAddr, type: "MIXER" as const, label: mixerName, chain, is_suspect: false, hop_distance: 3, sanction_status: chain === "ETH" ? "OFAC_SDN" : undefined, risk_flags: mixerFlags },
    { id: dexAddr, type: "DEX" as const, label: dexName, chain, is_suspect: false, hop_distance: 3, risk_flags: ["DEX_ROUTER", "SWAP"] },
    // Hop 4
    { id: postMixerAddr, type: "SUSPECT" as const, label: "Post-Obfuscation Collector", chain, is_suspect: true, hop_distance: 4, risk_flags: ["POST_MIXER_SWEEP"] },
    { id: bridgeAddr, type: "BRIDGE" as const, label: "Cross-Chain Liquidity Gateway", chain, is_suspect: false, hop_distance: 4, risk_flags: ["CROSS_CHAIN_BRIDGE"] },
    // Hop 5
    { id: vasp.addr, type: "EXCHANGE" as const, label: vasp.label, chain, is_suspect: false, hop_distance: 5, vasp_name: vasp.name, vasp_jurisdiction: vasp.jur, confidence: vasp.conf, risk_flags: ["VASP_HOT_WALLET", "EXIT_RAMP"] },
    // Hop 6
    { id: vaspColdVault, type: "EXCHANGE" as const, label: `${vasp.name} Cold Multi-Sig Vault`, chain, is_suspect: false, hop_distance: 6, vasp_name: vasp.name, vasp_jurisdiction: vasp.jur, confidence: 0.99, risk_flags: ["COLD_STORAGE", "RESERVE"] }
  ];

  // ── Filter nodes strictly by requested hops ──
  const nodes = allGraphNodes.filter((n) => n.hop_distance <= effectiveHops);
  const nodeIds = new Set(nodes.map((n) => n.id));

  // ── Amounts & Percentages ──
  const p1 = Number((totalDeposit * 0.62).toFixed(2));
  const p2 = Number((totalDeposit * 0.38).toFixed(2));
  const p3 = Number((p1 * 0.92).toFixed(2));
  const p4 = Number((p2 * 0.94).toFixed(2));
  const p5 = Number((p3 * 0.95).toFixed(2));
  const p6 = Number((p4 * 0.95).toFixed(2));
  const p7 = Number((p5 * 0.96).toFixed(2));
  const p8 = Number((p6 * 0.96).toFixed(2));
  const p9 = Number((p7 * 0.98).toFixed(2));
  const p10 = Number((p8 * 0.98).toFixed(2));
  const p11 = Number(((p9 + p10) * 0.85).toFixed(2));

  const now = Date.now();
  const makeTxHash = (i: number) => {
    let h = "";
    for (let k = 0; k < 4; k++) {
      h += Math.abs((seed ^ (i * 1000 + k * 2345)) * 16807).toString(16).padStart(8, "0");
    }
    return chain === "BTC" || chain === "TRX" ? h.substring(0, 64) : `0x${h.substring(0, 64)}`;
  };

  // ── All Potential Edges ──
  const allEdges = [
    // Hop 1
    { id: "e1", source: addr, target: mule1Addr, amount: p1, timestamp: new Date(now - 7200000).toISOString().replace("T", " ").substring(0, 19), chain, hash: makeTxHash(1) },
    { id: "e2", source: addr, target: mule2Addr, amount: p2, timestamp: new Date(now - 7000000).toISOString().replace("T", " ").substring(0, 19), chain, hash: makeTxHash(2) },
    // Hop 2
    { id: "e3", source: mule1Addr, target: split1Addr, amount: p3, timestamp: new Date(now - 5600000).toISOString().replace("T", " ").substring(0, 19), chain, hash: makeTxHash(3) },
    { id: "e4", source: mule2Addr, target: p2pAddr, amount: p4, timestamp: new Date(now - 5400000).toISOString().replace("T", " ").substring(0, 19), chain, hash: makeTxHash(4) },
    // Hop 3
    { id: "e5", source: split1Addr, target: mixerAddr, amount: p5, timestamp: new Date(now - 4200000).toISOString().replace("T", " ").substring(0, 19), chain, hash: makeTxHash(5) },
    { id: "e6", source: p2pAddr, target: dexAddr, amount: p6, timestamp: new Date(now - 4000000).toISOString().replace("T", " ").substring(0, 19), chain, hash: makeTxHash(6) },
    // Hop 4
    { id: "e7", source: mixerAddr, target: postMixerAddr, amount: p7, timestamp: new Date(now - 2800000).toISOString().replace("T", " ").substring(0, 19), chain, hash: makeTxHash(7) },
    { id: "e8", source: dexAddr, target: bridgeAddr, amount: p8, timestamp: new Date(now - 2600000).toISOString().replace("T", " ").substring(0, 19), chain, hash: makeTxHash(8) },
    // Hop 5
    { id: "e9", source: postMixerAddr, target: vasp.addr, amount: p9, timestamp: new Date(now - 1400000).toISOString().replace("T", " ").substring(0, 19), chain, hash: makeTxHash(9) },
    { id: "e10", source: bridgeAddr, target: vasp.addr, amount: p10, timestamp: new Date(now - 1200000).toISOString().replace("T", " ").substring(0, 19), chain, hash: makeTxHash(10) },
    // Hop 6
    { id: "e11", source: vasp.addr, target: vaspColdVault, amount: p11, timestamp: new Date(now - 300000).toISOString().replace("T", " ").substring(0, 19), chain, hash: makeTxHash(11) }
  ];

  // ── Filter edges strictly by active nodes ──
  const edges = allEdges.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target));

  // ── Risk Score Calculation ──
  let riskScore = 78;
  if (effectiveHops >= 3) riskScore += 10;
  if (effectiveHops >= 5) riskScore += 6;
  riskScore = Math.min(96, riskScore + (seed % 6));

  // ── Deterministic SHA-256 Digest ──
  let sha = "";
  for (let k = 0; k < 8; k++) {
    sha += Math.abs((seed ^ (effectiveHops * 100 + k * 87654)) * 2654435761).toString(16).padStart(8, "0");
  }
  const canonical_sha256 = sha.substring(0, 64);

  // ── Case Specific Narrative ──
  const narrative = `Forensic graph analysis of wallet ${addr} on the ${chain} ledger confirms ${typologyName}. 
An initial fraudulent dissipation of ${totalDeposit} ${chain} (approx. ₹${fiatINR.toLocaleString("en-IN")}) was detected. 
Proceeds were split across 2 Layer-1 aggregator mules at Hop 1, layered through smurfing and obfuscation infrastructure (${mixerName}) at Hop 3, with ${edges.length} structured transactions mapped across ${nodes.length} nodes over ${effectiveHops} hops. 
${effectiveHops >= 5 ? `Terminal fund liquidation occurred at centralized exchange ${vasp.name} (${vasp.addr.slice(0, 10)}...) under jurisdiction of ${vasp.jur}. Immediate statutory freeze summons under Section 91 CrPC / Section 94 BNSS is advised.` : `Funds have progressed through ${effectiveHops} hops and remain under active surveillance pending terminal VASP attribution.`}`;

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
      indicators: ["RAPID_FAN_OUT", "SMURFING_SPLITTING", "OBFUSCATION_ROUTING", "TERMINAL_VASP_SWEEP"],
      investigative_sop: [
        `1. Serve Section 91 CrPC / Section 94 BNSS preservation requisition to ${vasp.name} compliance desk`,
        "2. Interdict Layer-1 and Layer-2 mule UPI/IMPS withdrawal gateways across partner banks",
        "3. Lodge CDR / IPDR requisition with telecom providers for suspect phone/IP clusters",
        "4. Synchronize incident cryptographic hash with I4C NCRP national portal"
      ]
    },
    ml_anomaly: {
      ml_anomaly_index: Number((0.82 + (seed % 15) / 100).toFixed(2)),
      anomaly_tier: "CRITICAL_ANOMALY",
      z_score_velocity: `+${(3.1 + (seed % 10) / 10).toFixed(2)}σ (High Velocity)`,
      value_entropy_index: 0.92,
      graph_centrality_skew: 0.86,
      model_description: "Isolation Forest + Graph Neural Network Anomaly Detector v2.4",
      explanations: [
        "Velocity deviation exceeds 99.2th percentile of standard retail volume",
        "High smurfing entropy indicates automated algorithmic splitting across multiple mules",
        "Terminal flow consolidates directly into KYC-verified VASP hot wallet"
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
      risk_level: riskScore >= 75 ? "CRITICAL" : "HIGH",
      risk_factors: [
        { factor: "Anonymization & Privacy Routing", points: 35, description: `Funds routed through ${mixerName} to break continuous transaction linkage.`, severity: "CRITICAL", icon: "AlertTriangle" },
        { factor: "Algorithmic Fan-Out Smurfing", points: 25, description: `Automated structuring across ${nodes.filter((n) => n.hop_distance <= 2).length} intermediary mule addresses.`, severity: "HIGH", icon: "Split" },
        { factor: "Terminal VASP Liquidation Exit", points: 25, description: `Identified final exit ramp at centralized exchange ${vasp.name} (${vasp.addr.slice(0, 10)}...).`, severity: "HIGH", icon: "Building2" }
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
      has_mixer: effectiveHops >= 3,
      has_cross_chain: effectiveHops >= 4,
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
