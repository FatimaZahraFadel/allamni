#!/usr/bin/env python3
"""
Check teacher password and authentication
"""

from app.core.database import SessionLocal
from app.core.security import verify_password
from sqlalchemy import text

def check_teacher_password():
    db = SessionLocal()
    
    try:
        # Get teacher details
        result = db.execute(text('SELECT email, password_hash, role, is_active FROM users WHERE email = "ahmed.hassan@3allamni.com"'))
        teacher = result.fetchone()
        
        if teacher:
            email, password_hash, role, is_active = teacher
            print(f'Teacher found:')
            print(f'  Email: {email}')
            print(f'  Role: {role}')
            print(f'  Is Active: {is_active}')
            print(f'  Password Hash: {password_hash[:50]}...')
            
            # Test password verification
            test_password = "teacher123"
            is_valid = verify_password(test_password, password_hash)
            print(f'  Password "{test_password}" is valid: {is_valid}')
            
            if not is_valid:
                print('\n🔧 Testing other possible passwords...')
                for pwd in ["Teacher123", "password", "123456", "admin"]:
                    if verify_password(pwd, password_hash):
                        print(f'  ✅ Password "{pwd}" works!')
                        break
                else:
                    print('  ❌ None of the test passwords work')
                    
        else:
            print('Teacher not found!')
            
    except Exception as e:
        print(f'Error: {e}')
    finally:
        db.close()

if __name__ == "__main__":
    check_teacher_password()
