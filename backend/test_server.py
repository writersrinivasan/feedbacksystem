#!/usr/bin/env python3

import subprocess
import sys
import time
import requests
import signal
import os

def test_server():
    print("🚀 Testing FastAPI Server...")
    
    # Start server in background
    process = subprocess.Popen([
        sys.executable, "-m", "uvicorn", 
        "app.main:app", "--port", "8001"
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    try:
        # Wait for server to start
        print("⏳ Waiting for server to start...")
        time.sleep(3)
        
        # Test root endpoint
        response = requests.get("http://localhost:8001/", timeout=5)
        if response.status_code == 200:
            print("   ✅ Root endpoint working")
        else:
            print(f"   ❌ Root endpoint failed: {response.status_code}")
            
        # Test docs endpoint
        response = requests.get("http://localhost:8001/docs", timeout=5)
        if response.status_code == 200:
            print("   ✅ API docs endpoint working")
        else:
            print(f"   ❌ API docs failed: {response.status_code}")
            
        print("🎉 Server test passed!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server")
        return False
    except requests.exceptions.Timeout:
        print("❌ Server timeout")
        return False
    except Exception as e:
        print(f"❌ Server test failed: {e}")
        return False
    finally:
        # Kill the server
        process.terminate()
        process.wait()
        
    return True

if __name__ == "__main__":
    success = test_server()
    sys.exit(0 if success else 1)
