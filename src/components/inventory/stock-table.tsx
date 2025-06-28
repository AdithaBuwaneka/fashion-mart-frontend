// src/components/inventory/stock-table.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  Plus, 
  Minus, 
  Eye, 
  Edit, 
  AlertTriangle,
  Package,
  MoreHorizontal,
  Download,
  Scan
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

// Mock stock data
const stockData = [
  {
    id: 1,
    sku: 'FS-001',
    name: 'Summer Floral Dress',
    category: 'Dresses',
    currentStock: 45,
    minStock: 20,
    maxStock: 100,
    unitPrice: 79.99,
    totalValue: 3599.55,
    supplier: 'Fashion Forward Co.',
    lastUpdated: '2024-06-28',
    status: 'in-stock'
  },
  {
    id: 2,
    sku: 'FS-002',
    name: 'Casual Cotton T-Shirt',
    category: 'T-Shirts',
    currentStock: 12,
    minStock: 25,
    maxStock: 150,
    unitPrice: 24.99,
    totalValue: 299.88,
    supplier: 'Cotton Basics Ltd.',
    lastUpdated: '2024-06-27',
    status: 'low-stock'
  },
  {
    id: 3,
    sku: 'FS-003',
    name: 'Designer Leather Jacket',
    category: 'Jackets',
    currentStock: 0,
    minStock: 5,
    maxStock: 30,
    unitPrice: 299.99,
    totalValue: 0,
    supplier: 'Premium Leather Co.',
    lastUpdated: '2024-06-25',
    status: 'out-of-stock'
  },
  {
    id: 4,
    sku: 'FS-004',
    name: 'Denim Jeans Classic',
    category: 'Jeans',
    currentStock: 78,
    minStock: 30,
    maxStock: 120,
    unitPrice: 89.99,
    totalValue: 7019.22,
    supplier: 'Denim Masters Inc.',
    lastUpdated: '2024-06-28',
    status: 'in-stock'
  },
  {
    id: 5,
    sku: 'FS-005',
    name: 'Silk Scarf Collection',
    category: 'Accessories',
    currentStock: 8,
    minStock: 15,
    maxStock: 50,
    unitPrice: 45.99,
    totalValue: 367.92,
    supplier: 'Silk Elegance',
    lastUpdated: '2024-06-26',
    status: 'low-stock'
  }
]

const categories = ['All Categories', 'Dresses', 'T-Shirts', 'Jackets', 'Jeans', 'Accessories']
const suppliers = ['All Suppliers', 'Fashion Forward Co.', 'Cotton Basics Ltd.', 'Premium Leather Co.', 'Denim Masters Inc.', 'Silk Elegance']

export function StockTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedSupplier, setSelectedSupplier] = useState('All Suppliers')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const filteredStock = stockData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory
    const matchesSupplier = selectedSupplier === 'All Suppliers' || item.supplier === selectedSupplier
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus

    return matchesSearch && matchesCategory && matchesSupplier && matchesStatus
  })

  const getStatusBadge = (status: string, currentStock: number, minStock: number) => {
    if (currentStock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    } else if (currentStock <= minStock) {
      return <Badge variant="default" className="bg-orange-500">Low Stock</Badge>
    } else {
      return <Badge variant="default" className="bg-green-500">In Stock</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Stock Management
        </CardTitle>
        <CardDescription>
          Monitor and manage product inventory levels
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
          <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map(supplier => (
                <SelectItem key={supplier} value={supplier}>
                  {supplier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Scan className="w-4 h-4 mr-2" />
              Scan Barcode
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Stock Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min/Max</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStock.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="font-mono">{item.sku}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={item.currentStock <= item.minStock ? 'text-orange-600 font-semibold' : ''}>
                        {item.currentStock}
                      </span>
                      {item.currentStock <= item.minStock && (
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.minStock} / {item.maxStock}
                  </TableCell>
                  <TableCell>${item.unitPrice}</TableCell>
                  <TableCell>${item.totalValue.toLocaleString()}</TableCell>
                  <TableCell>
                    {getStatusBadge(item.status, item.currentStock, item.minStock)}
                  </TableCell>
                  <TableCell className="text-sm">{item.supplier}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/inventory/stock/${item.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Stock
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Minus className="w-4 h-4 mr-2" />
                          Remove Stock
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Products</p>
              <p className="font-semibold">{filteredStock.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Value</p>
              <p className="font-semibold">
                ${filteredStock.reduce((sum, item) => sum + item.totalValue, 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Low Stock Items</p>
              <p className="font-semibold text-orange-600">
                {filteredStock.filter(item => item.currentStock <= item.minStock && item.currentStock > 0).length}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Out of Stock</p>
              <p className="font-semibold text-red-600">
                {filteredStock.filter(item => item.currentStock === 0).length}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
