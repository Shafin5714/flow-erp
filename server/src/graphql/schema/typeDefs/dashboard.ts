import { gql } from "graphql-tag";

export const dashboardTypeDefs = gql`
  type MonthlyStat {
    month: String!
    sales: Float!
    purchases: Float!
  }

  type DashboardStats {
    totalSales: Float!
    totalPurchases: Float!
    grossProfit: Float!
    netProfit: Float!
    todaySales: Float!
    todayPurchases: Float!
    salesCount: Int!
    pendingOrders: Int!
    lowStockProducts: [Product!]!
    recentTransactions: [Transaction!]!
    recentSales: [Sale!]!
    monthlyStats: [MonthlyStat!]!
    totalCustomers: Int!
    totalVendors: Int!
    totalProducts: Int!
  }

  extend type Query {
    dashboardStats(startDate: DateTime!, endDate: DateTime!): DashboardStats!
  }
`;
