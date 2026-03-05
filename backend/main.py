from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from db.database import ping_db
from routers import health, chat, session, voice , facility , medicine

@asynccontextmanager
async def lifespan(app: FastAPI):
    await ping_db()
    yield

app = FastAPI(title="ArogyaBot API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(chat.router)
app.include_router(session.router)
app.include_router(voice.router)
app.include_router(facility.router)
app.include_router(medicine.router)

@app.get("/")
def root():
    return {"status": "ArogyaBot backend running ✅"}
