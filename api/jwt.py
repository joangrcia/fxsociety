"""JWT helpers aligned with FastAPI implementation."""

# pyright: reportMissingTypeStubs=false, reportUnknownMemberType=false, reportUnknownVariableType=false

from datetime import UTC, datetime, timedelta
from typing import Protocol, cast

from django.conf import settings
from jose import jwt


class _JWTSettings(Protocol):
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    JWT_ISSUER: str
    JWT_AUDIENCE: str


def _jwt_settings() -> _JWTSettings:
    return cast(_JWTSettings, cast(object, settings))


def _get_secret_key() -> str:
    secret_key = _jwt_settings().SECRET_KEY
    if not secret_key:
        raise RuntimeError("SECRET_KEY must be configured")
    return secret_key


def _get_algorithm() -> str:
    algorithm = _jwt_settings().ALGORITHM
    if not algorithm:
        raise RuntimeError("ALGORITHM must be configured")
    return algorithm


def _get_access_token_expire_minutes() -> int:
    minutes = _jwt_settings().ACCESS_TOKEN_EXPIRE_MINUTES
    if minutes <= 0:
        raise RuntimeError("ACCESS_TOKEN_EXPIRE_MINUTES must be configured")
    return minutes


def _get_jwt_issuer() -> str:
    issuer = _jwt_settings().JWT_ISSUER
    if not issuer:
        raise RuntimeError("JWT_ISSUER must be configured")
    return issuer


def _get_jwt_audience() -> str:
    audience = _jwt_settings().JWT_AUDIENCE
    if not audience:
        raise RuntimeError("JWT_AUDIENCE must be configured")
    return audience


def create_access_token(
    data: dict[str, object], expires_delta: timedelta | None = None
) -> str:
    to_encode = data.copy()

    now = datetime.now(UTC)
    if expires_delta is None:
        expires_delta = timedelta(minutes=_get_access_token_expire_minutes())

    to_encode.update(
        {
            "exp": now + expires_delta,
            "iat": now,
            "iss": _get_jwt_issuer(),
            "aud": _get_jwt_audience(),
        }
    )

    return jwt.encode(to_encode, _get_secret_key(), algorithm=_get_algorithm())


def verify_access_token(token: str) -> dict[str, object]:
    payload = jwt.decode(
        token,
        _get_secret_key(),
        algorithms=[_get_algorithm()],
        audience=_get_jwt_audience(),
        issuer=_get_jwt_issuer(),
    )
    return cast(dict[str, object], payload)
