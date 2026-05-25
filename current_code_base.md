# Portfolio Platform

> A full-stack, monolithic portfolio platform built with NestJS, Next.js, and PostgreSQL. Designed to feel like a SaaS product and personal brand.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Folder Structure](#4-folder-structure)
5. [Database Design](#5-database-design)
6. [Local Setup](#6-local-setup)
7. [API Design](#7-api-design)
8. [Current Status](#8-current-status)
9. [Senior Architect Review & Recommendations](#9-senior-architect-review--recommendations)

---

## 1. Project Overview

This is a backend-driven platform designed to feel like a SaaS product and personal brand. An admin controls everything displayed — profile, skills, projects, experience, availability status — through a dedicated admin dashboard. Every piece of content on the public site is managed through the backend API.

The goal is to provide a robust, production-ready system to showcase work and facilitate client/employer contact, utilizing a modular monolithic backend.

---

## 2. System Architecture

The architecture follows a modular monolithic pattern:

```text
Admin Dashboard (React + Vite)
          |
          v
Frontend (Next.js 16 App Router)
          |
          v
API Gateway (NestJS) ——— PostgreSQL (Neon via Prisma)
```

### Why this architecture
A modular monolith is the ideal choice for a portfolio platform. Microservices (like Kafka or independent chat services) introduce deployment complexity, synchronization overhead, and data consistency challenges that are unnecessary for a project of this scale and throughput. A well-structured monolith in NestJS provides excellent developer experience, low latency, and is highly maintainable.

---

## 3. Tech Stack

### Frontend
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS, Framer Motion
- **State Management:** Zustand
- **Icons:** Lucide React

### Admin Dashboard
- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit

### Backend
- **Framework:** NestJS
- **ORM:** Prisma v7
- **Database:** PostgreSQL (Neon)
- **Auth:** JWT + Passport.js
- **API Docs:** Swagger (OpenAPI)

---

## 4. Folder Structure

The project is structured as a standard multi-root repository (not a Turborepo):

```text
portfolio-platform/
├── admin/               # React (Vite) admin dashboard
├── backend/             # NestJS monolithic API
├── frontend/            # Next.js customer-facing application
└── README.md            # You are here
```

### Backend (NestJS)
```text
backend/
├── prisma/
│   └── schema.prisma    # PostgreSQL database schema
├── src/
│   ├── modules/
│   │   ├── api-log/     # Request logging
│   │   ├── auth/        # JWT Authentication
│   │   ├── blog/        # Blog & Comments CRUD
│   │   ├── portfolio/   # Experience, Projects, Skills
│   │   ├── product/     # Ecommerce/Software products
│   │   └── upload/      # Cloudinary image uploads
│   ├── app.module.ts
│   └── main.ts
└── package.json
```

---

## 5. Database Design

### Core Models
- **Profile:** Single row holding user metadata, bio, and availability.
- **Project:** Portfolio projects, tech stack, and URLs.
- **Experience & Education:** Career timeline.
- **Service & DeveloperTool:** Offerings and personal recommendations.
- **Blog, Category, Comment:** Full content management engine.
- **Product:** Ecommerce and software product representations.
- **User:** Authentication and role-based access control (ADMIN / USER).

---

## 6. Local Setup

### Prerequisites
- Node.js 20+
- pnpm

### Steps

```bash
# Clone the repo
git clone https://github.com/Shaik-Sameer77/portfolio-platform.git
cd portfolio-platform

# 1. Setup Backend
cd backend
pnpm install
cp .env.example .env # Fill in DATABASE_URL, JWT_SECRET, Cloudinary keys
npx prisma generate
npx prisma migrate dev
pnpm start:dev

# 2. Setup Frontend
cd ../frontend
pnpm install
pnpm dev

# 3. Setup Admin
cd ../admin
pnpm install
pnpm dev
```

---

## 7. API Design

The RESTful API is documented via Swagger. Once the backend is running, you can access the interactive documentation at `http://localhost:8001/api-docs`.

Key namespaces:
- `/portfolio/*` - Read/write resume and project data
- `/blogs/*` - Blog system
- `/auth/*` - JWT issuance and registration
- `/products/*` - Product listings

---

## 8. Current Status

**Implemented:**
- NestJS API with Prisma and PostgreSQL.
- Next.js frontend with routing for Portfolio, Blog, Services, etc.
- Vite/React Admin Dashboard with Redux state.
- JWT Authentication and Role Guards (ADMIN/USER).
- Cloudinary integration for image uploads.

**Pending/Missing:**
- End-to-end integration testing.
- Standardized error logging and monitoring (e.g., Sentry).
- Fully abstracted CI/CD pipelines.

*(This README reflects the actual state of the codebase, omitting unbuilt microservices or unused tooling.)*

---

## 9. Senior Architect Review & Recommendations

### 9.1 Overall Project Completion Estimate: ~75%
The core features are functional, well-structured, and integrated using highly robust modern technology choices. However, a significant amount of polish, integration validation, and enterprise-grade hardening remains.

### 9.2 Critical Audit of Implemented Architecture

#### What Has Been Completed Perfectly
*   **Database Schema Design:** Relational integrity in PostgreSQL matches the business needs. The single-row pattern with upserts for configurations (like `Profile` and `AboutSection`) is excellent practice.
*   **Modular Organization:** NestJS modules (`auth`, `blog`, `portfolio`, `product`, `upload`) are highly decoupled, making any future migration or feature expansion incredibly straightforward.
*   **Aesthetic Styling Foundations:** Tailwind and Framer Motion integration are correctly configured to provide a premium feel.

#### What Needs Improvement / Technical Debt
*   **Local Storage Auth Handling:** Storing raw authorization tokens in standard `localStorage` on the admin panel presents XSS vulnerabilities. High-security profiles should favor HTTP-Only cookies with proper CORS policies.
*   **Lack of Workspace Integration:** Despite living under a single repository, there is no shared package management (e.g., Turborepo or npm/pnpm workspaces). This results in duplicate TypeScript definitions and schema interfaces between backend, admin, and frontend directories.
*   **Error Boundaries & State Resiliency:** Earlier debugging sessions highlighted edge cases where network requests failed due to 401s, causing blank screen freezes or loading flashes rather than graceful, automated logout redirections or user alerts.

---

### 9.3 Architectural Decision: Monolith vs. Microservices

> **Architectural Recommendation:** Stick to the Modular Monolith. Reject microservices.

An analysis comparing the design paradigms specifically for this platform reveals the following:

| Evaluation Metric | Monolith (Current Choice) | Microservices (e.g., Kafka + Services) |
| :--- | :--- | :--- |
| **Development Velocity** | **Vastly Superior.** Single context, immediate debugging, unified codebase. | **Slow.** Inter-service contracts, network orchestration, serialization overhead. |
| **Deployment & Ops** | **Minimal.** Single Node.js server container (Railway/Render) + single PG database (Neon). | **Extremely Complex.** Independent service hosting, message broker setup (Kafka), schema registry. |
| **Performance** | **Sub-millisecond latency.** Internal module communication and direct SQL transactions. | **Network bound.** Latency added at every boundary due to network hops and queue delivery. |
| **Data Consistency** | **Transactional integrity (ACID).** Single database query handles atomic state updates. | **Eventual consistency.** Event-driven synchronization introduces out-of-order logs and retry complexity. |

#### Conclusion
For a high-profile portfolio, blog, and showcase platform, a **Modular Monolith** delivers superior performance, simplified operational costs, and an elite developer experience. Over-engineering with event buses (like Apache Kafka) adds unnecessary distributed system problems without any real scale-driven justification. Keep the core system simple, and leverage caching (e.g., Redis) or CDN edges for massive read traffic.
