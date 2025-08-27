"""
Submission model
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from ..core.database import Base

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    file_url = Column(String(500), nullable=True)  # Path to uploaded file
    text_content = Column(Text, nullable=True)  # Direct text submission
    grade = Column(Float, nullable=True)  # 0-100 scale
    feedback = Column(Text, nullable=True)
    is_graded = Column(Boolean, default=False)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    graded_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("User", back_populates="submissions")

    def __repr__(self):
        return f"<Submission(id={self.id}, assignment_id={self.assignment_id}, student_id={self.student_id})>"
