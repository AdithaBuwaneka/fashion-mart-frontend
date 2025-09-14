import ApiService from './config';
import { User, UserRole, Address } from '@/lib/types';

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: Address;
  avatar?: File;
}

export interface CreateReturnRequest {
  orderItemId: string;
  reason: string;
  description?: string;
  returnImages?: File[];
}

export interface ReturnRequest {
  id: string;
  orderItemId: string;
  reason: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export const usersApi = {
  // Admin user management
  getAllUsers: async (page = 1, limit = 20, role?: UserRole): Promise<UsersResponse> => {
    let url = `/admin/users?page=${page}&limit=${limit}`;
    if (role) url += `&role=${role}`;
    const response = await ApiService.get<UsersResponse>(url);
    return response.data as UsersResponse;
  },

  getUserById: async (userId: string): Promise<User> => {
    const response = await ApiService.get<User>(`/admin/users/${userId}`);
    return response.data as User;
  },

  updateUserRole: async (userId: string, role: UserRole): Promise<User> => {
    const response = await ApiService.patch<User>(`/admin/users/${userId}/role`, { role });
    return response.data as User;
  },


  // Customer profile management
  getProfile: async (): Promise<User> => {
    const response = await ApiService.get<User>('/customer/profile');
    return response.data as User;
  },

  updateProfile: async (profileData: UpdateProfileRequest): Promise<User> => {
    if (profileData.avatar) {
      // Handle file upload
      const formData = new FormData();
      if (profileData.firstName) formData.append('firstName', profileData.firstName);
      if (profileData.lastName) formData.append('lastName', profileData.lastName);
      if (profileData.phone) formData.append('phone', profileData.phone);
      if (profileData.address) formData.append('address', JSON.stringify(profileData.address));
      formData.append('profileImage', profileData.avatar);

      const response = await ApiService.uploadFile<User>('/customer/profile', profileData.avatar, {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        address: profileData.address ? JSON.stringify(profileData.address) : undefined
      });
      return response.data as User;
    } else {
      const response = await ApiService.put<User>('/customer/profile', profileData);
      return response.data as User;
    }
  },

  // Return management
  createReturnRequest: async (returnData: CreateReturnRequest): Promise<ReturnRequest> => {
    if (returnData.returnImages && returnData.returnImages.length > 0) {
      const response = await ApiService.uploadFiles<ReturnRequest>('/customer/returns', returnData.returnImages, {
        orderItemId: returnData.orderItemId,
        reason: returnData.reason,
        description: returnData.description
      });
      return response.data as ReturnRequest;
    } else {
      const response = await ApiService.post<ReturnRequest>('/customer/returns', {
        orderItemId: returnData.orderItemId,
        reason: returnData.reason,
        description: returnData.description
      });
      return response.data as ReturnRequest;
    }
  },

  getReturnRequests: async (): Promise<ReturnRequest[]> => {
    const response = await ApiService.get<ReturnRequest[]>('/customer/returns');
    return response.data as ReturnRequest[];
  },

};

export default usersApi;