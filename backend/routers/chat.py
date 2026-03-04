from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.database import sessions_collection
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/api", tags=["Chat"])

class ChatRequest(BaseModel):
    message: str
    session_id: str
    language: str = "en"

@router.post("/chat")
async def chat(req: ChatRequest):
    # Verify session exists
    session = await sessions_collection.find_one(
        {"session_id": req.session_id}
    )
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Save user message to DB
    user_message = {
        "role": "user",
        "text": req.message,
        "language": req.language,
        "timestamp": datetime.utcnow().isoformat(),
    }

    # Placeholder reply — Groq/Llama-3 connects on Day 5
    bot_reply = (
        "I've received your symptoms. Our AI triage engine "
        "is being connected — come back on Day 5 for real responses!"
    )

    bot_message = {
        "role": "bot",
        "text": bot_reply,
        "timestamp": datetime.utcnow().isoformat(),
        "severity": "mild",
    }

    # Append both messages to session
    await sessions_collection.update_one(
        {"session_id": req.session_id},
        {"$push": {"messages": {"$each": [user_message, bot_message]}}}
    )

    return {
        "reply": bot_reply,
        "severity": "mild",
        "session_id": req.session_id,
    }