import re
from typing import Optional

# ── Symptom dictionary ──────────────────────────────────────────
SYMPTOMS = {
    # General
    "fever", "temperature", "chills", "fatigue", "weakness", "malaise",
    "sweating", "night sweats", "weight loss", "weight gain",
    # Head
    "headache", "migraine", "dizziness", "vertigo", "fainting",
    "confusion", "memory loss",
    # Eyes/Ears/Nose/Throat
    "sore throat", "runny nose", "blocked nose", "nasal congestion",
    "sneezing", "cough", "dry cough", "wet cough", "hoarseness",
    "ear pain", "ear ache", "hearing loss", "eye pain", "blurred vision",
    "red eyes", "watery eyes",
    # Chest
    "chest pain", "chest tightness", "shortness of breath",
    "difficulty breathing", "breathlessness", "palpitations",
    "rapid heartbeat", "wheezing",
    # Abdomen
    "stomach pain", "abdominal pain", "stomach ache", "nausea",
    "vomiting", "diarrhea", "constipation", "bloating", "gas",
    "loss of appetite", "indigestion", "heartburn", "acid reflux",
    "blood in stool",
    # Skin
    "rash", "itching", "hives", "swelling", "bruising", "jaundice",
    "yellowing", "skin discoloration", "acne", "boils",
    # Musculoskeletal
    "joint pain", "muscle pain", "back pain", "neck pain", "knee pain",
    "body ache", "stiffness", "cramps", "muscle weakness",
    # Urinary
    "burning urination", "frequent urination", "blood in urine",
    "painful urination", "urinary incontinence",
    # Neurological
    "numbness", "tingling", "seizures", "tremors", "paralysis",
    # Hindi/Indian colloquial terms mapped
    "bukhar", "sar dard", "pet dard", "khasi", "ulti", "chakkar",
    "kamzori", "thakaan", "sir dard", "pet mein dard",
}

DURATION_PATTERNS = [
    r"(\d+)\s*(day|days|din|dino)",
    r"(\d+)\s*(week|weeks|hafta|hafte)",
    r"(\d+)\s*(month|months|mahina|mahine)",
    r"(\d+)\s*(hour|hours|ghante|ghanta)",
    r"since\s+(yesterday|morning|evening|last\s+night|last\s+week)",
    r"(yesterday|this morning|since morning|since yesterday)",
    r"(few days|kuch din|kai din)",
]

SEVERITY_WORDS = {
    "mild": ["mild", "slight", "little", "thoda", "halka"],
    "moderate": ["moderate", "medium", "quite", "kaafi"],
    "severe": ["severe", "intense", "extreme", "very", "bahut", "bohot",
               "unbearable", "terrible", "bad", "high", "tez"],
    "emergency": ["cannot breathe", "can't breathe", "unconscious",
                  "not breathing", "heart attack", "stroke",
                  "bleeding heavily", "collapsed"],
}

BODY_PARTS = {
    "head", "chest", "stomach", "back", "neck", "throat", "eyes",
    "ears", "nose", "legs", "arms", "hands", "feet", "joints",
    "skin", "heart", "lungs", "liver", "kidneys",
    # Hindi
    "sar", "seena", "pet", "kamar", "gala",
}

AGE_PATTERNS = [
    r"(\d+)\s*(?:year|years|sal|saal)\s*old",
    r"age\s*(?:is\s*)?(\d+)",
    r"i\s*am\s*(\d+)",
    r"(\d+)\s*(?:yr|yrs)",
]


def extract_symptoms(text: str) -> list[str]:
    text_lower = text.lower()
    found = []
    for symptom in SYMPTOMS:
        if symptom in text_lower:
            found.append(symptom)
    return found


def extract_duration(text: str) -> Optional[str]:
    text_lower = text.lower()
    for pattern in DURATION_PATTERNS:
        match = re.search(pattern, text_lower)
        if match:
            return match.group(0)
    return None


def extract_severity_words(text: str) -> str:
    text_lower = text.lower()
    # Check emergency first
    for phrase in SEVERITY_WORDS["emergency"]:
        if phrase in text_lower:
            return "emergency"
    for level in ["severe", "moderate", "mild"]:
        for word in SEVERITY_WORDS[level]:
            if word in text_lower:
                return level
    return "unknown"


def extract_body_parts(text: str) -> list[str]:
    text_lower = text.lower()
    return [part for part in BODY_PARTS if part in text_lower]


def extract_age(text: str) -> Optional[int]:
    text_lower = text.lower()
    for pattern in AGE_PATTERNS:
        match = re.search(pattern, text_lower)
        if match:
            return int(match.group(1))
    return None


def extract_medical_entities(text: str) -> dict:
    """
    Main NER function — extracts all medical entities from text.
    Returns structured dict used to enrich Groq prompt.
    """
    symptoms     = extract_symptoms(text)
    duration     = extract_duration(text)
    severity     = extract_severity_words(text)
    body_parts   = extract_body_parts(text)
    age          = extract_age(text)

    # Build a structured summary for the LLM
    summary_parts = []
    if symptoms:
        summary_parts.append(f"Symptoms: {', '.join(symptoms)}")
    if duration:
        summary_parts.append(f"Duration: {duration}")
    if severity != "unknown":
        summary_parts.append(f"Severity indicated: {severity}")
    if body_parts:
        summary_parts.append(f"Affected areas: {', '.join(body_parts)}")
    if age:
        summary_parts.append(f"Patient age: {age}")

    structured_summary = " | ".join(summary_parts) if summary_parts else ""

    return {
        "symptoms":           symptoms,
        "duration":           duration,
        "severity_indicated": severity,
        "body_parts":         body_parts,
        "age":                age,
        "structured_summary": structured_summary,
        "raw_text":           text,
    }
