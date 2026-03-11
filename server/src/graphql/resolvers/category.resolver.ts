import { Context } from "../context.js";

export const categoryResolvers = {
  Category: {
    products: async (parent: { id: string }, _: unknown, { prisma }: Context) => {
      return prisma.product.findMany({ where: { categoryId: parent.id } });
    },
    parent: async (parent: { parentId: string | null }, _: unknown, { prisma }: Context) => {
      if (!parent.parentId) return null;
      return prisma.category.findUnique({ where: { id: parent.parentId } });
    },
    children: async (parent: { id: string }, _: unknown, { prisma }: Context) => {
      return prisma.category.findMany({ where: { parentId: parent.id } });
    },
  },
  Query: {
    categories: async (_: unknown, __: unknown, { prisma, user }: Context) => {
      if (!user) throw new Error("Unauthorized");
      return prisma.category.findMany({ orderBy: { name: "asc" } });
    },
    category: async (_: unknown, { id }: { id: string }, { prisma, user }: Context) => {
      if (!user) throw new Error("Unauthorized");
      return prisma.category.findUnique({ where: { id } });
    },
  },
  Mutation: {
    createCategory: async (
      _: unknown,
      { input }: { input: { name: string; parentId?: string } },
      { prisma, user }: Context
    ) => {
      if (!user || !["ADMIN", "MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized");
      }
      try {
        return await prisma.category.create({ data: input });
      } catch (error: any) {
        if (error.code === "P2002") {
          throw new Error(`A category with the name "${input.name}" already exists.`);
        }
        throw error;
      }
    },
    updateCategory: async (
      _: unknown,
      { id, input }: { id: string; input: { name?: string; parentId?: string } },
      { prisma, user }: Context
    ) => {
      if (!user || !["ADMIN", "MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized");
      }
      return prisma.category.update({ where: { id }, data: input });
    },
    deleteCategory: async (_: unknown, { id }: { id: string }, { prisma, user }: Context) => {
      if (!user || user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }
      return prisma.category.delete({ where: { id } });
    },
  },
};
