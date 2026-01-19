/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { addToCart } from '@/lib/addToCart';
import Image from 'next/image';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useParams } from 'next/navigation';
import { Label } from "@/components/ui/label";
import { viewproducts } from '@/data/product';
import { Input } from '@/components/ui/input';
import { db } from '@/firebase/firebaseConfig';
import { nigeriaStates } from '@/data/product';
import { Button } from '@/components/ui/button';
import { doc, getDoc } from 'firebase/firestore';
import Recommended from '@/components/shared/Recommended';
import { Minus, Plus, Facebook, Share2, Mail, Check, ChevronRight } from 'lucide-react';

export default function ProductDetailPage() {
    const { id } = useParams();
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [activeImage, setActiveImage] = useState(0);


    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };


    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const ref = doc(db, 'products', id as string);
                const snap = await getDoc(ref);

                if (snap.exists()) {
                    setProduct({
                        id: snap.id,
                        ...snap.data(),
                    });
                }

            } catch (err) {
                console.error('Error fetching product:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return <div className="p-10 text-center">Loading product...</div>;
    }

    if (!product) {
        return <div className="p-10 text-center">Product not found</div>;
    }


    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                <div>
                    <div className="flex gap-4 border border-grey-900 shadow-lg p-4 h-fit overflow-x-hidden overflow-y-hidden">

                        <div className="flex flex-col gap-3 max-h-120 overflow-y-auto">
                            {product.images.map((image: string, index: any) => (
                                <div
                                    key={index}
                                    onClick={() => setActiveImage(index)}
                                    className={`bg-white overflow-hidden relative w-20 h-20 p-4 shrink-0 transition ${activeImage === index
                                        ? 'border border-black cursor-pointer hover:opacity-80'
                                        : ''}`}
                                >
                                    <Image
                                        src={image}
                                        alt={`Product thumbnail ${index + 1}`}
                                        width={80}
                                        height={80}
                                        className="object-fill w-full h-full"
                                    />
                                </div>
                            ))}
                        </div>



                        <div className="flex-1 relative h-120 w-60 overflow-hidden  aspect-square flex items-center justify-center">
                            <Image
                                src={product.images[activeImage]}
                                alt="Selected product image"
                                width={450}
                                height={450}
                                className="object-contain h-full "
                                priority
                            />

                        </div>
                    </div>



                    <div className="border border-grey-900 shadow-lg p-6 mt-4">
                        <h3 className="text-lg font-semibold mb-3">Description</h3>

                        <Accordion
                            type="single"
                            collapsible
                            value={open ? 'item-1' : ''}
                            onValueChange={(val) => setOpen(val === 'item-1')}
                        >
                            <AccordionItem value="item-1" className="border-none">
                                {!open && (
                                    <div className="relative max-h-20 overflow-hidden">
                                        <p className="text-sm leading-relaxed whitespace-pre-line">
                                            {product.description}
                                        </p>

                                        <div className="absolute bottom-0 left-0 w-full h-16 bg-linear-to-t from-white to-transparent" />
                                    </div>
                                )}

                                <AccordionContent>
                                    <p className="text-sm leading-relaxed whitespace-pre-line">
                                        {product.description}
                                    </p>
                                </AccordionContent>

                                <AccordionTrigger className="mt-3 text-sm font-medium underline">
                                    {open ? 'See less' : 'See more'}
                                </AccordionTrigger>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    <div className="mt-8 border border-grey-900 shadow-lg space-y-6 bg-white ">
                        <h3 className="text-lg font-semibold p-6 text-gray-900">
                            Estimate Shipping
                        </h3>

                        <div className="grid grid-cols-1 p-6  md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <Label>Country</Label>
                                <Select>
                                    <SelectTrigger className="w-full rounded-none">
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="nigeria">Nigeria</SelectItem>
                                        <SelectItem value="ghana">Ghana</SelectItem>
                                        <SelectItem value="senegal">Senegal</SelectItem>
                                        <SelectItem value="ivory-coast">Côte d’Ivoire</SelectItem>
                                        <SelectItem value="benin">Benin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>


                            <div className="space-y-2">
                                <Label>State</Label>
                                <Select >
                                    <SelectTrigger className="w-full rounded-none">
                                        <SelectValue placeholder="Select state" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {nigeriaStates.map((state) => (
                                            <SelectItem key={state.value} value={state.value}>
                                                {state.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="zip-code">Zip Code</Label>
                                <Input
                                    id="zip-code"
                                    placeholder="e.g. 100001"
                                    className="w-full rounded-none"
                                />
                            </div>


                        </div>

                        <div className="flex p-6  items-end">
                            <Button className="rounded-none">
                                Estimate
                            </Button>
                        </div>


                        <div className='w-full border border-t-black'>
                            <AlertDialog>
                                <AlertDialogTrigger className="flex justify-between px-6 py-2 items-center w-full">
                                    <span>Refund policy</span>
                                    <ChevronRight className="h-4 w-4 shrink-0" />
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-3xl max-h-[85vh] p-4 overflow-y-auto">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-2xl font-semibold">
                                            Refund & Returns Policy
                                        </AlertDialogTitle>

                                        <AlertDialogDescription className="text-sm text-gray-600">
                                            Please review Essenza’s refund and return policy below. If you need
                                            further assistance, contact us at{" "}
                                            <a
                                                href="mailto:support@essenza.ng"
                                                className="underline font-medium"
                                            >
                                                support@essenza.ng
                                            </a>
                                            .
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <div className="space-y-6 text-sm text-gray-800 leading-relaxed mt-4">
                                        <section>
                                            <h3 className="font-semibold text-base mb-2">Returns & Refunds</h3>
                                            <p>
                                                If you are unhappy with your purchase, we will be pleased to accept
                                                items for return or exchange, provided they meet Essenza’s return
                                                requirements.
                                            </p>
                                        </section>

                                        <section>
                                            <h3 className="font-semibold text-base mb-2">Return Policy</h3>
                                            <ul className="list-disc pl-5 space-y-2">
                                                <li>
                                                    Returns or exchanges must be requested within <strong>15 days</strong>{" "}
                                                    of delivery for online orders and within <strong>15 days</strong> of
                                                    purchase for in-store purchases.
                                                </li>
                                                <li>
                                                    All returned items must pass our Quality Control review before a
                                                    refund is issued.
                                                </li>
                                                <li>
                                                    Items must be returned with the original receipt to confirm purchase.
                                                </li>
                                                <li>
                                                    Only unopened items in their original packaging and unused condition
                                                    are eligible.
                                                </li>
                                                <li>
                                                    Full returns must include any gift with purchase. Failure to do so
                                                    will result in a deduction of <strong>₦5,000</strong>, or the full
                                                    value of the gift item.
                                                </li>
                                                <li>
                                                    Damaged or defective items must be reported within 15 days of
                                                    delivery. Please inspect products upon receipt.
                                                </li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h3 className="font-semibold text-base mb-2">Eligibility & Refunds</h3>
                                            <ul className="list-disc pl-5 space-y-2">
                                                <li>
                                                    Only products purchased from <strong>essenza.ng</strong> or official
                                                    Essenza stores are eligible.
                                                </li>
                                                <li>
                                                    Refunds are issued only to the original purchaser and payment method.
                                                </li>
                                                <li>
                                                    Shipping fees are non-refundable unless the item is damaged or faulty.
                                                </li>
                                                <li>
                                                    Engraved or personalized items are not eligible for returns.
                                                </li>
                                                <li>
                                                    Items must be returned with original packaging and invoice. Essenza
                                                    is not responsible for lost or mishandled return shipments.
                                                </li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h3 className="font-semibold text-base mb-2">Faulty Goods</h3>
                                            <p>
                                                Items received damaged or faulty may be exchanged or refunded if
                                                reported within 15 days. Contact customer support via email or phone
                                                for assistance.
                                            </p>
                                            <p className="mt-2">
                                                📧 support@essenza.ng <br />
                                                ☎ +234 906 285 8516
                                            </p>
                                        </section>

                                        <section>
                                            <h3 className="font-semibold text-base mb-2">
                                                How to Return Your Order
                                            </h3>
                                            <ul className="list-disc pl-5 space-y-2">
                                                <li>
                                                    Contact us via email or phone before returning any item.
                                                </li>
                                                <li>
                                                    In-store purchases must be returned to the original store of purchase.
                                                </li>
                                                <li>
                                                    Online orders may be returned to:
                                                    <ul className="list-disc pl-5 mt-1 space-y-1">
                                                        <li>Palms Mall, 1 Bisway Street, Lekki, Lagos</li>
                                                        <li>Ikeja Mall, 194 Obafemi Awolowo Way, Ikeja, Lagos</li>
                                                    </ul>
                                                </li>
                                                <li>
                                                    Refunds are processed within <strong>3–7 business days</strong> after
                                                    Quality Control approval.
                                                </li>
                                            </ul>
                                        </section>
                                    </div>

                                    <AlertDialogFooter className="mt-6">
                                        <AlertDialogCancel className="rounded-none">
                                            Close
                                        </AlertDialogCancel>
                                    </AlertDialogFooter>
                                </AlertDialogContent>

                            </AlertDialog>
                        </div>
                    </div>

                </div>


                {/* Right Column - Product Details */}
                <div className="space-y-6 border border-grey-900 shadow-lg p-6 h-fit sticky top-8">
                    {/* Title & Brand */}
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                            {product.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="font-medium">{product.brand}</span>
                            <span className="text-gray-500">SKU: {product.sku}</span>
                        </div>
                    </div>

                    {/* Social Share Icons */}
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="rounded-full bg-gray-200 hover:bg-gray-300">
                            <Facebook className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full bg-gray-200 hover:bg-gray-300">
                            <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full bg-gray-200 hover:bg-gray-300">
                            <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full bg-gray-200 hover:bg-gray-300">
                            <Mail className="h-4 w-4" />
                        </Button>
                    </div>

                    <hr />

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-2">
                        <div className="flex text-red-600">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                    key={star}
                                    className="w-5 h-5 fill-current"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-sm text-gray-600">({viewproducts.reviews} Reviews)</span>
                    </div>

                    {/* Price */}
                    <div className="flex gap-2">
                        <span>Price:</span>
                        <div>
                            <div className="text-lg  text-gray-900">
                                NGN {product.basePrice}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                <a href="#" className="underline font-semibold">Shipping calculated</a> at checkout
                            </p>
                        </div>
                    </div>

                    {/* Stock Status */}
                    <div className='flex items-center gap-4'>
                        <span>Brand: </span>

                        <div className="flex items-center gap-2 text-black">
                            <span className="font-medium">{product.brand}</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-4'>
                        <span>Available in stock: </span>

                        <div className="flex items-center gap-2 text-green-600">
                            <span className="font-medium">{product.stock}</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-4'>
                        <span>Minimum order: </span>

                        <div className="flex items-center gap-2 text-green-600">
                            <span className="font-medium">{product.moq}</span>
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className='flex items-center gap-4'>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Quantity:
                        </label>
                        <div className="inline-flex items-center border ">
                            <Button
                                variant='none'
                                onClick={decreaseQuantity}
                                className="px-4 rounded-none py-2 border-r bg-white text-black"
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-6 py-2 min-w-[60px] text-center font-medium">
                                {quantity}
                            </span>
                            <Button
                                variant='none'
                                onClick={increaseQuantity}
                                className="px-4 rounded-none py-2 border-l bg-white text-black"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Pickup Information */}
                    <div className="p-4 space-y-2">
                        <div className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                            <div>
                                <p className="font-medium text-gray-900">
                                    Pickup available at ESSENZA JABI MALL
                                </p>
                                <p className="text-sm text-gray-600">Usually ready in 2-4 days</p>
                            </div>
                        </div>
                        <Button
                            variant='none'
                            className="text-sm font-medium  hover:underline">
                            Check availability at other stores
                        </Button>
                    </div>


                    <div className="space-y-3 flex flex-col">
                        <Button
                            disabled={adding}
                            className="w-full rounded-none mt-4"
                            onClick={async () => {
                                try {
                                    setAdding(true);

                                    // 🔍 DEBUG: FULL PRODUCT OBJECT
                                    console.log('🟡 Product fetched from Firestore:', product);

                                    // 🔍 DEBUG: CART PAYLOAD
                                    const cartPayload = {
                                        productId: product.id,
                                        name: product.name,
                                        price: product.basePrice,
                                        image: product.images?.[0],
                                        quantity,
                                    };

                                    console.log('🟢 Payload being sent to addToCart:', cartPayload);

                                    await addToCart(cartPayload);

                                    setAdded(true);
                                    setTimeout(() => setAdded(false), 2000);
                                } catch (err) {
                                    console.error('🔴 Add to cart error:', err);
                                } finally {
                                    setAdding(false);
                                }
                            }}
                        >
                            {adding ? 'Adding...' : added ? 'Added ✓' : 'Add to Cart'}
                        </Button>

                        <Button className="bg-[#B53333] w-fit rounded-none px-14 text-lg font-normal py-2">
                            Buy it now
                        </Button>
                    </div>
                </div>
            </div>



            <Recommended />
        </div>
    );
}