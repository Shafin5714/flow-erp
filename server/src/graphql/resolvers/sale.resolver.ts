import { Context } from "../context.js";

interface SaleItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
}

interface CreateSaleInput {
  customerId?: string;
  items: SaleItemInput[];
  discount?: number;
  paymentMode: "CASH" | "DUE";
  paidAmount: number;
}

export const saleResolvers = {
  Sale: {
    customer: async (parent: { customerId: string | null }, _: unknown, { prisma }: Context) => {
      if (!parent.customerId) return null;
      return prisma.customer.findUnique({ where: { id: parent.customerId } });
    },
    createdBy: async (parent: { createdById: string }, _: unknown, { prisma }: Context) => {
      return prisma.user.findUnique({ where: { id: parent.createdById } });
    },
    items: async (parent: { id: string }, _: unknown, { prisma }: Context) => {
      return prisma.saleItem.findMany({ where: { saleId: parent.id } });
    },
  },
  SaleItem: {
    product: async (parent: { productId: string }, _: unknown, { prisma }: Context) => {
      return prisma.product.findUnique({ where: { id: parent.productId } });
    },
  },
  Query: {
    sales: async (
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
      return prisma.sale.findMany({ where, orderBy: { createdAt: "desc" } });
    },
    sale: async (_: unknown, { id }: { id: string }, { prisma, user }: Context) => {
      if (!user) throw new Error("Unauthorized");
      return prisma.sale.findUnique({ where: { id } });
    },
  },
  Mutation: {
    createSale: async (
      _: unknown,
      { input }: { input: CreateSaleInput },
      { prisma, user }: Context
    ) => {
      if (!user) throw new Error("Unauthorized");

      // Generate invoice number
      const lastSale = await prisma.sale.findFirst({ orderBy: { createdAt: "desc" } });
      const invoiceNumber = lastSale
        ? `INV-${String(parseInt(lastSale.invoiceNumber.split("-")[1]) + 1).padStart(6, "0")}`
        : "INV-000001";

      // Calculate totals
      let subtotal = 0;
      const itemsData = input.items.map((item) => {
        const total = item.quantity * item.unitPrice;
        subtotal += total;
        return { ...item, total };
      });

      const discount = input.discount || 0;
      const total = subtotal - discount;
      const dueAmount = total - input.paidAmount;

      // Create sale with items in a transaction
      const sale = await prisma.$transaction(async (tx) => {
        const newSale = await tx.sale.create({
          data: {
            invoiceNumber,
            customerId: input.customerId,
            subtotal,
            discount,
            total,
            paymentMode: input.paymentMode,
            paidAmount: input.paidAmount,
            dueAmount,
            createdById: user.id,
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
            data: { stock: { decrement: item.quantity } },
          });
        }

        // Update customer balance if there's due amount
        if (input.customerId && dueAmount > 0) {
          await tx.customer.update({
            where: { id: input.customerId },
            data: { balance: { increment: dueAmount } },
          });
        }

        return newSale;
      });

      return sale;
    },
  },
};
