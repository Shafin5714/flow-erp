import { gql } from "@apollo/client";

export const GET_SALES_REPORT = gql`
  query GetSalesReport($filter: ReportFilterInput!) {
    salesReport(filter: $filter) {
      totalRevenue
      totalSalesCount
      totalItemsSold
      averageOrderValue
      totalDiscount
      totalRefunds
      refundCount
      netRevenue
      paymentBreakdown {
        cash
        due
        cashCount
        dueCount
      }
      dailyTrend {
        date
        total
        count
      }
      topProducts {
        productId
        productName
        sku
        quantitySold
        revenue
      }
      salesByCategory {
        categoryId
        categoryName
        revenue
        quantity
      }
    }
  }
`;

export const GET_PURCHASE_REPORT = gql`
  query GetPurchaseReport($filter: ReportFilterInput!) {
    purchaseReport(filter: $filter) {
      totalSpend
      totalPurchaseCount
      totalItemsPurchased
      averagePurchaseValue
      totalPaid
      totalDue
      dailyTrend {
        date
        total
        count
      }
      topProducts {
        productId
        productName
        sku
        quantityPurchased
        totalSpend
      }
      vendorBreakdown {
        vendorId
        vendorName
        totalSpend
        purchaseCount
        dueAmount
      }
    }
  }
`;
