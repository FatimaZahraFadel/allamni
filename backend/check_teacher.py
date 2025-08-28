#!/usr/bin/env python3
"""
Check teacher account details
"""

from app.core.database import SessionLocal
from sqlalchemy import text

def check_teacher():
    db = SessionLocal()
    
    try:
        result = db.execute(text('SELECT id, email, language_preference, subscription_status, is_active FROM users WHERE email = "ahmed.hassan@3allamni.com"'))
        teacher = result.fetchone()
        
        if teacher:
            user_id, email, lang_pref, sub_status, is_active = teacher
            print(f'Teacher Account:')
            print(f'  ID: {user_id}')
            print(f'  Email: {email}')
            print(f'  Language preference: "{lang_pref}"')
            print(f'  Subscription status: "{sub_status}"')
            print(f'  Is active: {is_active}')
        else:
            print('Teacher not found!')
            
    except Exception as e:
        print(f'Error: {e}')
    finally:
        db.close()

if __name__ == "__main__":
    check_teacher()
