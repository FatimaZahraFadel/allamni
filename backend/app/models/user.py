"""
User model
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from ..core.database import Base

class UserRole(str, enum.Enum):
    STUDENT = "student"
    TEACHER = "teacher"

class LanguagePreference(str, enum.Enum):
    ARABIC = "ARABIC"
    FRENCH = "FRENCH"
    ENGLISH = "ENGLISH"

class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    TRIAL = "trial"
    EXPIRED = "expired"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    subscription_status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.INACTIVE)
    language_preference = Column(Enum(LanguagePreference), default=LanguagePreference.ARABIC)
    is_active = Column(Boolean, default=True)
    parent_email = Column(String(255), nullable=True)  # For student accounts
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    schools = relationship("School", back_populates="teacher", cascade="all, delete-orphan")
    student_classes = relationship("StudentClass", back_populates="student")
    assignments_created = relationship("Assignment", back_populates="teacher")
    submissions = relationship("Submission", back_populates="student")
    progress_stats = relationship("ProgressStats", back_populates="student", uselist=False)
    corrections = relationship("Correction", back_populates="student")
    subscription = relationship("Subscription", back_populates="teacher", uselist=False)

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"
