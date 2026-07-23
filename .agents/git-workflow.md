# Git Workflow Guidelines

Version: 1.0.0

Status: Production Standard

---

# Purpose

This document defines the Git workflow, branching strategy, commit conventions, release management, and code review process for the platform.

Every contributor and AI coding assistant must follow these standards to ensure:

- Stable releases
- Clean Git history
- Reliable deployments
- Easy collaboration
- Efficient code reviews

---

# Git Philosophy

The Git workflow should be:

- Simple
- Predictable
- Scalable
- Safe
- Automation-friendly

Never commit directly to the production branch.

---

# Repository Strategy

The workflow remains consistent across all applications, libraries, and modular packages in the workspace.

---

# Branch Strategy

## Main Branch

```
main
```

Purpose

Production-ready code.

Rules

- Always deployable
- Protected branch
- No direct commits
- Merge only through Pull Requests

---

## Development Branch

```
develop
```

Purpose

Integration branch for upcoming releases.

All feature branches merge into `develop`.

When a release is ready:

```
develop

↓

main
```

---

## Feature Branches

Naming

```
feature/<feature-name>
```

Examples

```
feature/authentication

feature/customer-module

feature/payment-integration

feature/dashboard
```

Feature branches are created from `develop`.

---

## Bug Fix Branches

Naming

```
fix/<issue-name>
```

Examples

```
fix/login-error

fix/auth-cache

fix/payment-validation
```

---

## Hotfix Branches

Naming

```
hotfix/<issue-name>
```

Examples

```
hotfix/security-patch

hotfix/auth-bypass

hotfix/payment-failure
```

Hotfixes are created from `main` and merged back into both `main` and `develop`.

---

## Release Branches

Naming

```
release/<version>
```

Examples

```
release/1.0.0

release/1.2.0

release/2.0.0
```

Purpose

- Final testing
- Documentation updates
- Version changes
- Bug fixes only

No new features.

---

# Branch Workflow

```
main
│
├── develop
│     │
│     ├── feature/authentication
│     ├── feature/customers
│     ├── feature/billing
│     └── fix/api-validation
│
└── hotfix/security-patch
```

---

# Development Workflow

1. Create a feature branch from `develop`.
2. Implement the feature.
3. Commit changes using Conventional Commits.
4. Push the branch.
5. Open a Pull Request into `develop`.
6. Complete code review.
7. Ensure all CI checks pass.
8. Merge using **Squash and Merge** (preferred).
9. Delete the feature branch.

---

# Commit Message Convention

Use the Conventional Commits specification.

Format

```
type(scope): short description
```

Examples

```
feat(auth): add email verification

feat(payments): implement stripe gateway

fix(api): correct validation response

refactor(customers): simplify repository queries

docs(readme): update installation guide

test(payments): add payment tests

style(frontend): format dashboard components

chore(ci): update GitHub Actions
```

---

# Commit Types

| Type     | Purpose                   |
| -------- | ------------------------- |
| feat     | New feature               |
| fix      | Bug fix                   |
| refactor | Internal code improvement |
| docs     | Documentation             |
| test     | Tests                     |
| style    | Formatting only           |
| chore    | Maintenance               |
| perf     | Performance improvement   |
| build    | Build system changes      |
| ci       | CI/CD changes             |
| revert   | Revert a previous commit  |

---

# Commit Rules

Each commit should:

- Represent one logical change.
- Compile successfully.
- Pass tests where applicable.
- Have a meaningful message.

Avoid combining unrelated changes.

---

# Pull Requests

Every change to `develop` or `main` must use a Pull Request.

Pull Requests should include:

- Summary
- Motivation
- Screenshots (if UI changes)
- Testing notes
- Breaking changes (if any)
- Linked issue (if applicable)

---

# Code Review Checklist

Reviewers should verify:

- Architecture follows project standards.
- Business logic is in Services.
- Controllers remain thin.
- Validation uses Form Requests.
- Authorization is enforced.
- API Resources are used.
- Tests are included.
- Documentation is updated.
- No duplicated code.
- Naming conventions are followed.

---

# Merge Strategy

Preferred

```
Squash and Merge
```

Benefits

- Cleaner history
- Easier rollback
- Simpler release notes

Avoid unnecessary merge commits.

---

# Versioning

Use Semantic Versioning.

Format

```
MAJOR.MINOR.PATCH
```

Examples

```
1.0.0

1.1.0

1.1.1

2.0.0
```

Rules

- MAJOR: Breaking changes
- MINOR: Backward-compatible features
- PATCH: Backward-compatible bug fixes

---

# Release Workflow

1. Create a release branch from `develop`.
2. Freeze new feature development.
3. Perform final testing.
4. Update version number.
5. Update CHANGELOG.
6. Merge into `main`.
7. Tag the release.
8. Merge back into `develop`.

---

# Tags

Every production release must be tagged.

Examples

```
v1.0.0

v1.0.1

v1.1.0

v2.0.0
```

Tags should correspond to deployed releases.

---

# Hotfix Workflow

1. Create a `hotfix/*` branch from `main`.
2. Apply the fix.
3. Test thoroughly.
4. Merge into `main`.
5. Tag a new PATCH release.
6. Merge the hotfix back into `develop`.

---

# Reverting Changes

Use `git revert` for changes that have already been shared.

Avoid `git reset --hard` on shared branches.

---

# Branch Protection

Protect the following branches:

```
main

develop
```

Requirements

- Pull Request required
- CI checks must pass
- No force pushes
- No direct commits
- Linear history (recommended)

---

# Git Ignore

Do not commit:

- `.env`
- `vendor/`
- `node_modules/`
- Build artifacts
- Logs
- IDE configuration (unless intentionally shared)
- Temporary files

Keep `.gitignore` updated.

---

# Large Files

Do not commit:

- Database dumps
- Videos
- Backups
- Generated archives

Use external storage or Git LFS if large binary assets become necessary.

---

# Documentation

Documentation updates should accompany code changes that alter behavior, APIs, or architecture.

Relevant documents include:

- README
- CHANGELOG
- API documentation
- `.agents/` documentation
- Deployment guides

---

# CI/CD

Every Pull Request should trigger:

- Dependency installation
- Static analysis
- Code formatting checks
- Unit tests
- Feature tests
- Build verification

Do not merge when required checks fail.

---

# AI Coding Rules

AI-generated Git contributions must:

- Create meaningful commits.
- Follow Conventional Commits.
- Respect the branch strategy.
- Never commit secrets.
- Never modify unrelated files.
- Update documentation when behavior changes.
- Keep commits focused and reviewable.

---

# Definition of Done

A Git contribution is complete when:

- Code follows project standards.
- Tests pass.
- Documentation is updated.
- Commit messages follow Conventional Commits.
- Pull Request is reviewed.
- CI checks pass.
- Branch is merged using the approved strategy.
- Release notes are updated if applicable.

---

# Example Workflow

```text
develop
    │
    ├── feature/payments-module
    │       │
    │       ├── feat(payments): add payment service
    │       ├── feat(payments): add webhook handler
    │       └── test(payments): add payment tests
    │
    └── Pull Request
            │
            ▼
        Code Review
            │
            ▼
       CI Pipeline Passes
            │
            ▼
      Squash and Merge
            │
            ▼
         develop
            │
            ▼
      release/1.0.0
            │
            ▼
           main
            │
            ▼
         Tag v1.0.0
```

---

# Guiding Principles

- Keep the `main` branch deployable at all times.
- Develop features in isolated branches.
- Prefer small, focused Pull Requests over large ones.
- Automate testing and quality checks.
- Maintain a clean Git history.
- Treat Git history as a valuable record of the project's evolution.

Following this workflow ensures reliable collaboration, predictable releases, and long-term maintainability across all project repositories.
