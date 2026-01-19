'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import ProductImageUpload from './components/ProductImageUpload'
import { VariantBuilder, VariantItem } from './components/VariantBuilder'
import { ImageMappingDialog } from './components/ImageMappingDialog'
import { BasicInfoSection } from './components/BasicInfoSection'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { collection, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { Separator } from '@/components/ui/separator';
import { BarChart } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Types
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
        if (variantTemplate.options.length === 0) return;

        const newVariants = variantTemplate.options.map(option => ({
            id: Date.now() + Math.random().toString(),
            type: variantTemplate.type,
            value: option,
            price: product.basePrice || '',
            stock: product.stock || '',
            sku: `${product.sku || 'SKU'}-${option.replace(/\s+/g, '-').toUpperCase()}`,
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
        if (selectedVariantForImage === id) {
            setSelectedVariantForImage(null);
        }
    };

    const assignImageToVariant = (variantId: string, imageId: string) => {
        updateVariant(variantId, 'imageId', imageId);
        setSelectedVariantForImage(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!product.name.trim() || !product.basePrice || !product.sku.trim()) {
                alert('Please fill in all required fields: Name, Base Price, and SKU');
                setIsSubmitting(false);
                return;
            }

            if (product.images.length === 0) {
                alert('Please upload at least one product image');
                setIsSubmitting(false);
                return;
            }

            console.log('Starting product creation process...');


            const productRef = doc(collection(db, 'products'));
            const productId = productRef.id;


            async function uploadToCloudinary(file: File) {
                const CLOUD_NAME = "dvoyvhkjp";
                const UPLOAD_PRESET = "brandsquare_blogs";

                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", UPLOAD_PRESET);
                formData.append("folder", "perfume-products");

                const res = await fetch(
                    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                    { method: "POST", body: formData }
                );

                if (!res.ok) {
                    throw new Error("Cloudinary upload failed");
                }

                const data = await res.json();
                return { url: data.secure_url, publicId: data.public_id };
            }

            // 4️⃣ Upload all images
            const uploadedImages = await Promise.all(
                product.images.map(async (img) => ({
                    ...img,
                    cloudinaryData: await uploadToCloudinary(img.file),
                }))
            );

            const imageUrls = uploadedImages.map(img =>
                img.cloudinaryData?.url || img.url
            );


            const imageMap: Record<string, string> = {};
            uploadedImages.forEach(img => {
                if (img.cloudinaryData) imageMap[img.id] = img.cloudinaryData.url;
            });


            await setDoc(productRef, {
                id: productId,
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
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });


            if (product.variants.length > 0) {
                const variantsRef = collection(db, 'products', productId, 'variants');
                await Promise.all(
                    product.variants.map(variant =>
                        addDoc(variantsRef, {
                            productId,
                            type: variant.type,
                            value: variant.value,
                            price: Number(variant.price) || Number(product.basePrice),
                            stock: Number(variant.stock) || Number(product.stock),
                            sku: variant.sku,
                            image: variant.imageId ? imageMap[variant.imageId] : '',
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp(),
                        })
                    )
                );
            }

            alert('Product saved successfully! 🎉\nProduct ID: ' + productId);


            setProduct({
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
            setVariantTemplate({ type: '', options: [] });

            // Cleanup object URLs
            product.images.forEach(img => URL.revokeObjectURL(img.url));

        } catch (error) {
            console.error('Error saving product:', error);
            alert(`Failed to save product: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };


    const selectedVariant = selectedVariantForImage
        ? product.variants.find(v => v.id === selectedVariantForImage)
        : null;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
                <p className="mt-2 text-muted-foreground">Create a new fragrance product with variants</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>Enter the basic details of your product</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BasicInfoSection
                            product={product}
                            onInputChange={handleInputChange}
                        />
                    </CardContent>
                </Card>

                {/* Product Images */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Images</CardTitle>
                        <CardDescription>Upload product images. First image will be the main product image.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProductImageUpload
                            images={product.images}
                            onUpload={handleImageUpload}
                            onRemove={removeImage}
                        />
                    </CardContent>
                </Card>

                {/* Product Variants */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Variants</CardTitle>
                        <CardDescription>Create variants for different sizes, colors, or concentrations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <VariantBuilder
                                template={variantTemplate}
                                currentOption={currentOption}
                                onTypeChange={(type) => setVariantTemplate(prev => ({ ...prev, type }))}
                                onOptionChange={setCurrentOption}
                                onAddOption={addVariantOption}
                                onRemoveOption={removeVariantOption}
                                onGenerateVariants={generateVariants}
                            />

                            <Separator />

                            {/* Variant List */}
                            {product.variants.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <BarChart className="w-5 h-5" />
                                        Active Variants ({product.variants.length})
                                    </h3>
                                    <div className="space-y-4">
                                        {product.variants.map((variant) => (
                                            <VariantItem
                                                key={variant.id}
                                                variant={variant}
                                                images={product.images}
                                                onUpdate={updateVariant}
                                                onRemove={removeVariant}
                                                onSelectForImage={setSelectedVariantForImage}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Image Mapping Dialog */}
                {selectedVariant && (
                    <ImageMappingDialog
                        open={!!selectedVariantForImage}
                        onOpenChange={(open) => !open && setSelectedVariantForImage(null)}
                        variantId={selectedVariantForImage}
                        variantValue={selectedVariant.value}
                        images={product.images}
                        onAssignImage={assignImageToVariant}
                    />
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
                                router.push('/panel-access/products/add-product');
                            }
                        }}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="animate-spin mr-2">⟳</span>
                                Saving...
                            </>
                        ) : (
                            'Add Product'
                        )}
                    </Button>
                </div>
            </form>
        </section>
    );
}