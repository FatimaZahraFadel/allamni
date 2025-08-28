"""
Assignments router
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..core.database import get_db
from ..core.security import require_teacher, require_student, get_current_active_user
from ..models.user import User
from ..models.school import School
from ..models.class_model import Class, StudentClass
from ..models.assignment import Assignment
from ..models.submission import Submission
from ..schemas.assignment import (
    AssignmentCreate, AssignmentUpdate, AssignmentResponse,
    AssignmentWithSubmissions, AssignmentStats
)

router = APIRouter()

@router.post("/", response_model=AssignmentResponse, status_code=status.HTTP_201_CREATED)
async def create_assignment(
    assignment_data: AssignmentCreate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Create a new assignment"""
    # Verify class belongs to teacher
    class_obj = db.query(Class).join(School).filter(
        Class.id == assignment_data.class_id,
        School.teacher_id == current_user.id
    ).first()
    
    if not class_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    assignment = Assignment(
        class_id=assignment_data.class_id,
        created_by_teacher_id=current_user.id,
        title=assignment_data.title,
        description=assignment_data.description,
        assignment_type=assignment_data.assignment_type,
        instructions=assignment_data.instructions,
        due_date=assignment_data.due_date,
        max_points=assignment_data.max_points
    )
    
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    
    return AssignmentResponse.from_orm(assignment)

@router.get("/", response_model=List[AssignmentResponse])
async def get_assignments(
    class_id: int = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get assignments"""
    if current_user.role == "teacher":
        # Teachers see assignments from their classes
        query = db.query(Assignment).join(Class).join(School).filter(
            School.teacher_id == current_user.id
        )
        if class_id:
            query = query.filter(Assignment.class_id == class_id)
    else:
        # Students see assignments from their enrolled classes
        query = db.query(Assignment).join(Class).join(StudentClass).filter(
            StudentClass.student_id == current_user.id
        )
        if class_id:
            # Verify student is enrolled in the class
            enrollment = db.query(StudentClass).filter(
                StudentClass.student_id == current_user.id,
                StudentClass.class_id == class_id
            ).first()
            if not enrollment:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not enrolled in this class"
                )
            query = query.filter(Assignment.class_id == class_id)
    
    assignments = query.all()
    return [AssignmentResponse.from_orm(assignment) for assignment in assignments]

@router.get("/{assignment_id}")
async def get_assignment(
    assignment_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get assignment by ID with submissions"""
    try:
        from sqlalchemy.orm import joinedload

        assignment = db.query(Assignment).options(
            joinedload(Assignment.submissions).joinedload(Submission.student)
        ).filter(Assignment.id == assignment_id).first()

        if not assignment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assignment not found"
            )

        # Check permissions - handle case insensitive role comparison
        user_role = current_user.role.lower() if current_user.role else ""

        if user_role == "teacher":
            # Verify assignment belongs to teacher's class
            class_obj = db.query(Class).join(School).filter(
                Class.id == assignment.class_id,
                School.teacher_id == current_user.id
            ).first()
            if not class_obj:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not enough permissions"
                )
        else:
            # Verify student is enrolled in the class
            enrollment = db.query(StudentClass).filter(
                StudentClass.student_id == current_user.id,
                StudentClass.class_id == assignment.class_id
            ).first()
            if not enrollment:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not enrolled in this class"
                )

        # Create response manually to avoid serialization issues
        assignment_data = {
            "id": assignment.id,
            "class_id": assignment.class_id,
            "title": assignment.title,
            "description": assignment.description,
            "due_date": assignment.due_date,
            "max_points": assignment.max_points,
            "created_at": assignment.created_at,
            "updated_at": assignment.updated_at,
            "submissions": [
                {
                    "id": sub.id,
                    "assignment_id": sub.assignment_id,
                    "student_id": sub.student_id,
                    "text_content": sub.text_content,
                    "submitted_at": sub.submitted_at,
                    "is_graded": sub.is_graded,
                    "grade": sub.grade,
                    "feedback": sub.feedback,
                    "student_name": sub.student.name if sub.student else f"Student {sub.student_id}",
                } for sub in assignment.submissions
            ]
        }

        return assignment_data

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_assignment: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch assignment: {str(e)}"
        )

@router.put("/{assignment_id}", response_model=AssignmentResponse)
async def update_assignment(
    assignment_id: int,
    assignment_update: AssignmentUpdate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Update assignment"""
    assignment = db.query(Assignment).join(Class).join(School).filter(
        Assignment.id == assignment_id,
        School.teacher_id == current_user.id
    ).first()
    
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )
    
    # Update assignment fields
    update_data = assignment_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(assignment, field, value)
    
    db.commit()
    db.refresh(assignment)
    
    return AssignmentResponse.from_orm(assignment)

@router.delete("/{assignment_id}")
async def delete_assignment(
    assignment_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Delete assignment"""
    assignment = db.query(Assignment).join(Class).join(School).filter(
        Assignment.id == assignment_id,
        School.teacher_id == current_user.id
    ).first()
    
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )
    
    db.delete(assignment)
    db.commit()
    
    return {"message": "Assignment deleted successfully"}

@router.get("/{assignment_id}/stats", response_model=AssignmentStats)
async def get_assignment_stats(
    assignment_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Get assignment statistics"""
    assignment = db.query(Assignment).join(Class).join(School).filter(
        Assignment.id == assignment_id,
        School.teacher_id == current_user.id
    ).first()
    
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )
    
    # Calculate stats (simplified for demo)
    total_submissions = len(assignment.submissions)
    graded_submissions = len([s for s in assignment.submissions if s.is_graded])
    
    return AssignmentStats(
        total_submissions=total_submissions,
        graded_submissions=graded_submissions,
        average_grade=85.0,  # Mock data
        completion_rate=0.8  # Mock data
    )
