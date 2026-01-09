from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel

from app.database import get_db
from app.models import User, Order
from app.schemas.user import UserCreate, UserResponse
from app.auth import (
    verify_admin_credentials,
    create_access_token,
    verify_password,
    get_password_hash,
    get_current_user,
)
from app.limiter import login_limiter

router = APIRouter(prefix="/api/auth", tags=["auth"])


class Token(BaseModel):
    access_token: str
    token_type: str


@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    email = user_in.email.lower()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")

    user = User(
        email=email,
        full_name=user_in.full_name,
        password_hash=get_password_hash(user_in.password),
        is_active=user_in.is_active,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return UserResponse.model_validate(user)


@router.post("/login", response_model=Token, dependencies=[Depends(login_limiter)])
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    # 1. Try Admin Login (Env based)
    if verify_admin_credentials(form_data):
        access_token = create_access_token(
            data={"sub": form_data.username, "role": "admin"}
        )
        return {"access_token": access_token, "token_type": "bearer"}

    # 2. Try User Login (DB based)
    email = form_data.username.lower()
    user = db.query(User).filter(User.email == email).first()
    if user and verify_password(form_data.password, user.password_hash):
        if not user.is_active:
            raise HTTPException(status_code=400, detail="Akun tidak aktif")

        # Claim existing orders with matching email
        db.query(Order).filter(
            func.lower(Order.email) == email, Order.user_id == None
        ).update({Order.user_id: user.id}, synchronize_session=False)
        db.commit()

        access_token = create_access_token(data={"sub": user.email, "role": "user"})
        return {"access_token": access_token, "token_type": "bearer"}

    # 3. Failed
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Email atau password salah",
        headers={"WWW-Authenticate": "Bearer"},
    )


@router.get("/me", response_model=UserResponse)
def read_users_me(
    db: Session = Depends(get_db),
    email: str = Depends(get_current_user),
):
    """Get current user profile."""
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse.model_validate(user)
