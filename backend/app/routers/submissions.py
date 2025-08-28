"""
Submissions router
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional

from ..core.database import get_db
from ..core.security import require_teacher, require_student, get_current_active_user
from ..core.utils import save_uploaded_file
from ..models.user import User
from ..models.school import School
from ..models.class_model import Class, StudentClass
from ..models.assignment import Assignment
from ..models.submission import Submission
from ..schemas.submission import (
    SubmissionCreate, SubmissionUpdate, SubmissionResponse,
    SubmissionGrade, SubmissionWithDetails
)

router = APIRouter()

@router.post("/", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
async def create_submission(
    submission_data: SubmissionCreate,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Create a new submission"""
    # Verify assignment exists and student is enrolled
    assignment = db.query(Assignment).filter(Assignment.id == submission_data.assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )
    
    # Check if student is enrolled in the class
    enrollment = db.query(StudentClass).filter(
        StudentClass.student_id == current_user.id,
        StudentClass.class_id == assignment.class_id
    ).first()
    
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enrolled in this class"
        )
    
    # Check if submission already exists
    existing = db.query(Submission).filter(
        Submission.assignment_id == submission_data.assignment_id,
        Submission.student_id == current_user.id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Submission already exists for this assignment"
        )
    
    submission = Submission(
        assignment_id=submission_data.assignment_id,
        student_id=current_user.id,
        text_content=submission_data.text_content
    )
    
    db.add(submission)
    db.commit()
    db.refresh(submission)

    return SubmissionResponse.from_orm(submission)

@router.post("/upload", response_model=SubmissionResponse)
async def upload_submission(
    assignment_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Upload file submission"""
    # Verify assignment and enrollment (same as above)
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )
    
    enrollment = db.query(StudentClass).filter(
        StudentClass.student_id == current_user.id,
        StudentClass.class_id == assignment.class_id
    ).first()
    
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enrolled in this class"
        )
    
    # Check if submission already exists
    existing = db.query(Submission).filter(
        Submission.assignment_id == assignment_id,
        Submission.student_id == current_user.id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Submission already exists for this assignment"
        )
    
    # Save uploaded file
    file_content = await file.read()
    file_path = save_uploaded_file(file_content, file.filename)
    
    submission = Submission(
        assignment_id=assignment_id,
        student_id=current_user.id,
        file_url=file_path
    )
    
    db.add(submission)
    db.commit()
    db.refresh(submission)
    
    return SubmissionResponse.from_orm(submission)

@router.get("/", response_model=List[SubmissionWithDetails])
async def get_submissions(
    assignment_id: int = None,
    student_id: int = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get submissions with student and assignment details"""
    try:
        from sqlalchemy.orm import joinedload

        user_role = current_user.role.lower() if current_user.role else ""

        if user_role == "teacher":
            # Teachers can see all submissions from their classes
            query = db.query(Submission).options(
                joinedload(Submission.student),
                joinedload(Submission.assignment)
            ).join(Assignment).join(Class).join(School).filter(
                School.teacher_id == current_user.id
            )
            if assignment_id:
                query = query.filter(Submission.assignment_id == assignment_id)
            if student_id:
                query = query.filter(Submission.student_id == student_id)
        else:
            # Students can only see their own submissions
            query = db.query(Submission).options(
                joinedload(Submission.assignment)
            ).filter(Submission.student_id == current_user.id)
            if assignment_id:
                query = query.filter(Submission.assignment_id == assignment_id)

        submissions = query.all()

        # Create detailed response with proper names and grades
        detailed_submissions = []
        for sub in submissions:
            detailed_sub = SubmissionWithDetails(
                id=sub.id,
                assignment_id=sub.assignment_id,
                student_id=sub.student_id,
                text_content=sub.text_content,
                submitted_at=sub.submitted_at,
                is_graded=sub.is_graded,
                grade=sub.grade,
                feedback=sub.feedback,
                # Add detailed information
                student_name=sub.student.name if sub.student else f"Student {sub.student_id}",
                assignment_title=sub.assignment.title if sub.assignment else f"Assignment {sub.assignment_id}",
                assignment_max_points=sub.assignment.max_points if sub.assignment else 100
            )
            detailed_submissions.append(detailed_sub)

        return detailed_submissions

    except Exception as e:
        print(f"Error in get_submissions: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch submissions: {str(e)}"
        )

@router.get("/{submission_id}", response_model=SubmissionWithDetails)
async def get_submission(
    submission_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get submission by ID with full details"""
    try:
        from sqlalchemy.orm import joinedload

        submission = db.query(Submission).options(
            joinedload(Submission.student),
            joinedload(Submission.assignment)
        ).filter(Submission.id == submission_id).first()

        if not submission:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Submission not found"
            )

        user_role = current_user.role.lower() if current_user.role else ""

        # Check permissions
        if user_role == "teacher":
            # Verify submission belongs to teacher's class
            assignment = db.query(Assignment).join(Class).join(School).filter(
                Assignment.id == submission.assignment_id,
                School.teacher_id == current_user.id
            ).first()
            if not assignment:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not enough permissions"
                )
        else:
            # Students can only see their own submissions
            if submission.student_id != current_user.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not enough permissions"
                )

        # Create detailed response
        detailed_submission = SubmissionWithDetails(
            id=submission.id,
            assignment_id=submission.assignment_id,
            student_id=submission.student_id,
            text_content=submission.text_content,
            submitted_at=submission.submitted_at,
            is_graded=submission.is_graded,
            grade=submission.grade,
            feedback=submission.feedback,
            student_name=submission.student.name if submission.student else f"Student {submission.student_id}",
            assignment_title=submission.assignment.title if submission.assignment else f"Assignment {submission.assignment_id}",
            assignment_max_points=submission.assignment.max_points if submission.assignment else 100
        )

        return detailed_submission

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_submission: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch submission: {str(e)}"
        )

@router.put("/{submission_id}/grade", response_model=SubmissionWithDetails)
async def grade_submission(
    submission_id: int,
    grade_data: SubmissionGrade,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Grade a submission (teacher only)"""
    try:
        from sqlalchemy.orm import joinedload

        submission = db.query(Submission).options(
            joinedload(Submission.student),
            joinedload(Submission.assignment)
        ).filter(Submission.id == submission_id).first()

        if not submission:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Submission not found"
            )

        # Verify submission belongs to teacher's class
        assignment = db.query(Assignment).join(Class).join(School).filter(
            Assignment.id == submission.assignment_id,
            School.teacher_id == current_user.id
        ).first()

        if not assignment:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )

        # Update submission with grade and feedback
        submission.grade = grade_data.grade
        submission.feedback = grade_data.feedback
        submission.is_graded = True

        db.commit()
        db.refresh(submission)

        # Return detailed response
        detailed_submission = SubmissionWithDetails(
            id=submission.id,
            assignment_id=submission.assignment_id,
            student_id=submission.student_id,
            text_content=submission.text_content,
            submitted_at=submission.submitted_at,
            is_graded=submission.is_graded,
            grade=submission.grade,
            feedback=submission.feedback,
            student_name=submission.student.name if submission.student else f"Student {submission.student_id}",
            assignment_title=submission.assignment.title if submission.assignment else f"Assignment {submission.assignment_id}",
            assignment_max_points=submission.assignment.max_points if submission.assignment else 100
        )

        return detailed_submission

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in grade_submission: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to grade submission: {str(e)}"
        )

@router.put("/{submission_id}", response_model=SubmissionResponse)
async def update_submission(
    submission_id: int,
    submission_update: SubmissionUpdate,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Update submission (students only, before grading)"""
    submission = db.query(Submission).filter(
        Submission.id == submission_id,
        Submission.student_id == current_user.id
    ).first()
    
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )
    
    if submission.is_graded:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update graded submission"
        )
    
    # Update submission fields
    update_data = submission_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(submission, field, value)
    
    db.commit()
    db.refresh(submission)
    
    return SubmissionResponse.from_orm(submission)

@router.post("/{submission_id}/grade", response_model=SubmissionResponse)
async def grade_submission(
    submission_id: int,
    grade_data: SubmissionGrade,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Grade submission (teachers only)"""
    submission = db.query(Submission).join(Assignment).join(Class).join(School).filter(
        Submission.id == submission_id,
        School.teacher_id == current_user.id
    ).first()
    
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )
    
    submission.grade = grade_data.grade
    submission.feedback = grade_data.feedback
    submission.is_graded = True
    submission.graded_at = db.func.now()
    
    db.commit()
    db.refresh(submission)
    
    return SubmissionResponse.from_orm(submission)
