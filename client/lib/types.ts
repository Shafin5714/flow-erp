export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  unit: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  lowStockThreshold: number;
  mainImage?: string;
  supportingImages?: string[];
  category: Category;
  createdAt: string;
  updatedAt: string;
}
