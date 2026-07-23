# Backend Guidelines

Version: 1.0.0

---

# Purpose

This document defines the backend development standards, architectural boundaries, and implementation guidelines for the platform.

While this document refers to **Laravel (PHP)** as the default reference framework, these backend guidelines represent general clean architecture principles. If a different language or framework (such as Node.js/NestJS, Python/Django, or Java/Spring Boot) is selected for a project, these architectural boundaries and separations of concerns must still be enforced using that system's native conventions.

---

# Architecture Patterns & Layer Responsibilities

The backend is structured as a layered Modular Monolith. Business capabilities are separated into modules, and code is organized into distinct layers to separate business rules from infrastructure concerns.

---

## 1. Controllers / Request Handlers
- **Role**: Entry point for HTTP requests.
- **Responsibilities**: Route incoming requests, authenticate users, check request-level authorization (Policies/Gates), validate parameters, delegate tasks to Services, and return API Resources/DTO responses.
- **Constraint**: Controllers must be thin. They must not query the database directly, run business logic, or trigger side effects.

### Laravel Reference:
```php
public function store(StoreCustomerRequest $request)
{
    $this->authorize('create', Customer::class);

    $customer = $this->customerService->create(
        CreateCustomerDTO::fromRequest($request)
    );

    return CustomerResource::make($customer);
}
```

---

## 2. Services
- **Role**: Business logic orchestration.
- **Responsibilities**: Execute multi-stage operations, run calculations, manage transaction boundaries, and coordinate actions/repositories.
- **Constraint**: Services must remain independent of delivery channels (HTTP, CLI, Webhooks). They should throw typed business exceptions and must never return HTTP responses directly.

---

## 3. Repositories
- **Role**: Data access abstraction.
- **Responsibilities**: Interface with database models, write queries, encapsulate search filters, and handle sorting/pagination.
- **Constraint**: Models must not be queried directly in Controllers or Services. Services should access database layers strictly via Repositories to isolate database structure details from business logic.

---

## 4. Models / Entities
- **Role**: Represent core data structures and relational schemas.
- **Responsibilities**: Define field mappings, relationships, casting, and internal attribute accessors.
- **Constraint**: Avoid placing complex business workflows or external API queries inside Models.

---

## 5. DTOs (Data Transfer Objects)
- **Role**: Typed data transport.
- **Responsibilities**: Carry verified input payloads from HTTP requests, console arguments, or webhook bodies into the Service layer.
- **Constraint**: Never pass raw Request or request-wrapper objects directly into Services. This preserves decoupling.

---

## 6. Validation (Requests / Schemas)
- **Role**: Guard input boundaries.
- **Responsibilities**: Validate incoming data formats, types, and constraints before they enter Controllers.
- **Constraint**: Always use dedicated validator classes (e.g. Form Requests, validation schemas). Never run inline validator logic in Controller actions.

---

## 7. Policies & Gates (Authorization)
- **Role**: Enforce authorization.
- **Responsibilities**: Verify that the authenticated client has permission to perform the requested action.
- **Constraint**: Always check authorization on the backend. Do not rely on frontend UI hiding.

---

## 8. Actions
- **Role**: Encapsulate a single business transaction.
- **Responsibilities**: Perform one action (e.g. `ProcessPaymentAction`, `CreateInvoiceAction`) cleanly. Use Actions for highly reusable blocks of logic, allowing independent testing.

---

## 9. Events & Listeners
- **Role**: Decouple side effects.
- **Responsibilities**: Events announce that a state change occurred (e.g. `OrderShipped`). Listeners respond to events asynchronously or synchronously.
- **Constraint**: Keep event payloads small, passing only model identifiers or key parameters rather than entire complex objects.

---

## 10. Jobs & Queues
- **Role**: Asynchronous execution.
- **Responsibilities**: Move long-running tasks (e.g. email dispatching, PDF compilation, external API syncing) into background queues.
- **Constraint**: Never perform synchronous API calls or rendering tasks during a user HTTP request if they can be executed in the background.

---

# Configuration & Environments

- **Secrets**: Never hardcode credentials, URLs, or API keys in code. Always load them via environment variables (`.env`).
- **Options**: Load non-sensitive options (timeouts, defaults) from config files initialized at startup.

---

# Backend Tech Stack Mapping (Reference)

If using a different system, translate the Laravel reference patterns as follows:

| Pattern / Component | Laravel (Default Reference) | NestJS (Node.js) | Django (Python) | Spring Boot (Java) |
| :--- | :--- | :--- | :--- | :--- |
| **Request Handler** | Controller | Controller | View / API View | REST Controller |
| **Input Validation** | Form Requests | Pipes / class-validator | Serializers / Forms | Validation annotations |
| **Business Logic** | Services / Actions | Services / Providers | Services / Actions | Services |
| **Data Access** | Repositories | Repositories | Custom Managers | JPA Repositories |
| **Entity Mapping** | Eloquent Models | Entities (TypeORM/Prisma) | Django Models | JPA Entities |
| **Authorization** | Policies / Gates | Guards | Permissions classes | Spring Security |
| **Event System** | Event / Listener | EventEmitter2 / Events | Django Signals | ApplicationEvent |
| **Background Task** | Queue Jobs | Queue / BullMQ | Celery Tasks | @Async Tasks |
| **Task Scheduler** | Artisan Scheduler | Schedule module | Celery Beat | @Scheduled Tasks |
| **Database Migrations**| Artisan Migrations | TypeORM / Prisma Migrations| Django Migrations | Flyway / Liquibase |
