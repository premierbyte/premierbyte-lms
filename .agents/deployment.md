# Deployment Guidelines

Version: 1.0.0

Status: Production Standard

---

# Purpose

This document defines the deployment strategy, environments, and configuration guidelines for the platform and associated applications.

It standardizes:

- Local Development
- Containerized Environments
- Environment Configuration
- Hosting Deployments (Shared, VPS, Cloud)
- CI/CD Pipelines
- Security
- Backups and Disaster Recovery

---

# Supported Environments

| Environment | Purpose |
|------------|----------|
| Local | Development |
| Docker | Local Development Containerization |
| Staging | Pre-production Testing |
| Production | Live Environment |

---

# Official Technology Stack

Backend

- Laravel 12
- PHP 8.4+

Frontend

- Next.js 16
- Node.js 20+

Database

- PostgreSQL (Preferred primary database)
- MySQL (Supported fallback/shared hosting database)

Cache & Queue

- Redis (Preferred)
- Database/File drivers (Fallback)

Storage

- Local Storage (Local development)
- AWS S3 or Cloudflare R2 (Staging & Production)

---

# Local Development

Development uses Docker or local development environments.

Local services typically include:

```
Database (PostgreSQL/MySQL)

Laravel API Backend

Next.js Frontend

Redis (optional)
```

The local Docker environment should closely mirror production.

---

# Containerization

When using Docker:

- Keep containers thin and single-purpose (e.g. php-fpm, web server, node, redis, database).
- Do not run development tools inside production containers.
- Use multi-stage Docker builds to keep production images small.

---

# Environment Variables

Never commit `.env` files to source control.

Only commit `.env.example` file templates.

Standard environment variables include:

```
APP_NAME
APP_ENV
APP_KEY
APP_DEBUG
APP_URL

DB_CONNECTION
DB_HOST
DB_PORT
DB_DATABASE
DB_USERNAME
DB_PASSWORD

CACHE_DRIVER
QUEUE_CONNECTION
SESSION_DRIVER

REDIS_HOST
REDIS_PASSWORD
REDIS_PORT

MAIL_MAILER
MAIL_HOST
MAIL_PORT
MAIL_USERNAME
MAIL_PASSWORD
```

---

# Deployment Models

## 1. Shared Hosting (Fallback)

Requirements:

- PHP 8.4+
- PostgreSQL or MySQL
- SSL Certificate
- Cron Jobs access

Queue Driver

```
database
```

Cache Driver

```
file
```

Scheduler Cron Entry

```
* * * * * php artisan schedule:run
```

Optimize command chain before deployment:

```bash
php artisan config:cache
php artisan route:cache
php artisan event:cache
php artisan view:cache
```

---

## 2. VPS / Cloud Deployment (Recommended)

Recommended stack:

- Ubuntu LTS
- Nginx (Web Server / Reverse Proxy)
- PHP-FPM
- PostgreSQL / MySQL
- Redis (for caching and queues)
- Supervisor (for managing Laravel queue workers)

Queue & Cache Driver

```
redis
```

---

# Build Process

Backend

```
Composer Install (production-optimized)
│
▼
Run Database Migrations
│
▼
Optimize Application (Artisan Cache)
│
▼
Restart Queue Workers
```

Frontend

```
Install Dependencies
│
▼
Lint and Type Check
│
▼
Build Production Bundle (NextJS Export/Build)
│
▼
Deploy Output files
```

---

# Database Migrations

- Every schema change must use Laravel migrations.
- Never modify production tables manually.
- Use transactions in migrations when running structural changes that support it.

---

# Queues

Never use the `sync` queue driver in production.

Always configure a queue worker runner (like Supervisor on VPS, or daemon processes in containerized setups) to keep queue consumers alive.

---

# Scheduler

Laravel's Scheduler must always be enabled via system cron.

Used for:

- Subscription renewal checks
- Daily cleanup tasks
- Email notification dispatches
- Report generation
- Temporary file expiries

---

# Logging

- App logs are written to `storage/logs`.
- Production logs must use daily rotation or external logging sinks.
- Protect log directory permissions. Never expose logs publicly.

---

# Backups

Daily

- Database backup
- User uploads/storage backup

Weekly

- Full database snapshot

Always verify restore procedures.

---

# Security Checklist

Production deployment requires:

- SSL/HTTPS forced
- `APP_DEBUG=false`
- Strong randomly generated `APP_KEY`
- Strong database credentials
- CSRF protection enabled
- API Rate Limiting configured
- CORS configured to trust specific domains only
- Security headers (HSTS, Content Security Policy, X-Frame-Options)

---

# Monitoring

Monitor:

- Application exception logs
- Queue worker process status and failed job counts
- Scheduler run outputs
- Disk space, CPU, Memory usage
- SSL certificate expiration dates

---

# Disaster Recovery

Maintain:

- Daily automated backups stored in an off-site location (e.g. S3).
- Recovery documentation.
- Target RPO (Recovery Point Objective): 24 Hours.
- Target RTO (Recovery Time Objective): 2 Hours.

---

# CI/CD Pipeline

Typically configured via GitHub Actions.

Pipeline steps:

```
Install Dependencies

↓

Lint (Pint / ESLint)

↓

Static Analysis (PHPStan / TypeScript compilation)

↓

Run Test Suite (Artisan Tests / Jest)

↓

Build Production Artifacts

↓

Deploy to Target Hosting
```

---

# AI Coding Rules

AI-generated deployment configurations must:

- Support both PostgreSQL and MySQL database structures.
- Never expose credentials or secrets.
- Use environment variables for dynamic properties.
- Cache Laravel config during build phases.
- Generate production-ready configuration scripts (e.g. Dockerfiles, workflows).

---

# Guiding Principles

The application is designed to be highly portable and deployable on VPS, containerized cloud infrastructure, or standard hosting environments without requiring code modifications.

Every deployment decision should prioritize:

- Simplicity
- Reliability
- Portability
- Security
- Cost efficiency