#!/usr/bin/env python3
"""
Check teacher accounts in database
"""

from app.core.database import SessionLocal
from sqlalchemy import text

def check_teachers():
    db = SessionLocal()
    
    try:
        result = db.execute(text('SELECT email, role FROM users WHERE role = "teacher"'))
        teachers = result.fetchall()
        
        print('Teachers in database:')
        for teacher in teachers:
            email, role = teacher
            print(f'  Email: {email}, Role: {role}')
            
        if not teachers:
            print('No teachers found in database!')
            
    except Exception as e:
        print(f'Error: {e}')
    finally:
        db.close()

if __name__ == "__main__":
    check_teachers()
