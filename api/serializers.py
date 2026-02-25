# pyright: reportMissingTypeStubs=false, reportUnknownMemberType=false, reportUnknownVariableType=false

from rest_framework import serializers

from legacydb.models import Product, User


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
