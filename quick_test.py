#!/usr/bin/env python3

import os
import sys
import subprocess

def quick_test():
    print("⚡ FAS-MBBS Quick Health Check")
    print("=" * 40)
    
    os.chdir("/Users/srinivasanramanujam/FAS-MBBS")
    
    # 1. Check backend dependencies
    print("1. Checking backend...")
    os.chdir("backend")
    
    try:
        # Test imports
        result = subprocess.run([
            sys.executable, "-c", 
            "from app.core.config import settings; from app.main import app; print('✅ Backend OK')"
        ], capture_output=True, text=True, timeout=10)
        
        if result.returncode == 0:
            print("   ✅ Backend imports work")
        else:
            print(f"   ❌ Backend import error: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"   ❌ Backend test failed: {e}")
        return False
    
    # 2. Check frontend
    print("2. Checking frontend...")
    os.chdir("../frontend")
    
    if os.path.exists("node_modules"):
        print("   ✅ Frontend dependencies installed")
    else:
        print("   ❌ Frontend dependencies missing - run: npm install")
        return False
    
    # 3. Check database
    print("3. Checking database...")
    os.chdir("../backend")
    
    if os.path.exists("fas_mbbs.db"):
        print("   ✅ Database file exists")
    else:
        print("   ❌ Database missing - will be created on startup")
    
    print("\n🎉 System ready!")
    print("\nTo start:")
    print("  cd /Users/srinivasanramanujam/FAS-MBBS")
    print("  ./start.sh")
    
    return True

if __name__ == "__main__":
    success = quick_test()
    sys.exit(0 if success else 1)
