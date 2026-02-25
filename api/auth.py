# pyright: reportMissingTypeStubs=false, reportUnknownMemberType=false, reportUnknownVariableType=false, reportImplicitOverride=false, reportAttributeAccessIssue=false, reportUnknownArgumentType=false, reportUnusedCallResult=false

from typing import NoReturn, cast

from django.conf import settings
from django.db.models.functions import Lower
from django.utils import timezone
from passlib.context import CryptContext
from rest_framework import serializers, status
from rest_framework.exceptions import APIException
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.throttling import SimpleRateThrottle
from rest_framework.views import APIView

from legacydb.models import Order, User

from .authentication import JWTUser
from .jwt import create_access_token
from .permissions import IsJWTUser

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


class UserCreateSerializer(serializers.Serializer[dict[str, object]]):
    email: serializers.EmailField = serializers.EmailField()
    full_name: serializers.CharField = serializers.CharField(
        required=False, allow_null=True, allow_blank=True
    )
    password: serializers.CharField = serializers.CharField(write_only=True)
    is_active: serializers.BooleanField = serializers.BooleanField(default=True)


class UserResponseSerializer(serializers.ModelSerializer[User]):
    class Meta:
        model: type[User] = User
        fields: tuple[str, ...] = (
            "id",
            "email",
            "full_name",
            "is_active",
            "created_at",
        )


class LoginRateLimitExceeded(APIException):
    status_code: int = status.HTTP_429_TOO_MANY_REQUESTS
    default_detail: str = "Too many login attempts. Please try again later."


class LoginRateThrottle(SimpleRateThrottle):
    scope: str = "login"
    rate: str = "5/min"

    def get_cache_key(self, request: Request, view: APIView) -> str:
        ident = self.get_ident(request)
        return self.cache_format % {"scope": self.scope, "ident": ident}


class LoginView(APIView):
    authentication_classes: list[type] = []
    permission_classes: list[type] = []
    throttle_classes: list[type[LoginRateThrottle]] = [LoginRateThrottle]

    def post(self, request: Request) -> Response:
        request_data = cast(dict[str, object], request.data)
        username = str(request_data.get("username") or request.POST.get("username", ""))
        password = str(request_data.get("password") or request.POST.get("password", ""))

        if verify_admin_credentials(username=username, password=password):
            return Response(
                {
                    "access_token": create_admin_access_token(username),
                    "token_type": "bearer",
                }
            )

        email = username.lower()
        user = User.objects.filter(email=email).first()
        if user is not None and verify_password(password, user.password_hash):
            if not user.is_active:
                return Response(
                    {"detail": "Akun tidak aktif"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            (
                Order.objects.annotate(email_lower=Lower("email"))
                .filter(email_lower=email, user__isnull=True)
                .update(user_id=user.id)
            )

            return Response(
                {
                    "access_token": create_user_access_token(user.email),
                    "token_type": "bearer",
                }
            )

        return Response(
            {"detail": "Email atau password salah"},
            status=status.HTTP_401_UNAUTHORIZED,
            headers={"WWW-Authenticate": "Bearer"},
        )

    def throttled(self, request: Request, wait: int | None) -> NoReturn:
        raise LoginRateLimitExceeded()


class RegisterView(APIView):
    authentication_classes: list[type] = []
    permission_classes: list[type] = []

    def post(self, request: Request) -> Response:
        serializer = UserCreateSerializer(data=request.data)
        _ = serializer.is_valid(raise_exception=True)

        validated_data_raw = serializer.validated_data
        if not isinstance(validated_data_raw, dict):
            return Response(
                {"detail": "Invalid payload"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        validated_data = cast(dict[str, object], validated_data_raw)
        email = str(validated_data.get("email", "")).lower()

        if User.objects.filter(email=email).exists():
            return Response(
                {"detail": "Email sudah terdaftar"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.create(
                email=email,
                full_name=validated_data.get("full_name"),
                password_hash=get_password_hash(str(validated_data.get("password", ""))),
                is_active=bool(validated_data.get("is_active", True)),
                created_at=timezone.now(),
            )
            return Response(UserResponseSerializer(user).data)
        except Exception as e:
            return Response({"detail": f"Database error: {str(e)}"}, status=500)


class MeView(APIView):
    permission_classes: list[type] = [IsAuthenticated, IsJWTUser]

    def get(self, request: Request) -> Response:
        jwt_user = request.user
        if not isinstance(jwt_user, JWTUser):
            return Response(
                {"detail": "Could not validate credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
                headers={"WWW-Authenticate": "Bearer"},
            )

        user = User.objects.filter(email=jwt_user.subject).first()
        if user is None:
            return Response(
                {"detail": "User not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(UserResponseSerializer(user).data)
