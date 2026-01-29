import gql from "graphql-tag";

export const dashboardTypeDefs = gql`
  type DashboardStats {
    totalSales: Float!
    totalPurchases: Float!
    grossProfit: Float!
    netProfit: Float!
    lowStockProducts: [Product!]!
    recentTransactions: [Transaction!]!
    totalCustomers: Int!
    totalVendors: Int!
    totalProducts: Int!
  }

  extend type Query {
    dashboardStats(startDate: DateTime!, endDate: DateTime!): DashboardStats!
  }
`;
