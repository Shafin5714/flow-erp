# Flow-ERP Implementation Plan

A comprehensive implementation plan for the Flow-ERP System with **separate Client and Server architecture**.

---

## 1. Project Overview

**Flow-ERP** is a full-stack ERP system designed to manage core business operations including Inventory, Sales, Purchases, Accounting, Customers, Vendors, and Reporting.

> [!IMPORTANT]
> **Architecture Change**: This project uses a separated client/server architecture with Express + Apollo Server for the backend and Next.js for the frontend. Both run as independent applications and communicate via GraphQL.

---

## 2. Tech Stack Summary

| Layer    | Technology                                                          |
| -------- | ------------------------------------------------------------------- |
| Frontend | Next.js (App Router), React, Tailwind CSS, shadcn/ui, Apollo Client |
| Backend  | Express.js, Apollo Server, GraphQL                                  |
| Database | PostgreSQL with Prisma ORM                                          |
| Storage  | Cloudinary                                                          |
| Auth     | JWT / Session-based Authentication                                  |
| Monorepo | Root-level workspace with `/client` and `/server` directories       |

---

## 3. Project Structure

```
flow-erp/
├── client/                        # Next.js frontend application
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Dashboard home
│   │   │   └── products/
│   │   │       ├── page.tsx       # Product list
│   │   │       ├── new/           # Add product
│   │   │       ├── [id]/edit/     # Edit product
│   │   │       ├── categories/    # Category management
│   │   │       └── brands/        # Brand management
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── dashboard/             # Dashboard widgets
│   │   ├── app-sidebar.tsx
│   │   ├── main-nav.tsx
│   │   ├── protected-route.tsx
│   │   ├── public-route.tsx
│   │   └── date-range-picker.tsx
│   ├── lib/
│   │   ├── apollo-client.tsx      # Apollo Client setup
│   │   ├── auth-context.tsx       # Auth context provider
│   │   ├── graphql/
│   │   │   └── products.ts        # Product GraphQL operations
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── server/                        # Express + GraphQL backend
│   ├── src/
│   │   ├── index.ts               # Express server entry point
│   │   ├── graphql/
│   │   │   ├── schema/
│   │   │   │   ├── typeDefs/
│   │   │   │   │   ├── base.ts
│   │   │   │   │   ├── user.ts
│   │   │   │   │   ├── product.ts
│   │   │   │   │   ├── variant.ts
│   │   │   │   │   ├── category.ts
│   │   │   │   │   ├── brand.ts
│   │   │   │   │   ├── sale.ts
│   │   │   │   │   ├── purchase.ts
│   │   │   │   │   ├── customer.ts
│   │   │   │   │   ├── vendor.ts
│   │   │   │   │   ├── account.ts
│   │   │   │   │   ├── dashboard.ts
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── resolvers/
│   │   │   │   ├── user.resolver.ts
│   │   │   │   ├── product.resolver.ts
│   │   │   │   ├── variant.resolver.ts
│   │   │   │   ├── category.resolver.ts
│   │   │   │   ├── brand.resolver.ts
│   │   │   │   ├── sale.resolver.ts
│   │   │   │   ├── purchase.resolver.ts
│   │   │   │   ├── customer.resolver.ts
│   │   │   │   ├── vendor.resolver.ts
│   │   │   │   ├── account.resolver.ts
│   │   │   │   ├── dashboard.resolver.ts
│   │   │   │   ├── scalars.ts
│   │   │   │   └── index.ts
│   │   │   └── context.ts
│   │   ├── routes/
│   │   │   └── upload.routes.ts   # Cloudinary upload endpoint
│   │   └── lib/
│   │       └── db.ts              # Prisma client singleton
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   └── implementation_plan.md
├── PRD.md
├── .commitlintrc.json
├── .prettierrc
├── .gitignore
├── .husky/
├── eslint.config.mjs
├── package.json                   # Root package.json for workspace scripts
└── README.md
```

---

## 4. Implementation Phases

### Phase 1: Project Foundation & Setup

#### 1.1 Project Initialization

- [x] Initialize Next.js project with App Router
- [x] Configure TypeScript
- [x] Setup Tailwind CSS & shadcn/ui
- [x] Configure ESLint & Prettier
- [x] Setup Git hooks (Husky + commitlint + lint-staged)

#### 1.2 Database Setup (PostgreSQL + Prisma)

- [x] Setup cloud PostgreSQL instance (Neon Cloud)
- [x] Initialize Prisma ORM with PostgreSQL provider
- [x] Configure database connection
- [x] Create initial migrations

#### 1.3 Client/Server Separation

- [x] Create `/client` folder with Next.js frontend
- [x] Create `/server` folder with Express setup
- [x] Setup Apollo Server on Express
- [x] Configure Apollo Client in Next.js frontend (`apollo-client.tsx`)
- [x] Setup CORS for cross-origin API requests
- [x] Create health check endpoint (`/health`)
- [x] Setup file upload REST endpoint (`/api/upload`)

#### 1.4 Storage Setup (Cloudinary)

- [x] Setup Cloudinary integration
- [x] Install Cloudinary SDK in server
- [x] Configure environment variables
- [x] Create image upload route (`upload.routes.ts`)

---

### Phase 2: Authentication & Authorization

#### 2.1 Authentication System

- [x] Design User schema (id, email, password, name, role)
- [x] Implement JWT token generation & validation
- [x] Create login/register mutations (`user.resolver.ts`)
- [x] Setup session management (JWT-based)
- [x] Create GraphQL context with auth (`context.ts`)

#### 2.2 Role-Based Access Control (RBAC)

- [x] Define roles: Admin, Manager, Staff (Prisma enum)
- [x] Implement resolver-level authorization (admin-only register, etc.)
- [ ] Create comprehensive permission matrix
- [ ] Create reusable authorization middleware/directives for all resolvers

#### 2.3 Auth UI

- [x] Create login page (`(auth)/login/page.tsx`)
- [ ] Create registration page (Admin only)
- [x] Implement auth context/provider (`auth-context.tsx`)
- [x] Protected route component (`protected-route.tsx`)
- [x] Public route component (`public-route.tsx`)

---

### Phase 3: Core Data Models & GraphQL Schema

#### 3.1 Database Models (Prisma)

- [x] User model
- [x] Product model (with rich fields: description, SKU, barcode, weight, dimensions, images, tags, etc.)
- [x] ProductVariant model (name, SKU, barcode, pricing, stock)
- [x] Category model (with parent-child tree support)
- [x] Brand model
- [x] Customer model
- [x] Vendor model
- [x] Sale & SaleItem models
- [x] Purchase & PurchaseItem models
- [x] Account & AccountTransaction models

#### 3.2 GraphQL TypeDefs

- [x] Base types (DateTime scalar)
- [x] User typeDefs
- [x] Product typeDefs
- [x] Variant typeDefs
- [x] Category typeDefs
- [x] Brand typeDefs
- [x] Customer typeDefs
- [x] Vendor typeDefs
- [x] Sale typeDefs
- [x] Purchase typeDefs
- [x] Account typeDefs
- [x] Dashboard typeDefs

#### 3.3 GraphQL Resolvers

- [x] User resolver (login, register, me, users)
- [x] Product resolver (CRUD)
- [x] Variant resolver (CRUD)
- [x] Category resolver (CRUD with tree)
- [x] Brand resolver (CRUD)
- [x] Customer resolver (CRUD)
- [x] Vendor resolver (CRUD)
- [x] Sale resolver (CRUD)
- [x] Purchase resolver (CRUD)
- [x] Account resolver (CRUD)
- [x] Dashboard resolver (stats aggregation)
- [x] DateTime scalar resolver

---

### Phase 4: Module Implementation

#### 4.1 Dashboard Module

**Server (Backend):**
- [x] Dashboard resolver with stats aggregation
- [x] Dashboard typeDefs

**Client (Frontend):**
- [x] Dashboard page layout (`(dashboard)/page.tsx`)
- [x] Stats cards component (`dashboard/stats-cards.tsx`)
- [x] Overview chart component (`dashboard/overview.tsx`)
- [x] Recent sales component (`dashboard/recent-sales.tsx`)
- [ ] Low-stock alerts widget
- [ ] Daily/monthly summary cards with date range filtering
- [ ] Connect dashboard to real GraphQL data (wire up stats)

---

#### 4.2 Product / Inventory Management Module ✅

**Server (Backend):**
- [x] Product CRUD resolvers (create, update, delete, list, get by ID)
- [x] ProductVariant CRUD resolvers
- [x] Category management resolvers (with parent-child tree)
- [x] Brand management resolvers
- [x] Product typeDefs (with variants, images, pricing)
- [x] Category typeDefs
- [x] Brand typeDefs
- [x] Variant typeDefs

**Client (Frontend):**
- [x] Product list page with table, search, filtering (`products/page.tsx`)
- [x] Product stats cards (total products, active, low stock)
- [x] Add Product page with multi-tab form (`products/new/page.tsx`)
  - [x] General tab (name, SKU, barcode, category, brand, description with rich text editor)
  - [x] Media tab (main image + supporting images via Cloudinary upload)
  - [x] Pricing tab (cost price, sale price, discount, tax rate)
  - [x] Variants tab (dynamic variant creation with individual SKU/pricing/stock)
  - [x] Shipping tab (weight, dimensions, warranty, expiry)
  - [x] Summary sidebar (live preview of product being created)
- [x] Edit Product page (`products/[id]/edit/page.tsx`)
- [x] Category management page with tree hierarchy (`products/categories/page.tsx`)
- [x] Brand management page (`products/brands/page.tsx`)
- [x] Client-side GraphQL operations (`lib/graphql/products.ts`)
- [ ] Stock adjustment modal (manual stock in/out)
- [ ] Low stock threshold alerts banner
- [ ] Inventory valuation report

---

#### 4.3 Purchase Management Module

**Server (Backend):**
- [x] Purchase resolver (CRUD operations)
- [x] Purchase typeDefs
- [x] Vendor resolver (CRUD operations)
- [x] Vendor typeDefs
- [x] Purchase & PurchaseItem Prisma models
- [x] Vendor Prisma model

**Client (Frontend):**
- [x] Client-side GraphQL operations for purchases (`lib/graphql/purchases.ts`)
- [x] Client-side GraphQL operations for vendors (`lib/graphql/vendors.ts`)
- [ ] Purchase list page (`purchases/page.tsx`)
- [ ] Create purchase order page (`purchases/new/page.tsx`)
- [ ] Edit purchase order page
- [x] Purchase detail/view page
- [x] Vendor list page (`purchases/vendors/page.tsx`)
- [x] Vendor form (create/edit)
- [x] Vendor detail view with purchase history
- [ ] Stock increment on purchase confirmation
- [x] Vendor payment tracking
- [x] Sidebar navigation update for Purchases
- [x] Purchase order PDF/print

---

#### 4.4 Sales & POS Module

**Server (Backend):**
- [x] Sale resolver (CRUD operations)
- [x] Sale typeDefs
- [x] Sale & SaleItem Prisma models

**Client (Frontend):**
- [x] Client-side GraphQL operations for sales (`lib/graphql/sales.ts`)
- [x] Sales list page (`sales/page.tsx`)
- [x] POS interface design & layout
- [x] Product search/scan for POS
- [x] Cart management component
- [x] Customer selection in POS
- [x] Payment processing (cash, due)
- [ ] Invoice generation & preview
- [ ] Invoice print functionality
- [x] Automatic stock deduction on sale
- [x] Sales history with search & filtering
- [ ] Sales return/refund handling
- [x] Sidebar navigation update for Sales

---

#### 4.5 Customer Management Module

**Server (Backend):**
- [x] Customer resolver (CRUD operations)
- [x] Customer typeDefs
- [x] Customer Prisma model

**Client (Frontend):**
- [x] Client-side GraphQL operations for customers (`lib/graphql/customers.ts`)
- [ ] Customer list page (`customers/page.tsx`)
- [ ] Customer form (create/edit)
- [ ] Customer detail view
- [ ] Transaction history per customer
- [ ] Outstanding balance tracking
- [ ] Payment collection/recording
- [ ] Sidebar navigation update for Customers

---

#### 4.6 Accounting Module

**Server (Backend):**
- [x] Account resolver (CRUD operations)
- [x] Account typeDefs
- [x] Account & AccountTransaction Prisma models

**Client (Frontend):**
- [ ] Client-side GraphQL operations for accounts (`lib/graphql/accounts.ts`)
- [ ] Account dashboard page
- [ ] Account list with balances
- [ ] Transaction entry form
- [ ] Ledger view per account
- [ ] Account statement
- [ ] Automatic ledger updates from sales/purchases
- [ ] Income & expense tracking

---

#### 4.7 Reports & Analytics Module

**Server (Backend):**
- [x] Dashboard resolver (basic stats aggregation)
- [ ] Sales report resolver (daily/monthly/custom range)
- [ ] Purchase report resolver
- [ ] Inventory valuation report resolver
- [ ] Profit & Loss summary resolver

**Client (Frontend):**
- [ ] Reports page (`reports/page.tsx`)
- [ ] Report filters (date range, category)
- [ ] Sales report with charts & tables
- [ ] Purchase report with charts & tables
- [ ] Inventory valuation report
- [ ] Profit & Loss summary cards
- [ ] Export to PDF/Excel (future)

---

## 5. Implementation Progress Summary

| Module                  | Server (Backend) | Client (Frontend) | Overall Status      |
| ----------------------- | :--------------: | :---------------: | ------------------- |
| Project Setup           |       ✅         |        ✅         | **Complete**        |
| Authentication          |       ✅         |        🟡         | **Mostly Complete** |
| Data Models & Schema    |       ✅         |        ✅         | **Complete**        |
| Dashboard               |       ✅         |        🟡         | **Partially Done**  |
| Products / Inventory    |       ✅         |        ✅         | **Complete**        |
| Purchase Management     |       ✅         |        ❌         | **Backend Only**    |
| Sales & POS             |       ✅         |        ❌         | **Backend Only**    |
| Customer Management     |       ✅         |        ❌         | **Backend Only**    |
| Accounting              |       ✅         |        ❌         | **Backend Only**    |
| Reports & Analytics     |       🟡         |        ❌         | **Minimal**         |

> **Legend:** ✅ Complete | 🟡 Partially Done | ❌ Not Started

---

## 6. Recommended Next Steps (Priority Order)

1. **Purchase Management (Client)** — Build vendor & purchase order pages. Backend is ready.
2. **Sales & POS (Client)** — Build POS interface & sales pages. Backend is ready.
3. **Customer Management (Client)** — Build customer pages. Backend is ready.
4. **Accounting (Client)** — Build account & transaction pages. Backend is ready.
5. **Dashboard (Wire Up)** — Connect dashboard widgets to real GraphQL data.
6. **Reports & Analytics** — Build report pages and server-side report resolvers.
7. **Auth Enhancements** — Registration page, comprehensive RBAC middleware.

---

## 7. Server Setup Details

### Express + Apollo Server Configuration

```typescript
// server/src/index.ts
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { schema } from "./graphql/schema/index.js";
import { createContext } from "./graphql/context.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();
const PORT = process.env.PORT || 4000;

const server = new ApolloServer({ schema, introspection: true });
await server.start();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use("/api/upload", uploadRoutes);
app.use("/graphql", expressMiddleware(server, { context: createContext }));

app.listen(PORT);
```

---

## 8. Client Setup Details

### Apollo Client Configuration

```typescript
// client/lib/apollo-client.tsx
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

---

## 9. Implementation Timeline

| Phase     | Description                       | Estimated Duration | Status          |
| --------- | --------------------------------- | ------------------ | --------------- |
| Phase 1   | Project Foundation & Setup        | 2-3 days           | ✅ Complete     |
| Phase 2   | Authentication & Authorization    | 2-3 days           | 🟡 Mostly Done |
| Phase 3   | Core Data Models & GraphQL Schema | 2-3 days           | ✅ Complete     |
| Phase 4.1 | Dashboard Module                  | 2-3 days           | 🟡 Partial     |
| Phase 4.2 | Product / Inventory Management    | 3-4 days           | ✅ Complete     |
| Phase 4.3 | Purchase Management               | 2-3 days           | ⏳ Next Up     |
| Phase 4.4 | Sales & POS                       | 4-5 days           | ⏳ Pending     |
| Phase 4.5 | Customer Management               | 2-3 days           | ⏳ Pending     |
| Phase 4.6 | Accounting Module                 | 3-4 days           | ⏳ Pending     |
| Phase 4.7 | Reports & Analytics               | 3-4 days           | ⏳ Pending     |
| **Total** |                                   | **~26-37 days**    |                 |

---

## 10. Development Guidelines

### 10.1 Code Standards

- Use TypeScript for type safety
- Follow ESLint + Prettier configurations
- Use meaningful variable and function names
- Write comprehensive comments for complex logic
- Create reusable components

### 10.2 GraphQL Best Practices

- Use DataLoader for N+1 query prevention
- Implement proper error handling
- Add pagination for list queries
- Use input types for mutations
- Validate inputs at resolver level

### 10.3 Security Considerations

- Hash passwords using bcrypt
- Validate JWT tokens on each request
- Implement rate limiting
- Sanitize user inputs
- Use HTTPS in production

### 10.4 Testing Strategy

- Unit tests for utility functions
- Integration tests for GraphQL resolvers
- Component tests for UI
- E2E tests for critical flows

---

## 11. API Endpoints Summary

### Queries

| Query             | Description       | Access        | Status |
| ----------------- | ----------------- | ------------- | ------ |
| `me`              | Current user info | Authenticated | ✅     |
| `users`           | List all users    | Admin         | ✅     |
| `products`        | List products     | Authenticated | ✅     |
| `product`         | Get product by ID | Authenticated | ✅     |
| `categories`      | List categories   | Authenticated | ✅     |
| `brands`          | List brands       | Authenticated | ✅     |
| `customers`       | List customers    | Authenticated | ✅     |
| `vendors`         | List vendors      | Authenticated | ✅     |
| `sales`           | List sales        | Authenticated | ✅     |
| `purchases`       | List purchases    | Authenticated | ✅     |
| `accounts`        | List accounts     | Manager+      | ✅     |
| `dashboardStats`  | Dashboard data    | Authenticated | ✅     |
| `salesReport`     | Sales report      | Manager+      | ❌     |
| `purchaseReport`  | Purchase report   | Manager+      | ❌     |
| `inventoryReport` | Inventory report  | Manager+      | ❌     |

### Mutations

| Mutation            | Description     | Access   | Status |
| ------------------- | --------------- | -------- | ------ |
| `login`             | User login      | Public   | ✅     |
| `register`          | Create user     | Admin    | ✅     |
| `createProduct`     | Add product     | Manager+ | ✅     |
| `updateProduct`     | Edit product    | Manager+ | ✅     |
| `deleteProduct`     | Remove product  | Admin    | ✅     |
| `createCategory`    | Add category    | Manager+ | ✅     |
| `createBrand`       | Add brand       | Manager+ | ✅     |
| `createSale`        | Create sale     | Staff+   | ✅     |
| `createPurchase`    | Create purchase | Manager+ | ✅     |
| `createCustomer`    | Add customer    | Staff+   | ✅     |
| `createVendor`      | Add vendor      | Manager+ | ✅     |
| `createTransaction` | Add transaction | Manager+ | ✅     |

### REST Endpoints

| Method | Path          | Description              | Status |
| ------ | ------------- | ------------------------ | ------ |
| POST   | /api/upload   | Upload image to Cloudinary | ✅   |
| GET    | /health       | Server health check      | ✅     |

---

## 12. Environment Variables

### Server (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/flow_erp

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Server Config
PORT=4000
CLIENT_URL=http://localhost:3000
NODE_ENV=development

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Client (.env.local)

```env
# GraphQL Server
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 13. Getting Started

### Step 1: Setup Server

```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Step 2: Setup Client

```bash
cd client
npm install
npm run dev
```

### Step 3: Access Applications

- **Client:** http://localhost:3000
- **Server GraphQL Playground:** http://localhost:4000/graphql
- **Server Health Check:** http://localhost:4000/health

---

## 14. Success Criteria

- [x] Server runs independently on Express
- [x] Client connects to server via Apollo Client
- [x] Product module fully functional (CRUD + variants + categories + brands)
- [x] Authentication system working (login, JWT, protected routes)
- [x] File upload to Cloudinary working
- [ ] All core modules' frontend built & functional
- [ ] GraphQL API properly secured with comprehensive RBAC
- [ ] Dashboard aggregates real data via GraphQL
- [ ] Stock calculations accurate across sales/purchases
- [ ] Accounting entries auto-generated from sales/purchases
- [ ] Reports display accurate data
- [ ] Responsive UI across devices

---

## 15. Out of Scope (Phase 1)

- Mobile application
- Multi-branch support
- Tax automation
- Third-party payment gateways
- Multi-language support

---

_Document created: January 2026_
_Last updated: March 2026_
