"""
Assignment schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class AssignmentType(str, Enum):
    ESSAY = "essay"
    EXERCISE = "exercise"
    QUIZ = "quiz"
    PROJECT = "project"
    HOMEWORK = "homework"

# Base schemas
class AssignmentBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = None
    assignment_type: AssignmentType = AssignmentType.HOMEWORK
    instructions: Optional[str] = None
    due_date: Optional[datetime] = None
    max_points: int = Field(default=100, ge=1, le=1000)

class AssignmentCreate(AssignmentBase):
    class_id: int

class AssignmentUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = None
    assignment_type: Optional[AssignmentType] = None
    instructions: Optional[str] = None
    due_date: Optional[datetime] = None
    max_points: Optional[int] = Field(None, ge=1, le=1000)

class AssignmentResponse(AssignmentBase):
    id: int
    class_id: int
    created_by_teacher_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AssignmentWithSubmissions(AssignmentResponse):
    submissions: List["SubmissionResponse"] = []

class AssignmentStats(BaseModel):
    total_submissions: int
    graded_submissions: int
    average_grade: Optional[float]
    completion_rate: float

# Import here to avoid circular imports
from .submission import SubmissionResponse
AssignmentWithSubmissions.model_rebuild()
