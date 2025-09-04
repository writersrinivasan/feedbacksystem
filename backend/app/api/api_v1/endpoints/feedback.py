from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import User, Feedback
from app.schemas.schemas import FeedbackCreate, Feedback as FeedbackSchema
from typing import List
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=FeedbackSchema)
def create_feedback(
    feedback: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new feedback"""
    # Create new feedback
    db_feedback = Feedback(
        student_id=current_user.id,
        teacher_id=feedback.teacher_id,
        subject=feedback.subject,
        lecture_topic=feedback.lecture_topic,
        lecture_date=datetime.now(),
        content_rating=feedback.content_rating,
        delivery_rating=feedback.delivery_rating,
        engagement_rating=feedback.engagement_rating,
        comments=feedback.comments,
        is_anonymous=feedback.is_anonymous
    )
    
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

@router.get("/", response_model=List[FeedbackSchema])
def get_all_feedback(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all feedback based on user role"""
    if current_user.user_type == "student":
        feedback = db.query(Feedback).filter(Feedback.student_id == current_user.id).all()
    elif current_user.user_type == "teacher":
        feedback = db.query(Feedback).filter(Feedback.teacher_id == current_user.id).all()
    else:  # admin
        feedback = db.query(Feedback).all()
    
    return feedback

@router.get("/teacher/{teacher_id}", response_model=List[FeedbackSchema])
def get_teacher_feedback(
    teacher_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get feedback for a specific teacher"""
    if current_user.user_type == "teacher" and current_user.id != teacher_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    feedback = db.query(Feedback).filter(Feedback.teacher_id == teacher_id).all()
    return feedback
