from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import init_db
from app.routers import (
    products_router,
    orders_router,
    auth_router,
    tickets_router,
    crm_router,
)
from app.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup."""
    init_db()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for fxsociety trading marketplace",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(products_router)
app.include_router(orders_router)
app.include_router(auth_router)
app.include_router(tickets_router)
app.include_router(crm_router)


@app.get("/")
def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "fxsociety API is running"}


@app.get("/api/health")
def health_check():
    """API health check."""
    return {"status": "healthy"}
