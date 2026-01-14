

'use client'


import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Check } from 'lucide-react';


interface ProductImage {
    id: string;
    url: string;
    file: File;
    name: string;
}

interface ImageMappingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    variantId: string | null;
    variantValue: string;
    images: ProductImage[];
    onAssignImage: (variantId: string, imageId: string) => void;
}

export  function ImageMappingDialog({
    open,
    onOpenChange,
    variantId,
    variantValue,
    images,
    onAssignImage
}: ImageMappingDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Select Image for {variantValue}</DialogTitle>
                    <DialogDescription>
                        Choose an image to associate with this variant
                    </DialogDescription>
                </DialogHeader>

                {images.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">
                            No images uploaded yet. Please upload product images first.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {images.map((img) => (
                            <Button
                                type="button"
                                key={img.id}
                                onClick={() => variantId && onAssignImage(variantId, img.id)}
                                variant="ghost"
                                className="relative aspect-square p-0 h-auto overflow-hidden"
                            >
                                <div className="relative w-full h-full">
                                    <Image
                                        src={img.url}
                                        alt="Product"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-primary bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                                    <Check className="w-8 h-8 text-primary opacity-0 hover:opacity-100 transition-opacity" />
                                </div>
                            </Button>
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}