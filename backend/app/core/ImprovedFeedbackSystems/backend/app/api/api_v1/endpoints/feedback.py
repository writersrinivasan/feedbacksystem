from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.core.database import get_db
from app.models.models import User, Feedback
from app.schemas.schemas import FeedbackCreate, FeedbackResponse, StudentDashboardData, TeacherDashboardData
from app.api.api_v1.endpoints.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=FeedbackResponse)
def submit_feedback(
    feedback: FeedbackCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Only students can submit feedback
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can submit feedback"
        )
    
    # Validate rating
    if feedback.rating < 1 or feedback.rating > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be between 1 and 5"
        )
    
    # Create feedback
    db_feedback = Feedback(
        user_id=current_user.id,
        teacher_name=feedback.teacher_name,
        subject=feedback.subject,
        rating=feedback.rating,
        comments=feedback.comments
    )
    
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    
    return db_feedback

@router.get("/", response_model=List[FeedbackResponse])
def get_user_feedback(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Students see their own feedback, teachers see feedback about them
    if current_user.role == "student":
        feedbacks = db.query(Feedback).filter(Feedback.user_id == current_user.id).all()
    else:
        feedbacks = db.query(Feedback).filter(Feedback.teacher_name == current_user.username).all()
    
    return feedbacks

@router.get("/dashboard/student", response_model=StudentDashboardData)
def get_student_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can access student dashboard"
        )
    
    # Get user's feedback
    user_feedback = db.query(Feedback).filter(Feedback.user_id == current_user.id).all()
    
    # Calculate statistics
    total_feedback = len(user_feedback)
    avg_rating = sum(f.rating for f in user_feedback) / total_feedback if total_feedback > 0 else 0
    recent_feedback = sorted(user_feedback, key=lambda x: x.created_at, reverse=True)[:5]
    
    return StudentDashboardData(
        total_feedback=total_feedback,
        recent_feedback=recent_feedback,
        avg_rating_given=avg_rating
    )

@router.get("/dashboard/teacher", response_model=TeacherDashboardData)
def get_teacher_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "teacher":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers can access teacher dashboard"
        )
    
    # Get feedback about this teacher
    teacher_feedback = db.query(Feedback).filter(Feedback.teacher_name == current_user.username).all()
    
    # Calculate statistics
    total_feedback = len(teacher_feedback)
    avg_rating = sum(f.rating for f in teacher_feedback) / total_feedback if total_feedback > 0 else 0
    
    # Group by subject
    feedback_by_subject = {}
    for feedback in teacher_feedback:
        subject = feedback.subject
        if subject not in feedback_by_subject:
            feedback_by_subject[subject] = {"count": 0, "avg_rating": 0, "total_rating": 0}
        feedback_by_subject[subject]["count"] += 1
        feedback_by_subject[subject]["total_rating"] += feedback.rating
    
    # Calculate average ratings per subject
    for subject in feedback_by_subject:
        data = feedback_by_subject[subject]
        data["avg_rating"] = data["total_rating"] / data["count"]
        del data["total_rating"]  # Remove intermediate value
    
    # Recent feedback
    recent_feedback = []
    for feedback in sorted(teacher_feedback, key=lambda x: x.created_at, reverse=True)[:5]:
        user = db.query(User).filter(User.id == feedback.user_id).first()
        recent_feedback.append({
            "id": feedback.id,
            "student_name": user.username if user else "Unknown",
            "subject": feedback.subject,
            "rating": feedback.rating,
            "comments": feedback.comments,
            "created_at": feedback.created_at
        })
    
    return TeacherDashboardData(
        total_feedback_received=total_feedback,
        avg_rating=avg_rating,
        feedback_by_subject=feedback_by_subject,
        recent_feedback=recent_feedback
    )
