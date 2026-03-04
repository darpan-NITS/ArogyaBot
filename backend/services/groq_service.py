from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """You are ArogyaBot, an AI health triage assistant designed for India.
Your role is to:
1. Listen to symptoms described by the user
2. Ask clarifying questions (duration, severity, age, existing conditions)
3. Provide a possible assessment — NOT a diagnosis
4. Classify severity as one of: mild, moderate, urgent, emergency
5. Recommend next steps (rest at home / visit PHC / go to hospital immediately)
6. Always end with: "Please consult a qualified doctor for proper diagnosis."

Rules:
- Never say you are 100% certain of any diagnosis
- Always recommend professional medical help
- Be warm, empathetic, and clear
- If severity is emergency, say so clearly and urgently
- Keep responses concise — under 120 words
- Always include severity classification at the end like: [SEVERITY: mild]

You support users from rural India — keep language simple and reassuring."""


def detect_language(text: str) -> str:
    try:
        from langdetect import detect
        lang = detect(text)
        return lang if lang in ["hi", "bn", "te", "ta", "mr", "gu", "kn"] else "en"
    except:
        return "en"


async def get_triage_response(
    message: str,
    conversation_history: list,
    language: str = "en"
) -> dict:
    # Build messages array with history
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    # Add conversation history (last 6 messages for context)
    for msg in conversation_history[-6:]:
        messages.append({
            "role": msg["role"] if msg["role"] == "user" else "assistant",
            "content": msg["text"]
        })

    # Add current message
    messages.append({"role": "user", "content": message})

    # Call Groq
    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=messages,
        max_tokens=300,
        temperature=0.4,   # lower = more consistent medical responses
    )

    reply = response.choices[0].message.content

    # Extract severity from response
    severity = extract_severity(reply)

    # Clean the severity tag from display text
    clean_reply = reply.replace(f"[SEVERITY: {severity}]", "").strip()

    return {
        "reply": clean_reply,
        "severity": severity,
        "tokens_used": response.usage.total_tokens,
    }


def extract_severity(text: str) -> str:
    text_lower = text.lower()
    if "[severity: emergency]" in text_lower:
        return "emergency"
    elif "[severity: urgent]" in text_lower:
        return "urgent"
    elif "[severity: moderate]" in text_lower:
        return "moderate"
    else:
        return "mild"
