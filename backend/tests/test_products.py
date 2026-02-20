"""Tests for product endpoints."""


def test_get_products_returns_paginated(client):
    """Test getting products endpoint returns paginated response."""
    response = client.get("/api/products")
    assert response.status_code == 200
    data = response.json()
    # API returns paginated response with items array
    assert "items" in data
    assert isinstance(data["items"], list)
    assert "total" in data
    assert "page" in data


def test_create_product_admin(client, auth_headers):
    """Test creating a product as admin."""
    product_data = {
        "title": "Test Indicator",
        "slug": "test-indicator",
        "description_short": "A test trading indicator",
        "price_idr": 499000,
        "category": "indikator",
        "images": ["https://example.com/image.jpg"],
    }

    response = client.post(
        "/api/products/admin",
        json=product_data,
        headers=auth_headers,
    )
    # 200 or 201 are both valid for creation
    assert response.status_code in [200, 201]
    data = response.json()
    assert data["title"] == "Test Indicator"
    assert data["price_idr"] == 499000
    assert "id" in data


def test_create_product_unauthorized(client):
    """Test that creating a product without auth fails."""
    product_data = {
        "title": "Unauthorized Product",
        "slug": "unauthorized-product",
        "description_short": "Should not be created",
        "price_idr": 100000,
        "category": "indikator",
    }

    response = client.post("/api/products/admin", json=product_data)
    assert response.status_code == 401


def test_get_products_after_create(client, auth_headers):
    """Test getting products after creating one."""
    # Create a product
    product_data = {
        "title": "Visible Product",
        "slug": "visible-product-test",
        "description_short": "This should be visible",
        "price_idr": 299000,
        "category": "robot",
        "images": ["https://example.com/robot.jpg"],
    }
    client.post("/api/products/admin", json=product_data, headers=auth_headers)

    # Get all products
    response = client.get("/api/products")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1


def test_get_product_by_id(client, auth_headers):
    """Test getting a specific product by ID."""
    # Create a product
    product_data = {
        "title": "Specific Product",
        "slug": "specific-product-test",
        "description_short": "Get by ID test",
        "price_idr": 399000,
        "category": "ebook",
    }
    create_response = client.post(
        "/api/products/admin",
        json=product_data,
        headers=auth_headers,
    )
    # 200 or 201 are both valid for creation
    assert create_response.status_code in [200, 201]
    product_id = create_response.json()["id"]

    # Get by ID
    response = client.get(f"/api/products/{product_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == product_id
    assert data["title"] == "Specific Product"


def test_get_product_not_found(client):
    """Test getting a non-existent product."""
    response = client.get("/api/products/99999")
    assert response.status_code == 404
