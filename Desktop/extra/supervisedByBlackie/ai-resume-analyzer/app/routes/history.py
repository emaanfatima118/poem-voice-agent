from fastapi import APIRouter, Depends
from database.mongo import query_history_collection
from database.models import QueryHistorySchema
from utils.auth import get_current_user

router = APIRouter(prefix="/history", tags=["History"])


@router.post("/")
async def create(data: QueryHistorySchema, user=Depends(get_current_user)):
    doc = data.dict()
    doc["user_id"] = user["user_id"]

    res = await query_history_collection.insert_one(doc)
    return {"id": str(res.inserted_id)}


@router.get("/")
async def get_all(user=Depends(get_current_user)):
    items = []
    cursor = query_history_collection.find({"user_id": user["user_id"]})

    async for i in cursor:
        i["_id"] = str(i["_id"])
        items.append(i)

    return items