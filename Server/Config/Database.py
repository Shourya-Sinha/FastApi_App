import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

Mongo_URL = os.getenv("MONGODB_URL")
DB_Name = os.getenv("DB_NAME")

client = motor.motor_asyncio.AsyncIOMotorClient(Mongo_URL)
database = client[DB_Name]