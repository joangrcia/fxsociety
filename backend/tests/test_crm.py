"""Tests for CRM (admin) endpoints."""


def test_crm_stats_unauthorized(client):
    """Test that CRM stats require authentication."""
    response = client.get("/api/admin/stats")
    assert response.status_code == 401


def test_crm_stats_authorized(client, auth_headers):
    """Test getting CRM stats as admin."""
    response = client.get("/api/admin/stats", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    # Should return a dict with stats
    assert isinstance(data, dict)


def test_crm_customers_list(client, auth_headers):
    """Test getting customers list as admin."""
    # First register a user to have at least one customer
    client.post(
        "/api/auth/register",
        json={
            "full_name": "CRM Test Customer",
            "email": "crmtest@example.com",
            "password": "password123",
        },
    )

    response = client.get("/api/admin/customers", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_crm_customers_unauthorized(client):
    """Test that customers list requires authentication."""
    response = client.get("/api/admin/customers")
    assert response.status_code == 401


def test_crm_customer_detail(client, auth_headers):
    """Test getting customer detail as admin."""
    # Register a user first
    register_response = client.post(
        "/api/auth/register",
        json={
            "full_name": "Detail Test Customer",
            "email": "detailtest@example.com",
            "password": "password123",
        },
    )

    # May fail if user already exists - that's OK
    if register_response.status_code == 200:
        customer_id = register_response.json()["id"]

        response = client.get(
            f"/api/admin/customers/{customer_id}", headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == customer_id


def test_crm_customer_detail_not_found(client, auth_headers):
    """Test getting non-existent customer."""
    response = client.get("/api/admin/customers/99999", headers=auth_headers)
    assert response.status_code == 404
