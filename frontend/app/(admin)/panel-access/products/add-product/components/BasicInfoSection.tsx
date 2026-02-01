'use client'

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DollarSign, Package, Tag } from 'lucide-react';
interface ProductImage {
    id: string;
    url: string;
    file: File;
    name: string;
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
interface Category {
    id: string;
    name: string;
    slug: string;
}
interface BasicInfoSectionProps {
    product: ProductData;
    onInputChange: (name: keyof ProductData, value: string) => void;
    categories: Category[];
    categoriesLoading: boolean;
}

export function BasicInfoSection({ product, onInputChange, categories, categoriesLoading }: BasicInfoSectionProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                    id="name"
                    value={product.name}
                    onChange={(e) => onInputChange('name', e.target.value)}
                    placeholder="e.g., Midnight Rose Eau de Parfum"
                    required
                />
            </div>

            <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={product.description}
                    onChange={(e) => onInputChange('description', e.target.value)}
                    placeholder="Describe your fragrance..."
                    rows={4}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                    value={product.category}
                    onValueChange={(value) => onInputChange('category', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categoriesLoading && (
                            <SelectItem value="loading" disabled>
                                Loading categories...
                            </SelectItem>
                        )}

                        {!categoriesLoading && categories.length === 0 && (
                            <SelectItem value="none" disabled>
                                No categories found
                            </SelectItem>
                        )}

                        {categories.map(category => (
                            <SelectItem key={category.id} value={category.slug}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                    id="brand"
                    value={product.brand}
                    onChange={(e) => onInputChange('brand', e.target.value)}
                    placeholder="e.g., Chanel"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price *</Label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="basePrice"
                        type="number"
                        value={product.basePrice}
                        onChange={(e) => onInputChange('basePrice', e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        required
                        className="pl-9"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <div className="relative">
                    <Package className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="stock"
                        type="number"
                        value={product.stock}
                        onChange={(e) => onInputChange('stock', e.target.value)}
                        placeholder="0"
                        required
                        className="pl-9"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="moq">MOQ (Minimum Order Quantity) *</Label>
                <Input
                    id="moq"
                    type="number"
                    value={product.moq}
                    onChange={(e) => onInputChange('moq', e.target.value)}
                    placeholder="1"
                    min="1"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <div className="relative">
                    <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="sku"
                        value={product.sku}
                        onChange={(e) => onInputChange('sku', e.target.value)}
                        placeholder="e.g., FR-MR-001"
                        className="pl-9"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                    value={product.status}
                    onValueChange={(value: 'draft' | 'active' | 'archived') => onInputChange('status', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
