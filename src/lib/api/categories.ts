import ApiService from './config';
import { Category } from '@/lib/types';

export interface CategoriesResponse {
  categories: Category[];
  total: number;
}

export const categoriesApi = {
  // Get all categories (public endpoint)
  getAllCategories: async (): Promise<Category[]> => {
    const response = await ApiService.get<Category[]>('/categories');
    return response.data as Category[];
  },

  // Get category by ID (public endpoint)
  getCategoryById: async (categoryId: string): Promise<Category> => {
    const response = await ApiService.get<Category>(`/categories/${categoryId}`);
    return response.data as Category;
  },

  // Get categories with product counts
  getCategoriesWithCounts: async (): Promise<CategoriesResponse> => {
    const response = await ApiService.get<CategoriesResponse>('/categories?include_counts=true');
    return response.data as CategoriesResponse;
  }
};

export default categoriesApi;