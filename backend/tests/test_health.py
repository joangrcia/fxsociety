"""Tests for health check endpoints."""


def test_root_endpoint(client):
    """Test root endpoint returns OK status."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "fxsociety" in data["message"].lower()


def test_health_endpoint(client):
    """Test health check endpoint returns healthy status."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
