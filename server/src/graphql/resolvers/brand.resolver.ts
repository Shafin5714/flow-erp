import { Context } from "../context.js";

export const brandResolvers = {
  Brand: {
    products: async (parent: { id: string }, _: unknown, { prisma }: Context) => {
      return prisma.product.findMany({ where: { brandId: parent.id } });
    },
  },
  Query: {
    brands: async (_: unknown, __: unknown, { prisma, user }: Context) => {
      if (!user) throw new Error("Unauthorized");
      return prisma.brand.findMany({ orderBy: { name: "asc" } });
    },
    brand: async (_: unknown, { id }: { id: string }, { prisma, user }: Context) => {
      if (!user) throw new Error("Unauthorized");
      return prisma.brand.findUnique({ where: { id } });
    },
  },
  Mutation: {
    createBrand: async (
      _: unknown,
      { input }: { input: { name: string } },
      { prisma, user }: Context
    ) => {
      if (!user || !["ADMIN", "MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized");
      }
      return prisma.brand.create({ data: input });
    },
    updateBrand: async (
      _: unknown,
      { id, input }: { id: string; input: { name?: string } },
      { prisma, user }: Context
    ) => {
      if (!user || !["ADMIN", "MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized");
      }
      return prisma.brand.update({ where: { id }, data: input });
    },
    deleteBrand: async (_: unknown, { id }: { id: string }, { prisma, user }: Context) => {
      if (!user || user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }
      return prisma.brand.delete({ where: { id } });
    },
  },
};
