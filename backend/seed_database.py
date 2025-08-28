#!/usr/bin/env python3
"""
Comprehensive Database Seeding Script
Creates a full educational platform with teachers, students, schools, classes, assignments, and submissions
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.core.database import SessionLocal
from app.core.security import get_password_hash
from datetime import datetime, timedelta
import random

def seed_database():
    db = SessionLocal()
    
    try:
        print("🌱 Starting comprehensive database seeding...")
        
        # Clear existing data
        print("🧹 Cleaning existing data...")
        db.execute(text("SET FOREIGN_KEY_CHECKS = 0"))
        db.execute(text("DELETE FROM submissions"))
        db.execute(text("DELETE FROM assignments"))
        db.execute(text("DELETE FROM student_classes"))
        db.execute(text("DELETE FROM classes"))
        db.execute(text("DELETE FROM schools"))
        db.execute(text("DELETE FROM users"))
        db.execute(text("SET FOREIGN_KEY_CHECKS = 1"))
        db.commit()
        
        # Create main teacher
        print("👨‍🏫 Creating main teacher...")
        teacher_password_hash = get_password_hash("password123")
        print(f"Teacher password hash: {teacher_password_hash}")
        db.execute(text("""
            INSERT INTO users (name, email, password_hash, role, language_preference, is_active, subscription_status, created_at, updated_at)
            VALUES ('Dr. Ahmed Hassan', 'ahmed.hassan@3allamni.com', :password_hash, 'teacher', 'ENGLISH', 1, 'active', NOW(), NOW())
        """), {"password_hash": teacher_password_hash})
        
        # Create 10 students
        print("👨‍🎓 Creating 10 students...")
        students = [
            ('Alice Johnson', 'alice.johnson@student.com'),
            ('Bob Smith', 'bob.smith@student.com'),
            ('Carol Davis', 'carol.davis@student.com'),
            ('David Wilson', 'david.wilson@student.com'),
            ('Emma Brown', 'emma.brown@student.com'),
            ('Frank Miller', 'frank.miller@student.com'),
            ('Grace Lee', 'grace.lee@student.com'),
            ('Henry Taylor', 'henry.taylor@student.com'),
            ('Ivy Chen', 'ivy.chen@student.com'),
            ('Jack Anderson', 'jack.anderson@student.com')
        ]
        
        student_password_hash = get_password_hash("password123")
        print(f"Student password hash: {student_password_hash}")
        for name, email in students:
            print(f"Creating student: {name} ({email})")
            db.execute(text("""
                INSERT INTO users (name, email, password_hash, role, language_preference, is_active, subscription_status, created_at, updated_at)
                VALUES (:name, :email, :password_hash, 'student', 'ENGLISH', 1, 'active', NOW(), NOW())
            """), {"name": name, "email": email, "password_hash": student_password_hash})
        
        db.commit()
        
        # Get teacher ID
        teacher_result = db.execute(text("SELECT id FROM users WHERE email = 'ahmed.hassan@3allamni.com'"))
        teacher_id = teacher_result.fetchone().id
        
        # Create 2 schools
        print("🏫 Creating schools...")
        schools = [
            ('Al-Alamni International School', 'Premier educational institution focusing on innovative learning'),
            ('Future Leaders Academy', 'Preparing students for tomorrow\'s challenges with modern education')
        ]
        
        for school_name, description in schools:
            db.execute(text("""
                INSERT INTO schools (name, description, teacher_id, created_at, updated_at)
                VALUES (:name, :description, :teacher_id, NOW(), NOW())
            """), {"name": school_name, "description": description, "teacher_id": teacher_id})
        
        db.commit()
        
        # Get school IDs
        school_results = db.execute(text("SELECT id, name FROM schools ORDER BY id"))
        schools_data = school_results.fetchall()
        school1_id, school2_id = schools_data[0].id, schools_data[1].id
        
        # Create classes
        print("📚 Creating classes...")
        classes_data = [
            # School 1 - 2 classes
            (school1_id, 'Advanced Mathematics', 'Advanced mathematical concepts and problem solving'),
            (school1_id, 'English Literature', 'Exploring classic and contemporary literature'),
            # School 2 - 1 class  
            (school2_id, 'Science Exploration', 'Hands-on science experiments and discoveries')
        ]
        
        for school_id, class_name, description in classes_data:
            db.execute(text("""
                INSERT INTO classes (name, description, school_id, created_at, updated_at)
                VALUES (:name, :description, :school_id, NOW(), NOW())
            """), {"name": class_name, "description": description, "school_id": school_id})
        
        db.commit()
        
        # Get class IDs
        class_results = db.execute(text("SELECT id, name FROM classes ORDER BY id"))
        classes_list = class_results.fetchall()
        
        # Get student IDs
        student_results = db.execute(text("SELECT id, name FROM users WHERE role = 'student' ORDER BY id"))
        students_list = student_results.fetchall()
        
        # Enroll students in classes
        print("📝 Enrolling students in classes...")
        # School 1, Class 1 (Advanced Mathematics) - 3 students
        for i in range(3):
            db.execute(text("""
                INSERT INTO student_classes (student_id, class_id, enrolled_at)
                VALUES (:student_id, :class_id, NOW())
            """), {"student_id": students_list[i].id, "class_id": classes_list[0].id})
        
        # School 1, Class 2 (English Literature) - 3 students  
        for i in range(3, 6):
            db.execute(text("""
                INSERT INTO student_classes (student_id, class_id, enrolled_at)
                VALUES (:student_id, :class_id, NOW())
            """), {"student_id": students_list[i].id, "class_id": classes_list[1].id})
        
        # School 2, Class 1 (Science Exploration) - 4 students
        for i in range(6, 10):
            db.execute(text("""
                INSERT INTO student_classes (student_id, class_id, enrolled_at)
                VALUES (:student_id, :class_id, NOW())
            """), {"student_id": students_list[i].id, "class_id": classes_list[2].id})
        
        db.commit()
        
        # Create assignments for each class (3 assignments per class)
        print("📋 Creating assignments...")
        assignments_data = [
            # Advanced Mathematics assignments
            (classes_list[0].id, 'Algebra Fundamentals', 'Solve linear and quadratic equations', 'homework', 'Complete exercises 1-20 from chapter 3', 100),
            (classes_list[0].id, 'Geometry Proofs', 'Prove geometric theorems using logical reasoning', 'project', 'Create a presentation showing 5 different geometric proofs', 150),
            (classes_list[0].id, 'Calculus Introduction', 'Basic derivatives and integrals', 'quiz', 'Online quiz covering derivative rules and basic integration', 75),
            
            # English Literature assignments  
            (classes_list[1].id, 'Shakespeare Analysis', 'Analyze themes in Romeo and Juliet', 'essay', 'Write a 500-word essay analyzing the theme of love vs. fate', 100),
            (classes_list[1].id, 'Poetry Interpretation', 'Interpret modern poetry techniques', 'homework', 'Analyze 3 poems and identify literary devices used', 80),
            (classes_list[1].id, 'Creative Writing', 'Write an original short story', 'project', 'Create a 1000-word original story with character development', 120),
            
            # Science Exploration assignments
            (classes_list[2].id, 'Chemistry Lab Report', 'Document chemical reaction experiments', 'homework', 'Complete lab report for acid-base reaction experiment', 90),
            (classes_list[2].id, 'Physics Motion Study', 'Study projectile motion principles', 'project', 'Build and test a catapult, document results and calculations', 130),
            (classes_list[2].id, 'Biology Research', 'Research ecosystem interactions', 'essay', 'Research and present on a specific ecosystem and its food web', 110)
        ]
        
        assignment_ids = []
        for class_id, title, description, assignment_type, instructions, max_points in assignments_data:
            result = db.execute(text("""
                INSERT INTO assignments (title, description, assignment_type, instructions, max_points, class_id, created_by_teacher_id, due_date, created_at, updated_at)
                VALUES (:title, :description, :assignment_type, :instructions, :max_points, :class_id, :teacher_id, :due_date, NOW(), NOW())
            """), {
                "title": title,
                "description": description, 
                "assignment_type": assignment_type,
                "instructions": instructions,
                "max_points": max_points,
                "class_id": class_id,
                "teacher_id": teacher_id,
                "due_date": datetime.now() + timedelta(days=7)
            })
            assignment_ids.append(db.execute(text("SELECT LAST_INSERT_ID()")).fetchone()[0])
        
        db.commit()
        
        print("📝 Creating student submissions and evaluations...")
        # Create submissions for each student in their respective classes
        submission_texts = [
            "I have completed all the required exercises. The solutions show clear understanding of algebraic principles.",
            "This project demonstrates my grasp of geometric concepts through detailed proofs and visual representations.",
            "The quiz was challenging but I applied the derivative rules we learned in class to solve the problems.",
            "Romeo and Juliet explores the eternal conflict between love and fate, showing how passion can overcome reason.",
            "The poems use metaphor, alliteration, and imagery to create vivid emotional experiences for readers.",
            "My story follows a young adventurer who discovers that true courage comes from helping others.",
            "The lab experiment showed how acids and bases neutralize each other, producing salt and water as products.",
            "Our catapult achieved maximum range at a 45-degree angle, confirming physics principles of projectile motion.",
            "The rainforest ecosystem demonstrates complex interdependencies between producers, consumers, and decomposers."
        ]
        
        # Create submissions for each assignment
        submission_index = 0
        for i, assignment_id in enumerate(assignment_ids):
            # Get students enrolled in this assignment's class
            class_id = classes_list[i // 3].id  # 3 assignments per class
            
            if i < 3:  # Advanced Mathematics class
                enrolled_students = students_list[0:3]
            elif i < 6:  # English Literature class  
                enrolled_students = students_list[3:6]
            else:  # Science Exploration class
                enrolled_students = students_list[6:10]
            
            for j, student in enumerate(enrolled_students):
                # Create diverse submission scenarios
                submission_type = (submission_index + j) % 5

                if submission_type == 0:  # Completed and graded
                    db.execute(text("""
                        INSERT INTO submissions (assignment_id, student_id, text_content, submitted_at, is_graded, grade, feedback)
                        VALUES (:assignment_id, :student_id, :text_content, :submitted_at, :is_graded, :grade, :feedback)
                    """), {
                        "assignment_id": assignment_id,
                        "student_id": student.id,
                        "text_content": submission_texts[submission_index % len(submission_texts)],
                        "submitted_at": datetime.now() - timedelta(days=random.randint(1, 5)),
                        "is_graded": True,
                        "grade": random.randint(75, 100),
                        "feedback": f"Excellent work {student.name}! Your analysis shows deep understanding."
                    })
                elif submission_type == 1:  # Completed but not graded yet
                    db.execute(text("""
                        INSERT INTO submissions (assignment_id, student_id, text_content, submitted_at, is_graded, grade, feedback)
                        VALUES (:assignment_id, :student_id, :text_content, :submitted_at, :is_graded, :grade, :feedback)
                    """), {
                        "assignment_id": assignment_id,
                        "student_id": student.id,
                        "text_content": submission_texts[submission_index % len(submission_texts)],
                        "submitted_at": datetime.now() - timedelta(days=random.randint(1, 3)),
                        "is_graded": False,
                        "grade": None,
                        "feedback": None
                    })
                elif submission_type == 2:  # Late submission, graded with lower score
                    db.execute(text("""
                        INSERT INTO submissions (assignment_id, student_id, text_content, submitted_at, is_graded, grade, feedback)
                        VALUES (:assignment_id, :student_id, :text_content, :submitted_at, :is_graded, :grade, :feedback)
                    """), {
                        "assignment_id": assignment_id,
                        "student_id": student.id,
                        "text_content": submission_texts[submission_index % len(submission_texts)],
                        "submitted_at": datetime.now() + timedelta(days=random.randint(1, 3)),
                        "is_graded": True,
                        "grade": random.randint(50, 75),
                        "feedback": f"Late submission. Please review time management, {student.name}."
                    })
                elif submission_type == 3:  # No submission yet (overdue)
                    # Don't create a submission record for this student
                    pass
                else:  # submission_type == 4: Completed with average grade
                    db.execute(text("""
                        INSERT INTO submissions (assignment_id, student_id, text_content, submitted_at, is_graded, grade, feedback)
                        VALUES (:assignment_id, :student_id, :text_content, :submitted_at, :is_graded, :grade, :feedback)
                    """), {
                        "assignment_id": assignment_id,
                        "student_id": student.id,
                        "text_content": submission_texts[submission_index % len(submission_texts)],
                        "submitted_at": datetime.now() - timedelta(days=random.randint(1, 4)),
                        "is_graded": True,
                        "grade": random.randint(60, 85),
                        "feedback": f"Good effort {student.name}! Some areas need improvement."
                    })

                submission_index += 1
        
        db.commit()
        
        print("✅ Database seeding completed successfully!")
        print("\n📊 Summary:")
        print("👨‍🏫 1 Teacher: ahmed.hassan@3allamni.com")
        print("👨‍🎓 10 Students: alice.johnson@student.com to jack.anderson@student.com")
        print("🏫 2 Schools: Al-Alamni International School, Future Leaders Academy")
        print("📚 3 Classes: Advanced Mathematics (3 students), English Literature (3 students), Science Exploration (4 students)")
        print("📋 9 Assignments: 3 per class with varied types (homework, projects, quizzes, essays)")
        print("📝 Multiple Submissions: Each student has submitted and received graded work")
        print("\n🔑 Login credentials (password for all: password123):")
        print("Teacher: ahmed.hassan@3allamni.com")
        print("Students: alice.johnson@student.com, bob.smith@student.com, etc.")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
