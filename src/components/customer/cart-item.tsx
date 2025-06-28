'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Minus, 
  Plus, 
  Trash2, 
  Heart,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onRemove?: (itemId: string) => void;
  onMoveToWishlist?: (itemId: string) => void;
  className?: string;
  editable?: boolean;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  onMoveToWishlist,
  className,
  editable = true
}: CartItemProps) {
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const productImage = item.product.images[0] || '/images/placeholder-product.jpg';
  const totalPrice = item.price * item.quantity;
  const maxStock = 10; // TODO: Get from actual stock

  const handleQuantityChange = async (newQuantity: number) => {
    if (!editable || !onUpdateQuantity) return;
    
    if (newQuantity < 1 || newQuantity > maxStock) return;
    
    setLoading(true);
    try {
      await onUpdateQuantity(item.id, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!editable || !onRemove) return;
    
    setLoading(true);
    try {
      await onRemove(item.id);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToWishlist = async () => {
    if (!editable || !onMoveToWishlist) return;
    
    setLoading(true);
    try {
      await onMoveToWishlist(item.id);
    } catch (error) {
      console.error('Failed to move to wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={cn("group", className)}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 md:w-24 md:h-24 relative overflow-hidden rounded-md bg-gray-100">
              <Image
                src={imageError ? '/images/placeholder-product.jpg' : productImage}
                alt={item.product.name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                sizes="96px"
              />
            </div>
            {loading && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-md">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0">
                <Link 
                  href={`/customer/products/${item.product.id}`}
                  className="font-medium text-sm hover:text-blue-600 transition-colors line-clamp-2 flex items-center gap-1"
                >
                  {item.product.name}
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                
                {/* Designer */}
                {item.product.design?.designer && (
                  <p className="text-xs text-gray-500 mt-1">
                    by {item.product.design.designer.firstName} {item.product.design.designer.lastName}
                  </p>
                )}

                {/* Variants */}
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    Size: {item.size}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Color: {item.color}
                  </Badge>
                </div>
              </div>

              {/* Price */}
              <div className="text-right ml-4">
                <p className="font-semibold">${totalPrice.toFixed(2)}</p>
                {item.quantity > 1 && (
                  <p className="text-xs text-gray-500">
                    ${item.price.toFixed(2)} each
                  </p>
                )}
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex items-center justify-between mt-3">
              {/* Quantity Controls */}
              {editable ? (
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    disabled={loading || item.quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                    {item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    disabled={loading || item.quantity >= maxStock}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  Qty: {item.quantity}
                </div>
              )}

              {/* Action Buttons */}
              {editable && (
                <div className="flex items-center gap-2">
                  {onMoveToWishlist && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMoveToWishlist}
                      disabled={loading}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  )}
                  {onRemove && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemove}
                      disabled={loading}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Stock Warning */}
            {maxStock <= 5 && (
              <p className="text-xs text-orange-600 mt-2">
                Only {maxStock} left in stock
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
