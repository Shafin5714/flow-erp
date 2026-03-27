import { Context } from "../context.js";

interface SaleItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
}

interface CreateSaleInput {
  customerId?: string;
  items: SaleItemInput[];
  discount?: number;
  paymentMode: "CASH" | "DUE";
  paidAmount: number;
  accountId?: string;
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
    variant: async (parent: { variantId: string | null }, _: unknown, { prisma }: Context) => {
      if (!parent.variantId) return null;
      return prisma.productVariant.findUnique({ where: { id: parent.variantId } });
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

        // Update stock for each product or variant
        for (const item of input.items) {
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

        // Update customer balance if there's due amount
        if (input.customerId && dueAmount > 0) {
          await tx.customer.update({
            where: { id: input.customerId },
            data: { balance: { increment: dueAmount } },
          });
        }

        // Auto-record ledger entry if money was paid to an account
        if (input.paidAmount > 0 && input.accountId) {
          await tx.accountTransaction.create({
            data: {
              accountId: input.accountId,
              type: "INCOME",
              amount: input.paidAmount,
              description: `Sale ${invoiceNumber}`,
              reference: invoiceNumber,
              customerId: input.customerId || undefined,
            },
          });
          await tx.account.update({
            where: { id: input.accountId },
            data: { balance: { increment: input.paidAmount } },
          });
        }

        return newSale;
      });

      return sale;
    },
    refundSale: async (
      _: unknown,
      { id, accountId }: { id: string; accountId?: string },
      { prisma, user }: Context
    ) => {
      if (!user) throw new Error("Unauthorized");
      if (user.role !== "ADMIN" && user.role !== "MANAGER") {
        throw new Error("Only admins and managers can refund sales");
      }

      const sale = await prisma.sale.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!sale) throw new Error("Sale not found");
      if (sale.isRefunded) throw new Error("Sale is already refunded");

      return prisma.$transaction(async (tx) => {
        // 1. Restore stock
        for (const item of sale.items) {
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

        // 2. Reduce customer balance if there was a due amount
        if (sale.customerId && sale.dueAmount > 0) {
          await tx.customer.update({
            where: { id: sale.customerId },
            data: { balance: { decrement: sale.dueAmount } },
          });
        }

        // 3. Create expense ledger if amount was paid
        if (sale.paidAmount > 0 && accountId) {
          await tx.accountTransaction.create({
            data: {
              accountId,
              type: "EXPENSE",
              amount: sale.paidAmount,
              description: `Refund for Sale ${sale.invoiceNumber}`,
              reference: sale.invoiceNumber,
              customerId: sale.customerId || undefined,
            },
          });
          await tx.account.update({
            where: { id: accountId },
            data: { balance: { decrement: sale.paidAmount } },
          });
        }

        // 4. Update sale as refunded
        return tx.sale.update({
          where: { id },
          data: {
            isRefunded: true,
          },
        });
      });
    },
  },
};
