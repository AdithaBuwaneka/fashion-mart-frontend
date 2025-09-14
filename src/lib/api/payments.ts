import ApiService from './config';
import { Payment, PaymentStatus } from '@/lib/types';

export interface PaymentsResponse {
  payments: Payment[];
  total: number;
  page: number;
  limit: number;
}

export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
}

export interface ProcessRefundRequest {
  paymentId: string;
  amount?: number;
  reason: string;
}

export interface PaymentStats {
  totalRevenue: number;
  totalTransactions: number;
  successfulPayments: number;
  failedPayments: number;
  refundedAmount: number;
  averageTransactionValue: number;
}

export const paymentsApi = {
  // Get all payments (admin/staff only) - FIXED ENDPOINT
  getAllPayments: async (page = 1, limit = 10, status?: PaymentStatus): Promise<PaymentsResponse> => {
    let url = `/payments?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    const response = await ApiService.get<PaymentsResponse>(url);
    return response.data as PaymentsResponse;
  },

  // Get payments by date range - MISSING ENDPOINT IMPLEMENTATION
  getPaymentsByDateRange: async (startDate: string, endDate: string): Promise<{
    payments: Payment[];
    analytics: {
      totalAmount: number;
      totalCount: number;
      countByStatus: Record<PaymentStatus, number>;
    };
  }> => {
    const url = `/payments/range?startDate=${startDate}&endDate=${endDate}`;
    const response = await ApiService.get<{
      payments: Payment[];
      analytics: {
        totalAmount: number;
        totalCount: number;
        countByStatus: Record<PaymentStatus, number>;
      };
    }>(url);
    return response.data as {
      payments: Payment[];
      analytics: {
        totalAmount: number;
        totalCount: number;
        countByStatus: Record<PaymentStatus, number>;
      };
    };
  },

  // Get specific payment by ID
  getPaymentById: async (paymentId: string): Promise<Payment> => {
    const response = await ApiService.get<Payment>(`/payments/${paymentId}`);
    return response.data as Payment;
  },

  // Create payment
  createPayment: async (paymentData: CreatePaymentRequest): Promise<Payment> => {
    const response = await ApiService.post<Payment>('/payments', paymentData);
    return response.data as Payment;
  },

  // Process refund - FIXED ENDPOINT TO MATCH BACKEND
  processRefund: async (paymentId: string, amount?: number, reason?: string): Promise<Payment> => {
    const response = await ApiService.post<Payment>(`/payments/${paymentId}/refund`, {
      amount,
      reason
    });
    return response.data as Payment;
  },

  // Update payment status
  updatePaymentStatus: async (paymentId: string, status: PaymentStatus): Promise<Payment> => {
    const response = await ApiService.patch<Payment>(`/payments/${paymentId}/status`, { status });
    return response.data as Payment;
  },

  // Get payment statistics
  getPaymentStats: async (startDate?: string, endDate?: string): Promise<PaymentStats> => {
    let url = '/payments/stats';
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await ApiService.get<PaymentStats>(url);
    return response.data as PaymentStats;
  },

  // Webhook endpoint for payment providers (Stripe, etc.)
  handleWebhook: async (webhookData: Record<string, unknown>): Promise<{ success: boolean; message: string }> => {
    const response = await ApiService.post<{ success: boolean; message: string }>('/payments/webhook', webhookData);
    return response.data as { success: boolean; message: string };
  }
};

export default paymentsApi;