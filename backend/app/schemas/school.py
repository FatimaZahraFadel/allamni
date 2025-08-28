"""
School schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Base schemas
class SchoolBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = Field(None, max_length=500)

class SchoolCreate(SchoolBase):
    pass

class SchoolUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = Field(None, max_length=500)

class SchoolResponse(SchoolBase):
    id: int
    teacher_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SchoolWithClasses(SchoolResponse):
    classes: List["ClassResponse"] = []

class SchoolWithCounts(SchoolResponse):
    class_count: int = 0
    student_count: int = 0

# Import here to avoid circular imports
from .class_schema import ClassResponse
SchoolWithClasses.model_rebuild()
