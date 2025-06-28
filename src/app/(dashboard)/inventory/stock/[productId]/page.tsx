// src/app/(dashboard)/inventory/stock/[productId]/page.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Package, 
  TrendingDown, 
  Plus, 
  Minus, 
  Edit, 
  ArrowLeft,
  DollarSign,
  BarChart3,
  History,
  AlertTriangle
} from 'lucide-react'
import { RoleGuard } from '@/components/shared/role-guard'
import Link from 'next/link'
import Image from 'next/image'

// Mock product data - in real app, this would be fetched based on productId
const productData = {
  id: 1,
  sku: 'FS-001',
  name: 'Summer Floral Dress',
  category: 'Dresses',
  description: 'Beautiful summer dress with vibrant floral patterns, perfect for casual wear and outdoor events.',
  currentStock: 45,
  minStock: 20,
  maxStock: 100,
  unitPrice: 79.99,
  costPrice: 35.50,
  totalValue: 3599.55,
  supplier: 'Fashion Forward Co.',
  lastUpdated: '2024-06-28',
  status: 'in-stock',
  image: '/images/products/summer-dress.jpg',
  barcode: '1234567890123',
  weight: '0.5 kg',
  dimensions: '30x40x2 cm',
  location: 'Warehouse A - Section 2 - Shelf B3'
}

const stockMovements = [
  { date: '2024-06-28', type: 'In', quantity: 25, reference: 'PO-001', note: 'New stock delivery' },
  { date: '2024-06-27', type: 'Out', quantity: 8, reference: 'SO-156', note: 'Sales order fulfillment' },
  { date: '2024-06-26', type: 'Out', quantity: 3, reference: 'ADJ-02', note: 'Damaged items removed' },
  { date: '2024-06-25', type: 'Out', quantity: 12, reference: 'SO-154', note: 'Bulk order fulfillment' },
  { date: '2024-06-24', type: 'In', quantity: 15, reference: 'PO-099', note: 'Emergency restock' }
]

export default function ProductDetailPage() {
  // In a real app, useParams would be used to fetch specific product data
  // const params = useParams()
  // const productId = params.productId

  const getStockPercentage = () => {
    return (productData.currentStock / productData.maxStock) * 100
  }

  const getStockStatus = () => {
    if (productData.currentStock === 0) return 'out-of-stock'
    if (productData.currentStock <= productData.minStock) return 'low-stock'
    return 'in-stock'
  }

  const getStatusColor = () => {
    const status = getStockStatus()
    if (status === 'out-of-stock') return 'text-red-600'
    if (status === 'low-stock') return 'text-orange-600'
    return 'text-green-600'
  }

  return (
    <RoleGuard allowedRoles={['inventory']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/inventory/stock">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Stock
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{productData.name}</h1>
            <p className="text-muted-foreground">SKU: {productData.sku}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Product
            </Button>
            <Button>
              <Package className="w-4 h-4 mr-2" />
              Adjust Stock
            </Button>
          </div>
        </div>

        {/* Product Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Image & Basic Info */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={productData.image}
                    alt={productData.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder-product.jpg'
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">{productData.name}</h3>
                  <p className="text-sm text-muted-foreground">{productData.description}</p>
                  <div className="flex justify-between text-sm">
                    <span>Category:</span>
                    <Badge variant="outline">{productData.category}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Location:</span>
                    <span className="text-right">{productData.location}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stock Information */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Current Stock Level</span>
                  <span className={`text-2xl font-bold ${getStatusColor()}`}>
                    {productData.currentStock}
                  </span>
                </div>
                <Progress value={getStockPercentage()} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Min: {productData.minStock}</span>
                  <span>Max: {productData.maxStock}</span>
                </div>
              </div>

              {productData.currentStock <= productData.minStock && (
                <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">Low Stock Alert</p>
                    <p className="text-xs text-orange-600">Consider reordering soon</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Supplier</span>
                  <p className="font-medium">{productData.supplier}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Updated</span>
                  <p className="font-medium">{productData.lastUpdated}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Barcode</span>
                  <p className="font-mono text-xs">{productData.barcode}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Weight</span>
                  <p className="font-medium">{productData.weight}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Unit Price</p>
                    <p className="text-lg font-bold text-green-600">${productData.unitPrice}</p>
                  </div>
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Cost Price</p>
                    <p className="text-lg font-bold text-blue-600">${productData.costPrice}</p>
                  </div>
                  <TrendingDown className="w-6 h-6 text-blue-600" />
                </div>
                
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="text-lg font-bold text-purple-600">${productData.totalValue.toLocaleString()}</p>
                  </div>
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Profit Margin</p>
                  <p className="text-lg font-bold">
                    {(((productData.unitPrice - productData.costPrice) / productData.unitPrice) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="movements" className="space-y-4">
          <TabsList>
            <TabsTrigger value="movements">Stock Movements</TabsTrigger>
            <TabsTrigger value="adjustments">Quick Adjustments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="movements">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Stock Movement History
                </CardTitle>
                <CardDescription>
                  Track all stock in and out movements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stockMovements.map((movement, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${
                          movement.type === 'In' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {movement.type === 'In' ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-medium">
                            {movement.type === 'In' ? '+' : '-'}{movement.quantity} units
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {movement.date} • {movement.reference}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{movement.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="adjustments">
            <Card>
              <CardHeader>
                <CardTitle>Stock Adjustments</CardTitle>
                <CardDescription>
                  Make quick stock level adjustments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Add Stock</h4>
                    <div className="space-y-3">
                      <Input type="number" placeholder="Quantity to add" />
                      <Input placeholder="Reference (PO number, etc.)" />
                      <Textarea placeholder="Reason for stock addition" />
                      <Button className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Stock
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Remove Stock</h4>
                    <div className="space-y-3">
                      <Input type="number" placeholder="Quantity to remove" />
                      <Input placeholder="Reference (damage, theft, etc.)" />
                      <Textarea placeholder="Reason for stock removal" />
                      <Button variant="outline" className="w-full">
                        <Minus className="w-4 h-4 mr-2" />
                        Remove Stock
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Product Analytics</CardTitle>
                <CardDescription>
                  Performance metrics and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                  <p className="text-muted-foreground">
                    Product analytics and performance metrics will be displayed here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Product Settings</CardTitle>
                <CardDescription>
                  Configure product parameters and thresholds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Minimum Stock Level</label>
                      <Input type="number" defaultValue={productData.minStock} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Maximum Stock Level</label>
                      <Input type="number" defaultValue={productData.maxStock} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Reorder Point</label>
                      <Input type="number" defaultValue={productData.minStock + 5} />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  )
}
