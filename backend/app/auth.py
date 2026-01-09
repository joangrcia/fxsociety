from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import settings

# Auth Config
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
# Use Argon2 instead of bcrypt to avoid version issues and length limits
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


# Password Utils
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


# Token Utils
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def verify_admin_credentials(form_data: OAuth2PasswordRequestForm):
    """Verify ENV-based admin credentials."""
    if (
        form_data.username == settings.ADMIN_USERNAME
        and form_data.password == settings.ADMIN_PASSWORD
    ):
        return True
    return False


# Dependencies
def get_current_admin(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        username: str = payload.get("sub")
        role: str = payload.get("role")

        if username is None or role != "admin":
            raise credentials_exception

        # For admin, strict check against ENV
        if username != settings.ADMIN_USERNAME:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    return username


def get_current_user(token: str = Depends(oauth2_scheme)):
    """Validate regular user token (stateless)."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get("sub")
        role: str = payload.get("role")

        if email is None or role != "user":
            raise credentials_exception

        return email

    except JWTError:
        raise credentials_exception
