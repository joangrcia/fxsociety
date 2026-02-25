"""DRF authentication backed by existing JWT helpers."""

# pyright: reportMissingTypeStubs=false, reportIncompatibleMethodOverride=false, reportImplicitOverride=false, reportUnknownVariableType=false

from dataclasses import dataclass

from jose import JWTError
from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.request import Request

from api.jwt import verify_access_token


@dataclass(frozen=True)
class JWTUser:
    subject: str
    role: str
    claims: dict[str, object]

    @property
    def is_authenticated(self) -> bool:
        return True

    @property
    def is_anonymous(self) -> bool:
        return False


class JWTAuthentication(BaseAuthentication):
    """Authenticate `Authorization: Bearer <token>` requests."""

    keyword: bytes = b"bearer"

    def authenticate(
        self, request: Request
    ) -> tuple[JWTUser, dict[str, object]] | None:
        auth = get_authorization_header(request).split()
        if not auth:
            return None

        if auth[0].lower() != self.keyword:
            return None

        if len(auth) != 2:
            raise exceptions.AuthenticationFailed("Invalid Authorization header format")

        try:
            token = auth[1].decode("utf-8")
        except UnicodeError as exc:
            raise exceptions.AuthenticationFailed("Invalid token encoding") from exc

        try:
            claims = verify_access_token(token)
        except JWTError as exc:
            raise exceptions.AuthenticationFailed(
                "Could not validate credentials"
            ) from exc

        subject = claims.get("sub")
        role = claims.get("role")
        if not isinstance(subject, str) or not subject:
            raise exceptions.AuthenticationFailed("Invalid token subject")
        if not isinstance(role, str) or role not in {"admin", "user"}:
            raise exceptions.AuthenticationFailed("Invalid token role")

        user = JWTUser(subject=subject, role=role, claims=claims)
        return user, claims

    def authenticate_header(self, request: Request) -> str:
        return "Bearer"
