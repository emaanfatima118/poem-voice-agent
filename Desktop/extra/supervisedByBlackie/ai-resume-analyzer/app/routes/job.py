from fastapi import APIRouter, Depends
from database.mongo import jobs_collection
from database.models import JobSchema
from utils.auth import get_current_user
from bson import ObjectId

from services.job_parser import parse_job_description

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("/")
async def create(job: JobSchema, user=Depends(get_current_user)):
    data = job.dict()
    data["user_id"] = user["user_id"]

    res = await jobs_collection.insert_one(data)
    return {"id": str(res.inserted_id)}


@router.get("/")
async def get_all(user=Depends(get_current_user)):
    items = []
    cursor = jobs_collection.find({"user_id": user["user_id"]})

    async for i in cursor:
        i["_id"] = str(i["_id"])
        items.append(i)

    return items


@router.get("/{id}")
async def get_one(id: str, user=Depends(get_current_user)):
    doc = await jobs_collection.find_one({
        "_id": ObjectId(id),
        "user_id": user["user_id"]
    })

    doc["_id"] = str(doc["_id"])
    return doc


@router.delete("/{id}")
async def delete(id: str, user=Depends(get_current_user)):
    await jobs_collection.delete_one({
        "_id": ObjectId(id),
        "user_id": user["user_id"]
    })

    return {"message": "deleted"}

@router.post("/parse")
async def parse_job(
    payload: dict,
    user=Depends(get_current_user)
):

    structured_job = parse_job_description(
        payload["description"]
    )

    structured_job["user_id"] = user["user_id"]

    result = await jobs_collection.insert_one(structured_job)
    structured_job["_id"] = str(result.inserted_id)

    return structured_job