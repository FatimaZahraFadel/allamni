"""
Subscriptions router - Teacher payment and subscription management
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List

from ..core.database import get_db
from ..core.security import require_teacher, get_current_active_user
from ..core.config import settings
from ..models.user import User, SubscriptionStatus
from ..models.subscription import Subscription, SubscriptionPlan, PaymentStatus
from ..schemas.subscription import (
    SubscriptionCreate, SubscriptionUpdate, SubscriptionResponse,
    PaymentCreate, PaymentResponse
)

router = APIRouter()

@router.post("/", response_model=SubscriptionResponse, status_code=status.HTTP_201_CREATED)
async def create_subscription(
    subscription_data: SubscriptionCreate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Create a new subscription for teacher"""
    # Check if teacher already has a subscription
    existing = db.query(Subscription).filter(Subscription.teacher_id == current_user.id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Teacher already has a subscription"
        )
    
    # Calculate price based on plan
    price = settings.TEACHER_SUBSCRIPTION_PRICE
    if subscription_data.plan == SubscriptionPlan.YEARLY:
        price = price * 12 * 0.9  # 10% discount for yearly
    
    # Create subscription
    subscription = Subscription(
        teacher_id=current_user.id,
        plan=subscription_data.plan,
        price=price,
        payment_info=subscription_data.payment_info,
        status=PaymentStatus.PENDING
    )
    
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    
    return SubscriptionResponse.from_orm(subscription)

@router.get("/", response_model=SubscriptionResponse)
async def get_subscription(
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Get teacher's subscription"""
    subscription = db.query(Subscription).filter(Subscription.teacher_id == current_user.id).first()
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No subscription found"
        )
    
    return SubscriptionResponse.from_orm(subscription)

@router.put("/", response_model=SubscriptionResponse)
async def update_subscription(
    subscription_update: SubscriptionUpdate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Update teacher's subscription"""
    subscription = db.query(Subscription).filter(Subscription.teacher_id == current_user.id).first()
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No subscription found"
        )
    
    # Update subscription fields
    update_data = subscription_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(subscription, field, value)
    
    # Recalculate price if plan changed
    if subscription_update.plan:
        price = settings.TEACHER_SUBSCRIPTION_PRICE
        if subscription_update.plan == SubscriptionPlan.YEARLY:
            price = price * 12 * 0.9
        subscription.price = price
    
    db.commit()
    db.refresh(subscription)
    
    return SubscriptionResponse.from_orm(subscription)

@router.post("/payment", response_model=PaymentResponse)
async def process_payment(
    payment_data: PaymentCreate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Process subscription payment (mock implementation)"""
    subscription = db.query(Subscription).filter(
        Subscription.id == payment_data.subscription_id,
        Subscription.teacher_id == current_user.id
    ).first()
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found"
        )
    
    # Mock payment processing
    success = True  # In production, this would integrate with actual payment gateway
    transaction_id = f"txn_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
    
    if success:
        # Update subscription status
        subscription.status = PaymentStatus.COMPLETED
        subscription.start_date = datetime.utcnow()
        
        # Set end date based on plan
        if subscription.plan == SubscriptionPlan.MONTHLY:
            subscription.end_date = subscription.start_date + timedelta(days=30)
        else:  # YEARLY
            subscription.end_date = subscription.start_date + timedelta(days=365)
        
        # Update user subscription status
        current_user.subscription_status = SubscriptionStatus.ACTIVE
        
        db.commit()
        db.refresh(subscription)
        
        return PaymentResponse(
            success=True,
            transaction_id=transaction_id,
            message="Payment processed successfully",
            subscription=SubscriptionResponse.from_orm(subscription)
        )
    else:
        subscription.status = PaymentStatus.FAILED
        db.commit()
        
        return PaymentResponse(
            success=False,
            transaction_id=transaction_id,
            message="Payment failed",
            subscription=SubscriptionResponse.from_orm(subscription)
        )

@router.post("/cancel")
async def cancel_subscription(
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Cancel teacher's subscription"""
    subscription = db.query(Subscription).filter(Subscription.teacher_id == current_user.id).first()
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No subscription found"
        )
    
    # Cancel subscription
    subscription.status = PaymentStatus.CANCELLED
    subscription.auto_renew = False
    current_user.subscription_status = SubscriptionStatus.EXPIRED
    
    db.commit()
    
    return {"message": "Subscription cancelled successfully"}

@router.post("/renew", response_model=SubscriptionResponse)
async def renew_subscription(
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Renew teacher's subscription"""
    subscription = db.query(Subscription).filter(Subscription.teacher_id == current_user.id).first()
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No subscription found"
        )
    
    # Mock renewal process
    if subscription.auto_renew and subscription.status == PaymentStatus.COMPLETED:
        # Extend subscription period
        if subscription.plan == SubscriptionPlan.MONTHLY:
            subscription.end_date = subscription.end_date + timedelta(days=30)
        else:  # YEARLY
            subscription.end_date = subscription.end_date + timedelta(days=365)
        
        current_user.subscription_status = SubscriptionStatus.ACTIVE
        db.commit()
        db.refresh(subscription)
        
        return SubscriptionResponse.from_orm(subscription)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot renew subscription"
        )

@router.get("/status")
async def get_subscription_status(
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Get subscription status and details"""
    subscription = db.query(Subscription).filter(Subscription.teacher_id == current_user.id).first()
    
    if not subscription:
        return {
            "has_subscription": False,
            "status": "none",
            "message": "No subscription found"
        }
    
    # Check if subscription is expired
    now = datetime.utcnow()
    is_expired = subscription.end_date and subscription.end_date < now
    
    if is_expired and subscription.status == PaymentStatus.COMPLETED:
        subscription.status = PaymentStatus.CANCELLED
        current_user.subscription_status = SubscriptionStatus.EXPIRED
        db.commit()
    
    return {
        "has_subscription": True,
        "status": subscription.status,
        "plan": subscription.plan,
        "price": subscription.price,
        "start_date": subscription.start_date,
        "end_date": subscription.end_date,
        "auto_renew": subscription.auto_renew,
        "days_remaining": (subscription.end_date - now).days if subscription.end_date else 0
    }
