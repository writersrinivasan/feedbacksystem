#!/usr/bin/env python3
"""
Simple test script to verify backend functionality
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test if backend is running"""
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("✅ Backend is running")
            return True
        else:
            print(f"❌ Backend returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to backend: {e}")
        return False

def test_login():
    """Test user login"""
    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            data={
                "username": "student1@example.com",
                "password": "password123"
            }
        )
        if response.status_code == 200:
            data = response.json()
            print("✅ Login successful")
            return data.get("access_token")
        else:
            print(f"❌ Login failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def test_register():
    """Test user registration"""
    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/register",
            json={
                "email": "test@example.com",
                "password": "test123",
                "full_name": "Test User",
                "user_type": "student"
            }
        )
        if response.status_code == 200:
            print("✅ Registration successful")
            return True
        else:
            print(f"❌ Registration failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return False

def test_get_user(token):
    """Test getting current user info"""
    try:
        response = requests.get(
            f"{BASE_URL}/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        if response.status_code == 200:
            data = response.json()
            print(f"✅ User info retrieved: {data.get('full_name')}")
            return True
        else:
            print(f"❌ Get user failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Get user error: {e}")
        return False

def main():
    print("🧪 Testing FAS-MBBS Backend...")
    print()

    # Test health
    if not test_health():
        print("❌ Backend is not running. Please start it first.")
        return

    # Test registration
    test_register()

    # Test login
    token = test_login()
    if token:
        # Test get user
        test_get_user(token)

    print()
    print("🎉 Backend tests completed!")

if __name__ == "__main__":
    main()
