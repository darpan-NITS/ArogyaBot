from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.database import sessions_collection
from services.groq_service import get_triage_response, detect_language
from datetime import datetime

router = APIRouter(prefix="/api", tags=["Chat"])

class ChatRequest(BaseModel):
    message: str
    session_id: str
    language: str = "en"

@router.post("/chat")
async def chat(req: ChatRequest):
    # Get session + history from DB
    session = await sessions_collection.find_one(
        {"session_id": req.session_id},
        {"_id": 0}
    )
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Auto-detect language if not set
    detected_lang = detect_language(req.message)
    language = detected_lang if detected_lang != "en" else req.language

    # Get conversation history
    history = session.get("messages", [])

    # Call Groq
    result = await get_triage_response(
        message=req.message,
        conversation_history=history,
        language=language,
    )

    # Save both messages to DB
    user_message = {
        "role": "user",
        "text": req.message,
        "language": language,
        "timestamp": datetime.utcnow().isoformat(),
    }
    bot_message = {
        "role": "bot",
        "text": result["reply"],
        "severity": result["severity"],
        "timestamp": datetime.utcnow().isoformat(),
    }

    await sessions_collection.update_one(
        {"session_id": req.session_id},
        {
            "$push": {"messages": {"$each": [user_message, bot_message]}},
            "$set": {"severity": result["severity"]}
        }
    )

    return {
        "reply": result["reply"],
        "severity": result["severity"],
        "session_id": req.session_id,
        "language": language,
    }
