from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    user_type: str

class UserCreate(UserBase):
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    user_type: str
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class FeedbackBase(BaseModel):
    teacher_id: int
    subject: str
    lecture_topic: str
    content_rating: int
    delivery_rating: int
    engagement_rating: int
    comments: str
    is_anonymous: bool = False

class FeedbackCreate(FeedbackBase):
    pass

class Feedback(FeedbackBase):
    id: int
    student_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class PaginatedFeedback(BaseModel):
    items: List[Feedback]
    total: int
    page: int
    pages: int

    class Config:
        from_attributes = True
