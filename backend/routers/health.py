
from fastapi import APIRouter, HTTPException
from db.database import ping_db

router = APIRouter(prefix="/api", tags=["Health"])


@router.get("/health")
async def health_check():
    try:
        await ping_db()

        return {
            "status": "healthy",
            "service": "ArogyaBot API",
            "database": "connected"
        }

    except Exception:
        raise HTTPException(
            status_code=503,
            detail={
                "status": "unhealthy",
                "service": "ArogyaBot API",
                "database": "disconnected"
            }
        )
