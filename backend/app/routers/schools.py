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
from ..schemas.school import SchoolCreate, SchoolUpdate, SchoolResponse, SchoolWithClasses

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

@router.get("/", response_model=List[SchoolResponse])
async def get_schools(
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Get all schools for current teacher"""
    schools = db.query(School).filter(School.teacher_id == current_user.id).all()
    return [SchoolResponse.from_orm(school) for school in schools]

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
