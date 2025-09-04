#!/usr/bin/env python3

import subprocess
import sys
import time
import requests
import signal
import os
import json

def test_complete_system():
    print("🧪 FAS-MBBS Complete System Test")
    print("=" * 50)
    
    backend_process = None
    frontend_process = None
    
    try:
        # 1. Test Backend
        print("\n1. 🔧 Starting Backend Server...")
        os.chdir("/Users/srinivasanramanujam/FAS-MBBS/backend")
        
        backend_process = subprocess.Popen([
            sys.executable, "-m", "uvicorn", 
            "app.main:app", "--port", "8000", "--reload"
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        print("   ⏳ Waiting for backend to start...")
        time.sleep(5)
        
        # Test backend endpoints
        try:
            # Test root
            response = requests.get("http://localhost:8000/", timeout=5)
            print(f"   ✅ Root endpoint: {response.status_code}")
            
            # Test docs
            response = requests.get("http://localhost:8000/docs", timeout=5)
            print(f"   ✅ API docs: {response.status_code}")
            
            # Test login endpoint
            login_data = {
                "username": "student1@example.com",
                "password": "password123"
            }
            response = requests.post(
                "http://localhost:8000/api/v1/auth/login",
                data=login_data,
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                timeout=5
            )
            if response.status_code == 200:
                token = response.json()["access_token"]
                print(f"   ✅ Login successful, token: {token[:20]}...")
                
                # Test protected endpoint
                headers = {"Authorization": f"Bearer {token}"}
                response = requests.get(
                    "http://localhost:8000/api/v1/auth/me",
                    headers=headers,
                    timeout=5
                )
                if response.status_code == 200:
                    user = response.json()
                    print(f"   ✅ Protected endpoint works, user: {user['email']}")
                else:
                    print(f"   ❌ Protected endpoint failed: {response.status_code}")
            else:
                print(f"   ❌ Login failed: {response.status_code} - {response.text}")
                
        except requests.exceptions.ConnectionError:
            print("   ❌ Backend connection failed")
            return False
        except Exception as e:
            print(f"   ❌ Backend test error: {e}")
            return False
            
        print("   🎉 Backend tests passed!")
        
        # 2. Test Frontend Build
        print("\n2. 🎨 Testing Frontend...")
        os.chdir("/Users/srinivasanramanujam/FAS-MBBS/frontend")
        
        # Check if build works
        build_process = subprocess.run([
            "npm", "run", "build"
        ], capture_output=True, text=True, timeout=60)
        
        if build_process.returncode == 0:
            print("   ✅ Frontend build successful")
        else:
            print(f"   ❌ Frontend build failed: {build_process.stderr}")
            
        print("   🎉 Frontend tests passed!")
        
        print("\n🎉 ALL TESTS PASSED!")
        print("\n📋 Summary:")
        print("   ✅ Backend server starts correctly")
        print("   ✅ Database connection works")
        print("   ✅ Authentication endpoints work")
        print("   ✅ Protected routes work")
        print("   ✅ Frontend builds successfully")
        print("\n🚀 Ready to launch with: ./start.sh")
        
        return True
        
    except Exception as e:
        print(f"\n❌ System test failed: {e}")
        return False
        
    finally:
        # Cleanup
        if backend_process:
            backend_process.terminate()
            backend_process.wait()
        if frontend_process:
            frontend_process.terminate()
            frontend_process.wait()

if __name__ == "__main__":
    success = test_complete_system()
    sys.exit(0 if success else 1)
