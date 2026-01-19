/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Minus, Plus, Gift, Truck, ChevronDown, Lock, ShieldCheck, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';
import ProductSection from '@/components/shared/ProductGrid';
import { getAuth } from 'firebase/auth';
import { Product } from '@/components/shared/ProductGrid'
import { db } from '@/firebase/firebaseConfig';
import { addDoc, collection, getDocs, serverTimestamp, deleteDoc, doc, query, where, orderBy, Timestamp, } from 'firebase/firestore';
import { useRouter } from 'next/navigation';



export default function ShoppingCartPage() {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const router = useRouter();
    const [justIn, setJustIn] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJustIn = async () => {
            try {
                const oneMonthAgo = Timestamp.fromDate(
                    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                );

                const q = query(
                    collection(db, 'products'),
                    where('status', '==', 'active'),
                    where('createdAt', '>=', oneMonthAgo),
                    orderBy('createdAt', 'desc')
                );

                const snapshot = await getDocs(q);

                const justInProducts: Product[] = snapshot.docs.map((doc) => {
                    const data = doc.data();

                    return {
                        id: doc.id,
                        title: data.name,
                        price: data.basePrice,
                        img: data.images || [],
                        brand: data.brand,
                    };
                });

                setJustIn(justInProducts);
            } catch (error) {
                console.error('Error fetching Just In products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJustIn();
    }, []);


    const guarantees = [
        {
            title: "Premium Quality",
            description:
                "Carefully curated products that meet the highest quality standards.",
            icon: ShieldCheck,
        },
        {
            title: "Authentic Products",
            description:
                "100% genuine and original products sourced from trusted brands.",
            icon: BadgeCheck,
        },
        {
            title: "Secure Shopping",
            description:
                "Your payments and personal information are protected at all times.",
            icon: Lock,
        },
    ];

    const [isOrderInstructionsOpen, setIsOrderInstructionsOpen] = useState(false);
    const [isShippingEstimateOpen, setIsShippingEstimateOpen] = useState(false);




    useEffect(() => {
        const fetchCart = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) return;

            const snap = await getDocs(
                collection(db, 'users', user.uid, 'cart')
            );

            const items = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            console.log('🛒 Cart fetched:', items);

            setCartItems(items as any[]);
        };

        fetchCart();
    }, []);


    const updateQuantity = (id: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const removeItem = (id: number) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const getItemTotal = (item: typeof cartItems[0]) => {
        return item.price * item.quantity;
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + getItemTotal(item), 0);
    };

    const formatPrice = (price: number) => {
        return `₦${price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const handleCheckout = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            alert('Please login first');
            return;
        }

        if (cartItems.length === 0) {
            alert('Cart is empty');
            return;
        }

        try {
            // Create order
            const orderData = {
                userId: user.uid,
                items: cartItems,
                total: getCartTotal(),
                status: 'pending',
                createdAt: serverTimestamp(),
            };

            const orderRef = await addDoc(
                collection(db, 'orders'),
                orderData
            );

            console.log('✅ Order created:', orderRef.id);

            // Clear cart after creating order
            await clearUserCart(user.uid);

            // Redirect to checkout
            router.push(`/checkout/${orderRef.id}`);

        } catch (error) {
            console.error('❌ Error creating order:', error);
            alert('Error creating order. Please try again.');
        }
    };

    // Add this function to clear cart
    const clearUserCart = async (userId: string) => {
        try {
            const cartRef = collection(db, 'users', userId, 'cart');
            const cartSnapshot = await getDocs(cartRef);

            // Delete all cart items
            const deletePromises = cartSnapshot.docs.map(docItem =>
                deleteDoc(doc(db, 'users', userId, 'cart', docItem.id))
            );

            await Promise.all(deletePromises);
            console.log('🛒 Cart cleared successfully');

            // Update local state
            setCartItems([]);

        } catch (error) {
            console.error('❌ Error clearing cart:', error);
        }
    };


    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-medium mb-2">My cart</h1>
                <p className="text-gray-600">You are eligible for free shipping!</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="border rounded-lg overflow-hidden">
                        <div className="grid grid-cols-12 gap-4 bg-gray-50 p-4 text-sm font-medium text-gray-700 border-b">
                            <div className="col-span-5">Product</div>
                            <div className="col-span-4 text-center">Quantity</div>
                            <div className="col-span-3 text-right">Total</div>
                        </div>

                        {cartItems.map((item) => (
                            <div key={item.id} className="grid grid-cols-12 gap-4 p-4 items-center border-b last:border-b-0">
                                <div className="col-span-5 flex items-center gap-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center shrink-0">
                                        <Image src={item.image} alt={item.name} width={80} height={80} className="object-contain" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm">{item.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{formatPrice(item.price)}</p>
                                    </div>
                                </div>

                                <div className="col-span-4 flex flex-col items-center gap-2">
                                    <div className="inline-flex items-center border rounded">
                                        <Button
                                            variant='none'
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="px-3 py-1 border-r rounded-none hover:bg-gray-100 transition"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="px-4 py-1 min-w-[50px] text-center font-medium">
                                            {item.quantity}
                                        </span>
                                        <Button
                                            variant='none'
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="px-3 py-1 border-l rounded-none hover:bg-gray-100 transition"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Button
                                        variant='none'
                                        onClick={() => removeItem(item.id)}
                                        className="text-sm text-gray-500 hover:text-red-600 transition"
                                    >
                                        Remove
                                    </Button>
                                </div>

                                <div className="col-span-3 text-right font-medium">
                                    {formatPrice(getItemTotal(item))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Gift className="h-6 w-6" />
                            <div>
                                <span className="font-medium">Do you want a gift wrap?</span>
                                <span className="text-gray-600 ml-2">Only ₦2,500.00</span>
                            </div>
                        </div>
                        <Button className="bg-red-700 hover:bg-red-800 text-white">
                            Add a gift wrap
                        </Button>
                    </div>

                    <Collapsible
                        open={isShippingEstimateOpen}
                        onOpenChange={setIsShippingEstimateOpen}
                        className="border rounded-lg"
                    >
                        <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition">
                            <div className="flex items-center gap-3">
                                <Truck className="h-6 w-6" />
                                <span className="font-medium">Estimate shipping</span>
                            </div>
                            <ChevronDown className={`h-5 w-5 transition-transform ${isShippingEstimateOpen ? 'rotate-180' : ''}`} />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4 pt-0 border-t">
                            <p className="text-sm text-gray-600">
                                Shipping options will be calculated at checkout based on your location.
                            </p>
                        </CollapsibleContent>
                    </Collapsible>
                </div>


                <div className="lg:col-span-1">
                    <div className="border rounded-lg p-6 space-y-6 sticky top-4">
                        <div className="flex items-center justify-between text-xl font-semibold">
                            <span>Total</span>
                            <span>{formatPrice(getCartTotal())} NGN</span>
                        </div>


                        <Collapsible
                            open={isOrderInstructionsOpen}
                            onOpenChange={setIsOrderInstructionsOpen}
                        >
                            <CollapsibleTrigger className="w-full flex items-center justify-between text-left py-2 border-b">
                                <span className="text-gray-700">Order instructions</span>
                                <ChevronDown className={`h-5 w-5 transition-transform ${isOrderInstructionsOpen ? 'rotate-180' : ''}`} />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pt-4">
                                <Textarea
                                    placeholder="Add special instructions for your order..."
                                    className="w-full border rounded p-2 text-sm min-h-25"
                                />
                            </CollapsibleContent>
                        </Collapsible>

                        <p className="text-sm text-gray-600">
                            Taxes and{' '}
                            <a href="#" className="underline hover:no-underline">
                                shipping
                            </a>{' '}
                            calculated at checkout
                        </p>

                        <Button
                            onClick={handleCheckout}
                            className="w-full bg-black hover:bg-gray-800 text-white py-6 text-base font-medium">
                            Checkout
                        </Button>

                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                            <Lock className="h-4 w-4" />
                            <span>100% Secure Payments</span>
                        </div>
                    </div>
                </div>
            </div>



            <div className="border-grey-900 m-6 p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    Our Guarantees
                </h3>

                <div className="grid gap-4 lg:grid-cols-3">
                    {guarantees.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={index}
                                className="flex gap-4 p-4 border rounded-md hover:shadow-sm transition"
                            >
                                <div className="flex items-start">
                                    <Icon className="h-6 w-6 text-black mt-1" />
                                </div>

                                <div>
                                    <h6 className="font-medium text-gray-900">
                                        {item.title}
                                    </h6>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>


            <ProductSection title="Complete Your Cart" items={justIn} />
        </div>
    );
}