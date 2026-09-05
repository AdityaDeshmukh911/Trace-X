import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.endpoints import router
from app.db.database import init_db

# Initialize persistent SQLite database & indexes on application startup
init_db()

app = FastAPI(
    title="TRACE-X API",
    description="Crypto Intelligence & Fund Attribution Platform — MIT AOE Cyber Cell",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")

@app.get("/")
def health():
    return {
        "status": "operational",
        "service": "TRACE-X API v2.0 Enterprise LEA Edition",
        "mode": os.getenv("TRACE_MODE", "DEMO"),
        "database": "SQLite WAL Persistent Indexed",
        "modules": [
            "BFS Multi-Hop Trace Engine",
            "Multi-Input Co-Spend & Sweep Clustering",
            "Automated Fraud Typology Classifier",
            "Topological & Velocity ML Anomaly Detector",
            "Section 91 CrPC / Sec 94 BNSS Freeze Order Workflow",
            "Section 65B Indian Evidence Act Cryptographic Certificate",
            "Bulk Complaint Ingestion Pipeline",
            "Real-Time Threat Alert Engine"
        ]
    }
