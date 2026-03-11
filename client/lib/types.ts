export interface Category {
  id: string;
  name: string;
  parentId?: string;
  children?: Category[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  barcode?: string;
  costPrice: number;
  salePrice: number;
  discountPrice?: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  product?: Product;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  brand?: string;
  unit: string;
  weight?: number;
  dimensionL?: number;
  dimensionW?: number;
  dimensionH?: number;
  costPrice: number;
  salePrice: number;
  discountPrice?: number;
  taxRate?: number;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  hasVariants: boolean;
  variants?: ProductVariant[];
  expiryDate?: string;
  warrantyPeriod?: string;
  tags: string[];
  mainImage?: string;
  supportingImages?: string[];
  category: Category;
  createdAt: string;
  updatedAt: string;
}
