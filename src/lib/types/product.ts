// src/lib/types/product.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  categoryId: string;
  category: Category;
  stock: Stock[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
}

export interface Stock {
  id: string;
  productId: string;
  size: string;
  color: string;
  quantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
}