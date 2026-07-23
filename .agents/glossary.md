# Glossary

Version: 1.0.0

Status: Production Standard

---

# Purpose

This glossary defines the common terminology, acronyms, and architectural concepts used throughout the platform and associated software products.

Its purpose is to ensure that developers, architects, QA engineers, DevOps engineers, technical writers, AI coding assistants, and future contributors use a consistent vocabulary across the ecosystem.

---

# A

## Action

A reusable class that performs a **single business operation**.

Examples:

- ProcessPaymentAction
- CreateInvoiceAction
- SendRenewalReminderAction

Actions are orchestrated by Services.

---

## API

Application Programming Interface.

The communication layer between the frontend, client applications, and backend services.

The platform follows an **API-first** architecture.

---

## API Resource

Laravel class responsible for transforming models into standardized JSON responses.

Resources prevent controllers from returning raw models.

---

## Authorization

Determines **what an authenticated user is allowed to do**.

Implemented using:

- Policies
- Gates
- Roles
- Permissions

---

## Authentication

Verifies the identity of a user.

Implemented using:

- Laravel Fortify
- Laravel Sanctum

---

# B

## Backend

The Laravel application responsible for business logic, APIs, database interactions, billing, and integrations.

---

## Business Logic

Rules that define how the application behaves.

Business logic belongs inside **Services** or **Actions**, never in Controllers or Models.

---

# C

## Cache

Temporary storage used to improve performance.

Examples:

- Permission cache
- Config cache
- Query cache

Preferred driver:

- Redis

Fallback:

- Database or File

---

## CI/CD

Continuous Integration and Continuous Deployment.

Automates:

- Testing
- Building
- Deployment

Primary platform:

- GitHub Actions

---

## Controller

Receives HTTP requests, validates access, delegates work to Services, and returns responses.

Controllers must remain thin.

---

## Cron

A scheduled task runner used to execute Laravel Scheduler.

Typical entry:

```
* * * * * php artisan schedule:run
```

---

# D

## Database Queue

Laravel queue driver that stores jobs in the database.

Recommended for shared hosting fallback.

---

## DTO (Data Transfer Object)

An object that carries validated data between layers.

DTOs replace passing Request objects directly into Services.

---

## Domain

A specific business area of the application.

Examples:

- Users
- Customers
- Orders
- Payments

---

# E

## Event

Represents something important that has already happened.

Examples:

- CustomerCreated
- SubscriptionRenewed
- PaymentCompleted

Events may trigger multiple Listeners.

---

## Event Listener

A class that responds to an Event.

Example:

```
SubscriptionRenewed

↓

SendInvoiceListener

↓

NotifyCustomerListener
```

---

# F

## Facade

A static interface to a service registered in Laravel's service container.

Example:

```php
Feature::active();
```

---

## Feature Flag

A capability that can be enabled or disabled independently of a subscription plan.

Examples:

- advanced_reports
- custom_branding
- white_label

Applications should check feature flags instead of subscription names.

---

## Form Request

Laravel class responsible for validating incoming HTTP requests.

Keeps validation logic out of Controllers.

---

# G

## Gate

A lightweight authorization mechanism used for simple permissions not tied to a specific model.

---

## Grace Period

The period after a subscription expires during which the application continues to operate with restricted reminders.

Default:

```
14 Days
```

---

# H

## HTTP Client

Component responsible for communicating with external APIs.

---

# I

## Interface

A PHP contract defining required methods without implementation.

Used to reduce coupling and improve testability.

---

## Inversion of Control (IoC)

A design principle where dependencies are provided by the service container instead of being created manually.

---

# J

## Job

A queued task executed asynchronously.

Examples:

- SendEmailJob
- ProcessOrderJob
- GenerateReportJob

---

# L

## Laravel Fortify

Authentication backend used for login, registration, password reset, and email verification.

---

## Laravel Sanctum

Provides secure authentication for SPAs and API Personal Access Tokens.

---

## Laravel Scheduler

Runs scheduled tasks through a single cron entry.

---

# M

## Middleware

Runs before or after an HTTP request.

Examples:

- Authentication
- Authorization
- Rate Limiting
- Logging

---

## Module

A self-contained business domain within the modular monolith.

Examples:

- Customers
- Orders
- Payments

Each module contains its own Controllers, Services, Repositories, Models, Policies, Requests, Resources, Events, Jobs, and Tests.

---

## Modular Monolith

An architectural style where the application is deployed as a single system but organized into isolated business modules.

This is the official architecture of the platform.

---

# P

## Permission

A specific action that a user is allowed to perform.

Examples:

```
orders.ship

customers.view

payments.refund
```

---

## Policy

Laravel class responsible for authorizing actions on a specific model.

Examples:

- CustomerPolicy
- OrderPolicy

---

## Product

A software application or module in the ecosystem.

---

## Pull Request (PR)

A request to merge code from one Git branch into another after review and automated checks.

---

# Q

## Queue

A system that executes long-running tasks asynchronously.

Examples:

- Emails
- Reports
- Notifications

Preferred driver:

- Redis

Fallback:

- Database

---

# R

## Repository

A class responsible for data persistence and database queries.

Repositories abstract Eloquent models from Services.

---

## REST API

A stateless API architecture using HTTP methods.

Exposed under:

```
/api/v1
```

---

## RBAC

Role-Based Access Control.

Implemented using:

- `spatie/laravel-permission`
- Policies
- Gates

---

# S

## Service

A class responsible for orchestrating business workflows.

Examples:

- CustomerService
- OrderService
- SubscriptionService

Services coordinate Actions, Repositories, and Events.

---

## Service Container

Laravel's dependency injection container.

Used to resolve interfaces, services, and dependencies automatically.

---

## Shared Hosting

A hosting environment where multiple websites share server resources.

Applications support shared hosting using database queue drivers, cron schedulers, and standard SQL queries.

---

## Subscription

A recurring agreement granting continued access to specific platform services.

Subscriptions determine billing, renewal, expiration, and default feature availability.

---

# T

## Tenant

A customer or organization using the application.

---

## Trait

A reusable PHP language construct that provides shared methods across multiple classes.

Traits should be used sparingly.

---

# U

## Unit Test

A test that validates a single class or method in isolation.

---

## UUID

Universally Unique Identifier.

Preferred primary identifier for publicly exposed resources.

---

# V

## Versioning

The process of assigning semantic versions to software releases.

Format:

```
MAJOR.MINOR.PATCH
```

Example:

```
1.4.2
```

---

# W

## Webhook

An HTTP callback triggered automatically when an event occurs.

---

# Z

## Zod

A TypeScript schema validation library used in the Next.js frontend for validating forms and API payloads.

---

# Common Acronyms

| Acronym | Meaning                            |
| ------- | ---------------------------------- |
| API     | Application Programming Interface  |
| CI      | Continuous Integration             |
| CD      | Continuous Deployment              |
| CRUD    | Create, Read, Update, Delete       |
| DTO     | Data Transfer Object               |
| HTTP    | HyperText Transfer Protocol        |
| HTTPS   | HyperText Transfer Protocol Secure |
| IoC     | Inversion of Control               |
| JSON    | JavaScript Object Notation         |
| ORM     | Object Relational Mapper           |
| PHP     | Hypertext Preprocessor             |
| PR      | Pull Request                       |
| RBAC    | Role-Based Access Control          |
| REST    | Representational State Transfer    |
| SDK     | Software Development Kit           |
| SPA     | Single Page Application            |
| SQL     | Structured Query Language          |
| SSL     | Secure Sockets Layer               |
| TLS     | Transport Layer Security           |
| UI      | User Interface                     |
| UUID    | Universally Unique Identifier      |

---

# Naming Conventions

## Classes

```
PascalCase
```

Example:

```
CustomerService

OrderRepository

PaymentPolicy
```

---

## Methods

```
camelCase
```

Example:

```php
shipOrder()

renewSubscription()

hasFeature()
```

---

## Variables

```
camelCase
```

Example:

```php
$currentUser

$orderStatus
```

---

## Database Tables

```
snake_case
```

Example:

```
order_items

subscription_plans

user_profiles
```

---

## API Endpoints

```
kebab-case
```

Example:

```
/api/v1/order-items

/api/v1/subscription-plans
```

---

## Permission Names

```
resource.action
```

Example:

```
users.view

orders.ship

payments.refund
```

---

# Guiding Principles

The Glossary serves as the single source of truth for terminology across the ecosystem.

Every developer, technical writer, AI coding assistant, and contributor should use these definitions consistently to improve communication, reduce ambiguity, and maintain a shared understanding of the platform's architecture, coding standards, and business concepts.
