export interface Category {
  id: string;
  name: string;
  parentId?: string;
  children?: Category[];
}

export interface Brand {
  id: string;
  name: string;
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
  brandId?: string;
  categoryId: string;
  brand?: Brand;

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

export interface Vendor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  purchases?: Purchase[];
  transactions?: AccountTransaction[];
}

export interface Account {
  id: string;
  name: string;
  type: "CASH" | "BANK" | "CAPITAL" | "LOAN";
  balance: number;
}

export interface AccountTransaction {
  id: string;
  type: "INCOME" | "EXPENSE" | "CAPITAL" | "LOAN";
  amount: number;
  description?: string;
  reference?: string;
  createdAt: string;
  account: Account;
  vendor?: Vendor;
  customer?: Customer;
}

export interface PurchaseItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Purchase {
  id: string;
  vendor: Vendor;
  items: PurchaseItem[];
  subtotal: number;
  total: number;
  paidAmount: number;
  dueAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  sales?: Sale[];
  transactions?: AccountTransaction[];
}

export interface SaleItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customer?: Customer;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMode: "CASH" | "DUE";
  paidAmount: number;
  dueAmount: number;
  isRefunded: boolean;
  createdAt: string;
  updatedAt: string;
}
