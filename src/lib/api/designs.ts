import ApiService from './config';
import { Design } from '@/lib/types';

export interface DesignsResponse {
  designs: Design[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateDesignRequest {
  name: string;
  description: string;
  tags: string[];
  designImages: File[];
}

export interface UpdateDesignRequest {
  name?: string;
  description?: string;
  tags?: string[];
  designImages?: File[];
}

export const designsApi = {
  // Get all designs by current designer
  getDesignerDesigns: async (page = 1, limit = 10): Promise<DesignsResponse> => {
    const response = await ApiService.get<DesignsResponse>(`/designer/designs?page=${page}&limit=${limit}`);
    return response.data as DesignsResponse;
  },

  // Get specific design by ID
  getDesignById: async (designId: string): Promise<Design> => {
    const response = await ApiService.get<Design>(`/designer/designs/${designId}`);
    return response.data as Design;
  },

  // Create new design
  createDesign: async (designData: CreateDesignRequest): Promise<Design> => {
    const response = await ApiService.uploadFiles<Design>('/designer/designs', designData.designImages, {
      name: designData.name,
      description: designData.description,
      tags: JSON.stringify(designData.tags)
    });
    return response.data as Design;
  },

  // Update design
  updateDesign: async (designId: string, designData: UpdateDesignRequest): Promise<Design> => {
    if (designData.designImages && designData.designImages.length > 0) {
      const response = await ApiService.uploadFiles<Design>(`/designer/designs/${designId}`, designData.designImages, {
        name: designData.name,
        description: designData.description,
        tags: designData.tags ? JSON.stringify(designData.tags) : undefined
      });
      return response.data as Design;
    } else {
      const response = await ApiService.put<Design>(`/designer/designs/${designId}`, {
        name: designData.name,
        description: designData.description,
        tags: designData.tags
      });
      return response.data as Design;
    }
  },

  // Delete design
  deleteDesign: async (designId: string): Promise<void> => {
    await ApiService.delete(`/designer/designs/${designId}`);
  },

  // Submit design for approval
  submitDesign: async (designId: string): Promise<Design> => {
    const response = await ApiService.post<Design>(`/designer/designs/${designId}/submit`);
    return response.data as Design;
  },

  // Get all designs (for inventory managers and admins)
  getAllDesigns: async (page = 1, limit = 10, status?: string): Promise<DesignsResponse> => {
    let url = `/inventory/designs?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    const response = await ApiService.get<DesignsResponse>(url);
    return response.data as DesignsResponse;
  }
};

export default designsApi;