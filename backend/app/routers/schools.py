"""
Schools router
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..core.database import get_db
from ..core.security import require_teacher
from ..models.user import User
from ..models.school import School
from ..schemas.school import SchoolCreate, SchoolUpdate, SchoolResponse, SchoolWithClasses, SchoolWithCounts

router = APIRouter()

@router.post("/", response_model=SchoolResponse, status_code=status.HTTP_201_CREATED)
async def create_school(
    school_data: SchoolCreate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Create a new school"""
    school = School(
        teacher_id=current_user.id,
        name=school_data.name,
        description=school_data.description
    )
    
    db.add(school)
    db.commit()
    db.refresh(school)
    
    return SchoolResponse.from_orm(school)

@router.get("/", response_model=List[SchoolWithCounts])
async def get_schools(
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Get all schools for current teacher with class and student counts"""
    from sqlalchemy import func
    from ..models.class_model import Class, StudentClass

    schools = db.query(School).filter(School.teacher_id == current_user.id).all()

    schools_with_counts = []
    for school in schools:
        # Count classes for this school
        class_count = db.query(Class).filter(Class.school_id == school.id).count()

        # Count students across all classes in this school
        student_count = db.query(StudentClass).join(Class).filter(
            Class.school_id == school.id
        ).count()

        school_data = SchoolWithCounts(
            id=school.id,
            teacher_id=school.teacher_id,
            name=school.name,
            description=school.description,
            created_at=school.created_at,
            updated_at=school.updated_at,
            class_count=class_count,
            student_count=student_count
        )
        schools_with_counts.append(school_data)

    return schools_with_counts

@router.get("/{school_id}", response_model=SchoolWithClasses)
async def get_school(
    school_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Get school by ID with classes"""
    school = db.query(School).filter(
        School.id == school_id,
        School.teacher_id == current_user.id
    ).first()
    
    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="School not found"
        )
    
    return SchoolWithClasses.from_orm(school)

@router.put("/{school_id}", response_model=SchoolResponse)
async def update_school(
    school_id: int,
    school_update: SchoolUpdate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Update school"""
    school = db.query(School).filter(
        School.id == school_id,
        School.teacher_id == current_user.id
    ).first()
    
    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="School not found"
        )
    
    # Update school fields
    update_data = school_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(school, field, value)
    
    db.commit()
    db.refresh(school)
    
    return SchoolResponse.from_orm(school)

@router.delete("/{school_id}")
async def delete_school(
    school_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Delete school"""
    school = db.query(School).filter(
        School.id == school_id,
        School.teacher_id == current_user.id
    ).first()
    
    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="School not found"
        )
    
    db.delete(school)
    db.commit()
    
    return {"message": "School deleted successfully"}
