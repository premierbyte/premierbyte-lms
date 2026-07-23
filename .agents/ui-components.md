# Premierbyte LMS - UI Components

Version: 1.0.0

Status: Master UI Component Specification

---

# Purpose

This document defines the design system, reusable UI components, layout structure, interaction patterns, and UI development standards for the Premierbyte LMS.

The goal is to ensure:

- Consistent UI
- Reusable components
- Accessible interfaces
- Responsive design
- Modern SaaS experience
- Maintainable frontend architecture

All UI must follow this document.

---

# Technology Stack

Framework

- Next.js 16
- React 19
- TypeScript

Styling

- Tailwind CSS v4

Component Library

- shadcn/ui

Icons

- Lucide React

Animations

- Framer Motion

Forms

- React Hook Form
- Zod

Data Fetching

- TanStack Query

Tables

- TanStack Table

Charts

- Recharts

State Management

- Zustand

Notifications

- Sonner

Theme

- next-themes

---

# UI Principles

Every screen must be

- Clean
- Modern
- Responsive
- Accessible
- Fast
- Consistent
- Minimal
- Easy to navigate

Avoid unnecessary visual complexity.

---

# Layout Structure

Public Layout

```
Header

↓

Hero

↓

Content

↓

CTA

↓

Footer
```

Dashboard Layout

```
Sidebar

↓

Header

↓

Breadcrumb

↓

Page Content

↓

Footer
```

Mobile

```
Top Bar

↓

Content

↓

Bottom Navigation (optional)
```

---

# Color System

Primary

- Brand Primary

Secondary

- Brand Secondary

Success

- Green

Warning

- Amber

Danger

- Red

Info

- Blue

Neutral

- Gray Scale

Never hardcode colors.

Always use design tokens or Tailwind theme variables.

---

# Typography

Font

- Geist Sans

Fallback

- Inter

Hierarchy

```
H1

H2

H3

H4

Body

Small

Caption
```

Use consistent font weights.

---

# Spacing

Use Tailwind spacing scale.

Avoid arbitrary values.

Preferred

```
2

4

6

8

12

16

20

24
```

---

# Border Radius

Cards

Buttons

Inputs

Dialogs

Dropdowns

Should use consistent radius.

---

# Shadows

Only use

- Small
- Medium
- Large

Avoid excessive shadows.

---

# Icons

Use only

Lucide React

Never mix icon libraries.

---

# Navigation Components

- Sidebar
- Header
- Footer
- Breadcrumb
- Top Navigation
- Mobile Navigation
- User Menu

---

# Authentication Components

- Login Form
- Registration Form
- Forgot Password
- Reset Password
- Verify Email
- Two-Factor Authentication

---

# Dashboard Components

- Dashboard Cards
- Statistics Cards
- Activity Timeline
- Charts
- Recent Activity
- Quick Actions

---

# Table Components

Every data table should support

- Pagination
- Sorting
- Filtering
- Search
- Column Visibility
- Row Selection
- Bulk Actions
- Export
- Empty State
- Loading State

Used for

- Users
- Courses
- Students
- Payments
- Certificates
- Licenses

---

# Form Components

Standard Components

- Input
- Password Input
- Textarea
- Select
- Multi Select
- Checkbox
- Radio Group
- Switch
- Date Picker
- Time Picker
- File Upload
- Image Upload
- Rich Text Editor

All forms must

- Validate with Zod
- Use React Hook Form
- Show inline validation
- Display loading state

---

# Buttons

Variants

- Primary
- Secondary
- Outline
- Ghost
- Link
- Destructive
- Success

States

- Default
- Hover
- Active
- Disabled
- Loading

---

# Cards

Used for

- Dashboard Widgets
- Course Cards
- Statistics
- Certificates
- Reports

Every card should support

- Title
- Description
- Actions
- Footer (optional)

---

# Modal Components

Use for

- Confirm Delete
- Create Resource
- Edit Resource
- View Details

Support

- Keyboard Navigation
- Escape to Close
- Focus Trap

---

# Drawer Components

Used on

- Mobile
- Settings
- Filters
- Quick View

---

# Tabs

Used for

- Course Builder
- User Profile
- Settings
- Reports

---

# Accordion

Used for

- FAQ
- Course Sections
- Documentation

---

# Course Components

- Course Card
- Course Grid
- Course List
- Course Header
- Course Overview
- Curriculum
- Instructor Card
- Reviews
- Related Courses
- Enrollment Card

---

# Lesson Components

- YouTube Player
- Lesson Navigation
- Progress Indicator
- Lesson Notes
- Attachments
- Mark Complete Button

---

# Quiz Components

- Quiz Header
- Timer
- Question Card
- Options
- Progress Indicator
- Results
- Score Card

---

# Assignment Components

- Assignment Card
- Submission Form
- Grade Card
- Feedback Panel

---

# Certificate Components

- Certificate Preview
- Download Button
- Verification Badge

---

# Notification Components

- Toast
- Notification Bell
- Notification Dropdown
- Notification List

---

# Payment Components

- Checkout Summary
- Coupon Form
- Payment Status
- Invoice Card
- Transaction Timeline

---

# Licensing Components

- License Status Card
- Subscription Card
- Renewal Banner
- Feature Availability Badge
- Grace Period Warning

---

# Reports Components

- KPI Cards
- Charts
- Tables
- Filters
- Export Actions

---

# Empty States

Every page must have an empty state.

Include

- Illustration (optional)
- Message
- Call to Action

---

# Loading States

Use

- Skeletons
- Progress Indicators
- Loading Buttons

Avoid blank pages.

---

# Error States

Display

- Friendly Message
- Retry Button
- Error Details (development only)

Never expose stack traces.

---

# Search Components

Support

- Instant Search
- Debouncing
- Keyboard Navigation

---

# File Upload

Support

- Drag and Drop
- Click Upload
- Progress
- Preview
- Validation

---

# Rich Text Editor

Used for

- Course Description
- Lesson Content
- Announcements

Support

- Images
- Tables
- Lists
- Links
- Code Blocks

---

# Theme

Support

- Light Mode
- Dark Mode
- System Theme

Persist preference.

---

# Accessibility

Every component must

- Support keyboard navigation
- Include ARIA labels
- Support screen readers
- Meet WCAG 2.1 AA guidelines
- Display visible focus indicators

---

# Responsive Design

Support

- Mobile
- Tablet
- Laptop
- Desktop
- Wide Screens

Use a mobile-first approach.

---

# Performance

- Lazy load heavy components.
- Virtualize large tables where appropriate.
- Use dynamic imports for large modules.
- Optimize images with Next.js Image.
- Avoid unnecessary re-renders.

---

# Component Organization

```
components/
│
├── ui/                # shadcn/ui primitives
├── layouts/
├── navigation/
├── forms/
├── tables/
├── cards/
├── charts/
├── dashboard/
├── courses/
├── lessons/
├── quizzes/
├── assignments/
├── certificates/
├── payments/
├── licensing/
├── reports/
├── settings/
├── feedback/
├── common/
└── providers/
```

---

# Naming Convention

Component Names

```
PascalCase
```

Examples

```
CourseCard

UserTable

LessonPlayer

DashboardSidebar

LicenseStatusCard
```

Files

```
course-card.tsx

user-table.tsx

lesson-player.tsx
```

---

# AI Rules

- Build reusable components before page-specific components.
- Prefer composition over duplication.
- Use shadcn/ui as the base for custom components.
- Keep components small and focused on a single responsibility.
- Separate presentation from business logic.
- Avoid inline styles; use Tailwind CSS utilities.
- Ensure every interactive component is accessible.
- Reuse existing components whenever possible instead of creating new ones.
- Document complex components and keep them consistent with the design system.
