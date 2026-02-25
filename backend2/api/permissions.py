"""DRF permission helpers for JWT role-based access."""

# pyright: reportMissingTypeStubs=false, reportMissingImports=false, reportIncompatibleMethodOverride=false, reportImplicitOverride=false, reportUnknownMemberType=false, reportUnknownVariableType=false, reportUnknownParameterType=false, reportUnknownArgumentType=false

from typing import cast

from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import BasePermission
from rest_framework.request import Request

from .authentication import JWTUser


def _jwt_user(request: Request) -> JWTUser | None:
    user = request.user
    if isinstance(user, JWTUser) and user.is_authenticated:
        return user
    return None


class IsJWTAdmin(BasePermission):
    """Allow access only for valid admin JWT identity."""

    def has_permission(self, request: Request, view: object) -> bool:
        user = _jwt_user(request)
        if user is None:
            return False
        admin_username = cast(str, settings.ADMIN_USERNAME)
        if user.role != "admin" or user.subject != admin_username:
            raise AuthenticationFailed("Could not validate credentials")
        return True


class IsJWTUser(BasePermission):
    """Allow access only for regular user JWT identity."""

    def has_permission(self, request: Request, view: object) -> bool:
        user = _jwt_user(request)
        if user is None:
            return False
        if user.role != "user" or user.subject == "":
            raise AuthenticationFailed("Could not validate credentials")
        return True
