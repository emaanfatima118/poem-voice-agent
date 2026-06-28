from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime


# =========================================================
# USER SCHEMAS
# =========================================================

class UserSchema(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    profile_picture: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str


class UserResponseSchema(BaseModel):
    id: Optional[str] = None
    full_name: str
    email: EmailStr
    profile_picture: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# =========================================================
# EDUCATION SCHEMA
# =========================================================

class EducationSchema(BaseModel):
    degree: str
    institution: str
    year: Optional[str] = None


# =========================================================
# EXPERIENCE SCHEMA
# =========================================================

class ExperienceSchema(BaseModel):
    company: str
    role: str
    duration: Optional[str] = None
    description: Optional[str] = None


# =========================================================
# PROJECT SCHEMA
# =========================================================

class ProjectSchema(BaseModel):
    title: str
    description: Optional[str] = None
    technologies: Optional[List[str]] = []


# =========================================================
# ATTACHMENT SCHEMA
# =========================================================

class AttachmentSchema(BaseModel):
    file_name: str
    file_type: str
    file_url: str
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)


# =========================================================
# RESUME SCHEMA
# =========================================================

class ResumeSchema(BaseModel):
    user_id: Optional[str] = None  # 🔐 now optional (set via JWT in backend)

    name: str
    email: EmailStr
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None

    skills: List[str]
    education: Optional[List[EducationSchema]] = []
    experience: Optional[List[ExperienceSchema]] = []
    projects: Optional[List[ProjectSchema]] = []
    certifications: Optional[List[str]] = []
    languages: Optional[List[str]] = []

    attachments: Optional[List[AttachmentSchema]] = []

    raw_text: str
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)


class ResumeResponseSchema(ResumeSchema):
    id: Optional[str] = None

    class Config:
        from_attributes = True


# =========================================================
# JOB SCHEMA
# =========================================================

class JobSchema(BaseModel):
    user_id: Optional[str] = None

    title: str

    company: Optional[str] = None

    location: Optional[str] = None

    employment_type: Optional[str] = None

    experience_required: Optional[str] = None

    education_required: Optional[str] = None

    required_skills: List[str] = []

    preferred_skills: List[str] = []

    responsibilities: List[str] = []

    qualifications: List[str] = []

    description: str

    created_at: datetime = Field(default_factory=datetime.utcnow)
# =========================================================
# CHAT MESSAGE SCHEMA
# =========================================================

class ChatMessageSchema(BaseModel):
    sender: str
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    attachments: Optional[List[AttachmentSchema]] = []


# =========================================================
# CHAT SESSION SCHEMA
# =========================================================

class ChatSessionSchema(BaseModel):
    user_id: Optional[str] = None  # 🔐 from JWT

    title: Optional[str] = "New Chat"
    messages: List[ChatMessageSchema] = []

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# =========================================================
# ANALYSIS SCHEMA
# =========================================================

class AnalysisSchema(BaseModel):
    user_id: Optional[str] = None

    resume_id: str

    job_id: Optional[str] = None

    analysis_summary: str

    strengths: List[str]

    weaknesses: List[str]

    match_score: int

    matched_skills: List[str]

    missing_skills: List[str]

    suggestions: List[str]

    attachments: Optional[List[AttachmentSchema]] = []

    created_at: datetime = Field(default_factory=datetime.utcnow)


# =========================================================
# INTERVIEW SCHEMA
# =========================================================

class InterviewItemSchema(BaseModel):
    category: str
    question: str
    suggested_answer: str
    talking_points: List[str] = []


class InterviewSessionSchema(BaseModel):
    user_id: Optional[str] = None
    resume_id: str
    job_id: Optional[str] = None
    items: List[InterviewItemSchema]
    created_at: datetime = Field(default_factory=datetime.utcnow)

# =========================================================
# QUERY HISTORY SCHEMA
# =========================================================

class QueryHistorySchema(BaseModel):
    user_id: Optional[str] = None  # 🔐 from JWT

    query: str
    response: str

    attachments: Optional[List[AttachmentSchema]] = []

    created_at: datetime = Field(default_factory=datetime.utcnow)