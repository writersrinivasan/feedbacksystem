#!/usr/bin/env python3

import sys
import os
import traceback

print("🔍 Testing FAS-MBBS Backend Components...")
print("=" * 50)

try:
    print("1. Testing basic imports...")
    from app.core.config import settings
    print("   ✅ Config imported")
    
    from app.core.database import engine, Base, SessionLocal
    print("   ✅ Database imported")
    
    from app.models.models import User, Feedback
    print("   ✅ Models imported")
    
    from app.core.security import get_password_hash
    print("   ✅ Security imported")
    
    print("\n2. Testing database creation...")
    Base.metadata.create_all(bind=engine)
    print("   ✅ Tables created")
    
    print("\n3. Testing database connection...")
    db = SessionLocal()
    user_count = db.query(User).count()
    print(f"   ✅ Database connected, {user_count} users found")
    
    if user_count == 0:
        print("\n4. Adding test user...")
        test_user = User(
            email="test@example.com",
            full_name="Test User",
            hashed_password=get_password_hash("test123"),
            user_type="student"
        )
        db.add(test_user)
        db.commit()
        print("   ✅ Test user added")
    
    db.close()
    
    print("\n5. Testing FastAPI app...")
    from app.main import app
    print("   ✅ FastAPI app imported")
    
    print("\n🎉 All tests passed!")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    print(f"\nTraceback:\n{traceback.format_exc()}")
    sys.exit(1)
