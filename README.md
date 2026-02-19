# Flowly 🚀  
![Status](https://img.shields.io/badge/status-active-success)  
![Frontend](https://img.shields.io/badge/frontend-Next.js%2014-black)  
![Backend](https://img.shields.io/badge/backend-Node.js%20%7C%20Express-green)  
![Database](https://img.shields.io/badge/database-PostgreSQL-blue)  
![ORM](https://img.shields.io/badge/orm-Prisma-2D3748)  
![Language](https://img.shields.io/badge/language-TypeScript-3178C6)
![Docker](https://img.shields.io/badge/docker-Containerized-2496ED)

> **Flowly** is a fullstack B2B SaaS platform for project and task management, inspired by tools like Trello, Jira and Linear.  
> Designed with Clean Architecture principles, strong type-safety, and scalable patterns, it demonstrates production-level engineering decisions for modern web applications.

---

## 📌 About The Project

Flowly was built to simulate a real-world SaaS environment focused on team productivity and task orchestration.

The goal was not just to replicate a Kanban board — but to design a **scalable, maintainable and secure system** capable of supporting:

- Multi-project collaboration  
- Role-based task management  
- Secure authentication flows  
- Extensible domain structure (multi-tenancy ready)

This project emphasizes:

- Clear separation of concerns  
- Robust authentication and security  
- Maintainable backend services  
- Predictable and scalable frontend state management  
- Strong typing across the entire stack
- **Production-ready containerization**

It serves as a portfolio centerpiece to demonstrate engineering maturity beyond CRUD-level applications.

---

## ✨ Key Features

### 🔐 Secure Authentication Flow
- JWT-based authentication
- Password hashing with Argon2
- **Mandatory Email Confirmation** with token validation (SMTP/Resend)
- Password recovery with secure time-based tokens
- Centralized error handling middleware

### 📊 Interactive Dashboard
- Real-time metrics
- Task distribution charts (Recharts)
- Activity feed
- Optimized data fetching with TanStack Query

### 📌 Kanban Board
- Drag and Drop using Hello-Pangea/DnD
- Column and task reordering
- Persistent state updates
- Optimistic UI updates
- Efficient re-rendering strategy

### 🏷️ Global Tag System
- Centralized tag management
- Many-to-many relation with tasks
- Dynamic selection with optimized UI state

### 📝 Rich Task Management
- Rich text editor with Tiptap
- File attachments (UploadThing)
- Task comments
- Member assignment
- Priority & status control

### 🏢 Multi-Tenancy (Conceptual Architecture)
- Company entity
- Users scoped to companies
- Projects scoped to companies
- Data isolation ready for SaaS scaling

---

# 🏗 System Architecture (Engineering Focus)

## Why Clean Architecture?

The project was refactored to enforce strict separation between layers:

- Transport Layer (HTTP / Controllers)
- Application Layer (Services / Business Rules)
- Data Access Layer (Prisma Repositories)
- Validation Layer (DTOs + Zod Schemas)

This ensures testability of business rules, reduced coupling, clear domain boundaries, and scalability for future features.

---

## 🔹 Backend Architecture

**Structure:**

src/
├── controllers/    # Handle HTTP layer, delegate logic to Services
├── services/       # Core business logic & transaction handling
├── dtos/           # Explicit input/output contracts
├── schemas/        # Zod validation, prevents invalid payload propagation
├── middlewares/    # Centralized Error handling & Auth checks
├── utils/          # Shared utilities
└── prisma/         # Database schema and migrations

---

## 🔹 Frontend Architecture

The frontend follows modern scalable patterns:

### App Router (Next.js 14)
- Server Components where possible
- Client Components isolated intentionally

### Container / Presentational Pattern
- Containers handle logic
- UI components remain pure and reusable

### Custom Hooks
- Encapsulated business logic
- Isolated data-fetching logic
- Predictable state management

### Service Layer
- Dedicated API service modules
- Decouples UI from HTTP layer
- Enables easy migration to alternative backends

---

## 📊 Data Flow Overview (Conceptual)

```
flowchart TD
    UI[Client UI] --> Hooks
    Hooks --> Services
    Services --> API
    API --> Controllers
    Controllers --> ServicesBackend
    ServicesBackend --> Prisma
    Prisma --> PostgreSQL
```

### 🧰 Tech Stack
#### Frontend
```
Next.js 14 (App Router)

TypeScript

Tailwind CSS

Shadcn/UI

TanStack Query (React Query)

React Hook Form

Zod

Hello-Pangea/DnD

Recharts

Tiptap
```

#### Backend
```
Node.js

Express

TypeScript

Prisma ORM

Zod

Argon2

JWT
```
#### Database
```
PostgreSQL
```

#### DevOps / Tooling
```
Docker

Docker Compose

ESLint

Prettier

Multi-stage builds
```

### 🚀 Getting Started

1️⃣ Clone Repository
```bash
Copiar código
git clone https://github.com/LuccaMontarroyos/flowly-saas.git
cd flowly
```
2️⃣ Setup Environment Variables
```
Backend .env
makefile
Copiar código
DATABASE_URL=
JWT_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
APP_URL=
Frontend .env.local
makefile
Copiar código
NEXT_PUBLIC_API_URL=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
```
3️⃣ Install Dependencies
```bash
Copiar código
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```
4️⃣ Run Database Migrations
```bash
Copiar código
npx prisma migrate dev
```
5️⃣ Run the Stack

Make sure you have Docker Desktop running, then execute:

```bash
docker-compose up --build
```
This command will automatically provision the PostgreSQL database, install dependencies, run Prisma migrations, and start both the Backend (Port 3000) and Frontend (Port 3001) in optimized standalone modes.

Access the application: http://localhost:3001

### 🗄 Database Schema Overview
Core Relationships
User → Company (Many-to-One)

Company → Projects (One-to-Many)

Project → Tasks (One-to-Many)

Task → Tags (Many-to-Many)

Task → Comments (One-to-Many)

Task → Assigned Users (Many-to-Many)

Domain Design Considerations
Explicit foreign keys

Cascade strategies defined

Join tables for scalability

Prepared for role-based access control expansion

### 👤 Author
Lucca Barros

GitHub: https://github.com/LuccaMontarroyos

LinkedIn: https://linkedin.com/in/lucca-barros

### 🎯 Engineering Highlights
Strong type safety across fullstack

Clean Architecture refactor

Secure authentication lifecycle

Separation of concerns (frontend & backend)

Optimistic updates and async state control

Multi-tenant domain preparation

Production-ready container orchestration

#### Flowly is more than a Kanban clone — it is a demonstration of scalable architecture, engineering discipline, and product-oriented thinking.