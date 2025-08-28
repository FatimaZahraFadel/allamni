"""
Class schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Base schemas
class ClassBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = Field(None, max_length=500)
    subject: Optional[str] = Field(None, max_length=100)
    grade_level: Optional[str] = Field(None, max_length=50)

class ClassCreate(ClassBase):
    school_id: int

class ClassUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = Field(None, max_length=500)
    subject: Optional[str] = Field(None, max_length=100)
    grade_level: Optional[str] = Field(None, max_length=50)

class ClassResponse(ClassBase):
    id: int
    school_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ClassWithStudentCount(ClassResponse):
    student_count: int
    school_name: Optional[str] = None

class StudentClassCreate(BaseModel):
    student_id: int
    class_id: int

class StudentClassResponse(BaseModel):
    id: int
    student_id: int
    class_id: int
    enrolled_at: datetime

    class Config:
        from_attributes = True

class ClassWithStudents(ClassResponse):
    students: List["UserResponse"] = []

class ClassStats(BaseModel):
    total_students: int
    total_assignments: int
    average_grade: Optional[float]
    completion_rate: float

# Import here to avoid circular imports
from .user import UserResponse
ClassWithStudents.model_rebuild()
