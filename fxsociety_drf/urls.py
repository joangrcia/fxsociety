# pyright: reportMissingTypeStubs=false, reportUnknownMemberType=false, reportUnknownArgumentType=false

import importlib
from types import ModuleType
from typing import cast

from django.urls import path
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from api.auth import LoginView, MeView, RegisterView

products_module: ModuleType = importlib.import_module("api.products")
ProductListView = cast(type[APIView], products_module.ProductListView)
ProductDetailView = cast(type[APIView], products_module.ProductDetailView)
AdminProductListView = cast(type[APIView], products_module.AdminProductListView)
AdminProductCreateView = cast(type[APIView], products_module.AdminProductCreateView)
AdminProductUpdateView = cast(type[APIView], products_module.AdminProductUpdateView)
AdminProductToggleActiveView = cast(
    type[APIView], products_module.AdminProductToggleActiveView
)
orders_module: ModuleType = importlib.import_module("api.orders")
CreateOrderView = cast(type[APIView], orders_module.CreateOrderView)
MyOrdersView = cast(type[APIView], orders_module.MyOrdersView)
PublicOrderStatusView = cast(type[APIView], orders_module.PublicOrderStatusView)
AdminOrderListView = cast(type[APIView], orders_module.AdminOrderListView)
AdminOrderStatusUpdateView = cast(
    type[APIView], orders_module.AdminOrderStatusUpdateView
)
tickets_module: ModuleType = importlib.import_module("api.tickets")
TicketListCreateView = cast(type[APIView], tickets_module.TicketListCreateView)
AdminTicketListView = cast(type[APIView], tickets_module.AdminTicketListView)
crm_module: ModuleType = importlib.import_module("api.crm")
AdminStatsView = cast(type[APIView], crm_module.AdminStatsView)
AdminCustomerListView = cast(type[APIView], crm_module.AdminCustomerListView)
AdminCustomerDetailView = cast(type[APIView], crm_module.AdminCustomerDetailView)
AdminCustomerOrdersView = cast(type[APIView], crm_module.AdminCustomerOrdersView)
AdminCustomerTicketsView = cast(type[APIView], crm_module.AdminCustomerTicketsView)
AdminCustomerTagsView = cast(type[APIView], crm_module.AdminCustomerTagsView)
AdminCustomerTagDeleteView = cast(type[APIView], crm_module.AdminCustomerTagDeleteView)
AdminCustomerNotesView = cast(type[APIView], crm_module.AdminCustomerNotesView)
AdminCustomerActivityView = cast(type[APIView], crm_module.AdminCustomerActivityView)


class RootHealthView(APIView):
    authentication_classes: list[type] = []
    permission_classes: list[type] = []

    def get(self, _request: Request) -> Response:
        return Response({"status": "ok", "message": "fxsociety API is running"})


class ApiHealthView(APIView):
    authentication_classes: list[type] = []
    permission_classes: list[type] = []

    def get(self, _request: Request) -> Response:
        return Response({"status": "healthy"})


urlpatterns = [
    path("", RootHealthView.as_view(), name="root-health"),
    path("api/health", ApiHealthView.as_view(), name="api-health"),
    path("api/auth/register", RegisterView.as_view(), name="auth-register"),
    path("api/auth/login", LoginView.as_view(), name="auth-login"),
    path("api/auth/me", MeView.as_view(), name="auth-me"),
    path("api/products", ProductListView.as_view(), name="products-list"),
    path(
        "api/products/admin/all",
        AdminProductListView.as_view(),
        name="products-admin-all",
    ),
    path("api/products/admin", AdminProductCreateView.as_view(), name="products-admin"),
    path(
        "api/products/admin/<int:product_id>",
        AdminProductUpdateView.as_view(),
        name="products-admin-update",
    ),
    path(
        "api/products/admin/<int:product_id>/toggle-active",
        AdminProductToggleActiveView.as_view(),
        name="products-admin-toggle-active",
    ),
    path(
        "api/products/<str:id_or_slug>",
        ProductDetailView.as_view(),
        name="products-get",
    ),
    path("api/orders", CreateOrderView.as_view(), name="orders-create"),
    path("api/orders/me", MyOrdersView.as_view(), name="orders-me"),
    path(
        "api/orders/admin/all",
        AdminOrderListView.as_view(),
        name="orders-admin-all",
    ),
    path(
        "api/orders/admin/<int:order_id>/status",
        AdminOrderStatusUpdateView.as_view(),
        name="orders-admin-status",
    ),
    path(
        "api/orders/<str:order_code>",
        PublicOrderStatusView.as_view(),
        name="orders-status",
    ),
    path("api/tickets", TicketListCreateView.as_view(), name="tickets-list-create"),
    path(
        "api/tickets/admin/all",
        AdminTicketListView.as_view(),
        name="tickets-admin-all",
    ),
    path("api/admin/stats", AdminStatsView.as_view(), name="admin-stats"),
    path(
        "api/admin/customers", AdminCustomerListView.as_view(), name="admin-customers"
    ),
    path(
        "api/admin/customers/<int:customer_id>",
        AdminCustomerDetailView.as_view(),
        name="admin-customer-detail",
    ),
    path(
        "api/admin/customers/<int:customer_id>/orders",
        AdminCustomerOrdersView.as_view(),
        name="admin-customer-orders",
    ),
    path(
        "api/admin/customers/<int:customer_id>/tickets",
        AdminCustomerTicketsView.as_view(),
        name="admin-customer-tickets",
    ),
    path(
        "api/admin/customers/<int:customer_id>/tags",
        AdminCustomerTagsView.as_view(),
        name="admin-customer-tags",
    ),
    path(
        "api/admin/customers/<int:customer_id>/tags/<str:tag_name>",
        AdminCustomerTagDeleteView.as_view(),
        name="admin-customer-tags-delete",
    ),
    path(
        "api/admin/customers/<int:customer_id>/notes",
        AdminCustomerNotesView.as_view(),
        name="admin-customer-notes",
    ),
    path(
        "api/admin/customers/<int:customer_id>/activity",
        AdminCustomerActivityView.as_view(),
        name="admin-customer-activity",
    ),
]
