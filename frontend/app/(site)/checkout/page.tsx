'use client';

import { useState } from 'react';
import { Truck, Store, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function CheckoutPage() {
    const [deliveryMethod, setDeliveryMethod] = useState('ship');
    const [paymentMethod, setPaymentMethod] = useState('paystack');
    const [billingAddress, setBillingAddress] = useState('same');
    const [discountCode, setDiscountCode] = useState('');

    const cartItems = [
        { id: 1, name: 'Gift Wrap', price: 2500, quantity: 1, image: '' },
        { id: 2, name: 'Armaf Club De Nuit Intense Man EDT 105ml', price: 138000, quantity: 2, image: '' }
    ];

    const subtotal = 140500;
    const taxes = 1405;
    const total = 141905;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-[#A30000]">Contact</h2>
                                <a href="#" className="text-sm text-[#A30000] hover:underline">Sign in</a>
                            </div>
                            <div className="space-y-4">
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    className="focus-visible:ring-2 focus-visible:ring-[#A30000]focus-visible:border-[#A30000"
                                />

                                <div className="flex items-center space-x-2">
                                    <Checkbox id="newsletter" />
                                    <Label htmlFor="newsletter" className="text-sm font-normal cursor-pointer">
                                        Email me with news and offers
                                    </Label>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Delivery</h2>

                            <RadioGroup
                                value={deliveryMethod}
                                onValueChange={setDeliveryMethod}
                                className="space-y-3 mb-6"
                            >
                                <div
                                    onClick={() => setDeliveryMethod('ship')}
                                    className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition ${deliveryMethod === 'ship'
                                        ? 'border-red-600 bg-red-50'
                                        : 'border-gray-200 hover:border-gray-400'}`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <RadioGroupItem value="ship" id="ship" />
                                        <Label htmlFor="ship" className="cursor-pointer font-medium">
                                            Ship
                                        </Label>
                                    </div>
                                    <Truck className="h-5 w-5 text-red-600" />
                                </div>


                                <div
                                    onClick={() => setDeliveryMethod('pickup')}
                                    className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition ${deliveryMethod === 'pickup'
                                        ? 'border-red-600 bg-red-50'
                                        : 'border-gray-200 hover:border-gray-400'}`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <RadioGroupItem value="pickup" id="pickup" />
                                        <Label htmlFor="pickup" className="cursor-pointer font-medium">
                                            Pick up
                                        </Label>
                                    </div>
                                    <Store className="h-5 w-5" />
                                </div>
                            </RadioGroup>



                            {deliveryMethod === 'pickup' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold">Pickup locations</h3>
                                        <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
                                            <span>📍</span>
                                            <span>NG</span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600">There are 3 locations with stock close to you</p>

                                    <div className="bg-gray-50 border rounded-lg p-4 flex items-start gap-2">
                                        <Info className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
                                        <div className="text-sm">
                                            <p className="font-medium mb-1">The closest locations are more than 100 km away</p>
                                            <p className="text-gray-600">
                                                Select a location or{' '}
                                                <a href="#" className="text-blue-600 underline hover:no-underline">
                                                    ship to address
                                                </a>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Pickup Location Options */}
                                    <RadioGroup defaultValue="jabi" className="space-y-3">
                                        <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-gray-300 transition">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-3">
                                                    <RadioGroupItem value="palms" id="palms" className="mt-1" />
                                                    <div>
                                                        <Label htmlFor="palms" className="cursor-pointer font-medium">
                                                            ESSENZA PALMS LAGOS <span className="text-gray-500 font-normal">(434.9 km)</span>
                                                        </Label>
                                                        <p className="text-sm text-gray-600 mt-1">1 Bisway Street, Lekki LA</p>
                                                        <p className="text-xs text-gray-500 mt-1">Usually ready in 2-4 days</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-semibold text-green-600">FREE</span>
                                            </div>
                                        </div>

                                        <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-gray-300 transition">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-3">
                                                    <RadioGroupItem value="ikeja" id="ikeja" className="mt-1" />
                                                    <div>
                                                        <Label htmlFor="ikeja" className="cursor-pointer font-medium">
                                                            ICM Essenza Ikeja <span className="text-gray-500 font-normal">(452.8 km)</span>
                                                        </Label>
                                                        <p className="text-sm text-gray-600 mt-1">194 Obafemi Awolowo Way, Ikeja LA</p>
                                                        <p className="text-xs text-gray-500 mt-1">Usually ready in 2-4 days</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-semibold text-green-600">FREE</span>
                                            </div>
                                        </div>

                                        <div className="border-2 border-red-600 bg-red-50 rounded-lg p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-3">
                                                    <RadioGroupItem value="jabi" id="jabi" className="mt-1" />
                                                    <div>
                                                        <Label htmlFor="jabi" className="cursor-pointer font-medium">
                                                            ESSENZA JABI MALL <span className="text-gray-500 font-normal">(480.5 km)</span>
                                                        </Label>
                                                        <p className="text-sm text-red-600 mt-1">Bala Sokoto Way, Jabi 240102., Abuja FC</p>
                                                        <p className="text-xs text-gray-500 mt-1">Usually ready in 2-4 days</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-semibold text-green-600">FREE</span>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </div>
                            )}

                            {/* Shipping Form - Only shown when Ship is selected */}
                            {deliveryMethod === 'ship' && (
                                <div className="space-y-4">
                                    <Select defaultValue="nigeria">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Country/Region" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="nigeria">Nigeria</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Input placeholder="First name" />
                                        <Input placeholder="Last name" />
                                    </div>

                                    <Input placeholder="Company (optional)" />
                                    <Input placeholder="Address" />
                                    <Input placeholder="Apartment, suite, etc. (optional)" />

                                    <div className="grid grid-cols-3 gap-4">
                                        <Input placeholder="City" />
                                        <Select defaultValue="rivers">
                                            <SelectTrigger>
                                                <SelectValue placeholder="State" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="rivers">Rivers</SelectItem>
                                                <SelectItem value="lagos">Lagos</SelectItem>
                                                <SelectItem value="abuja">Abuja</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input placeholder="Postal code (optional)" />
                                    </div>

                                    <div className="relative">
                                        <Input placeholder="Phone" />
                                        <Info className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="save-info" />
                                        <Label htmlFor="save-info" className="text-sm font-normal cursor-pointer">
                                            Save this information for next time
                                        </Label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Shipping Method - Only shown for Ship delivery */}
                        {deliveryMethod === 'ship' && (
                            <div className="bg-white rounded-lg p-6">
                                <h2 className="text-xl font-semibold mb-4">Shipping method</h2>
                                <div className="border-2 border-red-600 bg-red-50 rounded-lg p-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Free Shipping</p>
                                        <p className="text-sm text-gray-600">(Only from ₦130,000.00 upwards)</p>
                                    </div>
                                    <span className="font-semibold text-green-600">FREE</span>
                                </div>
                            </div>
                        )}

                        {/* Payment Section */}
                        <div className="bg-white rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-2">Payment</h2>
                            <p className="text-sm text-gray-600 mb-4">All transactions are secure and encrypted.</p>

                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                                <div className={`border-2 rounded-lg ${paymentMethod === 'paystack' ? 'border-red-600' : 'border-gray-200'
                                    }`}>
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex items-center space-x-3">
                                            <RadioGroupItem value="paystack" id="paystack" />
                                            <Label htmlFor="paystack" className="cursor-pointer font-medium">Paystack</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-5 bg-red-600 rounded"></div>
                                            <div className="w-8 h-5 bg-blue-600 rounded"></div>
                                            <div className="w-8 h-5 bg-yellow-400 rounded"></div>
                                            <span className="text-xs text-gray-500">+5</span>
                                        </div>
                                    </div>

                                    {paymentMethod === 'paystack' && (
                                        <div className="border-t p-4 bg-gray-50">
                                            <div className="text-center py-8 text-sm text-gray-600">
                                                <div className="mb-4">
                                                    <div className="inline-block border-2 rounded p-4 mb-2">
                                                        <div className="w-24 h-16 bg-gray-200"></div>
                                                    </div>
                                                </div>
                                                <p>After clicking &apos;Pay now&apos;, you will be redirected to</p>
                                                <p>Paystack to complete your purchase securely.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className={`border-2 rounded-lg p-4 ${paymentMethod === 'bank' ? 'border-red-600' : 'border-gray-200'
                                    }`}>
                                    <div className="flex items-center space-x-3">
                                        <RadioGroupItem value="bank" id="bank" />
                                        <Label htmlFor="bank" className="cursor-pointer font-medium">Bank Deposit</Label>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Billing Address */}
                        <div className="bg-white rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Billing address</h2>
                            <RadioGroup value={billingAddress} onValueChange={setBillingAddress} className="space-y-3">
                                <div className={`border-2 rounded-lg p-4 ${billingAddress === 'same' ? 'border-red-600 bg-red-50' : 'border-gray-200'
                                    }`}>
                                    <div className="flex items-center space-x-3">
                                        <RadioGroupItem value="same" id="same" />
                                        <Label htmlFor="same" className="cursor-pointer font-medium">Same as shipping address</Label>
                                    </div>
                                </div>

                                <div className={`border-2 rounded-lg p-4 ${billingAddress === 'different' ? 'border-red-600 bg-red-50' : 'border-gray-200'
                                    }`}>
                                    <div className="flex items-center space-x-3">
                                        <RadioGroupItem value="different" id="different" />
                                        <Label htmlFor="different" className="cursor-pointer font-medium">Use a different billing address</Label>
                                    </div>
                                </div>
                            </RadioGroup>

                            <Button className="w-full mt-6 bg-red-700 hover:bg-red-800 text-white py-6 text-base font-medium">
                                Pay now
                            </Button>

                            <div className="flex items-center justify-center gap-4 mt-6 text-sm">
                                <a href="#" className="text-gray-600 hover:underline">Refund policy</a>
                                <span className="text-gray-300">|</span>
                                <a href="#" className="text-gray-600 hover:underline">Shipping</a>
                                <span className="text-gray-300">|</span>
                                <a href="#" className="text-gray-600 hover:underline">Privacy policy</a>
                                <span className="text-gray-300">|</span>
                                <a href="#" className="text-gray-600 hover:underline">Terms of service</a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:sticky lg:top-4 lg:h-fit">
                        <div className="bg-white rounded-lg p-6 space-y-4">
                            {/* Cart Items */}
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center">
                                                <div className="w-10 h-10 bg-gray-300 rounded"></div>
                                            </div>
                                            <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{item.name}</p>
                                        </div>
                                        <div className="text-sm font-medium">
                                            ₦{item.price.toLocaleString()}.00
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Discount Code */}
                            <div className="flex gap-2 pt-4 border-t">
                                <Input
                                    placeholder="Discount code or gift card"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value)}
                                />
                                <Button variant="outline" className="px-6">Apply</Button>
                            </div>

                            {/* Pricing Summary */}
                            <div className="space-y-2 pt-4 border-t">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal · 3 items</span>
                                    <span className="font-medium">₦{subtotal.toLocaleString()}.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <div className="flex items-center gap-1">
                                        <span className="text-gray-600">
                                            {deliveryMethod === 'pickup' ? 'Pickup in store' : 'Shipping'}
                                        </span>
                                        <Info className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <span className="font-medium text-green-600">FREE</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <div className="flex items-center gap-1">
                                        <span className="text-gray-600">Estimated taxes</span>
                                        <Info className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <span className="font-medium">₦{taxes.toLocaleString()}.00</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center pt-4 border-t">
                                <span className="text-xl font-semibold">Total</span>
                                <div className="text-right">
                                    <span className="text-xs text-gray-500 mr-2">NGN</span>
                                    <span className="text-2xl font-bold">₦{total.toLocaleString()}.00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}