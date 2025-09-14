import ApiService from './config';
import { DashboardStats } from '@/lib/types';

export interface SalesReport {
  period: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    unitsSold: number;
    revenue: number;
  }>;
  salesByDate: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export interface InventoryReport {
  totalProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalStockValue: number;
  categoryBreakdown: Array<{
    categoryId: string;
    categoryName: string;
    productCount: number;
    stockValue: number;
  }>;
  lowStockProducts: Array<{
    productId: string;
    productName: string;
    currentStock: number;
    reorderLevel: number;
  }>;
}

export interface CustomerReport {
  totalCustomers: number;
  newCustomers: number;
  activeCustomers: number;
  customerGrowthRate: number;
  topCustomers: Array<{
    customerId: string;
    customerName: string;
    totalOrders: number;
    totalSpent: number;
  }>;
  customersByRegion: Array<{
    region: string;
    customerCount: number;
  }>;
}

export interface RevenueReport {
  totalRevenue: number;
  revenueGrowth: number;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  revenueByCategory: Array<{
    categoryId: string;
    categoryName: string;
    revenue: number;
    percentage: number;
  }>;
  paymentMethodBreakdown: Array<{
    method: string;
    amount: number;
    count: number;
  }>;
}

export interface ReportParams {
  startDate?: string;
  endDate?: string;
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  categoryId?: string;
  customerId?: string;
}

export const reportsApi = {
  // Dashboard statistics (Admin)
  getAdminDashboardStats: async (period?: string): Promise<DashboardStats> => {
    const url = period ? `/admin/dashboard/stats?period=${period}` : '/admin/dashboard/stats';
    const response = await ApiService.get<DashboardStats>(url);
    return response.data as DashboardStats;
  },

  // General dashboard statistics
  getDashboardStats: async (period?: string): Promise<DashboardStats> => {
    const url = period ? `/reports/dashboard?period=${period}` : '/reports/dashboard';
    const response = await ApiService.get<DashboardStats>(url);
    return response.data as DashboardStats;
  },

  // Sales reports
  getSalesReport: async (params: ReportParams = {}): Promise<SalesReport> => {
    const searchParams = new URLSearchParams();
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);
    if (params.period) searchParams.append('period', params.period);
    if (params.categoryId) searchParams.append('categoryId', params.categoryId);

    const url = `/reports/sales${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await ApiService.get<SalesReport>(url);
    return response.data as SalesReport;
  },

  // Inventory reports
  getInventoryReport: async (params: ReportParams = {}): Promise<InventoryReport> => {
    const searchParams = new URLSearchParams();
    if (params.categoryId) searchParams.append('categoryId', params.categoryId);

    const url = `/reports/inventory${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await ApiService.get<InventoryReport>(url);
    return response.data as InventoryReport;
  },

  // Customer reports
  getCustomerReport: async (params: ReportParams = {}): Promise<CustomerReport> => {
    const searchParams = new URLSearchParams();
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);
    if (params.period) searchParams.append('period', params.period);

    const url = `/reports/customers${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await ApiService.get<CustomerReport>(url);
    return response.data as CustomerReport;
  },

  // Revenue reports
  getRevenueReport: async (params: ReportParams = {}): Promise<RevenueReport> => {
    const searchParams = new URLSearchParams();
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);
    if (params.period) searchParams.append('period', params.period);
    if (params.categoryId) searchParams.append('categoryId', params.categoryId);

    const url = `/reports/revenue${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await ApiService.get<RevenueReport>(url);
    return response.data as RevenueReport;
  },

  // Export reports
  exportReport: async (reportType: 'sales' | 'inventory' | 'customers' | 'revenue', format: 'pdf' | 'csv', params: ReportParams = {}): Promise<Blob> => {
    const searchParams = new URLSearchParams();
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);
    if (params.period) searchParams.append('period', params.period);
    if (params.categoryId) searchParams.append('categoryId', params.categoryId);
    if (params.customerId) searchParams.append('customerId', params.customerId);
    searchParams.append('format', format);

    const url = `/reports/${reportType}/export${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await ApiService.get(url, {
      responseType: 'blob'
    });
    return response.data as Blob;
  },

  // Get all reports (admin)
  getAllReports: async (): Promise<Report[]> => {
    const response = await ApiService.get<Report[]>('/admin/reports');
    return response.data as Report[];
  },

  // Generate monthly report (admin)
  generateMonthlyReport: async (month: string, year: number): Promise<Report> => {
    const response = await ApiService.post<Report>('/admin/reports/monthly', {
      month,
      year
    });
    return response.data as Report;
  },

  // Schedule reports
  scheduleReport: async (reportConfig: {
    reportType: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    format: 'pdf' | 'csv';
    params: ReportParams;
  }): Promise<{ success: boolean; message: string }> => {
    const response = await ApiService.post<{ success: boolean; message: string }>('/reports/schedule', reportConfig);
    return response.data as { success: boolean; message: string };
  }
};

export default reportsApi;