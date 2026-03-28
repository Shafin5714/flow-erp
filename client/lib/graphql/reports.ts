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

export const GET_INVENTORY_REPORT = gql`
  query GetInventoryReport($categoryId: String, $brandId: String) {
    inventoryReport(categoryId: $categoryId, brandId: $brandId) {
      totalProducts
      totalStock
      totalCostValue
      totalRetailValue
      totalPotentialProfit
      lowStockCount
      outOfStockCount
      items {
        productId
        productName
        sku
        category
        stock
        costPrice
        salePrice
        costValue
        retailValue
        potentialProfit
        isLowStock
      }
      categoryBreakdown {
        categoryId
        categoryName
        productCount
        totalStock
        totalCostValue
        totalRetailValue
      }
    }
  }
`;

export const GET_PROFIT_LOSS_REPORT = gql`
  query GetProfitLossReport($startDate: DateTime!, $endDate: DateTime!) {
    profitLossReport(startDate: $startDate, endDate: $endDate) {
      totalIncome
      costOfGoodsSold
      grossProfit
      grossMarginPercent
      totalExpenses
      netProfit
      netMarginPercent
      monthlyBreakdown {
        month
        income
        cogs
        expenses
        netProfit
      }
    }
  }
`;

export const GET_LEDGER_REPORT = gql`
  query GetLedgerReport {
    ledgerReport {
      totalCustomerOutstanding
      totalVendorOutstanding
      customers {
        customerId
        customerName
        phone
        totalPurchases
        totalPaid
        outstandingBalance
        saleCount
        lastPurchaseDate
      }
      vendors {
        vendorId
        vendorName
        phone
        totalPurchases
        totalPaid
        outstandingBalance
        purchaseCount
        lastPurchaseDate
      }
    }
  }
`;
