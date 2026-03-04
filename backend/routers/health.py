from fastapi import APIRouter
from db.database import ping_db

router = APIRouter(prefix="/api", tags=["Health"])

@router.get("/health")
async def health_check():
    await ping_db()
    return {
        "status": "healthy",
        "service": "ArogyaBot API",
        "database": "connected"
    }