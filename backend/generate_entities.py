import json
import os
import sqlite3
from datetime import datetime, timezone

data_path = os.path.join(os.path.dirname(__file__), "app", "data", "entity_directory.json")
db_path = os.path.join(os.path.dirname(__file__), "app", "db", "tracex.db")

ENTITIES = {
    # ── Indian Exchanges (FIU-IND Registered) ──
    "0xd793281182a0e3e174e9eBDa0Fc9F038cB455d5": {
        "type": "EXCHANGE", "label": "WazirX: Hot Wallet 1", "chain": "ETH", "confidence": 0.96,
        "vasp_name": "WazirX (Zanmai Labs)", "vasp_jurisdiction": "India (FIU-IND: RE-0019)",
        "sanction_status": None, "first_seen": "2019-03-11", "tx_count": 482100,
        "risk_flags": ["FIU_REGISTERED", "INDIAN_VASP_PRIORITY_FREEZE"]
    },
    "0xBfc38Ca966373e28ECd42F6CE9fD9c8BF83CeA4": {
        "type": "EXCHANGE", "label": "CoinDCX: Main Custody Wallet", "chain": "ETH", "confidence": 0.95,
        "vasp_name": "CoinDCX (Neblio Technologies)", "vasp_jurisdiction": "India (FIU-IND: RE-0024)",
        "sanction_status": None, "first_seen": "2018-08-19", "tx_count": 312000,
        "risk_flags": ["FIU_REGISTERED", "INDIAN_VASP_PRIORITY_FREEZE"]
    },
    "0x7890cDcBa940A9dF1aD4C066ef6A34032d88190B": {
        "type": "EXCHANGE", "label": "Bitbns: Deposit Pool", "chain": "ETH", "confidence": 0.91,
        "vasp_name": "Bitbns", "vasp_jurisdiction": "India (FIU-IND: RE-0038)",
        "sanction_status": None, "first_seen": "2018-05-12", "tx_count": 89400,
        "risk_flags": ["FIU_REGISTERED"]
    },
    "0x9A492652a265691F5685B24a9A9A4A1188dEc080": {
        "type": "EXCHANGE", "label": "ZebPay: Hot Storage", "chain": "ETH", "confidence": 0.93,
        "vasp_name": "ZebPay (Awlencan)", "vasp_jurisdiction": "India (FIU-IND: RE-0012)",
        "sanction_status": None, "first_seen": "2017-10-04", "tx_count": 142000,
        "risk_flags": ["FIU_REGISTERED"]
    },

    # ── Global Top VASPs ──
    "0x28C6c06298d514Db089934071355E5743bf21d60": {
        "type": "EXCHANGE", "label": "Binance: Hot Wallet 14", "chain": "ETH", "confidence": 0.98,
        "vasp_name": "Binance", "vasp_jurisdiction": "Cayman Islands / Global",
        "sanction_status": None, "first_seen": "2020-04-12", "tx_count": 14920000,
        "risk_flags": ["HIGH_LIQUIDITY_HUB"]
    },
    "0x21a31Ee1afC51d94C2eFCaa13a065722bda7D0C": {
        "type": "EXCHANGE", "label": "Binance: Hot Wallet 20", "chain": "ETH", "confidence": 0.97,
        "vasp_name": "Binance", "vasp_jurisdiction": "Cayman Islands / Global",
        "sanction_status": None, "first_seen": "2021-08-01", "tx_count": 8920000,
        "risk_flags": ["HIGH_LIQUIDITY_HUB"]
    },
    "TRXBinanceHot_Wallet": {
        "type": "EXCHANGE", "label": "Binance TRON Hot Wallet", "chain": "TRX", "confidence": 0.95,
        "vasp_name": "Binance TRON", "vasp_jurisdiction": "Cayman Islands",
        "sanction_status": None, "first_seen": "2019-11-20", "tx_count": 25000000,
        "risk_flags": ["USDT_TRC20_PRIMARY_DESTINATION"]
    },
    "0x503828976D22510aad0201ac7EC88293211D23Da": {
        "type": "EXCHANGE", "label": "Coinbase: Prime Custody", "chain": "ETH", "confidence": 0.97,
        "vasp_name": "Coinbase Inc.", "vasp_jurisdiction": "United States (FinCEN)",
        "sanction_status": None, "first_seen": "2019-01-15", "tx_count": 18200000,
        "risk_flags": ["FINCEN_REGULATED"]
    },
    "0xA090e606E30bD747d4E6245a1517EbE430F0057e": {
        "type": "EXCHANGE", "label": "Coinbase: Hot Wallet 2", "chain": "ETH", "confidence": 0.96,
        "vasp_name": "Coinbase", "vasp_jurisdiction": "United States",
        "sanction_status": None, "first_seen": "2018-09-10", "tx_count": 9200000,
        "risk_flags": []
    },
    "0xOKX_Deposit_ETH": {
        "type": "EXCHANGE", "label": "OKX Deposit Gateway", "chain": "ETH", "confidence": 0.92,
        "vasp_name": "OKX", "vasp_jurisdiction": "Seychelles",
        "sanction_status": None, "first_seen": "2020-06-18", "tx_count": 6400000,
        "risk_flags": ["OFFSHORE_VASP"]
    },
    "0x6cC5F688a30d3766E9904b26e89FB0b233047b93": {
        "type": "EXCHANGE", "label": "OKX: Hot Wallet 1", "chain": "ETH", "confidence": 0.95,
        "vasp_name": "OKX", "vasp_jurisdiction": "Seychelles",
        "sanction_status": None, "first_seen": "2020-02-14", "tx_count": 7100000,
        "risk_flags": []
    },
    "0x2B5634C42055806a59e9107ED44D43c426E58258": {
        "type": "EXCHANGE", "label": "KuCoin: Hot Wallet 6", "chain": "ETH", "confidence": 0.93,
        "vasp_name": "KuCoin", "vasp_jurisdiction": "Seychelles",
        "sanction_status": None, "first_seen": "2019-12-05", "tx_count": 4120000,
        "risk_flags": ["DOJ_INDICTED_2024"]
    },
    "0x1111111254fb6c44bac0bed2854e76f90643097d": {
        "type": "DEX", "label": "1inch: Aggregator v5", "chain": "ETH", "confidence": 0.99,
        "vasp_name": "1inch Network", "vasp_jurisdiction": "Decentralized",
        "sanction_status": None, "first_seen": "2022-11-10", "tx_count": 5200000,
        "risk_flags": ["DEX_SWAP_ROUTER"]
    },
    "0xf89d7b9c372f2561083e7436b7381ff9bcff1663": {
        "type": "EXCHANGE", "label": "Bybit: Hot Wallet 3", "chain": "ETH", "confidence": 0.94,
        "vasp_name": "Bybit", "vasp_jurisdiction": "United Arab Emirates",
        "sanction_status": None, "first_seen": "2021-03-22", "tx_count": 5890000,
        "risk_flags": ["MIDDLE_EAST_HUB"]
    },
    "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640": {
        "type": "DEX", "label": "Uniswap v3: USDC/ETH 0.05%", "chain": "ETH", "confidence": 0.99,
        "vasp_name": "Uniswap Labs", "vasp_jurisdiction": "Decentralized",
        "sanction_status": None, "first_seen": "2021-05-04", "tx_count": 12800000,
        "risk_flags": ["LIQUIDITY_POOL"]
    },
    "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45": {
        "type": "DEX", "label": "Uniswap: SwapRouter02", "chain": "ETH", "confidence": 0.99,
        "vasp_name": "Uniswap", "vasp_jurisdiction": "Decentralized",
        "sanction_status": None, "first_seen": "2021-12-01", "tx_count": 31000000,
        "risk_flags": ["DEX_ROUTER"]
    },

    # ── Mixers & Privacy Services ──
    "0xMixer_TornadoCash": {
        "type": "MIXER", "label": "Tornado Cash (OFAC Sanctioned)", "chain": "ETH",
        "confidence": 0.99, "vasp_name": "Tornado Cash", "vasp_jurisdiction": "Decentralized / Non-compliant",
        "sanction_status": "OFAC_SDN", "first_seen": "2019-12-16", "tx_count": 182000,
        "risk_flags": ["OFAC_SANCTIONED_SDN", "PMLA_SCHEDULED_OFFENCE", "RED_NOTICE"]
    },
    "0xD4B88Df4D29F5CedD6857912842cff3b20C8Cfa": {
        "type": "MIXER", "label": "Tornado Cash: 100 ETH Pool", "chain": "ETH",
        "confidence": 0.99, "vasp_name": "Tornado Cash", "vasp_jurisdiction": "Decentralized",
        "sanction_status": "OFAC_SDN", "first_seen": "2020-01-09", "tx_count": 48200,
        "risk_flags": ["OFAC_SANCTIONED_SDN", "ANONYMOUS_POOL"]
    },
    "0xDD4c48C0B24039969fC16D1cdF626eaB821d3384": {
        "type": "MIXER", "label": "Tornado Cash: 10 ETH Pool", "chain": "ETH",
        "confidence": 0.99, "vasp_name": "Tornado Cash", "vasp_jurisdiction": "Decentralized",
        "sanction_status": "OFAC_SDN", "first_seen": "2020-01-09", "tx_count": 92100,
        "risk_flags": ["OFAC_SANCTIONED_SDN", "ANONYMOUS_POOL"]
    },
    "0x8589427373D6D84E98730D7795D8f6f8731FDA16": {
        "type": "MIXER", "label": "Tornado Cash: 0.1 ETH Pool", "chain": "ETH",
        "confidence": 0.99, "vasp_name": "Tornado Cash", "vasp_jurisdiction": "Decentralized",
        "sanction_status": "OFAC_SDN", "first_seen": "2020-01-09", "tx_count": 114000,
        "risk_flags": ["OFAC_SANCTIONED_SDN"]
    },
    "0xfa750438cf15d2a9332219760773d328329b3922": {
        "type": "MIXER", "label": "Sinbad Mixer Relayer (OFAC)", "chain": "BTC",
        "confidence": 0.98, "vasp_name": "Sinbad.io", "vasp_jurisdiction": "OFAC Designated",
        "sanction_status": "OFAC_SDN", "first_seen": "2022-10-01", "tx_count": 21000,
        "risk_flags": ["OFAC_SDN", "LAZARUS_SUCCESSOR_MIXER"]
    },
    "0x57b9f564177c9fa6a8d6f51be0e657d17469a473": {
        "type": "MIXER", "label": "Railgun: Privacy Relayer", "chain": "ETH",
        "confidence": 0.92, "vasp_name": "Railgun Project", "vasp_jurisdiction": "Decentralized ZK-SNARKs",
        "sanction_status": "HIGH_RISK_PRIVACY", "first_seen": "2021-07-15", "tx_count": 84000,
        "risk_flags": ["ZK_PRIVACY_POOL", "HIGH_RISK_ANONYMIZATION"]
    },

    # ── Bridges ──
    "0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B": {
        "type": "BRIDGE", "label": "Wormhole: Portal Token Bridge", "chain": "ETH",
        "confidence": 0.98, "vasp_name": "Wormhole Portal", "vasp_jurisdiction": "Cross-chain protocol",
        "sanction_status": None, "first_seen": "2021-09-14", "tx_count": 4200000,
        "risk_flags": ["CROSS_CHAIN_ROUTER"]
    },
    "0x8731d54E9D02c246767d7ced08d8e578fa6abA86": {
        "type": "BRIDGE", "label": "Stargate Finance: Router ETH", "chain": "ETH",
        "confidence": 0.97, "vasp_name": "Stargate / LayerZero", "vasp_jurisdiction": "Cross-chain protocol",
        "sanction_status": None, "first_seen": "2022-03-17", "tx_count": 3100000,
        "risk_flags": ["CROSS_CHAIN_ROUTER"]
    },
    "0x4D9079Bb4165aeb4084c526a32695dCfd2F77381": {
        "type": "BRIDGE", "label": "Across Protocol: SpokePool", "chain": "ETH",
        "confidence": 0.96, "vasp_name": "Across Bridge", "vasp_jurisdiction": "Cross-chain protocol",
        "sanction_status": None, "first_seen": "2022-05-10", "tx_count": 1890000,
        "risk_flags": ["CROSS_CHAIN_ROUTER"]
    },

    # ── High Profile Cyber Fraud / Extortion Wallets (OFAC / Benchmark) ──
    "0x098B716B8Aaf21512996dC57EB0615e2383E2f96": {
        "type": "SUSPECT", "label": "Ronin Bridge Hacker (Lazarus)", "chain": "ETH",
        "confidence": 1.00, "vasp_name": "Lazarus Group (DPRK)", "vasp_jurisdiction": "North Korea / Sanctioned",
        "sanction_status": "OFAC_SDN", "first_seen": "2022-03-23", "tx_count": 3410,
        "risk_flags": ["NATION_STATE_ACTOR", "OFAC_SDN", "HEIST_PROCEEDS"]
    },
    "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa": {
        "type": "UNKNOWN", "label": "Genesis Block (Historical)", "chain": "BTC",
        "confidence": 1.00, "vasp_name": "Satoshi Nakamoto", "vasp_jurisdiction": "None",
        "sanction_status": None, "first_seen": "2009-01-03", "tx_count": 4500,
        "risk_flags": []
    },
    "1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF": {
        "type": "SUSPECT", "label": "Mt. Gox Hack Custody", "chain": "BTC",
        "confidence": 0.99, "vasp_name": "Mt. Gox Attacker", "vasp_jurisdiction": "Unknown",
        "sanction_status": "ILLICIT_HEIST", "first_seen": "2011-03-01", "tx_count": 390,
        "risk_flags": ["MAJOR_THEFT_RECORD"]
    },

    # ── Demo Wallets (Integrated Seamlessly) ──
    "0xFraud_Origin_Task_Scam": {
        "type": "SUSPECT", "label": "Task Scam Syndicate Primary Wallet", "chain": "ETH",
        "confidence": 0.95, "vasp_name": None, "vasp_jurisdiction": None,
        "sanction_status": None, "first_seen": "2024-01-10", "tx_count": 14,
        "risk_flags": ["HIGH_VELOCITY_DISBURSEMENT", "MULE_LAYERED"]
    },
    "0xPigButcher_Main": {
        "type": "SUSPECT", "label": "Pig Butchering Syndicate Main Deposit", "chain": "TRX",
        "confidence": 0.94, "vasp_name": None, "vasp_jurisdiction": None,
        "sanction_status": None, "first_seen": "2024-01-05", "tx_count": 28,
        "risk_flags": ["USDT_TRC20_ROMANCE_SCAM", "LAYERED_EXTRACTION"]
    },
    "0xRugPull_Dev": {
        "type": "SUSPECT", "label": "Rug Pull Developer Liquidator", "chain": "ETH",
        "confidence": 0.97, "vasp_name": None, "vasp_jurisdiction": None,
        "sanction_status": None, "first_seen": "2024-01-02", "tx_count": 8,
        "risk_flags": ["LIQUIDITY_REMOVAL", "DEX_DUMP"]
    },
    "0xRansomWallet_BTC": {
        "type": "SUSPECT", "label": "Ransomware Extortion Address", "chain": "BTC",
        "confidence": 0.96, "vasp_name": None, "vasp_jurisdiction": None,
        "sanction_status": "CYBER_EXTORTION", "first_seen": "2024-01-14", "tx_count": 12,
        "risk_flags": ["PEEL_CHAIN_EXTRACTION", "RANSOMWARE_PAYMENT"]
    },
    "0xTelegram_Job_Scam_Origin": {
        "type": "SUSPECT", "label": "Telegram Job Fraud Origin", "chain": "ETH",
        "confidence": 0.92, "vasp_name": None, "vasp_jurisdiction": None,
        "sanction_status": None, "first_seen": "2024-01-28", "tx_count": 19,
        "risk_flags": ["WORK_FROM_HOME_SCAM", "RAPID_MULE_DISTRIBUTION"]
    },
    "0xFedEx_Impersonation_TRX": {
        "type": "SUSPECT", "label": "FedEx Police Impersonation Wallet", "chain": "TRX",
        "confidence": 0.93, "vasp_name": None, "vasp_jurisdiction": None,
        "sanction_status": None, "first_seen": "2024-02-01", "tx_count": 16,
        "risk_flags": ["COURIER_EXTORTION", "DIGITAL_ARREST_SCAM"]
    }
}

# Write to JSON directory file
os.makedirs(os.path.dirname(data_path), exist_ok=True)
with open(data_path, "w", encoding="utf-8") as f:
    json.dump(ENTITIES, f, indent=2)

print(f"Saved {len(ENTITIES)} curated entity labels to {data_path}")

# Index into database
conn = sqlite3.connect(db_path)
cur = conn.cursor()
for addr, meta in ENTITIES.items():
    cur.execute("""
        INSERT OR REPLACE INTO indexed_addresses 
        (address, chain, entity_type, label, confidence, vasp_name, vasp_jurisdiction, sanction_status, risk_flags_json, first_seen, last_seen)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        addr,
        meta.get("chain", "ETH"),
        meta.get("type", "UNKNOWN"),
        meta.get("label", "Untagged Wallet"),
        meta.get("confidence", 0.5),
        meta.get("vasp_name"),
        meta.get("vasp_jurisdiction"),
        meta.get("sanction_status"),
        json.dumps(meta.get("risk_flags", [])),
        meta.get("first_seen"),
        datetime.now(timezone.utc).isoformat()
    ))
conn.commit()
conn.close()
print("Indexed entities into SQLite database successfully.")
