// src/components/inventory/inventory-reports.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Download, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Package, 
  DollarSign,
  Calendar,
  Filter,
  Eye,
  Printer,
  Mail,
  RefreshCw
} from 'lucide-react'

// Mock report data
const reportTemplates = [
  {
    id: 1,
    name: 'Stock Level Report',
    description: 'Current inventory levels across all products',
    category: 'Stock',
    icon: Package,
    frequency: 'Daily',
    lastGenerated: '2024-06-28 09:00',
    status: 'Ready',
    downloadUrl: '/reports/stock-levels.pdf'
  },
  {
    id: 2,
    name: 'Low Stock Alert Report',
    description: 'Items below minimum threshold levels',
    category: 'Alerts',
    icon: TrendingUp,
    frequency: 'Real-time',
    lastGenerated: '2024-06-28 14:30',
    status: 'Ready',
    downloadUrl: '/reports/low-stock.pdf'
  },
  {
    id: 3,
    name: 'Inventory Valuation Report',
    description: 'Total inventory value and cost analysis',
    category: 'Financial',
    icon: DollarSign,
    frequency: 'Monthly',
    lastGenerated: '2024-06-01 00:00',
    status: 'Generating',
    downloadUrl: null
  },
  {
    id: 4,
    name: 'Supplier Performance Report',
    description: 'Delivery times and quality metrics by supplier',
    category: 'Suppliers',
    icon: BarChart3,
    frequency: 'Weekly',
    lastGenerated: '2024-06-24 10:00',
    status: 'Ready',
    downloadUrl: '/reports/supplier-performance.pdf'
  },
  {
    id: 5,
    name: 'Product Movement Report',
    description: 'Stock in/out movements and trends',
    category: 'Movement',
    icon: TrendingUp,
    frequency: 'Daily',
    lastGenerated: '2024-06-28 12:00',
    status: 'Ready',
    downloadUrl: '/reports/product-movement.pdf'
  },
  {
    id: 6,
    name: 'ABC Analysis Report',
    description: 'Product categorization by sales volume',
    category: 'Analytics',
    icon: BarChart3,
    frequency: 'Monthly',
    lastGenerated: '2024-06-01 00:00',
    status: 'Ready',
    downloadUrl: '/reports/abc-analysis.pdf'
  }
]

const recentReports = [
  {
    id: 1,
    name: 'Daily Stock Report - June 28',
    type: 'Stock Level Report',
    generatedAt: '2024-06-28 09:00',
    size: '2.3 MB',
    downloadUrl: '/reports/daily-stock-20240628.pdf'
  },
  {
    id: 2,
    name: 'Low Stock Alert - June 28',
    type: 'Low Stock Alert Report',
    generatedAt: '2024-06-28 14:30',
    size: '856 KB',
    downloadUrl: '/reports/low-stock-20240628.pdf'
  },
  {
    id: 3,
    name: 'Weekly Supplier Performance',
    type: 'Supplier Performance Report',
    generatedAt: '2024-06-24 10:00',
    size: '1.8 MB',
    downloadUrl: '/reports/supplier-weekly-20240624.pdf'
  }
]

const categories = ['All Categories', 'Stock', 'Alerts', 'Financial', 'Suppliers', 'Movement', 'Analytics']

export function InventoryReports() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories')

  const filteredReports = reportTemplates.filter(report => 
    selectedCategory === 'All Categories' || report.category === selectedCategory
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ready':
        return <Badge variant="default" className="bg-green-500">Ready</Badge>
      case 'Generating':
        return <Badge variant="default" className="bg-blue-500">Generating</Badge>
      case 'Failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleGenerateReport = (reportId: number) => {
    console.log('Generating report:', reportId)
    // API call would go here
  }

  const handleDownloadReport = (url: string) => {
    console.log('Downloading report:', url)
    // Download logic would go here
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Inventory Reports
          </CardTitle>
          <CardDescription>
            Generate and manage inventory analysis reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters and Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
            
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Report Templates */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => {
              const IconComponent = report.icon
              return (
                <Card key={report.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{report.name}</h3>
                            <p className="text-sm text-muted-foreground">{report.description}</p>
                          </div>
                        </div>
                        {getStatusBadge(report.status)}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Category:</span>
                          <Badge variant="outline">{report.category}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Frequency:</span>
                          <span>{report.frequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Generated:</span>
                          <span>{report.lastGenerated}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleGenerateReport(report.id)}
                          disabled={report.status === 'Generating'}
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Generate
                        </Button>
                        
                        {report.downloadUrl && report.status === 'Ready' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadReport(report.downloadUrl!)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            Previously generated reports available for download
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{report.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {report.type} • Generated {report.generatedAt} • {report.size}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadReport(report.downloadUrl)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Report Actions</CardTitle>
          <CardDescription>
            Common report operations and export options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Download className="w-6 h-6" />
              Export All Data
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="w-6 h-6" />
              Schedule Reports
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Printer className="w-6 h-6" />
              Print Reports
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Mail className="w-6 h-6" />
              Email Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
