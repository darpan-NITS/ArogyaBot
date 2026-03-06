from groq import Groq
from dotenv import load_dotenv
from services.ner_service import extract_medical_entities
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
        return lang if lang in ["hi", "bn", "te", "ta", "mr", "gu", "kn","as"] else "en"
    except:
        return "en"


async def get_triage_response(
    message: str,
    conversation_history: list,
    language: str = "en"
) -> dict:
    try:
        # ── Run NER on the message ──
        entities = extract_medical_entities(message)

        # ── Build enriched prompt ──
        enriched_message = message
        if entities["structured_summary"]:
            enriched_message = (
                f"{message}\n\n"
                f"[Extracted medical context: {entities['structured_summary']}]"
            )

        # ── Build messages array ──
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for msg in conversation_history[-6:]:
            messages.append({
                "role": "user" if msg["role"] == "user" else "assistant",
                "content": msg["text"]
            })
        messages.append({"role": "user", "content": enriched_message})

        # ── Call Groq ──
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=300,
            temperature=0.4,
        )

        reply = response.choices[0].message.content

        # ── Determine severity — NER takes priority over LLM ──
        llm_severity = extract_severity_from_reply(reply)
        ner_severity = entities["severity_indicated"]

        # Use whichever is more severe
        severity_rank = {"mild": 1, "moderate": 2, "urgent": 3, "emergency": 4}
        ner_rank = severity_rank.get(ner_severity, 0)
        llm_rank = severity_rank.get(llm_severity, 1)
        final_severity = ner_severity if ner_rank > llm_rank else llm_severity

        # Clean severity tag from display
        clean_reply = reply
        for tag in ["[SEVERITY: mild]", "[SEVERITY: moderate]",
                    "[SEVERITY: urgent]", "[SEVERITY: emergency]"]:
            clean_reply = clean_reply.replace(tag, "").strip()

        return {
            "reply":      clean_reply,
            "severity":   final_severity,
            "entities":   entities,
            "tokens_used": response.usage.total_tokens,
        }

    except Exception as e:
        print(f"Groq error: {e}")
        return {
            "reply":    "I'm having trouble connecting right now. Please try again.",
            "severity": "mild",
            "entities": {},
            "tokens_used": 0,
        }


def extract_severity_from_reply(text: str) -> str:
    text_lower = text.lower()
    if "[severity: emergency]" in text_lower: return "emergency"
    if "[severity: urgent]"    in text_lower: return "urgent"
    if "[severity: moderate]"  in text_lower: return "moderate"
    return "mild"
