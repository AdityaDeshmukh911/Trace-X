# TRACE-X (v2.0 Enterprise LEA Edition)
**Threat Response & Automated Crypto Exchange Intelligence**

A comprehensive, dark-mode crypto financial crime attribution & asset recovery platform built for Law Enforcement Agencies (LEAs), State Cyber Cells, and the MIT AOE Cyber Cell.

TRACE-X ingests complaints from NCRP/State portals in bulk or single-entry, performs multi-hop automated blockchain graph traversal, executes heuristic wallet clustering, classifies fraud typologies, detects topological/velocity anomalies, generates statutory Section 91 CrPC / Section 94 BNSS freeze orders to VASPs, and outputs cryptographically certified Section 65B Indian Evidence Act dossiers.

---

## 🚀 Key 10/10 Capabilities (Requirement Gap Closures)

1. **Bulk Ingestion Pipeline (`POST /api/v1/ingest/bulk`, `/ingest/upload-csv`)**:
   - Ingest hundreds of complaints via CSV / JSON with automated queue processing.
   - Batch status monitor, sample NCRP template generation, and instant high-risk tagging.

2. **Automated Incident Alert Feed (`/api/v1/alerts`)**:
   - Real-time event triggers firing whenever risk $\ge 75$, mixers, or OFAC designated addresses are intercepted.
   - Interactive Alert Center with severity filtering (Critical, High, Unread) and one-click "Deep Trace" or "Freeze Notice" actions.

3. **Statutory Asset Freezing & VASP Coordination Desk (`/api/v1/freeze/*`)**:
   - Full 5-stage lifecycle: `DRAFT` $\to$ `SUBPOENA_GENERATED` $\to$ `FREEZE_REQUESTED` $\to$ `VASP_ACKNOWLEDGED` $\to$ `ASSETS_FROZEN`.
   - Formal statutory summons generator under **Section 91 CrPC** and **Section 94 BNSS (2023)** with officer digital credentials, case citations, and 24-hour compliance deadline.
   - Dedicated VASP directory (Binance, OKX, Coinbase, Bybit, KuCoin, WazirX, CoinDCX) with SLA tracking and audit trails.

4. **Persistent SQLite Database & Graph Indexing**:
   - Persistent storage in `tracex.db` with WAL mode.
   - High-speed indexed query endpoint (`/api/v1/search/indexed-lookup`) across wallets, complaints, and prior investigations.

5. **Heuristic Wallet Clustering Engine (`/api/v1/clusters`)**:
   - **Common-Input Co-Spend Heuristic (Satoshi Heuristic 1)** for Bitcoin UTXO multi-input transactions.
   - **Deposit Sweep / Consolidation Heuristic** for EVM and TRON account models.
   - Curated knowledge base of 76+ verified real-world VASPs, mixers, bridges, and OFAC entities.

6. **Automated Fraud Typology Classifier**:
   - Derives fraud typology directly from graph behavior:
     - *Part-Time Task Scam (Telegram / YouTube Like)*
     - *Pig Butchering / Sha Zhu Pan (Investment / Romance)*
     - *Ransomware Extortion*
     - *Malicious Phishing / Smart Contract Drainer*
     - *DeFi Liquidity Rug Pull / Ponzi Scheme*
   - Produces typology confidence and tailored LEA Standard Operating Procedures (SOPs).

7. **Cryptographic Chain-of-Custody & Evidence Certification (`/api/v1/evidence/verify`)**:
   - SHA-256 canonical hashing of graph states and ledgers.
   - Formal **Section 65B Indian Evidence Act / Section 63 BSA (2023) Certificate of Electronic Evidence**.
   - Public verification portal to authenticate any report hash against the immutable database.

8. **Dual Risk Architecture (Rule-Based + AI/ML Anomaly Detection)**:
   - Court-defensible 6-factor deterministic scoring (0-100) paired with a **Topological & Velocity ML Anomaly Index** (Z-Score on disbursement velocity, entropy, centrality).

9. **Modern LEA Cyber Forensics Command Center UI**:
   - Dark cyber command aesthetic (Deep Slate, Cyan, Threat Crimson, Cyber Amber).
   - Dedicated pages: Investigate, Threat Alerts, Bulk Ingest, Freeze & VASP Desk, Cluster Explorer, Cases, and Evidence Verifier.

---

## 🏗 System Architecture

```
                                 ┌─────────────────────────────────────────────────┐
                                 │                TRACE-X FRONTEND                 │
                                 │              React 18 + TypeScript              │
                                 │             (Vite / Tailwind / Nginx)           │
                                 │                                                 │
      ┌──────────────┐           │  • Investigate Canvas (Dagre Flow + Timeline)   │
      │ Cyber Officer│◄─────────►│  • Real-Time Threat Alerts Center               │
      │  / Examiner  │   HTTPS   │  • Bulk Complaint Ingestion Hub                 │
      └──────────────┘           │  • VASP Coordination & Sec 91 Freeze Desk       │
                                 │  • Heuristic Wallet Cluster Explorer            │
                                 │  • Section 65B / 63 BSA Evidence Verifier       │
                                 └────────────────────────┬────────────────────────┘
                                                          │ REST API / JWT
                                                          │ Port 8000
                                 ┌────────────────────────▼────────────────────────┐
                                 │                TRACE-X BACKEND                  │
                                 │               FastAPI (Python 3.11)             │
                                 │                                                 │
                                 │  ┌───────────────────────────────────────────┐  │
                                 │  │   TraceEngine (NetworkX BFS Multi-Hop)    │  │
                                 │  ├───────────────────────────────────────────┤  │
                                 │  │   ClusteringEngine (Co-Spend & Sweeps)    │  │
                                 │  ├───────────────────────────────────────────┤  │
                                 │  │   TypologyClassifier (Pattern Detection)  │  │
                                 │  ├───────────────────────────────────────────┤  │
                                 │  │   MLAnomalyDetector (Velocity Z-Score)    │  │
                                 │  ├───────────────────────────────────────────┤  │
                                 │  │   VASPCoordination (Sec 91 CrPC Summons)  │  │
                                 │  ├───────────────────────────────────────────┤  │
                                 │  │   EvidenceService (SHA-256 / Sec 65B BSA) │  │
                                 │  ├───────────────────────────────────────────┤  │
                                 │  │   BulkIngestion (Batch Queue & Auto-Trace)│  │
                                 │  └─────────────────────┬─────────────────────┘  │
                                 └────────────────────────┼────────────────────────┘
                                                          │ WAL Mode
                                 ┌────────────────────────▼────────────────────────┐
                                 │             PERSISTENT SQLITE STORE             │
                                 │                    tracex.db                    │
                                 │  (cases, investigations, alerts, freezes,       │
                                 │   clusters, indexed_addresses, ingest_batches)  │
                                 └─────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start

### Running with Docker (Recommended)
```bash
docker compose up --build -d
```
- **Frontend Command Center**: `http://localhost:3000`
- **Backend Swagger API**: `http://localhost:8000/api/docs`

### Demo Credentials
- **Username**: `aditya@mitaoe.ac.in`
- **Password**: `tracex@2024`
- *(Backup Login: `admin@tracex.gov.in` / `admin123`)*

---

## 🎯 Stage Demo Walkthrough (10/10 Scorecard)

1. **Login & Dashboard**: Sign in as Insp. Aditya Sharma. Point out the real-time NCRP telemetry and live MHA SAHYOG sync button.
2. **Instant Investigation**: Click preset **"Task Scam (ETH)"** (`0xFraud_Origin_Task_Scam`) $\to$ click **Investigate**.
3. **Graph Traversal & Clustering**: Observe the 12-node interactive Dagre graph. Point to the red **Tornado Cash (OFAC Sanctioned)** node and the purple **Cluster Tag** grouping the mule addresses.
4. **Automated Fraud Typology**: Review right panel: **"Part-Time Task Scam"** detected automatically (96% confidence) with threat actor profile and specific LEA SOP.
5. **Dual Risk & ML Anomaly**: Show the **Court-Defensible Rule Score (80/100 - CRITICAL)** alongside the **AI/ML Anomaly Index (0.88, +24.4σ velocity outlier)**.
6. **VASP Attribution & Freeze Summons**: Click **"Draft Section 91 CrPC Freeze Summons"** $\to$ Review the statutory legal directive with 24-hour compliance deadline to Binance/OKX.
7. **Certified Report Download**: Click **"Generate Certified NCRP Report"** $\to$ open PDF and show the Section 65B / 63 BSA Electronic Evidence Certificate and canonical SHA-256 hash.
8. **Evidence Verifier**: Copy the SHA-256 digest, navigate to **Evidence Verifier**, paste hash $\to$ watch instant judicial validation pass!
9. **Bulk Ingestion Demo**: Go to **Bulk Ingestion** $\to$ click **"Load Sample NCRP Batch"** $\to$ click **"Ingest & Trace Queue"** $\to$ watch all 5 cases auto-traced with risk scores computed in real-time.
10. **Threat Alerts Feed**: Open **Threat Alerts** $\to$ show the real-time incident queue triggered by the traces.
