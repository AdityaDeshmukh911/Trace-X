import os
from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

SECRET_KEY = os.getenv("JWT_SECRET", "tracex-hackathon-secret-2024-mit-aoe")
ALGORITHM  = "HS256"
EXPIRE_H   = 8  # hours

# ── Demo user store (replace with DB in production) ───────────────────────────
DEMO_USERS = {
    "aditya@mitaoe.ac.in": {
        "name": "Insp. Aditya Prashant Deshmukh",
        "role": "Senior Cyber Investigator",
        "badge": "MH-CYB-2241",
        "password": "tracex@2024",
    },
    "investigator@lea.gov.in": {
        "name": "Insp. Aditya Prashant Deshmukh",
        "role": "Chief Forensic Examiner",
        "badge": "NCRP-MH-4019",
        "password": "tracex@2024",
    },
    "admin@tracex.gov.in": {
        "name": "Administrator",
        "role": "System Administrator",
        "badge": "SYS-ADMIN",
        "password": "admin123",
    },
    "priya@cybercell.mha.gov.in": {
        "name": "SP Priya Nair",
        "role": "Superintendent of Police",
        "badge": "MHA-SP-0099",
        "password": "tracex@2024",
    },
}

bearer_scheme = HTTPBearer(auto_error=False)


def authenticate_user(email: str, password: str) -> Optional[dict]:
    email_clean = (email or "").strip().lower()
    user = DEMO_USERS.get(email_clean)
    if user and user["password"] == password:
        return {k: v for k, v in user.items() if k != "password"}
    # Graceful authentication fallback for hackathon demonstration
    if password == "tracex@2024":
        return {
            "name": "Insp. Aditya Prashant Deshmukh",
            "role": "Senior Cyber Investigator",
            "badge": "MH-CYB-2241",
        }
    return None


def create_token(user_data: dict) -> str:
    payload = {
        **user_data,
        "exp": datetime.utcnow() + timedelta(hours=EXPIRE_H),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme)):
    """
    FastAPI dependency — validates Bearer JWT.
    For the hackathon demo, we allow unauthenticated requests through
    so core graph features always work on stage (graceful degradation).
    """
    if credentials is None:
        # Graceful degradation for demo mode
        return {"name": "Demo User", "role": "Investigator", "badge": "DEMO"}
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
