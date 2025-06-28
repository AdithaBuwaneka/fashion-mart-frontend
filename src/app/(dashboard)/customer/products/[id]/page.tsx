'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { ProductDetails } from '@/components/customer/product-details';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data - TODO: Replace with API call
  useEffect(() => {
    const mockProduct: Product = {
      id: params.id,
      name: 'Elegant Summer Dress',
      description: 'A beautiful flowing dress perfect for summer occasions. Made from premium cotton blend with a comfortable fit that flatters all body types. Features include adjustable straps, side pockets, and a flattering A-line silhouette.',
      price: 89.99,
      categoryId: '1',
      category: { id: '1', name: 'Dresses', isActive: true },
      images: [
        '/images/products/dress1.jpg',
        '/images/products/dress1-2.jpg',
        '/images/products/dress1-3.jpg'
      ],
      sizes: [
        { id: '1', name: 'XS', label: 'Extra Small' },
        { id: '2', name: 'S', label: 'Small' },
        { id: '3', name: 'M', label: 'Medium' },
        { id: '4', name: 'L', label: 'Large' },
        { id: '5', name: 'XL', label: 'Extra Large' }
      ],
      colors: [
        { id: '1', name: 'Blue', hexCode: '#3B82F6' },
        { id: '2', name: 'Pink', hexCode: '#EC4899' },
        { id: '3', name: 'White', hexCode: '#FFFFFF' }
      ],
      isActive: true,
      createdAt: '2025-06-01T00:00:00Z',
      updatedAt: '2025-06-25T00:00:00Z',
      stock: [
        { id: '1', productId: params.id, product: {} as Product, size: 'S', color: 'Blue', quantity: 10, minThreshold: 2, lastUpdated: '2025-06-25T00:00:00Z' },
        { id: '2', productId: params.id, product: {} as Product, size: 'M', color: 'Blue', quantity: 15, minThreshold: 2, lastUpdated: '2025-06-25T00:00:00Z' },
        { id: '3', productId: params.id, product: {} as Product, size: 'L', color: 'Pink', quantity: 8, minThreshold: 2, lastUpdated: '2025-06-25T00:00:00Z' }
      ],
      design: {
        id: '1',
        name: 'Summer Elegance Collection',
        description: 'A beautiful summer design',
        designerId: '1',
        designer: {
          id: '1',
          clerkId: 'designer_1',
          email: 'designer@example.com',
          firstName: 'Emma',
          lastName: 'Thompson',
          role: 'designer',
          isActive: true,
          createdAt: '2025-06-01T00:00:00Z',
          updatedAt: '2025-06-25T00:00:00Z'
        },
        imageUrl: '/images/designs/summer-elegance.jpg',
        isApproved: true,
        isActive: true,
        approvedBy: 'admin',
        approvedAt: '2025-06-05T00:00:00Z',
        createdAt: '2025-06-01T00:00:00Z',
        updatedAt: '2025-06-25T00:00:00Z',
        tags: ['summer', 'elegant', 'casual']
      }
    };

    setTimeout(() => {
      if (params.id) {
        setProduct(mockProduct);
        setLoading(false);
      } else {
        setError('Product not found');
        setLoading(false);
      }
    }, 1000);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <p className="text-gray-600 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild>
            <Link href="/customer/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/customer/products" className="text-gray-500 hover:text-gray-700">
              Products
            </Link>
            <span className="text-gray-500">/</span>
            <Link href={`/customer/products?category=${product.category.name}`} className="text-gray-500 hover:text-gray-700">
              {product.category.name}
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>

        {/* Product Details */}
        <ProductDetails product={product} />
      </div>
    </div>
  );
}
