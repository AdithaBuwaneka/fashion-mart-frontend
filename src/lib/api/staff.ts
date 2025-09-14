import ApiService from './config';
import { Order, OrderStatus } from '@/lib/types';
import { ReturnRequest } from './users';

export interface PendingOrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface AssignedOrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface PendingReturnsResponse {
  returns: ReturnRequest[];
  total: number;
  page: number;
  limit: number;
}

export interface AssignedReturnsResponse {
  returns: ReturnRequest[];
  total: number;
  page: number;
  limit: number;
}

export interface AssignOrderRequest {
  orderId: string;
  staffId?: string; // If not provided, assigns to current staff member
}

export interface AssignReturnRequest {
  returnId: string;
  staffId?: string; // If not provided, assigns to current staff member
}

export interface ProcessReturnRequest {
  returnId: string;
  status: 'approved' | 'rejected' | 'completed';
  notes?: string;
}

export const staffApi = {
  // Order management
  getPendingOrders: async (page = 1, limit = 10): Promise<PendingOrdersResponse> => {
    const response = await ApiService.get<PendingOrdersResponse>(`/staff/orders/pending?page=${page}&limit=${limit}`);
    return response.data as PendingOrdersResponse;
  },

  getAssignedOrders: async (page = 1, limit = 10): Promise<AssignedOrdersResponse> => {
    const response = await ApiService.get<AssignedOrdersResponse>(`/staff/orders/assigned?page=${page}&limit=${limit}`);
    return response.data as AssignedOrdersResponse;
  },

  assignOrder: async (assignData: AssignOrderRequest): Promise<Order> => {
    const response = await ApiService.post<Order>(`/staff/orders/${assignData.orderId}/assign`, {
      staffId: assignData.staffId
    });
    return response.data as Order;
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<Order> => {
    const response = await ApiService.put<Order>(`/staff/orders/${orderId}/status`, {
      status
    });
    return response.data as Order;
  },

  // Return management
  getPendingReturns: async (page = 1, limit = 10): Promise<PendingReturnsResponse> => {
    const response = await ApiService.get<PendingReturnsResponse>(`/staff/returns/pending?page=${page}&limit=${limit}`);
    return response.data as PendingReturnsResponse;
  },

  getAssignedReturns: async (page = 1, limit = 10): Promise<AssignedReturnsResponse> => {
    const response = await ApiService.get<AssignedReturnsResponse>(`/staff/returns/assigned?page=${page}&limit=${limit}`);
    return response.data as AssignedReturnsResponse;
  },

  assignReturn: async (assignData: AssignReturnRequest): Promise<ReturnRequest> => {
    const response = await ApiService.post<ReturnRequest>(`/staff/returns/${assignData.returnId}/assign`, {
      staffId: assignData.staffId
    });
    return response.data as ReturnRequest;
  },

  processReturn: async (processData: ProcessReturnRequest): Promise<ReturnRequest> => {
    const response = await ApiService.put<ReturnRequest>(`/staff/returns/${processData.returnId}/process`, {
      status: processData.status,
      notes: processData.notes
    });
    return response.data as ReturnRequest;
  }
};

export default staffApi;