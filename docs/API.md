# API Documentation

## Base URL
```
Development: http://localhost:4000/api
Production: https://your-backend-url.com/api
```

## Endpoints

### Health Check

#### GET /api/health
Check if the API server is running.

**Response:**
```json
{
  "status": "ok"
}
```

**Status Codes:**
- `200 OK` - Server is healthy

---

### Checklist Items

#### GET /api/checklists
Retrieve all checklist items.

**Query Parameters:**
- `flightId` (optional, integer) - Filter items by flight ID

**Request Example:**
```http
GET /api/checklists
GET /api/checklists?flightId=1
```

**Response:**
```json
[
  {
    "id": 1,
    "flightId": null,
    "title": "Check Digital Sky for airspace clearance",
    "comment": "Cleared for flight",
    "status": "completed",
    "createdAt": "2024-12-04T10:00:00.000Z",
    "updatedAt": "2024-12-04T10:05:00.000Z"
  },
  {
    "id": 2,
    "flightId": null,
    "title": "WINDY DATA – at 0m alt, at 100m alt",
    "comment": "",
    "status": "pending",
    "createdAt": "2024-12-04T10:00:00.000Z",
    "updatedAt": "2024-12-04T10:00:00.000Z"
  }
]
```

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Server error

---

#### POST /api/checklists
Create a new checklist item.

**Request Body:**
```json
{
  "flightId": 1,           // optional, integer
  "title": "Check item",    // required, string
  "comment": "Notes here",  // optional, string (default: "")
  "status": "pending"       // optional, "pending" | "completed" (default: "pending")
}
```

**Request Example:**
```http
POST /api/checklists
Content-Type: application/json

{
  "title": "New checklist item",
  "comment": "Important note",
  "status": "pending"
}
```

**Response:**
```json
{
  "id": 3,
  "flightId": null,
  "title": "New checklist item",
  "comment": "Important note",
  "status": "pending",
  "createdAt": "2024-12-04T11:00:00.000Z",
  "updatedAt": "2024-12-04T11:00:00.000Z"
}
```

**Status Codes:**
- `201 Created` - Item created successfully
- `400 Bad Request` - Invalid input (missing title, invalid status)
- `500 Internal Server Error` - Server error

**Validation Rules:**
- `title`: Required, must be a non-empty string
- `status`: Must be either "pending" or "completed" (defaults to "pending")
- `comment`: Optional string (defaults to empty string)
- `flightId`: Optional integer

---

#### PUT /api/checklists/:id
Update an existing checklist item.

**URL Parameters:**
- `id` (required, integer) - The ID of the checklist item to update

**Request Body:**
All fields are optional. Only include fields you want to update.
```json
{
  "title": "Updated title",     // optional, string
  "comment": "Updated comment", // optional, string
  "status": "completed"         // optional, "pending" | "completed"
}
```

**Request Example:**
```http
PUT /api/checklists/1
Content-Type: application/json

{
  "status": "completed",
  "comment": "All checks passed"
}
```

**Response:**
```json
{
  "id": 1,
  "flightId": null,
  "title": "Check Digital Sky for airspace clearance",
  "comment": "All checks passed",
  "status": "completed",
  "createdAt": "2024-12-04T10:00:00.000Z",
  "updatedAt": "2024-12-04T11:30:00.000Z"
}
```

**Status Codes:**
- `200 OK` - Item updated successfully
- `400 Bad Request` - Invalid input (invalid id, invalid status, empty title)
- `404 Not Found` - Checklist item with given ID not found
- `500 Internal Server Error` - Server error

**Validation Rules:**
- `id`: Must be a valid integer
- `title`: If provided, must be a non-empty string
- `status`: If provided, must be either "pending" or "completed"
- `comment`: If provided, will be converted to string

---

#### DELETE /api/checklists/:id
Delete a checklist item.

**URL Parameters:**
- `id` (required, integer) - The ID of the checklist item to delete

**Request Example:**
```http
DELETE /api/checklists/1
```

**Response:**
No response body (204 No Content)

**Status Codes:**
- `204 No Content` - Item deleted successfully
- `400 Bad Request` - Invalid id format
- `404 Not Found` - Checklist item with given ID not found
- `500 Internal Server Error` - Server error

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Error Codes

- `400 Bad Request` - Invalid request data or parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server-side error

### Example Error Response

```json
{
  "error": "Title is required"
}
```

---

## Data Models

### ChecklistItem

| Field     | Type      | Required | Description                          |
|-----------|-----------|----------|--------------------------------------|
| id        | integer   | Yes      | Auto-incrementing primary key        |
| flightId  | integer   | No       | Optional flight identifier           |
| title     | string    | Yes      | Checklist item description           |
| comment   | string    | No       | Additional notes (default: "")       |
| status    | string    | No       | "pending" or "completed" (default: "pending") |
| createdAt | datetime  | Auto     | Timestamp when item was created      |
| updatedAt | datetime  | Auto     | Timestamp when item was last updated |

---

## Example Usage

### JavaScript (Axios)

```javascript
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

// Get all items
const items = await axios.get(`${API_BASE}/checklists`);

// Create item
const newItem = await axios.post(`${API_BASE}/checklists`, {
  title: 'Check fuel levels',
  status: 'pending'
});

// Update item
const updated = await axios.put(`${API_BASE}/checklists/1`, {
  status: 'completed',
  comment: 'Fuel levels OK'
});

// Delete item
await axios.delete(`${API_BASE}/checklists/1`);
```

### cURL Examples

```bash
# Get all items
curl http://localhost:4000/api/checklists

# Create item
curl -X POST http://localhost:4000/api/checklists \
  -H "Content-Type: application/json" \
  -d '{"title":"Check fuel","status":"pending"}'

# Update item
curl -X PUT http://localhost:4000/api/checklists/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'

# Delete item
curl -X DELETE http://localhost:4000/api/checklists/1
```

---

## CORS

The API allows requests from:
- Development: `http://localhost:5173` (Vite default port)
- Production: Configure in backend CORS settings

---

## Rate Limiting

Currently not implemented. Consider adding rate limiting for production use.

---

## Authentication

Currently not implemented. All endpoints are publicly accessible. Consider adding authentication for production use.

