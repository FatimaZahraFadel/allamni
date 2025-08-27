"""
Subscription model for teacher payments
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, JSON, Enum, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from ..core.database import Base

class SubscriptionPlan(str, enum.Enum):
    MONTHLY = "monthly"
    YEARLY = "yearly"

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    plan = Column(Enum(SubscriptionPlan), default=SubscriptionPlan.MONTHLY)
    price = Column(Float, nullable=False)  # 189 MAD for monthly
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    payment_info = Column(JSON, nullable=True)  # Mock payment data for MVP
    start_date = Column(DateTime(timezone=True), nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)
    auto_renew = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    teacher = relationship("User", back_populates="subscription")

    def __repr__(self):
        return f"<Subscription(id={self.id}, teacher_id={self.teacher_id}, plan='{self.plan}')>"
