import { Context } from "../context.js";

interface PurchaseItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
}

interface CreatePurchaseInput {
  vendorId: string;
  items: PurchaseItemInput[];
  paidAmount: number;
}

export const purchaseResolvers = {
  Purchase: {
    vendor: async (parent: { vendorId: string }, _: unknown, { prisma }: Context) => {
      return prisma.vendor.findUnique({ where: { id: parent.vendorId } });
    },
    items: async (parent: { id: string }, _: unknown, { prisma }: Context) => {
      return prisma.purchaseItem.findMany({ where: { purchaseId: parent.id } });
    },
  },
  PurchaseItem: {
    product: async (parent: { productId: string }, _: unknown, { prisma }: Context) => {
      return prisma.product.findUnique({ where: { id: parent.productId } });
    },
  },
  Query: {
    purchases: async (
      _: unknown,
      { startDate, endDate }: { startDate?: Date; endDate?: Date },
      { prisma, user }: Context
    ) => {
      if (!user) throw new Error("Unauthorized");
      const where: Record<string, unknown> = {};
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) (where.createdAt as Record<string, Date>).gte = startDate;
        if (endDate) (where.createdAt as Record<string, Date>).lte = endDate;
      }
      return prisma.purchase.findMany({ where, orderBy: { createdAt: "desc" } });
    },
    purchase: async (_: unknown, { id }: { id: string }, { prisma, user }: Context) => {
      if (!user) throw new Error("Unauthorized");
      return prisma.purchase.findUnique({ where: { id } });
    },
  },
  Mutation: {
    createPurchase: async (
      _: unknown,
      { input }: { input: CreatePurchaseInput },
      { prisma, user }: Context
    ) => {
      if (!user || !["ADMIN", "MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized");
      }

      // Calculate totals
      let subtotal = 0;
      const itemsData = input.items.map((item) => {
        const total = item.quantity * item.unitPrice;
        subtotal += total;
        return { ...item, total };
      });

      const total = subtotal;
      const dueAmount = total - input.paidAmount;

      // Create purchase with items in a transaction
      const purchase = await prisma.$transaction(async (tx) => {
        const newPurchase = await tx.purchase.create({
          data: {
            vendorId: input.vendorId,
            subtotal,
            total,
            paidAmount: input.paidAmount,
            dueAmount,
            items: {
              create: itemsData,
            },
          },
          include: { items: true },
        });

        // Update stock for each product
        for (const item of input.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }

        // Update vendor balance if there's due amount
        if (dueAmount > 0) {
          await tx.vendor.update({
            where: { id: input.vendorId },
            data: { balance: { increment: dueAmount } },
          });
        }

        return newPurchase;
      });

      return purchase;
    },
  },
};
