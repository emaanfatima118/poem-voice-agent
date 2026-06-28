from fastapi import APIRouter, Depends
from database.models import AnalysisSchema
from utils.auth import get_current_user
from bson import ObjectId
from fastapi import HTTPException
from datetime import datetime, timezone
from database.mongo import (
    resumes_collection,
    analysis_collection,
    jobs_collection
)

from services.analysis_service import analyze_resume, analyze_resume_job

router = APIRouter(prefix="/analysis", tags=["Analysis"])


@router.post("/")
async def create(data: AnalysisSchema, user=Depends(get_current_user)):
    doc = data.dict()
    doc["user_id"] = user["user_id"]

    res = await analysis_collection.insert_one(doc)
    return {"id": str(res.inserted_id)}


@router.get("/")
async def get_all(user=Depends(get_current_user)):
    items = []
    cursor = analysis_collection.find({"user_id": user["user_id"]})

    async for i in cursor:
        i["_id"] = str(i["_id"])
        items.append(i)

    return items

@router.post("/analyze/{resume_id}")
async def analyze_resume_route(
    resume_id: str,
    user=Depends(get_current_user)
):
    resume = await resumes_collection.find_one({
        "_id": ObjectId(resume_id),
        "user_id": user["user_id"]
    })

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )
    ai_result = analyze_resume(resume)
    analysis_doc = {
        "user_id": user["user_id"],
        "resume_id": resume_id,
        **ai_result
    }
    result = await analysis_collection.insert_one(analysis_doc)

    analysis_doc["_id"] = str(result.inserted_id)

    return analysis_doc

@router.post("/analyze-job/{resume_id}/{job_id}")
async def analyze_resume_job_route(
    resume_id: str,
    job_id: str,
    user=Depends(get_current_user)
):
    resume = await resumes_collection.find_one({
        "_id": ObjectId(resume_id),
        "user_id": user["user_id"]
    })
    job = await jobs_collection.find_one({
        "_id": ObjectId(job_id),
        "user_id": user["user_id"]
    })

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )
    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found")

    ai_result = analyze_resume_job(resume, job)
    analysis_doc = {
        "user_id": user["user_id"],
        "resume_id": resume_id,
        "job_id": job_id,
        "query": None,
        "ai_response": ai_result["ai_response"],
        "strengths": ai_result["strengths"],
        "weaknesses": ai_result["weaknesses"],
        "match_score": ai_result["match_score"],
        "matched_skills": ai_result["matched_skills"],
        "missing_skills": ai_result["missing_skills"],
        "suggestions": ai_result["suggestions"],
        "attachments": [],
        "created_at": datetime.now(timezone.utc)
    }
    result = await analysis_collection.insert_one(analysis_doc)

    analysis_doc["_id"] = str(result.inserted_id)

    return {
        "analysis_id": str(result.inserted_id),
        "analysis": analysis_doc
    }