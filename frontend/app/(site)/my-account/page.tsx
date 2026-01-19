/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { Package, Loader2, Eye, Calendar, CreditCard, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '@/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Order } from '@/script/types';


export default function MyOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Get current user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);


    // Fetch orders for current user
    useEffect(() => {
        if (!userId) return;

        const ordersRef = collection(db, 'orders');
        const q = query(
            ordersRef,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const ordersData: Order[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Omit<Order, 'id'>),
                }));

                setOrders(ordersData);
                setLoading(false); // ✅ async callback — allowed
            },
            (error) => {
                console.error('Error fetching orders:', error);
                setLoading(false); // ✅ async callback — allowed
            }
        );

        return () => unsubscribe();
    }, [userId]);


    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };


    const handleViewDetails = (order: any) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-gray-900">
                            Home
                        </Link>
                        <span>›</span>
                        <Link href="/my-account" className="hover:text-gray-900">
                            My account
                        </Link>
                        <span>›</span>
                        <span className="text-gray-900">My orders</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 sticky top-4 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <Card>
                            <CardContent className="p-4 space-y-2">
                                <Link
                                    href="/my-orders"
                                    className="block px-4 py-2 rounded hover:bg-gray-100 font-medium text-gray-900"
                                >
                                    My orders
                                </Link>
                                <Link
                                    href="/my-addresses"
                                    className="block px-4 py-2 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                >
                                    My addresses
                                </Link>
                                <Link
                                    href="/logout"
                                    className="block px-4 py-2 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                >
                                    Logout
                                </Link>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1">
                        <Card className="min-h-[500px]">
                            {/* Header */}
                            <div className="border-b px-6 py-4">
                                <h1 className="text-2xl font-semibold text-gray-900">My orders</h1>
                            </div>

                            {/* Loading State */}
                            {loading && (
                                <div className="flex flex-col items-center justify-center py-16 px-4">
                                    <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-4" />
                                    <p className="text-gray-600">Loading your orders...</p>
                                </div>
                            )}

                            {/* Empty State */}
                            {!loading && orders.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 px-4">
                                    <div className="relative mb-6">
                                        <Package className="w-20 h-20 text-gray-300" strokeWidth={1.5} />
                                        <div className="absolute -top-1 -right-1 bg-black rounded-full w-6 h-6 flex items-center justify-center">
                                            <span className="text-white text-xs">0</span>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 mb-6 text-center">No orders yet</p>

                                    <Button asChild className="bg-black hover:bg-gray-800">
                                        <Link href="/">Make your first order</Link>
                                    </Button>
                                </div>
                            )}

                            {/* Orders List */}
                            {!loading && orders.length > 0 && (
                                <div className="divide-y">
                                    {orders.map((order) => (
                                        <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                                            {/* Order Header */}
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-semibold text-gray-900">
                                                        Order #{order.id.slice(-8).toUpperCase()}
                                                    </h3>
                                                    <Badge variant='outline'>
                                                        {order.status || 'Pending'}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(order.createdAt)}
                                                </div>
                                            </div>

                                            {/* Order Items */}
                                            <div className="space-y-3 mb-4">
                                                {order.items?.slice(0, 2).map((item, index) => (
                                                    <div key={index} className="flex gap-4">
                                                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                                                            {item.image && (
                                                                <Image
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    width={400}
                                                                    height={400}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium text-gray-900 truncate">
                                                                {item.name}
                                                            </h4>
                                                            <p className="text-sm text-gray-600">
                                                                Quantity: {item.quantity}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-medium text-gray-900">
                                                                ₦{item.price?.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {order.items?.length > 2 && (
                                                    <p className="text-sm text-gray-500 ml-20">
                                                        +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Order Total & Action */}
                                            <div className="flex justify-between items-center pt-4 border-t">
                                                <div>
                                                    <span className="text-gray-600 text-sm">Total: </span>
                                                    <span className="text-xl font-bold text-gray-900">
                                                        ₦{order.total?.toLocaleString() || 0}
                                                    </span>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleViewDetails(order)}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </main>
                </div>
            </div>

            {/* Order Details Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span>Order Details</span>
                            {selectedOrder && (
                                <Badge variant='outline'>
                                    {selectedOrder.status || 'Pending'}
                                </Badge>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedOrder && `Order #${selectedOrder.id.slice(-8).toUpperCase()}`}
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="max-h-[calc(90vh-120px)]">
                        {selectedOrder && (
                            <div className="space-y-6 pr-4">
                                {/* Order Info */}
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-start gap-3">
                                                <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Order Date</p>
                                                    <p className="text-sm text-gray-600">{formatDate(selectedOrder.createdAt)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <CreditCard className="w-5 h-5 text-gray-500 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Payment Method</p>
                                                    <p className="text-sm text-gray-600">{selectedOrder.paymentMethod || 'Card Payment'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Shipping Address (if available) */}
                                {selectedOrder.shippingAddress && (
                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 mb-2">Shipping Address</p>
                                                    <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.name}</p>
                                                    <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.address}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                                                    </p>
                                                    {selectedOrder.shippingAddress.phone && (
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Phone className="w-4 h-4 text-gray-500" />
                                                            <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.phone}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Order Items */}
                                <Card>
                                    <CardContent className="pt-6">
                                        <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                                        <div className="space-y-4">
                                            {selectedOrder.items?.map((item, index) => (
                                                <div key={index}>
                                                    <div className="flex gap-4">
                                                        <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden shrink-0">
                                                            {item.image && (
                                                                <Image
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    width={400}
                                                                    height={400}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                ₦{item.price?.toLocaleString()} × {item.quantity}
                                                            </p>
                                                            {item.productId && (
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    Product ID: {item.price}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-gray-900">
                                                                ₦{((item.price || 0) * (item.quantity || 0)).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {index < selectedOrder.items.length - 1 && (
                                                        <Separator className="my-4" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Order Summary */}
                                <Card>
                                    <CardContent className="pt-6">
                                        <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Subtotal</span>
                                                <span className="text-gray-900">₦{selectedOrder.total?.toLocaleString() || 0}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Shipping</span>
                                                <span className="text-gray-900">{selectedOrder.shipping || 'Free'}</span>
                                            </div>
                                            {selectedOrder.discount && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Discount</span>
                                                    <span className="text-green-600">-₦{selectedOrder.discount.toLocaleString()}</span>
                                                </div>
                                            )}
                                            <Separator />
                                            <div className="flex justify-between">
                                                <span className="font-semibold text-gray-900">Total</span>
                                                <span className="font-bold text-xl text-gray-900">
                                                    ₦{selectedOrder.total?.toLocaleString() || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* Bottom Features Section */}
            <div className="bg-white border-t mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="flex items-start space-x-4">
                            <div className="shrink-0">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Satisfied or refunded</h3>
                                <p className="text-sm text-gray-600">30-day return policy</p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex items-start space-x-4">
                            <div className="shrink-0">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Top-notch support</h3>
                                <p className="text-sm text-gray-600">24/7 customer service</p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex items-start space-x-4">
                            <div className="shrink-0">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Secure payments</h3>
                                <p className="text-sm text-gray-600">SSL encrypted checkout</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}