"""
Submission schemas
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Base schemas
class SubmissionBase(BaseModel):
    text_content: Optional[str] = None

class SubmissionCreate(SubmissionBase):
    assignment_id: int

class SubmissionUpdate(BaseModel):
    text_content: Optional[str] = None

class SubmissionResponse(SubmissionBase):
    id: int
    assignment_id: int
    student_id: int
    file_url: Optional[str] = None
    grade: Optional[float] = None
    feedback: Optional[str] = None
    is_graded: bool
    submitted_at: datetime
    graded_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SubmissionGrade(BaseModel):
    grade: float = Field(..., ge=0, le=100)
    feedback: Optional[str] = None

class SubmissionWithDetails(SubmissionResponse):
    assignment_title: str
    student_name: str
    student_email: str
