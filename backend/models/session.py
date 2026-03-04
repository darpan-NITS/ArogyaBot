from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Session(BaseModel):
    id: Optional[str] = None
    user_id: str
    started_at: datetime = Field(default_factory=datetime.utcnow)
    ended_at: Optional[datetime] = None
    severity: Optional[str] = None   # mild / moderate / urgent / emergency
    language: str = "en"