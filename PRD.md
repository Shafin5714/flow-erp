# Flow-ERP

**Mini ERP System using Next.js & GraphQL**

---

## 1. Product Overview

**Flow-ERP** is a modern, web-based **Mini ERP system** designed for small and medium-sized businesses to manage daily operations efficiently.
The system focuses on **Inventory, Sales, Purchases, Accounting, Customers, Vendors, and Reporting**, using **GraphQL** for efficient data fetching and **Next.js** for a scalable full-stack architecture.

Flow-ERP aims to demonstrate real-world ERP workflows, clean architecture, and scalable API design suitable for production-level applications.

---

## 2. Goals & Objectives

### Primary Goals

- Build a **realistic ERP system** using modern technologies
- Demonstrate **GraphQL schema design & resolvers**
- Provide a **clean, role-based dashboard experience**
- Reduce over-fetching and improve performance using GraphQL

### Success Metrics

- Single GraphQL query powering complex dashboard views
- Role-based access enforced across modules
- Accurate inventory stock & accounting calculations
- Clean separation of UI, API, and business logic

---

## 3. Target Users

| Role    | Description                                |
| ------- | ------------------------------------------ |
| Admin   | Full system access, user & role management |
| Manager | Inventory, sales, purchases, reports       |
| Staff   | POS, sales entry, customer handling        |

---

## 4. Tech Stack

### Frontend

- **Next.js (App Router)**
- React
- Tailwind CSS + shadcn/ui
- Apollo Client

### Backend (inside Next.js)

- **GraphQL API (Apollo Server / GraphQL Yoga)**
- Next.js API Routes / Route Handlers
- Authentication (JWT / session-based)

### Database

- MongoDB or PostgreSQL
- Prisma / Mongoose

---

## 5. Core Modules & Features

---

### 5.1 Authentication & Authorization

- User login & logout
- Role-based access control (RBAC)
- Protected routes
- Permission-based GraphQL resolvers

---

### 5.2 Dashboard

- Total sales, purchases, profit
- Low-stock alerts
- Recent transactions
- Daily / monthly summary cards

GraphQL will aggregate multiple datasets in **one query**.

---

### 5.3 Inventory Management

- Product CRUD
- Stock in / stock out
- Category & unit management
- Low stock threshold alerts
- Real-time stock calculation

---

### 5.4 Sales & POS

- POS-style sales entry
- Invoice generation
- Customer selection
- Payment modes (cash, due)
- Automatic stock deduction

---

### 5.5 Purchase Management

- Vendor management
- Purchase orders
- Stock increment on purchase
- Purchase history & reports

---

### 5.6 Customer & Vendor Management

- Customer CRUD
- Vendor CRUD
- Transaction history per entity
- Outstanding balance tracking

---

### 5.7 Accounting Module

- Cash account
- Capital tracking
- Loan tracking
- Income & expense entries
- Automatic ledger updates from sales & purchases

---

### 5.8 Reports & Analytics

- Sales report (daily / monthly)
- Purchase report
- Inventory valuation
- Profit & loss summary
- Export-ready data structure (future)

---

## 6. GraphQL API Design

### Key Principles

- Strongly typed schema
- Modular resolvers per domain
- Pagination & filtering support
- Aggregation queries for reports

### Example Entities

- User
- Product
- Sale
- Purchase
- Customer
- Vendor
- Account
- Transaction

---

## 7. Non-Functional Requirements

- Secure authentication
- Optimized GraphQL queries
- Scalable schema design
- Clean UI & UX
- Responsive layout
- Error handling & loading states

---

## 8. Out of Scope (Phase 1)

- Mobile app
- Multi-branch support
- Tax automation
- Third-party payment gateways

---

## 9. Future Enhancements

- GraphQL subscriptions (real-time updates)
- Export to PDF / Excel
- Multi-warehouse inventory
- Audit logs
- Multi-tenant SaaS support

---

## 10. Risks & Considerations

- Over-fetching avoided via GraphQL selection sets
- Proper resolver-level authorization required
- Accounting logic must be carefully validated

---

## 11. Summary

Flow-ERP is a **portfolio-grade Mini ERP system** showcasing:

- Real-world business logic
- GraphQL-first API design
- Modern Next.js full-stack architecture
- Scalable and maintainable codebase

The project is designed to be **extendable, realistic, and production-inspired**.
