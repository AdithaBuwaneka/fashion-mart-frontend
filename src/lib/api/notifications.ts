import ApiService from './config';
import { Notification, NotificationType } from '@/lib/types';

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  limit: number;
}

export interface CreateNotificationRequest {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  priority?: 'low' | 'medium' | 'high';
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  designApprovals: boolean;
  lowStockAlerts: boolean;
  paymentAlerts: boolean;
}

export const notificationsApi = {
  // Get user notifications
  getNotifications: async (page = 1, limit = 20, unreadOnly = false): Promise<NotificationsResponse> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (unreadOnly) params.append('unreadOnly', 'true');

    const response = await ApiService.get<NotificationsResponse>(`/notifications?${params.toString()}`);
    return response.data as NotificationsResponse;
  },

  // Get unread count
  getUnreadCount: async (): Promise<number> => {
    const response = await ApiService.get<{ count: number }>('/notifications/unread-count');
    return (response.data as { count: number }).count;
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<Notification> => {
    const response = await ApiService.patch<Notification>(`/notifications/${notificationId}/read`);
    return response.data as Notification;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<{ success: boolean; count: number }> => {
    const response = await ApiService.patch<{ success: boolean; count: number }>('/notifications/mark-all-read');
    return response.data as { success: boolean; count: number };
  },

  // Delete notification
  deleteNotification: async (notificationId: string): Promise<void> => {
    await ApiService.delete(`/notifications/${notificationId}`);
  },

  // Delete all read notifications
  deleteReadNotifications: async (): Promise<{ success: boolean; count: number }> => {
    const response = await ApiService.delete<{ success: boolean; count: number }>('/notifications/read');
    return response.data as { success: boolean; count: number };
  },

  // Admin: Create notification
  createNotification: async (notificationData: CreateNotificationRequest): Promise<Notification> => {
    const response = await ApiService.post<Notification>('/admin/notifications', notificationData);
    return response.data as Notification;
  },

  // Admin: Send bulk notification
  sendBulkNotification: async (notificationData: {
    userIds?: string[];
    roles?: string[];
    title: string;
    message: string;
    type: NotificationType;
    data?: Record<string, unknown>;
  }): Promise<{ success: boolean; sentCount: number }> => {
    const response = await ApiService.post<{ success: boolean; sentCount: number }>('/admin/notifications/bulk', notificationData);
    return response.data as { success: boolean; sentCount: number };
  },

  // Get notification preferences
  getPreferences: async (): Promise<NotificationPreferences> => {
    const response = await ApiService.get<NotificationPreferences>('/notifications/preferences');
    return response.data as NotificationPreferences;
  },

  // Update notification preferences
  updatePreferences: async (preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> => {
    const response = await ApiService.put<NotificationPreferences>('/notifications/preferences', preferences);
    return response.data as NotificationPreferences;
  },

  // Subscribe to push notifications
  subscribeToPush: async (subscription: PushSubscription): Promise<{ success: boolean }> => {
    const response = await ApiService.post<{ success: boolean }>('/notifications/push/subscribe', {
      subscription: subscription.toJSON()
    });
    return response.data as { success: boolean };
  },

  // Unsubscribe from push notifications
  unsubscribeFromPush: async (): Promise<{ success: boolean }> => {
    const response = await ApiService.post<{ success: boolean }>('/notifications/push/unsubscribe');
    return response.data as { success: boolean };
  }
};

export default notificationsApi;