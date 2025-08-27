"""
Statistics and dashboard router
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from ..core.database import get_db
from ..core.security import require_student, require_teacher, get_current_active_user
from ..core.utils import format_progress_data, calculate_streak
from ..models.user import User
from ..models.school import School
from ..models.class_model import Class, StudentClass
from ..models.assignment import Assignment
from ..models.submission import Submission
from ..models.progress import ProgressStats
from ..models.quest import Quest, QuestAttempt
from ..schemas.progress import (
    ProgressStatsResponse, StudentDashboard, ParentStats,
    TeacherDashboard, ClassDashboard
)

router = APIRouter()

@router.get("/dashboard/student", response_model=StudentDashboard)
async def get_student_dashboard(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Get student dashboard data"""
    # Get or create progress stats
    progress = db.query(ProgressStats).filter(ProgressStats.student_id == current_user.id).first()
    if not progress:
        progress = ProgressStats(student_id=current_user.id)
        db.add(progress)
        db.commit()
        db.refresh(progress)
    
    # Get available quests
    available_quests = db.query(Quest).filter(Quest.is_active == True).limit(5).all()
    
    # Get recent assignments from enrolled classes
    recent_assignments = db.query(Assignment).join(Class).join(StudentClass).filter(
        StudentClass.student_id == current_user.id
    ).order_by(Assignment.created_at.desc()).limit(5).all()
    
    # Format progress data
    progress_data = format_progress_data({
        "lessons_completed": progress.lessons_completed,
        "quests_completed": progress.quests_completed,
        "streak_days": progress.streak_days,
        "stars_earned": progress.stars_earned
    })
    
    # Mock badges
    badges = []
    if progress.stars_earned >= 100:
        badges.append("Star Collector")
    if progress.streak_days >= 7:
        badges.append("Week Warrior")
    if progress.lessons_completed >= 10:
        badges.append("Learning Champion")
    
    return StudentDashboard(
        progress=ProgressStatsResponse.from_orm(progress),
        level=progress_data["level"],
        progress_percentage=progress_data["progress_percentage"],
        available_quests=[],  # Would include quest responses
        recent_assignments=[],  # Would include assignment responses
        badges=badges
    )

@router.get("/dashboard/teacher", response_model=TeacherDashboard)
async def get_teacher_dashboard(
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Get teacher dashboard data"""
    # Get teacher's schools and classes
    schools = db.query(School).filter(School.teacher_id == current_user.id).all()
    total_schools = len(schools)
    total_classes = db.query(Class).join(School).filter(School.teacher_id == current_user.id).count()

    # Get total students across all classes
    total_students = db.query(StudentClass).join(Class).join(School).filter(
        School.teacher_id == current_user.id
    ).count()

    # Get total assignments
    total_assignments = db.query(Assignment).join(Class).join(School).filter(
        School.teacher_id == current_user.id
    ).count()

    # Get pending submissions
    pending_submissions = db.query(Submission).join(Assignment).join(Class).join(School).filter(
        School.teacher_id == current_user.id,
        Submission.is_graded == False
    ).count()
    
    # Mock recent activities
    recent_activities = [
        {"type": "submission", "message": "New submission from John Doe", "timestamp": "2024-01-15T10:30:00"},
        {"type": "enrollment", "message": "Sarah Smith joined French Class A", "timestamp": "2024-01-15T09:15:00"},
        {"type": "assignment", "message": "Math homework due tomorrow", "timestamp": "2024-01-14T16:45:00"}
    ]
    
    # Mock class performance
    class_performance = []
    for school in schools:
        for class_obj in school.classes:
            class_performance.append({
                "class_name": class_obj.name,
                "student_count": len(class_obj.student_classes),
                "average_grade": 85.0,  # Mock data
                "completion_rate": 0.8   # Mock data
            })
    
    return TeacherDashboard(
        total_schools=total_schools,
        total_students=total_students,
        total_classes=total_classes,
        total_assignments=total_assignments,
        pending_submissions=pending_submissions,
        recent_activities=recent_activities,
        class_performance=class_performance
    )

@router.get("/dashboard/class/{class_id}", response_model=ClassDashboard)
async def get_class_dashboard(
    class_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Get class dashboard data"""
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
    
    # Get class statistics
    student_count = db.query(StudentClass).filter(StudentClass.class_id == class_id).count()
    assignment_count = db.query(Assignment).filter(Assignment.class_id == class_id).count()
    
    # Get recent submissions
    recent_submissions = db.query(Submission).join(Assignment).filter(
        Assignment.class_id == class_id
    ).order_by(Submission.submitted_at.desc()).limit(10).all()
    
    # Mock student progress
    student_progress = []
    enrollments = db.query(StudentClass).filter(StudentClass.class_id == class_id).all()
    for enrollment in enrollments:
        student = enrollment.student
        progress = db.query(ProgressStats).filter(ProgressStats.student_id == student.id).first()
        student_progress.append({
            "student_id": student.id,
            "student_name": student.name,
            "lessons_completed": progress.lessons_completed if progress else 0,
            "stars_earned": progress.stars_earned if progress else 0,
            "last_activity": progress.last_activity_date if progress else None
        })
    
    return ClassDashboard(
        class_info={},  # Would be ClassResponse
        student_count=student_count,
        assignment_count=assignment_count,
        average_grade=85.0,  # Mock data
        completion_rate=0.75,  # Mock data
        recent_submissions=[],  # Would be SubmissionResponse list
        student_progress=student_progress
    )

@router.get("/parent/{student_id}", response_model=ParentStats)
async def get_parent_stats(
    student_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get parent statistics for student"""
    # Verify access (student can view own stats, or parent email matches)
    student = db.query(User).filter(User.id == student_id, User.role == "student").first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Check permissions
    if current_user.id != student_id and current_user.email != student.parent_email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Get student progress
    progress = db.query(ProgressStats).filter(ProgressStats.student_id == student_id).first()
    
    # Mock weekly and monthly stats
    weekly_stats = {
        "time_spent": 120,  # minutes
        "lessons_completed": 5,
        "quests_completed": 8,
        "errors_corrected": 12,
        "streak_days": 4
    }
    
    monthly_stats = {
        "time_spent": 480,  # minutes
        "lessons_completed": 20,
        "quests_completed": 35,
        "errors_corrected": 45,
        "average_score": 85.5
    }
    
    # Mock recent activities
    recent_activities = [
        {"date": "2024-01-15", "activity": "Completed French dictation", "score": 90},
        {"date": "2024-01-14", "activity": "Submitted math homework", "score": 85},
        {"date": "2024-01-13", "activity": "Completed spelling quest", "score": 95}
    ]
    
    # Mock improvement areas and achievements
    improvement_areas = ["Spelling accuracy", "Grammar usage"]
    achievements = ["Completed 10 lessons", "7-day streak", "Perfect spelling quiz"]
    
    return ParentStats(
        student_name=student.name,
        weekly_stats=weekly_stats,
        monthly_stats=monthly_stats,
        recent_activities=recent_activities,
        improvement_areas=improvement_areas,
        achievements=achievements
    )

@router.get("/progress", response_model=ProgressStatsResponse)
async def get_progress_stats(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Get student's progress statistics"""
    progress = db.query(ProgressStats).filter(ProgressStats.student_id == current_user.id).first()
    
    if not progress:
        # Create initial progress record
        progress = ProgressStats(student_id=current_user.id)
        db.add(progress)
        db.commit()
        db.refresh(progress)
    
    return ProgressStatsResponse.from_orm(progress)

@router.get("/leaderboard")
async def get_leaderboard(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get student leaderboard"""
    # Get top students by stars earned
    top_students = db.query(ProgressStats, User).join(User).filter(
        User.role == "student"
    ).order_by(ProgressStats.stars_earned.desc()).limit(10).all()
    
    leaderboard = []
    for i, (progress, user) in enumerate(top_students, 1):
        leaderboard.append({
            "rank": i,
            "student_name": user.name,
            "stars_earned": progress.stars_earned,
            "lessons_completed": progress.lessons_completed,
            "streak_days": progress.streak_days
        })
    
    return {"leaderboard": leaderboard}
