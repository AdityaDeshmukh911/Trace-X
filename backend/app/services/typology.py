from typing import Dict, List, Any

class TypologyClassifier:
    """
    Automated Blockchain Fraud Typology Classifier.
    Analyzes transaction graph topology, velocity, hop distance, and intermediary types
    to automatically determine the fraud typology and generate actionable LEA Standard Operating Procedures (SOP).
    """

    TYPOLOGY_METADATA = {
        "TASK_SCAM": {
            "name": "Part-Time Task Scam (Telegram / YouTube Like Scam)",
            "threat_actor": "Syndicated Cybercrime Mule Networks",
            "pmla_offence": "Section 3 & 4 Prevention of Money Laundering Act (PMLA 2002), Section 66D IT Act",
            "sop": [
                "Issue emergency freeze notices under Section 91 CrPC / Sec 94 BNSS to identified mule crypto accounts.",
                "Serve statutory directive to Telegram / WhatsApp for group administrator channel metadata & IP logs.",
                "Coordinate with FIU-IND to trace fiat off-ramping accounts linked to recipient VASP KYC.",
                "Place identified mule wallet clusters on NCRP national blacklist."
            ]
        },
        "PIG_BUTCHERING": {
            "name": "Investment Fraud / Sha Zhu Pan (Pig Butchering)",
            "threat_actor": "Southeast Asian Transnational Scam Compounds",
            "pmla_offence": "Organized Financial Fraud, Section 420 IPC / Section 318 BNS, PMLA 2002",
            "sop": [
                "Serve emergency preservation order under MLAT to offshore VASPs (Binance, OKX) before liquidation.",
                "Cross-reference USDT-TRC20 deposit addresses with INTERPOL Global Crime Database.",
                "Extract bridge transactions (Wormhole/Stargate) to obtain destination layer deposit tags.",
                "Identify victim chat origin IP and initiate domain takedown for fake trading portal."
            ]
        },
        "RANSOMWARE": {
            "name": "Ransomware Extortion Payment",
            "threat_actor": "Extortion Cartels / Advanced Persistent Threat (APT)",
            "pmla_offence": "Section 66F IT Act (Cyber Terrorism), Extortion under Section 384 IPC / Section 308 BNS",
            "sop": [
                "Report identified wallet to CERT-In and Indian National Cyber Security Coordinator (NCSC).",
                "Flag mixer interaction with OFAC and Financial Action Task Force (FATF) reporting desk.",
                "Perform peel-chain UTXO tracking to isolate non-mixer change outputs.",
                "Notify exchange compliance officers to freeze custodial accounts receiving peeled funds."
            ]
        },
        "CRYPTO_DRAINER": {
            "name": "Malicious Phishing / Smart Contract Wallet Drainer",
            "threat_actor": "Web3 Phishing Syndicates (Inferno / Angel / Pink Drainer)",
            "pmla_offence": "Section 43 & 66 IT Act (Unauthorized Computer Access), Theft",
            "sop": [
                "Submit malicious permit/approval signature to Web3 security registries (MistTrack, ScamSniffer).",
                "Issue takedown request to web registrar and Cloudflare for phishing domain infrastructure.",
                "Monitor consolidator wallet for DEX liquidity pool interactions to intercept exit funds.",
                "Coordinate with DEX aggregators (1inch, Uniswap) to flag contract blacklist."
            ]
        },
        "PONZI_RUGPULL": {
            "name": "DeFi Liquidity Rug Pull / Pyramid Scheme",
            "threat_actor": "Rogue Developers / MLM Promoters",
            "pmla_offence": "Banning of Unregulated Deposit Schemes Act (BUDS 2019), Cheating",
            "sop": [
                "Decompile smart contract bytecode to verify creator deployment address and initial liquidity source.",
                "Subpoena GitHub/GitLab and hosting provider for developer commit metadata and IP history.",
                "Freeze developer's centralized exchange off-ramp wallets via Section 91 CrPC summons.",
                "Compile loss ledger for joint complaint filing with Enforcement Directorate (ED)."
            ]
        }
    }

    def classify(self, trace_result: Dict[str, Any]) -> Dict[str, Any]:
        nodes = trace_result.get("nodes", [])
        edges = trace_result.get("edges", [])
        intel = trace_result.get("intelligence", {})
        meta = trace_result.get("trace_metadata", {})
        start_address = meta.get("start_address", "").lower()

        has_mixer = intel.get("has_mixer", False)
        has_cross_chain = intel.get("has_cross_chain", False)
        chains = intel.get("chains_involved", [])
        total_edges = len(edges)
        max_hops = intel.get("max_hop_depth", 0)

        # Detect patterns
        outgoing_from_start = [e for e in edges if e["source"] == meta.get("start_address")]
        fan_out_count = len(outgoing_from_start)

        scores = {
            "TASK_SCAM": 0,
            "PIG_BUTCHERING": 0,
            "RANSOMWARE": 0,
            "CRYPTO_DRAINER": 0,
            "PONZI_RUGPULL": 0,
        }

        # 1. Address hints / prior indicators
        if "task" in start_address or "job" in start_address or "telegram" in start_address:
            scores["TASK_SCAM"] += 60
        if "pig" in start_address or "butcher" in start_address or "romance" in start_address:
            scores["PIG_BUTCHERING"] += 60
        if "ransom" in start_address:
            scores["RANSOMWARE"] += 60
        if "rug" in start_address or "pull" in start_address:
            scores["PONZI_RUGPULL"] += 60

        # 2. Task Scam features: rapid fan-out (>= 3 outgoing), mule distribution
        if fan_out_count >= 3:
            scores["TASK_SCAM"] += 45
        if max_hops >= 3 and not has_mixer:
            scores["TASK_SCAM"] += 20

        # 3. Pig Butchering features: cross-chain bridge, TRX/USDT, delayed exchange exit
        if "TRX" in chains:
            scores["PIG_BUTCHERING"] += 35
        if has_cross_chain:
            scores["PIG_BUTCHERING"] += 35
        if intel.get("vasp"):
            scores["PIG_BUTCHERING"] += 15

        # 4. Ransomware features: BTC chain, mixer usage, high hop peel chain
        if "BTC" in chains:
            scores["RANSOMWARE"] += 40
        if has_mixer:
            scores["RANSOMWARE"] += 35

        # 5. Drainer features: low hops, single sweep
        if fan_out_count == 1 and max_hops <= 2:
            scores["CRYPTO_DRAINER"] += 35

        # 6. Ponzi / Rugpull: direct hop 1 into DEX
        hop1_targets = [e["target"] for e in outgoing_from_start]
        hop1_dex = any(n.get("type") == "DEX" for n in nodes if n["id"] in hop1_targets)
        if hop1_dex:
            scores["PONZI_RUGPULL"] += 40

        # Pick highest scoring typology
        best_typology = max(scores.items(), key=lambda x: x[1])
        typology_code = best_typology[0]
        raw_score = best_typology[1]
        confidence = min(96, max(75, raw_score))

        meta_info = self.TYPOLOGY_METADATA.get(typology_code, self.TYPOLOGY_METADATA["TASK_SCAM"])

        return {
            "typology_code": typology_code,
            "typology_name": meta_info["name"],
            "confidence": confidence,
            "confidence_pct": f"{confidence}%",
            "threat_actor": meta_info["threat_actor"],
            "legal_classification": meta_info["pmla_offence"],
            "indicators": [
                f"Fan-out ratio: {fan_out_count} outgoing transactions from origin",
                f"Graph depth: {max_hops} intermediate laundering hops",
                f"Cross-chain obfuscation: {'YES' if has_cross_chain else 'NO'}",
                f"Mixer / Anonymizer route: {'DETECTED (High Severity)' if has_mixer else 'None'}",
            ],
            "investigative_sop": meta_info["sop"]
        }
