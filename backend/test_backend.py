import sys
import os
import json

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.db.database import init_db, get_connection
from app.services.graph_engine import TraceEngine
from app.services.intelligence import IntelligenceService
from app.services.report_generator import generate_pdf
from app.services.evidence import EvidenceService
from app.services.vasp_coordination import VASPCoordinationService
from app.services.alerts import AlertService
from app.services.ingestion import BulkIngestionService
from app.services.clustering import ClusteringEngine

print("── 1. Testing Database Initialization ──")
init_db()
conn = get_connection()
cur = conn.cursor()
cur.execute("SELECT COUNT(*) FROM cases;")
cases_count = cur.fetchone()[0]
cur.execute("SELECT COUNT(*) FROM indexed_addresses;")
indexed_count = cur.fetchone()[0]
conn.close()
print(f"Cases in DB: {cases_count}, Indexed Entities in DB: {indexed_count}")
assert cases_count > 0, "Cases should not be empty"
assert indexed_count > 0, "Indexed entities should not be empty"

print("\n── 2. Testing TraceEngine with ETH Task Scam ──")
engine = TraceEngine()
intel_svc = IntelligenceService()
trace = engine.build_trace("0xFraud_Origin_Task_Scam", "ETH", max_hops=4)
trace = intel_svc.enrich(trace)

print(f"Traced nodes: {len(trace['nodes'])}, Edges: {len(trace['edges'])}")
print(f"Risk Score: {trace['intelligence']['risk_score']} ({trace['intelligence']['risk_level']})")
print(f"VASP Match: {trace['intelligence']['vasp']['name']} ({trace['intelligence']['vasp']['confidence_pct']})")
print(f"Typology: {trace['typology']['typology_name']} ({trace['typology']['confidence_pct']})")
print(f"ML Anomaly: {trace['ml_anomaly']['ml_anomaly_index']} ({trace['ml_anomaly']['anomaly_tier']}, {trace['ml_anomaly']['z_score_velocity']})")
print(f"Clusters Discovered: {len(trace['clustering']['clusters'])}")
print(f"Evidence Hash: {trace['evidence']['canonical_sha256'][:24]}...")

assert trace['intelligence']['risk_score'] > 70
assert trace['intelligence']['vasp'] is not None
assert trace['typology']['typology_code'] == "TASK_SCAM"

print("\n── 3. Testing Alert Generation ──")
alert = AlertService.evaluate_and_generate(trace, "INV-TEST-01")
assert alert is not None
print(f"Generated Alert: [{alert['severity']}] {alert['title']}")
all_alerts = AlertService.list_alerts()
print(f"Total Alerts in DB: {all_alerts['total']}, Unread: {all_alerts['unread_count']}")

print("\n── 4. Testing VASP Freeze Coordination ──")
freeze = VASPCoordinationService.create_freeze_request(
    investigation_id="INV-TEST-01",
    case_id="NCRP/2024/MH/00441",
    vasp_name="Binance",
    wallet_address="0x28C6c06298d514Db089934071355E5743bf21d60",
    chain="TRX",
    target_amount=45000.0,
    currency="USDT"
)
print(f"Freeze Request Created: {freeze['freeze_id']}, Notice: {freeze['notice_number']}")
assert "STATUTORY ORDER" in freeze['notice_body']
assert "Binance" in freeze['notice_body']

print("\n── 5. Testing Evidence Verification ──")
# First store the trace into investigations
conn = get_connection()
cur = conn.cursor()
cur.execute("""
    INSERT OR REPLACE INTO investigations
    (id, start_address, chain, risk_score, risk_level, typology, typology_confidence, ml_anomaly_score, hash_sha256, data_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
""", (
    "INV-TEST-01", "0xFraud_Origin_Task_Scam", "ETH", 87, "CRITICAL", "Task Scam", 90, 0.85, 
    trace['evidence']['canonical_sha256'], json.dumps(trace), "2024-01-15T10:00:00Z"
))
conn.commit()
conn.close()

verify_res = EvidenceService.verify_hash(trace['evidence']['canonical_sha256'])
print(f"Evidence Verification Result: is_valid={verify_res['is_valid']}, status={verify_res['status']}")
assert verify_res['is_valid'] is True

print("\n── 6. Testing Bulk Ingestion ──")
csv_data = BulkIngestionService.get_sample_csv()
batch_id, records = BulkIngestionService.parse_and_queue(csv_data, is_csv=True)
print(f"Queued batch {batch_id} with {len(records)} records")
batch_res = BulkIngestionService.process_batch(batch_id, records)
print(f"Processed batch: {batch_res['processed_records']}/{batch_res['total_records']}, High Risk: {batch_res['high_risk_count']}")
assert batch_res['processed_records'] == len(records)

print("\n── 7. Testing PDF Generation ──")
pdf_path = generate_pdf(trace, {"investigation_id": "TEST", "case_id": "NCRP/2024/TEST", "investigator": "Insp. Aditya Prashant Deshmukh"}, "/tmp")
print(f"Generated PDF at: {pdf_path}, Size: {os.path.getsize(pdf_path)} bytes")
assert os.path.exists(pdf_path) and os.path.getsize(pdf_path) > 1000

print("\n>>> ALL 7 BACKEND SUBSYSTEM TESTS PASSED WITH 100% SUCCESS! <<<")
