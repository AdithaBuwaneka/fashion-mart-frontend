import ApiService from './config';

export interface HealthCheckResponse {
  status: string;
  message: string;
  timestamp: string;
}

export interface SystemStats {
  uptime: number;
  memoryUsage: {
    rss: number;
    heapUsed: number;
    heapTotal: number;
    external: number;
    arrayBuffers: number;
  };
  cpuUsage: {
    user: number;
    system: number;
  };
  databaseStatus: 'connected' | 'disconnected' | 'error';
  activeConnections: number;
  totalRequests: number;
  averageResponseTime: number;
}

export const systemApi = {
  // Health check endpoint (public)
  getHealthCheck: async (): Promise<HealthCheckResponse> => {
    const response = await ApiService.get<HealthCheckResponse>('/health');
    return response.data as HealthCheckResponse;
  },

  // System statistics (admin only)
  getSystemStats: async (): Promise<SystemStats> => {
    const response = await ApiService.get<SystemStats>('/admin/system/stats');
    return response.data as SystemStats;
  },

  // System health details (admin only)
  getSystemHealth: async (): Promise<{
    database: 'healthy' | 'warning' | 'error';
    redis: 'healthy' | 'warning' | 'error';
    storage: 'healthy' | 'warning' | 'error';
    email: 'healthy' | 'warning' | 'error';
    stripe: 'healthy' | 'warning' | 'error';
    overallStatus: 'healthy' | 'warning' | 'error';
    timestamp: string;
    details: Record<string, any>;
  }> => {
    const response = await ApiService.get<{
      database: 'healthy' | 'warning' | 'error';
      redis: 'healthy' | 'warning' | 'error';
      storage: 'healthy' | 'warning' | 'error';
      email: 'healthy' | 'warning' | 'error';
      stripe: 'healthy' | 'warning' | 'error';
      overallStatus: 'healthy' | 'warning' | 'error';
      timestamp: string;
      details: Record<string, any>;
    }>('/admin/system/health');
    return response.data as {
      database: 'healthy' | 'warning' | 'error';
      redis: 'healthy' | 'warning' | 'error';
      storage: 'healthy' | 'warning' | 'error';
      email: 'healthy' | 'warning' | 'error';
      stripe: 'healthy' | 'warning' | 'error';
      overallStatus: 'healthy' | 'warning' | 'error';
      timestamp: string;
      details: Record<string, any>;
    };
  },

  // Restart system services (admin only)
  restartServices: async (services: string[]): Promise<{
    success: boolean;
    message: string;
    restartedServices: string[];
    failedServices: string[];
  }> => {
    const response = await ApiService.post<{
      success: boolean;
      message: string;
      restartedServices: string[];
      failedServices: string[];
    }>('/admin/system/restart', { services });
    return response.data as {
      success: boolean;
      message: string;
      restartedServices: string[];
      failedServices: string[];
    };
  }
};

export default systemApi;