# Authorization Guidelines

Version: 1.0.0

Status: Production Standard

---

# Purpose

This document defines the authorization architecture for the platform.

Authorization determines **what an authenticated user is allowed to do** after their identity has been verified.

This standard applies to all backend APIs, frontend consumers, and associated applications.

---

# Authentication vs Authorization

Authentication answers:

> **Who are you?**

Authorization answers:

> **What are you allowed to do?**

These concerns must remain separate.

---

# Authorization Architecture

The platform uses **Role-Based Access Control (RBAC)** with optional **Permission-Based Access Control (PBAC)** for fine-grained access.

Implementation

- Laravel Policies
- Laravel Gates (when appropriate)
- `spatie/laravel-permission`
- Middleware
- Resource Policies

---

# Authorization Principles

Every action must be:

- Explicitly authorized
- Least-privilege by default
- Centrally managed
- Auditable
- Consistent across all modules

Never rely on frontend checks alone.

---

# Authorization Flow

```
User

↓

Authenticated

↓

Role

↓

Permissions

↓

Policy / Gate

↓

Authorized?

↓

Controller

↓

Business Logic
```

Authorization must occur **before** business logic executes.

---

# Roles

Roles represent collections of permissions.

Platform default roles

```
Super Admin

Administrator

Support

Finance

Developer

Read Only
```

Each role receives only the permissions required for its responsibilities.

---

# Permissions

Permissions represent a single action.

Naming convention

```
resource.action
```

Examples

```
users.view

users.create

users.update

users.delete

customers.view

customers.create

customers.update

customers.delete

orders.view

orders.create

orders.ship

orders.refund

products.view

products.create

products.update

subscriptions.renew

payments.view

payments.refund

settings.update

reports.export

audit_logs.view
```

Permission names must:

- Be lowercase
- Use dot notation
- Remain stable once released

---

# Permission Groups

Permissions should be grouped by module.

Example

## Customers

```
customers.view

customers.create

customers.update

customers.delete
```

## Orders

```
orders.view

orders.create

orders.ship

orders.refund
```

## Products

```
products.view

products.create

products.update

products.delete
```

---

# Role Assignment

Users may have:

- One role
- Multiple roles

Effective permissions are the union of all assigned roles and any directly assigned permissions.

---

# Direct Permissions

Direct permissions should be used sparingly.

Example

Support user

↓

Temporary permission

```
orders.refund
```

without changing the user's role.

---

# Super Admin

Super Admin bypasses all permission checks except where explicitly restricted.

Implementation example

```php
Gate::before(function ($user, $ability) {
    return $user->hasRole('Super Admin') ? true : null;
});
```

Use this capability carefully.

---

# Laravel Policies

Every resource must have a Policy.

Examples

```
CustomerPolicy

ProductPolicy

OrderPolicy

SubscriptionPolicy

PaymentPolicy
```

Policies should contain authorization logic only.

---

# Example Policy Methods

```
viewAny()

view()

create()

update()

delete()

restore()

forceDelete()
```

Add custom methods as needed.

Example

```
ship()

renew()

refund()

download()
```

---

# Controller Authorization

Authorize actions before executing business logic.

Example

```php
public function update(UpdateCustomerRequest $request, Customer $customer)
{
    $this->authorize('update', $customer);

    return $this->customerService->update($customer, $request->validated());
}
```

Never skip authorization checks.

---

# Middleware

Use middleware for route-level protection.

Examples

```
auth:sanctum

verified

permission:customers.view

role:Administrator
```

Prefer permission middleware over role middleware where possible.

---

# Gates

Use Gates for simple, application-wide authorization that is not tied to a specific model.

Example

```
view-dashboard

manage-settings
```

Complex resource rules should use Policies.

---

# Module Permissions

Each module owns its permissions.

Example

Customers Module

```
customers.view

customers.create

customers.update

customers.delete
```

Payments Module

```
payments.view

payments.refund

payments.export
```

Avoid sharing permissions across unrelated modules.

---

# Ownership Rules

Certain actions require ownership checks.

Example

A customer should only access:

- Their own invoices
- Their own subscriptions
- Their own order history

Policies should enforce ownership.

---

# Feature-Based Authorization

Some functionality depends on active feature flags.

Example

```
Feature::active('advanced_reports')
```

Authorization should combine:

1. User permission
2. Feature availability

Example

```
User has reports.export

AND

Feature has advanced_reports
```

Both conditions must pass.

---

# Frontend Authorization

The frontend may:

- Hide menu items
- Disable buttons
- Display upgrade prompts

However, the backend remains the final authority.

Never rely solely on frontend checks.

---

# API Authorization

Every protected endpoint must:

- Authenticate the request
- Verify permissions
- Verify feature availability (if applicable)
- Return appropriate HTTP status codes

Example

```
401 Unauthorized

403 Forbidden
```

---

# Audit Logging

Record authorization-sensitive events.

Examples

- Role assigned
- Role removed
- Permission granted
- Permission revoked
- Failed authorization
- Privileged action executed

Logs should include:

- User
- Action
- Timestamp
- Resource
- Outcome

---

# Permission Caching

Cache permissions to improve performance.

Clear permission cache whenever:

- Roles change
- Permissions change
- User assignments change

---

# Naming Standards

Roles

```
Pascal Case

Super Admin

Customer Success
```

Permissions

```
lowercase.dot.notation

users.view

orders.ship
```

Policies

```
CustomerPolicy

OrderPolicy
```

---

# Security Principles

Never:

- Trust frontend permissions
- Authorize by user ID alone
- Hardcode role names inside business logic
- Skip authorization for internal endpoints

Always:

- Use Policies or Gates
- Validate ownership
- Respect least privilege
- Log privileged operations

---

# Future Enhancements

Support for:

- Attribute-Based Access Control (ABAC)
- Department-based permissions
- Team-based permissions
- Multi-tenant role isolation
- Time-limited permissions
- Delegated administration
- Approval workflows

The architecture should allow these additions without major redesign.

---

# AI Coding Rules

AI-generated authorization code must:

- Use `spatie/laravel-permission`.
- Authorize every protected action.
- Create Policies for every resource.
- Keep authorization separate from business logic.
- Never hardcode permission checks inside Services.
- Use middleware where appropriate.
- Combine permission checks with feature flags when required.
- Generate production-ready code only.

---

# Definition of Done

Authorization is considered complete when:

- Roles are defined.
- Permissions follow naming conventions.
- Policies exist for all protected resources.
- Controllers authorize every protected action.
- Middleware protects routes.
- Feature-based access is enforced where applicable.
- Permission caching is configured.
- Audit logs capture authorization events.
- Automated tests cover authorization scenarios.
- Documentation is complete.

---

# Example Authorization Flow

```text
User Login
      │
      ▼
Authenticated
      │
      ▼
Check Role
      │
      ▼
Check Permission
      │
      ▼
Check Resource Policy
      │
      ▼
Check License Feature (if required)
      │
      ▼
Authorized?
   │        │
  Yes        No
   │          │
   ▼          ▼
Execute   Return 403
```

---

# Guiding Principles

Authorization answers **"What can this user do?"**

Every protected action within the ecosystem must be enforced by the backend using a combination of:

- Authentication
- Roles
- Permissions
- Policies
- Feature Flags
- Ownership Rules

This layered approach ensures secure, maintainable, and scalable access control across all products while supporting future expansion into multi-tenant and enterprise environments.
