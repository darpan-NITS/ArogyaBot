
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI environment variable is missing")

client = AsyncIOMotorClient(
    MONGODB_URI,
    serverSelectionTimeoutMS=10000,
    connectTimeoutMS=10000,
)

db = client["arogyabot"]

# Collections
users_collection = db["users"]
sessions_collection = db["sessions"]
symptoms_collection = db["symptoms"]


async def ping_db():
    try:
        await client.admin.command("ping")
        print("✅ MongoDB connected successfully")

    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        raise
