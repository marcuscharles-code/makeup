'use client'

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Plus, X, Trash2 } from 'lucide-react';

// Types
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
// Component: VariantItem
interface VariantItemProps {
    variant: ProductVariant;
    images: ProductImage[];
    onUpdate: (id: string, field: keyof ProductVariant, value: string) => void;
    onRemove: (id: string) => void;
    onSelectForImage: (id: string) => void;
}

interface VariantTemplate {
    type: string;
    options: string[];
}

const variantTypes = ['Size', 'Color', 'Concentration', 'Volume', 'Edition'];





// Component: VariantBuilder
interface VariantBuilderProps {
    template: VariantTemplate;
    currentOption: string;
    onTypeChange: (type: string) => void;
    onOptionChange: (option: string) => void;
    onAddOption: () => void;
    onRemoveOption: (index: number) => void;
    onGenerateVariants: () => void;
}

export function VariantBuilder({
    template,
    currentOption,
    onTypeChange,
    onOptionChange,
    onAddOption,
    onRemoveOption,
    onGenerateVariants
}: VariantBuilderProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="variant-type">Variant Type</Label>
                    <Select value={template.type} onValueChange={onTypeChange}>
                        <SelectTrigger id="variant-type">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            {variantTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="variant-options">Add Options</Label>
                    <div className="flex gap-2">
                        <Input
                            id="variant-options"
                            value={currentOption}
                            onChange={(e) => onOptionChange(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), onAddOption())}
                            placeholder="e.g., Red, Blue, 50ml, 100ml"
                            disabled={!template.type}
                        />
                        <Button
                            type="button"
                            onClick={onAddOption}
                            disabled={!template.type || !currentOption.trim()}
                        >
                            <Plus className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {template.options.length > 0 && (
                <div>
                    <Label>Options for {template.type}</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {template.options.map((option, index) => (
                            <Badge key={index} variant="secondary" className="gap-2">
                                {option}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 p-0 hover:bg-transparent"
                                    onClick={() => onRemoveOption(index)}
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                            </Badge>
                        ))}
                    </div>
                    <Button type="button" onClick={onGenerateVariants} className="mt-3">
                        Generate Variants
                    </Button>
                </div>
            )}
        </div>
    );
}



export function VariantItem({ variant, images, onUpdate, onRemove, onSelectForImage }: VariantItemProps) {
    const variantImage = variant.imageId ? images.find(img => img.id === variant.imageId) : null;

    return (
        <Card>
            <CardContent className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs">{variant.type}</Label>
                        <Input
                            value={variant.value}
                            onChange={(e) => onUpdate(variant.id, 'value', e.target.value)}
                            className="text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs">Price</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">$</span>
                            <Input
                                type="number"
                                value={variant.price}
                                onChange={(e) => onUpdate(variant.id, 'price', e.target.value)}
                                className="pl-7 text-sm"
                                step="0.01"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs">Stock</Label>
                        <Input
                            type="number"
                            value={variant.stock}
                            onChange={(e) => onUpdate(variant.id, 'stock', e.target.value)}
                            className="text-sm"
                            placeholder="0"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs">SKU</Label>
                        <Input
                            value={variant.sku}
                            onChange={(e) => onUpdate(variant.id, 'sku', e.target.value)}
                            className="text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs">Image</Label>
                        {variantImage ? (
                            <div className="relative w-full h-10 border rounded-lg overflow-hidden group">
                                <Image
                                    src={variantImage.url}
                                    alt={variant.value}
                                    fill
                                    className="object-cover"
                                    sizes="100px"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => onUpdate(variant.id, 'imageId', '')}
                                    className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onSelectForImage(variant.id)}
                                disabled={images.length === 0}
                                className="w-full text-sm"
                            >
                                Map Image
                            </Button>
                        )}
                    </div>
                    <div className="flex items-end">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => onRemove(variant.id)}
                            className="w-full text-sm"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}