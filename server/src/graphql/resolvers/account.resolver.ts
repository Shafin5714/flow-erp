import { Context } from "../context.js";

interface CreateAccountInput {
  name: string;
  type: "CASH" | "BANK" | "CAPITAL" | "LOAN";
  balance?: number;
}

interface CreateTransactionInput {
  accountId: string;
  type: "INCOME" | "EXPENSE" | "CAPITAL" | "LOAN";
  amount: number;
  description?: string;
  reference?: string;
  customerId?: string;
  vendorId?: string;
}

export const accountResolvers = {
  Account: {
    transactions: async (parent: { id: string }, _: unknown, { prisma }: Context) => {
      return prisma.accountTransaction.findMany({ where: { accountId: parent.id } });
    },
  },
  Transaction: {
    account: async (parent: { accountId: string }, _: unknown, { prisma }: Context) => {
      return prisma.account.findUnique({ where: { id: parent.accountId } });
    },
    customer: async (parent: { customerId: string | null }, _: unknown, { prisma }: Context) => {
      if (!parent.customerId) return null;
      return prisma.customer.findUnique({ where: { id: parent.customerId } });
    },
    vendor: async (parent: { vendorId: string | null }, _: unknown, { prisma }: Context) => {
      if (!parent.vendorId) return null;
      return prisma.vendor.findUnique({ where: { id: parent.vendorId } });
    },
  },
  Query: {
    accounts: async (_: unknown, __: unknown, { prisma, user }: Context) => {
      if (!user || !["ADMIN", "MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized");
      }
      return prisma.account.findMany({ orderBy: { name: "asc" } });
    },
    account: async (_: unknown, { id }: { id: string }, { prisma, user }: Context) => {
      if (!user || !["ADMIN", "MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized");
      }
      return prisma.account.findUnique({ where: { id } });
    },
    transactions: async (
      _: unknown,
      { accountId, startDate, endDate }: { accountId?: string; startDate?: Date; endDate?: Date },
      { prisma, user }: Context
    ) => {
      if (!user || !["ADMIN", "MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized");
      }
      const where: Record<string, unknown> = {};
      if (accountId) where.accountId = accountId;
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) (where.createdAt as Record<string, Date>).gte = startDate;
        if (endDate) (where.createdAt as Record<string, Date>).lte = endDate;
      }
      return prisma.accountTransaction.findMany({ where, orderBy: { createdAt: "desc" } });
    },
  },
  Mutation: {
    createAccount: async (
      _: unknown,
      { input }: { input: CreateAccountInput },
      { prisma, user }: Context
    ) => {
      if (!user || !["ADMIN", "MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized");
      }
      return prisma.account.create({
        data: {
          name: input.name,
          type: input.type,
          balance: input.balance || 0,
        },
      });
    },
    updateAccount: async (
      _: unknown,
      { id, input }: { id: string; input: { name?: string; type?: string } },
      { prisma, user }: Context
    ) => {
      if (!user || !["ADMIN", "MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized");
      }
      return prisma.account.update({ where: { id }, data: input as never });
    },
    deleteAccount: async (_: unknown, { id }: { id: string }, { prisma, user }: Context) => {
      if (!user || user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }
      return prisma.account.delete({ where: { id } });
    },
    createTransaction: async (
      _: unknown,
      { input }: { input: CreateTransactionInput },
      { prisma, user }: Context
    ) => {
      if (!user || !["ADMIN", "MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized");
      }

      // Create transaction and update account balance
      const transaction = await prisma.$transaction(async (tx) => {
        const newTransaction = await tx.accountTransaction.create({
          data: {
            accountId: input.accountId,
            type: input.type,
            amount: input.amount,
            description: input.description,
            reference: input.reference,
            customerId: input.customerId,
            vendorId: input.vendorId,
          },
        });

        // Update account balance based on transaction type
        const balanceChange = ["INCOME", "CAPITAL", "LOAN"].includes(input.type)
          ? input.amount
          : -input.amount;

        await tx.account.update({
          where: { id: input.accountId },
          data: { balance: { increment: balanceChange } },
        });

        return newTransaction;
      });

      return transaction;
    },
  },
};
