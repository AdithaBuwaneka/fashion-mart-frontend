'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search,
  Users,
  Eye,
  Phone,
  Mail,
  Calendar,
  ShoppingBag
} from 'lucide-react'
import { RoleGuard } from '@/components/shared/role-guard'
import Link from 'next/link'

export default function StaffCustomersPage() {
  // Mock data - would come from API
  const customerStats = {
    total: 245,
    active: 189,
    new: 12,
    vip: 23
  }

  const customers = [
    {
      id: 'CUST-001',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+1 (555) 123-4567',
      status: 'active',
      tier: 'gold',
      totalOrders: 15,
      totalSpent: 1250.75,
      lastOrder: '2024-06-25',
      joinedAt: '2024-01-15',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      }
    },
    {
      id: 'CUST-002',
      name: 'Bob Smith',
      email: 'bob@example.com',
      phone: '+1 (555) 987-6543',
      status: 'active',
      tier: 'silver',
      totalOrders: 8,
      totalSpent: 650.25,
      lastOrder: '2024-06-20',
      joinedAt: '2024-03-10',
      address: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210'
      }
    },
    {
      id: 'CUST-003',
      name: 'Carol Davis',
      email: 'carol@example.com',
      phone: '+1 (555) 456-7890',
      status: 'inactive',
      tier: 'bronze',
      totalOrders: 3,
      totalSpent: 180.50,
      lastOrder: '2024-05-15',
      joinedAt: '2024-02-20',
      address: {
        street: '789 Pine Rd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601'
      }
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'gold':
        return 'bg-yellow-100 text-yellow-800'
      case 'silver':
        return 'bg-gray-100 text-gray-800'
      case 'bronze':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <RoleGuard allowedRoles={['staff']}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-2">
            Manage and view customer information, orders, and support requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerStats.total}</div>
              <p className="text-xs text-muted-foreground">
                +12 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerStats.active}</div>
              <p className="text-xs text-muted-foreground">
                77% of total customers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerStats.new}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerStats.vip}</div>
              <p className="text-xs text-muted-foreground">
                High-value customers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
            <CardDescription>
              Search and filter customers to find specific information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search customers by name, email, or phone..."
                    className="pl-10"
                  />
                </div>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Customer List */}
            <Tabs defaultValue="list" className="w-full">
              <TabsList>
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
              </TabsList>

              <TabsContent value="list">
                <div className="space-y-4">
                  {customers.map((customer) => (
                    <Card key={customer.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-800 font-medium">
                                {customer.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{customer.name}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center">
                                  <Mail className="h-4 w-4 mr-1" />
                                  {customer.email}
                                </span>
                                <span className="flex items-center">
                                  <Phone className="h-4 w-4 mr-1" />
                                  {customer.phone}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge className={getStatusColor(customer.status)}>
                                  {customer.status}
                                </Badge>
                                <Badge className={getTierColor(customer.tier)}>
                                  {customer.tier}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600">
                                <div>Orders: {customer.totalOrders}</div>
                                <div>Spent: ${customer.totalSpent.toFixed(2)}</div>
                              </div>
                            </div>
                            
                            <Link href={`/dashboard/staff/customers/${customer.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Last Order:</span>
                              <div>{new Date(customer.lastOrder).toLocaleDateString()}</div>
                            </div>
                            <div>
                              <span className="font-medium">Joined:</span>
                              <div>{new Date(customer.joinedAt).toLocaleDateString()}</div>
                            </div>
                            <div>
                              <span className="font-medium">Location:</span>
                              <div>{customer.address.city}, {customer.address.state}</div>
                            </div>
                            <div>
                              <span className="font-medium">Customer ID:</span>
                              <div>{customer.id}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="grid">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customers.map((customer) => (
                    <Card key={customer.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-800 font-medium">
                              {customer.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <CardTitle className="text-lg">{customer.name}</CardTitle>
                            <CardDescription>{customer.email}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Status:</span>
                            <Badge className={getStatusColor(customer.status)}>
                              {customer.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Tier:</span>
                            <Badge className={getTierColor(customer.tier)}>
                              {customer.tier}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Orders:</span>
                            <span className="font-medium">{customer.totalOrders}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Spent:</span>
                            <span className="font-medium">${customer.totalSpent.toFixed(2)}</span>
                          </div>
                          <div className="pt-3 border-t">
                            <Link href={`/dashboard/staff/customers/${customer.id}`} className="w-full">
                              <Button variant="outline" size="sm" className="w-full">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}