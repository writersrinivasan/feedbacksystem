from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# User schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class UserLogin(BaseModel):
    username: str
    password: str

# Feedback schemas
class FeedbackBase(BaseModel):
    teacher_name: str
    subject: str
    rating: int
    comments: Optional[str] = None

class FeedbackCreate(FeedbackBase):
    pass

class FeedbackResponse(FeedbackBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Dashboard schemas
class StudentDashboardData(BaseModel):
    total_feedback: int
    recent_feedback: List[FeedbackResponse]
    avg_rating_given: float

class TeacherDashboardData(BaseModel):
    total_feedback_received: int
    avg_rating: float
    feedback_by_subject: dict
    recent_feedback: List[dict]
