// src/lib/types/payment.ts
export interface Payment {
  id: string;
  orderId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'cancelled';