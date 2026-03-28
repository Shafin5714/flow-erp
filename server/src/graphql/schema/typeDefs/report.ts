import { gql } from "graphql-tag";

export const reportTypeDefs = gql`
  # ── Common ──────────────────────────────────────────────
  input ReportFilterInput {
    startDate: DateTime!
    endDate: DateTime!
    categoryId: String # optional filter
    brandId: String # optional filter
    customerId: String # optional filter (sales)
    vendorId: String # optional filter (purchases)
  }

  type DailyDataPoint {
    date: String! # "2026-03-15"
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
    netRevenue: Float! # totalRevenue - totalRefunds
    paymentBreakdown: PaymentBreakdown!
    dailyTrend: [DailyDataPoint!]! # chart data
    topProducts: [TopSellingProduct!]! # top 10
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
    costValue: Float! # stock × costPrice
    retailValue: Float! # stock × salePrice
    potentialProfit: Float! # retailValue - costValue
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
    items: [InventoryItem!]! # paginated / all
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
    totalIncome: Float! # sum of sale totals
    costOfGoodsSold: Float! # sum of (saleItem.qty × product.costPrice)
    grossProfit: Float! # income - COGS
    grossMarginPercent: Float! # (grossProfit / income) × 100
    totalExpenses: Float! # sum of EXPENSE transactions
    netProfit: Float! # grossProfit - totalExpenses
    netMarginPercent: Float! # (netProfit / income) × 100
    monthlyBreakdown: [MonthlyPL!]!
  }

  type MonthlyPL {
    month: String! # "Jan", "Feb", ...
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
    totalPurchases: Float! # total they've bought
    totalPaid: Float!
    outstandingBalance: Float!
    saleCount: Int!
    lastPurchaseDate: DateTime
  }

  type VendorLedgerEntry {
    vendorId: String!
    vendorName: String!
    phone: String
    totalPurchases: Float! # total we bought from them
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
`;
