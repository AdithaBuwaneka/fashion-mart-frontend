// Validation schemas using Zod for Fashion Mart
import { z } from 'zod';
import { VALIDATION, USER_ROLES, ORDER_STATUSES, PAYMENT_METHODS, RETURN_STATUSES } from '@/lib/constants';

// Common validation patterns
const phoneSchema = z.string().regex(VALIDATION.PHONE_REGEX, 'Invalid phone number format');
const passwordSchema = z.string().min(VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`);
const nameSchema = z.string().min(VALIDATION.NAME_MIN_LENGTH).max(VALIDATION.NAME_MAX_LENGTH);

// Address validation
export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().regex(VALIDATION.POSTAL_CODE_REGEX, 'Invalid postal code'),
  country: z.string().min(1, 'Country is required'),
  isDefault: z.boolean().optional(),
});

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  confirmPassword: z.string(),
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema.optional(),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const changePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmNewPassword: z.string(),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: 'New passwords do not match',
  path: ['confirmNewPassword'],
}).refine(data => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword'],
});

// User schemas
export const userProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: z.string().email('Invalid email address'),
  phone: phoneSchema.optional(),
  avatar: z.string().url().optional(),
});

export const userCreateSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: nameSchema,
  lastName: nameSchema,
  role: z.enum([USER_ROLES.ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.DESIGNER, USER_ROLES.STAFF, USER_ROLES.INVENTORY]),
  phone: phoneSchema.optional(),
  isActive: z.boolean().default(true),
});

// Product schemas
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  description: z.string().min(1, 'Description is required').max(VALIDATION.DESCRIPTION_MAX_LENGTH),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  categoryId: z.string().min(1, 'Category is required'),
  designId: z.string().optional(),
  sizes: z.array(z.string()).min(1, 'At least one size is required'),
  colors: z.array(z.string()).min(1, 'At least one color is required'),
  isActive: z.boolean().default(true),
});

export const productFilterSchema = z.object({
  category: z.string().optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  designer: z.string().optional(),
  inStock: z.boolean().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'price', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(12),
});

// Category schemas
export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  description: z.string().max(500).optional(),
  parentId: z.string().optional(),
  isActive: z.boolean().default(true),
});

// Design schemas
export const designSchema = z.object({
  name: z.string().min(1, 'Design name is required').max(200),
  description: z.string().min(1, 'Description is required').max(VALIDATION.DESCRIPTION_MAX_LENGTH),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed'),
});

export const designApprovalSchema = z.object({
  designId: z.string().min(1, 'Design ID is required'),
  approved: z.boolean(),
  feedback: z.string().max(500).optional(),
});

// Stock schemas
export const stockSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  size: z.string().min(1, 'Size is required'),
  color: z.string().min(1, 'Color is required'),
  quantity: z.number().min(0, 'Quantity cannot be negative'),
  minThreshold: z.number().min(0, 'Minimum threshold cannot be negative'),
});

export const stockUpdateSchema = z.object({
  quantity: z.number().min(0, 'Quantity cannot be negative'),
  operation: z.enum(['set', 'add', 'subtract']),
});

// Order schemas
export const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  size: z.string().min(1, 'Size is required'),
  color: z.string().min(1, 'Color is required'),
});

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  paymentMethod: z.enum([PAYMENT_METHODS.CARD, PAYMENT_METHODS.BANK_TRANSFER, PAYMENT_METHODS.CASH_ON_DELIVERY]),
  specialInstructions: z.string().max(500).optional(),
});

export const orderUpdateSchema = z.object({
  status: z.enum([
    ORDER_STATUSES.PENDING,
    ORDER_STATUSES.CONFIRMED,
    ORDER_STATUSES.PROCESSING,
    ORDER_STATUSES.SHIPPED,
    ORDER_STATUSES.DELIVERED,
    ORDER_STATUSES.CANCELLED,
    ORDER_STATUSES.RETURNED,
  ]),
  trackingNumber: z.string().optional(),
  estimatedDelivery: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export const orderFilterSchema = z.object({
  status: z.string().optional(),
  customerId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'totalAmount', 'status']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

// Return schemas
export const returnItemSchema = z.object({
  orderItemId: z.string().min(1, 'Order item ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  reason: z.string().min(1, 'Reason is required').max(200),
});

export const returnSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  items: z.array(returnItemSchema).min(1, 'At least one item is required'),
  reason: z.string().min(1, 'Overall return reason is required').max(500),
  additionalNotes: z.string().max(1000).optional(),
});

export const returnProcessSchema = z.object({
  status: z.enum([RETURN_STATUSES.APPROVED, RETURN_STATUSES.REJECTED, RETURN_STATUSES.PROCESSED]),
  refundAmount: z.number().min(0).optional(),
  processingNotes: z.string().max(500).optional(),
});

// Payment schemas
export const paymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  paymentMethod: z.enum([PAYMENT_METHODS.CARD, PAYMENT_METHODS.BANK_TRANSFER, PAYMENT_METHODS.CASH_ON_DELIVERY]),
});

// Cart schemas
export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(10, 'Maximum 10 items per product'),
  size: z.string().min(1, 'Size is required'),
  color: z.string().min(1, 'Color is required'),
});

export const cartUpdateSchema = z.object({
  quantity: z.number().min(0, 'Quantity cannot be negative').max(10, 'Maximum 10 items per product'),
});

// Notification schemas
export const notificationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  message: z.string().min(1, 'Message is required').max(500),
  type: z.enum(['order_update', 'low_stock', 'new_design', 'return_request', 'payment_update', 'system']),
  userId: z.string().min(1, 'User ID is required'),
  metadata: z.record(z.unknown()).optional(),
});

// Report schemas
export const reportGenerateSchema = z.object({
  type: z.enum(['sales', 'inventory', 'customers', 'returns', 'designs']),
  dateFrom: z.string().min(1, 'Start date is required'),
  dateTo: z.string().min(1, 'End date is required'),
  filters: z.record(z.unknown()).optional(),
  format: z.enum(['pdf', 'excel', 'csv']).default('pdf'),
});

// Search schemas
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  category: z.string().optional(),
  filters: z.record(z.unknown()).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(12),
});

// File upload schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  category: z.enum(['product', 'design', 'avatar', 'document']),
});

export const multipleFileUploadSchema = z.object({
  files: z.array(z.instanceof(File)).min(1, 'At least one file is required').max(10, 'Maximum 10 files allowed'),
  category: z.enum(['product', 'design', 'avatar', 'document']),
});

// Settings schemas
export const settingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteDescription: z.string().max(500),
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: phoneSchema,
  address: addressSchema,
  currency: z.string().length(3, 'Currency must be 3 characters'),
  taxRate: z.number().min(0).max(1, 'Tax rate must be between 0 and 1'),
  shippingRate: z.number().min(0),
  returnWindowDays: z.number().min(1).max(365),
  maxFileSize: z.number().min(1024), // In bytes
  allowedFileTypes: z.array(z.string()),
});

// Export all schemas as a single object for easier imports
export const schemas = {
  // Auth
  login: loginSchema,
  register: registerSchema,
  resetPassword: resetPasswordSchema,
  changePassword: changePasswordSchema,
  
  // User
  userProfile: userProfileSchema,
  userCreate: userCreateSchema,
  
  // Product
  product: productSchema,
  productFilter: productFilterSchema,
  
  // Category
  category: categorySchema,
  
  // Design
  design: designSchema,
  designApproval: designApprovalSchema,
  
  // Stock
  stock: stockSchema,
  stockUpdate: stockUpdateSchema,
  
  // Order
  order: orderSchema,
  orderUpdate: orderUpdateSchema,
  orderFilter: orderFilterSchema,
  orderItem: orderItemSchema,
  
  // Return
  return: returnSchema,
  returnProcess: returnProcessSchema,
  returnItem: returnItemSchema,
  
  // Payment
  payment: paymentSchema,
  
  // Cart
  cartItem: cartItemSchema,
  cartUpdate: cartUpdateSchema,
  
  // Notification
  notification: notificationSchema,
  
  // Report
  reportGenerate: reportGenerateSchema,
  
  // Search
  search: searchSchema,
  
  // File Upload
  fileUpload: fileUploadSchema,
  multipleFileUpload: multipleFileUploadSchema,
  
  // Settings
  settings: settingsSchema,
  
  // Common
  address: addressSchema,
};
