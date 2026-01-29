# Flow-ERP Implementation Plan

A comprehensive implementation plan for the Flow-ERP Mini ERP System with **separate Client and Server architecture**.

---

## 1. Project Overview

**Flow-ERP** is a modern, full-stack Mini ERP application designed to manage core business operations including Inventory, Sales, Purchases, Accounting, Customers, Vendors, and Reporting.

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
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Dashboard home
│   │   │   ├── inventory/
│   │   │   ├── sales/
│   │   │   ├── purchases/
│   │   │   ├── customers/
│   │   │   ├── vendors/
│   │   │   ├── accounts/
│   │   │   └── reports/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── layout/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── inventory/
│   │   ├── sales/
│   │   ├── purchases/
│   │   └── reports/
│   ├── lib/
│   │   ├── apollo-client.ts       # Apollo Client setup
│   │   └── utils.ts
│   ├── hooks/
│   ├── types/
│   ├── public/
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
│   │   │   │   │   ├── user.graphql
│   │   │   │   │   ├── product.graphql
│   │   │   │   │   ├── sale.graphql
│   │   │   │   │   ├── purchase.graphql
│   │   │   │   │   ├── customer.graphql
│   │   │   │   │   ├── vendor.graphql
│   │   │   │   │   ├── account.graphql
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── resolvers/
│   │   │   │   ├── user.resolver.ts
│   │   │   │   ├── product.resolver.ts
│   │   │   │   ├── sale.resolver.ts
│   │   │   │   ├── purchase.resolver.ts
│   │   │   │   ├── customer.resolver.ts
│   │   │   │   ├── vendor.resolver.ts
│   │   │   │   ├── account.resolver.ts
│   │   │   │   ├── dashboard.resolver.ts
│   │   │   │   └── index.ts
│   │   │   └── context.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts            # JWT authentication
│   │   │   └── cors.ts
│   │   ├── lib/
│   │   │   ├── db.ts              # Prisma client
│   │   │   └── auth.ts            # Auth utilities
│   │   └── utils/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   └── implementation_plan.md
├── .env.example
├── .gitignore
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
- [x] Setup Git hooks (Husky + lint-staged)

#### 1.2 Database Setup (PostgreSQL + Prisma)

- [x] Install PostgreSQL locally or setup cloud instance (Neon Cloud)
- [x] Initialize Prisma ORM with PostgreSQL provider
- [x] Configure database connection (Verified with Neon)
- [x] Create initial migrations

#### 1.3 Client/Server Separation

- [ ] Create `/client` folder and move Next.js code
- [ ] Create `/server` folder with Express setup
- [ ] Setup Apollo Server on Express
- [ ] Configure Apollo Client in Next.js frontend
- [ ] Setup CORS for cross-origin API requests

#### 1.4 Storage Setup (Cloudinary)

- [ ] Create Cloudinary account
- [ ] Install Cloudinary SDK in server
- [ ] Configure environment variables
- [ ] Create image upload utility function

---

### Phase 2: Authentication & Authorization

#### 2.1 Authentication System

- [ ] Design User schema (id, email, password, role, etc.)
- [ ] Implement JWT token generation & validation
- [ ] Create login/logout mutations
- [ ] Setup session management
- [ ] Create protected route middleware

#### 2.2 Role-Based Access Control (RBAC)

- [ ] Define roles: Admin, Manager, Staff
- [ ] Create permission matrix
- [ ] Implement resolver-level authorization
- [ ] Create authorization middleware/directives

#### 2.3 Auth UI

- [ ] Create login page
- [ ] Create registration page (Admin only)
- [ ] Implement auth context/provider
- [ ] Protected route components

---

### Phase 3: Core Data Models & GraphQL Schema

#### 3.1 Entity Schemas

```graphql
# User
type User {
  id: ID!
  email: String!
  name: String!
  role: Role!
  createdAt: DateTime!
}

# Product
type Product {
  id: ID!
  name: String!
  sku: String!
  category: Category!
  unit: String!
  costPrice: Float!
  salePrice: Float!
  stock: Int!
  lowStockThreshold: Int!
  createdAt: DateTime!
}

# Customer
type Customer {
  id: ID!
  name: String!
  email: String
  phone: String
  address: String
  balance: Float!
  transactions: [Transaction!]!
}

# Vendor
type Vendor {
  id: ID!
  name: String!
  email: String
  phone: String
  address: String
  balance: Float!
  purchases: [Purchase!]!
}

# Sale
type Sale {
  id: ID!
  invoiceNumber: String!
  customer: Customer
  items: [SaleItem!]!
  subtotal: Float!
  discount: Float!
  total: Float!
  paymentMode: PaymentMode!
  paidAmount: Float!
  dueAmount: Float!
  createdAt: DateTime!
  createdBy: User!
}

# Purchase
type Purchase {
  id: ID!
  vendor: Vendor!
  items: [PurchaseItem!]!
  subtotal: Float!
  total: Float!
  paidAmount: Float!
  dueAmount: Float!
  createdAt: DateTime!
}

# Account
type Account {
  id: ID!
  name: String!
  type: AccountType!
  balance: Float!
  transactions: [Transaction!]!
}

# Transaction
type Transaction {
  id: ID!
  account: Account!
  type: TransactionType!
  amount: Float!
  description: String
  reference: String
  createdAt: DateTime!
}
```

#### 3.2 Database Models (Prisma)

- [x] Create User model
- [x] Create Product model
- [x] Create Category model
- [x] Create Customer model
- [x] Create Vendor model
- [x] Create Sale & SaleItem models
- [x] Create Purchase & PurchaseItem models
- [x] Create Account & Transaction models

---

### Phase 4: Module Implementation

#### 4.1 Dashboard Module

- [ ] Create dashboard layout
- [ ] Implement dashboard stats cards (sales, purchases, profit)
- [ ] Create low-stock alerts widget
- [ ] Implement recent transactions list
- [ ] Create daily/monthly summary cards
- [ ] Design single GraphQL query for dashboard data

**GraphQL Query Example:**

```graphql
query DashboardData($startDate: DateTime!, $endDate: DateTime!) {
  dashboardStats(startDate: $startDate, endDate: $endDate) {
    totalSales
    totalPurchases
    grossProfit
    netProfit
    lowStockProducts {
      id
      name
      stock
      lowStockThreshold
    }
    recentTransactions {
      id
      type
      amount
      description
      createdAt
    }
  }
}
```

---

#### 4.2 Inventory Management Module

- [ ] Product CRUD operations (mutations & queries)
- [ ] Category management
- [ ] Stock in/out functionality
- [ ] Low stock threshold alerts
- [ ] Real-time stock calculation
- [ ] Product search & filtering
- [ ] Inventory valuation report

**UI Components:**

- [ ] Product list table with pagination
- [ ] Product form (create/edit)
- [ ] Category management dialog
- [ ] Stock adjustment modal
- [ ] Low stock alert banner

---

#### 4.3 Sales & POS Module

- [ ] POS interface design
- [ ] Product search/scan for POS
- [ ] Cart management
- [ ] Customer selection
- [ ] Payment processing (cash, due)
- [ ] Invoice generation
- [ ] Automatic stock deduction
- [ ] Sales history & search

**UI Components:**

- [ ] POS layout (product grid + cart)
- [ ] Product search bar
- [ ] Cart component with quantity controls
- [ ] Payment modal
- [ ] Invoice preview/print

---

#### 4.4 Purchase Management Module

- [ ] Vendor CRUD operations
- [ ] Purchase order creation
- [ ] Stock increment on purchase
- [ ] Purchase history & search
- [ ] Vendor payment tracking

**UI Components:**

- [ ] Vendor list & form
- [ ] Purchase order form
- [ ] Purchase history table
- [ ] Vendor payment modal

---

#### 4.5 Customer & Vendor Management Module

- [ ] Customer CRUD operations
- [ ] Vendor CRUD operations
- [ ] Transaction history per entity
- [ ] Outstanding balance tracking
- [ ] Payment collection/recording

**UI Components:**

- [ ] Customer/Vendor list tables
- [ ] Customer/Vendor detail view
- [ ] Transaction history list
- [ ] Payment recording form

---

#### 4.6 Accounting Module

- [ ] Account management (Cash, Capital, Loan)
- [ ] Transaction entries (Income/Expense)
- [ ] Automatic ledger updates from sales/purchases
- [ ] Account balance tracking

**UI Components:**

- [ ] Account dashboard
- [ ] Transaction entry form
- [ ] Ledger view
- [ ] Account statement

---

#### 4.7 Reports & Analytics Module

- [ ] Sales report (daily/monthly/custom range)
- [ ] Purchase report
- [ ] Inventory valuation report
- [ ] Profit & Loss summary
- [ ] Export-ready data structure

**UI Components:**

- [ ] Report filters (date range, category)
- [ ] Sales report charts & tables
- [ ] Purchase report charts & tables
- [ ] P&L summary cards
- [ ] Print/Export buttons (future)

---

## 5. Server Setup Details

### Express + Apollo Server Configuration

The server will be set up with the following structure:

```typescript
// server/src/index.ts
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { createContext } from "./graphql/context";

const app = express();
const PORT = process.env.PORT || 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

app.use(
  "/graphql",
  cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }),
  express.json(),
  expressMiddleware(server, { context: createContext })
);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
});
```

### Server Dependencies

```json
{
  "dependencies": {
    "@apollo/server": "^4.x",
    "@graphql-tools/merge": "^9.x",
    "@prisma/client": "^7.x",
    "bcryptjs": "^2.x",
    "cors": "^2.x",
    "express": "^4.x",
    "graphql": "^16.x",
    "graphql-tag": "^2.x",
    "jsonwebtoken": "^9.x"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.x",
    "@types/cors": "^2.x",
    "@types/express": "^4.x",
    "@types/jsonwebtoken": "^9.x",
    "@types/node": "^20.x",
    "prisma": "^7.x",
    "tsx": "^4.x",
    "typescript": "^5.x"
  }
}
```

---

## 6. Client Setup Details

### Apollo Client Configuration

```typescript
// client/lib/apollo-client.ts
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

## 7. Implementation Timeline

| Phase     | Description                       | Estimated Duration |
| --------- | --------------------------------- | ------------------ |
| Phase 1   | Project Foundation & Setup        | 2-3 days           |
| Phase 2   | Authentication & Authorization    | 2-3 days           |
| Phase 3   | Core Data Models & GraphQL Schema | 2-3 days           |
| Phase 4.1 | Dashboard Module                  | 2-3 days           |
| Phase 4.2 | Inventory Management              | 3-4 days           |
| Phase 4.3 | Sales & POS                       | 4-5 days           |
| Phase 4.4 | Purchase Management               | 2-3 days           |
| Phase 4.5 | Customer & Vendor Management      | 2-3 days           |
| Phase 4.6 | Accounting Module                 | 3-4 days           |
| Phase 4.7 | Reports & Analytics               | 3-4 days           |
| **Total** |                                   | **~26-37 days**    |

---

## 8. Development Guidelines

### 8.1 Code Standards

- Use TypeScript for type safety
- Follow ESLint + Prettier configurations
- Use meaningful variable and function names
- Write comprehensive comments for complex logic
- Create reusable components

### 8.2 GraphQL Best Practices

- Use DataLoader for N+1 query prevention
- Implement proper error handling
- Add pagination for list queries
- Use input types for mutations
- Validate inputs at resolver level

### 8.3 Security Considerations

- Hash passwords using bcrypt
- Validate JWT tokens on each request
- Implement rate limiting
- Sanitize user inputs
- Use HTTPS in production

### 8.4 Testing Strategy

- Unit tests for utility functions
- Integration tests for GraphQL resolvers
- Component tests for UI
- E2E tests for critical flows

---

## 9. API Endpoints Summary

### Queries

| Query             | Description       | Access        |
| ----------------- | ----------------- | ------------- |
| `me`              | Current user info | Authenticated |
| `users`           | List all users    | Admin         |
| `products`        | List products     | Authenticated |
| `categories`      | List categories   | Authenticated |
| `customers`       | List customers    | Authenticated |
| `vendors`         | List vendors      | Authenticated |
| `sales`           | List sales        | Authenticated |
| `purchases`       | List purchases    | Authenticated |
| `accounts`        | List accounts     | Manager+      |
| `dashboardStats`  | Dashboard data    | Authenticated |
| `salesReport`     | Sales report      | Manager+      |
| `purchaseReport`  | Purchase report   | Manager+      |
| `inventoryReport` | Inventory report  | Manager+      |

### Mutations

| Mutation            | Description     | Access   |
| ------------------- | --------------- | -------- |
| `login`             | User login      | Public   |
| `register`          | Create user     | Admin    |
| `createProduct`     | Add product     | Manager+ |
| `updateProduct`     | Edit product    | Manager+ |
| `deleteProduct`     | Remove product  | Admin    |
| `createSale`        | Create sale     | Staff+   |
| `createPurchase`    | Create purchase | Manager+ |
| `createCustomer`    | Add customer    | Staff+   |
| `createVendor`      | Add vendor      | Manager+ |
| `createTransaction` | Add transaction | Manager+ |

---

## 10. Environment Variables

### Server (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/flow_erp

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

## 11. Getting Started

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

---

## 12. Proposed Changes for Refactoring

### Server Folder (`/server`)

| Action | Path                                  | Description                         |
| ------ | ------------------------------------- | ----------------------------------- |
| [NEW]  | server/package.json                   | Server dependencies                 |
| [NEW]  | server/tsconfig.json                  | TypeScript configuration            |
| [NEW]  | server/src/index.ts                   | Express + Apollo Server entry point |
| [NEW]  | server/src/graphql/context.ts         | GraphQL context with Prisma & auth  |
| [NEW]  | server/src/graphql/schema/index.ts    | Merged type definitions             |
| [NEW]  | server/src/graphql/resolvers/index.ts | Merged resolvers                    |
| [MOVE] | server/prisma/                        | Move Prisma config from root        |
| [NEW]  | server/src/lib/db.ts                  | Prisma client singleton             |
| [NEW]  | server/src/middleware/auth.ts         | JWT authentication middleware       |

### Client Folder (`/client`)

| Action | Path                         | Description                    |
| ------ | ---------------------------- | ------------------------------ |
| [MOVE] | client/app/                  | Move from root `/app`          |
| [MOVE] | client/components/           | Move from root `/components`   |
| [MOVE] | client/lib/utils.ts          | Move from root `/lib/utils.ts` |
| [NEW]  | client/lib/apollo-client.ts  | Apollo Client configuration    |
| [MOVE] | client/public/               | Move from root `/public`       |
| [NEW]  | client/package.json          | Client-specific dependencies   |
| [MOVE] | client/next.config.ts        | Move from root                 |
| [MOVE] | client/tsconfig.json         | Move from root                 |
| [MOVE] | client/tailwind config files | Move styling configs           |

### Root Level Changes

| Action   | Path             | Description                                 |
| -------- | ---------------- | ------------------------------------------- |
| [MODIFY] | package.json     | Update to workspace root configuration      |
| [DELETE] | app/api/graphql/ | Remove Next.js API routes (moved to server) |

---

## 13. Verification Plan

### Automated Tests

1. **Server Health Check:**

   ```bash
   cd server && npm run dev
   # Server should start on http://localhost:4000/graphql
   ```

2. **Client Connection Test:**
   ```bash
   cd client && npm run dev
   # Client should start on http://localhost:3000
   # Verify GraphQL connection in browser console
   ```

### Manual Verification

1. Open http://localhost:4000/graphql in browser - Apollo Server playground should load
2. Open http://localhost:3000 - Next.js client should load without errors
3. Check browser console for any GraphQL connection errors

---

## 14. Success Criteria

- [ ] All core modules functional
- [ ] GraphQL API properly secured with RBAC
- [ ] Dashboard aggregates data in single query
- [ ] Stock calculations accurate
- [ ] Accounting entries auto-generated from sales/purchases
- [ ] Reports display accurate data
- [ ] Responsive UI across devices
- [ ] Clean, maintainable codebase
- [ ] **Server runs independently on Express**
- [ ] **Client connects to server via Apollo Client**

---

## 15. Out of Scope (Phase 1)

- Mobile application
- Multi-branch support
- Tax automation
- Third-party payment gateways
- Multi-language support

---

_Document created: January 2026_
_Last updated: January 2026_
