# pyright: reportMissingTypeStubs=false, reportUnknownMemberType=false, reportUnknownVariableType=false, reportUnknownArgumentType=false, reportAttributeAccessIssue=false

import re
import secrets
import string
from typing import cast

from django.utils import timezone
from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from api.authentication import JWTAuthentication, JWTUser
from api.permissions import IsJWTAdmin, IsJWTUser
from legacydb.models import ActivityLog, Order, Product, User


def _generate_order_code() -> str:
    chars = string.ascii_uppercase + string.digits
    random_part = "".join(secrets.choice(chars) for _ in range(6))
    return f"FXS-{random_part}"


def _generate_unique_order_code() -> str:
    while True:
        code = _generate_order_code()
        if not Order.objects.filter(order_code=code).exists():
            return code


def _first_product_image(images: object) -> str | None:
    if isinstance(images, list) and images:
        first = images[0]
        if isinstance(first, str):
            return first
    return None


class OrderCreateSerializer(serializers.Serializer[dict[str, object]]):
    product_id: serializers.IntegerField = serializers.IntegerField(min_value=1)
    name: serializers.CharField = serializers.CharField()
    email: serializers.EmailField = serializers.EmailField()
    whatsapp: serializers.CharField = serializers.CharField()
    notes: serializers.CharField = serializers.CharField(
        required=False, allow_null=True, allow_blank=True
    )

    def validate_name(self, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError("Nama tidak boleh kosong")
        return cleaned

    def validate_whatsapp(self, value: str) -> str:
        cleaned = re.sub(r"[\s\-]", "", value)
        if not re.match(r"^(\+?62|0)[0-9]{9,13}$", cleaned):
            raise serializers.ValidationError("Format nomor WhatsApp tidak valid")
        return cleaned


class OrderStatusUpdateSerializer(serializers.Serializer[dict[str, object]]):
    status: serializers.CharField = serializers.CharField()


class OrderResponseSerializer(serializers.ModelSerializer[Order]):
    class Meta:
        model: type[Order] = Order
        fields: tuple[str, ...] = (
            "id",
            "order_code",
            "product_id",
            "name",
            "email",
            "whatsapp",
            "notes",
            "status",
            "created_at",
            "updated_at",
        )


class PublicOrderStatusSerializer(serializers.Serializer[dict[str, object]]):
    order_code: serializers.CharField = serializers.CharField()
    status: serializers.CharField = serializers.CharField()
    product_title: serializers.CharField = serializers.CharField()
    product_price: serializers.IntegerField = serializers.IntegerField()
    product_category: serializers.CharField = serializers.CharField(
        required=False, allow_null=True
    )
    created_at: serializers.DateTimeField = serializers.DateTimeField()


class OrderWithProductSerializer(OrderResponseSerializer):
    product_title: serializers.CharField = serializers.CharField()
    product_price: serializers.IntegerField = serializers.IntegerField()
    product_category: serializers.CharField = serializers.CharField(
        required=False, allow_null=True
    )
    product_slug: serializers.CharField = serializers.CharField(
        required=False, allow_null=True
    )
    product_image: serializers.CharField = serializers.CharField(
        required=False, allow_null=True
    )

    class Meta(OrderResponseSerializer.Meta):
        fields: tuple[str, ...] = OrderResponseSerializer.Meta.fields + (
            "product_title",
            "product_price",
            "product_category",
            "product_slug",
            "product_image",
        )


def _order_with_product_payload(order: Order) -> dict[str, object]:
    return {
        "id": order.id,
        "order_code": order.order_code,
        "product_id": order.product_id,
        "name": order.name,
        "email": order.email,
        "whatsapp": order.whatsapp,
        "notes": order.notes,
        "status": order.status,
        "created_at": order.created_at,
        "updated_at": order.updated_at,
        "product_title": order.product.title,
        "product_price": order.product.price_idr,
        "product_category": order.product.category,
        "product_slug": order.product.slug,
        "product_image": _first_product_image(order.product.images),
    }


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


def _log_activity(
    user_id: int,
    activity_type: str,
    reference_id: str | None = None,
    metadata: dict[str, object] | None = None,
) -> None:
    ActivityLog.objects.create(
        customer_id=user_id,
        type=activity_type,
        reference_id=reference_id,
        metadata_json=metadata,
        created_at=timezone.now(),
    )


class CreateOrderView(APIView):
    authentication_classes: list[type] = []
    permission_classes: list[type] = []

    def post(self, request: Request) -> Response:
        serializer = OrderCreateSerializer(data=request.data)
        _ = serializer.is_valid(raise_exception=True)
        validated_data_raw = serializer.validated_data
        if not isinstance(validated_data_raw, dict):
            return Response(
                {"detail": "Invalid payload"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        validated_data = cast(dict[str, object], validated_data_raw)
        product_id = cast(int, validated_data["product_id"])
        product = Product.objects.filter(id=product_id, is_active=True).first()
        if product is None:
            return Response(
                {"detail": "Produk tidak ditemukan"},
                status=status.HTTP_404_NOT_FOUND,
            )

        email = str(validated_data["email"])
        user = User.objects.filter(email=email).first()
        now = timezone.now()
        order = Order.objects.create(
            order_code=_generate_unique_order_code(),
            product_id=product_id,
            user_id=user.id if user is not None else None,
            name=str(validated_data["name"]),
            email=email,
            whatsapp=str(validated_data["whatsapp"]),
            notes=cast(str | None, validated_data.get("notes")),
            status="pending",
            created_at=now,
            updated_at=now,
        )

        if user is not None:
            _log_activity(
                user_id=user.id,
                activity_type="order_created",
                reference_id=order.order_code,
                metadata={"product": product.title, "price": product.price_idr},
            )

        return Response(
            OrderResponseSerializer(order).data,
            status=status.HTTP_201_CREATED,
        )


class MyOrdersView(APIView):
    authentication_classes: list[type[JWTAuthentication]] = [JWTAuthentication]
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

        orders = (
            Order.objects.select_related("product")
            .filter(user_id=user.id)
            .order_by("-created_at")
        )

        items = [_order_with_product_payload(order) for order in orders]
        return Response(
            {
                "items": OrderWithProductSerializer(items, many=True).data,
                "total": len(items),
            }
        )


class PublicOrderStatusView(APIView):
    authentication_classes: list[type] = []
    permission_classes: list[type] = []

    def get(self, _request: Request, order_code: str) -> Response:
        order = (
            Order.objects.select_related("product")
            .filter(order_code=order_code.upper())
            .first()
        )
        if order is None:
            return Response(
                {"detail": "Pesanan tidak ditemukan"},
                status=status.HTTP_404_NOT_FOUND,
            )

        payload = {
            "order_code": order.order_code,
            "status": order.status,
            "product_title": order.product.title,
            "product_price": order.product.price_idr,
            "product_category": order.product.category,
            "created_at": order.created_at,
        }
        return Response(PublicOrderStatusSerializer(payload).data)


class AdminOrderListView(APIView):
    authentication_classes: list[type[JWTAuthentication]] = [JWTAuthentication]
    permission_classes: list[type] = [IsAuthenticated, IsJWTAdmin]

    def get(self, request: Request) -> Response:
        status_filter = request.query_params.get("status")
        page = _parse_int_query(request, "page", 1, minimum=1)
        page_size = _parse_int_query(request, "page_size", 20, minimum=1, maximum=100)

        query = Order.objects.select_related("product").all()
        if status_filter and status_filter != "all":
            query = query.filter(status=status_filter)

        total = query.count()
        offset = (page - 1) * page_size
        orders = query.order_by("-created_at")[offset : offset + page_size]
        items = [_order_with_product_payload(order) for order in orders]

        return Response(
            {
                "items": OrderWithProductSerializer(items, many=True).data,
                "total": total,
            }
        )


class AdminOrderStatusUpdateView(APIView):
    authentication_classes: list[type[JWTAuthentication]] = [JWTAuthentication]
    permission_classes: list[type] = [IsAuthenticated, IsJWTAdmin]

    def patch(self, request: Request, order_id: int) -> Response:
        serializer = OrderStatusUpdateSerializer(data=request.data)
        _ = serializer.is_valid(raise_exception=True)
        validated_data_raw = serializer.validated_data
        if not isinstance(validated_data_raw, dict):
            return Response(
                {"detail": "Invalid payload"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_status = str(validated_data_raw.get("status", ""))
        valid_statuses = ["pending", "confirmed", "completed", "cancelled"]
        if new_status not in valid_statuses:
            return Response(
                {
                    "detail": "Status tidak valid. Gunakan: pending, confirmed, completed, cancelled"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        order = Order.objects.filter(id=order_id).first()
        if order is None:
            return Response(
                {"detail": "Order tidak ditemukan"},
                status=status.HTTP_404_NOT_FOUND,
            )

        old_status = order.status
        order.status = new_status
        order.updated_at = timezone.now()
        order.save(update_fields=["status", "updated_at"])

        if order.user_id is not None:
            _log_activity(
                user_id=order.user_id,
                activity_type="order_status_updated",
                reference_id=order.order_code,
                metadata={"old_status": old_status, "new_status": new_status},
            )

        return Response(OrderResponseSerializer(order).data)
