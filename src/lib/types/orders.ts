// src/lib/types/order.ts
export interface Order {
  id: string;
  customerId: string;
  customer: User;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  paymentId?: string;
  payment?: Payment;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  size: string;
  color: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}