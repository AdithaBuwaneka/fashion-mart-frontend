'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { Report, ReportType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  TrendingUp,
  Users,
  Package,
  RotateCcw,
  Palette,
  Plus,
  Loader2
} from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { LoadingScreen } from '@/components/shared/loading-screen';

interface ReportFilters {
  startDate: string;
  endDate: string;
  type: ReportType;
}

export function ReportsGenerator() {
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    type: 'sales',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: reportsData, isLoading, refetch } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: async () => {
      return await adminApi.getAllReports(1, 50);
    },
  });

  const reports = reportsData?.reports || [];

  const generateReportMutation = useMutation({
    mutationFn: async (filters: ReportFilters): Promise<Report> => {
      const date = new Date(filters.startDate);
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();

      const response = await adminApi.generateMonthlyReport(month, year);
      return response.data as unknown as Report;
    },
    onSuccess: () => {
      refetch();
      setIsGenerating(false);
    },
    onError: () => {
      setIsGenerating(false);
    },
  });

  const downloadReport = async () => {
    try {
      // Note: Download endpoint not implemented in backend yet
      console.error('Report download not implemented in backend');
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    generateReportMutation.mutate(filters);
  };

  const reportTypes = [
    { value: 'sales', label: 'Sales Report', icon: TrendingUp, description: 'Revenue, orders, and sales performance' },
    { value: 'inventory', label: 'Inventory Report', icon: Package, description: 'Stock levels, low inventory alerts' },
    { value: 'customers', label: 'Customer Report', icon: Users, description: 'Customer analytics and behavior' },
    { value: 'returns', label: 'Returns Report', icon: RotateCcw, description: 'Return requests and processing' },
    { value: 'designs', label: 'Design Report', icon: Palette, description: 'Design performance and royalties' },
  ] as const;

  const getReportIcon = (type: ReportType) => {
    const reportType = reportTypes.find(r => r.value === type);
    return reportType ? reportType.icon : FileText;
  };

  const getReportTypeBadge = (type: ReportType) => {
    const colors = {
      sales: 'bg-green-100 text-green-800',
      inventory: 'bg-blue-100 text-blue-800',
      customers: 'bg-purple-100 text-purple-800',
      returns: 'bg-red-100 text-red-800',
      designs: 'bg-yellow-100 text-yellow-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports Generator</h1>
          <p className="text-gray-600 mt-2">
            Generate comprehensive business reports with data export
          </p>
        </div>
      </div>

      {/* Report Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generator Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Generate New Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Report Type */}
            <div className="space-y-2">
              <Label>Report Type</Label>
              <div className="space-y-2">
                {reportTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      filters.type === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFilters(prev => ({ ...prev, type: type.value }))}
                  >
                    <div className="flex items-center space-x-3">
                      <type.icon className="h-5 w-5 text-gray-600" />
                      <div>
                        <div className="font-medium text-sm">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="startDate" className="text-xs text-gray-500">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-xs text-gray-500">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <Button 
              onClick={handleGenerateReport} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Reports ({reports?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports?.slice(0, 10).map((report) => {
                const IconComponent = getReportIcon(report.type);
                
                return (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{report.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getReportTypeBadge(report.type)}>
                            {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {format(new Date(report.createdAt), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadReport()}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              {(!reports || reports.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No reports generated yet</p>
                  <p className="text-sm">Generate your first report to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Types Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Available Report Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((type) => (
              <div key={type.value} className="p-4 border rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <type.icon className="h-6 w-6 text-blue-600" />
                  <h3 className="font-medium">{type.label}</h3>
                </div>
                <p className="text-sm text-gray-600">{type.description}</p>
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFilters(prev => ({ ...prev, type: type.value }));
                      handleGenerateReport();
                    }}
                  >
                    Generate Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
