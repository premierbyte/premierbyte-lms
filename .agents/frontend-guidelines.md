# Frontend Guidelines

Version: 1.0.0

---

# Purpose

This document defines the frontend development standards, architectural conventions, and best practices for the user interface layer.

While this document assumes **Next.js 16 (React 19)** as the default reference framework, these frontend guidelines are **system-agnostic**. The core design principles—such as separating server state from client state, modular features, client-side validation, presentational component isolation, and route guards—must be implemented consistently regardless of the selected frontend technologies (e.g., Svelte, Vue, Angular, or standard React SPAs).

---

# Key Frontend Design Principles

Every frontend application must implement these core practices to ensure scalability, responsiveness, and clean maintenance boundaries.

---

## 1. Separation of State

State must be categorized and managed separately:

- **Server State (Data Cache)**: Cache data fetched from APIs (e.g., users, customers, products). Use a dedicated query caching library (like TanStack Query or SWR). Never copy server-side API payloads into global client-side state stores (e.g. Zustand) to avoid sync/staleness bugs.
- **Client State (UI State)**: Ephemeral interface states (e.g., sidebar collapse, dark mode preferences, modal visibility, table column visibility). Manage this via lightweight client state containers (Zustand, Pinia, Svelte Stores) or local component state.

---

## 2. Feature-Based Directory Structure

Feature files must be organized around business domains to prevent massive, unmanageable folders.

```
features/
├── authentication/
├── customers/
├── dashboard/
├── billing/
└── settings/
```

Inside each feature folder, isolate its respective assets:
- `api/` (API fetch clients)
- `components/` (feature-specific layout widgets, tables, forms)
- `hooks/` (hooks managing local/query state)
- `schemas/` (Zod or other schema validation objects)
- `types/` (TypeScript interfaces/contracts)

---

## 3. Presentational vs. Container Components

Isolate component logic from design layouts:

- **Presentational Components**: Reusable UI blocks (buttons, standard input fields, modal containers, paginated data tables). These must be stateless and receive their data and event triggers solely via properties/callbacks.
- **Feature/Container Components**: Bind to specific feature queries, execute API mutations, manage domain-specific state, and compose presentational elements.

---

## 4. Schema-Based Forms

All forms must use schema-based validation to ensure type safety and input constraints before submission.

- Use validation schemas (Zod, Yup, or Joi) to model form requirements.
- Leverage form controller libraries (e.g., React Hook Form) to manage load states, inputs, error states, and submission tracking without manual state mappings.

---

## 5. Standardized Data Tables

Tables displaying datasets must support:
- Sorting and Pagination
- Server-side search and filtering
- Column visibility and column sorting
- Responsive viewport resizing

Avoid building customized tables from scratch repeatedly; use reusable, parameterized table wrappers.

---

## 6. Route-Level Security (Guards & Middleware)

- Protect authenticated areas using router middleware or layout checks.
- Redirect unauthenticated users immediately.
- Ensure page-level guards hide options, but remember that the backend API is the final authority on access control.

---

## 7. Async Operations & Loading States

Every asynchronous network call must have explicit visual feedback:
- Loading skeletons for page loads.
- Disabled states for submit buttons during requests.
- Inline status messages or toasts (e.g., Sonner) to notify success/failure.

Never leave the client in an indeterminate state without visual feedback.

---

# Frontend Tech Stack Mapping (Reference)

If using a different system, map the Next.js reference choices to their equivalents:

| Pattern / Component | Next.js (Default Reference) | Vue (SFC / Pinia) | Svelte / SvelteKit | Svelte/React SPA (Vite) |
| :--- | :--- | :--- | :--- | :--- |
| **Routing** | App Router (`app/`) | Vue Router | SvelteKit File Router | React Router |
| **Server State** | TanStack Query | Vue Query / Pinia Colada | Svelte Query | TanStack Query |
| **Client State** | Zustand | Pinia | Svelte Stores | Zustand / Jotai |
| **Form Control** | React Hook Form | VeeValidate / FormKit | Form actions / Felte | React Hook Form |
| **Schema Validation**| Zod | Zod / Yup | Zod / Valibot | Zod |
| **UI Components** | shadcn/ui | Radix Vue / PrimeVue | Melt UI / Bits UI | Radix UI / shadcn |
| **Icon Set** | Lucide React | Lucide Vue | Lucide Svelte | Lucide React |
| **Async Toasts** | Sonner | Vue-Sonner | Svelte-Sonner | Sonner |
