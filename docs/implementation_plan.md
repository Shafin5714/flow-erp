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
- [x] Low-stock alerts widget
- [x] Daily/monthly summary cards with date range filtering
- [x] Connect dashboard to real GraphQL data (wire up stats)

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
- [x] Purchase list page (`purchases/page.tsx`)
- [x] Create purchase order page (`purchases/new/page.tsx`)
- [x] Edit purchase order page
- [x] Purchase detail/view page
- [x] Vendor list page (`purchases/vendors/page.tsx`)
- [x] Vendor form (create/edit)
- [x] Vendor detail view with purchase history
- [x] Stock increment on purchase confirmation
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
- [x] Invoice generation & preview
- [x] Invoice print functionality
- [x] Automatic stock deduction on sale
- [x] Sales history with search & filtering
- [x] Sales return/refund handling
- [x] Sidebar navigation update for Sales

---

#### 4.5 Customer Management Module

**Server (Backend):**
- [x] Customer resolver (CRUD operations)
- [x] Customer typeDefs
- [x] Customer Prisma model

**Client (Frontend):**
- [x] Client-side GraphQL operations for customers (`lib/graphql/customers.ts`)
- [x] Customer list page (`customers/page.tsx`)
- [x] Customer form (create/edit)
- [x] Customer detail view
- [x] Transaction history per customer
- [x] Outstanding balance tracking
- [x] Payment collection/recording
- [x] Sidebar navigation update for Customers

---

#### 4.6 Accounting Module

**Server (Backend):**
- [x] Account resolver (CRUD operations)
- [x] Account typeDefs
- [x] Account & AccountTransaction Prisma models

**Client (Frontend):**
- [x] Client-side GraphQL operations for accounts (`lib/graphql/accounts.ts`)
- [x] Account dashboard page
- [x] Account list with balances
- [x] Transaction entry form
- [x] Ledger view per account
- [x] Account statement
- [x] Automatic ledger updates from sales/purchases
- [x] Income & expense tracking

---

#### 4.7 Reports & Analytics Module

> [!IMPORTANT]
> The Reports module is a **read-only analytics layer** that aggregates data from existing Sales, Purchases, Products, Accounts, Customers, and Vendors tables. **No new Prisma models or migrations are needed** — all data is derived from existing tables using aggregation queries.

---

##### 4.7.1 Report Types Overview

| # | Report Name | Key Metrics | Data Sources |
|---|-------------|-------------|--------------|
| 1 | **Sales Report** | Revenue, item quantities, top products, payment breakdown, daily/monthly trends | `Sale`, `SaleItem`, `Product`, `Customer` |
| 2 | **Purchase Report** | Spend totals, vendor breakdown, item quantities, payment status | `Purchase`, `PurchaseItem`, `Product`, `Vendor` |
| 3 | **Inventory Valuation** | Stock on hand, cost value, retail value, potential profit, low-stock items | `Product`, `ProductVariant` |
| 4 | **Profit & Loss** | Total income, COGS, gross profit, expenses, net profit | `Sale`, `SaleItem`, `Purchase`, `AccountTransaction` |
| 5 | **Customer & Vendor Ledger** | Outstanding balances, transaction history, top customers/vendors | `Customer`, `Vendor`, `Sale`, `Purchase` |

---

##### 4.7.2 Server (Backend) — GraphQL Schema

###### New file: `server/src/graphql/schema/typeDefs/report.ts`

```graphql
# ── Common ──────────────────────────────────────────────
input ReportFilterInput {
  startDate: DateTime!
  endDate: DateTime!
  categoryId: String        # optional filter
  brandId: String            # optional filter
  customerId: String         # optional filter (sales)
  vendorId: String           # optional filter (purchases)
}

type DailyDataPoint {
  date: String!              # "2026-03-15"
  total: Float!
  count: Int!
}

# ── 1. Sales Report ────────────────────────────────────
type TopSellingProduct {
  productId: String!
  productName: String!
  sku: String!
  quantitySold: Int!
  revenue: Float!
}

type PaymentBreakdown {
  cash: Float!
  due: Float!
  cashCount: Int!
  dueCount: Int!
}

type SalesReport {
  totalRevenue: Float!
  totalSalesCount: Int!
  totalItemsSold: Int!
  averageOrderValue: Float!
  totalDiscount: Float!
  totalRefunds: Float!
  refundCount: Int!
  netRevenue: Float!                    # totalRevenue - totalRefunds
  paymentBreakdown: PaymentBreakdown!
  dailyTrend: [DailyDataPoint!]!       # chart data
  topProducts: [TopSellingProduct!]!    # top 10
  salesByCategory: [CategoryStat!]!
}

type CategoryStat {
  categoryId: String!
  categoryName: String!
  revenue: Float!
  quantity: Int!
}

# ── 2. Purchase Report ─────────────────────────────────
type TopPurchasedProduct {
  productId: String!
  productName: String!
  sku: String!
  quantityPurchased: Int!
  totalSpend: Float!
}

type VendorStat {
  vendorId: String!
  vendorName: String!
  totalSpend: Float!
  purchaseCount: Int!
  dueAmount: Float!
}

type PurchaseReport {
  totalSpend: Float!
  totalPurchaseCount: Int!
  totalItemsPurchased: Int!
  averagePurchaseValue: Float!
  totalPaid: Float!
  totalDue: Float!
  dailyTrend: [DailyDataPoint!]!
  topProducts: [TopPurchasedProduct!]!
  vendorBreakdown: [VendorStat!]!
}

# ── 3. Inventory Valuation ────────────────────────────
type InventoryItem {
  productId: String!
  productName: String!
  sku: String!
  category: String!
  stock: Int!
  costPrice: Float!
  salePrice: Float!
  costValue: Float!                     # stock × costPrice
  retailValue: Float!                   # stock × salePrice
  potentialProfit: Float!               # retailValue - costValue
  isLowStock: Boolean!
}

type InventoryReport {
  totalProducts: Int!
  totalStock: Int!
  totalCostValue: Float!
  totalRetailValue: Float!
  totalPotentialProfit: Float!
  lowStockCount: Int!
  outOfStockCount: Int!
  items: [InventoryItem!]!             # paginated / all
  categoryBreakdown: [CategoryInventoryStat!]!
}

type CategoryInventoryStat {
  categoryId: String!
  categoryName: String!
  productCount: Int!
  totalStock: Int!
  totalCostValue: Float!
  totalRetailValue: Float!
}

# ── 4. Profit & Loss ──────────────────────────────────
type ProfitLossReport {
  totalIncome: Float!                   # sum of sale totals
  costOfGoodsSold: Float!               # sum of (saleItem.qty × product.costPrice)
  grossProfit: Float!                   # income - COGS
  grossMarginPercent: Float!            # (grossProfit / income) × 100
  totalExpenses: Float!                 # sum of EXPENSE transactions
  netProfit: Float!                     # grossProfit - totalExpenses
  netMarginPercent: Float!              # (netProfit / income) × 100
  monthlyBreakdown: [MonthlyPL!]!
}

type MonthlyPL {
  month: String!                        # "Jan", "Feb", ...
  income: Float!
  cogs: Float!
  expenses: Float!
  netProfit: Float!
}

# ── 5. Customer & Vendor Ledger ───────────────────────
type CustomerLedgerEntry {
  customerId: String!
  customerName: String!
  phone: String
  totalPurchases: Float!                # total they've bought
  totalPaid: Float!
  outstandingBalance: Float!
  saleCount: Int!
  lastPurchaseDate: DateTime
}

type VendorLedgerEntry {
  vendorId: String!
  vendorName: String!
  phone: String
  totalPurchases: Float!                # total we bought from them
  totalPaid: Float!
  outstandingBalance: Float!
  purchaseCount: Int!
  lastPurchaseDate: DateTime
}

type LedgerReport {
  customers: [CustomerLedgerEntry!]!
  totalCustomerOutstanding: Float!
  vendors: [VendorLedgerEntry!]!
  totalVendorOutstanding: Float!
}

# ── Queries ────────────────────────────────────────────
extend type Query {
  salesReport(filter: ReportFilterInput!): SalesReport!
  purchaseReport(filter: ReportFilterInput!): PurchaseReport!
  inventoryReport(categoryId: String, brandId: String): InventoryReport!
  profitLossReport(startDate: DateTime!, endDate: DateTime!): ProfitLossReport!
  ledgerReport: LedgerReport!
}
```

**Server tasks:**
- [x] Dashboard resolver (basic stats aggregation)
- [ ] Create `report.ts` typeDefs file with the schema above
- [ ] Register `reportTypeDefs` in `typeDefs/index.ts` and `schema/index.ts`
- [ ] Create `report.resolver.ts` with the following query resolvers:
  - [ ] `salesReport` — aggregate `Sale`, `SaleItem`, join `Product`/`Category`
  - [ ] `purchaseReport` — aggregate `Purchase`, `PurchaseItem`, join `Vendor`
  - [ ] `inventoryReport` — query all `Product`s, compute valuation, group by category
  - [ ] `profitLossReport` — combine sales COGS calculation + expense transactions
  - [ ] `ledgerReport` — aggregate per-customer/vendor outstanding balances
- [ ] Register `reportResolvers` in `resolvers/index.ts` and `schema/index.ts`
- [ ] Add `Manager+` authorization checks on all report queries

---

##### 4.7.3 Server — Resolver Implementation Notes

**`salesReport` resolver logic:**
1. Filter `Sale` by date range (and optionally by `customerId` via `SaleItem → Product → categoryId`)
2. Aggregate: `_sum.total`, `_count`, `_sum.discount`
3. Count refunded sales separately (`isRefunded: true`)
4. For payment breakdown: `groupBy paymentMode`
5. For daily trend: raw SQL `GROUP BY DATE(createdAt)` or loop by day
6. For top products: `groupBy` on `SaleItem.productId`, sum `quantity` and `total`
7. For category breakdown: join `SaleItem → Product → Category`, group by `categoryId`

**`purchaseReport` resolver logic:**
1. Filter `Purchase` by date range (and optionally by `vendorId`)
2. Aggregate totals, paid, due
3. For daily trend: group by date
4. For top products: `groupBy` on `PurchaseItem.productId`
5. For vendor breakdown: `groupBy` on `Purchase.vendorId`

**`inventoryReport` resolver logic:**
1. Query all `Product` with `category` relation included
2. Compute `costValue = stock × costPrice`, `retailValue = stock × salePrice`
3. Mark `isLowStock = stock <= lowStockThreshold`
4. Group by `categoryId` for category breakdown
5. No date filter needed (inventory is point-in-time)

**`profitLossReport` resolver logic:**
1. Sum `Sale.total` as income (exclude refunded)
2. Compute COGS: `SaleItem.quantity × Product.costPrice`
3. Sum `AccountTransaction` where `type = EXPENSE` as total expenses
4. Calculate margins and monthly breakdown (loop 12 months or filter range)

**`ledgerReport` resolver logic:**
1. Query all `Customer`s with balance > 0 or all customers
2. For each: count sales, sum totals, sum paid, compute outstanding
3. Same for `Vendor`s with purchases
4. Can use `prisma.customer.findMany({ include: { sales: true } })` and compute

---

##### 4.7.4 Client (Frontend) — File Structure

```
client/app/(dashboard)/reports/
├── page.tsx                       # Reports landing page (overview cards + nav)
├── sales/
│   └── page.tsx                   # Sales Report page
├── purchases/
│   └── page.tsx                   # Purchase Report page
├── inventory/
│   └── page.tsx                   # Inventory Valuation page
├── profit-loss/
│   └── page.tsx                   # Profit & Loss page
└── ledger/
    └── page.tsx                   # Customer & Vendor Ledger page

client/components/reports/
├── report-filters.tsx             # Shared date range + category/brand filter bar
├── report-stat-card.tsx           # Reusable stat card (icon, label, value, trend)
├── sales-chart.tsx                # Sales trend line/bar chart (Recharts)
├── purchase-chart.tsx             # Purchase trend chart
├── top-products-table.tsx         # Top products data table
├── category-breakdown-chart.tsx   # Pie/donut chart for category distribution
├── vendor-breakdown-table.tsx     # Vendor spend breakdown table
├── inventory-table.tsx            # Inventory valuation data table
├── pl-summary-cards.tsx           # P&L summary stat cards
├── monthly-pl-chart.tsx           # Monthly P&L bar chart
├── customer-ledger-table.tsx      # Customer outstanding balances table
└── vendor-ledger-table.tsx        # Vendor outstanding balances table

client/lib/graphql/reports.ts      # All report GraphQL query definitions
```

---

##### 4.7.5 Client — GraphQL Operations (`lib/graphql/reports.ts`)

```typescript
// Queries to implement:
GET_SALES_REPORT         // salesReport(filter: ReportFilterInput!)
GET_PURCHASE_REPORT      // purchaseReport(filter: ReportFilterInput!)
GET_INVENTORY_REPORT     // inventoryReport(categoryId?, brandId?)
GET_PROFIT_LOSS_REPORT   // profitLossReport(startDate, endDate)
GET_LEDGER_REPORT        // ledgerReport
```

---

##### 4.7.6 Client — Page Designs

**Reports Landing Page (`/reports`):**
- Summary cards: Total Revenue, Total Purchases, Gross Profit, Outstanding Dues
- Quick navigation tiles to each sub-report (Sales, Purchases, Inventory, P&L, Ledger)
- Uses data from `dashboardStats` query for quick overview

**Sales Report (`/reports/sales`):**
- Filter bar: Date range picker, category dropdown, customer search
- Stat cards row: Total Revenue, Sales Count, Avg Order Value, Refunds
- Line/bar chart: Daily sales trend
- Pie chart: Sales by payment mode (Cash vs Due)
- Data table: Top 10 selling products (product name, qty sold, revenue)
- Donut chart: Sales by category

**Purchase Report (`/reports/purchases`):**
- Filter bar: Date range picker, vendor selector
- Stat cards row: Total Spend, Purchase Count, Total Paid, Total Due
- Line/bar chart: Daily purchase trend
- Data table: Top 10 purchased products
- Data table: Vendor breakdown (vendor name, spend, count, due)

**Inventory Valuation (`/reports/inventory`):**
- Filter bar: Category dropdown, brand dropdown (no date filter needed)
- Stat cards row: Total Products, Total Stock, Cost Value, Retail Value, Potential Profit
- Alert badges: Low Stock count, Out of Stock count
- Full data table: All products with stock, cost price, sale price, values (sortable, searchable)
- Donut chart: Stock value by category

**Profit & Loss (`/reports/profit-loss`):**
- Filter bar: Date range picker
- Large summary cards: Income, COGS, Gross Profit (margin%), Expenses, Net Profit (margin%)
- Stacked bar chart: Monthly income vs COGS vs expenses
- Table: Monthly breakdown (month, income, COGS, expenses, net profit)

**Customer & Vendor Ledger (`/reports/ledger`):**
- Tabs: Customers | Vendors
- Stat cards: Total Outstanding (Customers), Total Outstanding (Vendors)
- **Customer tab**: Data table with name, phone, total purchases, paid, outstanding, last purchase date
- **Vendor tab**: Data table with name, phone, total purchases, paid, outstanding, last purchase date
- Sort by outstanding balance (descending)

---

##### 4.7.7 Sidebar Navigation Update

Update `app-sidebar.tsx` to expand the "Reports" nav item with sub-routes:

```typescript
{
  title: "Reports",
  icon: FileText,
  items: [
    { title: "Overview", href: "/reports" },
    { title: "Sales Report", href: "/reports/sales" },
    { title: "Purchase Report", href: "/reports/purchases" },
    { title: "Inventory", href: "/reports/inventory" },
    { title: "Profit & Loss", href: "/reports/profit-loss" },
    { title: "Ledger", href: "/reports/ledger" },
  ],
}
```

---

##### 4.7.8 Charts Library

Use **Recharts** (already compatible with React/Next.js):
- `npm install recharts` (in client)
- Components: `LineChart`, `BarChart`, `PieChart`, `ResponsiveContainer`
- shadcn/ui chart components can also be leveraged if available

---

##### 4.7.9 PDF / Excel Export (Future Enhancement)

- **PDF Export**: Use `@react-pdf/renderer` (already in the project for invoices) to generate report PDFs
- **Excel Export**: Use `xlsx` or `exceljs` library for `.xlsx` downloads
- Each report page will include a "Download PDF" and "Export Excel" button in the filter bar
- This is a **Phase 2** enhancement, not required for initial implementation

---

##### 4.7.10 Implementation Checklist

**Server (Backend):**
- [x] Dashboard resolver (basic stats aggregation)
- [ ] Create `report.ts` typeDefs file
- [ ] Register report typeDefs in `typeDefs/index.ts`
- [ ] Create `report.resolver.ts`
- [ ] Implement `salesReport` query resolver
- [ ] Implement `purchaseReport` query resolver
- [ ] Implement `inventoryReport` query resolver
- [ ] Implement `profitLossReport` query resolver
- [ ] Implement `ledgerReport` query resolver
- [ ] Register report resolvers in `resolvers/index.ts`
- [ ] Wire up in `schema/index.ts`
- [ ] Add authorization guards (Manager+)

**Client (Frontend):**
- [ ] Install Recharts (`npm install recharts`)
- [ ] Create `lib/graphql/reports.ts` with all query definitions
- [ ] Create shared `components/reports/report-filters.tsx`
- [ ] Create shared `components/reports/report-stat-card.tsx`
- [ ] Build Reports landing page (`reports/page.tsx`)
- [ ] Build Sales Report page (`reports/sales/page.tsx`)
  - [ ] Sales trend chart component
  - [ ] Top selling products table
  - [ ] Category breakdown chart
- [ ] Build Purchase Report page (`reports/purchases/page.tsx`)
  - [ ] Purchase trend chart component
  - [ ] Vendor breakdown table
- [ ] Build Inventory Report page (`reports/inventory/page.tsx`)
  - [ ] Inventory valuation table
  - [ ] Category inventory chart
- [ ] Build Profit & Loss page (`reports/profit-loss/page.tsx`)
  - [ ] P&L summary cards
  - [ ] Monthly P&L chart
- [ ] Build Ledger page (`reports/ledger/page.tsx`)
  - [ ] Customer ledger table
  - [ ] Vendor ledger table
- [ ] Update sidebar navigation with sub-routes
- [ ] Responsive design for all report pages
- [ ] Dark mode support for all charts and components

---

##### 4.7.11 Build Order (Recommended Sequence)

1. **Backend first**: `report.ts` typeDefs → `report.resolver.ts` → register in schema
2. **Shared components**: `report-filters.tsx`, `report-stat-card.tsx`
3. **Reports landing page**: `/reports` with overview cards
4. **Sales Report**: Most impactful — implement first with charts
5. **Purchase Report**: Similar structure to sales
6. **Inventory Valuation**: Point-in-time, no date filter
7. **Profit & Loss**: Combines sales + expense data
8. **Ledger**: Customer/vendor outstanding balances
9. **Sidebar update**: Add sub-route navigation
10. **Polish**: Dark mode, responsive, loading states, error handling

---

## 5. Implementation Progress Summary

| Module                  | Server (Backend) | Client (Frontend) | Overall Status      |
| ----------------------- | :--------------: | :---------------: | ------------------- |
| Project Setup           |       ✅         |        ✅         | **Complete**        |
| Authentication          |       ✅         |        🟡         | **Mostly Complete** |
| Data Models & Schema    |       ✅         |        ✅         | **Complete**        |
| Dashboard               |       ✅         |        ✅         | **Complete**        |
| Products / Inventory    |       ✅         |        ✅         | **Complete**        |
| Purchase Management     |       ✅         |        ✅         | **Complete**        |
| Sales & POS             |       ✅         |        ✅         | **Complete**        |
| Customer Management     |       ✅         |        ✅         | **Complete**        |
| Accounting              |       ✅         |        ✅         | **Complete**        |
| Reports & Analytics     |       🟡         |        ❌         | **Minimal**         |

> **Legend:** ✅ Complete | 🟡 Partially Done | ❌ Not Started

---

## 6. Recommended Next Steps (Priority Order)

1. **Purchase Management (Client)** — Completed!
2. **Sales & POS (Client)** — Build POS interface & sales pages. Backend is ready.
3. **Customer Management (Client)** — Completed!
4. **Accounting (Client)** — Completed!
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
| Phase 4.1 | Dashboard Module                  | 2-3 days           | ✅ Complete     |
| Phase 4.2 | Product / Inventory Management    | 3-4 days           | ✅ Complete     |
| Phase 4.3 | Purchase Management               | 2-3 days           | ✅ Complete     |
| Phase 4.4 | Sales & POS                       | 4-5 days           | ✅ Complete     |
| Phase 4.5 | Customer Management               | 2-3 days           | ✅ Complete     |
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
- [x] Dashboard aggregates real data via GraphQL
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
