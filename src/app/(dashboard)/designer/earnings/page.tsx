// src/app/(dashboard)/designer/earnings/page.tsx
'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Download, 
  CreditCard, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface EarningsData {
  totalEarnings: number;
  pendingPayments: number;
  thisMonthEarnings: number;
  commissionRate: number;
  transactions: Array<{
    id: string;
    type: 'sale' | 'commission' | 'payout';
    amount: number;
    date: string;
    status: 'completed' | 'pending' | 'processing';
    description: string;
    designName?: string;
  }>;
  payouts: Array<{
    id: string;
    amount: number;
    date: string;
    status: 'completed' | 'pending' | 'processing';
    method: string;
  }>;
}

export default function DesignerEarningsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  
  // Mock earnings data - TODO: Replace with API calls
  const earningsData: EarningsData = {
    totalEarnings: 8750.50,
    pendingPayments: 1420.00,
    thisMonthEarnings: 2340.00,
    commissionRate: 15, // 15% commission rate
    transactions: [
      {
        id: 'txn-001',
        type: 'sale',
        amount: 45.00,
        date: '2024-06-25',
        status: 'completed',
        description: 'Design sale commission',
        designName: 'Geometric Abstract Pattern'
      },
      {
        id: 'txn-002',
        type: 'sale',
        amount: 32.50,
        date: '2024-06-24',
        status: 'completed',
        description: 'Design sale commission',
        designName: 'Vintage Floral Collection'
      },
      {
        id: 'txn-003',
        type: 'payout',
        amount: -850.00,
        date: '2024-06-20',
        status: 'completed',
        description: 'Monthly payout to bank account'
      },
      {
        id: 'txn-004',
        type: 'commission',
        amount: 125.00,
        date: '2024-06-18',
        status: 'pending',
        description: 'Collaboration project payment',
        designName: 'Spring Fashion Collection'
      },
      {
        id: 'txn-005',
        type: 'sale',
        amount: 28.00,
        date: '2024-06-15',
        status: 'completed',
        description: 'Design sale commission',
        designName: 'Minimalist Lines'
      }
    ],
    payouts: [
      {
        id: 'payout-001',
        amount: 850.00,
        date: '2024-06-20',
        status: 'completed',
        method: 'Bank Transfer'
      },
      {
        id: 'payout-002',
        amount: 720.00,
        date: '2024-05-20',
        status: 'completed',
        method: 'PayPal'
      },
      {
        id: 'payout-003',
        amount: 680.00,
        date: '2024-04-20',
        status: 'completed',
        method: 'Bank Transfer'
      }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'commission':
        return <DollarSign className="h-4 w-4 text-blue-600" />;
      case 'payout':
        return <CreditCard className="h-4 w-4 text-purple-600" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const requestPayout = () => {
    // TODO: Implement payout request
    console.log('Requesting payout for:', earningsData.pendingPayments);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Earnings & Payouts</h1>
          <p className="text-muted-foreground mt-1">
            Track your design sales and manage your earnings
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button 
            onClick={requestPayout}
            disabled={earningsData.pendingPayments === 0}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Request Payout
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(earningsData.totalEarnings)}</div>
            <p className="text-xs text-muted-foreground">
              All time earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(earningsData.pendingPayments)}</div>
            <p className="text-xs text-muted-foreground">
              Available for payout
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(earningsData.thisMonthEarnings)}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earningsData.commissionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Your earnings rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest earnings and payouts</CardDescription>
            </div>
            <div className="flex gap-2">
              {(['week', 'month', 'year'] as const).map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                  className="capitalize"
                >
                  {period}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {earningsData.transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{transaction.description}</p>
                      {transaction.designName && (
                        <p className="text-xs text-muted-foreground">{transaction.designName}</p>
                      )}
                      <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`font-semibold text-sm ${
                        transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(transaction.status)}>
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1 capitalize">{transaction.status}</span>
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payout History */}
        <Card>
          <CardHeader>
            <CardTitle>Payout History</CardTitle>
            <CardDescription>Your recent payouts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {earningsData.payouts.map((payout) => (
                <div key={payout.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{formatCurrency(payout.amount)}</span>
                    <Badge className={getStatusColor(payout.status)}>
                      {getStatusIcon(payout.status)}
                      <span className="ml-1 capitalize">{payout.status}</span>
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>{payout.method}</p>
                    <p className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(payout.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Request Payout Section */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Ready for Payout</h4>
              <p className="text-lg font-bold text-green-600 mb-3">
                {formatCurrency(earningsData.pendingPayments)}
              </p>
              <Button 
                onClick={requestPayout}
                disabled={earningsData.pendingPayments === 0}
                className="w-full"
                size="sm"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Request Payout
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Minimum payout amount is $50. Payouts are processed within 3-5 business days.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commission Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Structure</CardTitle>
          <CardDescription>How your earnings are calculated</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">15%</div>
              <h4 className="font-medium mb-1">Design Sales</h4>
              <p className="text-sm text-muted-foreground">
                Commission on each design sold through the platform
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">25%</div>
              <h4 className="font-medium mb-1">Collaborations</h4>
              <p className="text-sm text-muted-foreground">
                Higher rate for custom collaboration projects
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">10%</div>
              <h4 className="font-medium mb-1">Exclusive Designs</h4>
              <p className="text-sm text-muted-foreground">
                Premium rate for exclusive or featured designs
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">💡 Tips to Increase Earnings</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Upload high-quality, trending designs</li>
              <li>• Participate in collaboration projects</li>
              <li>• Optimize your design tags for better discoverability</li>
              <li>• Build a strong portfolio with diverse styles</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
