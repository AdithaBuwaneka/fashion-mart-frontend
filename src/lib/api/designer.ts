import ApiService from './config';
import { Design, Category } from '@/lib/types';
import { DesignStatus } from '@/lib/types/design';

export interface DesignsResponse {
  designs: Design[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateDesignRequest {
  title: string;
  description: string;
  categoryId: string;
  tags: string[];
  price: number;
  designImages: File[];
}

export interface UpdateDesignRequest {
  title?: string;
  description?: string;
  categoryId?: string;
  tags?: string[];
  price?: number;
  designImages?: File[];
}

export const designerApi = {
  // Get all designs by current designer (simple version)
  getDesigns: async (): Promise<Design[]> => {
    const response = await ApiService.get<Design[]>('/designer/designs');
    return response.data as Design[];
  },

  // Get all designs by current designer with pagination
  getDesignerDesigns: async (page = 1, limit = 10, status?: DesignStatus): Promise<DesignsResponse> => {
    let url = `/designer/designs?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    const response = await ApiService.get<Design[]>(url);

    // Backend returns { success: true, data: [designs] }
    // ApiService.get returns the ApiResponse, so response.data contains the designs array
    return {
      designs: response.data || [],
      total: response.data?.length || 0,
      page: page,
      limit: limit
    };
  },

  // Get specific design by ID
  getDesignById: async (designId: string): Promise<Design> => {
    const response = await ApiService.get<Design>(`/designer/designs/${designId}`);
    return response.data as Design;
  },

  // Create new design with file upload
  createDesign: async (designData: CreateDesignRequest): Promise<Design> => {
    // Debug logging
    console.log('Creating design with data:', {
      title: designData.title,
      description: designData.description,
      categoryId: designData.categoryId,
      price: designData.price,
      tags: designData.tags,
      imageCount: designData.designImages.length,
      endpoint: '/designer/designs'
    });

    // First, test if backend is reachable
    try {
      console.log('Testing backend connection...');
      await ApiService.get('/designer/categories');
      console.log('Backend is reachable');
    } catch (testError) {
      console.error('Backend test failed:', testError);
    }

    // Validate required fields
    if (!designData.title?.trim()) {
      throw new Error('Title is required');
    }
    if (!designData.description?.trim()) {
      throw new Error('Description is required');
    }
    if (!designData.categoryId?.trim()) {
      throw new Error('Category is required');
    }
    if (!designData.designImages || designData.designImages.length === 0) {
      throw new Error('At least one design image is required');
    }

    const formData = new FormData();
    formData.append('name', designData.title.trim()); // Backend expects 'name' not 'title'
    formData.append('description', designData.description.trim());
    formData.append('categoryId', designData.categoryId.trim());
    formData.append('price', designData.price.toString());
    formData.append('tags', JSON.stringify(designData.tags || []));

    // Add design images with correct field name
    designData.designImages.forEach((file, index) => {
      console.log(`Adding file ${index}:`, {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      });
      formData.append('designImages', file);
    });

    // Log FormData contents (for debugging)
    console.log('FormData entries:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, { name: value.name, type: value.type, size: value.size });
      } else {
        console.log(`${key}:`, value);
      }
    }

    try {
      console.log('Sending POST request to /designer/designs...');
      const response = await ApiService.post<Design>('/designer/designs', formData);
      console.log('Design creation successful:', response);
      return response.data as Design;
    } catch (error) {
      console.error('Design creation failed in designer API:', error);
      throw error;
    }
  },

  // Update existing design
  updateDesign: async (designId: string, designData: UpdateDesignRequest): Promise<Design> => {
    if (designData.designImages && designData.designImages.length > 0) {
      const formData = new FormData();
      if (designData.title) formData.append('title', designData.title);
      if (designData.description) formData.append('description', designData.description);
      if (designData.categoryId) formData.append('categoryId', designData.categoryId);
      if (designData.price) formData.append('price', designData.price.toString());
      if (designData.tags) formData.append('tags', JSON.stringify(designData.tags));

      // Add design images
      designData.designImages.forEach((file) => {
        formData.append('designImages', file);
      });

      const response = await ApiService.uploadFiles<Design>(`/designer/designs/${designId}`, designData.designImages, {
        title: designData.title,
        description: designData.description,
        categoryId: designData.categoryId,
        price: designData.price,
        tags: designData.tags
      });
      return response.data as Design;
    } else {
      const response = await ApiService.put<Design>(`/designer/designs/${designId}`, designData);
      return response.data as Design;
    }
  },

  // Delete design
  deleteDesign: async (designId: string): Promise<{ success: boolean; message: string }> => {
    const response = await ApiService.delete<{ success: boolean; message: string }>(`/designer/designs/${designId}`);
    return response.data as { success: boolean; message: string };
  },

  // Submit design for approval
  submitDesign: async (designId: string): Promise<Design> => {
    const response = await ApiService.post<Design>(`/designer/designs/${designId}/submit`, {});
    return response.data as Design;
  },

  // Get categories for design creation
  getCategories: async (): Promise<Category[]> => {
    const response = await ApiService.get<Category[]>('/designer/categories');
    return response.data as Category[];
  }
};

export default designerApi;