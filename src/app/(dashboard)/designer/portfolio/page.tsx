// src/app/(dashboard)/designer/portfolio/page.tsx
'use client'

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { designerApi } from '@/lib/api/designer';
import { DesignCard } from '@/components/designer/design-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LoadingScreen } from '@/components/shared/loading-screen';
import {
  Upload,
  Search,
  Grid3X3,
  List,
  Plus,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { Design } from '@/lib/types';
import { DesignStatus } from '@/lib/types/design';

export default function DesignerPortfolio() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular' | 'revenue'>('newest');

  // Fetch designer's designs from API
  const { data: designsResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['designer-designs'],
    queryFn: () => designerApi.getDesignerDesigns(1, 50), // Get first 50 designs
    staleTime: 30000, // Cache for 30 seconds
  });

  const designs = designsResponse?.designs || [];

  // Filter and sort designs
  const filteredDesigns = designs
    .filter(design => {
      const matchesSearch = design.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           design.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           design.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFilter = filterStatus === 'all' ||
                           (filterStatus === 'approved' && design.status === 'approved') ||
                           (filterStatus === 'pending' && (design.status === 'pending' || design.status === 'draft'));

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'popular':
          return 0; // API doesn't have views data yet
        case 'revenue':
          return 0; // API doesn't have revenue data yet
        default:
          return 0;
      }
    });

  const handleEdit = (designId: string) => {
    console.log('Edit design:', designId);
    // TODO: Navigate to edit page
  };

  const handleDelete = async (designId: string) => {
    if (confirm('Are you sure you want to delete this design?')) {
      try {
        await designerApi.deleteDesign(designId);
        refetch(); // Refresh the designs list
      } catch (error) {
        console.error('Failed to delete design:', error);
      }
    }
  };

  const handleToggleApproval = (designId: string) => {
    // This would require an admin API call, not available to designers
    console.log('Toggle approval for:', designId);
  };

  // Calculate stats from real data
  const totalRevenue = 0; // API doesn't provide revenue data yet
  const approvedCount = designs.filter(d => d.status === 'approved').length;
  const pendingCount = designs.filter(d => d.status === 'pending' || d.status === 'draft').length;

  // Handle loading state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Handle error state
  if (error) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <h3 className="text-lg font-semibold text-red-600 mb-2">Failed to Load Designs</h3>
        <p className="text-gray-600 mb-4">There was an error loading your design portfolio.</p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Portfolio</h1>
          <p className="text-muted-foreground mt-1">
            Manage and showcase your creative designs
          </p>
        </div>
        <Button asChild>
          <Link href="/designer/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload New Design
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Designs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{designs.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Design Collection</CardTitle>
          <CardDescription>Browse and manage your uploaded designs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'approved' | 'pending')}
                className="px-3 py-2 border border-input rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'popular' | 'revenue')}
                className="px-3 py-2 border border-input rounded-md text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="revenue">Highest Revenue</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-input rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || filterStatus !== 'all') && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: &ldquo;{searchQuery}&rdquo;
                  <button onClick={() => setSearchQuery('')}>
                    <Plus className="h-3 w-3 rotate-45" />
                  </button>
                </Badge>
              )}
              {filterStatus !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Status: {filterStatus}
                  <button onClick={() => setFilterStatus('all')}>
                    <Plus className="h-3 w-3 rotate-45" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Design Grid/List */}
      {filteredDesigns.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }>
          {filteredDesigns.map((design) => (
            <DesignCard
              key={design.id}
              design={design}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleApproval={handleToggleApproval}
              className={viewMode === 'list' ? 'flex flex-row' : ''}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Upload className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No designs found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || filterStatus !== 'all' 
                    ? 'Try adjusting your filters or search terms'
                    : 'Upload your first design to get started'
                  }
                </p>
              </div>
              <Button asChild>
                <Link href="/designer/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Design
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
