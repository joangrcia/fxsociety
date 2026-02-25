# pyright: reportMissingImports=false, reportMissingTypeStubs=false, reportUnknownVariableType=false, reportUnknownMemberType=false, reportUnknownArgumentType=false, reportArgumentType=false

from django.db import models


class User(models.Model):
    id: models.AutoField = models.AutoField(primary_key=True)
    email: models.CharField = models.CharField(max_length=255, unique=True)
    password_hash: models.CharField = models.CharField(max_length=255)
    full_name: models.CharField = models.CharField(
        max_length=255, null=True, blank=True
    )
    is_active: models.BooleanField = models.BooleanField(default=True)
    created_at: models.DateTimeField = models.DateTimeField()

    class Meta:
        managed: bool = False
        db_table: str = "users"


class Product(models.Model):
    id: models.AutoField = models.AutoField(primary_key=True)
    slug: models.CharField = models.CharField(max_length=100, unique=True)
    title: models.CharField = models.CharField(max_length=200)
    description_short: models.CharField = models.CharField(max_length=500)
    description_full: models.TextField = models.TextField(null=True, blank=True)
    price_idr: models.IntegerField = models.IntegerField()
    category: models.CharField = models.CharField(max_length=50)
    badges: models.JSONField = models.JSONField(null=True, blank=True)
    images: models.JSONField = models.JSONField(null=True, blank=True)
    is_active: models.BooleanField = models.BooleanField(default=True)
    created_at: models.DateTimeField = models.DateTimeField()

    class Meta:
        managed: bool = False
        db_table: str = "products"


class Order(models.Model):
    id: models.AutoField = models.AutoField(primary_key=True)
    order_code: models.CharField = models.CharField(max_length=20, unique=True)
    product: models.ForeignKey = models.ForeignKey(
        Product, on_delete=models.DO_NOTHING, db_column="product_id"
    )
    user: models.ForeignKey = models.ForeignKey(
        User,
        on_delete=models.DO_NOTHING,
        db_column="user_id",
        null=True,
        blank=True,
    )
    name: models.CharField = models.CharField(max_length=200)
    email: models.CharField = models.CharField(max_length=200)
    whatsapp: models.CharField = models.CharField(max_length=20)
    notes: models.TextField = models.TextField(null=True, blank=True)
    status: models.CharField = models.CharField(max_length=20)
    created_at: models.DateTimeField = models.DateTimeField()
    updated_at: models.DateTimeField = models.DateTimeField()

    class Meta:
        managed: bool = False
        db_table: str = "orders"


class Ticket(models.Model):
    id: models.AutoField = models.AutoField(primary_key=True)
    user: models.ForeignKey = models.ForeignKey(
        User,
        on_delete=models.DO_NOTHING,
        db_column="user_id",
    )
    title: models.CharField = models.CharField(max_length=200)
    message: models.TextField = models.TextField()
    status: models.CharField = models.CharField(max_length=20)
    created_at: models.DateTimeField = models.DateTimeField()
    updated_at: models.DateTimeField = models.DateTimeField()

    class Meta:
        managed: bool = False
        db_table: str = "tickets"


class CustomerTag(models.Model):
    id: models.AutoField = models.AutoField(primary_key=True)
    customer: models.ForeignKey = models.ForeignKey(
        User, on_delete=models.DO_NOTHING, db_column="customer_id"
    )
    tag: models.CharField = models.CharField(max_length=50)
    created_at: models.DateTimeField = models.DateTimeField()

    class Meta:
        managed: bool = False
        db_table: str = "customer_tags"


class CustomerNote(models.Model):
    id: models.AutoField = models.AutoField(primary_key=True)
    customer: models.ForeignKey = models.ForeignKey(
        User, on_delete=models.DO_NOTHING, db_column="customer_id"
    )
    note: models.TextField = models.TextField()
    created_by_admin: models.CharField = models.CharField(max_length=100)
    created_at: models.DateTimeField = models.DateTimeField()

    class Meta:
        managed: bool = False
        db_table: str = "customer_notes"


class ActivityLog(models.Model):
    id: models.AutoField = models.AutoField(primary_key=True)
    customer: models.ForeignKey = models.ForeignKey(
        User, on_delete=models.DO_NOTHING, db_column="customer_id"
    )
    type: models.CharField = models.CharField(max_length=50)
    reference_id: models.CharField = models.CharField(
        max_length=50, null=True, blank=True
    )
    metadata_json: models.JSONField = models.JSONField(null=True, blank=True)
    created_at: models.DateTimeField = models.DateTimeField()

    class Meta:
        managed: bool = False
        db_table: str = "activity_logs"
