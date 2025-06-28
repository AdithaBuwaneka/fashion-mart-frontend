import ApiService from './config';
import { Product, ProductFilters, Category } from '@/lib/types';

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  categories: Category[];
}

export interface ProductSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductReview {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  comment: string;
}

export const productsApi = {
  // Get all products (public endpoint)
  getAllProducts: async (params: ProductSearchParams = {}): Promise<ProductsResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.category) searchParams.append('category', params.category);
    if (params.minPrice) searchParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());
    if (params.sizes) searchParams.append('sizes', params.sizes.join(','));
    if (params.colors) searchParams.append('colors', params.colors.join(','));
    if (params.inStock !== undefined) searchParams.append('inStock', params.inStock.toString());
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const url = `/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await ApiService.get<ProductsResponse>(url);
    return response.data as ProductsResponse;
  },

  // Get product by ID (public endpoint)
  getProductById: async (productId: string): Promise<Product> => {
    const response = await ApiService.get<Product>(`/products/${productId}`);
    return response.data as Product;
  },

  // Search products (public endpoint)
  searchProducts: async (query: string, filters?: ProductFilters): Promise<ProductsResponse> => {
    const params: ProductSearchParams = {
      search: query,
      ...filters
    };
    return await productsApi.getAllProducts(params);
  },

  // Get featured products (public endpoint)
  getFeaturedProducts: async (limit = 12): Promise<Product[]> => {
    const response = await ApiService.get<Product[]>(`/products/featured?limit=${limit}`);
    return response.data as Product[];
  },

  // Get products by category (public endpoint)
  getProductsByCategory: async (categoryId: string, params: ProductSearchParams = {}): Promise<ProductsResponse> => {
    return await productsApi.getAllProducts({
      ...params,
      category: categoryId
    });
  },

  // Get related products (public endpoint)
  getRelatedProducts: async (productId: string, limit = 6): Promise<Product[]> => {
    const response = await ApiService.get<Product[]>(`/products/${productId}/related?limit=${limit}`);
    return response.data as Product[];
  },

  // Product reviews
  getProductReviews: async (productId: string, page = 1, limit = 10): Promise<{ reviews: ProductReview[]; total: number }> => {
    const response = await ApiService.get<{ reviews: ProductReview[]; total: number }>(
      `/products/${productId}/reviews?page=${page}&limit=${limit}`
    );
    return response.data as { reviews: ProductReview[]; total: number };
  },

  createProductReview: async (reviewData: CreateReviewRequest): Promise<ProductReview> => {
    const response = await ApiService.post<ProductReview>(`/products/${reviewData.productId}/reviews`, {
      rating: reviewData.rating,
      comment: reviewData.comment
    });
    return response.data as ProductReview;
  },

  // Get product availability
  getProductAvailability: async (productId: string): Promise<{ available: boolean; stock: Record<string, Record<string, number>> }> => {
    const response = await ApiService.get<{ available: boolean; stock: Record<string, Record<string, number>> }>(
      `/products/${productId}/availability`
    );
    return response.data as { available: boolean; stock: Record<string, Record<string, number>> };
  }
};

export default productsApi;