# pyright: reportMissingTypeStubs=false, reportUnknownMemberType=false, reportUnknownVariableType=false, reportUnknownArgumentType=false, reportAttributeAccessIssue=false

from math import ceil
from typing import cast

from django.db.models import Q, QuerySet
from django.utils import timezone
from rest_framework import serializers, status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from legacydb.models import Product

from .authentication import JWTAuthentication
from .permissions import IsJWTAdmin


class ProductResponseSerializer(serializers.ModelSerializer[Product]):
    class Meta:
        model: type[Product] = Product
        fields: tuple[str, ...] = (
            "id",
            "title",
            "slug",
            "description_short",
            "description_full",
            "price_idr",
            "category",
            "badges",
            "images",
            "is_active",
            "created_at",
        )


class ProductCreateSerializer(serializers.Serializer[dict[str, object]]):
    title: serializers.CharField = serializers.CharField(max_length=200)
    slug: serializers.CharField = serializers.CharField(max_length=100)
    description_short: serializers.CharField = serializers.CharField(max_length=500)
    description_full: serializers.CharField = serializers.CharField(
        required=False, allow_null=True, allow_blank=True
    )
    price_idr: serializers.IntegerField = serializers.IntegerField(min_value=0)
    category: serializers.CharField = serializers.CharField(max_length=50)
    badges: serializers.ListField = serializers.ListField(
        child=serializers.CharField(), required=False, allow_null=True
    )
    images: serializers.ListField = serializers.ListField(
        child=serializers.CharField(), required=False, allow_null=True
    )
    is_active: serializers.BooleanField = serializers.BooleanField(default=True)


class ProductUpdateSerializer(serializers.Serializer[dict[str, object]]):
    title: serializers.CharField = serializers.CharField(max_length=200, required=False)
    slug: serializers.CharField = serializers.CharField(max_length=100, required=False)
    description_short: serializers.CharField = serializers.CharField(
        max_length=500, required=False
    )
    description_full: serializers.CharField = serializers.CharField(
        required=False, allow_null=True, allow_blank=True
    )
    price_idr: serializers.IntegerField = serializers.IntegerField(
        min_value=0, required=False
    )
    category: serializers.CharField = serializers.CharField(
        max_length=50, required=False
    )
    badges: serializers.ListField = serializers.ListField(
        child=serializers.CharField(), required=False, allow_null=True
    )
    images: serializers.ListField = serializers.ListField(
        child=serializers.CharField(), required=False, allow_null=True
    )
    is_active: serializers.BooleanField = serializers.BooleanField(required=False)


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

    raw_value: str
    if isinstance(raw_value_unknown, list):
        if not raw_value_unknown:
            raw_value = ""
        else:
            first_value = raw_value_unknown[0]
            raw_value = (
                first_value if isinstance(first_value, str) else str(first_value)
            )
    elif isinstance(raw_value_unknown, str):
        raw_value = raw_value_unknown
    else:
        raw_value = str(raw_value_unknown)

    try:
        value = int(raw_value)
    except (TypeError, ValueError) as exc:
        raise ValidationError({key: ["A valid integer is required."]}) from exc

    if value < minimum:
        raise ValidationError(
            {key: [f"Ensure this value is greater than or equal to {minimum}."]}
        )
    if maximum is not None and value > maximum:
        raise ValidationError(
            {key: [f"Ensure this value is less than or equal to {maximum}."]}
        )
    return value


def _paginated_payload(
    queryset: QuerySet[Product], page: int, page_size: int
) -> dict[str, object]:
    total = queryset.count()
    pages = ceil(total / page_size) if total > 0 else 1
    offset = (page - 1) * page_size
    items = queryset[offset : offset + page_size]

    return {
        "items": ProductResponseSerializer(items, many=True).data,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": pages,
    }


class ProductListView(APIView):
    authentication_classes: list[type] = []
    permission_classes: list[type] = []

    def get(self, request: Request) -> Response:
        category = request.query_params.get("category")
        search = request.query_params.get("search")
        sort = request.query_params.get("sort", "newest")
        page = _parse_int_query(request, "page", 1, minimum=1)
        page_size = _parse_int_query(request, "page_size", 12, minimum=1, maximum=100)

        products = Product.objects.filter(is_active=True)

        if category:
            products = products.filter(category=category)

        if search:
            products = products.filter(
                Q(title__icontains=search) | Q(description_short__icontains=search)
            )

        if sort == "price_asc":
            products = products.order_by("price_idr")
        elif sort == "price_desc":
            products = products.order_by("-price_idr")
        elif sort == "name":
            products = products.order_by("title")
        else:
            products = products.order_by("-created_at")

        return Response(_paginated_payload(products, page, page_size))


class ProductDetailView(APIView):
    authentication_classes: list[type] = []
    permission_classes: list[type] = []

    def get(self, _request: Request, id_or_slug: str) -> Response:
        product = None
        if id_or_slug.isdigit():
            product = Product.objects.filter(id=int(id_or_slug), is_active=True).first()

        if product is None:
            product = Product.objects.filter(slug=id_or_slug, is_active=True).first()

        if product is None:
            return Response(
                {"detail": "Produk tidak ditemukan"},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(ProductResponseSerializer(product).data)


class AdminProductListView(APIView):
    authentication_classes: list[type[JWTAuthentication]] = [JWTAuthentication]
    permission_classes: list[type] = [
        IsAuthenticated,
        IsJWTAdmin,
    ]

    def get(self, request: Request) -> Response:
        search = request.query_params.get("search")
        page = _parse_int_query(request, "page", 1, minimum=1)
        page_size = _parse_int_query(request, "page_size", 20, minimum=1, maximum=100)

        products = Product.objects.all()
        if search:
            products = products.filter(title__icontains=search)

        products = products.order_by("-created_at")
        return Response(_paginated_payload(products, page, page_size))


class AdminProductCreateView(APIView):
    authentication_classes: list[type[JWTAuthentication]] = [JWTAuthentication]
    permission_classes: list[type] = [
        IsAuthenticated,
        IsJWTAdmin,
    ]

    def post(self, request: Request) -> Response:
        serializer = ProductCreateSerializer(data=request.data)
        _ = serializer.is_valid(raise_exception=True)

        validated_data_raw = serializer.validated_data
        if not isinstance(validated_data_raw, dict):
            return Response(
                {"detail": "Invalid payload"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        validated_data = cast(dict[str, object], validated_data_raw)
        slug = str(validated_data.get("slug", ""))

        if Product.objects.filter(slug=slug).exists():
            return Response(
                {"detail": "Slug sudah digunakan"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        product = Product.objects.create(created_at=timezone.now(), **validated_data)
        return Response(
            ProductResponseSerializer(product).data,
            status=status.HTTP_201_CREATED,
        )


class AdminProductUpdateView(APIView):
    authentication_classes: list[type[JWTAuthentication]] = [JWTAuthentication]
    permission_classes: list[type] = [
        IsAuthenticated,
        IsJWTAdmin,
    ]

    def patch(self, request: Request, product_id: int) -> Response:
        product = Product.objects.filter(id=product_id).first()
        if product is None:
            return Response(
                {"detail": "Product not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = ProductUpdateSerializer(data=request.data, partial=True)
        _ = serializer.is_valid(raise_exception=True)
        validated_data_raw = serializer.validated_data

        if not isinstance(validated_data_raw, dict):
            return Response(
                {"detail": "Invalid payload"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        validated_data = cast(dict[str, object], validated_data_raw)

        slug = validated_data.get("slug")
        if isinstance(slug, str) and slug != product.slug:
            if Product.objects.filter(slug=slug).exclude(id=product_id).exists():
                return Response(
                    {"detail": "Slug already in use"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        for field, value in validated_data.items():
            setattr(product, field, value)

        product.save()
        return Response(ProductResponseSerializer(product).data)


class AdminProductToggleActiveView(APIView):
    authentication_classes: list[type[JWTAuthentication]] = [JWTAuthentication]
    permission_classes: list[type] = [
        IsAuthenticated,
        IsJWTAdmin,
    ]

    def patch(self, _request: Request, product_id: int) -> Response:
        product = Product.objects.filter(id=product_id).first()
        if product is None:
            return Response(
                {"detail": "Product not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        product.is_active = not product.is_active
        product.save(update_fields=["is_active"])
        return Response(ProductResponseSerializer(product).data)
