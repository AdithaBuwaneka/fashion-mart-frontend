'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  ShoppingCart, 
  Share2, 
  Star,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductDetailsProps {
  product: Product;
  onAddToCart?: (productId: string, size: string, color: string, quantity: number) => void;
  onAddToWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
}

export function ProductDetails({
  product,
  onAddToCart,
  onAddToWishlist,
  isInWishlist = false
}: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const averageRating = 4.5; // TODO: Calculate from reviews
  const reviewCount = 23; // TODO: Get from reviews
  const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : null;
  const originalPrice = discount ? product.price / (1 - discount / 100) : null;

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }

    setLoading(true);
    try {
      if (onAddToCart) {
        await onAddToCart(product.id, selectedSize, selectedColor, quantity);
      }
      // TODO: Show success message
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (onAddToWishlist) {
      await onAddToWishlist(product.id);
    }
  };

  const getStockForVariant = (size: string, color: string) => {
    return product.stock.find(s => s.size === size && s.color === color)?.quantity || 0;
  };

  const isVariantInStock = (size: string, color: string) => {
    return getStockForVariant(size, color) > 0;
  };

  const maxQuantity = selectedSize && selectedColor 
    ? Math.min(10, getStockForVariant(selectedSize, selectedColor))
    : 10;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {discount && (
            <Badge className="absolute top-4 left-4 z-10 bg-red-500 text-white">
              -{discount}%
            </Badge>
          )}
          <Image
            src={product.images[selectedImage] || '/images/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          
          {/* Navigation arrows */}
          {product.images.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImage(prev => 
                  prev === 0 ? product.images.length - 1 : prev - 1
                )}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setSelectedImage(prev => 
                  prev === product.images.length - 1 ? 0 : prev + 1
                )}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Images */}
        {product.images.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2",
                  selectedImage === index ? "border-blue-500" : "border-gray-200"
                )}
              >
                <Image
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        {/* Header */}
        <div>
          {product.design?.designer && (
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
              by {product.design.designer.firstName} {product.design.designer.lastName}
            </p>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(averageRating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {averageRating} ({reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-xl text-gray-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
            {discount && (
              <Badge className="bg-red-100 text-red-800">
                Save {discount}%
              </Badge>
            )}
          </div>
        </div>

        {/* Color Selection */}
        {product.colors.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Color: {selectedColor && (
                <span className="font-normal text-gray-600">{selectedColor}</span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.name)}
                  className={cn(
                    "relative w-10 h-10 rounded-full border-2 transition-all",
                    selectedColor === color.name
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-300 hover:border-gray-400"
                  )}
                  style={{ backgroundColor: color.hexCode }}
                  title={color.name}
                >
                  {selectedColor === color.name && (
                    <div className="absolute inset-0 rounded-full border-2 border-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selection */}
        {product.sizes.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Size: {selectedSize && (
                <span className="font-normal text-gray-600">{selectedSize}</span>
              )}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((size) => {
                const inStock = selectedColor ? isVariantInStock(size.name, selectedColor) : true;
                return (
                  <button
                    key={size.id}
                    onClick={() => inStock && setSelectedSize(size.name)}
                    disabled={!inStock}
                    className={cn(
                      "py-2 px-3 border rounded-md text-sm font-medium transition-colors",
                      selectedSize === size.name
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : inStock
                        ? "border-gray-300 hover:border-gray-400 text-gray-700"
                        : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    {size.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stock Status */}
        {selectedSize && selectedColor && (
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {getStockForVariant(selectedSize, selectedColor)} in stock
            </span>
          </div>
        )}

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Quantity
          </label>
          <div className="flex items-center border rounded-md w-32">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex items-center justify-center w-10 h-10 hover:bg-gray-100"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="flex-1 text-center py-2 font-medium">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              className="flex items-center justify-center w-10 h-10 hover:bg-gray-100"
              disabled={quantity >= maxQuantity}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleAddToCart}
            disabled={loading || !selectedSize || !selectedColor || !isVariantInStock(selectedSize, selectedColor)}
            className="w-full"
            size="lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {loading ? 'Adding...' : 'Add to Cart'}
          </Button>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleAddToWishlist}
              className={cn(
                "flex-1",
                isInWishlist && "text-red-600 border-red-200"
              )}
            >
              <Heart className={cn("h-4 w-4 mr-2", isInWishlist && "fill-current")} />
              {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </Button>
            
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Features */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Truck className="h-4 w-4" />
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <RotateCcw className="h-4 w-4" />
                <span>7-day return policy</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Shield className="h-4 w-4" />
                <span>1-year warranty included</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        {/* Designer Info */}
        {product.design?.designer && (
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">About the Designer</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {product.design.designer.firstName[0]}{product.design.designer.lastName[0]}
                  </span>
                </div>
                <div>
                  <p className="font-medium">
                    {product.design.designer.firstName} {product.design.designer.lastName}
                  </p>
                  <Link 
                    href={`/designers/${product.design.designer.id}`}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    View Designer Profile
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
