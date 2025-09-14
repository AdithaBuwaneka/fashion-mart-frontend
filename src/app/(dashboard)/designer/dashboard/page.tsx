'use client';

import { useQuery } from '@tanstack/react-query';
import { designerApi } from '@/lib/api/designer';
import { RoleGuard } from '@/components/shared/role-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingScreen } from '@/components/shared/loading-screen';
import {
  Palette,
  CheckCircle,
  Clock,
  TrendingUp,
  Upload,
  Plus,
  Eye
} from 'lucide-react';
import Link from 'next/link';

export default function DesignerDashboardPage() {
  // Fetch designer's designs and stats
  const { data: designs, isLoading: designsLoading } = useQuery({
    queryKey: ['designer-designs-stats'],
    queryFn: () => designerApi.getDesigns()
  });

  // Fetch categories for quick access
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['designer-categories'],
    queryFn: () => designerApi.getCategories()
  });

  const isLoading = designsLoading || categoriesLoading;

  if (isLoading) {
    return <LoadingScreen />;
  }

  const designStats = {
    totalDesigns: designs?.length || 0,
    approvedDesigns: designs?.filter(d => d.isApproved).length || 0,
    pendingDesigns: designs?.filter(d => !d.isApproved).length || 0,
    totalViews: designs?.reduce((sum, design) => sum + (design.views || 0), 0) || 0,
    totalEarnings: designs?.reduce((sum, design) => sum + (design.earnings || 0), 0) || 0
  };

  const recentDesigns = designs?.slice(0, 3) || [];

  return (
    <RoleGuard allowedRoles={['designer']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Designer Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome to your design workspace. Create and manage your designs.
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Designs</p>
                  <p className="text-2xl font-bold text-gray-900">{designStats.totalDesigns}</p>
                </div>
                <Palette className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{designStats.approvedDesigns}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                  <p className="text-2xl font-bold text-yellow-600">{designStats.pendingDesigns}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-purple-600">{designStats.totalViews}</p>
                </div>
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Designs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Designs</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Your latest design uploads</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/designer/designs">
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentDesigns.length === 0 ? (
              <div className="text-center py-8">
                <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No designs yet. Start creating!</p>
                <Button asChild>
                  <Link href="/designer/designs/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Design
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentDesigns.map((design) => (
                  <div key={design.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 truncate">{design.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        design.isApproved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {design.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{design.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{new Date(design.createdAt).toLocaleDateString()}</span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/designer/designs/${design.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Available Categories</CardTitle>
              <p className="text-sm text-gray-600">Design categories you can work with</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories?.slice(0, 5).map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-sm font-medium">{category.name}</span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/designer/designs/new?category=${category.id}`}>
                        Create
                      </Link>
                    </Button>
                  </div>
                )) || (
                  <p className="text-sm text-gray-500">No categories available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Design Performance</CardTitle>
              <p className="text-sm text-gray-600">How your designs are performing</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Approval Rate</span>
                  <span className="text-sm font-medium">
                    {designStats.totalDesigns > 0
                      ? Math.round((designStats.approvedDesigns / designStats.totalDesigns) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Views per Design</span>
                  <span className="text-sm font-medium">
                    {designStats.totalDesigns > 0
                      ? Math.round(designStats.totalViews / designStats.totalDesigns)
                      : 0}
                  </span>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/designer/analytics">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analytics
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}
