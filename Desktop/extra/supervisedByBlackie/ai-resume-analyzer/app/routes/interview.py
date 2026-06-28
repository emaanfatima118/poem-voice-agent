from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from datetime import datetime, timezone

from database.mongo import resumes_collection, jobs_collection, interview_collection
from utils.auth import get_current_user
from services.interview_service import generate_interview_prep

router = APIRouter(prefix="/interview", tags=["Interview"])


@router.get("/")
async def get_all(user=Depends(get_current_user)):
    items = []
    cursor = interview_collection.find({"user_id": user["user_id"]})

    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        items.append(doc)

    return items


@router.get("/{session_id}")
async def get_one(session_id: str, user=Depends(get_current_user)):
    doc = await interview_collection.find_one({
        "_id": ObjectId(session_id),
        "user_id": user["user_id"],
    })

    if not doc:
        raise HTTPException(status_code=404, detail="Interview session not found")

    doc["_id"] = str(doc["_id"])
    return doc


@router.post("/generate/{resume_id}")
async def generate_for_resume(resume_id: str, user=Depends(get_current_user)):
    resume = await resumes_collection.find_one({
        "_id": ObjectId(resume_id),
        "user_id": user["user_id"],
    })

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    resume["_id"] = str(resume["_id"])
    ai_result = generate_interview_prep(resume)

    session_doc = {
        "user_id": user["user_id"],
        "resume_id": resume_id,
        "job_id": None,
        "items": ai_result.get("items", []),
        "created_at": datetime.now(timezone.utc),
    }

    result = await interview_collection.insert_one(session_doc)
    session_doc["_id"] = str(result.inserted_id)
    return session_doc


@router.post("/generate/{resume_id}/{job_id}")
async def generate_for_job(
    resume_id: str,
    job_id: str,
    user=Depends(get_current_user),
):
    resume = await resumes_collection.find_one({
        "_id": ObjectId(resume_id),
        "user_id": user["user_id"],
    })
    job = await jobs_collection.find_one({
        "_id": ObjectId(job_id),
        "user_id": user["user_id"],
    })

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    resume["_id"] = str(resume["_id"])
    job["_id"] = str(job["_id"])

    ai_result = generate_interview_prep(resume, job)

    session_doc = {
        "user_id": user["user_id"],
        "resume_id": resume_id,
        "job_id": job_id,
        "items": ai_result.get("items", []),
        "created_at": datetime.now(timezone.utc),
    }

    result = await interview_collection.insert_one(session_doc)
    session_doc["_id"] = str(result.inserted_id)
    return session_doc
