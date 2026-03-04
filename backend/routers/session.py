from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.database import sessions_collection
from datetime import datetime
import uuid

router = APIRouter(prefix="/api", tags=["Session"])

class SessionCreate(BaseModel):
    language: str = "en"

@router.post("/session")
async def create_session(req: SessionCreate):
    session_id = str(uuid.uuid4())
    session = {
        "session_id": session_id,
        "language": req.language,
        "started_at": datetime.utcnow(),
        "messages": [],
        "severity": None,
    }
    await sessions_collection.insert_one(session)
    return {"session_id": session_id, "language": req.language}

@router.get("/session/{session_id}")
async def get_session(session_id: str):
    session = await sessions_collection.find_one(
        {"session_id": session_id},
        {"_id": 0}
    )
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session