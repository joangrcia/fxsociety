# pyright: reportMissingTypeStubs=false, reportUnknownMemberType=false, reportUnknownVariableType=false, reportUnknownArgumentType=false, reportAttributeAccessIssue=false

from django.utils import timezone
from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from api.authentication import JWTAuthentication, JWTUser
from api.permissions import IsJWTAdmin, IsJWTUser
from legacydb.models import Ticket, User


class TicketCreateSerializer(serializers.Serializer[dict[str, object]]):
    title: serializers.CharField = serializers.CharField()
    message: serializers.CharField = serializers.CharField()


class TicketResponseSerializer(serializers.ModelSerializer[Ticket]):
    class Meta:
        model: type[Ticket] = Ticket
        fields: tuple[str, ...] = (
            "id",
            "user_id",
            "title",
            "message",
            "status",
            "created_at",
            "updated_at",
        )


def _parse_int_query(
    request: Request,
    key: str,
    default: int,
    *,
    minimum: int,
    maximum: int | None = None,
) -> int:
    raw_value_unknown = request.query_params.get(key)
    if raw_value_unknown is None:
        return default

    raw_value = (
        raw_value_unknown
        if isinstance(raw_value_unknown, str)
        else str(raw_value_unknown)
    )

    try:
        value = int(raw_value)
    except (TypeError, ValueError) as exc:
        raise serializers.ValidationError(
            {key: ["A valid integer is required."]}
        ) from exc

    if value < minimum:
        raise serializers.ValidationError(
            {key: [f"Ensure this value is greater than or equal to {minimum}."]}
        )
    if maximum is not None and value > maximum:
        raise serializers.ValidationError(
            {key: [f"Ensure this value is less than or equal to {maximum}."]}
        )

    return value


def _require_user(request: Request) -> User | Response:
    jwt_user = request.user
    if not isinstance(jwt_user, JWTUser):
        return Response(
            {"detail": "Could not validate credentials"},
            status=status.HTTP_401_UNAUTHORIZED,
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = User.objects.filter(email=jwt_user.subject).first()
    if user is None:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    return user


class TicketListCreateView(APIView):
    authentication_classes: list[type[JWTAuthentication]] = [JWTAuthentication]
    permission_classes: list[type] = [IsAuthenticated, IsJWTUser]

    def get(self, request: Request) -> Response:
        user_or_response = _require_user(request)
        if isinstance(user_or_response, Response):
            return user_or_response
        user = user_or_response

        page = _parse_int_query(request, "page", 1, minimum=1)
        page_size = _parse_int_query(request, "page_size", 20, minimum=1, maximum=100)

        query = Ticket.objects.filter(user_id=user.id).order_by("-updated_at")
        total = query.count()
        offset = (page - 1) * page_size
        tickets = query[offset : offset + page_size]

        return Response(
            {
                "items": TicketResponseSerializer(tickets, many=True).data,
                "total": total,
            }
        )

    def post(self, request: Request) -> Response:
        user_or_response = _require_user(request)
        if isinstance(user_or_response, Response):
            return user_or_response
        user = user_or_response

        serializer = TicketCreateSerializer(data=request.data)
        _ = serializer.is_valid(raise_exception=True)
        validated_data_raw = serializer.validated_data
        if not isinstance(validated_data_raw, dict):
            return Response(
                {"detail": "Invalid payload"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        now = timezone.now()
        ticket = Ticket.objects.create(
            user_id=user.id,
            title=str(validated_data_raw["title"]),
            message=str(validated_data_raw["message"]),
            status="open",
            created_at=now,
            updated_at=now,
        )
        return Response(
            TicketResponseSerializer(ticket).data,
            status=status.HTTP_201_CREATED,
        )


class AdminTicketListView(APIView):
    authentication_classes: list[type[JWTAuthentication]] = [JWTAuthentication]
    permission_classes: list[type] = [IsAuthenticated, IsJWTAdmin]

    def get(self, request: Request) -> Response:
        status_filter = request.query_params.get("status")
        page = _parse_int_query(request, "page", 1, minimum=1)
        page_size = _parse_int_query(request, "page_size", 20, minimum=1, maximum=100)

        query = Ticket.objects.all()
        if status_filter and status_filter != "all":
            query = query.filter(status=status_filter)

        query = query.order_by("-updated_at")
        total = query.count()
        offset = (page - 1) * page_size
        tickets = query[offset : offset + page_size]

        return Response(
            {
                "items": TicketResponseSerializer(tickets, many=True).data,
                "total": total,
            }
        )
