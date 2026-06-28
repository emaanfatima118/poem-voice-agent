from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ======================================================
# ROUTES IMPORT
# ======================================================

from utils.auth import router as auth_router
from routes.users import router as users_router
from routes.resume import router as resume_router
from routes.job import router as job_router
from routes.chat import router as chat_router
from routes.analysis import router as analysis_router
from routes.interview import router as interview_router
from routes.history import router as history_router

# ======================================================
# FASTAPI APP
# ======================================================

app = FastAPI(
    title="AI Resume Analyzer API",
    description="Backend API for AI Resume Analyzer",
    version="1.0.0"
)

# ======================================================
# CORS CONFIGURATION
# ======================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite React
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================================================
# INCLUDE ROUTERS
# ======================================================

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(resume_router)
app.include_router(job_router)
app.include_router(chat_router)
app.include_router(analysis_router)
app.include_router(interview_router)
app.include_router(history_router)

# ======================================================
# ROOT ROUTE
# ======================================================

@app.get("/")
async def root():
    return {
        "message": "AI Resume Analyzer API is running"
    }

# ======================================================
# HEALTH CHECK
# ======================================================

@app.get("/health")
async def health_check():
    return {
        "status": "healthy"
    }