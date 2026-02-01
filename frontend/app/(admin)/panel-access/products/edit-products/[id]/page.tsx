/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { getDocs, query, where, doc, getDoc, updateDoc, collection, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import ProductImageUpload from '../../add-product/components/ProductImageUpload'
import { VariantBuilder, VariantItem } from '../../add-product/components/VariantBuilder'
import { ImageMappingDialog } from '../../add-product/components/ImageMappingDialog'
import { BasicInfoSection } from '../../add-product/components/BasicInfoSection'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/firebase/firebaseConfig';
import { Separator } from '@/components/ui/separator';
import { useRouter, useParams } from 'next/navigation';

interface ProductImage {
    id: string;
    url: string;
    file: File;
    name: string;
    cloudinaryData?: {
        url: string;
        publicId: string;
    };
}

interface Category {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
}

interface ProductVariant {
    id: string;
    type: string;
    value: string;
    price: string;
    stock: string;
    sku: string;
    imageId: string | null;
}

interface VariantTemplate {
    type: string;
    options: string[];
}

interface ProductData {
    name: string;
    description: string;
    category: string;
    brand: string;
    basePrice: string;
    stock: string;
    moq: string;
    sku: string;
    status: 'draft' | 'active' | 'archived';
    images: ProductImage[];
    variants: ProductVariant[];
}

export default function Page() {
    const router = useRouter();
    const { id } = useParams();

    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [loading, setLoading] = useState(true);

    const [product, setProduct] = useState<ProductData>({
        name: '',
        description: '',
        category: '',
        brand: '',
        basePrice: '',
        stock: '',
        moq: '1',
        sku: '',
        status: 'draft',
        images: [],
        variants: []
    });

    const [variantTemplate, setVariantTemplate] = useState<VariantTemplate>({
        type: '',
        options: []
    });

    const [currentOption, setCurrentOption] = useState<string>('');
    const [selectedVariantForImage, setSelectedVariantForImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ───────── LOAD CATEGORIES ─────────
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const q = query(collection(db, 'categories'), where('isActive', '==', true));
                const snapshot = await getDocs(q);

                setCategories(snapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    slug: doc.data().slug,
                    isActive: doc.data().isActive,
                })));
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // ───────── LOAD PRODUCT FOR EDIT ─────────
    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const snap = await getDoc(doc(db, 'products', id as string));

                if (!snap.exists()) return;

                const data = snap.data();

                // load variants subcollection
                const vSnap = await getDocs(collection(db, 'products', id as string, 'variants'));

                const variants: ProductVariant[] = vSnap.docs.map(v => ({
                    id: v.id,
                    type: v.data().type,
                    value: v.data().value,
                    price: String(v.data().price),
                    stock: String(v.data().stock),
                    sku: v.data().sku,
                    imageId: null
                }));

                setProduct({
                    name: data.name,
                    description: data.description,
                    category: data.category,
                    brand: data.brand,
                    basePrice: String(data.basePrice),
                    stock: String(data.stock),
                    moq: String(data.moq),
                    sku: data.sku,
                    status: data.status,
                    images: data.images.map((url: string) => ({
                        id: Math.random().toString(),
                        url,
                        file: null as any,
                        name: url
                    })),
                    variants
                });

            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleInputChange = (name: keyof ProductData, value: string) => {
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            id: Date.now() + Math.random().toString(),
            url: URL.createObjectURL(file),
            file: file,
            name: file.name
        }));

        setProduct(prev => ({
            ...prev,
            images: [...prev.images, ...newImages]
        }));
    };

    const removeImage = (id: string) => {
        setProduct(prev => ({
            ...prev,
            images: prev.images.filter(img => img.id !== id),
            variants: prev.variants.map(v =>
                v.imageId === id ? { ...v, imageId: null } : v
            )
        }));
    };

    const addVariantOption = () => {
        if (currentOption.trim() && variantTemplate.type) {
            setVariantTemplate(prev => ({
                ...prev,
                options: [...prev.options, currentOption.trim()]
            }));
            setCurrentOption('');
        }
    };

    const removeVariantOption = (index: number) => {
        setVariantTemplate(prev => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index)
        }));
    };

    const generateVariants = () => {
        const newVariants = variantTemplate.options.map(option => ({
            id: Date.now() + Math.random().toString(),
            type: variantTemplate.type,
            value: option,
            price: product.basePrice || '',
            stock: product.stock || '',
            sku: `${product.sku}-${option}`,
            imageId: null
        }));

        setProduct(prev => ({
            ...prev,
            variants: [...prev.variants, ...newVariants]
        }));

        setVariantTemplate({ type: '', options: [] });
    };

    const updateVariant = (id: string, field: keyof ProductVariant, value: string) => {
        setProduct(prev => ({
            ...prev,
            variants: prev.variants.map(v =>
                v.id === id ? { ...v, [field]: value } : v
            )
        }));
    };

    const removeVariant = (id: string) => {
        setProduct(prev => ({
            ...prev,
            variants: prev.variants.filter(v => v.id !== id)
        }));
    };

    const assignImageToVariant = (variantId: string, imageId: string) => {
        updateVariant(variantId, 'imageId', imageId);
        setSelectedVariantForImage(null);
    };

    // ───────── UPDATE LOGIC ─────────
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const ref = doc(db, 'products', id as string);

            const imageUrls = product.images.map(i => i.url);

            await updateDoc(ref, {
                name: product.name,
                description: product.description,
                category: product.category,
                brand: product.brand,
                basePrice: Number(product.basePrice),
                moq: Number(product.moq),
                sku: product.sku,
                status: product.status,
                stock: product.stock,
                images: imageUrls,
                mainImage: imageUrls[0],
                hasVariants: product.variants.length > 0,
                variantCount: product.variants.length,
                updatedAt: serverTimestamp(),
            });

            // Replace variants (simple strategy)
            const vRef = collection(db, 'products', id as string, 'variants');

            const old = await getDocs(vRef);
            await Promise.all(old.docs.map(d => deleteDoc(d.ref)));

            await Promise.all(
                product.variants.map(v =>
                    addDoc(vRef, {
                        type: v.type,
                        value: v.value,
                        price: Number(v.price),
                        stock: Number(v.stock),
                        sku: v.sku,
                        image: '',
                        updatedAt: serverTimestamp(),
                    })
                )
            );

            alert('Product updated successfully!');
            router.push('/panel-access/products');

        } catch (err) {
            alert('Update failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    const selectedVariant = selectedVariantForImage
        ? product.variants.find(v => v.id === selectedVariantForImage)
        : null;

    return (
        <section className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BasicInfoSection
                            product={product}
                            onInputChange={handleInputChange}
                            categories={categories}
                            categoriesLoading={categoriesLoading}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Images</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProductImageUpload
                            images={product.images}
                            onUpload={handleImageUpload}
                            onRemove={removeImage}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Variants</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <VariantBuilder
                            template={variantTemplate}
                            currentOption={currentOption}
                            onTypeChange={(type) => setVariantTemplate(prev => ({ ...prev, type }))}
                            onOptionChange={setCurrentOption}
                            onAddOption={addVariantOption}
                            onRemoveOption={removeVariantOption}
                            onGenerateVariants={generateVariants}
                        />

                        <Separator className="my-4" />

                        {product.variants.map(v => (
                            <VariantItem
                                key={v.id}
                                variant={v}
                                images={product.images}
                                onUpdate={updateVariant}
                                onRemove={removeVariant}
                                onSelectForImage={setSelectedVariantForImage}
                            />
                        ))}
                    </CardContent>
                </Card>

                {selectedVariant && (
                    <ImageMappingDialog
                        open={!!selectedVariantForImage}
                        onOpenChange={() => setSelectedVariantForImage(null)}
                        variantId={selectedVariantForImage}
                        variantValue={selectedVariant.value}
                        images={product.images}
                        onAssignImage={assignImageToVariant}
                    />
                )}

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Updating...' : 'Update Product'}
                    </Button>
                </div>
            </form>
        </section>
    );
}
