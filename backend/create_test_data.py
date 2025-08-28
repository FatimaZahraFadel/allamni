#!/usr/bin/env python3
"""
Script to create test data for the education platform
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.security import get_password_hash

# Import all models to ensure they're registered
from app.models import user, school, class_model, assignment, submission
from app.models.user import User
from app.models.school import School
from app.models.class_model import Class, StudentClass
from app.models.assignment import Assignment

def create_test_data():
    db = SessionLocal()
    
    try:
        # Check if test data already exists
        existing_teacher = db.query(User).filter(User.email == "teacher@test.com").first()
        if existing_teacher:
            print("Test data already exists!")
            return
        
        # Create test teacher
        teacher = User(
            name="Test Teacher",
            email="teacher@test.com",
            hashed_password=get_password_hash("password123"),
            role="teacher",
            language_preference="en"
        )
        db.add(teacher)
        db.commit()
        db.refresh(teacher)
        print(f"Created teacher: {teacher.name} (ID: {teacher.id})")
        
        # Create test students
        students = []
        for i in range(5):
            student = User(
                name=f"Student {i+1}",
                email=f"student{i+1}@test.com",
                hashed_password=get_password_hash("password123"),
                role="student",
                language_preference="en"
            )
            db.add(student)
            students.append(student)
        
        db.commit()
        for student in students:
            db.refresh(student)
            print(f"Created student: {student.name} (ID: {student.id})")
        
        # Create test school
        school = School(
            name="Test School",
            address="123 Test Street",
            teacher_id=teacher.id
        )
        db.add(school)
        db.commit()
        db.refresh(school)
        print(f"Created school: {school.name} (ID: {school.id})")
        
        # Create test class
        test_class = Class(
            name="Test Class",
            description="A test class for demonstration",
            school_id=school.id
        )
        db.add(test_class)
        db.commit()
        db.refresh(test_class)
        print(f"Created class: {test_class.name} (ID: {test_class.id})")
        
        # Enroll first 2 students in the class
        for i in range(2):
            enrollment = StudentClass(
                student_id=students[i].id,
                class_id=test_class.id
            )
            db.add(enrollment)
        
        db.commit()
        print(f"Enrolled 2 students in the class")
        
        # Create test assignment
        assignment = Assignment(
            title="Test Assignment",
            description="This is a test assignment",
            assignment_type="homework",
            instructions="Complete this assignment for testing",
            max_points=100,
            class_id=test_class.id
        )
        db.add(assignment)
        db.commit()
        db.refresh(assignment)
        print(f"Created assignment: {assignment.title} (ID: {assignment.id})")
        
        print("\n✅ Test data created successfully!")
        print("\nLogin credentials:")
        print("Teacher: teacher@test.com / password123")
        print("Students: student1@test.com to student5@test.com / password123")
        
    except Exception as e:
        print(f"Error creating test data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_data()
