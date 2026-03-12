import * as z from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  barcode: z.string().optional(),
  brandId: z.string().optional(),
  categoryId: z.string().min(1, "Please select a category"),
  subcategoryId: z.string().optional(),
  unit: z.string().min(1, "Please select a unit"),
  costPrice: z.number().min(0, "Cost price must be positive"),
  salePrice: z.number().min(0, "Sale price must be positive"),
  discountPrice: z.number().min(0, "Discount price must be positive").optional(),
  taxRate: z.number().min(0, "Tax rate must be positive").optional(),
  stock: z.number().int().min(0, "Stock must be a non-negative integer"),
  lowStockThreshold: z.number().int().min(0, "Threshold must be non-negative"),
  isActive: z.boolean(),
  hasVariants: z.boolean(),
  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1, "Variant name is required"),
        sku: z.string().min(3, "SKU must be at least 3 characters"),
        barcode: z.string().optional(),
        costPrice: z.number().min(0, "Cost price must be positive"),
        salePrice: z.number().min(0, "Sale price must be positive"),
        discountPrice: z.number().min(0, "Discount price must be positive").optional(),
        stock: z.number().int().min(0, "Stock must be a non-negative integer"),
        isActive: z.boolean(),
      })
    )
    .optional(),
  expiryDate: z.date().optional(),
  warrantyPeriod: z.string().optional(),
  tags: z.array(z.string()),
  weight: z.number().min(0).optional(),
  dimensionL: z.number().min(0).optional(),
  dimensionW: z.number().min(0).optional(),
  dimensionH: z.number().min(0).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const units = ["PCS", "KG", "LITER", "BOX", "PACK", "METER"];

export const defaultFormValues: ProductFormValues = {
  name: "",
  description: "",
  sku: "",
  barcode: "",
  brandId: "",
  categoryId: "",
  subcategoryId: "",
  unit: "PCS",
  costPrice: 0,
  salePrice: 0,
  discountPrice: 0,
  taxRate: 0,
  stock: 0,
  lowStockThreshold: 10,
  isActive: true,
  hasVariants: false,
  variants: [],
  tags: [],
  weight: 0,
  dimensionL: 0,
  dimensionW: 0,
  dimensionH: 0,
};
