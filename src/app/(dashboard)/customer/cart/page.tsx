'use client';

import { useState, useEffect } from 'react';
import { CartItem as CartItemType } from '@/lib/types';
import { CartItem } from '@/components/customer/cart-item';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  ArrowLeft, 
  Gift, 
  Truck,
  Shield,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Mock data - TODO: Replace with API calls
  useEffect(() => {
    const mockCartItems: CartItemType[] = [
      {
        id: '1',
        productId: '1',
        product: {
          id: '1',
          name: 'Elegant Summer Dress',
          description: 'A beautiful flowing dress perfect for summer occasions',
          price: 89.99,
          categoryId: '1',
          category: { id: '1', name: 'Dresses', isActive: true },
          images: ['/images/products/dress1.jpg'],
          sizes: [{ id: '1', name: 'M', label: 'Medium' }],
          colors: [{ id: '1', name: 'Blue', hexCode: '#3B82F6' }],
          isActive: true,
          createdAt: '2025-06-01T00:00:00Z',
          updatedAt: '2025-06-25T00:00:00Z',
          stock: []
        },
        quantity: 2,
        size: 'M',
        color: 'Blue',
        price: 89.99
      },
      {
        id: '2',
        productId: '2',
        product: {
          id: '2',
          name: 'Casual Cotton T-Shirt',
          description: 'Comfortable everyday cotton t-shirt',
          price: 29.99,
          categoryId: '2',
          category: { id: '2', name: 'T-Shirts', isActive: true },
          images: ['/images/products/tshirt1.jpg'],
          sizes: [{ id: '1', name: 'L', label: 'Large' }],
          colors: [{ id: '1', name: 'White', hexCode: '#FFFFFF' }],
          isActive: true,
          createdAt: '2025-06-01T00:00:00Z',
          updatedAt: '2025-06-25T00:00:00Z',
          stock: []
        },
        quantity: 1,
        size: 'L',
        color: 'White',
        price: 29.99
      }
    ];

    setTimeout(() => {
      setCartItems(mockCartItems);
      setLoading(false);
    }, 1000);
  }, []);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = async (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleMoveToWishlist = async (itemId: string) => {
    // TODO: Move to wishlist
    handleRemoveItem(itemId);
  };

  const handleApplyPromoCode = () => {
    // Mock promo code logic
    if (promoCode.toLowerCase() === 'save10') {
      setDiscount(0.1);
    } else if (promoCode.toLowerCase() === 'welcome20') {
      setDiscount(0.2);
    } else {
      setDiscount(0);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * discount;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = (subtotal - discountAmount) * 0.08; // 8% tax
  const total = subtotal - discountAmount + shipping + tax;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added any items to your cart yet. 
              Discover our amazing collection and find something you love!
            </p>
            <Button asChild size="lg">
              <Link href="/customer/products">
                Start Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/customer/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
                onMoveToWishlist={handleMoveToWishlist}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({(discount * 100).toFixed(0)}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <Button asChild className="w-full" size="lg">
                    <Link href="/customer/checkout">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Checkout
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Promo Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Promo Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleApplyPromoCode}
                    >
                      Apply
                    </Button>
                  </div>
                  {discount > 0 && (
                    <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                      <Gift className="h-3 w-3" />
                      Promo code applied! {(discount * 100).toFixed(0)}% off
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Truck className="h-4 w-4" />
                      <span>Free shipping on orders over $100</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Shield className="h-4 w-4" />
                      <span>7-day return policy</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Gift className="h-4 w-4" />
                      <span>Gift wrapping available</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
