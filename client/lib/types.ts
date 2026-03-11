export interface Category {
  id: string;
  name: string;
  parentId?: string;
  children?: Category[];
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
  expiryDate?: string;
  warrantyPeriod?: string;
  tags: string[];
  mainImage?: string;
  supportingImages?: string[];
  category: Category;
  createdAt: string;
  updatedAt: string;
}
