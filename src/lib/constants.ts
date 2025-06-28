// Application constants for Fashion Mart

export const APP_CONFIG = {
  name: 'Fashion Mart',
  description: 'Modern Fashion Marketplace',
  version: '1.0.0',
  author: 'Fashion Mart Team',
} as const;

export const API_ENDPOINTS = {
  // Auth
  auth: '/auth',
  
  // Admin
  admin: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    reports: '/admin/reports',
    billScan: '/admin/bill-scan',
    analytics: '/admin/analytics',
  },
  
  // Customer
  customer: {
    products: '/customer/products',
    orders: '/customer/orders',
    cart: '/customer/cart',
    returns: '/customer/returns',
    profile: '/customer/profile',
    wishlist: '/customer/wishlist',
  },
  
  // Designer
  designer: {
    designs: '/designer/designs',
    upload: '/designer/upload',
    analytics: '/designer/analytics',
    collaboration: '/designer/collaboration',
  },
  
  // Staff
  staff: {
    orders: '/staff/orders',
    returns: '/staff/returns',
    customers: '/staff/customers',
    support: '/staff/support',
  },
  
  // Inventory
  inventory: {
    stock: '/inventory/stock',
    products: '/inventory/products',
    designs: '/inventory/designs',
    reports: '/inventory/reports',
    alerts: '/inventory/alerts',
  },
  
  // General
  orders: '/orders',
  payments: '/payments',
  categories: '/categories',
  notifications: '/notifications',
  upload: '/upload',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
  DESIGNER: 'designer',
  STAFF: 'staff',
  INVENTORY: 'inventory_manager',
} as const;

export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
} as const;

export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const PAYMENT_METHODS = {
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  CASH_ON_DELIVERY: 'cash_on_delivery',
} as const;

export const RETURN_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PROCESSED: 'processed',
} as const;

export const NOTIFICATION_TYPES = {
  ORDER_UPDATE: 'order_update',
  LOW_STOCK: 'low_stock',
  NEW_DESIGN: 'new_design',
  RETURN_REQUEST: 'return_request',
  PAYMENT_UPDATE: 'payment_update',
  SYSTEM: 'system',
} as const;

export const REPORT_TYPES = {
  SALES: 'sales',
  INVENTORY_MANAGER: 'inventory',
  CUSTOMERS: 'customers',
  RETURNS: 'returns',
  DESIGNS: 'designs',
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['application/pdf'],
    ALL: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
  },
  UPLOAD_PATHS: {
    PRODUCTS: '/uploads/products',
    DESIGNS: '/uploads/designs',
    AVATARS: '/uploads/avatars',
    DOCUMENTS: '/uploads/documents',
  },
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  PRODUCTS_PER_PAGE: 12,
  ORDERS_PER_PAGE: 10,
  NOTIFICATIONS_PER_PAGE: 20,
} as const;

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 1000,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  POSTAL_CODE_REGEX: /^\d{5}(-\d{4})?$/,
} as const;

export const CURRENCY = {
  DEFAULT: 'USD',
  SYMBOL: '$',
  DECIMAL_PLACES: 2,
} as const;

export const RETURN_POLICY = {
  WINDOW_DAYS: 7,
  REASONS: [
    'Defective item',
    'Wrong size',
    'Wrong color',
    'Not as described',
    'Changed mind',
    'Damaged during shipping',
    'Other',
  ],
} as const;

export const PRODUCT_SIZES = [
  { value: 'xs', label: 'XS' },
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
  { value: 'l', label: 'L' },
  { value: 'xl', label: 'XL' },
  { value: 'xxl', label: 'XXL' },
] as const;

export const COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Navy', hex: '#001F3F' },
  { name: 'Red', hex: '#FF4136' },
  { name: 'Blue', hex: '#0074D9' },
  { name: 'Green', hex: '#2ECC40' },
  { name: 'Yellow', hex: '#FFDC00' },
  { name: 'Purple', hex: '#B10DC9' },
  { name: 'Pink', hex: '#F012BE' },
  { name: 'Brown', hex: '#8B4513' },
  { name: 'Gray', hex: '#AAAAAA' },
  { name: 'Orange', hex: '#FF851B' },
] as const;

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ORDER_UPDATE: 'order-update',
  STOCK_ALERT: 'stock-alert',
  NEW_NOTIFICATION: 'new-notification',
  DESIGN_APPROVAL: 'design-approval',
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
} as const;

export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  DASHBOARD: '/dashboard',
  
  // Admin routes
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    REPORTS: '/admin/reports',
    ANALYTICS: '/admin/analytics',
  },
  
  // Customer routes
  CUSTOMER: {
    ROOT: '/customer',
    PRODUCTS: '/customer/products',
    PRODUCT_DETAILS: '/customer/products/[id]',
    CART: '/customer/cart',
    CHECKOUT: '/customer/checkout',
    ORDERS: '/customer/orders',
    ORDER_DETAILS: '/customer/orders/[id]',
    RETURNS: '/customer/returns',
    PROFILE: '/customer/profile',
    WISHLIST: '/customer/wishlist',
  },
  
  // Designer routes
  DESIGNER: {
    ROOT: '/designer',
    DASHBOARD: '/designer/dashboard',
    DESIGNS: '/designer/designs',
    UPLOAD: '/designer/upload',
    ANALYTICS: '/designer/analytics',
    COLLABORATION: '/designer/collaboration',
  },
  
  // Staff routes
  STAFF: {
    ROOT: '/staff',
    DASHBOARD: '/staff/dashboard',
    ORDERS: '/staff/orders',
    ORDER_DETAILS: '/staff/orders/[id]',
    RETURNS: '/staff/returns',
    CUSTOMERS: '/staff/customers',
    SUPPORT: '/staff/support',
  },
  
  // Inventory routes
  INVENTORY: {
    ROOT: '/inventory',
    DASHBOARD: '/inventory/dashboard',
    STOCK: '/inventory/stock',
    PRODUCTS: '/inventory/products',
    DESIGNS: '/inventory/designs',
    REPORTS: '/inventory/reports',
    ALERTS: '/inventory/alerts',
  },
} as const;

export const THEME = {
  COLORS: {
    PRIMARY: 'hsl(222.2 84% 4.9%)',
    SECONDARY: 'hsl(210 40% 96%)',
    ACCENT: 'hsl(210 40% 98%)',
    MUTED: 'hsl(210 40% 96%)',
    DESTRUCTIVE: 'hsl(0 84.2% 60.2%)',
    SUCCESS: 'hsl(142.1 76.2% 36.3%)',
    WARNING: 'hsl(47.9 95.8% 53.1%)',
    INFO: 'hsl(212.7 26.8% 83.9%)',
  },
} as const;
