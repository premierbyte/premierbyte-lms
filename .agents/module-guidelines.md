# Module Guidelines

Version: 1.0.0

---

# Purpose

This document defines how every backend business module must be designed, implemented, and maintained.

Every business capability within the platform must exist as an isolated module.

Examples include:

- Authentication
- Users
- Customers
- Products
- Payments
- Subscriptions
- Reports
- Notifications
- Settings

A module owns its own business logic, models, validation, routes, tests, and documentation.

---

# Design Principles

Every module must be:

- Independent
- Highly cohesive
- Loosely coupled
- Testable
- Scalable
- Production-ready

Modules should communicate through:

- Services
- Contracts
- Events

Modules must never depend directly on another module's database implementation.

---

# Standard Module Structure

Every module MUST follow the exact structure below.

```
app/
└── Modules/
    └── Customers/
        ├── Actions/
        ├── Controllers/
        ├── Database/
        │   ├── Factories/
        │   ├── Migrations/
        │   └── Seeders/
        ├── DTOs/
        ├── Events/
        ├── Jobs/
        ├── Listeners/
        ├── Models/
        ├── Policies/
        ├── Repositories/
        ├── Requests/
        ├── Resources/
        ├── Routes/
        ├── Services/
        ├── Tests/
        ├── README.md
        └── module.json
```

Every module must follow the same structure.

---

# Module Naming

Module names must be plural business domains expressed in PascalCase.

Correct

```
Customers

Products

Subscriptions

Payments
```

Avoid abbreviations.

---

# Controllers

Location

```
Controllers/
```

Responsibilities

- Receive HTTP requests
- Authorize requests
- Validate input
- Call Services
- Return API Resources

Controllers must never:

- Query the database
- Contain business logic
- Call external APIs
- Send emails
- Generate reports

Controllers should remain small.

Target:

```
< 150 lines
```

---

# Services

Location

```
Services/
```

Responsibilities

- Business rules
- Domain workflows
- Transaction orchestration
- Event dispatching

Examples

```
CustomerService
OrderService
SubscriptionService
PaymentService
```

Services may use:

- Repositories
- Actions
- Events
- Jobs
- Other Services (through interfaces where appropriate)

---

# Repositories

Location

```
Repositories/
```

Responsibilities

- Database queries
- Search
- Filtering
- Pagination
- Aggregate queries

Repositories should return domain models or collections.

Controllers must never use Eloquent directly.

---

# Models

Location

```
Models/
```

Responsibilities

- Relationships
- Attribute casting
- Scopes
- Accessors
- Mutators

Avoid placing business workflows inside models.

---

# DTOs

Location

```
DTOs/
```

Responsibilities

- Transfer validated data
- Prevent passing Request objects into Services
- Improve type safety

Correct

```php
$dto = CreateCustomerDTO::fromRequest($request);

$this->customerService->create($dto);
```

---

# Requests

Location

```
Requests/
```

Responsibilities

- Validation
- Authorization (when request-specific)

Every Create and Update endpoint must use Form Requests.

Never validate inside Controllers.

---

# Resources

Location

```
Resources/
```

Responsibilities

- Transform API responses
- Hide internal implementation
- Standardize output

Never return Eloquent models directly.

---

# Policies

Location

```
Policies/
```

Responsibilities

- Authorization

Examples

```
CustomerPolicy
OrderPolicy
PaymentPolicy
```

Policies should contain only authorization logic.

---

# Actions

Location

```
Actions/
```

Actions encapsulate a single task.

Examples

```
CreateInvoiceAction
ProcessPaymentAction
SuspendCustomerAction
ProcessOrderAction
```

Actions should:

- Perform one responsibility
- Be reusable
- Be independently testable

---

# Events

Location

```
Events/
```

Represent something that has already happened.

Examples

```
CustomerCreated
OrderShipped
SubscriptionExpired
PaymentReceived
```

Events should not contain business logic.

---

# Listeners

Location

```
Listeners/
```

React to events.

Examples

```
SendWelcomeEmail
CreateAuditLog
NotifySupportTeam
```

Each Listener should perform one responsibility.

---

# Jobs

Location

```
Jobs/
```

Responsibilities

- Background processing
- Long-running tasks

Examples

```
ProcessOrderJob
SendReminderEmailsJob
GenerateMonthlyReportJob
```

Jobs should be queueable.

---

# Database

Location

```
Database/
    ├── Factories/
    ├── Migrations/
    └── Seeders/
```

Every module owns its database resources.

Migration names should clearly describe their purpose.

---

# Routes

Location

```
Routes/
```

Each module owns its route definitions.

Example

```
customers.php
orders.php
payments.php
```

Routes are loaded centrally during application bootstrapping.

---

# Tests

Location

```
Tests/
```

Each module owns its own tests.

Include:

- Unit Tests
- Feature Tests

Critical workflows require automated coverage.

---

# README.md

Every module must contain documentation.

Document:

- Purpose
- Responsibilities
- Public Services
- Events
- Database Tables
- Relationships
- API Endpoints
- Dependencies

---

# module.json

Each module must include metadata.

Example

```json
{
  "name": "Customers",
  "version": "1.0.0",
  "description": "Customer Management Module",
  "dependencies": ["Authentication"]
}
```

This file allows future tooling to inspect installed modules.

---

# Module Communication

Preferred order

```
Controller

↓

Service

↓

Repository

↓

Database
```

Cross-module communication

```
Module A Service

↓

Module B Service
```

or

```
Module A

↓

Event

↓

Module B Listener
```

Never

```
Module A Repository

↓

Module B Repository
```

---

# Dependency Rules

Allowed

```
Controller

↓

Service

↓

Repository
```

Allowed

```
Service

↓

Action
```

Allowed

```
Service

↓

Event
```

Not Allowed

```
Controller

↓

Repository
```

Not Allowed

```
Controller

↓

Model
```

Not Allowed

```
Repository

↓

Repository
```

---

# Shared Code

Shared functionality belongs only in:

```
app/Core/
```

Examples

```
BaseController
BaseRepository
BaseService
Enums
Traits
Helpers
Contracts
```

Do not duplicate shared logic across modules.

---

# Configuration

Module configuration belongs inside:

```
config/
```

Do not hardcode:

- URLs
- Timeouts
- Feature flags
- Secrets

---

# Error Handling

Throw domain-specific exceptions.

Examples

```
CustomerAlreadyExistsException
SubscriptionExpiredException
PaymentFailedException
```

Do not throw generic exceptions for business rules.

---

# Events vs Actions

Use an **Action** when:

- A single business task is executed directly.

Use an **Event** when:

- Other modules may need to react.

Example

```
PaymentReceived

↓

Update Subscription

↓

Create Audit Log

↓

Send Receipt

↓

Notify Sales
```

---

# Performance

Repositories should:

- Use eager loading
- Paginate results
- Avoid N+1 queries
- Cache frequently used data where appropriate

Never load unnecessary relationships.

---

# Security

Every module must:

- Validate all input
- Authorize all actions
- Log critical operations
- Respect RBAC
- Avoid exposing sensitive data
- Use API Resources

---

# AI Coding Rules

AI-generated modules must:

- Follow this folder structure exactly.
- Keep Controllers thin.
- Place business logic in Services.
- Use Repositories for data access.
- Use DTOs for data transfer.
- Use Form Requests for validation.
- Use API Resources for responses.
- Use Policies for authorization.
- Dispatch Events for side effects.
- Use Queue Jobs for asynchronous work.
- Avoid duplicate logic.
- Generate tests for critical workflows.
- Include a README.md.
- Include module.json.
- Produce production-ready code only.

---

# Definition of Done

A module is considered complete only when:

- Folder structure is correct.
- Database migrations exist.
- Models are complete.
- Services implement business logic.
- Repositories encapsulate database access.
- Requests validate input.
- Resources format API responses.
- Policies enforce authorization.
- Events and Listeners are implemented where appropriate.
- Queue Jobs are used for asynchronous work.
- Routes are registered.
- Tests pass.
- README.md is complete.
- module.json is present.
- No placeholder code exists.
- The module is production-ready.

---

# Guiding Principle

Every module should be able to evolve independently without affecting the rest of the application.

A developer should be able to open a module directory and find everything required to understand, maintain, test, and extend that business domain without searching across the codebase.
