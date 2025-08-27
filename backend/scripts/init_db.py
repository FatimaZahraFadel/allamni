"""
Database initialization and seeding script
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
import json

from app.core.config import settings
from app.core.database import Base
from app.core.security import get_password_hash
from app.models.user import User, UserRole, LanguagePreference, SubscriptionStatus
from app.models.school import School
from app.models.class_model import Class, StudentClass
from app.models.assignment import Assignment, AssignmentType
from app.models.submission import Submission
from app.models.progress import ProgressStats
from app.models.quest import Quest, QuestType, QuestDifficulty, QuestAttempt
from app.models.correction import Correction
from app.models.subscription import Subscription, SubscriptionPlan, PaymentStatus

def create_database():
    """Create database tables"""
    engine = create_engine(settings.DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
    return engine

def seed_data():
    """Seed database with sample data"""
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Create sample teachers
        teacher1 = User(
            name="Ahmed Hassan",
            email="ahmed.hassan@3allamni.com",
            password_hash=get_password_hash("teacher123"),
            role=UserRole.TEACHER,
            language_preference=LanguagePreference.ARABIC,
            subscription_status=SubscriptionStatus.ACTIVE
        )
        
        teacher2 = User(
            name="Fatima Benali",
            email="fatima.benali@3allamni.com",
            password_hash=get_password_hash("teacher123"),
            role=UserRole.TEACHER,
            language_preference=LanguagePreference.FRENCH,
            subscription_status=SubscriptionStatus.ACTIVE
        )
        
        db.add_all([teacher1, teacher2])
        db.commit()
        db.refresh(teacher1)
        db.refresh(teacher2)
        
        # Create sample students
        students = []
        student_names = [
            ("Youssef Alami", "youssef.alami@student.com", "parent1@email.com"),
            ("Aicha Benali", "aicha.benali@student.com", "parent2@email.com"),
            ("Omar Tazi", "omar.tazi@student.com", "parent3@email.com"),
            ("Salma Idrissi", "salma.idrissi@student.com", "parent4@email.com"),
            ("Karim Benjelloun", "karim.benjelloun@student.com", "parent5@email.com"),
            ("Nour Alaoui", "nour.alaoui@student.com", "parent6@email.com")
        ]
        
        for name, email, parent_email in student_names:
            student = User(
                name=name,
                email=email,
                password_hash=get_password_hash("student123"),
                role=UserRole.STUDENT,
                language_preference=LanguagePreference.ARABIC,
                parent_email=parent_email
            )
            students.append(student)
        
        db.add_all(students)
        db.commit()
        
        # Create progress stats for students
        for student in students:
            db.refresh(student)
            progress = ProgressStats(
                student_id=student.id,
                lessons_completed=5,
                quests_completed=10,
                streak_days=3,
                stars_earned=50,
                total_time_spent=120
            )
            db.add(progress)
        
        # Create schools
        school1 = School(
            teacher_id=teacher1.id,
            name="مدرسة النور الابتدائية",
            description="مدرسة ابتدائية متخصصة في تعليم اللغة العربية والفرنسية"
        )
        
        school2 = School(
            teacher_id=teacher2.id,
            name="École Primaire Les Étoiles",
            description="École primaire spécialisée dans l'enseignement du français"
        )
        
        db.add_all([school1, school2])
        db.commit()
        db.refresh(school1)
        db.refresh(school2)
        
        # Create classes
        class1 = Class(
            school_id=school1.id,
            name="العربية الصف الرابع مجموعة أ",
            description="صف اللغة العربية للمستوى الرابع ابتدائي",
            subject="Arabic",
            grade_level="4ème primaire"
        )
        
        class2 = Class(
            school_id=school1.id,
            name="الفرنسية الصف الرابع مجموعة ب",
            description="صف اللغة الفرنسية للمستوى الرابع ابتدائي",
            subject="French",
            grade_level="4ème primaire"
        )
        
        class3 = Class(
            school_id=school2.id,
            name="Français 4ème primaire groupe A",
            description="Classe de français pour le niveau 4ème primaire",
            subject="French",
            grade_level="4ème primaire"
        )
        
        db.add_all([class1, class2, class3])
        db.commit()
        
        # Enroll students in classes
        enrollments = [
            StudentClass(student_id=students[0].id, class_id=class1.id),
            StudentClass(student_id=students[1].id, class_id=class1.id),
            StudentClass(student_id=students[2].id, class_id=class2.id),
            StudentClass(student_id=students[3].id, class_id=class2.id),
            StudentClass(student_id=students[4].id, class_id=class3.id),
            StudentClass(student_id=students[5].id, class_id=class3.id),
        ]
        
        db.add_all(enrollments)
        db.commit()
        
        # Create sample assignments
        assignment1 = Assignment(
            class_id=class1.id,
            created_by_teacher_id=teacher1.id,
            title="تمرين الإملاء الأسبوعي",
            description="تمرين إملاء للكلمات الجديدة التي تعلمناها هذا الأسبوع",
            assignment_type=AssignmentType.HOMEWORK,
            instructions="اكتب الكلمات التالية بشكل صحيح",
            due_date=datetime.utcnow() + timedelta(days=7),
            max_points=100
        )
        
        assignment2 = Assignment(
            class_id=class2.id,
            created_by_teacher_id=teacher1.id,
            title="Exercice de grammaire",
            description="Exercice sur les verbes du premier groupe",
            assignment_type=AssignmentType.EXERCISE,
            instructions="Conjuguez les verbes suivants au présent",
            due_date=datetime.utcnow() + timedelta(days=5),
            max_points=100
        )
        
        db.add_all([assignment1, assignment2])
        db.commit()
        
        # Create sample quests
        quest_data = [
            {
                "title": "تمرين ترتيب الكلمات",
                "description": "رتب الكلمات لتكوين جملة صحيحة",
                "quest_type": QuestType.REORDER,
                "difficulty": QuestDifficulty.EASY,
                "subject": "Arabic",
                "grade_level": "4ème primaire",
                "content_json": {
                    "question": "رتب الكلمات التالية لتكوين جملة صحيحة",
                    "words": ["الطالب", "يقرأ", "الكتاب", "في", "المكتبة"],
                    "correct_order": ["الطالب", "يقرأ", "الكتاب", "في", "المكتبة"],
                    "explanation": "الجملة الصحيحة هي: الطالب يقرأ الكتاب في المكتبة"
                },
                "points_reward": 10
            },
            {
                "title": "Complétez les phrases",
                "description": "Complétez les phrases avec le bon mot",
                "quest_type": QuestType.FILL_IN_BLANK,
                "difficulty": QuestDifficulty.MEDIUM,
                "subject": "French",
                "grade_level": "4ème primaire",
                "content_json": {
                    "question": "Complétez la phrase: Je ____ à l'école tous les jours.",
                    "options": ["va", "vas", "vais", "vont"],
                    "correct_answers": ["vais"],
                    "explanation": "La bonne réponse est 'vais' car c'est la conjugaison du verbe 'aller' à la première personne du singulier."
                },
                "points_reward": 15
            },
            {
                "title": "Quiz de vocabulaire",
                "description": "Choisissez la bonne traduction",
                "quest_type": QuestType.MULTIPLE_CHOICE,
                "difficulty": QuestDifficulty.EASY,
                "subject": "French",
                "grade_level": "4ème primaire",
                "content_json": {
                    "question": "Que signifie le mot 'chat' en arabe?",
                    "options": ["كلب", "قط", "طائر", "سمك"],
                    "correct_answer": "قط",
                    "explanation": "Le mot 'chat' se traduit par 'قط' en arabe."
                },
                "points_reward": 5
            }
        ]
        
        quests = []
        for quest_info in quest_data:
            quest = Quest(**quest_info)
            quests.append(quest)
        
        db.add_all(quests)
        db.commit()
        
        # Create subscriptions for teachers
        subscription1 = Subscription(
            teacher_id=teacher1.id,
            plan=SubscriptionPlan.MONTHLY,
            price=189.0,
            status=PaymentStatus.COMPLETED,
            start_date=datetime.utcnow(),
            end_date=datetime.utcnow() + timedelta(days=30),
            payment_info={"method": "credit_card", "last_four": "1234"}
        )
        
        subscription2 = Subscription(
            teacher_id=teacher2.id,
            plan=SubscriptionPlan.YEARLY,
            price=189.0 * 12 * 0.9,  # 10% discount
            status=PaymentStatus.COMPLETED,
            start_date=datetime.utcnow(),
            end_date=datetime.utcnow() + timedelta(days=365),
            payment_info={"method": "bank_transfer", "reference": "TXN123456"}
        )
        
        db.add_all([subscription1, subscription2])
        db.commit()
        
        print("✅ Sample data seeded successfully!")
        print("\n📊 Created:")
        print(f"   - {len([teacher1, teacher2])} Teachers")
        print(f"   - {len(students)} Students")
        print(f"   - {len([school1, school2])} Schools")
        print(f"   - {len([class1, class2, class3])} Classes")
        print(f"   - {len([assignment1, assignment2])} Assignments")
        print(f"   - {len(quests)} Quests")
        print(f"   - {len([subscription1, subscription2])} Subscriptions")
        
        print("\n🔑 Login Credentials:")
        print("Teachers:")
        print("  - ahmed.hassan@3allamni.com / teacher123")
        print("  - fatima.benali@3allamni.com / teacher123")
        print("\nStudents:")
        for name, email, _ in student_names:
            print(f"  - {email} / student123")
        
    except Exception as e:
        print(f"❌ Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Initializing 3allamni database...")
    engine = create_database()
    seed_data()
    print("✅ Database initialization completed!")
