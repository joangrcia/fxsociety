"""Pytest configuration and fixtures for fxsociety backend tests."""

import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

# Set environment to development for tests (allows insecure defaults)
os.environ["ENVIRONMENT"] = "development"

from app.main import app
from app.database import Base, get_db


# Create in-memory SQLite database for testing
TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency with test database."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Store token at module level to avoid rate limiting
_cached_admin_token = None


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """Create tables once for the session."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="session")
def test_client():
    """Create a test client for the session."""
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def client(test_client):
    """Provide the test client for each test."""
    return test_client


@pytest.fixture(scope="session")
def admin_token(test_client):
    """Get admin authentication token for protected endpoints.

    Using session scope to avoid rate limiting from multiple login attempts.
    """
    global _cached_admin_token

    if _cached_admin_token is None:
        # Login as admin (uses dev defaults: dev_admin / dev_password_123)
        response = test_client.post(
            "/api/auth/login",
            data={
                "username": "dev_admin",
                "password": "dev_password_123",
            },
        )
        assert response.status_code == 200, f"Admin login failed: {response.json()}"
        _cached_admin_token = response.json()["access_token"]

    return _cached_admin_token


@pytest.fixture(scope="function")
def auth_headers(admin_token):
    """Get authorization headers for admin endpoints."""
    return {"Authorization": f"Bearer {admin_token}"}
