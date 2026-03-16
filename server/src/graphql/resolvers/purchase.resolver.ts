import { Context } from "../context.js";

interface PurchaseItemInput {
  productId: string;
  variantId?: string;
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
    variant: async (parent: { variantId: string | null }, _: unknown, { prisma }: Context) => {
      if (!parent.variantId) return null;
      return prisma.productVariant.findUnique({ where: { id: parent.variantId } });
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
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } },
            });
          } else {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } },
            });
          }
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
    updatePurchase: async (
      _: unknown,
      { id, input }: { id: string; input: Partial<CreatePurchaseInput> },
      { prisma, user }: Context
    ) => {
      if (!user || !["ADMIN", "MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized");
      }

      return prisma.$transaction(async (tx) => {
        const existingPurchase = await tx.purchase.findUnique({
          where: { id },
          include: { items: true },
        });

        if (!existingPurchase) throw new Error("Purchase not found");

        // Revert old stock increments
        for (const item of existingPurchase.items) {
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { decrement: item.quantity } },
            });
          } else {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            });
          }
        }

        // Revert old vendor balance if there was a due amount
        if (existingPurchase.dueAmount > 0) {
          await tx.vendor.update({
            where: { id: existingPurchase.vendorId },
            data: { balance: { decrement: existingPurchase.dueAmount } },
          });
        }

        // Calculate new totals
        const vendorId = input.vendorId || existingPurchase.vendorId;
        const items = input.items || existingPurchase.items;
        const paidAmount = input.paidAmount ?? existingPurchase.paidAmount;

        let subtotal = 0;
        const itemsData = items.map((item) => {
          const total = item.quantity * item.unitPrice;
          subtotal += total;
          return {
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total,
          };
        });

        const total = subtotal;
        const dueAmount = total - paidAmount;

        // Delete old items and update purchase
        await tx.purchaseItem.deleteMany({ where: { purchaseId: id } });

        const updatedPurchase = await tx.purchase.update({
          where: { id },
          data: {
            vendorId,
            subtotal,
            total,
            paidAmount,
            dueAmount,
            items: {
              create: itemsData,
            },
          },
          include: { items: true },
        });

        // Apply new stock increments
        for (const item of itemsData) {
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } },
            });
          } else {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } },
            });
          }
        }

        // Update vendor balance if there's a new due amount
        if (dueAmount > 0) {
          await tx.vendor.update({
            where: { id: vendorId },
            data: { balance: { increment: dueAmount } },
          });
        }

        return updatedPurchase;
      });
    },
  },
};
