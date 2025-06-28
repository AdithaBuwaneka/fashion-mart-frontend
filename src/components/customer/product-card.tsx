'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  ShoppingCart, 
  Eye, 
  Star,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string, size: string, color: string) => void;
  onAddToWishlist?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
  isInWishlist?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  isInWishlist = false,
  className
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const primaryImage = product.images[0] || '/images/placeholder-product.jpg';
  const hoverImage = product.images[1] || primaryImage;
  
  const averageRating = 4.5; // TODO: Calculate from reviews
  const reviewCount = 23; // TODO: Get from reviews
  const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : null;
  const originalPrice = discount ? product.price / (1 - discount / 100) : null;

  const handleAddToCart = () => {
    if (onAddToCart && product.sizes.length > 0 && product.colors.length > 0) {
      onAddToCart(product.id, product.sizes[0].name, product.colors[0].name);
    }
  };

  const handleAddToWishlist = () => {
    if (onAddToWishlist) {
      onAddToWishlist(product.id);
    }
  };

  const handleQuickView = () => {
    if (onQuickView) {
      onQuickView(product.id);
    }
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        {/* Discount Badge */}
        {discount && (
          <Badge className="absolute top-2 left-2 z-10 bg-red-500 text-white">
            -{discount}%
          </Badge>
        )}

        {/* Product Image */}
        <div className="relative w-full h-full">
          <Image
            src={isHovered ? hoverImage : primaryImage}
            alt={product.name}
            fill
            className={cn(
              "object-cover transition-all duration-500",
              imageLoading ? "scale-110 blur-sm" : "scale-100 blur-0"
            )}
            onLoad={() => setImageLoading(false)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>

        {/* Overlay Actions */}
        <div className={cn(
          "absolute inset-0 bg-black/20 flex items-center justify-center gap-2 transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full bg-white/90 hover:bg-white"
            onClick={handleQuickView}
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          <Button
            size="icon"
            variant="secondary"
            className={cn(
              "h-10 w-10 rounded-full bg-white/90 hover:bg-white",
              isInWishlist && "bg-red-50 text-red-500"
            )}
            onClick={handleAddToWishlist}
          >
            <Heart className={cn("h-4 w-4", isInWishlist && "fill-current")} />
          </Button>

          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full bg-white/90 hover:bg-white"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Stock Status */}
        {product.stock.length === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="bg-white text-black">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-2">
        {/* Designer/Brand */}
        {product.design?.designer && (
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            {product.design.designer.firstName} {product.design.designer.lastName}
          </p>
        )}

        {/* Product Name */}
        <Link href={`/customer/products/${product.id}`}>
          <h3 className="font-medium text-sm hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3",
                  i < Math.floor(averageRating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Colors */}
        {product.colors.length > 0 && (
          <div className="flex items-center gap-1">
            {product.colors.slice(0, 4).map((color) => (
              <div
                key={color.id}
                className="h-4 w-4 rounded-full border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: color.hexCode }}
                title={color.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-500 ml-1">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Add to Cart Button */}
        <Button
          className={cn(
            "w-full mt-3 transition-all duration-300",
            isHovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-80"
          )}
          onClick={handleAddToCart}
          disabled={product.stock.length === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock.length === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardContent>
    </Card>
  );
}
