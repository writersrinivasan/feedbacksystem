import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine, SessionLocal, Base
from app.models.models import User, Feedback
from app.core.security import get_password_hash
from sqlalchemy.orm import Session
from datetime import datetime

def init_db():
    """Initialize database with tables and sample data"""
    print("🔧 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if data already exists
        if db.query(User).first():
            print("✅ Database already initialized")
            return
        
        print("📊 Adding sample data...")
        
        # Create sample users
        users = [
            User(
                email="student1@example.com",
                full_name="John Doe",
                hashed_password=get_password_hash("password123"),
                user_type="student"
            ),
            User(
                email="teacher1@example.com", 
                full_name="Dr. Smith",
                hashed_password=get_password_hash("password123"),
                user_type="teacher"
            ),
            User(
                email="admin@example.com",
                full_name="Admin User", 
                hashed_password=get_password_hash("admin123"),
                user_type="admin"
            )
        ]
        
        db.add_all(users)
        db.commit()
        
        # Get user IDs
        student = db.query(User).filter(User.email == "student1@example.com").first()
        teacher = db.query(User).filter(User.email == "teacher1@example.com").first()
        
        # Create sample feedback
        feedback = Feedback(
            student_id=student.id,
            teacher_id=teacher.id,
            subject="Anatomy",
            lecture_topic="Human Heart Structure",
            lecture_date=datetime.now(),
            content_rating=5,
            delivery_rating=4,
            engagement_rating=5,
            comments="Excellent lecture! Very clear explanations and good use of visual aids.",
            is_anonymous=False
        )
        
        db.add(feedback)
        db.commit()
        
        print("✅ Database initialized successfully!")
        print("\n👤 Test Accounts:")
        print("   Student: student1@example.com / password123")
        print("   Teacher: teacher1@example.com / password123")  
        print("   Admin: admin@example.com / admin123")
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
