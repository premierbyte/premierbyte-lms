# Feature Flag Guidelines

Version: 1.0.0

---

# Purpose

The Feature Flag System controls which functionality is active for specific users, roles, or tenant accounts. 

The goal is to allow **one codebase** to serve multiple subscription tiers, user roles, or release phases without maintaining separate branches or versions of the software. These standards apply generally to any software project.

---

# Core Principles

## 1. Features Control Behavior—Not Plans
Never compare subscription tier names directly in business logic. Always map plans to feature flags and check the feature availability.

- **Incorrect**:
  ```
  if (user.plan === 'Premium') {
      enableAnalytics();
  }
  ```
- **Correct**:
  ```
  if (Feature.active('advanced_analytics')) {
      enableAnalytics();
  }
  ```

This decouples application logic from marketing terms or pricing plan changes.

## 2. Global, Tier, and User Resolution Order
When evaluating a feature flag state, resolve it using a priority chain:
1. **Global Overrides**: Global flags (e.g., system maintenance toggles or emergency feature shutdowns).
2. **User/Tenant Overrides**: Special permissions or exceptions granted to specific accounts.
3. **Plan Entitlements**: Default capabilities associated with the account's active subscription tier.
4. **System Defaults**: Core capabilities enabled for all users.

---

# Feature Key Conventions

Every feature toggle must have a unique, stable identifier.

Keys must:
- Be lowercase
- Use `snake_case` (e.g. `white_label`, `bulk_export`, `sms_notifications`)
- Never change once released to production

---

# Implementation Patterns

## Backend Enforcement
The backend must validate the active state of a feature flag before processing any API request related to that feature. If a flag is inactive, return a `403 Forbidden` or `402 Payment Required` response.

*Reference Implementation (Laravel):*
```php
use Laravel\Pennant\Feature;

if (Feature::active('advanced_reports')) {
    // Process reports
}
```

*Reference Implementation (NestJS / Node):*
```typescript
@UseGuards(FeatureGuard)
@Feature('advanced_reports')
@Get('reports')
getReports() { ... }
```

## Frontend Presentation (UX)
The frontend uses feature flags to customize the UI. If a feature is disabled:
- **Hide**: Remove menu items or dashboard buttons if the user cannot access or purchase the feature.
- **Upsell**: Display the feature as disabled with an upgrade indicator or subscription pricing prompt if it represents a premium tier upgrade opportunity.

---

# Performance & Caching

Checking feature flags must not result in database performance bottlenecks:
- Cache active feature evaluations in the user's session or a memory cache (e.g. Redis).
- Invalidate the cached feature state immediately when an account upgrades, purchases an add-on, or changes plans.
- Support batch checking of multiple flags in a single request or function call.
