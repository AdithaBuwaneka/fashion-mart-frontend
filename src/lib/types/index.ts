// Core types for Fashion Mart application
export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  phone?: string;
  address?: Address;
}

export type UserRole = 'admin' | 'customer' | 'designer' | 'staff' | 'inventory';

export interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  category: Category;
  designId?: string;
  design?: Design;
  images: string[];
  sizes: ProductSize[];
  colors: ProductColor[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  stock: Stock[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  children?: Category[];
}

export interface Design {
  id: string;
  name: string;
  description: string;
  designerId: string;
  designer: User;
  imageUrl: string;
  isApproved: boolean;
  isActive: boolean;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface Stock {
  id: string;
  productId: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
  minThreshold: number;
  lastUpdated: string;
}

export interface ProductSize {
  id: string;
  name: string;
  label: string;
}

export interface ProductColor {
  id: string;
  name: string;
  hexCode: string;
}

export interface Order {
  id: string;
  customerId: string;
  customer: User;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  paymentId?: string;
  payment?: Payment;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'returned';

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

export interface Payment {
  id: string;
  orderId: string;
  order: Order;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = 'card' | 'bank_transfer' | 'cash_on_delivery';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Return {
  id: string;
  orderId: string;
  order: Order;
  customerId: string;
  customer: User;
  reason: string;
  status: ReturnStatus;
  items: ReturnItem[];
  refundAmount: number;
  processedBy?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReturnStatus = 'pending' | 'approved' | 'rejected' | 'processed';

export interface ReturnItem {
  id: string;
  returnId: string;
  orderItemId: string;
  orderItem: OrderItem;
  quantity: number;
  reason: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export type NotificationType = 
  | 'order_update' 
  | 'low_stock' 
  | 'new_design' 
  | 'return_request' 
  | 'payment_update'
  | 'system';

export interface Report {
  id: string;
  title: string;
  type: ReportType;
  generatedBy: string;
  data: Record<string, unknown>;
  filePath?: string;
  createdAt: string;
}

export type ReportType = 'sales' | 'inventory' | 'customers' | 'returns' | 'designs';

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface ProductForm {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  designId?: string;
  images: File[];
  sizes: string[];
  colors: string[];
}

export interface DesignForm {
  name: string;
  description: string;
  image: File;
  tags: string[];
}

export interface OrderForm {
  items: CartItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
}

// Filter and search types
export interface ProductFilters {
  category?: string;
  priceRange?: [number, number];
  sizes?: string[];
  colors?: string[];
  designer?: string;
  inStock?: boolean;
  search?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  dateRange?: [string, string];
  customer?: string;
  minAmount?: number;
  maxAmount?: number;
}

// Dashboard stats types
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockItems: number;
  pendingReturns: number;
  revenueGrowth: number;
  orderGrowth: number;
}

export interface InventoryStats {
  totalProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  pendingDesigns: number;
  totalValue: number;
}

// Socket.io event types
export interface SocketEvents {
  'order-update': (data: { orderId: string; status: OrderStatus }) => void;
  'stock-alert': (data: { productId: string; quantity: number }) => void;
  'new-notification': (notification: Notification) => void;
  'design-approval': (data: { designId: string; approved: boolean }) => void;
}
