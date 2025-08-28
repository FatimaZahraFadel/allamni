#!/usr/bin/env python3
"""
Test classes endpoint function directly
"""

from app.core.database import SessionLocal
from app.models.user import User
from app.routers.classes import get_classes
import asyncio

async def test_classes_direct():
    db = SessionLocal()
    
    try:
        # Get the teacher user
        teacher = db.query(User).filter(User.email == "ahmed.hassan@3allamni.com").first()
        if not teacher:
            print("❌ Teacher not found!")
            return
            
        print(f"✅ Teacher found: {teacher.name} (ID: {teacher.id})")
        
        # Test the classes function directly
        print("\n🏫 Testing get_classes function directly...")
        try:
            result = await get_classes(school_id=None, current_user=teacher, db=db)
            print(f"✅ Function executed successfully! Found {len(result)} classes:")
            
            for class_data in result:
                print(f"  - {class_data.name} (ID: {class_data.id})")
                print(f"    School: {class_data.school_name}")
                print(f"    Students: {class_data.student_count}")
                print()
                
        except Exception as e:
            print(f"❌ Function failed: {e}")
            import traceback
            traceback.print_exc()
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(test_classes_direct())
