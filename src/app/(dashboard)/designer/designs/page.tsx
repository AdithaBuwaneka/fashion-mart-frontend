'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { designerApi } from '@/lib/api/designer';
import { RoleGuard } from '@/components/shared/role-guard';
import { DesignCard } from '@/components/designer/design-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingScreen } from '@/components/shared/loading-screen';
import { Design } from '@/lib/types';
import {
  Plus,
  Search,
  Filter,
  Palette,
  Upload
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Define filter type
type StatusFilter = 'all' | 'approved' | 'pending';

// Define design counts interface
interface DesignCounts {
  all: number;
  approved: number;
  pending: number;
}

export default function DesignerDesignsPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const queryClient = useQueryClient();

  // Fetch designs from API
  const {
    data: designsData,
    isLoading,
    error
  } = useQuery<Design[], Error>({
    queryKey: ['designer-designs'],
    queryFn: () => designerApi.getDesigns()
  });

  // Delete design mutation
  const deleteDesignMutation = useMutation<
    { success: boolean; message: string },
    Error,
    string
  >({
    mutationFn: (designId: string) => designerApi.deleteDesign(designId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designer-designs'] });
      toast.success('Design deleted successfully');
    },
    onError: (error: Error) => {
      console.error('Delete design error:', error);
      toast.error('Failed to delete design');
    }
  });

  // Submit design for approval mutation
  const submitDesignMutation = useMutation<
    Design,
    Error,
    string
  >({
    mutationFn: (designId: string) => designerApi.submitDesign(designId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designer-designs'] });
      toast.success('Design submitted for approval');
    },
    onError: (error: Error) => {
      console.error('Submit design error:', error);
      toast.error('Failed to submit design');
    }
  });

  const designs: Design[] = designsData || [];

  // Filter designs based on search and status
  const filteredDesigns: Design[] = designs.filter((design: Design) => {
    const matchesSearch = searchQuery === '' ||
      design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'approved' && design.isApproved) ||
      (statusFilter === 'pending' && !design.isApproved);

    return matchesSearch && matchesStatus;
  });

  const designCounts: DesignCounts = {
    all: designs.length,
    approved: designs.filter((d: Design) => d.isApproved).length,
    pending: designs.filter((d: Design) => !d.isApproved).length
  };

  const handleEdit = (designId: string): void => {
    window.location.href = `/designer/designs/${designId}/edit`;
  };

  const handleDelete = async (designId: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this design? This action cannot be undone.')) {
      deleteDesignMutation.mutate(designId);
    }
  };

  const handleToggleApproval = async (designId: string): Promise<void> => {
    const design: Design | undefined = designs.find((d: Design) => d.id === designId);
    if (design && !design.isApproved) {
      submitDesignMutation.mutate(designId);
    }
  };

  // Handle filter change
  const handleStatusFilterChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setStatusFilter(event.target.value as StatusFilter);
  };

  // Handle clear filters
  const handleClearFilters = (): void => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error loading designs</h2>
          <p className="text-gray-600 mb-4">
            {error.message || 'Failed to load your designs. Please try again.'}
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['designer']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Designs</h1>
            <p className="text-gray-600 mt-2">
              Manage and view your design portfolio ({designs.length} total)
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/designer/upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload Design
              </Link>
            </Button>
            <Button asChild>
              <Link href="/designer/designs/new">
                <Plus className="h-4 w-4 mr-2" />
                New Design
              </Link>
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search designs..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Designs ({designCounts.all})</option>
                <option value="approved">Approved ({designCounts.approved})</option>
                <option value="pending">Pending ({designCounts.pending})</option>
              </select>
            </div>

            {/* Active Filters */}
            {(searchQuery || statusFilter !== 'all') && (
              <div className="flex flex-wrap gap-2 mt-4">
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: "{searchQuery}"
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="ml-1 hover:bg-gray-200 rounded px-1"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {statusFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {statusFilter}
                    <button
                      type="button"
                      onClick={() => setStatusFilter('all')}
                      className="ml-1 hover:bg-gray-200 rounded px-1"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Designs Grid */}
        {filteredDesigns.length === 0 ? (
          <div className="text-center py-12">
            <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No designs found' : 'No designs yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first design to get started'
              }
            </p>
            {searchQuery || statusFilter !== 'all' ? (
              <Button onClick={handleClearFilters}>
                Clear Filters
              </Button>
            ) : (
              <Button asChild>
                <Link href="/designer/designs/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Design
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDesigns.map((design: Design) => (
              <DesignCard
                key={design.id}
                design={design}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleApproval={handleToggleApproval}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
