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

export type UserRole = 'admin' | 'customer' | 'designer' | 'staff' | 'inventory_manager';

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
  pendingDesigns: number;
  activeDesigners: number;
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

// Staff and Support types
export interface SupportTicket {
  id: string;
  customerId: string;
  customer: User;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  assignedToId?: string;
  assignedTo?: User;
  messages: SupportMessage[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export type TicketStatus = 'open' | 'in_progress' | 'pending_customer' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'order_issue' | 'payment_problem' | 'product_inquiry' | 'account_issue' | 'technical_support' | 'other';

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  sender: User;
  message: string;
  isStaffReply: boolean;
  attachments?: string[];
  createdAt: string;
}

export interface StaffTask {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  assignedToId: string;
  assignedTo: User;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export type TaskType = 'order_processing' | 'customer_support' | 'return_processing' | 'quality_check' | 'inventory_update' | 'other';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface StaffPerformance {
  id: string;
  staffId: string;
  staff: User;
  period: string;
  ordersProcessed: number;
  averageProcessingTime: number;
  ticketsResolved: number;
  customerSatisfactionScore: number;
  qualityScore: number;
  createdAt: string;
}

export interface QualityCheck {
  id: string;
  orderId: string;
  order: Order;
  checkedById: string;
  checkedBy: User;
  status: QualityStatus;
  issues: QualityIssue[];
  notes?: string;
  checkedAt: string;
}

export type QualityStatus = 'passed' | 'failed' | 'needs_review';

export interface QualityIssue {
  id: string;
  type: string;
  description: string;
  severity: 'minor' | 'major' | 'critical';
  resolved: boolean;
}

// Staff dashboard stats
export interface StaffStats {
  pendingOrders: number;
  activeTickets: number;
  todayTasks: number;
  overdueItems: number;
  averageResponseTime: number;
  completionRate: number;
}
