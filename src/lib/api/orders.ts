import ApiService from './config';
import { Order, OrderStatus, PaymentMethod, Address } from '@/lib/types';

export interface OrderAnalytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Array<{
    status: OrderStatus;
    count: number;
    percentage: number;
  }>;
  salesByDate: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    quantitySold: number;
    revenue: number;
  }>;
  topCustomers: Array<{
    customerId: string;
    customerName: string;
    totalOrders: number;
    totalSpent: number;
  }>;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateOrderRequest {
  items: Array<{
    productId: string;
    quantity: number;
    size: string;
    color: string;
    price: number;
  }>;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
}

export interface CreatePaymentIntentRequest {
  orderId: string;
  amount: number;
  currency?: string;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface ConfirmPaymentRequest {
  orderId: string;
  paymentIntentId: string;
  paymentMethodId: string;
}

export const ordersApi = {
  // Get all orders for current user
  getOrders: async (page = 1, limit = 10): Promise<OrdersResponse> => {
    const response = await ApiService.get<OrdersResponse>(`/customer/orders?page=${page}&limit=${limit}`);
    return response.data as OrdersResponse;
  },

  // Get specific order by ID
  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await ApiService.get<Order>(`/customer/orders/${orderId}`);
    return response.data as Order;
  },

  // Create new order
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    const response = await ApiService.post<Order>('/customer/orders', orderData);
    return response.data as Order;
  },

  // Create payment intent for order
  createPaymentIntent: async (paymentData: CreatePaymentIntentRequest): Promise<PaymentIntent> => {
    const response = await ApiService.post<PaymentIntent>(
      `/customer/orders/${paymentData.orderId}/payment`,
      paymentData
    );
    return response.data as PaymentIntent;
  },

  // Confirm payment for order
  confirmPayment: async (confirmData: ConfirmPaymentRequest): Promise<Order> => {
    const response = await ApiService.post<Order>(
      `/customer/orders/${confirmData.orderId}/payment/confirm`,
      confirmData
    );
    return response.data as Order;
  },


  // Update order status (admin/staff only)
  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<Order> => {
    const response = await ApiService.put<Order>(`/orders/${orderId}/status`, { status });
    return response.data as Order;
  },

  // Get all orders (admin/staff only)
  getAllOrders: async (page = 1, limit = 10, status?: OrderStatus): Promise<OrdersResponse> => {
    let url = `/orders?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    const response = await ApiService.get<OrdersResponse>(url);
    return response.data as OrdersResponse;
  },

  // Get order analytics - MISSING ENDPOINT IMPLEMENTATION
  getOrderAnalytics: async (startDate?: string, endDate?: string): Promise<OrderAnalytics> => {
    let url = '/orders/analytics';
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await ApiService.get<OrderAnalytics>(url);
    return response.data as OrderAnalytics;
  },

  // Export orders
  exportOrders: async (format: 'csv' | 'pdf' | 'excel' = 'csv', filters?: {
    startDate?: string;
    endDate?: string;
    status?: OrderStatus;
    customerId?: string;
  }): Promise<Blob> => {
    let url = `/orders/export?format=${format}`;
    if (filters) {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.status) params.append('status', filters.status);
      if (filters.customerId) params.append('customerId', filters.customerId);
      if (params.toString()) url += `&${params.toString()}`;
    }

    const response = await ApiService.get(url, {
      responseType: 'blob'
    });
    return response.data as Blob;
  },

};

export default ordersApi;

// Export types for use in components
export type { OrderAnalytics };