from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)  # "student" or "teacher"
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    feedbacks = relationship("Feedback", back_populates="user")

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    teacher_name = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 scale
    comments = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="feedbacks")
