#!/usr/bin/env python3
"""
Simple script to create test data using raw SQL
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.core.database import SessionLocal

def create_test_data():
    db = SessionLocal()
    
    try:
        # Check if test data already exists
        result = db.execute(text("SELECT COUNT(*) as count FROM users WHERE email = 'alice@test.com'"))
        if result.fetchone().count > 0:
            print("Test data already exists!")
            return
        
        # Insert test teacher
        db.execute(text("""
            INSERT INTO users (name, email, password_hash, role, language_preference, created_at, updated_at)
            VALUES ('Test Teacher', 'teacher@test.com', '$2b$12$LQv3c1yqBWVHxkd0LQ1Mu.6qm8kfmjH5s2SzKUKK5sK5sK5sK5sK5O', 'teacher', 'en', NOW(), NOW())
        """))

        # Insert test students
        students = [
            ('Alice Johnson', 'alice@test.com'),
            ('Bob Smith', 'bob@test.com'),
            ('Carol Davis', 'carol@test.com'),
            ('David Wilson', 'david@test.com'),
            ('Emma Brown', 'emma@test.com')
        ]

        for name, email in students:
            db.execute(text("""
                INSERT INTO users (name, email, password_hash, role, language_preference, created_at, updated_at)
                VALUES (:name, :email, '$2b$12$LQv3c1yqBWVHxkd0LQ1Mu.6qm8kfmjH5s2SzKUKK5sK5sK5sK5sK5O', 'student', 'en', NOW(), NOW())
            """), {"name": name, "email": email})
        
        # Get teacher ID
        teacher_result = db.execute(text("SELECT id FROM users WHERE email = 'teacher@test.com'"))
        teacher_id = teacher_result.fetchone().id
        
        # Insert test school
        db.execute(text("""
            INSERT INTO schools (name, description, teacher_id, created_at, updated_at)
            VALUES ('Test School', 'A test school for demonstration', :teacher_id, NOW(), NOW())
        """), {"teacher_id": teacher_id})
        
        # Get school ID
        school_result = db.execute(text("SELECT id FROM schools WHERE name = 'Test School'"))
        school_id = school_result.fetchone().id
        
        # Insert test classes
        db.execute(text("""
            INSERT INTO classes (name, description, school_id, created_at, updated_at)
            VALUES ('Mathematics 101', 'Basic mathematics class', :school_id, NOW(), NOW())
        """), {"school_id": school_id})
        
        db.execute(text("""
            INSERT INTO classes (name, description, school_id, created_at, updated_at)
            VALUES ('English Literature', 'Introduction to English literature', :school_id, NOW(), NOW())
        """), {"school_id": school_id})
        
        # Get class ID
        class_result = db.execute(text("SELECT id FROM classes WHERE name = 'Mathematics 101'"))
        class_id = class_result.fetchone().id
        
        # Get student IDs
        student_results = db.execute(text("SELECT id FROM users WHERE role = 'student' ORDER BY id LIMIT 3"))
        student_ids = [row.id for row in student_results.fetchall()]
        
        # Enroll first 2 students in the class
        for student_id in student_ids[:2]:
            db.execute(text("""
                INSERT INTO student_classes (student_id, class_id, enrolled_at)
                VALUES (:student_id, :class_id, NOW())
            """), {"student_id": student_id, "class_id": class_id})
        
        # Insert test assignment
        db.execute(text("""
            INSERT INTO assignments (title, description, assignment_type, instructions, max_points, class_id, created_by_teacher_id, created_at, updated_at)
            VALUES ('Test Assignment', 'This is a test assignment for demonstration', 'homework', 'Complete this assignment to test the system', 100, :class_id, :teacher_id, NOW(), NOW())
        """), {"class_id": class_id, "teacher_id": teacher_id})
        
        db.commit()
        
        print("✅ Test data created successfully!")
        print("\nLogin credentials (password for all: password123):")
        print("Teacher: teacher@test.com")
        print("Students: alice@test.com, bob@test.com, carol@test.com, david@test.com, emma@test.com")
        print("\nNote: Alice and Bob are enrolled in Mathematics 101 class")
        print("Carol, David, and Emma are available to be enrolled")
        
    except Exception as e:
        print(f"Error creating test data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_data()
