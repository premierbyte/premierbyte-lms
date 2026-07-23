# Coding Standards

Version: 1.0.0

---

# Purpose

This document defines the coding standards and quality metrics for the platform.

These standards are **system-agnostic** and apply to any backend language (e.g. PHP, TypeScript/Node, Python, Java) and frontend codebase. The goal is to ensure consistency, readability, maintainability, and testability across all projects.

---

# General Quality Principles

All code must adhere to:

- **SOLID Principles**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.
- **DRY (Don't Repeat Yourself)**: Avoid duplicated logic. Encapsulate shared behavior in reusable methods, hooks, or classes.
- **KISS (Keep It Simple, Stupid)**: Write clear, readable code. Never write overly complex or "clever" code that sacrifices readability.
- **YAGNI (You Aren't Gonna Need It)**: Do not write code or abstractions for features you *think* you might need in the future. Implement only what is required.
- **Composition over Inheritance**: Favor object composition to share functionality rather than deep class inheritance hierarchies.

---

# Naming Conventions

Maintain consistent naming patterns across all repositories:

## 1. Classes / Modules / Entities
Use **PascalCase** (singular for classes, plural for folders/modules).
- Good: `CustomerService`, `OrderRepository`, `ProcessPaymentAction`.
- Bad: `customerService`, `order_repository`.

## 2. Methods / Functions / Variables
Use **camelCase**.
- Good: `calculateTotal()`, `getUserPermissions()`, `$currentUser`.
- Bad: `calculate_total()`, `GetPermissions()`, `$current_user`.

## 3. Database Tables / Fields
Use **snake_case** (plural for tables).
- Good: `order_items`, `subscription_plans`, `user_id`.
- Bad: `OrderItems`, `subscriptionPlans`, `userId`.

## 4. API Endpoints
Use **kebab-case** (plural resource nouns).
- Good: `/api/v1/order-items`, `/api/v1/customer-profiles`.
- Bad: `/api/v1/getOrderItems`, `/api/v1/customer_profiles`.

## 5. Permission Keys
Use **lowercase dot notation** (`resource.action`).
- Good: `users.view`, `orders.ship`, `payments.refund`.
- Bad: `usersView`, `orders_ship`.

---

# Backend Separation of Concerns (General)

Keep boundaries clean between execution steps:

- **薄 (Thin) Controllers**: Controllers are only responsible for request routing, validation calling, authorization checking, and returning formatted output. They must contain no business calculations or DB queries.
- **Services / Actions**: Business workflows must exist inside dedicated Services (e.g., `OrderService`) or single-action classes (e.g., `ProcessPaymentAction`).
- **Repositories**: Database read/write queries must be encapsulated inside Repositories rather than calling ORM query builders directly from services or controllers.
- **DTOs**: Wrap request payloads in typed Data Transfer Objects rather than passing raw request wrappers into services.

---

# Clean Code Rules

- **Strict Type Declarations**: Always enable strict typing in languages that support it (e.g. `declare(strict_types=1);` in PHP, `strict: true` in TypeScript). Define explicit types for return values, function arguments, and class properties.
- **Self-Documenting Code**: Write code that explains *what* it does through naming. Comments should only explain *why* a particular decision was made, or detail complex algorithms.
- **No Magic Numbers**: Use descriptive constant values or configuration parameters instead of inline numbers or strings.
  - Good: `if ($days > GracePeriod::LIMIT_DAYS)`
  - Bad: `if ($days > 14)`
- **Structured Error Handling**: Do not swallow exceptions with empty catch blocks. Log exceptions, report them, and throw typed, domain-specific errors when a business invariant is violated.
- **Centralized Secrets**: Never commit private keys, database passwords, or auth secrets to git. Always load them from environment variables.
