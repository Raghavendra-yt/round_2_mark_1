from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional

class UserLocation(BaseModel):
    """
    Strict validation for user geolocation data.
    Prevents coordinate spoofing and malformed inputs.
    """
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)

class LeaderboardSubmission(BaseModel):
    """
    Validated schema for leaderboard entries.
    Includes sanitization for user-provided names.
    """
    name: str = Field(..., min_length=1, max_length=32)
    score: int = Field(..., ge=0, le=100)
    total: int = Field(..., ge=1, le=100)
    timestamp: Optional[datetime] = Field(default_factory=datetime.utcnow)

    @validator('name')
    def sanitize_name(cls, v):
        # Strip potentially dangerous characters and trim
        import re
        v = re.sub(r'[^a-zA-Z\s\'-]', '', v)
        return v.strip()

# Example usage in FastAPI
# @app.post("/submit-score")
# async def submit_score(data: LeaderboardSubmission):
#     # Process validated data
#     return {"status": "success", "received": data.name}
