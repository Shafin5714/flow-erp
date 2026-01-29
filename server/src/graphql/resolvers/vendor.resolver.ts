import { Context } from "../context.js";

export const vendorResolvers = {
  Vendor: {
    purchases: async (parent: { id: string }, _: unknown, { prisma }: Context) => {
      return prisma.purchase.findMany({ where: { vendorId: parent.id } });
    },
    transactions: async (parent: { id: string }, _: unknown, { prisma }: Context) => {
      return prisma.accountTransaction.findMany({ where: { vendorId: parent.id } });
    },
  },
  Query: {
    vendors: async (_: unknown, __: unknown, { prisma, user }: Context) => {
      if (!user) throw new Error("Unauthorized");
      return prisma.vendor.findMany({ orderBy: { name: "asc" } });
    },
    vendor: async (_: unknown, { id }: { id: string }, { prisma, user }: Context) => {
      if (!user) throw new Error("Unauthorized");
      return prisma.vendor.findUnique({ where: { id } });
    },
  },
  Mutation: {
    createVendor: async (
      _: unknown,
      { input }: { input: Record<string, unknown> },
      { prisma, user }: Context
    ) => {
      if (!user || !["ADMIN", "MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized");
      }
      return prisma.vendor.create({ data: input as never });
    },
    updateVendor: async (
      _: unknown,
      { id, input }: { id: string; input: Record<string, unknown> },
      { prisma, user }: Context
    ) => {
      if (!user || !["ADMIN", "MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized");
      }
      return prisma.vendor.update({ where: { id }, data: input as never });
    },
    deleteVendor: async (_: unknown, { id }: { id: string }, { prisma, user }: Context) => {
      if (!user || user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }
      return prisma.vendor.delete({ where: { id } });
    },
  },
};
