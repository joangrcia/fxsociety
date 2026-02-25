import json
import os
import warnings
from pathlib import Path
from typing import TypedDict, cast
from urllib.parse import unquote, urlparse

DEV_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://localhost:3000",
]


class RuntimeConfig(TypedDict):
    ENVIRONMENT: str
    SECRET_KEY: str
    ADMIN_USERNAME: str
    ADMIN_PASSWORD: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    JWT_ISSUER: str
    JWT_AUDIENCE: str
    CORS_ALLOWED_ORIGINS: list[str]
    DATABASE_URL: str
    DATABASES: dict[str, dict[str, str]]


def is_dev_environment() -> bool:
    return os.getenv("ENVIRONMENT", "development").lower() in ("development", "dev")


def parse_cors_origins(value: str | list[str] | None) -> list[str]:
    if value is None:
        return DEV_CORS_ORIGINS

    if isinstance(value, list):
        return [item.strip() for item in value if item.strip()]

    raw = value.strip()
    if not raw:
        return []

    if raw.startswith("["):
        try:
            parsed_obj: object = json.loads(raw)  # pyright: ignore[reportAny]
        except json.JSONDecodeError as exc:
            raise RuntimeError(
                "Invalid CORS_ORIGINS JSON. Use a JSON list or comma-separated string."
            ) from exc

        if not isinstance(parsed_obj, list):
            raise RuntimeError("CORS_ORIGINS JSON must be a list of strings.")

        parsed_items = cast(list[object], parsed_obj)
        if any(not isinstance(item, str) for item in parsed_items):
            raise RuntimeError("CORS_ORIGINS JSON must be a list of strings.")

        parsed_list = cast(list[str], parsed_items)
        return [item.strip() for item in parsed_list if item.strip()]

    return [item.strip() for item in raw.split(",") if item.strip()]


def select_database_url(base_dir: Path) -> str:
    env_database_url = os.getenv("DATABASE_URL")
    if env_database_url:
        return env_database_url

    if os.getenv("VERCEL"):
        return "sqlite:////tmp/fxsociety.db"

    # Match backend/app/database.py default path: <repo>/backend/fxsociety.db
    shared_backend_db = base_dir.parent / "backend" / "fxsociety.db"
    return f"sqlite:///{shared_backend_db}"

def database_config_from_url(database_url: str) -> dict[str, str]:
    normalized = database_url.strip()
    if normalized.startswith("postgres://"):
        normalized = normalized.replace("postgres://", "postgresql://", 1)

    parsed = urlparse(normalized)

    if parsed.scheme == "sqlite":
        sqlite_path = unquote(parsed.path or "")
        if parsed.netloc:
            sqlite_path = f"//{parsed.netloc}{sqlite_path}"
        return {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": sqlite_path,
        }

    if parsed.scheme in ("postgres", "postgresql"):
        return {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": parsed.path.lstrip("/"),
            "USER": unquote(parsed.username or ""),
            "PASSWORD": unquote(parsed.password or ""),
            "HOST": parsed.hostname or "",
            "PORT": str(parsed.port or ""),
        }

    raise RuntimeError(
        "Unsupported DATABASE_URL scheme. Use sqlite:///... or postgresql://..."
    )


def load_runtime_config() -> RuntimeConfig:
    is_dev = is_dev_environment()
    errors: list[str] = []

    secret_key = os.getenv("SECRET_KEY")
    admin_username = os.getenv("ADMIN_USERNAME")
    admin_password = os.getenv("ADMIN_PASSWORD")

    if not secret_key:
        if is_dev:
            secret_key = "insecure-dev-key-DO-NOT-USE-IN-PRODUCTION"
            warnings.warn(
                "DEV MODE: Using insecure SECRET_KEY. Set SECRET_KEY in production.",
                UserWarning,
                stacklevel=2,
            )
        else:
            errors.append("SECRET_KEY is required in production.")

    if not admin_username:
        if is_dev:
            admin_username = "dev_admin"
            warnings.warn(
                "DEV MODE: Using default ADMIN_USERNAME='dev_admin'. Set ADMIN_USERNAME in production.",
                UserWarning,
                stacklevel=2,
            )
        else:
            errors.append("ADMIN_USERNAME is required in production.")

    if not admin_password:
        if is_dev:
            admin_password = "dev_password_123"
            warnings.warn(
                "DEV MODE: Using default ADMIN_PASSWORD. Set ADMIN_PASSWORD in production.",
                UserWarning,
                stacklevel=2,
            )
        else:
            errors.append("ADMIN_PASSWORD is required in production.")

    if errors:
        details = " ".join(errors)
        raise RuntimeError(
            f"Missing required configuration for production. {details} Set ENVIRONMENT=development to use insecure local defaults."
        )

    assert secret_key is not None
    assert admin_username is not None
    assert admin_password is not None

    database_url = select_database_url(Path(__file__).resolve().parent.parent)

    environment = os.getenv("ENVIRONMENT") or "development"
    algorithm = os.getenv("ALGORITHM") or "HS256"
    jwt_issuer = os.getenv("JWT_ISSUER") or "fxsociety"
    jwt_audience = os.getenv("JWT_AUDIENCE") or "fxsociety-client"

    return {
        "ENVIRONMENT": environment,
        "SECRET_KEY": secret_key,
        "ADMIN_USERNAME": admin_username,
        "ADMIN_PASSWORD": admin_password,
        "ALGORITHM": algorithm,
        "ACCESS_TOKEN_EXPIRE_MINUTES": int(
            os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", str(60 * 24))
        ),
        "JWT_ISSUER": jwt_issuer,
        "JWT_AUDIENCE": jwt_audience,
        "CORS_ALLOWED_ORIGINS": parse_cors_origins(os.getenv("CORS_ORIGINS")),
        "DATABASE_URL": database_url,
        "DATABASES": {"default": database_config_from_url(database_url)},
    }
