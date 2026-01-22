/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { Truck, Store, Info, Loader2, CreditCard, Building, Clock } from 'lucide-react';
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
    const { orderId } = useParams();
    const router = useRouter();
    const [deliveryMethod, setDeliveryMethod] = useState('ship');
    const [paymentMethod, setPaymentMethod] = useState('paystack');
    const [billingAddress, setBillingAddress] = useState('same');
    const [pickupLocations, setPickupLocations] = useState<any[]>([]);
    const [discountCode, setDiscountCode] = useState('');
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [subtotal, setSubtotal] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('lagos');
    const [selectedPickupLocation, setSelectedPickupLocation] = useState<string>('');
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return;

            const orderRef = doc(db, 'orders', orderId as string);
            const snap = await getDoc(orderRef);

            if (!snap.exists()) {
                console.error('Order not found');
                return;
            }

            const data = snap.data();
            console.log('📦 Order data from Firebase:', data);
            setCartItems(data.items || []);
            setSubtotal(data.total || 0);

            if (data.deliveryMethod) {
                setDeliveryMethod(data.deliveryMethod);
            }
            if (data.paymentMethod) {
                setPaymentMethod(data.paymentMethod);
            }
        };

        fetchOrder();
    }, [orderId]);


    useEffect(() => {
        const fetchPickupLocations = async () => {
            try {
                const pickupRef = collection(db, 'pickupAddresses');
                const querySnapshot = await getDocs(pickupRef);

                const locations = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        name: data.name || 'Unnamed Location',
                        address: data.address || '',
                        city: data.city || '',
                        state: data.state || '',
                        businessHours: data.businessHours || {
                            opening: '09:00',
                            closing: '18:00',
                            days: ['Mon-Fri']
                        },
                        isDefault: data.isDefault || false,
                        isActive: data.isActive !== false,
                        free: true,
                        readyTime: 'Usually ready in 2-4 days',
                        distance: 'Within city'
                    };
                });
                const activeLocations = locations.filter(loc => loc.isActive);
                activeLocations.sort((a, b) => {
                    if (a.isDefault && !b.isDefault) return -1;
                    if (!a.isDefault && b.isDefault) return 1;
                    return 0;
                });

                setPickupLocations(activeLocations);
                if (activeLocations.length > 0) {
                    const defaultLocation = activeLocations.find(loc => loc.isDefault);
                    if (defaultLocation) {
                        setSelectedPickupLocation(defaultLocation.id);
                    } else {
                        setSelectedPickupLocation(activeLocations[0].id);
                    }
                }
            } catch (error) {
                console.error('Error fetching pickup locations:', error);
            }
        };

        fetchPickupLocations();
    }, []);

    const taxes = 200;
    const shippingCost = deliveryMethod === 'ship' ? (subtotal >= 130000 ? 0 : 1500) : 0;
    const total = subtotal + taxes + shippingCost;
    const amountInKobo = total * 100;



    const verifyPayment = async (reference: string) => {
        try {
            console.log('🔍 Verifying payment with reference:', reference);

            const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`
                }
            });

            const data = await response.json();
            console.log('✅ Paystack verification response:', data);

            if (data.status && data.data.status === 'success') {
                // Update order in Firebase
                const orderRef = doc(db, 'orders', orderId as string);
                await updateDoc(orderRef, {
                    paymentStatus: 'paid',
                    paymentMethod: 'paystack',
                    paymentReference: reference,
                    transactionId: data.data.id,
                    status: 'processing',
                    email: email,
                    customerName: `${firstName} ${lastName}`.trim(),
                    customerPhone: phone,
                    deliveryAddress: deliveryMethod === 'ship' ? {
                        address,
                        city,
                        state,
                        country: 'Nigeria'
                    } : null,
                    pickupLocation: deliveryMethod === 'pickup' ?
                        pickupLocations.find(loc => loc.id === selectedPickupLocation) : null,
                    updatedAt: new Date()
                });

                return { success: true, data: data.data };
            } else {
                console.error('❌ Payment verification failed:', data);
                return { success: false, error: data.message };
            }
        } catch (error) {
            console.error('❌ Verification error:', error);
            return { success: false, error };
        }
    };

    const handleBankTransfer = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            alert('Please login first');
            return;
        }

        if (!email) {
            alert('Please enter your email');
            return;
        }

        if (deliveryMethod === 'ship' && (!firstName || !lastName || !phone || !address || !city)) {
            alert('Please fill in all required shipping information');
            return;
        }

        setIsProcessing(true);

        try {
            const orderRef = doc(db, 'orders', orderId as string);
            await updateDoc(orderRef, {
                email: email,
                paymentMethod: 'bank',
                paymentStatus: 'pending_bank_transfer',
                deliveryMethod: deliveryMethod,
                customerName: `${firstName} ${lastName}`.trim(),
                customerPhone: phone,
                deliveryAddress: deliveryMethod === 'ship' ? {
                    address,
                    city,
                    state,
                    country: 'Nigeria'
                } : null,
                pickupLocation: deliveryMethod === 'pickup' ?
                    pickupLocations.find(loc => loc.id === selectedPickupLocation) : null,
                status: 'pending',
                updatedAt: new Date()
            });

            // Show bank transfer instructions
            alert(`
💰 Bank Transfer Instructions:

Bank Name: Zenith Bank
Account Name: ESSENZA STORES
Account Number: 1012345678

Please transfer ₦${total.toLocaleString()} to the account above.

IMPORTANT:
1. Use your Order ID as reference: ${orderId}
2. Send proof of payment to: payments@essenza.com
3. Your order will be processed within 24 hours after payment confirmation.

✅ After payment, you will receive email confirmation.
            `);

            // Redirect to orders page
            router.push(`/orders`);

        } catch (error: any) {
            console.error('💥 Bank transfer setup error:', error);
            alert(`Bank transfer setup failed: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePaystackPayment = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            alert('Please login first');
            return;
        }

        if (!email) {
            alert('Please enter your email');
            return;
        }

        if (deliveryMethod === 'ship' && (!firstName || !lastName || !phone || !address || !city)) {
            alert('Please fill in all required shipping information');
            return;
        }

        if (amountInKobo < 100) {
            alert('Amount must be at least ₦100');
            return;
        }

        setIsProcessing(true);

        try {
            const orderRef = doc(db, 'orders', orderId as string);
            await updateDoc(orderRef, {
                email: email,
                paymentMethod: 'paystack',
                paymentStatus: 'pending',
                deliveryMethod: deliveryMethod,
                customerName: `${firstName} ${lastName}`.trim(),
                customerPhone: phone,
                deliveryAddress: deliveryMethod === 'ship' ? {
                    address,
                    city,
                    state,
                    country: 'Nigeria'
                } : null,
                pickupLocation: deliveryMethod === 'pickup' ?
                    pickupLocations.find(loc => loc.id === selectedPickupLocation) : null,
                updatedAt: new Date()
            });

            // Generate a unique reference
            const reference = `order_${orderId}_${Date.now()}`;
            console.log('Payment reference:', reference);

            // Check if PaystackPop is available
            if (!(window as any).PaystackPop) {
                console.error('❌ PaystackPop not found on window object');
                alert('Payment service not loaded. Please refresh the page.');
                setIsProcessing(false);
                return;
            }

            console.log('✅ PaystackPop found, setting up payment...');

            // Create callback function
            const paymentCallback = function (response: any) {
                console.log('🔄 Paystack callback triggered');
                console.log('Callback response:', response);

                if (response && response.reference) {
                    console.log('✅ Payment successful, starting verification...');

                    const handleVerification = async () => {
                        try {
                            const verification = await verifyPayment(response.reference);

                            if (verification.success) {
                                console.log('🎉 Payment verified successfully');
                                alert('Payment successful!');
                                router.push(`/orders`);
                            } else {
                                await updateDoc(orderRef, {
                                    paymentStatus: 'failed',
                                    paymentError: verification.error,
                                    updatedAt: new Date()
                                });
                                console.error('❌ Payment verification failed:', verification.error);
                                alert(`Payment verification failed: ${verification.error}. Please contact support.`);
                            }
                        } catch (error) {
                            console.error('❌ Verification error in callback:', error);
                            alert('Payment verification error. Please contact support.');
                        } finally {
                            setIsProcessing(false);
                        }
                    };

                    handleVerification();
                } else {
                    console.error('❌ No reference in response:', response);
                    setIsProcessing(false);
                    alert('Payment response incomplete. Please contact support.');
                }
            };

            // Create onClose function
            const paymentOnClose = function () {
                console.log('⚠️ Payment popup closed by user');
                setIsProcessing(false);
                alert('Payment cancelled');
            };

            // Setup Paystack
            const handler = (window as any).PaystackPop.setup({
                key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
                email: email,
                amount: amountInKobo,
                currency: 'NGN',
                ref: reference,

                metadata: {
                    custom_fields: [
                        {
                            display_name: "Order ID",
                            variable_name: "order_id",
                            value: orderId
                        },
                        {
                            display_name: "Delivery Method",
                            variable_name: "delivery_method",
                            value: deliveryMethod
                        },
                        {
                            display_name: "Customer ID",
                            variable_name: "customer_id",
                            value: user.uid
                        }
                    ]
                },

                callback: paymentCallback,
                onClose: paymentOnClose
            });

            console.log('🎯 Opening Paystack popup...');
            handler.openIframe();

        } catch (error: any) {
            console.error('💥 Payment setup error:', error);
            console.error('Error stack:', error.stack);
            setIsProcessing(false);
            alert(`Payment setup failed: ${error.message}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log('=== CHECKOUT DETAILS ===');
        console.log('Order ID:', orderId);
        console.log('Delivery Method:', deliveryMethod);
        console.log('Payment Method:', paymentMethod);
        console.log('Email:', email);
        console.log('Total: ₦', total);
        console.log('===================');

        if (!cartItems.length) {
            alert('Cart is empty');
            return;
        }

        if (paymentMethod === 'paystack') {
            await handlePaystackPayment();
        } else if (paymentMethod === 'bank') {
            await handleBankTransfer();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <form ref={formRef} onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            {/* Contact Information */}
                            <div className="bg-white rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-[#A30000]">Contact</h2>
                                    <a href="#" className="text-sm text-[#A30000] hover:underline">Sign in</a>
                                </div>
                                <div className="space-y-4">
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="focus-visible:ring-2 focus-visible:ring-[#A30000]"
                                        required
                                    />

                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="newsletter" />
                                        <Label htmlFor="newsletter" className="text-sm font-normal cursor-pointer">
                                            Email me with news and offers
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Method */}
                            <div className="bg-white rounded-lg p-6">
                                <h2 className="text-xl font-semibold mb-4">Delivery Method</h2>

                                <RadioGroup
                                    value={deliveryMethod}
                                    onValueChange={setDeliveryMethod}
                                    className="space-y-3 mb-6"
                                >
                                    <div className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer ${deliveryMethod === 'ship' ? 'border-red-600 bg-red-50' : 'border-gray-200'}`}>
                                        <div className="flex items-center space-x-3">
                                            <RadioGroupItem value="ship" id="ship" />
                                            <Label htmlFor="ship" className="cursor-pointer font-medium flex items-center gap-2">
                                                <Truck className="h-5 w-5" />
                                                Ship to Address
                                            </Label>
                                        </div>
                                        <span className="text-sm font-medium">
                                            {subtotal >= 130000 ? 'FREE' : '₦1,500'}
                                        </span>
                                    </div>

                                    <div className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer ${deliveryMethod === 'pickup' ? 'border-red-600 bg-red-50' : 'border-gray-200'}`}>
                                        <div className="flex items-center space-x-3">
                                            <RadioGroupItem value="pickup" id="pickup" />
                                            <Label htmlFor="pickup" className="cursor-pointer font-medium flex items-center gap-2">
                                                <Store className="h-5 w-5" />
                                                Pick up in Store
                                            </Label>
                                        </div>
                                        <span className="text-sm font-medium text-green-600">FREE</span>
                                    </div>
                                </RadioGroup>

                                {/* Shipping Address Form */}
                                {deliveryMethod === 'ship' && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="firstName">First name *</Label>
                                                <Input
                                                    id="firstName"
                                                    placeholder="First name"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="lastName">Last name *</Label>
                                                <Input
                                                    id="lastName"
                                                    placeholder="Last name"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="phone">Phone number *</Label>
                                            <div className="relative">
                                                <Input
                                                    id="phone"
                                                    placeholder="Phone"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    required
                                                />
                                                <Info className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="address">Address *</Label>
                                            <Input
                                                id="address"
                                                placeholder="Street address"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <Input placeholder="Company (optional)" />

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="city">City *</Label>
                                                <Input
                                                    id="city"
                                                    placeholder="City"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="state">State *</Label>
                                                <Select value={state} onValueChange={setState}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="State" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="lagos">Lagos</SelectItem>
                                                        <SelectItem value="rivers">Rivers</SelectItem>
                                                        <SelectItem value="abuja">Abuja</SelectItem>
                                                        <SelectItem value="oyo">Oyo</SelectItem>
                                                        <SelectItem value="kaduna">Kaduna</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="save-info" />
                                            <Label htmlFor="save-info" className="text-sm font-normal cursor-pointer">
                                                Save this information for next time
                                            </Label>
                                        </div>
                                    </div>
                                )}

                                {/* Pickup Locations */}
                                {deliveryMethod === 'pickup' && (
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 border rounded-lg p-4 flex items-start gap-2">
                                            <Info className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
                                            <div className="text-sm">
                                                <p className="font-medium mb-1">Select your preferred pickup location</p>
                                                <p className="text-gray-600">
                                                    We&apos;ll notify you when your order is ready for pickup
                                                </p>
                                            </div>
                                        </div>

                                        <RadioGroup
                                            value={selectedPickupLocation}
                                            onValueChange={setSelectedPickupLocation}
                                            className="space-y-3"
                                        >
                                            {pickupLocations.map((location) => {
                                                const formatBusinessDays = (days: string[]) => {
                                                    if (days.length === 7) return 'Everyday';
                                                    if (days.includes('Monday') && days.includes('Friday') && days.length === 5) {
                                                        return 'Monday - Friday';
                                                    }
                                                    return days.join(', ');
                                                };

                                                return (
                                                    <div
                                                        key={location.id}
                                                        className={`border-2 rounded-lg p-4 ${selectedPickupLocation === location.id ? 'border-red-600 bg-red-50' : 'border-gray-200'}`}
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex items-start space-x-3">
                                                                <RadioGroupItem
                                                                    value={location.id}
                                                                    id={location.id}
                                                                    className="mt-1"
                                                                />
                                                                <div className="w-full">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <Label htmlFor={location.id} className="cursor-pointer font-medium text-base">
                                                                            {location.name}
                                                                        </Label>
                                                                        {location.isDefault && (
                                                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                                                                Default
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    {/* Address Details */}
                                                                    <div className="mt-2 space-y-1">
                                                                        <p className="text-sm font-medium text-gray-900">{location.address}</p>
                                                                        <p className="text-sm text-gray-600">
                                                                            {location.city}, {location.state} {location.zipCode ? `• ${location.zipCode}` : ''}
                                                                        </p>
                                                                        {location.country && (
                                                                            <p className="text-xs text-gray-500">{location.country}</p>
                                                                        )}
                                                                    </div>

                                                                    {/* Contact Information */}
                                                                    {(location.contactPerson || location.phone || location.email) && (
                                                                        <div className="mt-2 pt-2 border-t border-gray-100">
                                                                            <p className="text-xs font-medium text-gray-700 mb-1">Contact:</p>
                                                                            <div className="space-y-1">
                                                                                {location.contactPerson && (
                                                                                    <p className="text-sm text-gray-600">{location.contactPerson}</p>
                                                                                )}
                                                                                {location.phone && (
                                                                                    <p className="text-sm text-gray-600">{location.phone}</p>
                                                                                )}
                                                                                {location.email && (
                                                                                    <p className="text-sm text-gray-600 truncate">{location.email}</p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* Business Hours */}
                                                                    {location.businessHours && (
                                                                        <div className="mt-2 pt-2 border-t border-gray-100">
                                                                            <div className="flex items-start gap-2">
                                                                                <Clock className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                                                                                <div className="flex-1">
                                                                                    <p className="text-xs font-medium text-gray-700 mb-1">Business Hours:</p>
                                                                                    <p className="text-sm text-gray-600">
                                                                                        {location.businessHours.opening} - {location.businessHours.closing}
                                                                                    </p>
                                                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                                                        {formatBusinessDays(location.businessHours.days)}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* Additional Instructions */}
                                                                    {location.instructions && (
                                                                        <div className="mt-2 pt-2 border-t border-gray-100">
                                                                            <p className="text-xs font-medium text-gray-700 mb-1">Instructions:</p>
                                                                            <p className="text-sm text-gray-600">{location.instructions}</p>
                                                                        </div>
                                                                    )}

                                                                    <div className="mt-2 pt-2 border-t border-gray-100">
                                                                        <p className="text-xs font-medium text-gray-700 mb-1">Pickup Info:</p>
                                                                        <p className="text-sm text-gray-600">{location.readyTime || 'Usually ready in 2-4 days'}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-end gap-2">
                                                                <span className="text-sm font-semibold text-green-600">FREE</span>
                                                                <span className="text-xs text-gray-500">{location.distance}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </RadioGroup>
                                    </div>
                                )}
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-lg p-6">
                                <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
                                <p className="text-sm text-gray-600 mb-4">All transactions are secure and encrypted.</p>

                                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                                    {/* Paystack Option */}
                                    <div className={`border-2 rounded-lg ${paymentMethod === 'paystack' ? 'border-red-600' : 'border-gray-200'}`}>
                                        <div className="flex items-center justify-between p-4">
                                            <div className="flex items-center space-x-3">
                                                <RadioGroupItem value="paystack" id="paystack" />
                                                <Label htmlFor="paystack" className="cursor-pointer font-medium flex items-center gap-2">
                                                    <CreditCard className="h-5 w-5" />
                                                    Paystack
                                                </Label>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-8 h-5 bg-red-600 rounded"></div>
                                                <div className="w-8 h-5 bg-blue-600 rounded"></div>
                                                <div className="w-8 h-5 bg-yellow-400 rounded"></div>
                                            </div>
                                        </div>

                                        {paymentMethod === 'paystack' && (
                                            <div className="border-t p-4 bg-gray-50">
                                                <div className="text-center py-4 text-sm text-gray-600">
                                                    <p>After clicking &apos;Complete Order&apos;, you will be redirected to</p>
                                                    <p>Paystack to complete your purchase securely.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bank Transfer Option */}
                                    <div className={`border-2 rounded-lg ${paymentMethod === 'bank' ? 'border-red-600' : 'border-gray-200'}`}>
                                        <div className="flex items-center justify-between p-4">
                                            <div className="flex items-center space-x-3">
                                                <RadioGroupItem value="bank" id="bank" />
                                                <Label htmlFor="bank" className="cursor-pointer font-medium flex items-center gap-2">
                                                    <Building className="h-5 w-5" />
                                                    Bank Transfer
                                                </Label>
                                            </div>
                                            <span className="text-xs text-gray-500">Manual verification</span>
                                        </div>

                                        {paymentMethod === 'bank' && (
                                            <div className="border-t p-4 bg-gray-50">
                                                <div className="text-sm text-gray-600">
                                                    <p className="font-medium mb-2">Bank Transfer Instructions:</p>
                                                    <ul className="space-y-1 text-sm">
                                                        <li>• Bank: Zenith Bank</li>
                                                        <li>• Account Name: ESSENZA STORES</li>
                                                        <li>• Account Number: 1012345678</li>
                                                        <li>• Reference: Your Order ID</li>
                                                    </ul>
                                                    <p className="mt-2">You will receive bank details after order confirmation.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Billing Address */}
                            <div className="bg-white rounded-lg px-6 py-2">

                                <Button
                                    type="submit"
                                    disabled={isProcessing || !email}
                                    className="w-full mt-6 bg-red-700 hover:bg-red-800 text-white py-6 text-base font-medium"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {paymentMethod === 'paystack' ? 'Processing Payment...' : 'Processing Order...'}
                                        </>
                                    ) : (
                                        `Complete Order ${paymentMethod === 'paystack' ? 'with Paystack' : 'with Bank Transfer'}`
                                    )}
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

                        {/* Order Summary */}
                        <div className="lg:sticky lg:top-4 lg:h-fit">
                            <div className="bg-white rounded-lg p-6 space-y-4">
                                <h2 className="text-xl font-semibold">Order Summary</h2>

                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center">
                                                    {item.image ? (
                                                        <Image src={item.image}
                                                            width={200}
                                                            height={200}
                                                            alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gray-300 rounded"></div>
                                                    )}
                                                </div>
                                                <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{item.name}</p>
                                                <p className="text-xs text-gray-500">₦{item.price?.toLocaleString() || '0'}</p>
                                            </div>
                                            <div className="text-sm font-medium">
                                                ₦{((item.price || 0) * (item.quantity || 1)).toLocaleString()}.00
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2 pt-4 border-t">
                                    <Input
                                        placeholder="Discount code or gift card"
                                        value={discountCode}
                                        onChange={(e) => setDiscountCode(e.target.value)}
                                    />
                                    <Button type="button" variant="outline" className="px-6">Apply</Button>
                                </div>

                                <div className="space-y-2 pt-4 border-t">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal · {cartItems.length} products</span>
                                        <span className="font-medium">₦{subtotal.toLocaleString()}.00</span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <div className="flex items-center gap-1">
                                            <span className="text-gray-600">
                                                {deliveryMethod === 'pickup' ? 'Pickup in store' : 'Shipping'}
                                            </span>
                                            <Info className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                                            {shippingCost === 0 ? 'FREE' : `₦${shippingCost.toLocaleString()}.00`}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <div className="flex items-center gap-1">
                                            <span className="text-gray-600">Estimated taxes</span>
                                            <Info className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <span className="font-medium">₦{taxes.toLocaleString()}.00</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t">
                                    <span className="text-xl font-semibold">Total</span>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-500 mr-2">NGN</span>
                                        <span className="text-2xl font-bold">₦{total.toLocaleString()}.00</span>
                                    </div>
                                </div>

                                {/* Order Details Summary */}
                                <div className="pt-4 border-t text-sm">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Delivery:</span>
                                            <span className="font-medium">
                                                {deliveryMethod === 'ship' ? 'Shipping to Address' : 'Store Pickup'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Payment:</span>
                                            <span className="font-medium">
                                                {paymentMethod === 'paystack' ? 'Paystack' : 'Bank Transfer'}
                                            </span>
                                        </div>
                                        {deliveryMethod === 'pickup' && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Pickup Location:</span>
                                                <span className="font-medium text-right">
                                                    {pickupLocations.find(loc => loc.id === selectedPickupLocation)?.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}