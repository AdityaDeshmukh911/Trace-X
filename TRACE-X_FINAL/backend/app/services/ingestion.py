import csv
import io
import json
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Tuple, Optional

from app.db.database import get_connection

class BulkIngestionService:
    """
    Handles Bulk Complaint Ingestion from NCRP, State Cyber Cells, and Bank Fraud Portals.
    Supports CSV and JSON formats, auto-executes blockchain trace queue, and generates instant risk metrics.
    """

    SAMPLE_CSV = """complaint_id,wallet_address,chain,category,victim_loss_inr,victim_name,investigator
NCRP/2024/MH/00911,0xFraud_Origin_Task_Scam,ETH,Task Scam - Crypto,1250000,Rajesh Kumar,Insp. Aditya Prashant Deshmukh
NCRP/2024/KA/00742,0xPigButcher_Main,TRX,Investment Fraud - Pig Butchering,4500000,Anita Desai,Insp. Aditya Prashant Deshmukh
NCRP/2024/DL/00431,0xRugPull_Dev,ETH,Exchange Hack - Rug Pull,12000000,Virendra Sachdeva,SP Priya Nair
NCRP/2024/GJ/00519,0xTelegram_Job_Scam_Origin,ETH,Telegram Task Fraud,1850000,Sunil Mehta,SI Rohit Verma
NCRP/2024/TN/00688,0xFedEx_Impersonation_TRX,TRX,Digital Arrest Police Extortion,3200000,Dr. S. Venkat,Insp. K. Raman
"""

    @classmethod
    def get_sample_csv(cls) -> str:
        return cls.SAMPLE_CSV

    @classmethod
    def parse_and_queue(cls, file_content: str, is_csv: bool = True, batch_name: Optional[str] = None) -> Tuple[str, List[Dict[str, Any]]]:
        records = []
        if is_csv:
            reader = csv.DictReader(io.StringIO(file_content.strip()))
            for row in reader:
                records.append({
                    "complaint_id": row.get("complaint_id", f"NCRP/AUTO/{uuid.uuid4().hex[:6].upper()}"),
                    "wallet_address": row.get("wallet_address") or row.get("suspect_wallet", ""),
                    "chain": (row.get("chain") or "ETH").upper(),
                    "category": row.get("category", "Cyber Financial Fraud"),
                    "victim_loss_inr": int(float(row.get("victim_loss_inr", 0) or row.get("amount_inr", 0))),
                    "victim_name": row.get("victim_name", "Anonymous Complainant"),
                    "investigator": row.get("investigator", "Cyber Cell Officer")
                })
        else:
            data = json.loads(file_content)
            if isinstance(data, list):
                records = data
            elif isinstance(data, dict) and "records" in data:
                records = data["records"]

        batch_id = f"BATCH-{uuid.uuid4().hex[:8].upper()}"
        name = batch_name or f"NCRP Bulk Ingest {datetime.now(timezone.utc).strftime('%d %b %H:%M')}"

        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO ingest_batches 
            (id, batch_name, total_records, processed_records, high_risk_count, status, created_at, records_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            batch_id, name, len(records), 0, 0, "QUEUED", datetime.now(timezone.utc).isoformat(), json.dumps(records)
        ))
        conn.commit()
        conn.close()

        return batch_id, records

    @classmethod
    def process_batch(cls, batch_id: str, records: List[Dict[str, Any]]) -> Dict[str, Any]:
        from app.services.graph_engine import TraceEngine
        from app.services.intelligence import IntelligenceService
        from app.services.alerts import AlertService
        from app.services.evidence import EvidenceService

        engine = TraceEngine()
        intel_svc = IntelligenceService()

        processed_count = 0
        high_risk_count = 0
        results = []

        for item in records:
            wallet = item.get("wallet_address", "").strip()
            chain = item.get("chain", "ETH").strip()
            complaint_id = item.get("complaint_id", "")
            category = item.get("category", "Cyber Fraud")
            investigator = item.get("investigator", "Cyber Cell Officer")
            loss_inr = item.get("victim_loss_inr", 500000)
            victim = item.get("victim_name", "Complainant")

            if not wallet:
                continue

            # Run full trace
            trace_result = engine.build_trace(wallet, chain, max_hops=4)
            trace_result = intel_svc.enrich(trace_result)

            inv_id = str(uuid.uuid4())[:8].upper()
            trace_result["investigation_id"] = inv_id
            trace_result["complaint_id"] = complaint_id

            risk_score = trace_result["intelligence"]["risk_score"]
            risk_level = trace_result["intelligence"]["risk_level"]
            typology = trace_result.get("typology", {}).get("typology_name", category)
            typology_conf = trace_result.get("typology", {}).get("confidence", 85)
            anomaly_score = trace_result.get("ml_anomaly", {}).get("ml_anomaly_index", 0.75)
            sha256_digest = EvidenceService.compute_canonical_hash(trace_result)

            # Persist investigation and case in immediate transaction
            conn = get_connection()
            cur = conn.cursor()
            now_iso = datetime.now(timezone.utc).isoformat()
            cur.execute("""
                INSERT OR REPLACE INTO investigations
                (id, start_address, chain, risk_score, risk_level, typology, typology_confidence, ml_anomaly_score, hash_sha256, data_json, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                inv_id, wallet, chain, risk_score, risk_level, typology, typology_conf, anomaly_score, sha256_digest, json.dumps(trace_result), now_iso
            ))

            case_id = f"CASE-{datetime.now(timezone.utc).year}-{uuid.uuid4().hex[:4].upper()}"
            cur.execute("""
                INSERT OR REPLACE INTO cases
                (id, complaint_id, category, status, suspect_wallet, chain, risk_score, investigator, victim_loss_inr, victim_name, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                case_id, complaint_id, category, "ACTIVE", wallet, chain, risk_score, investigator, loss_inr, victim, now_iso
            ))
            conn.commit()
            conn.close()

            # Trigger alert if high risk
            if risk_score >= 75:
                high_risk_count += 1
                AlertService.evaluate_and_generate(trace_result, inv_id)

            processed_count += 1
            results.append({
                "complaint_id": complaint_id,
                "wallet_address": wallet,
                "chain": chain,
                "risk_score": risk_score,
                "risk_level": risk_level,
                "typology": typology,
                "investigation_id": inv_id,
                "vasp_match": (trace_result["intelligence"].get("vasp") or {}).get("name", "Unknown VASP")
            })

        # Update batch status
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            UPDATE ingest_batches
            SET processed_records = ?, high_risk_count = ?, status = 'COMPLETED'
            WHERE id = ?;
        """, (processed_count, high_risk_count, batch_id))
        conn.commit()
        conn.close()

        return {
            "batch_id": batch_id,
            "status": "COMPLETED",
            "total_records": len(records),
            "processed_records": processed_count,
            "high_risk_count": high_risk_count,
            "results": results
        }

    @classmethod
    def list_batches(cls) -> List[Dict[str, Any]]:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM ingest_batches ORDER BY created_at DESC")
        rows = cur.fetchall()
        conn.close()

        batches = []
        for r in rows:
            batches.append({
                "id": r["id"],
                "batch_name": r["batch_name"],
                "total_records": r["total_records"],
                "processed_records": r["processed_records"],
                "high_risk_count": r["high_risk_count"],
                "status": r["status"],
                "created_at": r["created_at"]
            })
        return batches

