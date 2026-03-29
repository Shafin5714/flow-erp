<p align="center">
  <h1 align="center">🚀 Flow-ERP</h1>
  <p align="center">
    <strong>A production-grade ERP system built with modern web technologies</strong>
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#api-reference">API Reference</a>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white" alt="GraphQL" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  </p>
</p>

---

## 📋 Overview

**Flow-ERP** is a full-stack, monorepo ERP system designed to handle real-world business operations — from inventory and point-of-sale to procurement and double-entry accounting. Built with a **GraphQL-first API** and a **Next.js 16 App Router** frontend, it demonstrates clean architecture, scalable schema design, and modern full-stack development patterns.

> This is a portfolio-grade project that reflects production-level engineering decisions, including role-based access control, modular GraphQL resolvers, relational data modeling, and a component-driven UI built with shadcn/ui.

---

## ✨ Features

| Module | Highlights |
|---|---|
| **📊 Dashboard** | Real-time KPIs — total sales, purchases, profit, and low-stock alerts aggregated via a single GraphQL query |
| **📦 Inventory** | Full product lifecycle — CRUD, SKU/barcode tracking, variant support, stock thresholds, Cloudinary image uploads, rich-text descriptions (Lexical editor) |
| **🛒 Point of Sale** | POS-style sales entry with product search, cart management, customer selection, payment modes (cash/due), and automatic stock deduction |
| **🔄 Purchases** | Vendor purchase orders with automatic stock increment, payment tracking, and purchase history |
| **👥 Customers & Vendors** | Contact management with transaction history and outstanding balance tracking |
| **💰 Accounting** | Account management (Cash, Bank, Capital, Loan) with income/expense entries and automatic ledger updates from sales & purchases |
| **📈 Reports** | Sales, purchase, and inventory reports with date-range filtering |
| **🔐 Auth & RBAC** | JWT-based authentication with role-based access control (Admin / Manager / Staff) and protected routes |

---

## 🛠️ Tech Stack

### Frontend — `client/`

| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | React framework with server components, file-based routing |
| **React 19** | UI library with latest concurrent features |
| **Apollo Client** | GraphQL state management and caching |
| **Tailwind CSS 4** + **shadcn/ui** | Utility-first styling with accessible, composable components |
| **Radix UI** | Headless primitives (Dialog, Dropdown, Popover, Tabs, etc.) |
| **Lexical** | Rich-text editor for product descriptions |
| **Recharts** | Data visualization for dashboard analytics |
| **React Hook Form** + **Zod** | Type-safe form handling with schema validation |
| **Sonner** | Toast notification system |
| **Lucide React** | Icon library |

### Backend — `server/`

| Technology | Purpose |
|---|---|
| **Express.js** | HTTP server and middleware layer |
| **Apollo Server 4** | GraphQL server with modular resolvers |
| **Prisma 7** | Type-safe ORM with migrations and schema-first modeling |
| **PostgreSQL** | Relational database (compatible with Neon serverless) |
| **JWT** (jsonwebtoken) | Stateless authentication |
| **bcrypt.js** | Secure password hashing |
| **Cloudinary** | Cloud image storage and optimization |
| **Multer** | File upload handling |

### Dev Tooling

| Tool | Purpose |
|---|---|
| **TypeScript** | End-to-end type safety |
| **ESLint 9** + **Prettier** | Code quality and formatting |
| **Husky** + **lint-staged** | Pre-commit hooks |
| **Commitlint** | Conventional commit enforcement |
| **Concurrently** | Parallel dev server orchestration |

---

## 🏗️ Architecture

```
flow-erp/                        # Monorepo root
│
├── client/                      # Next.js 16 frontend
│   ├── app/
│   │   ├── (auth)/              # Login & registration pages
│   │   └── (dashboard)/         # Protected dashboard layout
│   │       ├── page.tsx         # Dashboard home (KPI cards, charts)
│   │       ├── products/        # Product management pages
│   │       ├── sales/           # Sales list & POS interface
│   │       └── purchases/       # Purchase management pages
│   ├── components/
│   │   ├── ui/                  # 23 shadcn/ui primitives (Button, Dialog, Table, etc.)
│   │   ├── dashboard/           # Dashboard-specific components
│   │   ├── sales/               # Sales & POS components
│   │   ├── app-sidebar.tsx      # Navigation sidebar
│   │   └── protected-route.tsx  # Auth guard component
│   └── lib/
│       ├── apollo-client.tsx    # Apollo Client configuration
│       ├── auth-context.tsx     # JWT auth context provider
│       ├── graphql/             # Queries & mutations
│       └── types.ts             # Shared TypeScript types
│
├── server/                      # Express + Apollo Server backend
│   ├── src/
│   │   ├── index.ts             # Server entry point
│   │   ├── graphql/
│   │   │   ├── context.ts       # Request context (auth, prisma)
│   │   │   ├── schema/          # GraphQL type definitions
│   │   │   └── resolvers/       # Domain-specific resolvers
│   │   │       ├── user.resolver.ts
│   │   │       ├── product.resolver.ts
│   │   │       ├── sale.resolver.ts
│   │   │       ├── purchase.resolver.ts
│   │   │       ├── customer.resolver.ts
│   │   │       ├── vendor.resolver.ts
│   │   │       ├── account.resolver.ts
│   │   │       ├── dashboard.resolver.ts
│   │   │       └── ...8 more resolvers
│   │   ├── lib/                 # Server utilities
│   │   └── routes/              # REST endpoints (file uploads)
│   └── prisma/
│       ├── schema.prisma        # 13 models, 4 enums
│       ├── migrations/          # Version-controlled schema changes
│       └── seed.ts              # Database seeding script
│
└── docs/                        # Project documentation
```

---

## 🗄️ Data Model

The database schema consists of **13 interconnected models** with relational integrity:

```mermaid
erDiagram
    User ||--o{ Sale : creates
    Customer ||--o{ Sale : places
    Sale ||--|{ SaleItem : contains
    Product ||--o{ SaleItem : "sold in"
    ProductVariant ||--o{ SaleItem : "sold as"

    Vendor ||--o{ Purchase : supplies
    Purchase ||--|{ PurchaseItem : contains
    Product ||--o{ PurchaseItem : "purchased as"
    ProductVariant ||--o{ PurchaseItem : "purchased as"

    Category ||--o{ Product : categorizes
    Brand ||--o{ Product : brands
    Product ||--o{ ProductVariant : "has variants"

    Account ||--o{ AccountTransaction : records
    Customer ||--o{ AccountTransaction : linked
    Vendor ||--o{ AccountTransaction : linked
```

**Enums:** `Role` (Admin, Manager, Staff) · `PaymentMode` (Cash, Due) · `AccountType` (Cash, Bank, Capital, Loan) · `TransactionType` (Income, Expense, Capital, Loan)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+
- **PostgreSQL** database (local or [Neon](https://neon.tech) cloud)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/flow-erp.git
cd flow-erp

# 2. Install all dependencies (root + client + server)
npm run install:all

# 3. Configure environment variables (see below)

# 4. Generate Prisma client & run migrations
npm run db:generate
npm run db:migrate

# 5. (Optional) Seed the database
npm run db:seed

# 6. Start development servers
npm run dev
```

### Environment Variables

**Server** — `server/.env`

```env
DATABASE_URL=postgresql://user:password@localhost:5432/flow_erp
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=4000
CLIENT_URL=http://localhost:3000
```

**Client** — `client/.env.local`

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Running the App

| URL | Service |
|---|---|
| `http://localhost:3000` | Next.js frontend |
| `http://localhost:4000/graphql` | GraphQL Playground |

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start both client and server concurrently |
| `npm run dev:client` | Start only the Next.js frontend |
| `npm run dev:server` | Start only the Express/GraphQL backend |
| `npm run build` | Production build (client + server) |
| `npm run db:generate` | Generate Prisma client types |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema to database (no migration) |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:seed` | Seed the database with sample data |
| `npm run lint` | Lint the entire monorepo |
| `npm run lint:fix` | Auto-fix lint issues |

---

## 📡 API Reference

Access the **GraphQL Playground** at `http://localhost:4000/graphql` to explore and test the full API interactively.

### Queries

| Query | Description | Auth |
|---|---|---|
| `me` | Current authenticated user | 🔒 |
| `users` | List all users | 🔒 Admin |
| `products` | List products with filtering & pagination | 🔒 |
| `product(id)` | Get single product with variants | 🔒 |
| `categories` | List categories (with tree structure) | 🔒 |
| `brands` | List all brands | 🔒 |
| `customers` | List customers | 🔒 |
| `vendors` | List vendors | 🔒 |
| `sales` | List sales with items & customer info | 🔒 |
| `purchases` | List purchases with items & vendor info | 🔒 |
| `accounts` | List financial accounts | 🔒 |
| `dashboardStats` | Aggregated business KPIs | 🔒 |

### Mutations

| Mutation | Description | Auth |
|---|---|---|
| `login` / `register` | Authentication | Public |
| `createProduct` / `updateProduct` / `deleteProduct` | Product management | 🔒 |
| `createCategory` / `updateCategory` | Category management | 🔒 |
| `createCustomer` / `updateCustomer` | Customer management | 🔒 |
| `createVendor` / `updateVendor` | Vendor management | 🔒 |
| `createSale` | Create sale with automatic stock deduction | 🔒 |
| `createPurchase` | Create purchase with stock increment | 🔒 |
| `createTransaction` | Record accounting entry | 🔒 |

---

## 🧩 Key Engineering Decisions

| Decision | Rationale |
|---|---|
| **GraphQL over REST** | Eliminates over-fetching — dashboard loads via a single query. Strongly-typed schema serves as living API documentation. |
| **Monorepo structure** | Shared tooling (ESLint, Prettier, Husky) with independent client/server deployability. |
| **Apollo Server + Express** | Decoupled from Next.js API routes for independent scaling and REST endpoint support (e.g., file uploads via Multer). |
| **Prisma ORM** | Type-safe database access, auto-generated migrations, and seamless PostgreSQL integration. |
| **shadcn/ui + Radix** | Accessible, composable UI primitives that are copy-paste customizable — no black-box component library lock-in. |
| **Lexical rich-text editor** | Meta's extensible editor framework for structured product descriptions stored as HTML. |
| **JWT + RBAC** | Stateless auth with role-based resolver guards for fine-grained access control. |
| **Conventional Commits** | Enforced via Commitlint + Husky for clean, parseable Git history. |

---

## 📌 Roadmap

- [ ] GraphQL subscriptions for real-time updates
- [ ] PDF/Excel export for reports
- [ ] Multi-warehouse inventory support
- [ ] Audit logging
- [ ] Multi-tenant SaaS architecture
- [ ] Barcode scanner integration
- [ ] Email notifications (invoice, low-stock alerts)

---

## 📄 License

Private — All rights reserved.
