# Premierbyte LMS - Database Schema

Version: 1.0.0

Status: Master Database Specification

---

# Purpose

This document defines the logical database schema for the Premierbyte LMS.

The schema is designed for:

- Laravel 12
- MySQL 8+
- Eloquent ORM
- UUID support (future-ready)
- Shared hosting compatibility
- Modular Monolith Architecture

The schema serves as the single source of truth for all database migrations.

---

# Database Standards

Primary Database

- MySQL 8+

Naming Convention

- snake_case
- plural table names
- singular model names

Primary Keys

- BIGINT UNSIGNED AUTO_INCREMENT

Future Support

- UUIDs may be introduced where required.

Every table must include

```text
id
created_at
updated_at
```

Soft deletes should be used where applicable.

---

# Authentication

## users

Fields

- id
- first_name
- last_name
- username
- email
- phone
- password
- avatar
- bio
- status
- email_verified_at
- remember_token
- last_login_at
- last_login_ip
- created_at
- updated_at

---

## roles

- id
- name
- guard_name
- description

---

## permissions

- id
- name
- guard_name
- description

---

## model_has_roles

Pivot Table

---

## model_has_permissions

Pivot Table

---

## role_has_permissions

Pivot Table

---

# Tenant

## organizations

- id
- name
- slug
- email
- phone
- address
- country
- state
- city
- timezone
- locale
- logo
- favicon
- primary_color
- secondary_color
- status

---

# Categories

## categories

- id
- parent_id
- name
- slug
- description
- image
- status
- sort_order

---

# Courses

## courses

- id
- organization_id
- instructor_id
- category_id
- title
- slug
- subtitle
- description
- thumbnail
- trailer_url
- difficulty
- language
- duration
- price
- sale_price
- currency
- status
- featured
- published_at

---

# Sections

## sections

- id
- course_id
- title
- description
- sort_order

---

# Lessons

## lessons

- id
- section_id
- title
- slug
- lesson_type
- youtube_video_id
- youtube_url
- content
- duration
- is_preview
- is_downloadable
- sort_order

---

# Lesson Resources

## lesson_resources

- id
- lesson_id
- file_name
- file_path
- file_size
- mime_type

---

# Enrollments

## enrollments

- id
- course_id
- user_id
- enrolled_at
- completed_at
- progress_percentage
- status

---

# Lesson Progress

## lesson_progress

- id
- enrollment_id
- lesson_id
- completed
- completed_at
- watch_time

---

# Certificates

## certificates

- id
- user_id
- course_id
- certificate_number
- issued_at
- verification_code
- pdf_path

---

# Quizzes

## quizzes

- id
- course_id
- title
- description
- passing_score
- duration
- max_attempts
- status

---

# Questions

## questions

- id
- quiz_id
- type
- question
- explanation
- points
- sort_order

---

# Question Options

## question_options

- id
- question_id
- option_text
- is_correct

---

# Quiz Attempts

## quiz_attempts

- id
- quiz_id
- user_id
- score
- passed
- started_at
- submitted_at

---

# Assignments

## assignments

- id
- course_id
- title
- description
- due_date
- max_score

---

# Assignment Submissions

## assignment_submissions

- id
- assignment_id
- user_id
- submission_path
- feedback
- score
- submitted_at
- graded_at

---

# Discussions

## discussions

- id
- course_id
- user_id
- title
- body
- pinned
- locked

---

# Discussion Replies

## discussion_replies

- id
- discussion_id
- user_id
- body

---

# Reviews

## reviews

- id
- course_id
- user_id
- rating
- review
- approved

---

# Notifications

## notifications

Laravel Notifications Table

---

# Orders

## orders

- id
- user_id
- order_number
- subtotal
- discount
- tax
- total
- currency
- payment_status
- status

---

# Order Items

## order_items

- id
- order_id
- course_id
- price

---

# Coupons

## coupons

- id
- code
- discount_type
- discount_value
- usage_limit
- expires_at
- active

---

# Transactions

## transactions

- id
- order_id
- gateway
- transaction_reference
- amount
- currency
- status
- paid_at

---

# Licensing

## licenses

- id
- license_key
- organization_id
- product
- subscription_plan
- expires_at
- status
- last_verified_at

---

# Feature Flags

## feature_flags

- id
- license_id
- feature
- enabled

---

# Audit Logs

## audit_logs

- id
- user_id
- module
- action
- description
- ip_address
- user_agent

---

# Settings

## settings

- id
- key
- value
- type

---

# Media

## media

- id
- disk
- path
- filename
- mime_type
- size
- uploaded_by

---

# Relationships

Organization

```
Organization
    ↓
Courses
```

Category

```
Category
    ↓
Courses
```

Course

```
Course
    ↓
Sections
    ↓
Lessons
```

Course

```
Course
    ↓
Enrollments
```

Enrollment

```
Enrollment
    ↓
Lesson Progress
```

Course

```
Course
    ↓
Quizzes
```

Quiz

```
Quiz
    ↓
Questions
    ↓
Options
```

Course

```
Course
    ↓
Assignments
```

Assignment

```
Assignment
    ↓
Submissions
```

Course

```
Course
    ↓
Reviews
```

Course

```
Course
    ↓
Discussions
```

Order

```
Order
    ↓
Transactions
```

License

```
License
    ↓
Feature Flags
```

---

# AI Rules

- Every table must have a Laravel migration.
- Every foreign key must use constraints.
- Every table must have indexes where appropriate.
- Use cascading deletes only where appropriate.
- Avoid nullable fields unless required.
- Normalize data to reduce duplication.
- Use Eloquent relationships instead of manual joins whenever possible.
- Add database indexes for all frequently queried columns.
- Follow Laravel naming conventions.
- Design the schema for scalability and maintainability.
