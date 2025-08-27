"""
Progress tracking models
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from ..core.database import Base

class ProgressStats(Base):
    __tablename__ = "progress_stats"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    lessons_completed = Column(Integer, default=0)
    quests_completed = Column(Integer, default=0)
    streak_days = Column(Integer, default=0)
    stars_earned = Column(Integer, default=0)
    last_activity_date = Column(DateTime(timezone=True), nullable=True)
    total_time_spent = Column(Integer, default=0)  # in minutes
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    student = relationship("User", back_populates="progress_stats")

    def __repr__(self):
        return f"<ProgressStats(student_id={self.student_id}, stars={self.stars_earned})>"
