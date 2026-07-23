# Architecture Guidelines

Version: 1.0.0

Status: Production Architecture Standard

---

# Purpose

This document defines the architectural standards for the platform.

The platform is designed around a **Modular Monolith** architecture. While this document uses **Laravel** and **Next.js** as the default reference stacks, the core architectural standards, patterns, and separation of concerns are **system-agnostic** and apply to any backend and frontend technologies used in future projects.

---

# Architectural Principles

The architecture must be:

- **Modular**: Business domains are logically separated.
- **Scalable**: Supports horizontal API scaling and asynchronous task delegation.
- **Maintainable**: Strict boundary lines prevent spaghetti dependencies.
- **Secure**: Authentication, authorization, and rate limiting are enforced at the API boundary.
- **Testable**: Layers are decoupled to facilitate isolated testing.
- **API-First**: Frontend apps communicate only via REST/GraphQL APIs.
- **Cloud-Ready**: Portable across standard cloud providers, containers, and server instances.

---

# High-Level Architecture Model (Reference Stack)

The architecture splits the presentation frontend and the API backend into separate services.

```
                        +----------------------+
                        |  Presentation Layer  |
                        | (Frontend UI / SPA)  |
                        +----------+-----------+
                                   |
                                   | HTTPS API Calls
                                   |
                    +--------------v--------------+
                    |     Application Backend     |
                    |       (REST/GraphQL API)    |
                    +--------------+--------------+
                                   |
        +--------------------------+---------------------------+
        |                          |                           |
        |                          |                           |
+-------v-------+          +-------v-------+          +--------v--------+
|   Primary     |          |  Async Queue  |          |   Object / File |
|  Database     |          |  (Redis/DB)   |          |      Storage    |
+---------------+          +---------------+          +-----------------+
```

---

# Core Architectural Layers (Backend)

Backend systems follow a layered structure using core base abstractions (`App\Core`) to isolate business logic from delivery mechanisms.

```
Incoming Request (HTTP / Console / Webhook)
      │
      ▼
Presentation Layer (Controllers extending BaseController using ApiResponse)
      │
      ▼
Input Validation & Transfer (Form Requests / Schemas / DTOs extending BaseDTO)
      │
      ▼
Application Layer (Business Services extending BaseService / Actions extending BaseAction)
      │
      ▼
Domain Layer (Domain Models / Entities / Business Invariants)
      │
      ▼
Infrastructure Layer (Repositories extending BaseRepository / Mailers / Cache / Queue)
```

---

## 1. Presentation Layer
- **Responsibility**: Handle incoming routes, process HTTP requests, parse query parameters, check request-level authorization, and return standardized formatted responses via `ApiResponse` trait (`successResponse`, `errorResponse`, `paginatedResponse`).
- **Rule**: Controllers must extend `App\Core\BaseController`. Never place business calculations, raw database transactions, or external API calls inside Controllers.

## 2. Application Layer
- **Responsibility**: Coordinate workflows, execute business rules, orchestrate multi-step transactions via `BaseService::transaction()`, log context via `logInfo()`/`logError()`, and dispatch domain events.
- **Components**: Business Services (extending `BaseService`), Action classes (extending `BaseAction`), and Data Transfer Objects (extending `BaseDTO`).

## 3. Domain Layer
- **Responsibility**: Represent the core business entities and rules.
- **Components**: Entities/Models, Domain Events, and Contracts (Interfaces).

## 4. Infrastructure Layer
- **Responsibility**: Persist data, manage caches, run queues, and integrate with external APIs/SDKs.
- **Components**: Database Repositories (extending `BaseRepository<TModel>`), Queue Workers, Cache Stores, and Mailers.

---

# Module Boundaries

Every business domain is organized as an independent module with auto-discovered routes (`routes/api.php`) via `ModuleServiceProvider`.

```
app/
├── Core/
│   ├── Contracts/        (ResponseInterface)
│   ├── Traits/           (ApiResponse)
│   ├── BaseAction.php
│   ├── BaseController.php
│   ├── BaseDTO.php
│   ├── BaseRepository.php
│   └── BaseService.php
└── Modules/
    ├── Users/            (routes/api.php, Controllers, Services, Repositories, DTOs)
    ├── Organizations/    (routes/api.php, Controllers, Services, Repositories, DTOs)
    ├── Licensing/        (routes/api.php, Controllers, Services, Repositories, DTOs)
    └── Categories/       (routes/api.php, Controllers, Services, Repositories, DTOs)
```

Each module contains its own logic layers (Controllers, Services, Repositories, Models, DTOs, Requests, Resources, `routes/api.php`, and Tests) and acts as an isolated subsystem.

## Module Communication Rules
1. **No Direct DB Joins**: A module must never perform SQL queries joining its tables with another module's private tables.
2. **Abstractions**: Communicate between modules using Services, Interfaces, or Events.
3. **Decoupling**: If Module A needs to know that an action occurred in Module B, Module B should dispatch an Event, and Module A should react via a Listener.

---

# Common Architectural Patterns

## Repository Pattern
- **Purpose**: Encapsulate query building and data persistence.
- **Rule**: Controllers and Services must query data via Repositories. This prevents database queries from cluttering business logic.

## Service Layer & Actions
- **Purpose**: Centralize business logic.
- **Difference**:
  - **Service**: Class grouping related business capabilities (e.g., `CustomerService`).
  - **Action**: Small, single-purpose class executing exactly one transaction (e.g., `ProcessPaymentAction`). Use Actions to build reusable, easily testable workflow blocks.

## DTO Pattern (Data Transfer Object)
- **Purpose**: Ensure strict type safety when transferring request data into business layers.
- **Rule**: Never pass raw HTTP Request objects into Services or Actions. Extract and validate request parameters into typed DTOs.

## Event-Driven Architecture
- **Purpose**: Decouple side effects.
- **Pattern**:
  ```
  Primary Action Completes (e.g., UserRegistered)
        │
        ├─► Listener A: Send Welcome Email (Queued)
        ├─► Listener B: Create Profile Record
        └─► Listener C: Log Audit Event
  ```

---

# Database & Caching Architecture

- **Database Portability**: Use ORMs and Query Builders to write SQL-portable code.
- **Transactions**: Always execute multi-model updates inside a database transaction block (e.g., payments, subscriptions).
- **Caching Strategy**: Cache authorization states, active configurations, and static resource definitions. Always define an invalidation strategy (TTL or tags) to prevent stale state bugs.

---

# Frontend Presentation Architecture

The user interface layer is built as an independent presentation application.

## Core Guidelines
- **State Separation**:
  - **Server State**: Managed via query caching and caching synchronization (e.g., TanStack Query, SWR).
  - **Client State**: UI state (sidebar toggles, themes) managed using clean state containers (e.g., Zustand, Pinia).
- **Component Classification**:
  - **Presentational**: Stateless, reusable components (buttons, input fields, tables) that receive data and callbacks via properties.
  - **Containers/Features**: Stateful components containing api calls and business features.
- **Validation**: All user inputs must be validated on the client side using schemas (e.g. Zod) before request submission, and validated again on the backend.

---

# Reference Stack Implementations

When utilizing the default company stacks, use the following implementations:

| Concept | Laravel (PHP) Reference | Next.js (TypeScript) Reference |
| :--- | :--- | :--- |
| **Routing / Pages** | `routes/api/*.php` | App Router (`app/**/*.tsx`) |
| **Validation** | Form Requests (`Requests/*`) | Zod + React Hook Form |
| **Response Formatter** | API Resources (`Resources/*`) | JSON responses / Fetch DTOs |
| **Authorization** | Policies (`Policies/*`) | Next.js Middleware & custom hooks |
| **Roles / Permissions** | Spatie Perms (`laravel-permission`) | Custom context provider |
| **Queues / Workers** | Redis / Database queue drivers | BullMQ or Serverless queues |
| **Feature Flags** | Laravel Pennant | Custom feature hooks |
| **Database ORM** | Eloquent ORM | TypeORM / Prisma / Drizzle |
