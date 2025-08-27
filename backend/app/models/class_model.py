"""
Class model
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from ..core.database import Base

class Class(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=False)
    name = Column(String(200), nullable=False)  # e.g. "French 4ème primaire groupe A"
    description = Column(String(500), nullable=True)
    subject = Column(String(100), nullable=True)  # e.g. "French", "Math", "Arabic"
    grade_level = Column(String(50), nullable=True)  # e.g. "4ème primaire"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    school = relationship("School", back_populates="classes")
    student_classes = relationship("StudentClass", back_populates="class_obj")
    assignments = relationship("Assignment", back_populates="class_obj", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Class(id={self.id}, name='{self.name}', school_id={self.school_id})>"

class StudentClass(Base):
    """Many-to-many relationship between students and classes"""
    __tablename__ = "student_classes"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    enrolled_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    student = relationship("User", back_populates="student_classes")
    class_obj = relationship("Class", back_populates="student_classes")

    def __repr__(self):
        return f"<StudentClass(student_id={self.student_id}, class_id={self.class_id})>"
