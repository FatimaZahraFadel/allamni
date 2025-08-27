"""
Classes router
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..core.database import get_db
from ..core.security import require_teacher, get_current_active_user
from ..models.user import User
from ..models.school import School
from ..models.class_model import Class, StudentClass
from ..schemas.class_schema import (
    ClassCreate, ClassUpdate, ClassResponse, ClassWithStudents,
    StudentClassCreate, StudentClassResponse, ClassStats
)

router = APIRouter()

@router.post("/", response_model=ClassResponse, status_code=status.HTTP_201_CREATED)
async def create_class(
    class_data: ClassCreate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Create a new class"""
    # Verify school belongs to teacher
    school = db.query(School).filter(
        School.id == class_data.school_id,
        School.teacher_id == current_user.id
    ).first()
    
    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="School not found"
        )
    
    class_obj = Class(
        school_id=class_data.school_id,
        name=class_data.name,
        description=class_data.description,
        subject=class_data.subject,
        grade_level=class_data.grade_level
    )
    
    db.add(class_obj)
    db.commit()
    db.refresh(class_obj)
    
    return ClassResponse.from_orm(class_obj)

@router.get("/", response_model=List[ClassResponse])
async def get_classes(
    school_id: int = None,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Get all classes for current teacher"""
    query = db.query(Class).join(School).filter(School.teacher_id == current_user.id)
    
    if school_id:
        query = query.filter(Class.school_id == school_id)
    
    classes = query.all()
    return [ClassResponse.from_orm(class_obj) for class_obj in classes]

@router.get("/{class_id}", response_model=ClassWithStudents)
async def get_class(
    class_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Get class by ID with students"""
    class_obj = db.query(Class).join(School).filter(
        Class.id == class_id,
        School.teacher_id == current_user.id
    ).first()
    
    if not class_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    return ClassWithStudents.from_orm(class_obj)

@router.put("/{class_id}", response_model=ClassResponse)
async def update_class(
    class_id: int,
    class_update: ClassUpdate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Update class"""
    class_obj = db.query(Class).join(School).filter(
        Class.id == class_id,
        School.teacher_id == current_user.id
    ).first()
    
    if not class_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    # Update class fields
    update_data = class_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(class_obj, field, value)
    
    db.commit()
    db.refresh(class_obj)
    
    return ClassResponse.from_orm(class_obj)

@router.delete("/{class_id}")
async def delete_class(
    class_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Delete class"""
    class_obj = db.query(Class).join(School).filter(
        Class.id == class_id,
        School.teacher_id == current_user.id
    ).first()
    
    if not class_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    db.delete(class_obj)
    db.commit()
    
    return {"message": "Class deleted successfully"}

@router.post("/{class_id}/students", response_model=StudentClassResponse)
async def enroll_student(
    class_id: int,
    student_data: StudentClassCreate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Enroll student in class"""
    # Verify class belongs to teacher
    class_obj = db.query(Class).join(School).filter(
        Class.id == class_id,
        School.teacher_id == current_user.id
    ).first()
    
    if not class_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    # Check if student exists and is a student
    student = db.query(User).filter(
        User.id == student_data.student_id,
        User.role == "student"
    ).first()
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Check if already enrolled
    existing = db.query(StudentClass).filter(
        StudentClass.student_id == student_data.student_id,
        StudentClass.class_id == class_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student already enrolled in this class"
        )
    
    # Create enrollment
    enrollment = StudentClass(
        student_id=student_data.student_id,
        class_id=class_id
    )
    
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    
    return StudentClassResponse.from_orm(enrollment)

@router.delete("/{class_id}/students/{student_id}")
async def remove_student(
    class_id: int,
    student_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Remove student from class"""
    # Verify class belongs to teacher
    class_obj = db.query(Class).join(School).filter(
        Class.id == class_id,
        School.teacher_id == current_user.id
    ).first()
    
    if not class_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    # Find enrollment
    enrollment = db.query(StudentClass).filter(
        StudentClass.student_id == student_id,
        StudentClass.class_id == class_id
    ).first()
    
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not enrolled in this class"
        )
    
    db.delete(enrollment)
    db.commit()
    
    return {"message": "Student removed from class successfully"}

@router.get("/{class_id}/stats", response_model=ClassStats)
async def get_class_stats(
    class_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Get class statistics"""
    # Verify class belongs to teacher
    class_obj = db.query(Class).join(School).filter(
        Class.id == class_id,
        School.teacher_id == current_user.id
    ).first()
    
    if not class_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    # Calculate stats (simplified for demo)
    total_students = db.query(StudentClass).filter(StudentClass.class_id == class_id).count()
    total_assignments = len(class_obj.assignments)
    
    return ClassStats(
        total_students=total_students,
        total_assignments=total_assignments,
        average_grade=85.0,  # Mock data
        completion_rate=0.75  # Mock data
    )
