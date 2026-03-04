from pydantic import BaseModel, Field
from typing import List, Optional

class Symptom(BaseModel):
    session_id: str
    raw_text: str                        # what user actually said
    language: str = "en"
    extracted_symptoms: List[str] = []   # after NER — e.g. ["fever", "headache"]
    duration: Optional[str] = None       # e.g. "3 days"
    severity_score: Optional[str] = None
    icd_codes: List[str] = []            # ICD-11 codes mapped later