# UberClone Backend API Documentation

## User Registration Endpoint

### `POST /users/register`

#### Description
Registers a new user in the system. This endpoint creates a new user account with the provided credentials and returns an authentication token upon successful registration.

---

### Request Format

#### HTTP Method
```
POST
```

#### Content-Type
```
application/json
```

#### Request Body
The endpoint expects a JSON object with the following structure:

```json
{
  "fullName": {
    "firstName": "string (required, minimum 3 characters)",
    "lastName": "string (optional, minimum 3 characters if provided)"
  },
  "email": "string (required, must be a valid email format)",
  "password": "string (required, minimum 6 characters)"
}
```

#### Field Requirements

| Field | Type | Requirements | Description |
|-------|------|--------------|-------------|
| `fullName.firstName` | String | Required, min 3 characters | User's first name |
| `fullName.lastName` | String | Optional, min 3 characters | User's last name |
| `email` | String | Required, valid email format | User's unique email address |
| `password` | String | Required, min 6 characters | User's password (will be hashed with bcrypt) |

---

### Response Format

#### Success Response (HTTP 201 - Created)
```json
{
  "token": "jwt_token_string",
  "message": "User registered successfully",
  "user": {
    "_id": "mongodb_object_id",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

#### Error Responses

**HTTP 400 - Bad Request (Validation Error)**
```json
{
  "errors": [
    {
      "type": "field",
      "value": "jd",
      "msg": "First name must be at least 3 characters long",
      "path": "fullName.firstName",
      "location": "body"
    }
  ]
}
```

**HTTP 400 - Bad Request (Invalid Email)**
```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Please provide a valid email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

**HTTP 400 - Bad Request (Weak Password)**
```json
{
  "errors": [
    {
      "type": "field",
      "value": "12345",
      "msg": "Password must be at least 6 characters long",
      "path": "password",
      "location": "body"
    }
  ]
}
```

**HTTP 500 - Server Error**
```json
{
  "message": "Server error"
}
```

---

### Status Codes

| Status Code | Meaning | Description |
|-------------|---------|-------------|
| `201` | Created | User successfully registered. A JWT token is returned. |
| `400` | Bad Request | Validation error - one or more required fields are invalid or missing. |
| `500` | Internal Server Error | Server error occurred during registration. |

---

### Example Usage

#### cURL Request
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "secure123"
  }'
```

#### JavaScript Fetch
```javascript
const response = await fetch('/users/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fullName: {
      firstName: 'John',
      lastName: 'Doe'
    },
    email: 'john.doe@example.com',
    password: 'secure123'
  })
});

const data = await response.json();
console.log(data);
```

#### Axios Request
```javascript
import axios from 'axios';

const register = async () => {
  try {
    const response = await axios.post('/users/register', {
      fullName: {
        firstName: 'John',
        lastName: 'Doe'
      },
      email: 'john.doe@example.com',
      password: 'secure123'
    });
    
    console.log('Registration successful:', response.data);
    console.log('Token:', response.data.token);
  } catch (error) {
    console.error('Registration failed:', error.response.data);
  }
};
```

---

### Validation Rules Summary

| Field | Rule | Error Message |
|-------|------|---------------|
| `fullName.firstName` | Min 3 characters | "First name must be at least 3 characters long" |
| `email` | Valid email format | "Please provide a valid email" |
| `password` | Min 6 characters | "Password must be at least 6 characters long" |
| `email` | Unique (database) | Email already exists in system |

---

### Security Notes

- Passwords are hashed using **bcrypt** with a salt of 10 rounds before storage
- Returned JWT tokens expire in **7 days**
- Email addresses must be unique across the system
- Passwords are never returned in the response

---

### Authentication Token

Upon successful registration, a JWT token is issued that can be used for authenticated requests:

```
Header: Authorization: Bearer <token>
```

The token contains:
- User's MongoDB `_id`
- Expiration time: 7 days
- Signed with `JWT_SECRET` environment variable

---
