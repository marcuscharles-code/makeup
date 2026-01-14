'use client'

import React, { ChangeEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { X, Upload, } from 'lucide-react';

// Types
interface ProductImage {
    id: string;
    url: string;
    file: File;
    name: string;
}

interface ProductImageUploadProps {
    images: ProductImage[];
    onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
    onRemove: (id: string) => void;
}

export default function ProductImageUpload({ images, onUpload, onRemove }: ProductImageUploadProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
            {images.map((img, index) => (
                <div key={img.id} className="relative group aspect-square">
                    <div className="relative w-full h-full rounded-lg border overflow-hidden">
                        <Image
                            src={img.url}
                            alt="Product"
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        />
                    </div>
                    {index === 0 && (
                        <Badge className="absolute top-2 left-2">
                            Main
                        </Badge>
                    )}
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => onRemove(img.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            ))}

            <Label
                htmlFor="image-upload"
                className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
            >
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Upload</span>
                <Input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={onUpload}
                    className="hidden"
                />
            </Label>
        </div>
    );
}
