// src/lib/types/notification.ts
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export type NotificationType = 
  | 'order_created'
  | 'order_updated'
  | 'payment_succeeded'
  | 'payment_failed'
  | 'design_approved'
  | 'design_rejected'
  | 'low_stock_alert'
  | 'return_requested'
  | 'system_announcement';