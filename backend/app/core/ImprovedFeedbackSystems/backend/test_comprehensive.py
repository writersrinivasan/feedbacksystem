#!/usr/bin/env python3
"""
Comprehensive Backend Test Suite for FAS-MBBS
Tests all API endpoints, business logic, and data models
"""
import pytest
import os
import sys
import asyncio
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
import tempfile
import shutil

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(backend_dir, 'app'))

# Import application modules
from main import app
from core.database import Base, get_db
from core.security import create_access_token, get_password_hash, verify_password
from models.models import User, Feedback
from schemas.schemas import UserCreate, FeedbackCreate

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_fas_mbbs.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    """Override database dependency for testing"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Create test client
client = TestClient(app)

@pytest.fixture(scope="module")
def setup_database():
    """Setup test database"""
    # Create test database tables
    Base.metadata.create_all(bind=engine)
    yield
    # Cleanup after tests
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("test_fas_mbbs.db"):
        os.remove("test_fas_mbbs.db")

@pytest.fixture
def test_db():
    """Get test database session"""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def test_user_data():
    """Test user data"""
    return {
        "username": f"testuser_{datetime.now().timestamp()}",
        "email": f"test_{datetime.now().timestamp()}@example.com",
        "password": "testpassword123",
        "role": "student"
    }

@pytest.fixture
def test_teacher_data():
    """Test teacher data"""
    return {
        "username": f"testteacher_{datetime.now().timestamp()}",
        "email": f"teacher_{datetime.now().timestamp()}@example.com",
        "password": "teacherpassword123",
        "role": "teacher"
    }

@pytest.fixture
def test_feedback_data():
    """Test feedback data"""
    return {
        "teacher_name": "Dr. Smith",
        "subject": "Anatomy",
        "rating": 4,
        "comments": "Excellent teaching methodology and clear explanations."
    }

class TestHealthChecks:
    """Test health check endpoints"""
    
    def test_root_endpoint(self, setup_database):
        """Test root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        assert "FAS-MBBS API is running" in response.json()["message"]
    
    def test_health_endpoint(self, setup_database):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

class TestAuthentication:
    """Test authentication endpoints and logic"""
    
    def test_user_registration_success(self, setup_database, test_user_data):
        """Test successful user registration"""
        response = client.post("/api/v1/auth/register", json=test_user_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["username"] == test_user_data["username"]
        assert data["email"] == test_user_data["email"]
        assert data["role"] == test_user_data["role"]
        assert "access_token" in data
        assert "password" not in data  # Password should not be returned
    
    def test_user_registration_duplicate_email(self, setup_database, test_user_data):
        """Test registration with duplicate email"""
        # Register user first time
        client.post("/api/v1/auth/register", json=test_user_data)
        
        # Try to register again with same email
        duplicate_data = test_user_data.copy()
        duplicate_data["username"] = "different_username"
        response = client.post("/api/v1/auth/register", json=duplicate_data)
        assert response.status_code == 400
        assert "already registered" in response.json()["detail"].lower()
    
    def test_user_registration_duplicate_username(self, setup_database, test_user_data):
        """Test registration with duplicate username"""
        # Register user first time
        client.post("/api/v1/auth/register", json=test_user_data)
        
        # Try to register again with same username
        duplicate_data = test_user_data.copy()
        duplicate_data["email"] = "different@example.com"
        response = client.post("/api/v1/auth/register", json=duplicate_data)
        assert response.status_code == 400
        assert "already registered" in response.json()["detail"].lower()
    
    def test_user_registration_invalid_role(self, setup_database, test_user_data):
        """Test registration with invalid role"""
        invalid_data = test_user_data.copy()
        invalid_data["role"] = "invalid_role"
        response = client.post("/api/v1/auth/register", json=invalid_data)
        assert response.status_code == 422  # Validation error
    
    def test_user_registration_invalid_email(self, setup_database, test_user_data):
        """Test registration with invalid email"""
        invalid_data = test_user_data.copy()
        invalid_data["email"] = "invalid_email"
        response = client.post("/api/v1/auth/register", json=invalid_data)
        assert response.status_code == 422  # Validation error
    
    def test_user_login_success(self, setup_database, test_user_data):
        """Test successful user login"""
        # Register user first
        client.post("/api/v1/auth/register", json=test_user_data)
        
        # Login
        login_data = {
            "username": test_user_data["username"],
            "password": test_user_data["password"]
        }
        response = client.post("/api/v1/auth/login", json=login_data)
        assert response.status_code == 200
        
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["username"] == test_user_data["username"]
    
    def test_user_login_wrong_password(self, setup_database, test_user_data):
        """Test login with wrong password"""
        # Register user first
        client.post("/api/v1/auth/register", json=test_user_data)
        
        # Login with wrong password
        login_data = {
            "username": test_user_data["username"],
            "password": "wrongpassword"
        }
        response = client.post("/api/v1/auth/login", json=login_data)
        assert response.status_code == 401
        assert "incorrect" in response.json()["detail"].lower()
    
    def test_user_login_nonexistent_user(self, setup_database):
        """Test login with nonexistent user"""
        login_data = {
            "username": "nonexistent",
            "password": "somepassword"
        }
        response = client.post("/api/v1/auth/login", json=login_data)
        assert response.status_code == 401
        assert "incorrect" in response.json()["detail"].lower()
    
    def test_get_current_user(self, setup_database, test_user_data):
        """Test getting current user info"""
        # Register and login user
        client.post("/api/v1/auth/register", json=test_user_data)
        login_response = client.post("/api/v1/auth/login", json={
            "username": test_user_data["username"],
            "password": test_user_data["password"]
        })
        token = login_response.json()["access_token"]
        
        # Get current user
        headers = {"Authorization": f"Bearer {token}"}
        response = client.get("/api/v1/auth/me", headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        assert data["username"] == test_user_data["username"]
        assert data["email"] == test_user_data["email"]
        assert data["role"] == test_user_data["role"]
    
    def test_get_current_user_invalid_token(self, setup_database):
        """Test getting current user with invalid token"""
        headers = {"Authorization": "Bearer invalid_token"}
        response = client.get("/api/v1/auth/me", headers=headers)
        assert response.status_code == 401

class TestFeedback:
    """Test feedback endpoints and logic"""
    
    def get_auth_headers(self, user_data):
        """Helper to get authentication headers"""
        # Register and login user
        client.post("/api/v1/auth/register", json=user_data)
        login_response = client.post("/api/v1/auth/login", json={
            "username": user_data["username"],
            "password": user_data["password"]
        })
        token = login_response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}
    
    def test_submit_feedback_success(self, setup_database, test_user_data, test_feedback_data):
        """Test successful feedback submission"""
        headers = self.get_auth_headers(test_user_data)
        
        response = client.post("/api/v1/feedback/", json=test_feedback_data, headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        assert data["teacher_name"] == test_feedback_data["teacher_name"]
        assert data["subject"] == test_feedback_data["subject"]
        assert data["rating"] == test_feedback_data["rating"]
        assert data["comments"] == test_feedback_data["comments"]
        assert "id" in data
        assert "created_at" in data
    
    def test_submit_feedback_unauthorized(self, setup_database, test_feedback_data):
        """Test feedback submission without authentication"""
        response = client.post("/api/v1/feedback/", json=test_feedback_data)
        assert response.status_code == 401
    
    def test_submit_feedback_invalid_rating(self, setup_database, test_user_data, test_feedback_data):
        """Test feedback submission with invalid rating"""
        headers = self.get_auth_headers(test_user_data)
        
        invalid_data = test_feedback_data.copy()
        invalid_data["rating"] = 6  # Invalid rating (should be 1-5)
        
        response = client.post("/api/v1/feedback/", json=invalid_data, headers=headers)
        assert response.status_code == 422  # Validation error
    
    def test_submit_feedback_missing_required_fields(self, setup_database, test_user_data):
        """Test feedback submission with missing required fields"""
        headers = self.get_auth_headers(test_user_data)
        
        incomplete_data = {
            "teacher_name": "Dr. Smith"
            # Missing subject and rating
        }
        
        response = client.post("/api/v1/feedback/", json=incomplete_data, headers=headers)
        assert response.status_code == 422  # Validation error
    
    def test_get_user_feedback(self, setup_database, test_user_data, test_feedback_data):
        """Test getting user's feedback list"""
        headers = self.get_auth_headers(test_user_data)
        
        # Submit feedback first
        client.post("/api/v1/feedback/", json=test_feedback_data, headers=headers)
        
        # Get feedback list
        response = client.get("/api/v1/feedback/", headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        assert data[0]["teacher_name"] == test_feedback_data["teacher_name"]
    
    def test_get_feedback_pagination(self, setup_database, test_user_data, test_feedback_data):
        """Test feedback list pagination"""
        headers = self.get_auth_headers(test_user_data)
        
        # Submit multiple feedback entries
        for i in range(5):
            feedback_data = test_feedback_data.copy()
            feedback_data["subject"] = f"Subject {i}"
            client.post("/api/v1/feedback/", json=feedback_data, headers=headers)
        
        # Test pagination
        response = client.get("/api/v1/feedback/?skip=0&limit=3", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 3
        
        # Test second page
        response = client.get("/api/v1/feedback/?skip=3&limit=3", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2

class TestDashboard:
    """Test dashboard endpoints and analytics"""
    
    def get_auth_headers(self, user_data):
        """Helper to get authentication headers"""
        client.post("/api/v1/auth/register", json=user_data)
        login_response = client.post("/api/v1/auth/login", json={
            "username": user_data["username"],
            "password": user_data["password"]
        })
        token = login_response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}
    
    def test_student_dashboard(self, setup_database, test_user_data, test_feedback_data):
        """Test student dashboard data"""
        headers = self.get_auth_headers(test_user_data)
        
        # Submit some feedback
        client.post("/api/v1/feedback/", json=test_feedback_data, headers=headers)
        
        # Get dashboard data
        response = client.get("/api/v1/feedback/dashboard/student", headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "total_feedback" in data
        assert "recent_feedback" in data
        assert data["total_feedback"] > 0
    
    def test_teacher_dashboard(self, setup_database, test_teacher_data, test_user_data, test_feedback_data):
        """Test teacher dashboard data"""
        # Create student and submit feedback
        student_headers = self.get_auth_headers(test_user_data)
        feedback_data = test_feedback_data.copy()
        feedback_data["teacher_name"] = test_teacher_data["username"]
        client.post("/api/v1/feedback/", json=feedback_data, headers=student_headers)
        
        # Get teacher dashboard
        teacher_headers = self.get_auth_headers(test_teacher_data)
        response = client.get("/api/v1/feedback/dashboard/teacher", headers=teacher_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "total_feedback_received" in data
        assert "average_rating" in data
        assert "feedback_by_subject" in data
    
    def test_dashboard_unauthorized(self, setup_database):
        """Test dashboard access without authentication"""
        response = client.get("/api/v1/feedback/dashboard/student")
        assert response.status_code == 401

class TestSecurity:
    """Test security features"""
    
    def test_password_hashing(self):
        """Test password hashing and verification"""
        password = "testpassword123"
        hashed = get_password_hash(password)
        
        # Password should be hashed
        assert hashed != password
        assert len(hashed) > 20  # bcrypt hashes are typically 60 chars
        
        # Verification should work
        assert verify_password(password, hashed) == True
        assert verify_password("wrongpassword", hashed) == False
    
    def test_jwt_token_creation(self):
        """Test JWT token creation and validation"""
        data = {"sub": "testuser"}
        token = create_access_token(data)
        
        assert isinstance(token, str)
        assert len(token) > 50  # JWT tokens are typically quite long
    
    def test_cors_headers(self, setup_database):
        """Test CORS headers are present"""
        response = client.get("/")
        # CORS headers should be present for cross-origin requests
        assert response.status_code == 200

class TestDataModels:
    """Test database models and relationships"""
    
    def test_user_model(self, test_db, test_user_data):
        """Test User model creation and attributes"""
        user = User(
            username=test_user_data["username"],
            email=test_user_data["email"],
            password_hash=get_password_hash(test_user_data["password"]),
            role=test_user_data["role"]
        )
        
        test_db.add(user)
        test_db.commit()
        test_db.refresh(user)
        
        assert user.id is not None
        assert user.username == test_user_data["username"]
        assert user.email == test_user_data["email"]
        assert user.role == test_user_data["role"]
        assert user.created_at is not None
    
    def test_feedback_model(self, test_db, test_user_data, test_feedback_data):
        """Test Feedback model creation and relationships"""
        # Create user first
        user = User(
            username=test_user_data["username"],
            email=test_user_data["email"],
            password_hash=get_password_hash(test_user_data["password"]),
            role=test_user_data["role"]
        )
        test_db.add(user)
        test_db.commit()
        test_db.refresh(user)
        
        # Create feedback
        feedback = Feedback(
            user_id=user.id,
            teacher_name=test_feedback_data["teacher_name"],
            subject=test_feedback_data["subject"],
            rating=test_feedback_data["rating"],
            comments=test_feedback_data["comments"]
        )
        
        test_db.add(feedback)
        test_db.commit()
        test_db.refresh(feedback)
        
        assert feedback.id is not None
        assert feedback.user_id == user.id
        assert feedback.teacher_name == test_feedback_data["teacher_name"]
        assert feedback.subject == test_feedback_data["subject"]
        assert feedback.rating == test_feedback_data["rating"]
        assert feedback.comments == test_feedback_data["comments"]
        assert feedback.created_at is not None
        
        # Test relationship
        assert feedback.user.username == user.username

class TestPerformance:
    """Test performance and load handling"""
    
    def test_concurrent_registrations(self, setup_database):
        """Test handling concurrent user registrations"""
        import threading
        import time
        
        results = []
        
        def register_user(index):
            user_data = {
                "username": f"concurrent_user_{index}_{time.time()}",
                "email": f"concurrent_{index}_{time.time()}@example.com",
                "password": "testpassword123",
                "role": "student"
            }
            response = client.post("/api/v1/auth/register", json=user_data)
            results.append(response.status_code)
        
        # Create 10 concurrent registration threads
        threads = []
        for i in range(10):
            thread = threading.Thread(target=register_user, args=(i,))
            threads.append(thread)
            thread.start()
        
        # Wait for all threads to complete
        for thread in threads:
            thread.join()
        
        # All registrations should succeed
        assert all(status == 200 for status in results)
    
    def test_bulk_feedback_submission(self, setup_database, test_user_data):
        """Test submitting multiple feedback entries"""
        # Register and login
        client.post("/api/v1/auth/register", json=test_user_data)
        login_response = client.post("/api/v1/auth/login", json={
            "username": test_user_data["username"],
            "password": test_user_data["password"]
        })
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Submit 50 feedback entries
        for i in range(50):
            feedback_data = {
                "teacher_name": f"Dr. Teacher_{i}",
                "subject": f"Subject_{i}",
                "rating": (i % 5) + 1,  # Ratings 1-5
                "comments": f"Test feedback {i}"
            }
            response = client.post("/api/v1/feedback/", json=feedback_data, headers=headers)
            assert response.status_code == 200
        
        # Verify all feedback was stored
        response = client.get("/api/v1/feedback/?limit=100", headers=headers)
        assert response.status_code == 200
        assert len(response.json()) == 50

if __name__ == "__main__":
    # Run tests with pytest
    pytest.main([__file__, "-v", "--tb=short", "--cov=app", "--cov-report=html", "--cov-report=term"])
