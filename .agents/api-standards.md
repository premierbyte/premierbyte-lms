# API Standards

Version: 1.0.0

Status: Production Standard

---

# Purpose

This document defines the API standards for the platform.

Every API endpoint, whether internal or public, must follow these standards to ensure:

- Consistency
- Predictability
- Security
- Maintainability
- Versioning
- Scalability

These standards apply to:

- All backend REST API endpoints
- All frontend consumer integrations
- Shared packages and client libraries
- Future associated software products

---

# API Design Principles

Every API should be:

- RESTful
- Stateless
- Versioned
- Secure
- Predictable
- Well documented
- Easy to consume
- Backward compatible

---

# Base URL

Development

```
http://localhost:8000/api/v1
```

Production

```
https://api.example.com/v1
```

Every endpoint must include the API version.

Example

```
/api/v1/customers

/api/v1/orders

/api/v1/products
```

Never expose unversioned APIs.

---

# Resource Naming

Use plural nouns.

Correct

```
customers

products

orders

subscriptions

payments
```

Incorrect

```
customer

createCustomer

getCustomers
```

---

# HTTP Methods

Use proper HTTP verbs.

| Method | Purpose          |
| ------ | ---------------- |
| GET    | Retrieve data    |
| POST   | Create resource  |
| PUT    | Replace resource |
| PATCH  | Partial update   |
| DELETE | Delete resource  |

Examples

```
GET /customers

POST /customers

GET /customers/{id}

PATCH /customers/{id}

DELETE /customers/{id}
```

---

# Endpoint Naming

Use lowercase.

Good

```
/customers

/customer-types

/user-registrations
```

Avoid

```
/Customers

/GetCustomers

/customerList
```

---

# Nested Resources

Use nesting only when relationships are obvious.

Example

```
GET /customers/{customer}/orders

GET /categories/{category}/products
```

Avoid excessive nesting.

---

# Query Parameters

Filtering

```
GET /customers?status=active
```

Searching

```
GET /customers?search=john
```

Sorting

```
GET /customers?sort=name
```

Descending

```
GET /customers?sort=-created_at
```

Pagination

```
GET /customers?page=1&per_page=20
```

---

# Pagination

Every list endpoint must support pagination.

Default

```
20
```

Maximum

```
100
```

Response

```
{
  "success": true,
  "message": "Customers retrieved successfully.",
  "data": [],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 20,
    "total": 95
  },
  "errors": null
}
```

---

# Standard Response Format

Success

```json
{
  "success": true,
  "message": "Customer created successfully.",
  "data": {},
  "errors": null
}
```

Failure

```json
{
  "success": false,
  "message": "Validation failed.",
  "data": null,
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

Never return inconsistent JSON structures.

---

# HTTP Status Codes

| Status | Meaning           |
| ------ | ----------------- |
| 200    | OK                |
| 201    | Created           |
| 202    | Accepted          |
| 204    | No Content        |
| 400    | Bad Request       |
| 401    | Unauthorized      |
| 403    | Forbidden         |
| 404    | Not Found         |
| 409    | Conflict          |
| 422    | Validation Error  |
| 429    | Too Many Requests |
| 500    | Server Error      |

Use the correct status code.

Never return

```
200
```

for failed operations.

---

# Validation Errors

Always return

```
422
```

Example

```json
{
  "success": false,
  "message": "Validation failed.",
  "data": null,
  "errors": {
    "email": ["The email field is required."],
    "password": ["Password must be at least 8 characters."]
  }
}
```

---

# Authentication

Use Laravel Sanctum.

Protected routes require

```
Authorization: Bearer {token}
```

Never send access tokens through query parameters.

---

# Authorization

Authentication verifies identity.

Authorization verifies permissions.

Every protected endpoint must check permissions.

Example

```
customer.view

customer.create

customer.update

customer.delete
```

---

# API Resources

Every response must use Laravel API Resources.

Never return Eloquent models directly.

Correct

```php
return CustomerResource::make($customer);
```

Incorrect

```php
return response()->json($customer);
```

---

# Versioning

All APIs are versioned.

Current

```
v1
```

Future

```
v2
```

Breaking changes require a new version.

Never introduce breaking changes into an existing version.

---

# Date Format

Use ISO 8601.

Example

```
2026-08-15T14:30:00Z
```

Never return localized date strings.

---

# Boolean Values

Always use JSON booleans.

Correct

```json
{
  "active": true
}
```

Incorrect

```json
{
  "active": "Yes"
}
```

---

# Null Values

Use

```
null
```

instead of empty strings when data is absent.

Correct

```json
{
  "phone": null
}
```

---

# Filtering

Support common filters.

Example

```
GET /orders?status=completed

GET /customers?country=Nigeria

GET /products?category=software
```

---

# Searching

Use one search parameter.

```
?search=
```

Example

```
GET /customers?search=john
```

---

# Sorting

Ascending

```
?sort=name
```

Descending

```
?sort=-created_at
```

---

# Includes (Future)

Support optional eager loading.

Example

```
GET /customers?include=orders
```

Multiple

```
?include=orders,subscriptions
```

---

# Soft Deletes

Soft-deleted records are excluded by default.

Optional

```
?with_trashed=true

?only_trashed=true
```

---

# Bulk Operations

Support bulk operations when appropriate.

Example

```
POST /customers/bulk-delete

POST /products/bulk-update
```

Bulk requests should be validated individually where practical.

---

# Idempotency

PUT requests should be idempotent.

POST requests are generally not.

Payment-related endpoints should support idempotency keys where duplicate submissions are possible.

---

# Rate Limiting

Protect public APIs.

Example

```
60 requests/minute
```

Sensitive endpoints

```
Login

Registration

Password Reset
```

should have stricter limits.

---

# Error Codes

Business errors should include a machine-readable code.

Example

```json
{
  "success": false,
  "code": "USER_NOT_FOUND",
  "message": "User not found.",
  "data": null,
  "errors": null
}
```

Examples

```
USER_NOT_FOUND

UNAUTHORIZED_ACCESS

VALIDATION_FAILED

INSUFFICIENT_FUNDS

ITEM_OUT_OF_STOCK

RATE_LIMIT_EXCEEDED

PAYMENT_REQUIRED
```

---

# File Uploads

Use

```
multipart/form-data
```

Never Base64 encode files unless explicitly required.

Validate

- File type
- File size
- MIME type

---

# API Documentation

Every endpoint must include

- Description
- Authentication
- Parameters
- Request Body
- Example Request
- Example Response
- Status Codes
- Error Codes

Use

- OpenAPI 3.1
- Swagger UI

---

# Logging

Log

- Authentication
- Authorization failures
- Server errors
- Payment requests
- Security events

Never log

- Passwords
- Tokens
- Secrets
- Payment card data

---

# Security

Every endpoint must

- Validate input
- Authorize access
- Sanitize uploaded files
- Escape output where applicable
- Rate limit requests
- Use HTTPS in production

Never trust client input.

---

# Performance

Use

- Pagination
- Resource collections
- Eager loading
- Database indexes
- Response caching where appropriate

Avoid

- N+1 queries
- Outer-loop database calls
- Large payloads
- Unbounded list endpoints

---

# API Deprecation

Deprecated endpoints must

- Remain functional during the deprecation period
- Return deprecation headers where appropriate
- Be documented
- Provide migration guidance

Do not remove an API version without adequate notice.

---

# Client Compatibility

Any client SDKs and frontend consumers must rely exclusively on documented API contracts.

Avoid changing request or response structures in a way that breaks existing client versions.

---

# AI Coding Rules

AI-generated APIs must:

- Follow REST principles.
- Use proper HTTP status codes.
- Return the standard response structure.
- Use API Resources.
- Validate using Form Requests.
- Authorize using Policies or Gates.
- Keep Controllers thin.
- Place business logic in Services.
- Use Repositories for data access.
- Version every endpoint.
- Generate OpenAPI documentation where applicable.
- Produce production-ready code only.

---

# Definition of Done

An API endpoint is considered complete only if:

- It follows REST conventions.
- It is versioned.
- Authentication is implemented where required.
- Authorization is enforced.
- Validation uses Form Requests.
- Responses use API Resources.
- Error responses follow the standard format.
- Pagination, filtering, and sorting are supported where applicable.
- Automated tests are written.
- OpenAPI documentation is updated.
- Logging is implemented where necessary.
- No placeholder code remains.
- The implementation is production-ready.

---

# Guiding Principles

Every API should be **consistent, predictable, secure, and easy to integrate**.

The API is a long-term contract between the platform, client applications, and third-party integrations. Changes must prioritize backward compatibility, developer experience, and operational reliability.
