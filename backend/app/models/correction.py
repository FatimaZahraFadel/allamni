"""
Correction model for Write & Fix feature
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from ..core.database import Base

class Correction(Base):
    __tablename__ = "corrections"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    uploaded_image_url = Column(String(500), nullable=True)  # Path to uploaded image
    original_text = Column(Text, nullable=True)  # OCR extracted text
    corrected_text = Column(Text, nullable=True)  # AI corrected text
    corrections_data = Column(JSON, nullable=True)  # Detailed corrections info
    feedback = Column(Text, nullable=True)  # AI feedback
    ai_score = Column(Float, nullable=True)  # AI assessment score
    mini_lesson_data = Column(JSON, nullable=True)  # Generated mini-lesson
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    student = relationship("User", back_populates="corrections")

    def __repr__(self):
        return f"<Correction(id={self.id}, student_id={self.student_id})>"
