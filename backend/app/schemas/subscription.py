"""
Subscription schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class SubscriptionPlan(str, Enum):
    MONTHLY = "monthly"
    YEARLY = "yearly"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class SubscriptionCreate(BaseModel):
    plan: SubscriptionPlan = SubscriptionPlan.MONTHLY
    payment_info: Dict[str, Any]  # Mock payment data

class SubscriptionUpdate(BaseModel):
    plan: Optional[SubscriptionPlan] = None
    auto_renew: Optional[bool] = None

class SubscriptionResponse(BaseModel):
    id: int
    teacher_id: int
    plan: SubscriptionPlan
    price: float
    status: PaymentStatus
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    auto_renew: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PaymentCreate(BaseModel):
    subscription_id: int
    amount: float
    payment_method: str
    payment_details: Dict[str, Any]

class PaymentResponse(BaseModel):
    success: bool
    transaction_id: str
    message: str
    subscription: SubscriptionResponse
