"""
Authentication router
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..core.security import get_current_active_user, verify_token
from ..schemas.user import UserCreate, UserLogin, Token, TokenRefresh, PasswordChange, UserResponse
from ..services.auth_service import AuthService

router = APIRouter()

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    user = AuthService.create_user(db, user_data)
    tokens = AuthService.create_tokens(user)
    
    return Token(
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        token_type=tokens["token_type"],
        user=UserResponse.from_orm(user)
    )

@router.post("/login", response_model=Token)
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    user = AuthService.authenticate_user(db, login_data)
    tokens = AuthService.create_tokens(user)
    
    return Token(
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        token_type=tokens["token_type"],
        user=UserResponse.from_orm(user)
    )

@router.post("/refresh", response_model=dict)
async def refresh_token(token_data: TokenRefresh, db: Session = Depends(get_db)):
    """Refresh access token"""
    payload = verify_token(token_data.refresh_token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    from ..models.user import User
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    tokens = AuthService.create_tokens(user)
    return {
        "access_token": tokens["access_token"],
        "token_type": tokens["token_type"]
    }

@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Change user password"""
    AuthService.change_password(
        db, current_user, password_data.current_password, password_data.new_password
    )
    return {"message": "Password changed successfully"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_active_user)):
    """Get current user information"""
    return UserResponse.from_orm(current_user)
