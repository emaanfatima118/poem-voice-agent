from fastapi import APIRouter, Depends, HTTPException
from database.mongo import users_collection
from utils.auth import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/users", tags=["Users"])


# GET PROFILE
@router.get("/me")
async def my_profile(user=Depends(get_current_user)):
    data = await users_collection.find_one({"_id": ObjectId(user["user_id"])})
    data["_id"] = str(data["_id"])
    data.pop("password", None)
    return data


@router.delete("/me")
async def delete_account(user=Depends(get_current_user)):
    await users_collection.delete_one({"_id": ObjectId(user["user_id"])})
    return {"message": "Account deleted"}