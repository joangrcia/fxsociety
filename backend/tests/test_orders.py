"""Tests for order endpoints."""


def test_create_order(client, auth_headers):
    """Test creating an order."""
    # First create a product
    product_data = {
        "title": "Order Test Product",
        "slug": "order-test-product",
        "description_short": "Product for order test",
        "price_idr": 199000,
        "category": "indikator",
    }
    product_response = client.post(
        "/api/products/admin",
        json=product_data,
        headers=auth_headers,
    )
    # 200 or 201 are both valid for creation
    assert product_response.status_code in [200, 201]
    product_id = product_response.json()["id"]

    # Create an order
    order_data = {
        "product_id": product_id,
        "customer_name": "Test Customer",
        "customer_email": "customer@example.com",
        "customer_phone": "081234567890",
        "notes": "Test order notes",
    }

    response = client.post("/api/orders", json=order_data)
    assert response.status_code in [200, 201]
    data = response.json()
    assert "id" in data
    assert "order_code" in data
    assert data["status"] == "pending"


def test_create_order_product_not_found(client):
    """Test creating an order for non-existent product."""
    order_data = {
        "product_id": 99999,
        "customer_name": "Test Customer",
        "customer_email": "customer@example.com",
        "customer_phone": "081234567890",
    }

    response = client.post("/api/orders", json=order_data)
    # May return 404 or 422 depending on validation order
    assert response.status_code in [404, 422]


def test_get_order_by_code(client, auth_headers):
    """Test getting order status by code (public endpoint)."""
    # Create product and order
    product_response = client.post(
        "/api/products/admin",
        json={
            "title": "Code Test Product",
            "slug": "code-test-product",
            "description_short": "Test",
            "price_idr": 100000,
            "category": "ebook",
        },
        headers=auth_headers,
    )
    # 200 or 201 are both valid for creation
    assert product_response.status_code in [200, 201]
    product_id = product_response.json()["id"]

    order_response = client.post(
        "/api/orders",
        json={
            "product_id": product_id,
            "customer_name": "Code Test",
            "customer_email": "code@test.com",
            "customer_phone": "081111111111",
        },
    )
    assert order_response.status_code in [200, 201]
    order_code = order_response.json()["order_code"]

    # Get order by code (public - should only return limited info)
    response = client.get(f"/api/orders/code/{order_code}")
    assert response.status_code == 200
    data = response.json()
    assert data["order_code"] == order_code
    assert "status" in data


def test_get_order_by_code_not_found(client):
    """Test getting order with invalid code."""
    response = client.get("/api/orders/code/INVALID-CODE-12345")
    assert response.status_code == 404
