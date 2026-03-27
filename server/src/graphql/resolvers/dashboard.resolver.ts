import { Context } from "../context.js";

export const dashboardResolvers = {
  Query: {
    dashboardStats: async (
      _: unknown,
      { startDate, endDate }: { startDate: Date; endDate: Date },
      { prisma, user }: Context
    ) => {
      if (!user) throw new Error("Unauthorized");

      const dateFilter = {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      };

      // Get sales total & count
      const salesAgg = await prisma.sale.aggregate({
        where: dateFilter,
        _sum: { total: true },
        _count: true,
      });
      const totalSales = salesAgg._sum.total || 0;
      const salesCount = salesAgg._count;

      // Get purchases total
      const purchases = await prisma.purchase.aggregate({
        where: dateFilter,
        _sum: { total: true },
      });
      const totalPurchases = purchases._sum.total || 0;

      // Calculate profits
      const saleItems = await prisma.saleItem.findMany({
        where: { sale: dateFilter },
        include: { product: true },
      });

      let costOfGoodsSold = 0;
      for (const item of saleItems) {
        costOfGoodsSold += item.quantity * item.product.costPrice;
      }

      const grossProfit = totalSales - costOfGoodsSold;
      const netProfit = grossProfit;

      // Today's stats
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      const todayFilter = { createdAt: { gte: todayStart, lte: todayEnd } };

      const todaySalesAgg = await prisma.sale.aggregate({
        where: todayFilter,
        _sum: { total: true },
      });
      const todaySales = todaySalesAgg._sum.total || 0;

      const todayPurchasesAgg = await prisma.purchase.aggregate({
        where: todayFilter,
        _sum: { total: true },
      });
      const todayPurchases = todayPurchasesAgg._sum.total || 0;

      // Pending orders (sales with due amount > 0)
      const pendingOrders = await prisma.sale.count({
        where: { dueAmount: { gt: 0 }, isRefunded: false },
      });

      // Get low stock products
      const lowStockProducts = await prisma.$queryRaw`
        SELECT * FROM "Product" WHERE stock <= "lowStockThreshold" ORDER BY stock ASC LIMIT 10
      `;

      // Get recent transactions
      const recentTransactions = await prisma.accountTransaction.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      // Get recent sales (last 5) with customer
      const recentSales = await prisma.sale.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      // Monthly stats for the past 12 months
      const monthlyStats = [];
      const now = new Date();
      for (let i = 11; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
        const monthFilter = { createdAt: { gte: monthStart, lte: monthEnd } };

        const [mSales, mPurchases] = await Promise.all([
          prisma.sale.aggregate({ where: monthFilter, _sum: { total: true } }),
          prisma.purchase.aggregate({ where: monthFilter, _sum: { total: true } }),
        ]);

        monthlyStats.push({
          month: monthStart.toLocaleString("default", { month: "short" }),
          sales: mSales._sum.total || 0,
          purchases: mPurchases._sum.total || 0,
        });
      }

      // Get counts
      const totalCustomers = await prisma.customer.count();
      const totalVendors = await prisma.vendor.count();
      const totalProducts = await prisma.product.count();

      return {
        totalSales,
        totalPurchases,
        grossProfit,
        netProfit,
        todaySales,
        todayPurchases,
        salesCount,
        pendingOrders,
        lowStockProducts,
        recentTransactions,
        recentSales,
        monthlyStats,
        totalCustomers,
        totalVendors,
        totalProducts,
      };
    },
  },
};
