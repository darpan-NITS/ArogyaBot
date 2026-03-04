from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class User(BaseModel):
    id: Optional[str] = None
    phone: Optional[str] = None   # optional, for OTP later
    language: str = "en"          # preferred language
    created_at: datetime = Field(default_factory=datetime.utcnow)