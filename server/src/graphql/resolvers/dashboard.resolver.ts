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

      // Get sales total
      const sales = await prisma.sale.aggregate({
        where: dateFilter,
        _sum: { total: true },
      });
      const totalSales = sales._sum.total || 0;

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
      const netProfit = grossProfit; // Simplified, could include expenses

      // Get low stock products
      const lowStockProducts = await prisma.$queryRaw`
        SELECT * FROM "Product" WHERE stock <= "lowStockThreshold" ORDER BY stock ASC LIMIT 10
      `;

      // Get recent transactions
      const recentTransactions = await prisma.accountTransaction.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      // Get counts
      const totalCustomers = await prisma.customer.count();
      const totalVendors = await prisma.vendor.count();
      const totalProducts = await prisma.product.count();

      return {
        totalSales,
        totalPurchases,
        grossProfit,
        netProfit,
        lowStockProducts,
        recentTransactions,
        totalCustomers,
        totalVendors,
        totalProducts,
      };
    },
  },
};
