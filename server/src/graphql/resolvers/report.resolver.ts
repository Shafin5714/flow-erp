/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context } from "../context.js";
import { GraphQLError } from "graphql";

interface ReportFilterInput {
  startDate: string | Date;
  endDate: string | Date;
  categoryId?: string;
  brandId?: string;
  customerId?: string;
  vendorId?: string;
}

export const reportResolvers = {
  Query: {
    salesReport: async (
      _: unknown,
      { filter }: { filter: ReportFilterInput },
      { prisma, user }: Context
    ) => {
      if (!user) {
        throw new GraphQLError("Unauthorized - Must be logged in", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      if (user.role !== "MANAGER" && user.role !== "ADMIN") {
        throw new GraphQLError("Forbidden - Requires Manager or Admin role", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      const { startDate, endDate, categoryId, brandId, customerId } = filter;

      // Base query filters for Sales
      const saleWhere: any = {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      };

      if (customerId) {
        saleWhere.customerId = customerId;
      }

      // If category or brand filter is active, we need to filter sales that contain those products
      if (categoryId || brandId) {
        saleWhere.items = {
          some: {
            product: {
              ...(categoryId && { categoryId }),
              ...(brandId && { brandId }),
            },
          },
        };
      }

      // Fetch sales matching criteria
      const sales = await prisma.sale.findMany({
        where: saleWhere,
        include: {
          items: {
            include: {
              product: {
                include: { category: true },
              },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      });

      // Initialize accumulations
      let totalRevenue = 0;
      const totalSalesCount = sales.length;
      let totalItemsSold = 0;
      let totalDiscount = 0;
      let totalRefunds = 0;
      let refundCount = 0;

      const paymentBreakdown = { cash: 0, due: 0, cashCount: 0, dueCount: 0 };
      const topProductsMap = new Map<string, any>();
      const categoryMap = new Map<string, any>();
      const dailyTrendMap = new Map<string, any>();

      for (const sale of sales) {
        const dateStr = sale.createdAt.toISOString().split("T")[0];

        // Daily trend tracking
        if (!dailyTrendMap.has(dateStr)) {
          dailyTrendMap.set(dateStr, { date: dateStr, total: 0, count: 0 });
        }
        const dailyData = dailyTrendMap.get(dateStr);
        dailyData.total += sale.total;
        dailyData.count += 1;

        if (sale.isRefunded) {
          totalRefunds += sale.total;
          refundCount += 1;
        }

        totalRevenue += sale.total;
        totalDiscount += sale.discount || 0;

        // Payment mode tracking
        if (sale.paymentMode === "CASH") {
          paymentBreakdown.cash += sale.paidAmount;
          paymentBreakdown.cashCount += 1;
        } else if (sale.paymentMode === "DUE") {
          paymentBreakdown.due += sale.dueAmount;
          paymentBreakdown.cash += sale.paidAmount; // part might be paid in cash
          paymentBreakdown.dueCount += 1;
        }

        for (const item of sale.items) {
          // If category/brand filter active, skip items not matching filter for accuracy in item counts
          if (categoryId && item.product.categoryId !== categoryId) continue;
          if (brandId && item.product.brandId !== brandId) continue;

          totalItemsSold += item.quantity;

          // Top products tracking
          const pId = item.product.id;
          if (!topProductsMap.has(pId)) {
            topProductsMap.set(pId, {
              productId: pId,
              productName: item.product.name,
              sku: item.product.sku,
              quantitySold: 0,
              revenue: 0,
            });
          }
          const pData = topProductsMap.get(pId);
          pData.quantitySold += item.quantity;
          pData.revenue += item.total;

          // Category tracking
          const cId = item.product.categoryId;
          if (!categoryMap.has(cId)) {
            categoryMap.set(cId, {
              categoryId: cId,
              categoryName: item.product.category.name,
              revenue: 0,
              quantity: 0,
            });
          }
          const cData = categoryMap.get(cId);
          cData.quantity += item.quantity;
          cData.revenue += item.total;
        }
      }

      const topProducts = Array.from(topProductsMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      const salesByCategory = Array.from(categoryMap.values()).sort(
        (a, b) => b.revenue - a.revenue
      );
      const dailyTrend = Array.from(dailyTrendMap.values()).sort((a, b) =>
        a.date.localeCompare(b.date)
      );

      const averageOrderValue = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;
      const netRevenue = totalRevenue - totalRefunds;

      return {
        totalRevenue,
        totalSalesCount,
        totalItemsSold,
        averageOrderValue,
        totalDiscount,
        totalRefunds,
        refundCount,
        netRevenue,
        paymentBreakdown,
        dailyTrend,
        topProducts,
        salesByCategory,
      };
    },

    purchaseReport: async (
      _: unknown,
      { filter }: { filter: ReportFilterInput },
      { prisma, user }: Context
    ) => {
      if (!user)
        throw new GraphQLError("Unauthorized", { extensions: { code: "UNAUTHENTICATED" } });
      if (user.role !== "MANAGER" && user.role !== "ADMIN")
        throw new GraphQLError("Forbidden", { extensions: { code: "FORBIDDEN" } });

      const { startDate, endDate, vendorId } = filter;

      const purchaseWhere: any = {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      };

      if (vendorId) {
        purchaseWhere.vendorId = vendorId;
      }

      const purchases = await prisma.purchase.findMany({
        where: purchaseWhere,
        include: {
          vendor: true,
          items: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: "asc" },
      });

      let totalSpend = 0;
      const totalPurchaseCount = purchases.length;
      let totalItemsPurchased = 0;
      let totalPaid = 0;
      let totalDue = 0;

      const topProductsMap = new Map<string, any>();
      const vendorMap = new Map<string, any>();
      const dailyTrendMap = new Map<string, any>();

      for (const purchase of purchases) {
        const dateStr = purchase.createdAt.toISOString().split("T")[0];

        if (!dailyTrendMap.has(dateStr)) {
          dailyTrendMap.set(dateStr, { date: dateStr, total: 0, count: 0 });
        }
        const dailyData = dailyTrendMap.get(dateStr);
        dailyData.total += purchase.total;
        dailyData.count += 1;

        totalSpend += purchase.total;
        totalPaid += purchase.paidAmount;
        totalDue += purchase.dueAmount;

        // Vendor breakdown
        const vId = purchase.vendorId;
        if (!vendorMap.has(vId)) {
          vendorMap.set(vId, {
            vendorId: vId,
            vendorName: purchase.vendor.name,
            totalSpend: 0,
            purchaseCount: 0,
            dueAmount: 0,
          });
        }
        const vData = vendorMap.get(vId);
        vData.totalSpend += purchase.total;
        vData.purchaseCount += 1;
        vData.dueAmount += purchase.dueAmount;

        for (const item of purchase.items) {
          totalItemsPurchased += item.quantity;

          const pId = item.product.id;
          if (!topProductsMap.has(pId)) {
            topProductsMap.set(pId, {
              productId: pId,
              productName: item.product.name,
              sku: item.product.sku,
              quantityPurchased: 0,
              totalSpend: 0,
            });
          }
          const pData = topProductsMap.get(pId);
          pData.quantityPurchased += item.quantity;
          pData.totalSpend += item.total;
        }
      }

      const topProducts = Array.from(topProductsMap.values())
        .sort((a, b) => b.totalSpend - a.totalSpend)
        .slice(0, 10);

      const vendorBreakdown = Array.from(vendorMap.values()).sort(
        (a, b) => b.totalSpend - a.totalSpend
      );
      const dailyTrend = Array.from(dailyTrendMap.values()).sort((a, b) =>
        a.date.localeCompare(b.date)
      );
      const averagePurchaseValue = totalPurchaseCount > 0 ? totalSpend / totalPurchaseCount : 0;

      return {
        totalSpend,
        totalPurchaseCount,
        totalItemsPurchased,
        averagePurchaseValue,
        totalPaid,
        totalDue,
        dailyTrend,
        topProducts,
        vendorBreakdown,
      };
    },

    inventoryReport: async (
      _: unknown,
      { categoryId, brandId }: { categoryId?: string; brandId?: string },
      { prisma, user }: Context
    ) => {
      if (!user)
        throw new GraphQLError("Unauthorized", { extensions: { code: "UNAUTHENTICATED" } });
      if (user.role !== "MANAGER" && user.role !== "ADMIN")
        throw new GraphQLError("Forbidden", { extensions: { code: "FORBIDDEN" } });

      const where: any = {};
      if (categoryId) where.categoryId = categoryId;
      if (brandId) where.brandId = brandId;

      const products = await prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { name: "asc" },
      });

      const totalProducts = products.length;
      let totalStock = 0;
      let totalCostValue = 0;
      let totalRetailValue = 0;
      let lowStockCount = 0;
      let outOfStockCount = 0;

      const items = [];
      const categoryMap = new Map<string, any>();

      for (const p of products) {
        totalStock += p.stock;

        const costValue = p.stock * p.costPrice;
        const retailValue = p.stock * p.salePrice;
        const potentialProfit = retailValue - costValue;
        const isLowStock = p.stock <= p.lowStockThreshold;

        totalCostValue += costValue;
        totalRetailValue += retailValue;

        if (p.stock === 0) outOfStockCount++;
        else if (isLowStock) lowStockCount++;

        items.push({
          productId: p.id,
          productName: p.name,
          sku: p.sku,
          category: p.category.name,
          stock: p.stock,
          costPrice: p.costPrice,
          salePrice: p.salePrice,
          costValue,
          retailValue,
          potentialProfit,
          isLowStock,
        });

        const cId = p.categoryId;
        if (!categoryMap.has(cId)) {
          categoryMap.set(cId, {
            categoryId: cId,
            categoryName: p.category.name,
            productCount: 0,
            totalStock: 0,
            totalCostValue: 0,
            totalRetailValue: 0,
          });
        }
        const cData = categoryMap.get(cId);
        cData.productCount++;
        cData.totalStock += p.stock;
        cData.totalCostValue += costValue;
        cData.totalRetailValue += retailValue;
      }

      const categoryBreakdown = Array.from(categoryMap.values()).sort(
        (a, b) => b.totalRetailValue - a.totalRetailValue
      );

      return {
        totalProducts,
        totalStock,
        totalCostValue,
        totalRetailValue,
        totalPotentialProfit: totalRetailValue - totalCostValue,
        lowStockCount,
        outOfStockCount,
        items,
        categoryBreakdown,
      };
    },

    profitLossReport: async (
      _: unknown,
      { startDate, endDate }: { startDate: string | Date; endDate: string | Date },
      { prisma, user }: Context
    ) => {
      if (!user)
        throw new GraphQLError("Unauthorized", { extensions: { code: "UNAUTHENTICATED" } });
      if (user.role !== "MANAGER" && user.role !== "ADMIN")
        throw new GraphQLError("Forbidden", { extensions: { code: "FORBIDDEN" } });

      const dateFilter = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };

      // 1. Fetch Sales (Income + COGS)
      const sales = await prisma.sale.findMany({
        where: { createdAt: dateFilter, isRefunded: false },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      // 2. Fetch Expenses (AccountTransactions)
      const expenses = await prisma.accountTransaction.findMany({
        where: { createdAt: dateFilter, type: "EXPENSE" },
      });

      let totalIncome = 0;
      let costOfGoodsSold = 0;
      let totalExpenses = 0;

      const monthlyMap = new Map<string, any>();

      // Format month e.g., "Jan 2026"
      const formatMonth = (date: Date) => {
        return date.toLocaleString("en-US", { month: "short", year: "numeric" });
      };

      // Process Sales
      for (const sale of sales) {
        const monthKey = formatMonth(sale.createdAt);
        if (!monthlyMap.has(monthKey)) {
          monthlyMap.set(monthKey, {
            month: monthKey,
            income: 0,
            cogs: 0,
            expenses: 0,
            netProfit: 0,
            _date: sale.createdAt,
          });
        }
        const mRow = monthlyMap.get(monthKey);

        totalIncome += sale.total;
        mRow.income += sale.total;

        let saleCogs = 0;
        for (const item of sale.items) {
          saleCogs += item.quantity * item.product.costPrice;
        }
        costOfGoodsSold += saleCogs;
        mRow.cogs += saleCogs;
      }

      // Process Expenses
      for (const exp of expenses) {
        const monthKey = formatMonth(exp.createdAt);
        if (!monthlyMap.has(monthKey)) {
          monthlyMap.set(monthKey, {
            month: monthKey,
            income: 0,
            cogs: 0,
            expenses: 0,
            netProfit: 0,
            _date: exp.createdAt,
          });
        }
        const mRow = monthlyMap.get(monthKey);

        totalExpenses += exp.amount;
        mRow.expenses += exp.amount;
      }

      const grossProfit = totalIncome - costOfGoodsSold;
      const netProfit = grossProfit - totalExpenses;
      const grossMarginPercent = totalIncome > 0 ? (grossProfit / totalIncome) * 100 : 0;
      const netMarginPercent = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

      const monthlyBreakdown = Array.from(monthlyMap.values())
        .sort((a, b) => a._date.getTime() - b._date.getTime())
        .map((row) => {
          row.netProfit = row.income - row.cogs - row.expenses;
          return {
            month: row.month,
            income: row.income,
            cogs: row.cogs,
            expenses: row.expenses,
            netProfit: row.netProfit,
          };
        });

      return {
        totalIncome,
        costOfGoodsSold,
        grossProfit,
        grossMarginPercent,
        totalExpenses,
        netProfit,
        netMarginPercent,
        monthlyBreakdown,
      };
    },
    ledgerReport: async () => {
      // Placeholder for batch 3
      throw new Error("Not implemented");
    },
  },
};
