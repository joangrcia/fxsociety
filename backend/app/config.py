import os
import secrets
import warnings
from typing import List
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "fxsociety API"

    # Security
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY", "insecure-dev-key-change-this-immediately"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    # Admin Credentials
    # Defaulting to None/Empty to enforce explicit setting or warn
    ADMIN_USERNAME: str = os.getenv("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "admin123")

    # CORS
    # Default to localhost for dev
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://localhost:3000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    def check_security(self):
        warnings.simplefilter("always", UserWarning)
        if self.SECRET_KEY == "insecure-dev-key-change-this-immediately":
            warnings.warn(
                "\n\n!!! CRITICAL SECURITY WARNING !!!\n"
                "You are using the default insecure SECRET_KEY.\n"
                "Set 'SECRET_KEY' in your environment variables for production.\n"
            )

        if self.ADMIN_PASSWORD == "admin123":
            warnings.warn(
                "\n\n!!! SECURITY WARNING !!!\n"
                "You are using the default ADMIN_PASSWORD ('admin123').\n"
                "Set 'ADMIN_PASSWORD' in your environment variables.\n"
            )

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
settings.check_security()
