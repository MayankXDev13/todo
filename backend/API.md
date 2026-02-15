# API Documentation

## Base URL

```
/api/v1
```

## Authentication

Most endpoints require authentication via JWT Bearer token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Tokens are also set as HTTP-only cookies:
- `accessToken` - Short-lived access token (default: 1 day)
- `refreshToken` - Long-lived refresh token (default: 10 days)

## Response Format

All responses follow a consistent format:

### Success Response

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Success message",
  "data": { }
}
```

### Error Response

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Error message",
  "errors": [],
  "data": null
}
```

## Authentication Endpoints

### 1. Register User

Creates a new user account.

**Endpoint:** `POST /users/register`

**Authentication:** Not Required

**Request Body:**

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123"
}
```

**Validation Rules:**
- `email`: Valid email format
- `username`: 3-30 characters, letters, numbers, and underscores only
- `password`: Minimum 8 characters, must contain at least one uppercase, one lowercase, and one number

**Success Response (201):**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "loginType": "email_password",
      "isEmailVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400`: User already exists or validation failed
- `500`: Failed to register user

### 2. Login User

Authenticates a user and returns tokens.

**Endpoint:** `POST /users/login`

**Authentication:** Not Required

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "profilePicture": null,
      "isEmailVerified": false
    },
    "accessToken": "jwt_token",
    "refreshToken": "jwt_token"
  }
}
```

**Cookies Set:**
- `accessToken` - HTTP-only, secure in production
- `refreshToken` - HTTP-only, secure in production

**Error Responses:**
- `400`: Invalid credentials or missing fields

### 3. Logout User

Logs out the current user and invalidates tokens.

**Endpoint:** `POST /users/logout`

**Authentication:** Required

**Success Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User logged out successfully",
  "data": {}
}
```

**Cookies Cleared:**
- `accessToken`
- `refreshToken`

### 4. Refresh Access Token

Generates a new access token using a refresh token.

**Endpoint:** `POST /users/refresh-token`

**Authentication:** Not Required (uses refresh token)

**Request Body:**

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

Or provide via cookie.

**Success Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Access token refreshed",
  "data": {
    "accessToken": "new_jwt_token",
    "refreshToken": "new_jwt_token"
  }
}
```

**Error Responses:**
- `401`: Refresh token is missing, invalid, or expired

### 5. Get Current User

Retrieves information about the currently authenticated user.

**Endpoint:** `GET /users/current-user`

**Authentication:** Required

**Success Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Current user fetched successfully",
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

### 6. Verify Email

Verifies user's email address using a verification token sent via email.

**Endpoint:** `POST /users/verify-email/:verificationToken`

**Authentication:** Not Required

**URL Parameters:**
- `verificationToken`: Token received in verification email

**Success Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Email is verified",
  "data": {
    "isEmailVerified": true
  }
}
```

**Error Responses:**
- `400`: Token is invalid or expired

### 7. Resend Email Verification

Resends the email verification link.

**Endpoint:** `POST /users/resend-email-verification`

**Authentication:** Required

**Success Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Mail has been sent to your mail ID",
  "data": {}
}
```

**Error Responses:**
- `404`: User does not exist
- `409`: Email is already verified

### 8. Forgot Password

Initiates password reset process by sending a reset link to email.

**Endpoint:** `POST /users/forgot-password`

**Authentication:** Not Required

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Password reset mail has been sent on your mail id",
  "data": {}
}
```

**Error Responses:**
- `404`: User does not exist

### 9. Reset Forgotten Password

Resets password using the token from reset email.

**Endpoint:** `POST /users/reset-password`

**Authentication:** Not Required

**Request Body:**

```json
{
  "resetToken": "hexadecimal_token_from_email",
  "newPassword": "NewSecurePass123"
}
```

**Success Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Password reset successfully",
  "data": {}
}
```

**Error Responses:**
- `400`: Token is invalid or expired, or new password is same as old password

### 10. Change Current Password

Changes password for logged-in user (requires current password).

**Endpoint:** `POST /users/change-password`

**Authentication:** Required

**Request Body:**

```json
{
  "oldPassword": "CurrentPass123",
  "newPassword": "NewSecurePass123"
}
```

**Success Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Password changed successfully",
  "data": {}
}
```

**Error Responses:**
- `401`: Invalid old password
- `400`: New password cannot be same as old password

## Todo Endpoints

### 1. Create Todo

Creates a new todo item.

**Endpoint:** `POST /todos`

**Authentication:** Required

**Request Body:**

```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, and bread",
  "dueDate": "2024-01-15T10:00:00.000Z",
  "priority": "high",
  "categoryId": "uuid"
}
```

**Field Requirements:**
- `title`: Required, 1-256 characters
- `description`: Optional, max 256 characters
- `dueDate`: Optional, ISO 8601 datetime string
- `priority`: Optional, enum: `low`, `medium`, `high` (default: `medium`)
- `categoryId`: Optional, UUID of existing category

**Success Response (201):**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Todo created successfully",
  "data": {
    "id": "uuid",
    "title": "Buy groceries",
    "description": "Milk, eggs, and bread",
    "dueDate": "2024-01-15T10:00:00.000Z",
    "userId": "uuid",
    "priority": "high",
    "categoryId": "uuid",
    "isCompleted": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `401`: Unauthorized
- `500`: Failed to create todo

### 2. Get All Todos

Retrieves all todos for the authenticated user with pagination, filtering, and sorting.

**Endpoint:** `GET /todos`

**Authentication:** Required

**Query Parameters:**

| Parameter  | Type    | Description                                          | Default |
| ---------- | ------- | ---------------------------------------------------- | ------- |
| `page`     | integer | Page number                                          | 1       |
| `limit`    | integer | Items per page (max 100)                             | 10      |
| `search`   | string  | Search by title (case-insensitive)                   | -       |
| `completed`| string  | Filter by completion status (`true` or `false`)      | -       |
| `priority` | string  | Filter by priority (`low`, `medium`, or `high`)      | -       |
| `sortBy`   | string  | Sort by field: `createdAt`, `dueDate`, `priority`    | `createdAt` |
| `sortOrder`| string  | Sort direction: `asc` or `desc`                     | `desc` |

**Example Requests:**
- `GET /todos` - Get first page with default limit
- `GET /todos?page=2&limit=20` - Get page 2 with 20 items
- `GET /todos?search=shopping` - Search todos containing "shopping"
- `GET /todos?completed=false` - Get incomplete todos
- `GET /todos?priority=high` - Get high priority todos
- `GET /todos?sortBy=dueDate&sortOrder=asc` - Sort by due date ascending
- `GET /todos?sortBy=priority&sortOrder=desc` - Sort by priority descending

**Success Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Todos fetched successfully",
  "data": {
    "data": [
      {
        "id": "uuid",
        "title": "Buy groceries",
        "description": "Milk, eggs, and bread",
        "dueDate": "2024-01-15T10:00:00.000Z",
        "userId": "uuid",
        "priority": "high",
        "categoryId": "uuid",
        "isCompleted": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

**Error Responses:**
- `401`: Unauthorized

### 3. Get Todo by ID

Retrieves a specific todo by its ID.

**Endpoint:** `GET /todos/:id`

**Authentication:** Required

**URL Parameters:**
- `id`: UUID of the todo

**Success Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Todo fetched successfully",
  "data": {
    "id": "uuid",
    "title": "Buy groceries",
    "description": "Milk, eggs, and bread",
    "dueDate": "2024-01-15T10:00:00.000Z",
    "userId": "uuid",
    "priority": "high",
    "categoryId": "uuid",
    "isCompleted": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `401`: Unauthorized
- `404`: Todo not found

### 4. Update Todo

Updates an existing todo. Only provided fields will be updated.

**Endpoint:** `PUT /todos/:id`

**Authentication:** Required

**URL Parameters:**
- `id`: UUID of the todo

**Request Body:**

```json
{
  "title": "Buy groceries and vegetables",
  "description": "Milk, eggs, bread, and vegetables",
  "dueDate": "2024-01-20T10:00:00.000Z",
  "priority": "medium",
  "categoryId": "uuid",
  "isCompleted": true
}
```

**Note:** At least one field must be provided for update.

**Success Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Todo updated successfully",
  "data": {
    "id": "uuid",
    "title": "Buy groceries and vegetables",
    "description": "Milk, eggs, bread, and vegetables",
    "dueDate": "2024-01-20T10:00:00.000Z",
    "userId": "uuid",
    "priority": "medium",
    "categoryId": "uuid",
    "isCompleted": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: No fields provided for update
- `401`: Unauthorized
- `404`: Todo not found

### 5. Toggle Todo Status

Toggles the completed status of a todo between true and false.

**Endpoint:** `PATCH /todos/:id/toggle`

**Authentication:** Required

**URL Parameters:**
- `id`: UUID of the todo

**Success Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Todo marked as completed",
  "data": {
    "id": "uuid",
    "title": "Buy groceries",
    "description": "Milk, eggs, and bread",
    "dueDate": "2024-01-15T10:00:00.000Z",
    "userId": "uuid",
    "priority": "high",
    "categoryId": "uuid",
    "isCompleted": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `401`: Unauthorized
- `404`: Todo not found

### 6. Delete Todo

Deletes a todo permanently.

**Endpoint:** `DELETE /todos/:id`

**Authentication:** Required

**URL Parameters:**
- `id`: UUID of the todo

**Success Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Todo deleted successfully",
  "data": {
    "id": "uuid",
    "title": "Buy groceries",
    "description": "Milk, eggs, and bread",
    "dueDate": "2024-01-15T10:00:00.000Z",
    "userId": "uuid",
    "priority": "high",
    "categoryId": "uuid",
    "isCompleted": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `401`: Unauthorized
- `404`: Todo not found

## Health Check

### Check API Health

Verifies that the API is running and healthy.

**Endpoint:** `GET /healthcheck`

**Authentication:** Not Required

**Success Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "API is healthy",
  "data": {}
}
```

## Data Models

### User

| Field                   | Type      | Description                           |
| ----------------------- | --------- | ------------------------------------- |
| `id`                    | UUID      | Unique identifier                     |
| `email`                 | String    | User's email address (unique)         |
| `username`              | String    | User's username (unique)              |
| `loginType`             | String    | Authentication method                 |
| `profilePicture`        | String    | URL to profile picture                |
| `isEmailVerified`       | Boolean   | Email verification status             |
| `createdAt`             | DateTime  | Account creation timestamp            |
| `updatedAt`             | DateTime  | Last update timestamp                 |

### Todo

| Field          | Type      | Description                           |
| -------------- | --------- | ------------------------------------- |
| `id`           | UUID      | Unique identifier                     |
| `title`        | String    | Todo title (required)                 |
| `description`  | String    | Todo description                      |
| `dueDate`      | DateTime  | Due date for the todo                 |
| `userId`       | UUID      | Owner's user ID                       |
| `priority`     | String    | Priority level: low, medium, high     |
| `categoryId`   | UUID      | Associated category ID                |
| `isCompleted`  | Boolean   | Completion status                     |
| `createdAt`    | DateTime  | Creation timestamp                    |
| `updatedAt`    | DateTime  | Last update timestamp                 |

## Error Codes

| Status Code | Description                                    |
| ----------- | ---------------------------------------------- |
| `200`       | Success                                        |
| `201`       | Created successfully                           |
| `400`       | Bad Request - Validation error or invalid data |
| `401`       | Unauthorized - Missing or invalid token        |
| `404`       | Not Found - Resource doesn't exist             |
| `409`       | Conflict - Resource already exists             |
| `500`       | Internal Server Error                          |

## Common Validation Errors

### User Validation
- Email must be valid format
- Username: 3-30 characters, letters, numbers, and underscores only
- Password: Minimum 8 characters, must contain at least one uppercase, one lowercase, and one number
- Reset token: 64-character hexadecimal string
- Verification token: 64-character hexadecimal string

### Todo Validation
- Title required, max 256 characters
- Description max 256 characters
- Due date must be valid ISO 8601 datetime string
- Priority must be: `low`, `medium`, or `high`
- Category ID must be valid UUID
- Todo ID must be valid UUID
- For updates, at least one field must be provided

### Pagination Validation
- Page must be positive integer
- Limit must be positive integer, max 100
- Search query max 255 characters
- Sort by: `createdAt`, `dueDate`, `priority`
- Sort order: `asc`, `desc`
