'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '@/lib/api/payments';
import { Payment, PaymentStatus } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DollarSign,
  RefreshCw,
  RotateCcw,
  Filter,
  Download,
  AlertCircle
} from 'lucide-react';
import { LoadingScreen } from '@/components/shared/loading-screen';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface RefundDialogProps {
  payment: Payment;
  isOpen: boolean;
  onClose: () => void;
}

function RefundDialog({ payment, isOpen, onClose }: RefundDialogProps) {
  const [refundAmount, setRefundAmount] = useState<string>(payment.amount.toString());
  const [refundReason, setRefundReason] = useState<string>('');
  const queryClient = useQueryClient();

  const refundMutation = useMutation({
    mutationFn: async ({ amount, reason }: { amount?: number; reason?: string }) => {
      return await paymentsApi.processRefund(payment.id, amount, reason);
    },
    onSuccess: () => {
      toast.success('Refund processed successfully');
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      onClose();
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process refund';
      toast.error(errorMessage);
    }
  });

  const handleRefund = () => {
    const amount = parseFloat(refundAmount);
    if (isNaN(amount) || amount <= 0 || amount > payment.amount) {
      toast.error('Invalid refund amount');
      return;
    }

    refundMutation.mutate({
      amount: amount === payment.amount ? undefined : amount,
      reason: refundReason.trim() || 'Admin initiated refund'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Process Refund</DialogTitle>
          <DialogDescription>
            Process a refund for payment {payment.id.substring(0, 8)}...
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="refund-amount">Refund Amount</Label>
            <Input
              id="refund-amount"
              type="number"
              step="0.01"
              max={payment.amount}
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              placeholder="Enter refund amount"
            />
            <p className="text-sm text-gray-500">
              Maximum: ${payment.amount.toFixed(2)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="refund-reason">Reason for Refund</Label>
            <Input
              id="refund-reason"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Enter reason for refund"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleRefund}
            disabled={refundMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {refundMutation.isPending ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4 mr-2" />
            )}
            Process Refund
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  };

  return (
    <Badge className={statusStyles[status] || statusStyles.pending}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export function PaymentManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | undefined>();
  const [dateRange, setDateRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);

  // Get payments list
  const { data: paymentsData, isLoading, error } = useQuery({
    queryKey: ['payments', currentPage, statusFilter],
    queryFn: () => paymentsApi.getAllPayments(currentPage, 10, statusFilter),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Get payment statistics
  // Payment stats not available in current API
  // const { data: paymentStats } = useQuery({
  //   queryKey: ['payment-stats', dateRange],
  //   queryFn: () => paymentsApi.getPaymentStats(dateRange.startDate, dateRange.endDate),
  // });
  const paymentStats: {
    totalRevenue?: number;
    totalTransactions?: number;
    successfulPayments?: number;
    failedPayments?: number;
    refundedAmount?: number;
  } | null = null;

  // Get payments by date range when date filter is applied
  const { data: dateRangeData } = useQuery({
    queryKey: ['payments-range', dateRange],
    queryFn: () => {
      if (dateRange.startDate && dateRange.endDate) {
        return paymentsApi.getPaymentsByDateRange(dateRange.startDate, dateRange.endDate);
      }
      return null;
    },
    enabled: !!(dateRange.startDate && dateRange.endDate),
  });

  const handleRefundClick = (payment: Payment) => {
    if (payment.status !== 'completed') {
      toast.error('Only completed payments can be refunded');
      return;
    }
    setSelectedPayment(payment);
    setIsRefundDialogOpen(true);
  };

  const handleExportPayments = async () => {
    try {
      // This would need to be implemented in the backend
      toast.info('Export functionality will be implemented soon');
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to export payments');
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <AlertCircle className="h-8 w-8 mx-auto mb-4" />
        {error && (() => { console.error('Payments loading error:', error); return null; })()}
        Error loading payments data
      </div>
    );
  }

  const payments = dateRangeData?.payments || paymentsData?.payments || [];
  const analytics = dateRangeData?.analytics;

  // Note: analytics variable available for future use
  console.debug('Date range analytics:', analytics);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
          <p className="text-gray-600 mt-1">Monitor and manage all payment transactions</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPayments}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Payment Statistics */}
      {paymentStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $0
              </div>
              <p className="text-xs text-muted-foreground">
                0 transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <div className="h-4 w-4 bg-green-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                0.0%
              </div>
              <p className="text-xs text-muted-foreground">
                0 successful
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
              <div className="h-4 w-4 bg-red-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                0
              </div>
              <p className="text-xs text-muted-foreground">
                0.0% failure rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Refunded</CardTitle>
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $0
              </div>
              <p className="text-xs text-muted-foreground">Total refunded</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={statusFilter || 'all'}
                onValueChange={(value) =>
                  setStatusFilter(value === 'all' ? undefined : value as PaymentStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={dateRange.startDate || ''}
                onChange={(e) =>
                  setDateRange(prev => ({ ...prev, startDate: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={dateRange.endDate || ''}
                onChange={(e) =>
                  setDateRange(prev => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setStatusFilter(undefined);
                  setDateRange({});
                  setCurrentPage(1);
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-sm">
                    {payment.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {payment.orderId.substring(0, 8)}...
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${payment.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={payment.status} />
                  </TableCell>
                  <TableCell className="capitalize">
                    {payment.paymentMethod}
                  </TableCell>
                  <TableCell>
                    {format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    {payment.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRefundClick(payment)}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Refund
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {payments.length === 0 && (
            <div className="text-center p-8 text-gray-500">
              No payments found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>

      {/* Refund Dialog */}
      {selectedPayment && (
        <RefundDialog
          payment={selectedPayment}
          isOpen={isRefundDialogOpen}
          onClose={() => {
            setIsRefundDialogOpen(false);
            setSelectedPayment(null);
          }}
        />
      )}
    </div>
  );
}