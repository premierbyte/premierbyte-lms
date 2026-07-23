# Folder Structure Guidelines

Version: 1.0.0

---

# Overview

The platform uses a **Monorepo Architecture** to organize applications, shared utilities, developer tools, and documentation within a single repository while keeping service boundaries clean. 

This folder structure standard outlines the generic monorepo design pattern. While the file directories below map to the **Next.js + Laravel** reference stack, these conventions apply to any monorepo workspace configurations.

---

# Workspace Directory (General Model)

```
platform-repository/
├── .agents/            # AI Agent instructions, project rules, and design tokens
├── .github/            # CI/CD pipelines, workflows, and issue templates
├── apps/               # Runnable user interfaces and backend applications
│   ├── frontend/       # Presentation application directory
│   └── backend/        # Application backend directory
├── packages/           # Shared libraries, UI configurations, and SDK packages
├── docs/               # Technical documents, API specs, database schemas
└── scripts/            # Helper scripts (build, backup, cleanup, database-reset)
```

---

# Root Directories & Responsibilities

## 1. apps/
Contains all deployable services and user interfaces. Each application within the `apps/` directory must remain isolated and independent, sharing code only via the `packages/` directory.

- **Frontend Application (Reference Stack: Next.js)**:
  Organized around a **Feature-Based** structure:
  ```
  apps/frontend/
  ├── app/            # Layouts and routes (presentation page routing only)
  ├── components/     # Reusable presentational components (stateless UI wrappers)
  ├── features/       # Business domains containing their own component, hook, schema, and API services
  ├── hooks/          # Shared custom React hooks
  ├── lib/            # Reusable SDK and HTTP clients (Axios, Apollo)
  ├── providers/      # Application-level context providers
  └── store/          # Global client-side UI states
  ```

- **Backend Application (Reference Stack: Laravel)**:
  Organized as a layered **Modular Monolith**:
  ```
  apps/backend/
  ├── app/
  │   ├── Core/       # Reusable base abstractions
  │   │   ├── Contracts/        (ResponseInterface)
  │   │   ├── Traits/           (ApiResponse)
  │   │   ├── BaseAction.php    (Single-purpose transaction base)
  │   │   ├── BaseController.php(Base HTTP controller with ApiResponse)
  │   │   ├── BaseDTO.php       (JsonSerializable Base DTO)
  │   │   ├── BaseRepository.php(Generic Eloquent CRUD Repository)
  │   │   └── BaseService.php   (Base service with DB transactions & logging)
  │   ├── Providers/  # Service providers (ModuleServiceProvider for auto-discovery)
  │   └── Modules/    # Business domain modules
  │       └── Users/
  │           ├── Actions/       # Single-purpose business transaction actions
  │           ├── Controllers/   # HTTP handlers (extends BaseController)
  │           ├── Models/        # Relational models and properties
  │           ├── Services/      # Business logical workflows (extends BaseService)
  │           ├── Repositories/  # DB queries (extends BaseRepository)
  │           ├── DTOs/          # Data transfer objects (extends BaseDTO)
  │           ├── Requests/      # Input validation form requests
  │           ├── Resources/     # Output transformer resources
  │           ├── Policies/      # Access rules
  │           ├── routes/        # Module routes (api.php auto-discovered)
  │           └── Tests/         # Module test suites
  ```

## 2. packages/
Contains shared code, interfaces, and packages used by multiple applications.
- **Reference Packages**:
  - `packages/shared-js`: General Javascript helpers and validators.
  - `packages/shared-php`: Shared contracts, interfaces, and PHP helper traits.
  - `packages/ui`: Shared presentational components used across multiple frontend apps.
  - `packages/config`: Centralized configuration profiles (e.g. ESLint, Prettier, TSConfig patterns).

## 3. docs/
Houses system architecture maps, database diagrams, API specs (OpenAPI), and local guides.

## 4. scripts/
Contains operations scripts for building services, triggering migrations, compiling binaries, and cleaning assets.

---

# Structural Integrity Rules

1. **No Cross-Module Directory Imports**: Modules inside `apps/backend/app/Modules` (or equivalent backend domains) must not import classes directly from sibling modules. Share interfaces or dispatch events instead.
2. **App-to-App Independence**: Code in `apps/frontend` must never directly access or import code from `apps/backend`. All communication is over network API interfaces.
3. **No Direct Model Access**: Presentation controllers must not import or query backend database models. Access is delegated strictly via repositories and services.
