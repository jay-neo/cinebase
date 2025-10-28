# API Documentation

## Base URL
```
http://localhost:8080/api/v1
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Movies API

### Get All Movies
```http
GET /movies
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12)

**Response:**
```json
{
  "entries": [
    {
      "id": 1,
      "title": "Inception",
      "type": "Movie",
      "director": "Christopher Nolan",
      "budget": 160,
      "location": "LA, Paris",
      "duration": "148 min",
      "year": 2010,
      "imageUrl": "https://example.com/poster.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 1,
    "totalPages": 1
  }
}
```

### Create Movie
```http
POST /movies
```

**Request Body:**
```json
{
  "title": "Inception",
  "type": "Movie",
  "director": "Christopher Nolan",
  "budget": 160,
  "location": "LA, Paris",
  "duration": "148 min",
  "year": 2010,
  "imageUrl": "https://example.com/poster.jpg"
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Inception",
  "type": "Movie",
  "director": "Christopher Nolan",
  "budget": 160,
  "location": "LA, Paris",
  "duration": "148 min",
  "year": 2010,
  "imageUrl": "https://example.com/poster.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Update Movie
```http
PUT /movies/:id
```

**Request Body:** (All fields optional)
```json
{
  "title": "Inception Updated",
  "director": "Christopher Nolan"
}
```

**Response:** Updated movie object

### Delete Movie
```http
DELETE /movies/:id
```

**Response:** `204 No Content`

## Authentication API

### Get Current User
```http
GET /auth/user
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "username": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## File Upload API

### Upload Image
```http
POST /upload/image
```

**Request:** Multipart form data
- `image`: Image file

**Response:**
```json
{
  "url": "https://res.cloudinary.com/example/image/upload/v1234567890/poster.jpg"
}
```

## Error Responses

### Validation Error (400)
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing token"
}
```

### Not Found (404)
```json
{
  "error": "Not Found",
  "message": "Movie not found"
}
```

### Server Error (500)
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong"
}
```

## Rate Limiting
- 100 requests per 15 minutes per IP
- Upload endpoints: 10 requests per 15 minutes

## CORS
- Allowed origins configured via `CLIENT_*` environment variables
- Credentials: true
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Headers: Content-Type, Authorization

