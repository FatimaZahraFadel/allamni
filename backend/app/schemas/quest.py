"""
Quest schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum

class QuestType(str, Enum):
    FILL_IN_BLANK = "fill_in_blank"
    REORDER = "reorder"
    DICTATION = "dictation"
    MULTIPLE_CHOICE = "multiple_choice"
    MATCHING = "matching"

class QuestDifficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

# Base schemas
class QuestBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = None
    quest_type: QuestType
    difficulty: QuestDifficulty = QuestDifficulty.EASY
    subject: Optional[str] = Field(None, max_length=100)
    grade_level: Optional[str] = Field(None, max_length=50)
    content_json: Dict[str, Any]
    points_reward: int = Field(default=10, ge=1, le=100)

class QuestCreate(QuestBase):
    pass

class QuestUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = None
    difficulty: Optional[QuestDifficulty] = None
    subject: Optional[str] = Field(None, max_length=100)
    grade_level: Optional[str] = Field(None, max_length=50)
    content_json: Optional[Dict[str, Any]] = None
    points_reward: Optional[int] = Field(None, ge=1, le=100)
    is_active: Optional[bool] = None

class QuestResponse(QuestBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class QuestAttemptCreate(BaseModel):
    quest_id: int
    answer_data: Dict[str, Any]

class QuestAttemptResponse(BaseModel):
    id: int
    quest_id: int
    student_id: int
    answer_data: Dict[str, Any]
    is_correct: bool
    points_earned: int
    time_taken: Optional[int] = None
    attempted_at: datetime

    class Config:
        from_attributes = True

class QuestAttemptResult(BaseModel):
    is_correct: bool
    points_earned: int
    correct_answer: Dict[str, Any]
    explanation: Optional[str] = None

class QuestProgress(BaseModel):
    total_quests: int
    completed_quests: int
    total_points: int
    accuracy_rate: float
