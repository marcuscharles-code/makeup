/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/firebase/firebaseConfig';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { ArrowBigLeft, ArrowLeft, Delete, Edit } from 'lucide-react';

export default function Page() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [activeImage, setActiveImage] = useState(0);


    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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


    const handleDelete = async () => {
        if (!product || isDeleting) return;
        setIsDeleting(true);
        try {
            await deleteDoc(doc(db, 'products', product.id));
            router.push('/admin/products');
        } catch (err) {
            console.error('Error deleting product:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return <div className="p-10 text-center">Loading product...</div>;
    }

    if (!product) {
        return <div className="p-10 text-center">Product not found</div>;
    }

    const isActive = product.status === 'active';

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">

            <div className="mb-4">
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-muted-foreground"
                    onClick={() => router.push('/panel-access/products')}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Products</span>
                </Button>
            </div>


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
                </div>


                <div className="space-y-6 border border-grey-900 shadow-lg p-6 h-fit sticky top-8">


                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                            {product.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="font-medium">{product.brand}</span>
                            <span className="text-gray-500">SKU: {product.sku}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <span>Price:</span>
                        <div className="text-lg  text-gray-900">
                            NGN {product.basePrice}
                        </div>
                    </div>


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


                    <div>
                        <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${isActive
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : 'bg-amber-50 border-amber-200 text-amber-700'
                                }`}
                        >
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-amber-500'
                                    }`}
                            />
                            {isActive ? 'Active' : 'Draft'}
                        </span>

                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => router.push(`/panel-access/products/edit-products/${product.id}`)}
                        >
                            <Edit className="w-4 h-4" />
                            Edit Product
                        </Button>

                        <Button
                            onClick={() => setShowDeleteModal(true)}
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Delete className="w-4 h-4" />
                            Delete
                        </Button>
                    </div>

                </div>


            </div>



            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => !isDeleting && setShowDeleteModal(false)} />


                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 flex flex-col items-center text-center">


                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#dc2626"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                        </div>

                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                            Delete this product?
                        </h3>
                        <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                            <span className="font-medium text-gray-700">{product.name}</span> will be permanently removed. This action cannot be undone.
                        </p>

                        {/* action buttons */}
                        <div className="flex w-full justify-around">
                            <Button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                                variant="outline"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="text-white bg-red-600 rounded-lg hover:bg-red-700 active:bg-red-800"
                            >
                                {isDeleting ? 'Deleting…' : 'Delete Product'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}