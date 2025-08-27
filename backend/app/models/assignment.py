"""
Assignment model
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from ..core.database import Base

class AssignmentType(str, enum.Enum):
    ESSAY = "essay"
    EXERCISE = "exercise"
    QUIZ = "quiz"
    PROJECT = "project"
    HOMEWORK = "homework"

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    created_by_teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    assignment_type = Column(Enum(AssignmentType), default=AssignmentType.HOMEWORK)
    instructions = Column(Text, nullable=True)
    due_date = Column(DateTime(timezone=True), nullable=True)
    max_points = Column(Integer, default=100)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    class_obj = relationship("Class", back_populates="assignments")
    teacher = relationship("User", back_populates="assignments_created")
    submissions = relationship("Submission", back_populates="assignment", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Assignment(id={self.id}, title='{self.title}', class_id={self.class_id})>"
