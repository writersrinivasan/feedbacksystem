#!/usr/bin/env python3
"""
Test script to verify backend functionality
"""
import os
import sys
import requests
import json
from datetime import datetime

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test health check endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✓ Health check passed")
            return True
        else:
            print(f"✗ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Health check failed: {e}")
        return False

def test_user_registration():
    """Test user registration"""
    try:
        # Test student registration
        student_data = {
            "username": f"student_test_{datetime.now().timestamp()}",
            "email": f"student_test_{datetime.now().timestamp()}@example.com",
            "password": "testpassword123",
            "role": "student"
        }
        
        response = requests.post(f"{BASE_URL}/api/v1/auth/register", json=student_data)
        if response.status_code == 200:
            print("✓ Student registration passed")
            return student_data
        else:
            print(f"✗ Student registration failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"✗ Student registration failed: {e}")
        return None

def test_user_login(user_data):
    """Test user login"""
    if not user_data:
        return None
    
    try:
        login_data = {
            "username": user_data["username"],
            "password": user_data["password"]
        }
        
        response = requests.post(f"{BASE_URL}/api/v1/auth/login", json=login_data)
        if response.status_code == 200:
            token_data = response.json()
            print("✓ User login passed")
            return token_data["access_token"]
        else:
            print(f"✗ User login failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"✗ User login failed: {e}")
        return None

def test_feedback_submission(token):
    """Test feedback submission"""
    if not token:
        return False
    
    try:
        feedback_data = {
            "teacher_name": "Dr. Smith",
            "subject": "Anatomy",
            "rating": 4,
            "comments": "Great teaching style!"
        }
        
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.post(f"{BASE_URL}/api/v1/feedback/", json=feedback_data, headers=headers)
        
        if response.status_code == 200:
            print("✓ Feedback submission passed")
            return True
        else:
            print(f"✗ Feedback submission failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"✗ Feedback submission failed: {e}")
        return False

def test_dashboard_access(token):
    """Test dashboard access"""
    if not token:
        return False
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/v1/feedback/dashboard/student", headers=headers)
        
        if response.status_code == 200:
            print("✓ Dashboard access passed")
            return True
        else:
            print(f"✗ Dashboard access failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"✗ Dashboard access failed: {e}")
        return False

def main():
    """Run all tests"""
    print("Starting FAS-MBBS Backend Tests...")
    print("=" * 50)
    
    # Test health check
    if not test_health_check():
        print("Backend server is not running. Please start it first.")
        sys.exit(1)
    
    # Test user registration
    user_data = test_user_registration()
    
    # Test user login
    token = test_user_login(user_data)
    
    # Test feedback submission
    test_feedback_submission(token)
    
    # Test dashboard access
    test_dashboard_access(token)
    
    print("=" * 50)
    print("Backend tests completed!")

if __name__ == "__main__":
    main()
