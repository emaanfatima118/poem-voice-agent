# =========================================================
# auth_routes.py
# JWT Authentication using HS512
# =========================================================

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import jwt
from jose.exceptions import JWTError
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

from database.models import UserSchema, UserLoginSchema
from database.mongo import users_collection


# =========================================================
# LOAD ENV VARIABLES
# =========================================================

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET")

ALGORITHM = "HS512"

ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# =========================================================
# PASSWORD HASHING
# =========================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =========================================================
# HASH PASSWORD
# =========================================================

def hash_password(password: str):
    return pwd_context.hash(password)


# =========================================================
# VERIFY PASSWORD
# =========================================================

def verify_password(
    plain_password,
    hashed_password
):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )


# =========================================================
# GENERATE ACCESS TOKEN
# =========================================================

def create_access_token(
    data: dict,
    expires_delta: timedelta = None
):

    to_encode = data.copy()

    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=60)
    )

    to_encode.update({
        "exp": expire
    })

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_id = payload.get("user_id")
        email = payload.get("email")

        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        return {
            "user_id": user_id,
            "email": email
        }

    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalid or expired")
    
 # =========================================================
# SIGNUP ROUTE
# =========================================================

@router.post("/signup")
async def signup(user: UserSchema):

    # check if email exists
    existing_user = await users_collection.find_one({
        "email": user.email
    })
    print(existing_user)
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    # hash password
    hashed_password = hash_password(user.password)

    # create user object
    user_dict = user.dict()

    user_dict["password"] = hashed_password

    # insert user
    result = await users_collection.insert_one(
        user_dict
    )

    # generate token
    access_token = create_access_token(
        data={
            "user_id": str(result.inserted_id),
            "email": user.email
        }
    )

    return {
        "message": "User created successfully",
        "access_token": access_token,
        "token_type": "bearer"
    }


# =========================================================
# LOGIN ROUTE
# =========================================================

@router.post("/login")
async def login(user: UserLoginSchema):

    # find user
    existing_user = await users_collection.find_one({
        "email": user.email
    })

    if not existing_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # verify password
    is_valid = verify_password(
        user.password,
        existing_user["password"]
    )

    if not is_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    # generate token
    access_token = create_access_token(
        data={
            "user_id": str(existing_user["_id"]),
            "email": existing_user["email"]
        }
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer"
    }