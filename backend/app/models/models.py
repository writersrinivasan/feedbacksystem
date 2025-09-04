from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Boolean, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    user_type = Column(String)  # student, teacher, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    teacher_id = Column(Integer, ForeignKey("users.id"))
    subject = Column(String)
    lecture_topic = Column(String)
    lecture_date = Column(DateTime)
    content_rating = Column(Integer)  # 1-5
    delivery_rating = Column(Integer)  # 1-5
    engagement_rating = Column(Integer)  # 1-5
    comments = Column(Text)
    is_anonymous = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    student = relationship("User", foreign_keys=[student_id])
    teacher = relationship("User", foreign_keys=[teacher_id])

class AIAnalysis(Base):
    __tablename__ = "ai_analyses"

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey("users.id"))
    analysis_date = Column(DateTime)
    sentiment_score = Column(Float)
    strengths = Column(Text)
    areas_for_improvement = Column(Text)
    suggestions = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    teacher = relationship("User")
