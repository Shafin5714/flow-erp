import { Context } from "../context.js";

interface ProductVariantInput {
  id?: string;
  name: string;
  sku: string;
  barcode?: string;
  costPrice: number;
  salePrice: number;
  discountPrice?: number;
  stock: number;
  isActive?: boolean;
}

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
    brand: async (parent: { brandId: string | null }, _: unknown, { prisma }: Context) => {
      if (!parent.brandId) return null;
      return prisma.brand.findUnique({ where: { id: parent.brandId } });
    },
    variants: async (parent: { id: string }, _: unknown, { prisma }: Context) => {
      return prisma.productVariant.findMany({ where: { productId: parent.id } });
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

      const { variants, brandId, ...restProductData } = input as Record<string, unknown> & {
        hasVariants?: boolean;
        variants?: ProductVariantInput[];
        brandId?: string;
      };

      const productData = {
        ...restProductData,
        brandId: brandId === "" ? null : brandId,
      };

      return prisma.product.create({
        data: {
          ...productData,
          ...(productData.hasVariants && variants && variants.length > 0
            ? {
                variants: {
                  create: variants,
                },
              }
            : {}),
        } as never,
      });
    },
    updateProduct: async (
      _: unknown,
      { id, input }: { id: string; input: Record<string, unknown> },
      { prisma, user }: Context
    ) => {
      if (!user || !["ADMIN", "MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized");
      }

      const { variants, brandId, ...restProductData } = input as Record<string, unknown> & {
        hasVariants?: boolean;
        variants?: ProductVariantInput[];
        brandId?: string;
      };

      const productData = {
        ...restProductData,
        brandId: brandId === "" ? null : brandId,
      };

      if (variants !== undefined) {
        if (productData.hasVariants && variants.length > 0) {
          return prisma.product.update({
            where: { id },
            data: {
              ...productData,
              variants: {
                deleteMany: {},
                create: variants.map((v) => {
                  const { id: _id, ...rest } = v;
                  void _id;
                  return rest;
                }),
              },
            } as never,
          });
        } else {
          return prisma.product.update({
            where: { id },
            data: {
              ...productData,
              variants: {
                deleteMany: {},
              },
            } as never,
          });
        }
      }

      return prisma.product.update({ where: { id }, data: productData });
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
