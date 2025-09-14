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

  // Get payments by date range
  getPaymentsByDateRange: async (startDate: string, endDate: string): Promise<{
    payments: Payment[];
    analytics: {
      totalAmount: number;
      totalCount: number;
      countByStatus: Record<PaymentStatus, number>;
    };
  }> => {
    const url = `/payments/date-range?startDate=${startDate}&endDate=${endDate}`;
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

  // Create payment intent
  createPaymentIntent: async (orderId: string): Promise<{ clientSecret: string; paymentIntentId: string }> => {
    const response = await ApiService.post<{ clientSecret: string; paymentIntentId: string }>(`/payments/${orderId}/intent`, {});
    return response.data as { clientSecret: string; paymentIntentId: string };
  },

  // Process refund - FIXED ENDPOINT TO MATCH BACKEND
  processRefund: async (paymentId: string, amount?: number, reason?: string): Promise<Payment> => {
    const response = await ApiService.post<Payment>(`/payments/${paymentId}/refund`, {
      amount,
      reason
    });
    return response.data as Payment;
  },

};

export default paymentsApi;