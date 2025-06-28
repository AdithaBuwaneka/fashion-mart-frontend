import ApiService from './config';
import { Product, Category, Stock, Design } from '@/lib/types';

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface CategoriesResponse {
  categories: Category[];
  total: number;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  designId?: string;
  images: File[];
  sizes: string[];
  colors: string[];
  stockData: Array<{
    size: string;
    color: string;
    quantity: number;
  }>;
}

export interface UpdateStockRequest {
  stockId: string;
  quantity: number;
  operation: 'add' | 'subtract' | 'set';
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  image?: File;
}

export interface ReviewDesignRequest {
  designId: string;
  status: 'approved' | 'rejected';
  feedback?: string;
}

export const inventoryApi = {
  // Product management
  getAllProducts: async (page = 1, limit = 10): Promise<ProductsResponse> => {
    const response = await ApiService.get<ProductsResponse>(`/inventory/products?page=${page}&limit=${limit}`);
    return response.data as ProductsResponse;
  },

  getProductById: async (productId: string): Promise<Product> => {
    const response = await ApiService.get<Product>(`/inventory/products/${productId}`);
    return response.data as Product;
  },

  createProduct: async (productData: CreateProductRequest): Promise<Product> => {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price.toString());
    formData.append('categoryId', productData.categoryId);
    if (productData.designId) formData.append('designId', productData.designId);
    formData.append('sizes', JSON.stringify(productData.sizes));
    formData.append('colors', JSON.stringify(productData.colors));
    formData.append('stockData', JSON.stringify(productData.stockData));
    
    productData.images.forEach((image) => {
      formData.append(`productImages`, image);
    });

    const response = await ApiService.uploadFiles<Product>('/inventory/products', productData.images, {
      name: productData.name,
      description: productData.description,
      price: productData.price.toString(),
      categoryId: productData.categoryId,
      designId: productData.designId,
      sizes: JSON.stringify(productData.sizes),
      colors: JSON.stringify(productData.colors),
      stockData: JSON.stringify(productData.stockData)
    });
    return response.data as Product;
  },

  updateProduct: async (productId: string, productData: Partial<CreateProductRequest>): Promise<Product> => {
    if (productData.images && productData.images.length > 0) {
      const response = await ApiService.uploadFiles<Product>(`/inventory/products/${productId}`, productData.images, {
        name: productData.name,
        description: productData.description,
        price: productData.price?.toString(),
        categoryId: productData.categoryId,
        designId: productData.designId,
        sizes: productData.sizes ? JSON.stringify(productData.sizes) : undefined,
        colors: productData.colors ? JSON.stringify(productData.colors) : undefined,
        stockData: productData.stockData ? JSON.stringify(productData.stockData) : undefined
      });
      return response.data as Product;
    } else {
      const response = await ApiService.put<Product>(`/inventory/products/${productId}`, productData);
      return response.data as Product;
    }
  },

  // Stock management
  updateStock: async (stockData: UpdateStockRequest): Promise<Stock> => {
    const response = await ApiService.put<Stock>(`/inventory/stock/${stockData.stockId}`, {
      quantity: stockData.quantity,
      operation: stockData.operation
    });
    return response.data as Stock;
  },

  getLowStockProducts: async (): Promise<Product[]> => {
    const response = await ApiService.get<Product[]>('/inventory/stock/low');
    return response.data as Product[];
  },

  // Design review
  getPendingDesigns: async (): Promise<Design[]> => {
    const response = await ApiService.get<Design[]>('/inventory/designs/pending');
    return response.data as Design[];
  },

  reviewDesign: async (reviewData: ReviewDesignRequest): Promise<Design> => {
    const response = await ApiService.post<Design>(`/inventory/designs/${reviewData.designId}/review`, {
      status: reviewData.status,
      feedback: reviewData.feedback
    });
    return response.data as Design;
  },

  // Category management
  getAllCategories: async (): Promise<CategoriesResponse> => {
    const response = await ApiService.get<CategoriesResponse>('/inventory/categories');
    return response.data as CategoriesResponse;
  },

  createCategory: async (categoryData: CreateCategoryRequest): Promise<Category> => {
    if (categoryData.image) {
      const response = await ApiService.uploadFile<Category>('/inventory/categories', categoryData.image, {
        name: categoryData.name,
        description: categoryData.description
      });
      return response.data as Category;
    } else {
      const response = await ApiService.post<Category>('/inventory/categories', {
        name: categoryData.name,
        description: categoryData.description
      });
      return response.data as Category;
    }
  },

  updateCategory: async (categoryId: string, categoryData: CreateCategoryRequest): Promise<Category> => {
    if (categoryData.image) {
      const response = await ApiService.uploadFile<Category>(`/inventory/categories/${categoryId}`, categoryData.image, {
        name: categoryData.name,
        description: categoryData.description
      });
      return response.data as Category;
    } else {
      const response = await ApiService.put<Category>(`/inventory/categories/${categoryId}`, {
        name: categoryData.name,
        description: categoryData.description
      });
      return response.data as Category;
    }
  }
};

export default inventoryApi;