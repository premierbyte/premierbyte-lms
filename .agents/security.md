# Security Guidelines

Version: 1.0.0

Status: Production Standard

---

# Purpose

This document defines the security standards and guidelines for the platform and associated applications. 

Every developer and AI coding assistant must follow these standards to ensure applications are protected against vulnerabilities, regardless of the active framework or language stack.

---

# Core Security Principles

1. **Defense in Depth**: Secure all application boundaries (Frontend, API endpoints, Databases, Network, and Infrastructure).
2. **Least Privilege**: Users and processes must only have access to resources necessary for their specific tasks.
3. **Zero Trust**: Always validate and authorize requests on the backend, even if they have already passed frontend validation checks.
4. **Secure Failure**: Never expose database structures, system configurations, stack traces, or raw exceptions to the client.

---

# Authentication & Session Security

## API & Token Security
- **Secure Token Storage**: If token-based authentication is used (e.g. JWTs or API keys), store tokens securely. Avoid plain `localStorage` or `sessionStorage` for sensitive session tokens where they are vulnerable to Cross-Site Scripting (XSS).
- **HTTP-Only Cookies**: Preferred for session-based SPAs. Always configure cookies with:
  - `HttpOnly` (Prevents client-side JS from accessing the cookie)
  - `Secure` (Forces transmission over HTTPS only)
  - `SameSite=Lax` or `Strict` (Mitigates CSRF risks)
- **Brute Force Prevention**: Enable rate limiting on login, registration, and password reset endpoints.

---

# Authorization & Access Control

- **Granular Policies**: Implement policy hooks or middleware guards for every resource and endpoint action.
- **Explicit Access Checks**: Request handlers must explicitly call permission verification before executing business logic.
- **RBAC / ABAC**: Use structured Roles and Permissions systems to manage access permissions.
- **No Client-Side Reliance**: Hiding UI buttons or menus is for user experience. The backend API is the final authority and must authenticate and authorize every request.

---

# Input Validation & Sanitization

- **Explicit Validation**: Use dedicated request validators or validation schemas (e.g., Zod, Form Requests) for every input boundary. Define strict data types and constraints.
- **Output Encoding / Sanitization**: Escape or sanitize all dynamic variables rendered to prevent Cross-Site Scripting (XSS). If rich text is allowed, sanitize it using trusted libraries (e.g. Purifier, DOMPurify).

---

# Prevention of Common Vulnerabilities

## 1. SQL Injection
- Always use parameterized queries or trusted ORM features.
- Never concatenate raw user input directly into query strings (e.g. avoid raw string interpolation in DB queries).
- Whitelist dynamic sort columns or database tables before inserting them into queries.

## 2. Cross-Site Scripting (XSS)
- Rely on framework-level automatic output escaping (e.g., Blade's `{{ }}`, React's JSX string rendering, or Vue's `{{ }}`).
- Sanitize HTML dynamic rendering explicitly.

## 3. Cross-Site Request Forgery (CSRF)
- Use built-in CSRF token protection for all stateful POST, PUT, PATCH, and DELETE requests.
- Ensure stateful SPAs fetch and append the CSRF cookie header before sending state-changing API payloads.

## 4. Insecure Direct Object References (IDOR)
- Never assume a client has access to a record just because they provide its ID.
- Always check that the requested resource belongs to the authenticated user or tenant (e.g. query through a relationship scope like `auth()->user()->orders()->findOrFail($id)`).

---

# Rate Limiting & CORS

- **Rate Limiting**: Enforce request throttles at the API gateway level:
  - Standard API routes: e.g. Max 60-120 requests/minute.
  - Critical authentication endpoints: e.g. Max 5-10 requests/minute.
- **CORS (Cross-Origin Resource Sharing)**: Configure allowed origins to specific trusted production domains. Never set allowed origins to `*` in production for endpoints accepting authentication credentials.

---

# Data Protection

- **Transit Security**: Force HTTPS/SSL globally. Configure HSTS (HTTP Strict Transport Security) headers.
- **At-Rest Protection**: Encrypt sensitive data columns (personal data, external access keys) using strong encryption algorithms (e.g., AES-256).
- **Secrets Management**: Never check API keys, db passwords, or secret tokens into version control. Load them via environment variables (`.env`).
