#!/usr/bin/env python3
"""
Test classes database query directly
"""

from app.core.database import SessionLocal
from app.models.user import User
from app.models.school import School
from app.models.class_model import Class, StudentClass
from sqlalchemy import func, text

def test_classes_query():
    db = SessionLocal()
    
    try:
        # First, get the teacher user
        teacher = db.query(User).filter(User.email == "ahmed.hassan@3allamni.com").first()
        if not teacher:
            print("❌ Teacher not found!")
            return
            
        print(f"✅ Teacher found: {teacher.name} (ID: {teacher.id})")
        
        # Check if teacher has any schools
        schools = db.query(School).filter(School.teacher_id == teacher.id).all()
        print(f"📚 Teacher has {len(schools)} schools:")
        for school in schools:
            print(f"  - {school.name} (ID: {school.id})")
        
        # Check if schools have any classes
        classes = db.query(Class).join(School).filter(School.teacher_id == teacher.id).all()
        print(f"🏫 Teacher has {len(classes)} classes:")
        for class_obj in classes:
            print(f"  - {class_obj.name} (ID: {class_obj.id}, School ID: {class_obj.school_id})")
        
        # Test the exact query from the endpoint
        print("\n🔍 Testing the exact endpoint query...")
        try:
            query = db.query(
                Class,
                School.name.label('school_name'),
                func.count(StudentClass.student_id).label('student_count')
            ).join(School).outerjoin(StudentClass).filter(
                School.teacher_id == teacher.id
            ).group_by(Class.id, School.name)
            
            results = query.all()
            print(f"✅ Query executed successfully! Found {len(results)} results:")
            
            for class_obj, school_name, student_count in results:
                print(f"  - Class: {class_obj.name}")
                print(f"    School: {school_name}")
                print(f"    Students: {student_count}")
                print(f"    Class ID: {class_obj.id}")
                print(f"    School ID: {class_obj.school_id}")
                print()
                
        except Exception as e:
            print(f"❌ Query failed: {e}")
            import traceback
            traceback.print_exc()
        
        # Test StudentClass table
        print("👥 Checking StudentClass table...")
        student_classes = db.query(StudentClass).all()
        print(f"Found {len(student_classes)} student-class relationships:")
        for sc in student_classes[:5]:  # Show first 5
            print(f"  - Student ID: {sc.student_id}, Class ID: {sc.class_id}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_classes_query()
