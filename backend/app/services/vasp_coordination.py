import json
import uuid
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional

VASP_LEGAL_DIRECTORY = {
    "Binance": {
        "legal_name": "Binance Holdings Ltd. / Binance Legal Support",
        "email": "compliance@binance.com",
        "portal": "https://www.binance.com/en/legal/law-enforcement",
        "jurisdiction": "Cayman Islands",
        "sla_hours": 24,
    },
    "WazirX": {
        "legal_name": "Zanmai Labs Pvt. Ltd. (WazirX India)",
        "email": "legal@wazirx.com",
        "portal": "https://wazirx.com/law-enforcement",
        "jurisdiction": "India (FIU-IND Registered: RE-0019)",
        "sla_hours": 6,
    },
    "CoinDCX": {
        "legal_name": "Neblio Technologies Pvt. Ltd. (CoinDCX)",
        "email": "compliance@coindcx.com",
        "portal": "https://coindcx.com/compliance",
        "jurisdiction": "India (FIU-IND Registered: RE-0024)",
        "sla_hours": 6,
    },
    "OKX": {
        "legal_name": "OKX Compliance & Financial Crimes Division",
        "email": "compliance@okx.com",
        "portal": "https://www.okx.com/law-enforcement",
        "jurisdiction": "Seychelles",
        "sla_hours": 24,
    },
    "Coinbase": {
        "legal_name": "Coinbase Inc. Global Law Enforcement Ops",
        "email": "lawenforcement@coinbase.com",
        "portal": "https://coinbase.com/law-enforcement",
        "jurisdiction": "United States (FinCEN)",
        "sla_hours": 12,
    },
    "KuCoin": {
        "legal_name": "KuCoin Legal & Compliance Unit",
        "email": "compliance@kucoin.com",
        "portal": "https://kucoin.com/legal-inquiries",
        "jurisdiction": "Seychelles",
        "sla_hours": 48,
    }
}

VALID_STATES = [
    "DRAFT",
    "SUBPOENA_GENERATED",
    "FREEZE_REQUESTED",
    "VASP_ACKNOWLEDGED",
    "ASSETS_FROZEN",
    "REJECTED"
]

class VASPCoordinationService:
    """
    Manages the LEA-to-VASP Asset Freezing and Subpoena Coordination Lifecycle.
    Implements legal summons generation under Section 91 CrPC and Section 94 BNSS (2023).
    """

    @classmethod
    def get_vasp_contact(cls, vasp_name: str) -> Dict[str, Any]:
        for k, v in VASP_LEGAL_DIRECTORY.items():
            if k.lower() in vasp_name.lower():
                return v
        return {
            "legal_name": f"{vasp_name} Custody / Compliance Desk",
            "email": f"compliance@{vasp_name.lower().replace(' ', '')}.com",
            "portal": "https://interpol.int/crpc-desk",
            "jurisdiction": "International VASP",
            "sla_hours": 24,
        }

    @classmethod
    def generate_notice_text(
        cls,
        notice_num: str,
        case_id: str,
        vasp_name: str,
        target_wallet: str,
        chain: str,
        amount: float,
        currency: str,
        investigator: str,
        badge: str,
        station: str
    ) -> str:
        vasp_info = cls.get_vasp_contact(vasp_name)
        now_str = datetime.now(timezone.utc).strftime("%d %B %Y %H:%M UTC")

        return f"""================================================================================
STATUTORY ORDER & FREEZE DIRECTIVE UNDER SECTION 91 CrPC / SEC 94 BNSS
================================================================================
NOTICE REFERENCE NO: {notice_num}
CASE REGISTRATION  : {case_id}
ISSUANCE DATE      : {now_str}
AUTHORITY          : Cyber Crime Investigation Department, {station}

TO:
The Designated Nodal / Compliance Officer,
{vasp_info['legal_name']}
Designated Contact : {vasp_info['email']}
Jurisdiction       : {vasp_info['jurisdiction']}

WHEREAS an ongoing criminal investigation is being conducted into cyber financial 
fraud and siphoning of proceeds of crime under Sections 66C/66D IT Act 2000, 
PMLA 2002, and Section 420 IPC / Section 318 BNS (2023);

AND WHEREAS forensic blockchain graph traversal by TRACE-X intelligence platform has 
substantiated that criminal proceeds originating from victim accounts have been routed 
and deposited into your custodial exchange infrastructure:

IDENTIFIED TARGET REPOSITORIES:
- Custodial Deposit Wallet : {target_wallet}
- Blockchain Network       : {chain}
- Subject Seizure Amount   : {amount:,.2f} {currency}
- Evidentiary Chain Status : Confirmed Terminal Destination / Laundering Hop

NOW THEREFORE, IN EXERCISE OF THE POWERS CONFERRED UNDER SECTION 91 OF THE CODE OF 
CRIMINAL PROCEDURE, 1973 (CrPC) AND SECTION 94 OF THE BHARATIYA NAGARIK SURAKSHA 
SANHITA, 2023 (BNSS), YOU ARE HEREBY COMMANDED TO:

1. IMMEDIATELY FREEZE AND DEBIT-FREEZE all accounts, sub-accounts, user profiles, and 
   custodial balances linked to the aforesaid wallet address.
2. PRESERVE AND SUBMIT complete KYC dossiers, registered email IDs, mobile numbers, IP 
   connection logs, and linked fiat bank withdrawal details.
3. PROVIDE written confirmation of compliance within {vasp_info['sla_hours']} HOURS to the undersigned officer.

TAKE NOTICE that failure to comply with this lawful directive shall render the concerned 
entities and nodal officers liable for penal prosecution under Section 175 IPC / Section 210 BNS 
for intentional omission to produce document or asset to public servant.

ISSUING AUTHORITY:
Name  : {investigator}
Rank  : Senior Investigating Officer
Badge : {badge}
Office: {station}
================================================================================"""

    @classmethod
    def create_freeze_request(
        cls,
        investigation_id: str,
        case_id: str,
        vasp_name: str,
        wallet_address: str,
        chain: str,
        target_amount: float,
        currency: str = "USDT",
        officer_name: str = "Insp. Aditya Prashant Deshmukh",
        officer_badge: str = "CY-MH-4019",
        station: str = "Cyber Cell MIT AOE Pune",
        officer_notes: str = ""
    ) -> Dict[str, Any]:
        freeze_id = f"FRZ-{uuid.uuid4().hex[:8].upper()}"
        notice_num = f"TRACEX/SEC91/{datetime.now(timezone.utc).year}/{uuid.uuid4().hex[:6].upper()}"

        notice_body = cls.generate_notice_text(
            notice_num=notice_num,
            case_id=case_id,
            vasp_name=vasp_name,
            target_wallet=wallet_address,
            chain=chain,
            amount=target_amount,
            currency=currency,
            investigator=officer_name,
            badge=officer_badge,
            station=station
        )

        now_iso = datetime.now(timezone.utc).isoformat()
        initial_audit = [
            {
                "timestamp": now_iso,
                "action": "DRAFT_INITIATED",
                "officer": officer_name,
                "notes": officer_notes or "Freeze notice drafted upon trace attribution confirmation."
            }
        ]

        from app.db.database import get_connection
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO freeze_requests
            (id, investigation_id, case_id, vasp_name, wallet_address, chain, target_amount, currency, status, notice_number, crpc_section, investigator_name, investigator_badge, police_station, created_at, updated_at, officer_notes, notice_body, audit_trail_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            freeze_id, investigation_id, case_id, vasp_name, wallet_address, chain, target_amount, currency,
            "SUBPOENA_GENERATED", notice_num, "Section 91 CrPC / Section 94 BNSS", officer_name, officer_badge,
            station, now_iso, now_iso, officer_notes, notice_body, json.dumps(initial_audit)
        ))
        conn.commit()
        conn.close()

        return {
            "freeze_id": freeze_id,
            "notice_number": notice_num,
            "status": "SUBPOENA_GENERATED",
            "vasp_name": vasp_name,
            "wallet_address": wallet_address,
            "target_amount": f"{target_amount:,.2f} {currency}",
            "notice_body": notice_body,
            "audit_trail": initial_audit
        }

    @classmethod
    def update_status(cls, freeze_id: str, new_status: str, officer_notes: str, officer_name: str = "Insp. Aditya Prashant Deshmukh") -> Dict[str, Any]:
        if new_status not in VALID_STATES:
            raise ValueError(f"Invalid state '{new_status}'. Allowed: {VALID_STATES}")

        from app.db.database import get_connection
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM freeze_requests WHERE id = ?", (freeze_id,))
        row = cur.fetchone()
        if not row:
            conn.close()
            raise ValueError("Freeze request not found")

        audit = json.loads(row["audit_trail_json"])
        now_iso = datetime.now(timezone.utc).isoformat()
        audit.append({
            "timestamp": now_iso,
            "action": f"STATUS_CHANGED_TO_{new_status}",
            "officer": officer_name,
            "notes": officer_notes
        })

        cur.execute("""
            UPDATE freeze_requests
            SET status = ?, updated_at = ?, officer_notes = ?, audit_trail_json = ?
            WHERE id = ?;
        """, (new_status, now_iso, officer_notes, json.dumps(audit), freeze_id))
        conn.commit()
        conn.close()

        return {
            "freeze_id": freeze_id,
            "status": new_status,
            "updated_at": now_iso,
            "audit_trail": audit
        }

    @classmethod
    def list_requests(cls) -> List[Dict[str, Any]]:
        from app.db.database import get_connection
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM freeze_requests ORDER BY created_at DESC")
        rows = cur.fetchall()
        conn.close()

        result = []
        for r in rows:
            result.append({
                "id": r["id"],
                "investigation_id": r["investigation_id"],
                "case_id": r["case_id"],
                "vasp_name": r["vasp_name"],
                "wallet_address": r["wallet_address"],
                "chain": r["chain"],
                "target_amount": r["target_amount"],
                "currency": r["currency"],
                "status": r["status"],
                "notice_number": r["notice_number"],
                "crpc_section": r["crpc_section"],
                "investigator_name": r["investigator_name"],
                "created_at": r["created_at"],
                "updated_at": r["updated_at"],
                "officer_notes": r["officer_notes"],
                "notice_body": r["notice_body"],
                "audit_trail": json.loads(r["audit_trail_json"]) if r["audit_trail_json"] else []
            })
        return result
