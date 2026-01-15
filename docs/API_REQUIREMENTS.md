# API Requirements for Member Area

To support the new "Member Area" features (Digital Product Library, Merchandise Tracking, Support), we need to update the backend schema and endpoints.

## 1. Schema Updates

### A. Products Table (`products`)
We need to store digital file access info.

**Add columns:**
- `download_url`: String (nullable) - Secure link to file (or internal path)
- `version`: String (nullable) - e.g. "v1.2"
- `last_updated_at`: DateTime (nullable) - When the file was last updated
- `guide_url`: String (nullable) - Link to PDF guide (optional)

### B. Orders Table (`orders`)
We need to track shipping for merchandise.

**Add columns:**
- `tracking_number`: String (nullable)
- `courier`: String (nullable) - e.g. "JNE", "J&T"
- `shipping_address`: Text (nullable) - If we decide to store it

## 2. New Endpoints

### A. Member Digital Products
**Endpoint:** `GET /api/member/products`
**Auth:** Required (User)
**Description:** Returns list of digital products the user has ordered (status != cancelled). Distinct by product.
**Response:**
```json
[
  {
    "id": 1,
    "title": "Ebook Trading",
    "type": "ebook",
    "status": "active", // based on order status
    "version": "v1.0",
    "last_updated": "2023-10-01",
    "image_url": "..."
  }
]
```

**Endpoint:** `GET /api/member/products/{id}`
**Auth:** Required (User)
**Description:** Get detail of owned product, including download link if active.
**Response:**
```json
{
  "id": 1,
  "title": "Ebook Trading",
  "download_url": "https://...", // Only if order status is 'confirmed'/'completed'
  "guide_content": "...",
  "updates_log": [ ... ]
}
```

### B. Member Merchandise
**Endpoint:** `GET /api/member/orders/merchandise`
**Auth:** Required (User)
**Description:** List of merchandise orders with tracking info.
**Response:**
```json
[
  {
    "id": "FXS-123",
    "items": ["Hoodie"],
    "total": 450000,
    "status": "shipped",
    "tracking_number": "JP123",
    "courier": "J&T"
  }
]
```

### C. Member Profile
**Endpoint:** `PUT /api/member/profile`
**Auth:** Required (User)
**Body:** `{ "whatsapp": "...", "full_name": "..." }`

## 3. Implementation Steps
1. Create migration to add columns to `products` and `orders`.
2. Update Pydantic schemas in `backend/app/schemas`.
3. Create `backend/app/routers/member.py` to handle these specific aggregations.
