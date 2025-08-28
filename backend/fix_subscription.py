#!/usr/bin/env python3
"""
Fix subscription status case
"""

from app.core.database import SessionLocal
from sqlalchemy import text

def fix_subscription():
    db = SessionLocal()
    
    try:
        # Update teacher subscription status to lowercase
        db.execute(text('UPDATE users SET subscription_status = "active" WHERE email = "ahmed.hassan@3allamni.com"'))
        db.commit()
        print('✅ Updated teacher subscription status to lowercase')
        
        # Verify the change
        result = db.execute(text('SELECT email, subscription_status FROM users WHERE email = "ahmed.hassan@3allamni.com"'))
        teacher = result.fetchone()
        if teacher:
            email, sub_status = teacher
            print(f'Teacher {email} subscription status: "{sub_status}"')
            
    except Exception as e:
        print(f'Error: {e}')
    finally:
        db.close()

if __name__ == "__main__":
    fix_subscription()
