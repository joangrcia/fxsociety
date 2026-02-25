# pyright: reportMissingTypeStubs=false, reportUnknownMemberType=false, reportUnknownVariableType=false, reportUnknownArgumentType=false, reportAttributeAccessIssue=false

from datetime import timedelta
from typing import cast

from django.db.models import Q
from django.utils import timezone
from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from api.authentication import JWTAuthentication, JWTUser
from api.orders import OrderWithProductSerializer
from api.permissions import IsJWTAdmin
from api.tickets import TicketResponseSerializer
from legacydb.models import ActivityLog, CustomerNote, CustomerTag, Order, Ticket, User


class DashboardStatsSerializer(serializers.Serializer[dict[str, object]]):
    pending_orders: serializers.IntegerField = serializers.IntegerField()
    open_tickets: serializers.IntegerField = serializers.IntegerField()
    new_customers_7d: serializers.IntegerField = serializers.IntegerField()
    follow_up_needed: serializers.IntegerField = serializers.IntegerField()


class CustomerSummarySerializer(serializers.Serializer[dict[str, object]]):
    id: serializers.IntegerField = serializers.IntegerField()
    email: serializers.EmailField = serializers.EmailField()
    full_name: serializers.CharField = serializers.CharField(
        required=False, allow_null=True
    )
    whatsapp: serializers.CharField = serializers.CharField(
        required=False, allow_null=True
    )
    total_orders: serializers.IntegerField = serializers.IntegerField()
    total_spend: serializers.IntegerField = serializers.IntegerField()
    last_activity: serializers.DateTimeField = serializers.DateTimeField(
        required=False, allow_null=True
    )
    tags: serializers.ListField = serializers.ListField(child=serializers.CharField())


class CustomerTagCreateSerializer(serializers.Serializer[dict[str, object]]):
    tag: serializers.CharField = serializers.CharField()


class CustomerTagResponseSerializer(serializers.ModelSerializer[CustomerTag]):
    class Meta:
        model: type[CustomerTag] = CustomerTag
        fields: tuple[str, ...] = ("id", "customer_id", "tag", "created_at")


class CustomerNoteCreateSerializer(serializers.Serializer[dict[str, object]]):
    note: serializers.CharField = serializers.CharField()


class CustomerNoteResponseSerializer(serializers.ModelSerializer[CustomerNote]):
    class Meta:
        model: type[CustomerNote] = CustomerNote
        fields: tuple[str, ...] = (
            "id",
            "customer_id",
            "note",
            "created_by_admin",
            "created_at",
        )


class ActivityLogResponseSerializer(serializers.ModelSerializer[ActivityLog]):
    class Meta:
        model: type[ActivityLog] = ActivityLog
        fields: tuple[str, ...] = (
            "id",
            "customer_id",
            "type",
            "reference_id",
            "metadata_json",
            "created_at",
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


def _build_customer_summary(user: User) -> dict[str, object]:
    user_orders = list(Order.objects.select_related("product").filter(user_id=user.id))
    total_spend = 0
    for order in user_orders:
        if order.product_id is not None:
            total_spend += order.product.price_idr

    last_activity = (
        ActivityLog.objects.filter(customer_id=user.id).order_by("-created_at").first()
    )
    tags = list(
        CustomerTag.objects.filter(customer_id=user.id)
        .order_by("-created_at")
        .values_list("tag", flat=True)
    )

    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "whatsapp": None,
        "total_orders": len(user_orders),
        "total_spend": total_spend,
        "last_activity": (
            last_activity.created_at if last_activity is not None else user.created_at
        ),
        "tags": tags,
    }


def _order_with_product_payload(order: Order) -> dict[str, object]:
    product_image: str | None = None
    images = order.product.images
    if isinstance(images, list) and images:
        first = images[0]
        if isinstance(first, str):
            product_image = first

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
        "product_image": product_image,
    }


def _log_activity(
    customer_id: int, activity_type: str, metadata: dict[str, object] | None = None
) -> None:
    ActivityLog.objects.create(
        customer_id=customer_id,
        type=activity_type,
        metadata_json=metadata,
        created_at=timezone.now(),
    )


class AdminStatsView(APIView):
    authentication_classes: list[type[JWTAuthentication]] = [JWTAuthentication]
    permission_classes: list[type] = [IsAuthenticated, IsJWTAdmin]

    def get(self, _request: Request) -> Response:
        pending_orders = Order.objects.filter(status="pending").count()
        open_tickets = Ticket.objects.filter(status="open").count()
        seven_days_ago = timezone.now() - timedelta(days=7)
        new_customers = User.objects.filter(created_at__gte=seven_days_ago).count()
        follow_up_needed = CustomerTag.objects.filter(tag="Follow Up").count()

        payload = {
            "pending_orders": pending_orders,
            "open_tickets": open_tickets,
            "new_customers_7d": new_customers,
            "follow_up_needed": follow_up_needed,
        }
        return Response(DashboardStatsSerializer(payload).data)


class AdminCustomerListView(APIView):
    authentication_classes: list[type[JWTAuthentication]] = [JWTAuthentication]
    permission_classes: list[type] = [IsAuthenticated, IsJWTAdmin]

    def get(self, request: Request) -> Response:
        search = request.query_params.get("search")
        tag = request.query_params.get("tag")
        _sort = request.query_params.get("sort", "activity")
        page = _parse_int_query(request, "page", 1, minimum=1)
        page_size = _parse_int_query(request, "page_size", 20, minimum=1, maximum=100)

        query = User.objects.all()

        if search:
            query = query.filter(
                Q(email__icontains=search) | Q(full_name__icontains=search)
            )

        if tag:
            query = query.filter(customertag__tag=tag)

        users = query.order_by("-created_at").distinct()
        offset = (page - 1) * page_size
        paged_users = users[offset : offset + page_size]

        items = [_build_customer_summary(user) for user in paged_users]
        return Response(CustomerSummarySerializer(items, many=True).data)


class AdminCustomerDetailView(APIView):
    authentication_classes: list[type[JWTAuthentication]] = [JWTAuthentication]
    permission_classes: list[type] = [IsAuthenticated, IsJWTAdmin]

    def get(self, _request: Request, customer_id: int) -> Response:
        user = User.objects.filter(id=customer_id).first()
        if user is None:
            return Response(
                {"detail": "Customer not found"}, status=status.HTTP_404_NOT_FOUND
            )
        payload = _build_customer_summary(user)
        return Response(CustomerSummarySerializer(payload).data)


class AdminCustomerOrdersView(APIView):
    authentication_classes: list[type[JWTAuthentication]] = [JWTAuthentication]
    permission_classes: list[type] = [IsAuthenticated, IsJWTAdmin]

    def get(self, _request: Request, customer_id: int) -> Response:
        orders = (
            Order.objects.select_related("product")
            .filter(user_id=customer_id)
            .order_by("-created_at")
        )
        payload = [_order_with_product_payload(order) for order in orders]
        return Response(OrderWithProductSerializer(payload, many=True).data)


class AdminCustomerTicketsView(APIView):
    authentication_classes: list[type[JWTAuthentication]] = [JWTAuthentication]
    permission_classes: list[type] = [IsAuthenticated, IsJWTAdmin]

    def get(self, _request: Request, customer_id: int) -> Response:
        tickets = Ticket.objects.filter(user_id=customer_id).order_by("-created_at")
        return Response(TicketResponseSerializer(tickets, many=True).data)


class AdminCustomerTagsView(APIView):
    authentication_classes: list[type[JWTAuthentication]] = [JWTAuthentication]
    permission_classes: list[type] = [IsAuthenticated, IsJWTAdmin]

    def get(self, _request: Request, customer_id: int) -> Response:
        tags = CustomerTag.objects.filter(customer_id=customer_id)
        return Response(CustomerTagResponseSerializer(tags, many=True).data)

    def post(self, request: Request, customer_id: int) -> Response:
        serializer = CustomerTagCreateSerializer(data=request.data)
        _ = serializer.is_valid(raise_exception=True)
        validated_data_raw = serializer.validated_data
        if not isinstance(validated_data_raw, dict):
            return Response(
                {"detail": "Invalid payload"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        validated_data = cast(dict[str, object], validated_data_raw)
        tag_name = str(validated_data["tag"])

        existing = CustomerTag.objects.filter(
            customer_id=customer_id, tag=tag_name
        ).first()
        if existing is not None:
            return Response(CustomerTagResponseSerializer(existing).data)

        tag = CustomerTag.objects.create(
            customer_id=customer_id,
            tag=tag_name,
            created_at=timezone.now(),
        )
        _log_activity(customer_id, "tag_added", metadata={"tag": tag_name})
        return Response(CustomerTagResponseSerializer(tag).data)


class AdminCustomerTagDeleteView(APIView):
    authentication_classes: list[type[JWTAuthentication]] = [JWTAuthentication]
    permission_classes: list[type] = [IsAuthenticated, IsJWTAdmin]

    def delete(self, _request: Request, customer_id: int, tag_name: str) -> Response:
        CustomerTag.objects.filter(customer_id=customer_id, tag=tag_name).delete()
        _log_activity(customer_id, "tag_removed", metadata={"tag": tag_name})
        return Response({"status": "ok"})


class AdminCustomerNotesView(APIView):
    authentication_classes: list[type[JWTAuthentication]] = [JWTAuthentication]
    permission_classes: list[type] = [IsAuthenticated, IsJWTAdmin]

    def get(self, _request: Request, customer_id: int) -> Response:
        notes = CustomerNote.objects.filter(customer_id=customer_id).order_by(
            "-created_at"
        )
        return Response(CustomerNoteResponseSerializer(notes, many=True).data)

    def post(self, request: Request, customer_id: int) -> Response:
        serializer = CustomerNoteCreateSerializer(data=request.data)
        _ = serializer.is_valid(raise_exception=True)
        validated_data_raw = serializer.validated_data
        if not isinstance(validated_data_raw, dict):
            return Response(
                {"detail": "Invalid payload"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        validated_data = cast(dict[str, object], validated_data_raw)

        admin_user = request.user
        admin_username = admin_user.subject if isinstance(admin_user, JWTUser) else ""

        note = CustomerNote.objects.create(
            customer_id=customer_id,
            note=str(validated_data["note"]),
            created_by_admin=admin_username,
            created_at=timezone.now(),
        )
        _log_activity(customer_id, "note_added")
        return Response(CustomerNoteResponseSerializer(note).data)


class AdminCustomerActivityView(APIView):
    authentication_classes: list[type[JWTAuthentication]] = [JWTAuthentication]
    permission_classes: list[type] = [IsAuthenticated, IsJWTAdmin]

    def get(self, _request: Request, customer_id: int) -> Response:
        activity_items = ActivityLog.objects.filter(customer_id=customer_id).order_by(
            "-created_at"
        )
        return Response(ActivityLogResponseSerializer(activity_items, many=True).data)
