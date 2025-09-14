import ApiService from './config';
import { User } from '@/lib/types';

export interface WebhookEvent {
  type: string;
  data: Record<string, unknown>;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export interface SessionInfo {
  isAuthenticated: boolean;
  user: User | null;
  sessionId?: string;
  expiresAt?: string;
}

export const authApi = {
  // Process Clerk webhook events
  processWebhook: async (webhookEvent: WebhookEvent): Promise<AuthResponse> => {
    return await ApiService.post<AuthResponse>('/auth/webhook', webhookEvent);
  },

  // Get current user profile (can be used after Clerk authentication)
  getCurrentUser: async (): Promise<User> => {
    const response = await ApiService.get<User>('/auth/profile');
    return response.data as User;
  },

  // Get session information
  getSession: async (): Promise<SessionInfo> => {
    const response = await ApiService.get<SessionInfo>('/auth/session');
    return response.data as SessionInfo;
  },

  // Sync user data with backend after Clerk authentication
  syncUserData: async (userData: Partial<User>): Promise<AuthResponse> => {
    return await ApiService.post<AuthResponse>('/auth/sync', userData);
  }
};

export default authApi;