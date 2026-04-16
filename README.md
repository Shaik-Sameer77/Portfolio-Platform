# Portfolio Platform — Project Documentation

> A full-stack, event-driven portfolio platform built with NestJS, Next.js, PostgreSQL, MongoDB, and Kafka.
> This document reflects what is actually built and planned — nothing is inflated.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [What This Project Demonstrates](#2-what-this-project-demonstrates)
3. [Tech Stack](#3-tech-stack)
4. [System Architecture](#4-system-architecture)
5. [Database Design](#5-database-design)
6. [Folder Structure](#6-folder-structure)
7. [API Modules](#7-api-modules)
8. [Data Flow](#8-data-flow)
9. [Authentication](#9-authentication)
10. [Build Phases](#10-build-phases)
11. [Design Decisions](#11-design-decisions)
12. [Testing Strategy](#12-testing-strategy)
13. [Observability](#13-observability)
14. [Deployment](#14-deployment)
15. [Local Setup](#15-local-setup)
16. [Challenges and Learnings](#16-challenges-and-learnings)
17. [Interview Talking Points](#17-interview-talking-points)

---

## 1. Project Overview

This is not a static portfolio website. It is a backend-driven platform where an admin controls everything displayed on the public portfolio — profile, skills, projects, experience — through a dedicated admin dashboard. It also includes a blog system, a contact system, a chatbot, and an event-driven microservices layer for analytics, notifications, and CRM.

The goal is to simulate a real production system, not just build a showcase site.

**Repository:** github.com/Shaik-Sameer77/portfolio-platform  
**Live URL:** _(add after deployment)_  
**Swagger UI:** _(add after deployment)_

---

## 2. What This Project Demonstrates

- Designing a backend-driven content system (not hardcoded frontend)
- NestJS module architecture — one module per feature, cleanly separated
- Prisma ORM with PostgreSQL for structured relational data
- MongoDB for high-frequency, schema-flexible data (chat logs, analytics)
- Apache Kafka for decoupled async communication between services
- JWT authentication with role-based access (admin vs user)
- Turborepo monorepo managing frontend, backend, and microservices
- Swagger API documentation auto-generated from code
- Docker Compose for local development environment

---

## 3. Tech Stack

### Frontend

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| Framework        | Next.js (App Router)                |
| Styling          | Tailwind CSS                        |
| State management | Zustand                             |
| Admin dashboard  | React + Material UI + Redux Toolkit |

### Backend

| Layer              | Technology          |
| ------------------ | ------------------- |
| Framework          | NestJS              |
| ORM                | Prisma v7           |
| Primary database   | PostgreSQL via Neon |
| Secondary database | MongoDB Atlas       |
| Event streaming    | Apache Kafka        |
| Auth               | JWT + Passport.js   |
| API docs           | Swagger (OpenAPI)   |

### DevOps

| Layer            | Technology                            |
| ---------------- | ------------------------------------- |
| Monorepo         | Turborepo                             |
| Containerisation | Docker + Docker Compose               |
| CI/CD            | GitHub Actions _(phase 6)_            |
| Deployment       | Vercel (frontend) + Railway (backend) |

---

## 4. System Architecture

```
Admin Dashboard (React + Redux)
          |
          v
Frontend (Next.js)
          |
          v
API Gateway (NestJS) ——— PostgreSQL (Neon)
          |
          v
        Kafka
          |
    ------+------+-------+-------
    |            |       |       |
Analytics  Notification  CRM   Chat
Service    Service      Service Service
                                  |
                               MongoDB
```

### Why this architecture

The frontend and admin dashboard both talk to the same NestJS API gateway. The gateway handles all business logic and writes to PostgreSQL. When significant events happen (contact form submitted, blog created), the gateway publishes a Kafka event and returns immediately — it does not wait for downstream services. The microservices (notification, CRM, analytics, chat) consume these events independently. If any microservice is down, the core platform is unaffected.

---

## 5. Database Design

### PostgreSQL — structured relational data

**Profile** (single row — admin updates, never creates new)

- id, name, title, bio, avatarUrl, location, resumeUrl, updatedAt

**SocialLinks** (single row)

- id, github, linkedin, twitter, email, updatedAt

**Skill**

- id, name, category, iconUrl, order

**Project**

- id, title, description, techStack (string array), githubUrl, liveUrl, imageUrl, featured, order

**Experience**

- id, company, role, startDate, endDate, current, description

**Education**

- id, institution, degree, startYear, endYear

**Blog**

- id, title, slug, content, excerpt, coverImage, published, categoryId, authorId, createdAt, updatedAt

**Category**

- id, name, slug

**Comment**

- id, content, blogId, userId, createdAt

**Contact**

- id, name, email, subject, message, read, createdAt

**User**

- id, email, password (hashed), role (ADMIN | USER), createdAt

### MongoDB — flexible, high-frequency data

**ChatLog**

- sessionId, userId (optional), messages [ { role, content, timestamp } ], createdAt

**AnalyticsEvent**

- type (page_view | blog_view | contact_submitted), payload, timestamp

---

## 6. Folder Structure

### Monorepo root

```
portfolio-platform/
├── apps/
│   ├── web/               # Next.js frontend
│   ├── admin/             # React admin dashboard
│   └── backend/           # NestJS API gateway
├── services/
│   ├── notification-service/
│   ├── analytics-service/
│   ├── crm-service/
│   └── chat-service/
├── packages/
│   ├── types/             # shared TypeScript types
│   └── constants/         # shared Kafka topic names, enums
├── infra/
│   └── docker-compose.yml
└── turbo.json
```

### Backend (NestJS) — apps/backend/

```
backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── modules/
│   │   ├── portfolio/     # profile, skills, projects, experience
│   │   ├── blog/          # blogs, categories, comments
│   │   ├── contact/       # contact form
│   │   ├── auth/          # login, JWT, guards
│   │   └── users/         # user management
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── common/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── filters/
│   │   └── pipes/
│   ├── kafka/             # added in phase 4 only
│   │   └── producers/
│   ├── config/
│   │   └── app.config.ts
│   ├── app.module.ts
│   └── main.ts
└── .env
```

---

## 7. API Modules

### Portfolio module — GET /portfolio/\*

| Method | Route                   | Access | Description         |
| ------ | ----------------------- | ------ | ------------------- |
| GET    | /portfolio/profile      | Public | Fetch profile data  |
| PATCH  | /portfolio/profile      | Admin  | Update profile      |
| GET    | /portfolio/skills       | Public | List all skills     |
| POST   | /portfolio/skills       | Admin  | Add a skill         |
| DELETE | /portfolio/skills/:id   | Admin  | Remove a skill      |
| GET    | /portfolio/projects     | Public | List all projects   |
| POST   | /portfolio/projects     | Admin  | Add a project       |
| PATCH  | /portfolio/projects/:id | Admin  | Update a project    |
| DELETE | /portfolio/projects/:id | Admin  | Delete a project    |
| GET    | /portfolio/experience   | Public | List experience     |
| POST   | /portfolio/experience   | Admin  | Add experience item |

### Blog module — GET /blogs/\*

| Method | Route               | Access    | Description          |
| ------ | ------------------- | --------- | -------------------- |
| GET    | /blogs              | Public    | List published blogs |
| GET    | /blogs/:slug        | Public    | Get single blog      |
| POST   | /blogs              | Admin     | Create blog          |
| PATCH  | /blogs/:id          | Admin     | Update blog          |
| DELETE | /blogs/:id          | Admin     | Delete blog          |
| GET    | /blogs/:id/comments | Public    | Get comments         |
| POST   | /blogs/:id/comments | Auth user | Add comment          |

### Contact module

| Method | Route             | Access | Description          |
| ------ | ----------------- | ------ | -------------------- |
| POST   | /contact          | Public | Submit contact form  |
| GET    | /contact          | Admin  | View all submissions |
| PATCH  | /contact/:id/read | Admin  | Mark as read         |

### Auth module

| Method | Route          | Access    | Description        |
| ------ | -------------- | --------- | ------------------ |
| POST   | /auth/register | Public    | Register user      |
| POST   | /auth/login    | Public    | Login, receive JWT |
| GET    | /auth/me       | Auth user | Get current user   |

---

## 8. Data Flow

### Contact form submission

```
User submits form
      |
POST /contact → ContactService → save to PostgreSQL
                      |
               Kafka event: contact.created
                      |
          +-----------+-----------+
          |                       |
  NotificationService       CRMService
  (send email to admin)     (log lead)
```

### Blog creation

```
Admin creates blog
      |
POST /blogs → BlogService → save to PostgreSQL
                   |
            Kafka event: blog.created
                   |
           AnalyticsService
           (log creation event)
```

### Chat flow

```
User sends message
      |
POST /chat → ChatService → call AI API
                  |
           save log to MongoDB
                  |
          Kafka event: chat.session
                  |
          AnalyticsService
```

---

## 9. Authentication

- JWT-based. Login returns a signed token with userId and role.
- Two roles: ADMIN and USER.
- Admin routes are protected with a `RolesGuard` that checks the JWT payload.
- Public read routes (GET /blogs, GET /portfolio/profile) require no token.
- Comment routes require a valid USER token.
- All write routes require an ADMIN token.

---

## 10. Build Phases

### Phase 1 — Backend foundation (current)

- NestJS setup ✓
- Prisma connected to Neon PostgreSQL ✓
- Portfolio module (profile, skills, projects, experience)
- Blog module (CRUD)
- Contact module
- Swagger setup

### Phase 2 — Frontend

- Next.js public portfolio page
- Fetch and render portfolio data from API
- Blog list and detail pages
- Contact form

### Phase 3 — Auth and comments

- JWT auth
- Login/register
- Comment system on blogs
- Admin route protection

### Phase 4 — Admin dashboard

- React admin panel
- Manage profile, skills, projects, blogs
- View contact submissions

### Phase 5 — Kafka and microservices

- Docker Compose with Kafka + Zookeeper
- Notification service
- CRM service
- Analytics service

### Phase 6 — Chat and polish

- MongoDB Atlas connection
- Chat service with AI integration
- CI/CD with GitHub Actions
- Deploy to Vercel + Railway
- Performance and SEO

---

## 11. Design Decisions

### Why Kafka instead of direct REST calls between services?

Direct REST calls create tight coupling. If the notification service is down when a contact form is submitted, the API would either fail or have to wait. With Kafka, the API gateway publishes a `contact.created` event and returns a 201 immediately. The notification service consumes that event independently and retries on failure. The user experience is never affected by downstream service health.

### Why PostgreSQL for portfolio data and MongoDB for chat logs?

Portfolio data — profiles, blogs, projects — is structured and relational. A blog has an author, categories, and comments with clear foreign key relationships. PostgreSQL handles this with type safety and referential integrity. Chat logs are different: every conversation has a different shape, the volume is high, and we never need to join chat data with user records. MongoDB's document model fits this naturally.

### Why Prisma?

Prisma generates TypeScript types from the schema automatically. This means if a model changes, TypeScript catches every place in the codebase that breaks — at compile time, not at runtime in production. It also has excellent NestJS integration and supports raw SQL for performance-critical queries.

### Why a separate admin dashboard instead of route-based admin in Next.js?

A separate React app with Redux Toolkit demonstrates the ability to build internal tooling — which is what most companies actually need from full-stack engineers. It also keeps admin complexity out of the customer-facing frontend codebase.

### Why Turborepo?

The frontend, admin, backend, and microservices share TypeScript types and constants (Kafka topic names, enums, DTOs). Without a monorepo, these would either be duplicated or published as npm packages. Turborepo handles shared packages cleanly and runs builds in parallel.

---

## 12. Testing Strategy

> This section will be updated as tests are written. Only currently written tests are listed here.

### Unit tests — Jest (NestJS built-in)

Tests are written alongside each service file as `*.service.spec.ts`. Currently covering:

- _(to be added as each module is built)_

### API tests — Thunder Client / Postman

Each module has a collection testing:

- Happy path (valid request → correct response)
- Validation errors (missing fields → 400)
- Auth errors (missing token → 401, wrong role → 403)

### Integration tests

- Full request → database flow per module
- Added after each module is complete

---

## 13. Observability

### Logging

Using `nestjs-pino` for structured JSON logging. Every request logs: method, route, status code, duration, and a correlation ID that is passed through to Kafka events so a single user action can be traced across services.

### Kafka event log

Every event published includes: eventType, correlatedId, timestamp, payload. This creates a full audit trail of all significant actions in the system.

### Error tracking

Global exception filter in NestJS catches all unhandled errors and logs them with stack trace and request context. Sentry integration to be added during phase 6.

---

## 14. Deployment

> To be updated with live URLs after phase 6.

| Service            | Platform                    |
| ------------------ | --------------------------- |
| Frontend (Next.js) | Vercel                      |
| Backend (NestJS)   | Railway                     |
| PostgreSQL         | Neon (serverless)           |
| MongoDB            | Atlas (free tier)           |
| Kafka              | Confluent Cloud (free tier) |
| CI/CD              | GitHub Actions              |

### CI/CD pipeline (phase 6)

On every push to `main`:

1. Lint
2. Type check
3. Run tests
4. Build
5. Deploy to Railway / Vercel

---

## 15. Local Setup

### Prerequisites

- Node.js 20+
- pnpm
- Docker and Docker Compose (for Kafka in phase 5)

### Steps

```bash
# Clone the repo
git clone https://github.com/Shaik-Sameer77/portfolio-platform.git
cd portfolio-platform

# Install dependencies
pnpm install

# Set up environment variables
cp apps/backend/.env.example apps/backend/.env
# Fill in: DATABASE_URL, JWT_SECRET, MONGODB_URI

# Run database migrations
cd apps/backend
npx prisma migrate dev

# Start development
pnpm dev
```

### Environment variables

```env
# apps/backend/.env
DATABASE_URL=postgresql://...       # Neon connection string
JWT_SECRET=your-secret-here
MONGODB_URI=mongodb+srv://...       # Atlas connection string (phase 5)
KAFKA_BROKER=localhost:9092         # local Docker (phase 5)
```

---

## 16. Challenges and Learnings

> This section will grow as the project is built. Real problems and real solutions only.

**Prisma in NestJS dependency injection**
The default NestJS lifecycle means PrismaClient can be instantiated multiple times in tests. Solved by making PrismaService a global module so it is injected as a singleton across all modules.

**Single-row table pattern**
Profile and SocialLinks are tables that should only ever have one row. Rather than using a special database constraint, the PATCH endpoint uses Prisma's `upsert` — create if none exists, update if it does. This means the admin never needs to "initialise" the profile manually.

_(More to be added as development progresses)_

---

## 17. Interview Talking Points

**"Walk me through your system architecture."**

> "The frontend talks to a single NestJS API gateway. The gateway handles all business logic and persists to PostgreSQL via Prisma. For async work — emails, analytics, CRM lead capture — the gateway publishes Kafka events and returns immediately. Each microservice consumes the events it cares about independently. This means the core platform stays fast and resilient even if a downstream service has issues."

**"Why did you choose Kafka over just calling the services directly?"**

> "Direct calls create temporal coupling — the API response time becomes the sum of all service response times, and one slow service can take down the whole request. Kafka gives us decoupling in time: the gateway publishes and moves on. It also gives us replay — if the notification service was down for an hour, its consumer can catch up on missed events when it comes back."

**"How do you handle the admin vs user permissions?"**

> "JWT payload includes the user's role. A RolesGuard decorator checks this on protected routes. Public GET routes have no guard. User-only routes (comments) check for any valid token. Admin routes check specifically for the ADMIN role. The guard throws a 403 before the controller method even runs."

**"What would you do differently if you were scaling this to 100k users?"**

> "The Kafka layer is already pointing in the right direction — microservices can scale independently. I'd add Redis for caching the profile and blog list endpoints since they're read-heavy and rarely change. I'd add a CDN in front of images. I'd split the admin and public API onto separate services so a spike in admin usage doesn't affect public readers."

---

_Last updated: April 2026_
_Author: Shaik Sameer — Full Stack Engineer_
