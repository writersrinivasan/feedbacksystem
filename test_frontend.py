#!/usr/bin/env python3

import subprocess
import os
import time

def test_frontend():
    print("🎨 Testing Frontend...")
    
    os.chdir("/Users/srinivasanramanujam/FAS-MBBS/frontend")
    
    # Test build
    print("Building frontend...")
    try:
        result = subprocess.run([
            "npm", "run", "build"
        ], capture_output=True, text=True, timeout=120)
        
        if result.returncode == 0:
            print("✅ Frontend build successful!")
            return True
        else:
            print(f"❌ Frontend build failed:")
            print(result.stderr)
            return False
            
    except subprocess.TimeoutExpired:
        print("❌ Frontend build timed out")
        return False
    except Exception as e:
        print(f"❌ Frontend test error: {e}")
        return False

if __name__ == "__main__":
    success = test_frontend()
    exit(0 if success else 1)
