# pyright: reportMissingTypeStubs=false

from typing import cast

from django.conf import settings
from passlib.context import CryptContext

from .jwt import create_access_token

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_admin_credentials(username: str, password: str) -> bool:
    admin_username = cast(str, settings.ADMIN_USERNAME)
    admin_password = cast(str, settings.ADMIN_PASSWORD)
    return username == admin_username and password == admin_password


def create_user_access_token(email: str) -> str:
    return create_access_token(data={"sub": email, "role": "user"})


def create_admin_access_token(username: str) -> str:
    return create_access_token(data={"sub": username, "role": "admin"})
