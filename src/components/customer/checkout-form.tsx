'use client';

import { useState } from 'react';
import { Address, CartItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  MapPin, 
  User,
  ChevronRight
} from 'lucide-react';

interface CheckoutFormProps {
  step: 'shipping' | 'payment' | 'review';
  onStepChange: (step: 'shipping' | 'payment' | 'review') => void;
  shippingAddress: Address | null;
  onShippingAddressChange: (address: Address) => void;
  paymentMethod: 'card' | 'bank_transfer' | 'cash_on_delivery';
  onPaymentMethodChange: (method: 'card' | 'bank_transfer' | 'cash_on_delivery') => void;
  cartItems: CartItem[];
  onPlaceOrder: () => void;
}

export function CheckoutForm({
  step,
  onStepChange,
  shippingAddress,
  onShippingAddressChange,
  paymentMethod,
  onPaymentMethodChange,
  cartItems,
  onPlaceOrder
}: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveShipping = () => {
    const address: Address = {
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country
    };
    onShippingAddressChange(address);
    onStepChange('payment');
  };

  const handleSavePayment = () => {
    onStepChange('review');
  };

  if (step === 'shipping') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                placeholder="123 Main Street"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="New York"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="NY"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="10001"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
            </div>
          </div>
          <Button onClick={handleSaveShipping} className="w-full">
            Continue to Payment
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'payment') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="card"
                name="payment"
                checked={paymentMethod === 'card'}
                onChange={() => onPaymentMethodChange('card')}
                className="w-4 h-4 text-blue-600"
              />
              <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                <CreditCard className="h-4 w-4" />
                Credit/Debit Card
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="cod"
                name="payment"
                checked={paymentMethod === 'cash_on_delivery'}
                onChange={() => onPaymentMethodChange('cash_on_delivery')}
                className="w-4 h-4 text-blue-600"
              />
              <Label htmlFor="cod" className="cursor-pointer">
                Cash on Delivery
              </Label>
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onStepChange('shipping')}>
              Back
            </Button>
            <Button onClick={handleSavePayment} className="flex-1">
              Review Order
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'review') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Review Your Order
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Shipping Address Review */}
          <div>
            <h3 className="font-medium mb-2">Shipping Address</h3>
            <div className="p-3 bg-gray-50 rounded-lg text-sm">
              <p>{shippingAddress?.street}</p>
              <p>{shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.zipCode}</p>
              <p>{shippingAddress?.country}</p>
            </div>
          </div>

          {/* Payment Method Review */}
          <div>
            <h3 className="font-medium mb-2">Payment Method</h3>
            <div className="p-3 bg-gray-50 rounded-lg text-sm">
              {paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-medium mb-2">Order Items ({cartItems.length})</h3>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                  <span>{item.product.name} ({item.size}, {item.color}) × {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onStepChange('payment')}>
              Back
            </Button>
            <Button onClick={onPlaceOrder} className="flex-1">
              Place Order
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
