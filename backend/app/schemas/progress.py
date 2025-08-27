"""
Progress and statistics schemas
"""

from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ProgressStatsResponse(BaseModel):
    id: int
    student_id: int
    lessons_completed: int
    quests_completed: int
    streak_days: int
    stars_earned: int
    last_activity_date: Optional[datetime] = None
    total_time_spent: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class StudentDashboard(BaseModel):
    progress: ProgressStatsResponse
    level: int
    progress_percentage: float
    available_quests: List["QuestResponse"]
    recent_assignments: List["AssignmentResponse"]
    badges: List[str]

class ParentStats(BaseModel):
    student_name: str
    weekly_stats: Dict[str, Any]
    monthly_stats: Dict[str, Any]
    recent_activities: List[Dict[str, Any]]
    improvement_areas: List[str]
    achievements: List[str]

class TeacherDashboard(BaseModel):
    total_schools: int
    total_students: int
    total_classes: int
    total_assignments: int
    pending_submissions: int
    recent_activities: List[Dict[str, Any]]
    class_performance: List[Dict[str, Any]]

class ClassDashboard(BaseModel):
    class_info: "ClassResponse"
    student_count: int
    assignment_count: int
    average_grade: Optional[float]
    completion_rate: float
    recent_submissions: List["SubmissionResponse"]
    student_progress: List[Dict[str, Any]]

# Import here to avoid circular imports
from .quest import QuestResponse
from .assignment import AssignmentResponse
from .class_schema import ClassResponse
from .submission import SubmissionResponse

StudentDashboard.model_rebuild()
ClassDashboard.model_rebuild()
