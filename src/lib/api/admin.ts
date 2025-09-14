import ApiService from './config';
import { DashboardStats, Report } from '@/lib/types';

export interface BillProcessingRequest {
  billImage: File;
  extractFields?: string[];
}

export interface BillProcessingResponse {
  success: boolean;
  extractedData: {
    vendor?: string;
    totalAmount?: number;
    items?: Array<{
      name: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }>;
    date?: string;
    billNumber?: string;
  };
  confidence: number;
  processingTime: number;
}

export interface AdminAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockItems: number;
  pendingReturns: number;
  revenueGrowth: number;
  orderGrowth: number;
  customerGrowth: number;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  topSellingProducts: Array<{
    productId: string;
    productName: string;
    unitsSold: number;
    revenue: number;
  }>;
  orderStatusBreakdown: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
}

export const adminApi = {
  // Get admin dashboard statistics
  getDashboardStats: async (period?: string): Promise<DashboardStats> => {
    const url = period ? `/admin/dashboard/stats?period=${period}` : '/admin/dashboard/stats';
    const response = await ApiService.get<DashboardStats>(url);
    return response.data as DashboardStats;
  },

  // Get detailed admin analytics
  getAnalytics: async (startDate?: string, endDate?: string): Promise<AdminAnalytics> => {
    let url = '/admin/analytics';
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await ApiService.get<AdminAnalytics>(url);
    return response.data as AdminAnalytics;
  },

  // Process bill with AI (Google Cloud Vision)
  processBill: async (billData: BillProcessingRequest): Promise<BillProcessingResponse> => {
    const formData = new FormData();
    formData.append('billImage', billData.billImage);

    if (billData.extractFields) {
      formData.append('extractFields', JSON.stringify(billData.extractFields));
    }

    const response = await ApiService.post<BillProcessingResponse>('/admin/bills/process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data as BillProcessingResponse;
  },

  // Get all reports
  getAllReports: async (page = 1, limit = 20): Promise<{
    reports: Report[];
    total: number;
    page: number;
    limit: number;
  }> => {
    const response = await ApiService.get<{
      reports: Report[];
      total: number;
      page: number;
      limit: number;
    }>(`/admin/reports?page=${page}&limit=${limit}`);
    return response.data as {
      reports: Report[];
      total: number;
      page: number;
      limit: number;
    };
  },

  // Generate monthly report
  generateMonthlyReport: async (month: string, year: number): Promise<Report> => {
    const response = await ApiService.post<Report>('/admin/reports/monthly', {
      month,
      year,
    });
    return response.data as Report;
  },

  // Get report by ID
  getReportById: async (reportId: string): Promise<Report> => {
    const response = await ApiService.get<Report>(`/admin/reports/${reportId}`);
    return response.data as Report;
  },

  // Generate quarterly report
  generateQuarterlyReport: async (quarter: number, year: number): Promise<Report> => {
    const response = await ApiService.post<Report>('/admin/reports/quarterly', {
      quarter,
      year,
    });
    return response.data as Report;
  },

  // Create custom report
  createCustomReport: async (reportData: {
    name: string;
    description?: string;
    filters: Record<string, unknown>;
    dataTypes: string[];
    dateRange: { startDate: string; endDate: string };
  }): Promise<Report> => {
    const response = await ApiService.post<Report>('/admin/reports', reportData);
    return response.data as Report;
  },

  // Delete report
  deleteReport: async (reportId: string): Promise<{ success: boolean; message: string }> => {
    const response = await ApiService.delete<{ success: boolean; message: string }>(`/admin/reports/${reportId}`);
    return response.data as { success: boolean; message: string };
  },

  // Export system data
  exportSystemData: async (dataType: 'users' | 'products' | 'orders' | 'all', format: 'csv' | 'json'): Promise<Blob> => {
    const response = await ApiService.get(`/admin/export/${dataType}?format=${format}`, {
      responseType: 'blob',
    });
    return response.data as Blob;
  },

  // System health check
  getSystemHealth: async (): Promise<{
    database: 'healthy' | 'warning' | 'error';
    redis: 'healthy' | 'warning' | 'error';
    storage: 'healthy' | 'warning' | 'error';
    email: 'healthy' | 'warning' | 'error';
    stripe: 'healthy' | 'warning' | 'error';
    overallStatus: 'healthy' | 'warning' | 'error';
    uptime: number;
    version: string;
  }> => {
    const response = await ApiService.get('/admin/system/health');
    return response.data as {
      database: 'healthy' | 'warning' | 'error';
      redis: 'healthy' | 'warning' | 'error';
      storage: 'healthy' | 'warning' | 'error';
      email: 'healthy' | 'warning' | 'error';
      stripe: 'healthy' | 'warning' | 'error';
      overallStatus: 'healthy' | 'warning' | 'error';
      uptime: number;
      version: string;
    };
  },
};

export default adminApi;