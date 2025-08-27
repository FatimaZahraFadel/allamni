"""
Correction schemas for Write & Fix feature
"""

from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class CorrectionCreate(BaseModel):
    text_content: Optional[str] = None  # Direct text input

class CorrectionResponse(BaseModel):
    id: int
    student_id: int
    uploaded_image_url: Optional[str] = None
    original_text: Optional[str] = None
    corrected_text: Optional[str] = None
    corrections_data: Optional[Dict[str, Any]] = None
    feedback: Optional[str] = None
    ai_score: Optional[float] = None
    mini_lesson_data: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class CorrectionResult(BaseModel):
    original_text: str
    corrected_text: str
    corrections: List[Dict[str, Any]]
    feedback: str
    score: float
    mini_lesson: Dict[str, Any]
    suggestions: List[str]

class DictationCheck(BaseModel):
    text: str

class DictationResult(BaseModel):
    original_text: str
    corrected_text: str
    errors: List[Dict[str, Any]]
    score: float
    feedback: str
