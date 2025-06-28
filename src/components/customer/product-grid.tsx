'use client';

import { useState } from 'react';
import { Product, ProductFilters } from '@/lib/types';
import { ProductCard } from './product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Grid, 
  List, 
  Filter, 
  SlidersHorizontal,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  onAddToCart?: (productId: string, size: string, color: string) => void;
  onAddToWishlist?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
  wishlistItems?: string[];
  filters?: ProductFilters;
  onFiltersChange?: (filters: ProductFilters) => void;
  className?: string;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'price_low' | 'price_high' | 'rating' | 'name';

export function ProductGrid({
  products,
  loading = false,
  onLoadMore,
  hasMore = false,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  wishlistItems = [],
  filters = {},
  onFiltersChange,
  className
}: ProductGridProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    // TODO: Implement sorting logic
  };

  const removeFilter = (key: keyof ProductFilters) => {
    if (onFiltersChange) {
      const newFilters = { ...filters };
      delete newFilters[key];
      onFiltersChange(newFilters);
    }
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && 
      value !== null && 
      value !== '' && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length;
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600">
            {loading ? 'Loading...' : `${products.length} products`}
          </p>
          
          {/* Active Filters */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <Badge variant="secondary" className="gap-1">
                  Category: {filters.category}
                  <button onClick={() => removeFilter('category')}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.priceRange && (
                <Badge variant="secondary" className="gap-1">
                  ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  <button onClick={() => removeFilter('priceRange')}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.sizes && filters.sizes.length > 0 && (
                <Badge variant="secondary" className="gap-1">
                  Sizes: {filters.sizes.join(', ')}
                  <button onClick={() => removeFilter('sizes')}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.colors && filters.colors.length > 0 && (
                <Badge variant="secondary" className="gap-1">
                  Colors: {filters.colors.join(', ')}
                  <button onClick={() => removeFilter('colors')}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Filters Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <Badge className="ml-2 h-5 w-5 p-0 text-xs">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>

          {/* Sort */}
          <select 
            value={sortBy} 
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Name A-Z</option>
          </select>

          {/* View Mode */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
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

      {/* Products Grid/List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button onClick={() => onFiltersChange?.({})}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className={cn(
          viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-6"
        )}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
              onQuickView={onQuickView}
              isInWishlist={wishlistItems.includes(product.id)}
              className={viewMode === 'list' ? "flex-row max-w-full" : ""}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && !loading && (
        <div className="text-center pt-8">
          <Button onClick={onLoadMore} variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      )}
    </div>
  );
}
