# Premierbyte LMS - SEO Guidelines

Version: 1.0.0

Status: Master SEO Specification

---

# Purpose

This document defines the Search Engine Optimization (SEO) standards for the Premierbyte LMS.

All public pages must follow these guidelines to improve discoverability, search engine rankings, page performance, accessibility, and social sharing.

These standards apply to both the marketing website and public course pages.

---

# Scope

SEO applies only to public pages.

Examples

- Home
- About
- Contact
- Pricing
- FAQ
- Blog
- Course Catalog
- Course Details
- Instructor Profile
- Category Pages
- Legal Pages

Authenticated pages must never be indexed.

Examples

- Dashboard
- Profile
- Checkout
- Settings
- Reports
- Admin Pages

---

# SEO Principles

Every public page must have:

- Unique title
- Unique meta description
- Canonical URL
- Open Graph metadata
- Twitter Card metadata
- Structured data
- Optimized images
- Clean URLs
- Mobile responsiveness
- High performance

---

# Metadata Standards

Every page must define

Title

- Maximum 60 characters

Description

- Maximum 160 characters

Keywords

- Optional

Canonical URL

Robots

Open Graph

Twitter Card

Example

```
Title

Professional Laravel Course | Premierbyte LMS

Description

Learn Laravel from beginner to advanced with hands-on projects.

Canonical

https://example.com/courses/laravel

Robots

index, follow
```

---

# Next.js Metadata

Use the App Router Metadata API.

Every page should export metadata.

Example

```
title
description
keywords
metadataBase
alternates
openGraph
twitter
robots
```

Avoid manually manipulating `<head>`.

---

# URL Structure

Good

```
/courses

/courses/laravel-for-beginners

/categories/web-development

/instructors/john-doe

/blog

/blog/how-to-learn-laravel
```

Bad

```
/course?id=12

/page.php?id=8

/index.php?page=blog
```

URLs should be

- lowercase
- hyphen-separated
- descriptive
- permanent

---

# Slugs

Every public resource must use a slug.

Examples

Course

```
laravel-for-beginners
```

Instructor

```
john-doe
```

Category

```
web-development
```

Blog

```
getting-started-with-nextjs
```

Never expose database IDs in URLs.

---

# Sitemap

Automatically generate

```
/sitemap.xml
```

Include

- Home
- Categories
- Courses
- Blog
- Instructor Profiles
- Static Pages

Exclude

- Dashboard
- Login
- Admin
- Checkout
- Profile

---

# Robots.txt

Generate

```
/robots.txt
```

Allow

```
/

```

Disallow

```
/dashboard

/admin

/api

/login

/register

/settings

/profile

/checkout
```

Reference sitemap

```
Sitemap: https://example.com/sitemap.xml
```

---

# Structured Data

Implement Schema.org JSON-LD.

Supported schemas

- Organization
- Course
- Person
- BreadcrumbList
- FAQPage
- Article
- WebSite
- WebPage

Course pages must include

- Course Name
- Description
- Instructor
- Provider
- Rating
- Duration
- Price

---

# Open Graph

Every public page should include

```
Title

Description

Image

URL

Type

Site Name
```

Example

```
og:title

og:description

og:image

og:url

og:type
```

---

# Twitter Cards

Use

```
summary_large_image
```

Include

- title
- description
- image

---

# Images

Every image should

- use Next.js Image
- include alt text
- be lazy loaded
- use modern formats (WebP or AVIF where practical)
- have defined width and height
- be compressed

---

# Accessibility

Every page must

- include semantic HTML
- use heading hierarchy
- include alt text
- support keyboard navigation
- maintain color contrast
- include ARIA attributes where necessary

SEO and accessibility go together.

---

# Performance

Target

Lighthouse

- Performance > 90
- Accessibility > 95
- SEO > 95
- Best Practices > 95

Core Web Vitals

- LCP < 2.5 seconds
- CLS < 0.1
- INP < 200 ms

---

# Internal Linking

Every page should link to related content.

Examples

Course

↓

Instructor

↓

Category

↓

Related Courses

↓

Blog Articles

Avoid orphan pages.

---

# Pagination

Paginated pages must use

```
?page=2
```

Include canonical URLs where appropriate and avoid duplicate content.

---

# Course SEO

Every course should include

- Title
- Subtitle
- Description
- Learning Outcomes
- Prerequisites
- Target Audience
- Course Duration
- Language
- Level
- Instructor
- Thumbnail
- Trailer Video (YouTube)
- FAQs (optional)

---

# Instructor SEO

Every instructor profile should include

- Name
- Biography
- Skills
- Social Links
- Published Courses
- Avatar

---

# Blog SEO

Every article should include

- Title
- Slug
- Featured Image
- Meta Description
- Author
- Published Date
- Updated Date
- Reading Time
- Category
- Tags

---

# Canonical URLs

Every public page must define a canonical URL to prevent duplicate content.

---

# Localization

If multiple languages are supported

Use

```
hreflang
```

Example

```
en

fr

de

es
```

---

# Security

Never index

- Login
- Dashboard
- Admin
- Checkout
- API Endpoints
- User Profiles
- Settings

Private pages must include

```
noindex, nofollow
```

---

# AI Rules

- Use the Next.js Metadata API for all public pages.
- Generate unique metadata for every public route.
- Do not duplicate titles or descriptions.
- Every course must have an SEO-friendly slug.
- Every blog article must have structured data.
- Every public image must include descriptive alt text.
- Do not index authenticated pages.
- Automatically generate sitemap.xml and robots.txt.
- Maintain Lighthouse SEO scores above 95 whenever possible.
- Ensure all public pages are mobile-friendly and accessible.
