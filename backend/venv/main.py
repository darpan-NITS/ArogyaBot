from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from db.database import ping_db
from routers import health

@asynccontextmanager
async def lifespan(app: FastAPI):
    await ping_db()   # test DB on startup
    yield

app = FastAPI(
    title="ArogyaBot API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)

@app.get("/")
def root():
    return {"status": "ArogyaBot backend running ✅"}