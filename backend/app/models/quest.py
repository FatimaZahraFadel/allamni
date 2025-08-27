"""
Quest models for mini-games and exercises
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON, Enum, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from ..core.database import Base

class QuestType(str, enum.Enum):
    FILL_IN_BLANK = "fill_in_blank"
    REORDER = "reorder"
    DICTATION = "dictation"
    MULTIPLE_CHOICE = "multiple_choice"
    MATCHING = "matching"

class QuestDifficulty(str, enum.Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class Quest(Base):
    __tablename__ = "quests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    quest_type = Column(Enum(QuestType), nullable=False)
    difficulty = Column(Enum(QuestDifficulty), default=QuestDifficulty.EASY)
    subject = Column(String(100), nullable=True)  # e.g. "French", "Arabic", "Math"
    grade_level = Column(String(50), nullable=True)
    content_json = Column(JSON, nullable=False)  # Multilingual content and quest data
    points_reward = Column(Integer, default=10)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    quest_attempts = relationship("QuestAttempt", back_populates="quest")

    def __repr__(self):
        return f"<Quest(id={self.id}, title='{self.title}', type='{self.quest_type}')>"

class QuestAttempt(Base):
    __tablename__ = "quest_attempts"

    id = Column(Integer, primary_key=True, index=True)
    quest_id = Column(Integer, ForeignKey("quests.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    answer_data = Column(JSON, nullable=False)  # Student's answers
    is_correct = Column(Boolean, nullable=False)
    points_earned = Column(Integer, default=0)
    time_taken = Column(Integer, nullable=True)  # in seconds
    attempted_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    quest = relationship("Quest", back_populates="quest_attempts")
    student = relationship("User")

    def __repr__(self):
        return f"<QuestAttempt(id={self.id}, quest_id={self.quest_id}, student_id={self.student_id})>"
