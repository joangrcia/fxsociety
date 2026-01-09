from app.routers.products import router as products_router
from app.routers.orders import router as orders_router
from app.routers.auth import router as auth_router
from app.routers.tickets import router as tickets_router
from app.routers.crm import router as crm_router

__all__ = [
    "products_router",
    "orders_router",
    "auth_router",
    "tickets_router",
    "crm_router",
]
