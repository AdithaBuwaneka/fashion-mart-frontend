import ApiService from './config';
import { Order, OrderStatus, OrderForm, Payment, PaymentMethod, Address } from '@/lib/types';

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
  }
};

export default ordersApi;