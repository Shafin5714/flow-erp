import { gql } from "@apollo/client";

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats($startDate: DateTime!, $endDate: DateTime!) {
    dashboardStats(startDate: $startDate, endDate: $endDate) {
      totalSales
      totalPurchases
      grossProfit
      netProfit
      todaySales
      todayPurchases
      salesCount
      pendingOrders
      totalCustomers
      totalVendors
      totalProducts
      lowStockProducts {
        id
        name
        sku
        stock
        lowStockThreshold
        mainImage
      }
      recentSales {
        id
        invoiceNumber
        total
        paymentMode
        dueAmount
        isRefunded
        createdAt
        customer {
          id
          name
          email
        }
      }
      monthlyStats {
        month
        sales
        purchases
      }
    }
  }
`;
