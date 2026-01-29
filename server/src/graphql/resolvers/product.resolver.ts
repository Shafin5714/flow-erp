import { Context } from "../context.js";

interface ProductFilterInput {
  search?: string;
  categoryId?: string;
  lowStockOnly?: boolean;
}

export const productResolvers = {
  Product: {
    category: async (parent: { categoryId: string }, _: unknown, { prisma }: Context) => {
      return prisma.category.findUnique({ where: { id: parent.categoryId } });
    },
  },
  Query: {
    products: async (
      _: unknown,
      { filter }: { filter?: ProductFilterInput },
      { prisma, user }: Context
    ) => {
      if (!user) throw new Error("Unauthorized");

      const where: Record<string, unknown> = {};

      if (filter?.search) {
        where.OR = [
          { name: { contains: filter.search, mode: "insensitive" } },
          { sku: { contains: filter.search, mode: "insensitive" } },
        ];
      }

      if (filter?.categoryId) {
        where.categoryId = filter.categoryId;
      }

      if (filter?.lowStockOnly) {
        where.stock = { lte: prisma.$queryRaw`"lowStockThreshold"` };
      }

      return prisma.product.findMany({
        where,
        orderBy: { name: "asc" },
      });
    },
    product: async (_: unknown, { id }: { id: string }, { prisma, user }: Context) => {
      if (!user) throw new Error("Unauthorized");
      return prisma.product.findUnique({ where: { id } });
    },
    lowStockProducts: async (_: unknown, __: unknown, { prisma, user }: Context) => {
      if (!user) throw new Error("Unauthorized");
      return prisma.$queryRaw`
        SELECT * FROM "Product" WHERE stock <= "lowStockThreshold"
      `;
    },
  },
  Mutation: {
    createProduct: async (
      _: unknown,
      { input }: { input: Record<string, unknown> },
      { prisma, user }: Context
    ) => {
      if (!user || !["ADMIN", "MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized");
      }
      return prisma.product.create({ data: input as never });
    },
    updateProduct: async (
      _: unknown,
      { id, input }: { id: string; input: Record<string, unknown> },
      { prisma, user }: Context
    ) => {
      if (!user || !["ADMIN", "MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized");
      }
      return prisma.product.update({ where: { id }, data: input as never });
    },
    deleteProduct: async (_: unknown, { id }: { id: string }, { prisma, user }: Context) => {
      if (!user || user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }
      return prisma.product.delete({ where: { id } });
    },
    adjustStock: async (
      _: unknown,
      { id, quantity }: { id: string; quantity: number },
      { prisma, user }: Context
    ) => {
      if (!user) throw new Error("Unauthorized");
      return prisma.product.update({
        where: { id },
        data: { stock: { increment: quantity } },
      });
    },
  },
};
