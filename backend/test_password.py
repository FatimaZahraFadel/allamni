#!/usr/bin/env python3
"""
Test password verification and login functionality
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.core.database import SessionLocal
from app.core.security import verify_password, get_password_hash
from app.services.auth_service import AuthService
from app.schemas.auth import UserLogin

def test_comprehensive():
    db = SessionLocal()

    try:
        print("🔍 Testing comprehensive login functionality...")

        # 1. Check if user exists
        result = db.execute(text("SELECT id, email, password_hash, language_preference, is_active FROM users WHERE email = 'ahmed.hassan@3allamni.com'"))
        user_data = result.fetchone()

        if user_data:
            user_id, email, password_hash, lang_pref, is_active = user_data
            print(f"✅ User found:")
            print(f"   ID: {user_id}")
            print(f"   Email: {email}")
            print(f"   Password hash: {password_hash}")
            print(f"   Language preference: '{lang_pref}'")
            print(f"   Is active: {is_active}")

            # 2. Test password verification directly
            test_password = "password123"
            is_valid = verify_password(test_password, password_hash)
            print(f"🔑 Password verification: {is_valid}")

            # 3. Test creating a new hash and comparing
            new_hash = get_password_hash(test_password)
            new_is_valid = verify_password(test_password, new_hash)
            print(f"🔑 New hash verification: {new_is_valid}")

            # 4. Test AuthService.authenticate_user
            try:
                login_data = UserLogin(email=email, password=test_password)
                user = AuthService.authenticate_user(db, login_data)
                print(f"✅ AuthService authentication successful: {user.email}")
            except Exception as auth_error:
                print(f"❌ AuthService authentication failed: {auth_error}")

        else:
            print("❌ User not found!")

        # 5. Test with a student account too
        print("\n🔍 Testing student account...")
        result = db.execute(text("SELECT id, email, password_hash, language_preference, is_active FROM users WHERE email = 'alice.johnson@student.com'"))
        student_data = result.fetchone()

        if student_data:
            user_id, email, password_hash, lang_pref, is_active = student_data
            print(f"✅ Student found:")
            print(f"   ID: {user_id}")
            print(f"   Email: {email}")
            print(f"   Language preference: '{lang_pref}'")
            print(f"   Is active: {is_active}")

            # Test student password
            is_valid = verify_password("password123", password_hash)
            print(f"🔑 Student password verification: {is_valid}")

            # Test AuthService with student
            try:
                login_data = UserLogin(email=email, password="password123")
                user = AuthService.authenticate_user(db, login_data)
                print(f"✅ Student AuthService authentication successful: {user.email}")
            except Exception as auth_error:
                print(f"❌ Student AuthService authentication failed: {auth_error}")
        else:
            print("❌ Student not found!")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_comprehensive()
