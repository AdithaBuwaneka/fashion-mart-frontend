'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CartItem as CartItemType, Address } from '@/lib/types';
import { CheckoutForm } from '@/components/customer/checkout-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  Shield, 
  Lock,
  MapPin,
  User
} from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [billingAddress, setBillingAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer' | 'cash_on_delivery'>('card');
  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Mock cart data - TODO: Get from context or API
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
      }
    ];

    setTimeout(() => {
      setCartItems(mockCartItems);
      setLoading(false);
    }, 1000);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    // TODO: Implement order placement
    console.log('Placing order...', {
      items: cartItems,
      shippingAddress,
      billingAddress: sameAsShipping ? shippingAddress : billingAddress,
      paymentMethod,
      total
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/customer/cart">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600">Complete your purchase</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${step === 'shipping' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step === 'shipping' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
              }`}>
                <MapPin className="h-4 w-4" />
              </div>
              <span className="ml-2 font-medium">Shipping</span>
            </div>
            <div className={`w-16 h-px ${step !== 'shipping' ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`flex items-center ${step === 'payment' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step === 'payment' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
              }`}>
                <CreditCard className="h-4 w-4" />
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
            <div className={`w-16 h-px ${step === 'review' ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`flex items-center ${step === 'review' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step === 'review' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
              }`}>
                <User className="h-4 w-4" />
              </div>
              <span className="ml-2 font-medium">Review</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <CheckoutForm
              step={step}
              onStepChange={setStep}
              shippingAddress={shippingAddress}
              onShippingAddressChange={setShippingAddress}
              billingAddress={billingAddress}
              onBillingAddressChange={setBillingAddress}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              sameAsShipping={sameAsShipping}
              onSameAsShippingChange={setSameAsShipping}
              cartItems={cartItems}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                            <Image 
                              src={item.product.images[0] || '/images/placeholder-product.jpg'}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                            {item.quantity}
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.product.name}</p>
                          <p className="text-xs text-gray-500">{item.size} • {item.color}</p>
                        </div>
                        <div className="text-sm font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
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
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Security Features */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Lock className="h-4 w-4" />
                      <span>Secure SSL encrypted checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Truck className="h-4 w-4" />
                      <span>Free shipping on orders over $100</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Shield className="h-4 w-4" />
                      <span>7-day return policy</span>
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
