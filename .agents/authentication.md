# Authentication Guidelines

Version: 1.0.0

Status: Production Standard

---

# Purpose

This document defines the authentication architecture for the platform.

It establishes how users authenticate, how sessions and API tokens are managed, and the security requirements for all applications in this ecosystem.

---

# Authentication Principles

Authentication must be:

- Secure
- Stateless for APIs
- Session-based for web
- Scalable
- Easy to maintain
- Consistent across products

Authentication only verifies identity.

Authorization is handled separately using Roles and Permissions.

---

# Authentication Stack

## Backend

- Laravel 12
- Laravel Sanctum
- Laravel Fortify (authentication backend)
- Password Hashing (Argon2id)
- Email Verification
- Password Reset
- Session Management

---

## Frontend

- Next.js 16
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Secure HTTP-only Cookies

---

# Authentication Methods

Supported

- Email & Password
- Remember Me
- Password Reset
- Email Verification

Future

- Google Login
- Microsoft Login
- GitHub Login
- Two-Factor Authentication (2FA)
- Passkeys (WebAuthn)

---

# Authentication Flow

```
User

↓

Login Screen

↓

Laravel Validation

↓

Credential Verification

↓

Create Session

↓

Issue Sanctum Token (API)

↓

Authenticated
```

---

# Login

Required fields

```text
Email
Password
```

Optional

```text
Remember Me
```

Validation

- Email required
- Valid email format
- Password required

Passwords are never stored or transmitted in plain text.

---

# Logout

Logout must:

- Revoke current API token (if applicable)
- Invalidate session
- Regenerate CSRF token
- Clear authentication cookies

---

# Registration

Supported for:

- Internal Platform Users (invited by administrators)
- Portal Users (if enabled)

Required fields

- First Name
- Last Name
- Email
- Password

Email addresses must be unique.

---

# Password Requirements

Minimum

- 12 characters

Must contain

- Uppercase letter
- Lowercase letter
- Number
- Special character

Must not

- Match the user's email
- Be a commonly compromised password (where supported)
- Be reused if password history is implemented

---

# Password Hashing

Use Laravel's default hashing with Argon2id.

Never

- Store plain-text passwords
- Implement custom hashing algorithms

---

# Password Reset

Flow

```
Forgot Password

↓

Email Link

↓

Secure Reset Token

↓

Set New Password

↓

Invalidate Old Sessions (recommended)

↓

Login
```

Reset links should expire after a configurable period (default: 60 minutes).

---

# Email Verification

Every new account must verify its email address before accessing protected functionality, unless explicitly exempted.

Verification Flow

```
Register

↓

Verification Email

↓

Click Link

↓

Verified
```

---

# Session Management

Web authentication uses secure sessions.

Sessions should:

- Expire after inactivity
- Regenerate on login
- Be invalidated on logout

Recommended idle timeout

```
120 minutes
```

---

# API Authentication

Use Laravel Sanctum.

Protected requests

```
Authorization: Bearer {token}
```

Never expose API tokens in URLs.

---

# Personal Access Tokens

Tokens should include:

- Name
- Abilities (Scopes)
- Expiration (recommended)

Example abilities

```
users:read

users:write

reports:read

settings:read
```

Revoke tokens that are no longer required.

---

# Remember Me

If enabled

- Extend session lifetime
- Use secure, encrypted cookies
- Allow revocation from account settings

---

# Multi-Device Sessions

Users may be signed in on multiple devices.

Users should be able to:

- View active sessions
- Revoke individual sessions
- Sign out of all devices

---

# Failed Login Protection

Protect against brute-force attacks.

Recommendations

- Rate limit login attempts
- Temporary lockout after repeated failures
- Log failed authentication attempts

---

# CSRF Protection

All state-changing web requests must be protected with CSRF tokens.

Laravel's built-in CSRF protection should remain enabled.

---

# CORS

Only allow trusted frontend origins.

Do not use

```
*
```

in production unless explicitly required for a public API.

---

# Cookies

Authentication cookies must be:

- HTTP Only
- Secure (HTTPS)
- SameSite=Lax or Strict where appropriate

Do not store sensitive data in cookies.

---

# Account Locking

Accounts may be temporarily locked after repeated failed login attempts.

Administrators should be able to unlock accounts if required.

---

# Audit Logging

Record authentication events.

Examples

- Login
- Logout
- Failed Login
- Password Reset
- Email Verification
- Session Revocation
- Token Creation
- Token Revocation

Logs should include timestamps and relevant identifiers without exposing secrets.

---

# User Profile

Authenticated users can:

- View profile
- Update name
- Update avatar
- Change password
- Manage sessions
- Manage API tokens (where applicable)

Changing an email address should require re-verification.

---

# Future Two-Factor Authentication

Support future implementation of:

- TOTP Authenticator Apps
- Backup Codes
- Email Verification Codes (optional)

2FA should be configurable per user or enforced globally.

---

# Single Sign-On (Future)

Future support may include:

- OAuth 2.0
- OpenID Connect
- Microsoft Entra ID
- Google Workspace
- LDAP / Active Directory

---

# Security Best Practices

Authentication must:

- Use HTTPS
- Hash passwords
- Protect against brute-force attacks
- Regenerate sessions on login
- Use secure cookies
- Validate all input
- Log authentication events

Never:

- Log passwords
- Expose tokens
- Return sensitive error messages
- Reveal whether an email exists during password reset requests

---

# Error Responses

Examples

```json
{
  "success": false,
  "code": "INVALID_CREDENTIALS",
  "message": "The provided credentials are incorrect.",
  "data": null,
  "errors": null
}
```

```json
{
  "success": false,
  "code": "EMAIL_NOT_VERIFIED",
  "message": "Please verify your email address before continuing.",
  "data": null,
  "errors": null
}
```

Keep error messages informative without exposing unnecessary information.

---

# AI Coding Rules

AI-generated authentication code must:

- Use Laravel Sanctum.
- Use Laravel Fortify authentication features where applicable.
- Hash passwords using Laravel defaults.
- Keep authentication logic separate from authorization.
- Never store or log passwords.
- Validate all requests with Form Requests where appropriate.
- Protect authenticated routes.
- Use secure cookies and HTTPS assumptions.
- Generate production-ready code only.

---

# Definition of Done

Authentication is considered complete when:

- Users can log in securely.
- Users can log out securely.
- Password reset works.
- Email verification works.
- Sessions are managed correctly.
- API authentication uses Sanctum.
- Failed login protection is enabled.
- Audit logging is implemented.
- Authentication tests pass.
- Documentation is complete.

---

# Guiding Principles

Authentication answers **"Who are you?"**

It should be simple for legitimate users, difficult for attackers, and consistent across every product.

All applications should share the same authentication philosophy while allowing each product to manage its own users independently.
