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

## User Login Endpoint

### `POST /users/login`

#### Description
Authenticates a user with their email and password credentials. Returns a JWT authentication token upon successful login.

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
  "email": "string (required, must be a valid email format)",
  "password": "string (required, minimum 6 characters)"
}
```

#### Field Requirements

| Field | Type | Requirements | Description |
|-------|------|--------------|-------------|
| `email` | String | Required, valid email format | User's registered email address |
| `password` | String | Required, min 6 characters | User's password |

---

### Response Format

#### Success Response (HTTP 200 - OK)
```json
{
  "token": "jwt_token_string",
  "message": "Login successful",
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
      "value": "invalid-email",
      "msg": "Please provide a valid email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

**HTTP 401 - Unauthorized (Invalid Credentials)**
```json
{
  "message": "Invalid email or password"
}
```

This response is returned when:
- The email does not exist in the system
- The password does not match the registered password

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
| `200` | OK | User successfully authenticated. A JWT token is returned. |
| `400` | Bad Request | Validation error - one or more required fields are invalid or missing. |
| `401` | Unauthorized | Invalid email or password. Credentials do not match. |
| `500` | Internal Server Error | Server error occurred during login. |

---

### Example Usage

#### cURL Request
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "secure123"
  }'
```

#### JavaScript Fetch
```javascript
const response = await fetch('/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
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

const login = async () => {
  try {
    const response = await axios.post('/users/login', {
      email: 'john.doe@example.com',
      password: 'secure123'
    });
    
    console.log('Login successful:', response.data);
    console.log('Token:', response.data.token);
  } catch (error) {
    console.error('Login failed:', error.response.data);
  }
};
```

---

### Validation Rules Summary

| Field | Rule | Error Message |
|-------|------|---------------|
| `email` | Valid email format | "Please provide a valid email" |
| `password` | Min 6 characters | "Password must be at least 6 characters long" |

---

### Security Notes

- Passwords are compared using **bcrypt** for secure verification
- Returned JWT tokens expire in **7 days**
- Generic error message ("Invalid email or password") is used for both email not found and incorrect password to prevent user enumeration attacks
- Passwords are never returned in the response

---

### Authentication Token

Upon successful login, a JWT token is issued that can be used for authenticated requests:

```
Header: Authorization: Bearer <token>
```

The token contains:
- User's MongoDB `_id`
- Expiration time: 7 days
- Signed with `JWT_SECRET` environment variable

---

## User Profile Endpoint

### `GET /users/profile`

#### Description
Retrieves the authenticated user's profile information. This endpoint requires a valid JWT authentication token and returns the current user's details.

---

### Request Format

#### HTTP Method
```
GET
```

#### Headers
The endpoint requires authentication via JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

#### Request Body
No body required.

---

### Response Format

#### Success Response (HTTP 200 - OK)
```json
{
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

**HTTP 401 - Unauthorized (Missing or Invalid Token)**
```json
{
  "message": "Unauthorized"
}
```

This response is returned when:
- Authorization header is missing
- Token is invalid or expired
- Token format is incorrect

**HTTP 404 - Not Found (User Deleted)**
```json
{
  "message": "User not found"
}
```

This response is returned when the user associated with the token no longer exists in the database.

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
| `200` | OK | User profile retrieved successfully. |
| `401` | Unauthorized | Missing or invalid authentication token. |
| `404` | Not Found | User not found in the database. |
| `500` | Internal Server Error | Server error occurred while fetching profile. |

---

### Example Usage

#### cURL Request
```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer <your_jwt_token>"
```

#### JavaScript Fetch
```javascript
const response = await fetch('/users/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log(data);
```

#### Axios Request
```javascript
import axios from 'axios';

const getProfile = async (token) => {
  try {
    const response = await axios.get('/users/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Profile retrieved:', response.data.user);
  } catch (error) {
    console.error('Failed to fetch profile:', error.response.data);
  }
};
```

---

### Authentication Requirements

- Valid JWT token is required
- Token can be obtained from `/users/register` or `/users/login`
- Token must be included in the Authorization header with format: `Bearer <token>`

---

## User Logout Endpoint

### `GET /users/logout`

#### Description
Logs out the current user by invalidating their authentication token. This endpoint clears the authentication cookie and blacklists the token to prevent further use.

---

### Request Format

#### HTTP Method
```
GET
```

#### Headers (Optional)
The Authorization header can be provided to blacklist the specific token:

```
Authorization: Bearer <jwt_token>
```

If no Authorization header is provided, the token from cookies will be blacklisted.

#### Request Body
No body required.

---

### Response Format

#### Success Response (HTTP 200 - OK)
```json
{
  "message": "Logout successful"
}
```

#### Error Responses

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
| `200` | OK | User successfully logged out. Token has been invalidated. |
| `500` | Internal Server Error | Server error occurred during logout. |

---

### Example Usage

#### cURL Request
```bash
curl -X GET http://localhost:3000/users/logout \
  -H "Authorization: Bearer <your_jwt_token>"
```

Or with cookie (if token is stored as cookie):
```bash
curl -X GET http://localhost:3000/users/logout \
  -b "token=<your_jwt_token>"
```

#### JavaScript Fetch
```javascript
const response = await fetch('/users/logout', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log(data);
```

#### Axios Request
```javascript
import axios from 'axios';

const logout = async (token) => {
  try {
    const response = await axios.get('/users/logout', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Logout successful:', response.data.message);
  } catch (error) {
    console.error('Logout failed:', error.response.data);
  }
};
```

---

### Token Invalidation

- The authentication token is blacklisted and cannot be reused
- The authentication cookie is cleared from the client
- Subsequent requests using the invalidated token will be rejected
- The token remains in the blacklist for the duration of its expiration time (7 days)

---

### Security Notes

- Tokens are blacklisted to prevent reuse after logout
- Cookie-based tokens are also cleared on the client side
- It is recommended to delete the stored token on the client after logout
- Token blacklist is stored in the database for verification on protected routes

---

## Captain Registration Endpoint

### `POST /captain/register`

#### Description
Registers a new captain (driver) in the system. This endpoint creates a new captain account with personal credentials and vehicle information, returning an authentication token upon successful registration. Captains are associated with their vehicle details for ride management.

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
  "password": "string (required, minimum 6 characters)",
  "vehicle": {
    "color": "string (required, minimum 3 characters)",
    "plate": "string (required, minimum 3 characters, unique)",
    "capacity": "number (required, minimum 1 seat)",
    "vehicleType": "string (required, one of: 'car', 'motorcycle', 'auto')"
  }
}
```

#### Field Requirements

| Field | Type | Requirements | Description |
|-------|------|--------------|-------------|
| `fullName.firstName` | String | Required, min 3 characters | Captain's first name |
| `fullName.lastName` | String | Optional, min 3 characters | Captain's last name |
| `email` | String | Required, valid email format, unique | Captain's unique email address |
| `password` | String | Required, min 6 characters | Captain's password (will be hashed with bcrypt) |
| `vehicle.color` | String | Required, min 3 characters | Vehicle color (e.g., "Red", "Blue", "White") |
| `vehicle.plate` | String | Required, min 3 characters, unique | Vehicle license plate number |
| `vehicle.capacity` | Number | Required, min 1 | Number of passengers the vehicle can accommodate |
| `vehicle.vehicleType` | String | Required, enum | Type of vehicle: `car`, `motorcycle`, or `auto` |

---

### Response Format

#### Success Response (HTTP 201 - Created)
```json
{
  "token": "jwt_token_string",
  "message": "Captain registered successfully",
  "captain": {
    "_id": "mongodb_object_id",
    "fullName": {
      "firstName": "Rajesh",
      "lastName": "Kumar"
    },
    "email": "rajesh.kumar@example.com",
    "status": "inactive",
    "vehicle": {
      "color": "Red",
      "plate": "DL01AB1234",
      "capacity": 4,
      "vehicleType": "car",
      "location": {
        "lat": null,
        "lng": null
      }
    },
    "socketId": null
  }
}
```

#### Error Responses

**HTTP 400 - Bad Request (Validation Error - First Name)**
```json
{
  "errors": [
    {
      "type": "field",
      "value": "Ra",
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

**HTTP 400 - Bad Request (Invalid Vehicle Color)**
```json
{
  "errors": [
    {
      "type": "field",
      "value": "Bl",
      "msg": "Color must be at least 3 characters long",
      "path": "vehicle.color",
      "location": "body"
    }
  ]
}
```

**HTTP 400 - Bad Request (Invalid Vehicle Plate)**
```json
{
  "errors": [
    {
      "type": "field",
      "value": "DL",
      "msg": "Plate number must be at least 3 characters long",
      "path": "vehicle.plate",
      "location": "body"
    }
  ]
}
```

**HTTP 400 - Bad Request (Invalid Vehicle Capacity)**
```json
{
  "errors": [
    {
      "type": "field",
      "value": 0,
      "msg": "Capacity must be at least 1",
      "path": "vehicle.capacity",
      "location": "body"
    }
  ]
}
```

**HTTP 400 - Bad Request (Invalid Vehicle Type)**
```json
{
  "errors": [
    {
      "type": "field",
      "value": "truck",
      "msg": "Vehicle type must be car, motorcycle, or auto",
      "path": "vehicle.vehicleType",
      "location": "body"
    }
  ]
}
```

**HTTP 400 - Bad Request (Duplicate Email)**
```json
{
  "message": "Email already in use"
}
```

**HTTP 400 - Bad Request (Duplicate Plate Number)**
```json
{
  "message": "Plate number already registered"
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
| `201` | Created | Captain successfully registered. A JWT token is returned. |
| `400` | Bad Request | Validation error - one or more required fields are invalid, missing, or duplicate. |
| `500` | Internal Server Error | Server error occurred during registration. |

---

### Example Usage

#### cURL Request
```bash
curl -X POST http://localhost:3000/captain/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": {
      "firstName": "Rajesh",
      "lastName": "Kumar"
    },
    "email": "rajesh.kumar@example.com",
    "password": "secure123",
    "vehicle": {
      "color": "Red",
      "plate": "DL01AB1234",
      "capacity": 4,
      "vehicleType": "car"
    }
  }'
```

#### JavaScript Fetch
```javascript
const response = await fetch('/captain/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fullName: {
      firstName: 'Rajesh',
      lastName: 'Kumar'
    },
    email: 'rajesh.kumar@example.com',
    password: 'secure123',
    vehicle: {
      color: 'Red',
      plate: 'DL01AB1234',
      capacity: 4,
      vehicleType: 'car'
    }
  })
});

const data = await response.json();
console.log(data);
```

#### Axios Request
```javascript
import axios from 'axios';

const registerCaptain = async () => {
  try {
    const response = await axios.post('/captain/register', {
      fullName: {
        firstName: 'Rajesh',
        lastName: 'Kumar'
      },
      email: 'rajesh.kumar@example.com',
      password: 'secure123',
      vehicle: {
        color: 'Red',
        plate: 'DL01AB1234',
        capacity: 4,
        vehicleType: 'car'
      }
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
| `email` | Unique (database) | Email already in use |
| `password` | Min 6 characters | "Password must be at least 6 characters long" |
| `vehicle.color` | Min 3 characters | "Color must be at least 3 characters long" |
| `vehicle.plate` | Min 3 characters, unique | "Plate number must be at least 3 characters long" or "Plate number already registered" |
| `vehicle.capacity` | Integer, min 1 | "Capacity must be at least 1" |
| `vehicle.vehicleType` | Enum: car, motorcycle, auto | "Vehicle type must be car, motorcycle, or auto" |

---

### Security Notes

- Passwords are hashed using **bcrypt** with a salt of 10 rounds before storage
- Returned JWT tokens expire in **7 days**
- Email addresses must be unique across the system
- Vehicle plate numbers must be unique across the system
- Passwords are never returned in the response
- New captains start with `status: 'inactive'` by default

---

### Authentication Token

Upon successful registration, a JWT token is issued that can be used for authenticated requests:

```
Header: Authorization: Bearer <token>
```

The token contains:
- Captain's MongoDB `_id`
- Expiration time: 7 days
- Signed with `JWT_SECRET` environment variable

---

### Captain Status

| Status | Description |
|--------|-------------|
| `inactive` | Default status for newly registered captains. The captain is not available for rides. |
| `active` | Captain is available and can accept ride requests. |

Status can be changed through captain profile update endpoints or when the captain comes online/offline.

---

### Vehicle Location

The vehicle location fields (`lat`, `lng`) are initially set to `null` and can be updated when the captain comes online or through a separate location update endpoint. These coordinates represent the captain's real-time location for ride matching.

---

### Next Steps After Registration

1. **Login**: Use `/captain/login` to obtain a token if registration was successful
2. **Update Profile**: Use captain profile update endpoint to modify captain details
3. **Update Location**: Send real-time location coordinates when captain comes online
4. **Accept Rides**: Once authenticated and active, captain can receive and accept ride requests

---
