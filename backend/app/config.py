import os
import sys
import warnings
from typing import List, Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings


def _is_dev_mode() -> bool:
    """Check if running in development mode."""
    return os.getenv("ENVIRONMENT", "development").lower() in ("development", "dev")


class Settings(BaseSettings):
    PROJECT_NAME: str = "fxsociety API"
    ENVIRONMENT: str = "development"

    # Security
    SECRET_KEY: Optional[str] = None
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    # JWT Claims
    JWT_ISSUER: str = "fxsociety"
    JWT_AUDIENCE: str = "fxsociety-client"

    # Admin Credentials - NO DEFAULTS
    ADMIN_USERNAME: Optional[str] = None
    ADMIN_PASSWORD: Optional[str] = None

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

    def _validate_required_settings(self) -> None:
        """Validate that required settings are properly configured.

        In production: Hard-fail if critical settings are missing.
        In development: Use insecure defaults with loud warnings.
        """
        is_dev = _is_dev_mode()
        warnings.simplefilter("always", UserWarning)
        errors = []

        # SECRET_KEY validation
        if not self.SECRET_KEY:
            if is_dev:
                # Use insecure default for local development only
                object.__setattr__(
                    self, "SECRET_KEY", "insecure-dev-key-DO-NOT-USE-IN-PRODUCTION"
                )
                warnings.warn(
                    "\n\n!!! DEV MODE: Using insecure SECRET_KEY !!!\n"
                    "Set 'SECRET_KEY' environment variable for production.\n"
                )
            else:
                errors.append(
                    "SECRET_KEY is required in production. Set it in environment variables."
                )

        # ADMIN_USERNAME validation
        if not self.ADMIN_USERNAME:
            if is_dev:
                object.__setattr__(self, "ADMIN_USERNAME", "dev_admin")
                warnings.warn(
                    "\n\n!!! DEV MODE: Using default ADMIN_USERNAME='dev_admin' !!!\n"
                    "Set 'ADMIN_USERNAME' environment variable for production.\n"
                )
            else:
                errors.append(
                    "ADMIN_USERNAME is required in production. Set it in environment variables."
                )

        # ADMIN_PASSWORD validation
        if not self.ADMIN_PASSWORD:
            if is_dev:
                object.__setattr__(self, "ADMIN_PASSWORD", "dev_password_123")
                warnings.warn(
                    "\n\n!!! DEV MODE: Using default ADMIN_PASSWORD !!!\n"
                    "Set 'ADMIN_PASSWORD' environment variable for production.\n"
                )
            else:
                errors.append(
                    "ADMIN_PASSWORD is required in production. Set it in environment variables."
                )

        # Hard-fail in production if any required settings are missing
        if errors:
            print("\n" + "=" * 60, file=sys.stderr)
            print("FATAL: Missing required configuration", file=sys.stderr)
            print("=" * 60, file=sys.stderr)
            for error in errors:
                print(f"  - {error}", file=sys.stderr)
            print(
                "\nSet ENVIRONMENT=development to use insecure defaults for local dev.",
                file=sys.stderr,
            )
            print("=" * 60 + "\n", file=sys.stderr)
            sys.exit(1)

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
settings._validate_required_settings()
