import { Context } from "../context.js";

export const customerResolvers = {
  Customer: {
    sales: async (parent: { id: string }, _: unknown, { prisma }: Context) => {
      return prisma.sale.findMany({ where: { customerId: parent.id } });
    },
    transactions: async (parent: { id: string }, _: unknown, { prisma }: Context) => {
      return prisma.accountTransaction.findMany({ where: { customerId: parent.id } });
    },
  },
  Query: {
    customers: async (_: unknown, __: unknown, { prisma, user }: Context) => {
      if (!user) throw new Error("Unauthorized");
      return prisma.customer.findMany({ orderBy: { name: "asc" } });
    },
    customer: async (_: unknown, { id }: { id: string }, { prisma, user }: Context) => {
      if (!user) throw new Error("Unauthorized");
      return prisma.customer.findUnique({ where: { id } });
    },
  },
  Mutation: {
    createCustomer: async (
      _: unknown,
      { input }: { input: Record<string, unknown> },
      { prisma, user }: Context
    ) => {
      if (!user) throw new Error("Unauthorized");
      return prisma.customer.create({ data: input as never });
    },
    updateCustomer: async (
      _: unknown,
      { id, input }: { id: string; input: Record<string, unknown> },
      { prisma, user }: Context
    ) => {
      if (!user) throw new Error("Unauthorized");
      return prisma.customer.update({ where: { id }, data: input as never });
    },
    deleteCustomer: async (_: unknown, { id }: { id: string }, { prisma, user }: Context) => {
      if (!user || user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }
      return prisma.customer.delete({ where: { id } });
    },
  },
};
