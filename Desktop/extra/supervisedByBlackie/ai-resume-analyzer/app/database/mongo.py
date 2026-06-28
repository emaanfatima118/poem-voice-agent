from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

# load env variables
load_dotenv()

# get env variables
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

# create client
client = AsyncIOMotorClient(MONGO_URI)

# create database
db = client[DATABASE_NAME]

# ======================================================
# COLLECTIONS
# ======================================================

users_collection = db["users"]

resumes_collection = db["resumes"]

jobs_collection = db["jobs"]

chats_collection = db["chats"]

analysis_collection = db["analysis"]

interview_collection = db["interviews"]

query_history_collection = db["query_history"]