from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from database.mongo import resumes_collection
from database.models import ResumeSchema
from utils.auth import get_current_user
from bson import ObjectId
from datetime import datetime, timezone
import os
import pdfplumber
import docx2txt
import services.ai_resume as ai_resume

router = APIRouter(prefix="/resumes", tags=["Resumes"])
UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)
@router.get("/me")
async def get_my_resume(user=Depends(get_current_user)):
    resume = await resumes_collection.find_one({"user_id": user["user_id"]})

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    resume["_id"] = str(resume["_id"])
    return resume
# CREATE
@router.post("/")
async def create(resume: ResumeSchema, user=Depends(get_current_user)):
    data = resume.dict()
    data["user_id"] = user["user_id"]

    res = await resumes_collection.insert_one(data)
    return {"id": str(res.inserted_id)}


# READ ALL
@router.get("/")
async def get_all(user=Depends(get_current_user)):
    items = []
    cursor = resumes_collection.find({"user_id": user["user_id"]})

    async for i in cursor:
        i["_id"] = str(i["_id"])
        items.append(i)

    return items


# READ ONE
@router.get("/{id}")
async def get_one(id: str, user=Depends(get_current_user)):
    doc = await resumes_collection.find_one({
        "_id": ObjectId(id),
        "user_id": user["user_id"]
    })

    if not doc:
        raise HTTPException(404)

    doc["_id"] = str(doc["_id"])
    return doc


# UPDATE
@router.put("/{id}")
async def update(id: str, data: dict, user=Depends(get_current_user)):
    res = await resumes_collection.update_one(
        {"_id": ObjectId(id), "user_id": user["user_id"]},
        {"$set": data}
    )

    if res.modified_count == 0:
        raise HTTPException(404, "Not updated")

    return {"message": "updated"}


# DELETE
@router.delete("/{id}")
async def delete(id: str, user=Depends(get_current_user)):
    res = await resumes_collection.delete_one({
        "_id": ObjectId(id),
        "user_id": user["user_id"]
    })

    if res.deleted_count == 0:
        raise HTTPException(404)

    return {"message": "deleted"}

# UPLOAD RESUME
@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    user=Depends(get_current_user)):

    file_path = f"{UPLOAD_DIR}/{user['user_id']}_{file.filename}"

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    extracted_text = extract_text(file_path)
    structured_data = ai_resume.extract_resume_structured(
        raw_text=extracted_text,
        user_id=user["user_id"]
    )
    resume = ResumeSchema(**structured_data)
    data = resume.model_dump()
    data["user_id"] = user["user_id"]

    await resumes_collection.insert_one(data)
    print(structured_data)
    return {
        "file_name": file.filename,
        "file_path": file_path,
        "file_type": file.content_type,
        "uploaded_at": datetime.now(timezone.utc)
    }

def extract_text(file_path: str):
    if file_path.endswith(".pdf"):
        return extract_pdf_text(file_path)

    elif file_path.endswith(".docx"):
        return extract_docx_text(file_path)

    raise Exception("Unsupported file type")

def extract_pdf_text(file_path: str):

    text = ""

    with pdfplumber.open(file_path) as pdf:

        for page in pdf.pages:
            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

    return text


def extract_docx_text(file_path: str):

    text = docx2txt.process(file_path)

    return text