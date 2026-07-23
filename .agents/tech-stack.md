# Technology Stack Guidelines

Version: 1.0.0

Status: Production Standard

---

# Purpose

This document defines the reference technology stack guidelines for the platform.

Standardizing technology selections improves code reuse, team productivity, and cross-application integration. While this document details the default company-wide stack (**Next.js** + **Laravel**), alternative frameworks or databases are allowed for specific projects provided they conform to the architectural guidelines (Layered Separation, Module Decoupling, and API-First Design) defined in this directory.

---

# Technology Philosophy

Every selected backend or frontend system must be:
- **Stable**: Long-term supported releases with large active developer ecosystems.
- **Maintainable**: Supported by standard static analysis, linting, and automated testing tools.
- **API-First**: Built exclusively to expose or consume REST or GraphQL endpoints.
- **Secure**: Designed to prevent standard vulnerabilities (XSS, CSRF, SQL Injection, brute force).

---

# Default Technology Stack Matrix (Reference Stack)

| Category | Primary Reference Choice | Common Allowed Alternatives |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 16 (React 19) | React SPA, Vue, SvelteKit |
| **Frontend Language** | TypeScript | — |
| **Styling** | Tailwind CSS v4 | CSS Modules |
| **UI Components** | shadcn/ui | Radix UI, PrimeVue, Svelte Melt |
| **State Management** | Zustand (Client UI State) | Redux Toolkit, Pinia, Svelte Stores |
| **Server State Cache** | TanStack Query (Server State) | SWR, Apollo Client (GraphQL) |
| **Form Management** | React Hook Form | VeeValidate, Felte |
| **Form Validation** | Zod | Zod, Valibot, Yup |
| **Backend Framework** | Laravel 12 | Node/NestJS, Python/Django, Spring Boot |
| **Backend Language** | PHP 8.4+ | TypeScript (Node), Python, Java |
| **Authentication** | Laravel Sanctum / Fortify | Custom JWT Auth, OAuth 2.0 Providers |
| **Authorization** | `spatie/laravel-permission` | Custom RBAC Middleware / Spring Security |
| **Database** | PostgreSQL | MySQL, MS SQL Server, Oracle |
| **Caching / Queues** | Redis | Database (Fallback), RabbitMQ, BullMQ |
| **Testing** | PHPUnit (Backend) + Vitest (Frontend) | Jest, Pest, Cypress, Playwright |
| **CI/CD** | GitHub Actions | GitLab CI, Jenkins |

---

# Database Guidelines

- **Primary Storage**: **PostgreSQL** is the preferred database for new applications due to robust indexing, JSON operations, and concurrent scaling support.
- **Secondary / Shared Hosting Fallback**: **MySQL 8+** is supported, specifically for configurations deployed to standard cPanel shared hosting nodes.
- **SQL Portability**: Rely on ORM features and query builders. Do not use raw database-specific SQL operations unless absolutely necessary.

---

# Tooling & Code Quality Guidelines

No matter what framework is selected, the application directory must configure:

1. **Linting & Code Formatting**:
   - PHP: Laravel Pint or PHP_CodeSniffer.
   - JS/TS: Prettier and ESLint.
2. **Static Analysis**:
   - PHP: PHPStan (Target: Level 8+).
   - TS: TypeScript compiler in strict mode (`tsconfig.json` -> `"strict": true`).
3. **Automated Testing Suite**:
   - Target: Unit tests for Service/Action logic and Feature/Integration tests for API routes.
