import os
import json
import sqlite3
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any

DB_PATH = os.path.abspath(os.getenv("TRACEX_DB_PATH", os.path.join(os.path.dirname(__file__), "tracex.db")))

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, timeout=30.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    return conn

def init_db():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS investigations (
        id TEXT PRIMARY KEY,
        start_address TEXT NOT NULL,
        chain TEXT NOT NULL,
        risk_score INTEGER NOT NULL,
        risk_level TEXT NOT NULL,
        typology TEXT,
        typology_confidence INTEGER,
        ml_anomaly_score REAL,
        hash_sha256 TEXT NOT NULL,
        data_json TEXT NOT NULL,
        created_at TEXT NOT NULL
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS cases (
        id TEXT PRIMARY KEY,
        complaint_id TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        status TEXT NOT NULL,
        suspect_wallet TEXT NOT NULL,
        chain TEXT NOT NULL,
        risk_score INTEGER NOT NULL,
        investigator TEXT NOT NULL,
        victim_loss_inr INTEGER NOT NULL,
        victim_name TEXT,
        created_at TEXT NOT NULL
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS indexed_addresses (
        address TEXT PRIMARY KEY,
        chain TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        label TEXT NOT NULL,
        confidence REAL,
        vasp_name TEXT,
        vasp_jurisdiction TEXT,
        sanction_status TEXT,
        cluster_id TEXT,
        risk_flags_json TEXT,
        first_seen TEXT,
        last_seen TEXT
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS alerts (
        id TEXT PRIMARY KEY,
        investigation_id TEXT,
        severity TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        wallet_address TEXT NOT NULL,
        chain TEXT NOT NULL,
        risk_score INTEGER NOT NULL,
        status TEXT DEFAULT 'UNREAD',
        created_at TEXT NOT NULL
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS freeze_requests (
        id TEXT PRIMARY KEY,
        investigation_id TEXT NOT NULL,
        case_id TEXT,
        vasp_name TEXT NOT NULL,
        wallet_address TEXT NOT NULL,
        chain TEXT NOT NULL,
        target_amount REAL NOT NULL,
        currency TEXT DEFAULT 'USDT',
        status TEXT DEFAULT 'DRAFT',
        notice_number TEXT NOT NULL,
        crpc_section TEXT DEFAULT 'Section 91 CrPC / Section 94 BNSS',
        investigator_name TEXT NOT NULL,
        investigator_badge TEXT NOT NULL,
        police_station TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        officer_notes TEXT,
        notice_body TEXT,
        audit_trail_json TEXT NOT NULL
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS clusters (
        cluster_id TEXT PRIMARY KEY,
        cluster_label TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        heuristics_applied TEXT NOT NULL,
        address_count INTEGER NOT NULL,
        member_addresses_json TEXT NOT NULL,
        risk_score INTEGER NOT NULL,
        created_at TEXT NOT NULL
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS ingest_batches (
        id TEXT PRIMARY KEY,
        batch_name TEXT NOT NULL,
        total_records INTEGER NOT NULL,
        processed_records INTEGER NOT NULL,
        high_risk_count INTEGER NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        records_json TEXT NOT NULL
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        case_id TEXT,
        title TEXT NOT NULL,
        target_address TEXT NOT NULL,
        chain TEXT NOT NULL,
        typology TEXT,
        risk_score INTEGER NOT NULL,
        ml_anomaly_score REAL,
        investigating_officer TEXT NOT NULL,
        police_station TEXT NOT NULL,
        sha256_hash TEXT NOT NULL,
        pdf_path TEXT,
        status TEXT DEFAULT 'CERTIFIED',
        created_at TEXT NOT NULL,
        evidence_metadata_json TEXT
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    );
    """)

    # Indexes for fast retrieval
    cur.execute("CREATE INDEX IF NOT EXISTS idx_investigations_wallet ON investigations(start_address);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_cases_wallet ON cases(suspect_wallet);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_alerts_wallet ON alerts(wallet_address);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_freeze_vasp ON freeze_requests(vasp_name);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_freeze_status ON freeze_requests(status);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_indexed_chain ON indexed_addresses(chain);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_indexed_entity ON indexed_addresses(entity_type);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_reports_case ON reports(case_id);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_reports_hash ON reports(sha256_hash);")

    conn.commit()

    # Seed initial cases if empty
    cur.execute("SELECT COUNT(*) FROM cases;")
    if cur.fetchone()[0] == 0:
        seed_cases = [
            ("CASE-2024-001", "NCRP/2024/MH/00441", "Task Scam — Crypto", "ACTIVE", "0xFraud_Origin_Task_Scam", "ETH", 87, "Insp. Aditya Sharma", 1250000, "Rajesh Kumar", "2024-01-15 09:30:00"),
            ("CASE-2024-002", "NCRP/2024/MH/00389", "Investment Fraud — Pig Butchering", "PENDING", "0xPigButcher_Main", "TRX", 72, "Insp. Aditya Sharma", 4500000, "Anita Desai", "2024-01-12 14:15:00"),
            ("CASE-2024-003", "NCRP/2024/DL/00218", "Exchange Hack — Rug Pull", "CLOSED", "0xRugPull_Dev", "ETH", 94, "SP Priya Nair", 12000000, "Virendra Sachdeva", "2024-01-08 11:00:00"),
            ("CASE-2024-004", "NCRP/2024/KA/00512", "Ransomware Payment", "ACTIVE", "0xRansomWallet_BTC", "BTC", 81, "Insp. Aditya Sharma", 800000, "MedTech Diagnostics", "2024-01-18 08:45:00"),
            ("CASE-2024-005", "NCRP/2024/GJ/00819", "Part-Time Job / Telegram Scam", "ACTIVE", "0xTelegram_Job_Scam_Origin", "ETH", 89, "SI Rohit Verma", 1850000, "Sunil Mehta", "2024-02-01 10:20:00"),
            ("CASE-2024-006", "NCRP/2024/TN/00932", "FedEx Drug Courier Impersonation", "PENDING", "0xFedEx_Impersonation_TRX", "TRX", 78, "Insp. K. Raman", 3200000, "Dr. S. Venkat", "2024-02-05 16:40:00"),
        ]
        cur.executemany("""
            INSERT INTO cases (id, complaint_id, category, status, suspect_wallet, chain, risk_score, investigator, victim_loss_inr, victim_name, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, seed_cases)
        conn.commit()

    # Seed initial alerts if empty
    cur.execute("SELECT COUNT(*) FROM alerts;")
    if cur.fetchone()[0] == 0:
        seed_alerts = [
            ("ALT-001", None, "CRITICAL", "OFAC Sanctioned Mixer Interaction", "Suspect wallet routed 14.5 ETH directly through Tornado Cash pool (OFAC SDN designated). Laundering severity critical.", "0xFraud_Origin_Task_Scam", "ETH", 87, "UNREAD", datetime.utcnow().isoformat()),
            ("ALT-002", None, "HIGH", "High-Velocity Cross-Chain Hop Detected", "USDT-TRC20 funds routed across Stargate Bridge into Ethereum network within 180 seconds. Velocity exceeds 3.4 standard deviations.", "0xPigButcher_Main", "TRX", 72, "UNREAD", datetime.utcnow().isoformat()),
            ("ALT-003", None, "CRITICAL", "Terminal Deposit at Indian VASP WazirX", "Identified 4.2 ETH terminal deposit into WazirX hot wallet. Freeze notice recommended under Section 91 CrPC.", "0xRugPull_Dev", "ETH", 94, "ACKNOWLEDGED", datetime.utcnow().isoformat()),
            ("ALT-004", None, "HIGH", "Rapid Mule Fan-Out Disbursement", "Origin wallet distributed funds across 6 intermediary burner addresses in under 4 minutes.", "0xTelegram_Job_Scam_Origin", "ETH", 89, "UNREAD", datetime.utcnow().isoformat()),
        ]
        cur.executemany("""
            INSERT INTO alerts (id, investigation_id, severity, title, message, wallet_address, chain, risk_score, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, seed_alerts)
        conn.commit()

    # Seed initial clusters if empty
    cur.execute("SELECT COUNT(*) FROM clusters;")
    if cur.fetchone()[0] == 0:
        seed_clusters = [
            (
                "CLUS-BTC-COSPEND-01",
                "Lazarus-Linked Multi-Input Co-Spend Ring",
                "SUSPECT_RING",
                "Common-Input Co-Spend Heuristic (Satoshi Heuristic I)",
                5,
                json.dumps([
                    "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
                    "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
                    "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
                    "bc1qc7g2nhgcxaq8nvdg8s42k7lq5y5q2xeqqwhf7l",
                    "1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF"
                ]),
                92,
                datetime.utcnow().isoformat()
            ),
            (
                "CLUS-ETH-SWEEP-02",
                "Telegram Task Scam Consolidation Sweep",
                "LAUNDERING_SWEEP",
                "Deposit Sweep / Shared Destination Heuristic",
                4,
                json.dumps([
                    "0xFraud_Origin_Task_Scam",
                    "0xIntermediary_Mule_1",
                    "0xIntermediary_Mule_2",
                    "0xAssociated_Scammer_2"
                ]),
                88,
                datetime.utcnow().isoformat()
            ),
            (
                "CLUS-VASP-BINANCE-HOT",
                "Binance Hot Wallet Cluster 14/20",
                "EXCHANGE_CLUSTER",
                "VASP Exchange Operational Sweeping Heuristic",
                3,
                json.dumps([
                    "0x28C6c06298d514Db089934071355E5743bf21d60",
                    "0x21a31Ee1afC51d94C2eFCaa13a065722bda7D0C",
                    "TRXBinanceHot_Wallet"
                ]),
                10,
                datetime.utcnow().isoformat()
            )
        ]
        cur.executemany("""
            INSERT INTO clusters (cluster_id, cluster_label, entity_type, heuristics_applied, address_count, member_addresses_json, risk_score, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        """, seed_clusters)
        conn.commit()

    # Seed initial freeze requests if empty
    cur.execute("SELECT COUNT(*) FROM freeze_requests;")
    if cur.fetchone()[0] == 0:
        sample_audit = json.dumps([
            {"timestamp": datetime.utcnow().isoformat(), "action": "DRAFT_CREATED", "officer": "Insp. Aditya Prashant Deshmukh", "notes": "Freeze notice drafted upon trace attribution to Binance hot wallet."},
            {"timestamp": datetime.utcnow().isoformat(), "action": "SUBPOENA_GENERATED", "officer": "Insp. Aditya Prashant Deshmukh", "notes": "Statutory notice generated under Section 91 CrPC / Section 94 BNSS."},
            {"timestamp": datetime.utcnow().isoformat(), "action": "DISPATCH_SENT", "officer": "System Dispatcher", "notes": "Dispatched via secure LEA portal to compliance@binance.com"},
        ])
        notice_sample = (
            "STATUTORY SUMMONS / ASSET FREEZE DIRECTIVE\n"
            "Under Section 91 of the Code of Criminal Procedure, 1973 (CrPC) / Section 94 Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)\n\n"
            "TO: Legal & Compliance Department, Binance Holdings Ltd.\n"
            "NOTICE REF: TRACEX/CRPC91/2024/0088\n"
            "CASE REF: NCRP/2024/MH/00441\n\n"
            "WHEREAS an investigation into Cyber Financial Fraud is underway pursuant to NCRP Complaint NCRP/2024/MH/00441;\n"
            "AND WHEREAS blockchain forensic tracing by TRACE-X platform has established that proceeds of crime amounting to 14.5 ETH / 45,000 USDT were deposited into your exchange wallet:\n"
            "TARGET WALLET / DEPOSIT REF: 0x28C6c06298d514Db089934071355E5743bf21d60 / TRXBinanceHot_Wallet\n\n"
            "YOU ARE HEREBY DIRECTED TO:\n"
            "1. Immediately FREEZE all accounts, sub-accounts, and custodial balances associated with the deposit reference.\n"
            "2. Preserve all KYC records, IP access logs, phone numbers, and linked withdrawal bank/crypto accounts.\n"
            "3. Submit a compliance report within 24 HOURS to Cyber Crime Investigation Cell, MIT AOE.\n\n"
            "Failure to comply shall attract penal proceedings under Section 175 of the Indian Penal Code (IPC) / Section 210 Bharatiya Nyaya Sanhita (BNS).\n\n"
            "ISSUING OFFICER: Insp. Aditya Prashant Deshmukh (Badge: CY-MH-4019)\n"
            "DATE: 2024-01-16"
        )

        seed_freezes = [
            (
                "FRZ-2024-001",
                "INV-TASK-01",
                "CASE-2024-001",
                "Binance",
                "0x28C6c06298d514Db089934071355E5743bf21d60",
                "TRX",
                45000.0,
                "USDT",
                "FREEZE_REQUESTED",
                "TRACEX/CRPC91/2024/0088",
                "Section 91 CrPC / Section 94 BNSS",
                "Insp. Aditya Prashant Deshmukh",
                "CY-MH-4019",
                "Cyber Cell Pune Head Office",
                datetime.utcnow().isoformat(),
                datetime.utcnow().isoformat(),
                "Target deposit confirmed at hop 4 from task scam origin. 24-hr compliance notice sent.",
                notice_sample,
                sample_audit
            )
        ]
        cur.executemany("""
            INSERT INTO freeze_requests (id, investigation_id, case_id, vasp_name, wallet_address, chain, target_amount, currency, status, notice_number, crpc_section, investigator_name, investigator_badge, police_station, created_at, updated_at, officer_notes, notice_body, audit_trail_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, seed_freezes)
        conn.commit()

    # Seed initial reports if empty
    cur.execute("SELECT COUNT(*) FROM reports;")
    if cur.fetchone()[0] == 0:
        seed_reports = [
            (
                "REP-2024-001",
                "CASE-2024-001",
                "Forensic Asset Attribution Brief — NCRP/2024/MH/00441",
                "0xFraud_Origin_Task_Scam",
                "ETH",
                "Task Scam / Deposit Multi-Hop Sweep",
                87,
                0.88,
                "Insp. Aditya Prashant Deshmukh",
                "State Cyber Police Station, Pune HQ",
                "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                "/tmp/tracex_reports/TRACE-X_CASE-2024-001.pdf",
                "CERTIFIED",
                "2024-01-16 14:20:00",
                json.dumps({
                    "certificate_id": "CERT-65B-REP-2024-001",
                    "legal_act": "Section 63 Bharatiya Sakshya Adhiniyam, 2023 / Section 65B Indian Evidence Act",
                    "hash_algorithm": "SHA-256",
                    "node_version": "TRACE-X v2.0 Enterprise LEA Engine",
                    "verified": True
                })
            ),
            (
                "REP-2024-002",
                "CASE-2024-002",
                "Pig Butchering Fund Dissipation Audit — NCRP/2024/MH/00389",
                "0xPigButcher_Main",
                "TRX",
                "Investment Fraud (Sha Zhu Pan)",
                72,
                0.74,
                "Insp. Aditya Prashant Deshmukh",
                "State Cyber Police Station, Pune HQ",
                "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
                "/tmp/tracex_reports/TRACE-X_CASE-2024-002.pdf",
                "SUBMITTED_IN_COURT",
                "2024-01-14 11:45:00",
                json.dumps({
                    "certificate_id": "CERT-65B-REP-2024-002",
                    "legal_act": "Section 63 Bharatiya Sakshya Adhiniyam, 2023 / Section 65B Indian Evidence Act",
                    "hash_algorithm": "SHA-256",
                    "node_version": "TRACE-X v2.0 Enterprise LEA Engine",
                    "verified": True
                })
            ),
            (
                "REP-2024-003",
                "CASE-2024-003",
                "Smart Contract Drainer Forensic Dossier — NCRP/2024/DL/00218",
                "0xRugPull_Dev",
                "ETH",
                "Smart Contract Drainer & Mixer Funnel",
                94,
                0.95,
                "SP Priya Nair",
                "Special Cell Cyber Unit, New Delhi",
                "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
                "/tmp/tracex_reports/TRACE-X_CASE-2024-003.pdf",
                "CERTIFIED",
                "2024-01-10 16:30:00",
                json.dumps({
                    "certificate_id": "CERT-65B-REP-2024-003",
                    "legal_act": "Section 63 Bharatiya Sakshya Adhiniyam, 2023 / Section 65B Indian Evidence Act",
                    "hash_algorithm": "SHA-256",
                    "node_version": "TRACE-X v2.0 Enterprise LEA Engine",
                    "verified": True
                })
            ),
            (
                "REP-2024-004",
                "CASE-2024-004",
                "Ransomware Multi-Input Co-Spend Audit — NCRP/2024/KA/00512",
                "0xRansomWallet_BTC",
                "BTC",
                "Ransomware Extortion Cluster",
                81,
                0.82,
                "Insp. Aditya Prashant Deshmukh",
                "State Cyber Police Station, Pune HQ",
                "4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce",
                "/tmp/tracex_reports/TRACE-X_CASE-2024-004.pdf",
                "FILED",
                "2024-01-19 18:00:00",
                json.dumps({
                    "certificate_id": "CERT-65B-REP-2024-004",
                    "legal_act": "Section 63 Bharatiya Sakshya Adhiniyam, 2023 / Section 65B Indian Evidence Act",
                    "hash_algorithm": "SHA-256",
                    "node_version": "TRACE-X v2.0 Enterprise LEA Engine",
                    "verified": True
                })
            )
        ]
        cur.executemany("""
            INSERT INTO reports (id, case_id, title, target_address, chain, typology, risk_score, ml_anomaly_score, investigating_officer, police_station, sha256_hash, pdf_path, status, created_at, evidence_metadata_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, seed_reports)
        conn.commit()

    # Seed initial settings if empty
    cur.execute("SELECT COUNT(*) FROM settings;")
    if cur.fetchone()[0] == 0:
        default_settings = [
            ("investigator_name", "Insp. Aditya Prashant Deshmukh"),
            ("investigator_badge", "MH-CYBER-8841"),
            ("police_station", "State Cyber Police Station, CID Pune HQ"),
            ("investigator_email", "aditya.deshmukh@mahapolice.gov.in"),
            ("statutory_framework", "BNSS_94"),
            ("jurisdiction", "Special Designated Court for Cyber Offenses, Pune"),
            ("risk_alert_threshold", "75"),
            ("velocity_threshold_z", "3.0"),
            ("hop_limit", "5"),
            ("etherscan_key", "C5X91K882NV91_ACTIVE"),
            ("trongrid_key", "TG_SEC_990142_ACTIVE"),
            ("anthropic_key", "sk-ant-prod-881920_ENABLED"),
            ("sahyog_endpoint", "https://sahyog.cybercrime.gov.in/api/v2"),
            ("auto_generate_certificates", "true"),
            ("enable_live_rpc_fallback", "true")
        ]
        cur.executemany("""
            INSERT INTO settings (key, value) VALUES (?, ?);
        """, default_settings)
        conn.commit()

    conn.close()

def get_all_reports(case_id: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_connection()
    cur = conn.cursor()
    if case_id:
        cur.execute("SELECT * FROM reports WHERE case_id = ? ORDER BY created_at DESC;", (case_id,))
    else:
        cur.execute("SELECT * FROM reports ORDER BY created_at DESC;")
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows

def get_report_by_id(report_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM reports WHERE id = ?;", (report_id,))
    row = cur.fetchone()
    conn.close()
    return dict(row) if row else None

def save_report(data: Dict[str, Any]) -> str:
    conn = get_connection()
    cur = conn.cursor()
    rep_id = data.get("id") or f"REP-{uuid.uuid4().hex[:8].upper()}"
    cur.execute("""
        INSERT OR REPLACE INTO reports (
            id, case_id, title, target_address, chain, typology, risk_score,
            ml_anomaly_score, investigating_officer, police_station, sha256_hash,
            pdf_path, status, created_at, evidence_metadata_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        rep_id,
        data.get("case_id"),
        data.get("title", f"Forensic Asset Attribution Brief — {data.get('target_address')[:10]}..."),
        data.get("target_address"),
        data.get("chain", "ETH"),
        data.get("typology", "Suspicious Multi-Hop Routing"),
        data.get("risk_score", 75),
        data.get("ml_anomaly_score", 0.50),
        data.get("investigating_officer", "Insp. Aditya Prashant Deshmukh"),
        data.get("police_station", "State Cyber Police Station, CID Pune HQ"),
        data.get("sha256_hash", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"),
        data.get("pdf_path"),
        data.get("status", "CERTIFIED"),
        data.get("created_at", datetime.utcnow().isoformat()),
        json.dumps(data.get("evidence_metadata", {}))
    ))
    conn.commit()
    conn.close()
    return rep_id

def get_all_settings() -> Dict[str, str]:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT key, value FROM settings;")
    rows = cur.fetchall()
    conn.close()
    return {r["key"]: r["value"] for r in rows}

def save_settings(new_settings: Dict[str, str]) -> Dict[str, str]:
    conn = get_connection()
    cur = conn.cursor()
    for k, v in new_settings.items():
        cur.execute("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?);", (k, str(v)))
    conn.commit()
    conn.close()
    return get_all_settings()

def get_database_stats() -> Dict[str, Any]:
    conn = get_connection()
    cur = conn.cursor()
    counts = {}
    for table in ["cases", "investigations", "alerts", "freeze_requests", "clusters", "indexed_addresses", "reports"]:
        try:
            cur.execute(f"SELECT COUNT(*) FROM {table};")
            counts[table] = cur.fetchone()[0]
        except Exception:
            counts[table] = 0
    
    db_size_bytes = os.path.getsize(DB_PATH) if os.path.exists(DB_PATH) else 0
    conn.close()
    return {
        "db_path": DB_PATH,
        "db_size_kb": round(db_size_bytes / 1024, 2),
        "wal_mode": True,
        "counts": counts
    }

if __name__ == "__main__":
    init_db()
    print("TRACE-X SQLite Database initialized successfully at", DB_PATH)

