// src/components/inventory/low-stock-alerts.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  ShoppingCart,
  Settings,
  Bell,
  Clock,
  TrendingDown,
  Package,
  RefreshCw
} from 'lucide-react'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import Link from 'next/link'

// Mock low stock data
const lowStockItems = [
  {
    id: 1,
    sku: 'FS-002',
    name: 'Casual Cotton T-Shirt',
    category: 'T-Shirts',
    currentStock: 12,
    minStock: 25,
    maxStock: 150,
    unitPrice: 24.99,
    supplier: 'Cotton Basics Ltd.',
    lastOrderDate: '2024-06-15',
    averageSales: 8, // per day
    daysUntilStockOut: 1.5,
    alertLevel: 'critical',
    suggestedReorder: 100,
    image: '/images/products/tshirt.jpg'
  },
  {
    id: 2,
    sku: 'FS-005',
    name: 'Silk Scarf Collection',
    category: 'Accessories',
    currentStock: 8,
    minStock: 15,
    maxStock: 50,
    unitPrice: 45.99,
    supplier: 'Silk Elegance',
    lastOrderDate: '2024-06-10',
    averageSales: 2,
    daysUntilStockOut: 4,
    alertLevel: 'warning',
    suggestedReorder: 30,
    image: '/images/products/scarf.jpg'
  },
  {
    id: 3,
    sku: 'FS-007',
    name: 'Designer Handbag',
    category: 'Accessories',
    currentStock: 5,
    minStock: 15,
    maxStock: 40,
    unitPrice: 149.99,
    supplier: 'Premium Accessories',
    lastOrderDate: '2024-06-20',
    averageSales: 1,
    daysUntilStockOut: 5,
    alertLevel: 'warning',
    suggestedReorder: 25,
    image: '/images/products/handbag.jpg'
  },
  {
    id: 4,
    sku: 'FS-009',
    name: 'Winter Wool Sweater',
    category: 'Sweaters',
    currentStock: 3,
    minStock: 10,
    maxStock: 60,
    unitPrice: 89.99,
    supplier: 'Cozy Knits Ltd.',
    lastOrderDate: '2024-06-05',
    averageSales: 3,
    daysUntilStockOut: 1,
    alertLevel: 'critical',
    suggestedReorder: 50,
    image: '/images/products/sweater.jpg'
  }
]

const categories = ['All Categories', 'T-Shirts', 'Accessories', 'Sweaters', 'Dresses', 'Jackets']
const alertLevels = ['All Levels', 'critical', 'warning', 'info']

export function LowStockAlerts() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedAlertLevel, setSelectedAlertLevel] = useState('All Levels')

  const filteredItems = lowStockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory
    const matchesAlertLevel = selectedAlertLevel === 'All Levels' || item.alertLevel === selectedAlertLevel

    return matchesSearch && matchesCategory && matchesAlertLevel
  })

  const getAlertBadge = (level: string) => {
    switch (level) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>
      case 'warning':
        return <Badge variant="default" className="bg-orange-500">Warning</Badge>
      case 'info':
        return <Badge variant="default" className="bg-blue-500">Info</Badge>
      default:
        return <Badge variant="secondary">{level}</Badge>
    }
  }

  const getStockPercentage = (current: number, max: number) => {
    return (current / max) * 100
  }

  const criticalCount = lowStockItems.filter(item => item.alertLevel === 'critical').length
  const warningCount = lowStockItems.filter(item => item.alertLevel === 'warning').length

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      {(criticalCount > 0 || warningCount > 0) && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Stock Alert Summary</AlertTitle>
          <AlertDescription>
            You have {criticalCount} critical and {warningCount} warning level stock alerts requiring attention.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Low Stock Alerts
          </CardTitle>
          <CardDescription>
            Monitor and manage products with low inventory levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
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
            <Select value={selectedAlertLevel} onValueChange={setSelectedAlertLevel}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Alert Level" />
              </SelectTrigger>
              <SelectContent>
                {alertLevels.map(level => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Alerts
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Alert Settings
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Bulk Reorder
              </Button>
            </div>
          </div>

          {/* Alert Items */}
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Product Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            SKU: {item.sku} • {item.category}
                          </p>
                        </div>
                        {getAlertBadge(item.alertLevel)}
                      </div>

                      {/* Stock Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Stock Level</span>
                          <span>{item.currentStock} / {item.maxStock} units</span>
                        </div>
                        <Progress 
                          value={getStockPercentage(item.currentStock, item.maxStock)} 
                          className={`h-2 ${
                            item.alertLevel === 'critical' ? '[&>div]:bg-red-500' : 
                            '[&>div]:bg-orange-500'
                          }`}
                        />
                        <p className="text-xs text-muted-foreground">
                          Minimum stock: {item.minStock} units
                        </p>
                      </div>
                    </div>

                    {/* Stock Details */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Current Stock</p>
                        <p className="font-semibold text-lg">{item.currentStock}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Days Until Out</p>
                        <p className={`font-semibold text-lg ${
                          item.daysUntilStockOut <= 1 ? 'text-red-600' : 
                          item.daysUntilStockOut <= 3 ? 'text-orange-600' : 
                          'text-green-600'
                        }`}>
                          {item.daysUntilStockOut}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg. Sales/Day</p>
                        <p className="font-semibold text-lg">{item.averageSales}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Suggested Reorder</p>
                        <p className="font-semibold text-lg text-blue-600">{item.suggestedReorder}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:min-w-[120px]">
                      <Button size="sm" className="w-full">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Reorder
                      </Button>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href={`/inventory/stock/${item.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        Supplier: {item.supplier}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Last Order: {item.lastOrderDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingDown className="w-4 h-4" />
                        Unit Price: ${item.unitPrice}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No alerts found</h3>
              <p className="text-muted-foreground">
                No low stock alerts match your current filters.
              </p>
            </div>
          )}

          {/* Summary */}
          {filteredItems.length > 0 && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Alerts</p>
                  <p className="font-semibold">{filteredItems.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Critical Items</p>
                  <p className="font-semibold text-red-600">
                    {filteredItems.filter(item => item.alertLevel === 'critical').length}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Estimated Reorder Cost</p>
                  <p className="font-semibold">
                    ${filteredItems.reduce((sum, item) => sum + (item.suggestedReorder * item.unitPrice), 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg. Days Until Out</p>
                  <p className="font-semibold">
                    {(filteredItems.reduce((sum, item) => sum + item.daysUntilStockOut, 0) / filteredItems.length).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
