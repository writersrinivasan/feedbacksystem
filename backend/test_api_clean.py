#!/usr/bin/env python3
"""
Simple API Test Suite for FAS-MBBS Backend
Tests the main API endpoints and functionality
"""

import sys
import os
import pytest
from fastapi.testclient import TestClient
import random
import string

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

try:
    from app.main import app
    from app.core.database import Base, engine, get_db
    from app.models.models import User, Feedback
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    import tempfile
    import os
    
    # Create test database
    SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
    test_engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    
    # Override dependency
    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    
    # Create tables
    Base.metadata.drop_all(bind=test_engine)  # Drop first to ensure clean state
    Base.metadata.create_all(bind=test_engine)
    
    # Create test client
    client = TestClient(app)
    
    def generate_unique_email():
        """Generate a unique email for testing"""
        random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
        return f"test{random_str}@example.com"
    
    class TestAPI:
        """Test the main API endpoints"""
        
        def test_health_check(self):
            """Test the health check endpoint"""
            response = client.get("/")
            assert response.status_code == 200
            assert "FAS-MBBS" in response.json()["message"]
        
        def test_register_user(self):
            """Test user registration"""
            user_data = {
                "full_name": "Test User",
                "email": generate_unique_email(), 
                "password": "testpass123",
                "user_type": "student"
            }
            response = client.post("/api/v1/auth/register", json=user_data)
            assert response.status_code == 200
            assert response.json()["full_name"] == "Test User"
        
        def test_login_user(self):
            """Test user login"""
            # First register a user
            email = generate_unique_email()
            user_data = {
                "full_name": "Login User",
                "email": email,
                "password": "testpass123", 
                "user_type": "student"
            }
            client.post("/api/v1/auth/register", json=user_data)
            
            # Then login
            login_data = {
                "username": email,  # Login uses email as username
                "password": "testpass123"
            }
            response = client.post("/api/v1/auth/login", data=login_data)
            assert response.status_code == 200
            assert "access_token" in response.json()
        
        def test_submit_feedback(self):
            """Test feedback submission"""
            # Register and login a student first
            student_email = generate_unique_email()
            student_data = {
                "full_name": "Feedback Student",
                "email": student_email,
                "password": "testpass123",
                "user_type": "student"
            }
            client.post("/api/v1/auth/register", json=student_data)
            
            # Register a teacher
            teacher_email = generate_unique_email()
            teacher_data = {
                "full_name": "Dr. Smith",
                "email": teacher_email, 
                "password": "testpass123",
                "user_type": "teacher"
            }
            teacher_response = client.post("/api/v1/auth/register", json=teacher_data)
            teacher_id = teacher_response.json()["id"]
            
            # Login as student
            login_data = {
                "username": student_email,
                "password": "testpass123"
            }
            login_response = client.post("/api/v1/auth/login", data=login_data)
            token = login_response.json()["access_token"]
            
            # Submit feedback
            feedback_data = {
                "teacher_id": teacher_id,
                "subject": "Biology",
                "lecture_topic": "Cell Biology",
                "content_rating": 4,
                "delivery_rating": 5,
                "engagement_rating": 4,
                "comments": "Great teacher!",
                "is_anonymous": False
            }
            headers = {"Authorization": f"Bearer {token}"}
            response = client.post("/api/v1/feedback/", json=feedback_data, headers=headers)
            assert response.status_code == 200
            assert response.json()["subject"] == "Biology"
        
        def test_get_feedback(self):
            """Test getting user feedback"""
            # Register and login a student first
            student_email = generate_unique_email()
            student_data = {
                "full_name": "Get Feedback Student",
                "email": student_email,
                "password": "testpass123",
                "user_type": "student"
            }
            client.post("/api/v1/auth/register", json=student_data)
            
            # Register a teacher
            teacher_email = generate_unique_email()
            teacher_data = {
                "full_name": "Dr. Johnson",
                "email": teacher_email,
                "password": "testpass123",
                "user_type": "teacher"
            }
            teacher_response = client.post("/api/v1/auth/register", json=teacher_data)
            teacher_id = teacher_response.json()["id"]
            
            # Login as student
            login_data = {
                "username": student_email, 
                "password": "testpass123"
            }
            login_response = client.post("/api/v1/auth/login", data=login_data)
            token = login_response.json()["access_token"]
            
            # Submit some feedback first
            feedback_data = {
                "teacher_id": teacher_id,
                "subject": "Chemistry",
                "lecture_topic": "Organic Chemistry",
                "content_rating": 5,
                "delivery_rating": 4,
                "engagement_rating": 5,
                "comments": "Excellent teaching!",
                "is_anonymous": False
            }
            headers = {"Authorization": f"Bearer {token}"}
            client.post("/api/v1/feedback/", json=feedback_data, headers=headers)
            
            # Get feedback
            response = client.get("/api/v1/feedback/", headers=headers)
            assert response.status_code == 200
            assert len(response.json()) > 0
            assert response.json()[0]["subject"] == "Chemistry"
        
        def test_student_dashboard(self):
            """Test student dashboard endpoint (placeholder for now)"""
            # Register and login first
            email = generate_unique_email()
            user_data = {
                "full_name": "Dashboard Student",
                "email": email,
                "password": "testpass123", 
                "user_type": "student"
            }
            client.post("/api/v1/auth/register", json=user_data)
            
            login_data = {
                "username": email,
                "password": "testpass123"
            }
            login_response = client.post("/api/v1/auth/login", data=login_data)
            token = login_response.json()["access_token"]
            
            headers = {"Authorization": f"Bearer {token}"}
            # For now, just test that the user can authenticate
            response = client.get("/api/v1/auth/me", headers=headers)
            assert response.status_code == 200
            assert response.json()["user_type"] == "student"
        
        def test_teacher_dashboard(self):
            """Test teacher dashboard endpoint (placeholder for now)"""
            # Register and login as teacher
            email = generate_unique_email()
            user_data = {
                "full_name": "Dashboard Teacher",
                "email": email, 
                "password": "testpass123",
                "user_type": "teacher"
            }
            client.post("/api/v1/auth/register", json=user_data)
            
            login_data = {
                "username": email,
                "password": "testpass123"
            }
            login_response = client.post("/api/v1/auth/login", data=login_data)
            token = login_response.json()["access_token"]
            
            headers = {"Authorization": f"Bearer {token}"}
            # For now, just test that the user can authenticate
            response = client.get("/api/v1/auth/me", headers=headers)
            assert response.status_code == 200
            assert response.json()["user_type"] == "teacher"
    
    def cleanup():
        """Clean up test database"""
        try:
            os.unlink("test.db")
        except:
            pass
    
    if __name__ == "__main__":
        print("🧪 Running FAS-MBBS Backend API Tests...")
        pytest.main([__file__, "-v"])
        cleanup()

except Exception as e:
    print(f"❌ Error setting up tests: {str(e)}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
