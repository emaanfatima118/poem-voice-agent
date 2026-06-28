from fastapi import APIRouter, Depends
from database.mongo import chats_collection
from database.models import ChatSessionSchema, ChatMessageSchema
from utils.auth import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/chats", tags=["Chats"])


# CREATE CHAT SESSION
@router.post("/")
async def create(chat: ChatSessionSchema, user=Depends(get_current_user)):
    data = chat.dict()
    data["user_id"] = user["user_id"]

    res = await chats_collection.insert_one(data)
    return {"id": str(res.inserted_id)}


# GET ALL CHATS
@router.get("/")
async def get_all(user=Depends(get_current_user)):
    items = []
    cursor = chats_collection.find({"user_id": user["user_id"]})

    async for i in cursor:
        i["_id"] = str(i["_id"])
        items.append(i)

    return items


# ADD MESSAGE
@router.post("/{chat_id}/message")
async def add_message(chat_id: str, msg: ChatMessageSchema, user=Depends(get_current_user)):

    await chats_collection.update_one(
        {"_id": ObjectId(chat_id), "user_id": user["user_id"]},
        {"$push": {"messages": msg.dict()}}
    )

    return {"message": "added"}