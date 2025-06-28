'use client';

// Force dynamic rendering to prevent build-time prerendering issues
export const dynamic = 'force-dynamic'

import { useState, useEffect, useMemo } from 'react';
import { Product, ProductFilters, Category } from '@/lib/types';
import { ProductGrid } from '@/components/customer/product-grid';
import { FilterSidebar } from '@/components/customer/filter-sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  SlidersHorizontal, 
  X,
  Filter
} from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  // Mock data - TODO: Replace with API calls
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Elegant Summer Dress',
        description: 'A beautiful flowing dress perfect for summer occasions',
        price: 89.99,
        categoryId: '1',
        category: { id: '1', name: 'Dresses', isActive: true },
        images: ['/images/products/dress1.jpg', '/images/products/dress1-hover.jpg'],
        sizes: [
          { id: '1', name: 'S', label: 'Small' },
          { id: '2', name: 'M', label: 'Medium' },
          { id: '3', name: 'L', label: 'Large' }
        ],
        colors: [
          { id: '1', name: 'Blue', hexCode: '#3B82F6' },
          { id: '2', name: 'Pink', hexCode: '#EC4899' }
        ],
        isActive: true,
        createdAt: '2025-06-01T00:00:00Z',
        updatedAt: '2025-06-25T00:00:00Z',
        stock: [
          { id: '1', productId: '1', product: {} as Product, size: 'S', color: 'Blue', quantity: 10, minThreshold: 2, lastUpdated: '2025-06-25T00:00:00Z' }
        ]
      },
      {
        id: '2',
        name: 'Casual Cotton T-Shirt',
        description: 'Comfortable everyday cotton t-shirt',
        price: 29.99,
        categoryId: '2',
        category: { id: '2', name: 'T-Shirts', isActive: true },
        images: ['/images/products/tshirt1.jpg'],
        sizes: [
          { id: '1', name: 'S', label: 'Small' },
          { id: '2', name: 'M', label: 'Medium' },
          { id: '3', name: 'L', label: 'Large' },
          { id: '4', name: 'XL', label: 'Extra Large' }
        ],
        colors: [
          { id: '1', name: 'White', hexCode: '#FFFFFF' },
          { id: '2', name: 'Black', hexCode: '#000000' },
          { id: '3', name: 'Gray', hexCode: '#6B7280' }
        ],
        isActive: true,
        createdAt: '2025-06-01T00:00:00Z',
        updatedAt: '2025-06-25T00:00:00Z',
        stock: [
          { id: '2', productId: '2', product: {} as Product, size: 'M', color: 'White', quantity: 25, minThreshold: 5, lastUpdated: '2025-06-25T00:00:00Z' }
        ]
      },
      // Add more mock products...
    ];

    const mockCategories: Category[] = [
      { id: '1', name: 'Dresses', isActive: true },
      { id: '2', name: 'T-Shirts', isActive: true },
      { id: '3', name: 'Jeans', isActive: true },
      { id: '4', name: 'Accessories', isActive: true }
    ];

    setTimeout(() => {
      setProducts(mockProducts);
      setCategories(mockCategories);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.name.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category.name === filters.category);
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }

    // Size filter
    if (filters.sizes && filters.sizes.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes.some(size => filters.sizes!.includes(size.name))
      );
    }

    // Color filter
    if (filters.colors && filters.colors.length > 0) {
      filtered = filtered.filter(product =>
        product.colors.some(color => filters.colors!.includes(color.name))
      );
    }

    // In stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock.length > 0);
    }

    return filtered;
  }, [products, searchQuery, filters]);

  const handleAddToCart = async (productId: string, size: string, color: string) => {
    // TODO: Implement add to cart
    console.log('Add to cart:', { productId, size, color });
  };

  const handleAddToWishlist = async (productId: string) => {
    // TODO: Implement add to wishlist
    if (wishlistItems.includes(productId)) {
      setWishlistItems(prev => prev.filter(id => id !== productId));
    } else {
      setWishlistItems(prev => [...prev, productId]);
    }
  };

  const handleQuickView = (productId: string) => {
    // TODO: Implement quick view modal
    console.log('Quick view:', productId);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600 text-sm">
                Discover our latest fashion collection
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                categories={categories}
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filters Button */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
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
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <Card className="lg:hidden mb-6">
                <CardContent className="p-4">
                  <FilterSidebar
                    categories={categories}
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                </CardContent>
              </Card>
            )}

            {/* Active Filters */}
            {(searchQuery || getActiveFiltersCount() > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: &quot;{searchQuery}&quot;
                    <button onClick={() => setSearchQuery('')}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.category && (
                  <Badge variant="secondary" className="gap-1">
                    Category: {filters.category}
                    <button onClick={() => setFilters(prev => ({ ...prev, category: undefined }))}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {(searchQuery || getActiveFiltersCount() > 0) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({});
                    }}
                    className="text-gray-600"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            )}

            {/* Results */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || getActiveFiltersCount() > 0
                    ? "Try adjusting your search or filters"
                    : "No products available at the moment"
                  }
                </p>
                {(searchQuery || getActiveFiltersCount() > 0) && (
                  <Button onClick={() => {
                    setSearchQuery('');
                    setFilters({});
                  }}>
                    Clear All Filters
                  </Button>
                )}
              </div>
            ) : (
              <ProductGrid
                products={filteredProducts}
                loading={false}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onQuickView={handleQuickView}
                wishlistItems={wishlistItems}
                filters={filters}
                onFiltersChange={setFilters}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
