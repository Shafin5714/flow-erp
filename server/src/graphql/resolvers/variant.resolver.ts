import { Context } from "../context.js";

interface CreateVariantInput {
  name: string;
  sku: string;
  barcode?: string;
  costPrice: number;
  salePrice: number;
  discountPrice?: number;
  stock?: number;
  isActive?: boolean;
}

interface UpdateVariantInput {
  name?: string;
  sku?: string;
  barcode?: string;
  costPrice?: number;
  salePrice?: number;
  discountPrice?: number;
  stock?: number;
  isActive?: boolean;
}

export const variantResolvers = {
  ProductVariant: {
    product: async (parent: { productId: string }, _: unknown, { prisma }: Context) => {
      return prisma.product.findUnique({ where: { id: parent.productId } });
    },
  },
  Query: {
    productVariants: async (
      _: unknown,
      { productId }: { productId: string },
      { prisma, user }: Context
    ) => {
      if (!user) throw new Error("Unauthorized");
      return prisma.productVariant.findMany({
        where: { productId },
        orderBy: { name: "asc" },
      });
    },
  },
  Mutation: {
    createVariant: async (
      _: unknown,
      { productId, input }: { productId: string; input: CreateVariantInput },
      { prisma, user }: Context
    ) => {
      if (!user || !["ADMIN", "MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized");
      }
      return prisma.productVariant.create({
        data: {
          ...input,
          productId,
        },
      });
    },
    updateVariant: async (
      _: unknown,
      { id, input }: { id: string; input: UpdateVariantInput },
      { prisma, user }: Context
    ) => {
      if (!user || !["ADMIN", "MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized");
      }
      return prisma.productVariant.update({
        where: { id },
        data: input,
      });
    },
    deleteVariant: async (_: unknown, { id }: { id: string }, { prisma, user }: Context) => {
      if (!user || user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }
      return prisma.productVariant.delete({ where: { id } });
    },
  },
};
