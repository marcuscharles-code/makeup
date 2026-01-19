/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { addToCart } from '@/lib/addToCart';

export type Product = {
  id: string;
  img?: string[];
  title: string;
  price?: number;
  brand?: string;
  name?: string;
  basePrice?: number;
  images?: string[];
};

interface Props {
  title: string;
  items: Product[];
}

export default function ProductSection({ title, items }: Props) {
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  return (
    <div className="my-10 px-6 flex flex-col justify-center">
      <h1 className="text-xl font-semibold">{title}</h1>

      <div className="flex gap-4 overflow-x-auto px-2 py-4">
        {items.map((product) => {
          const isAdding = addingId === product.id;
          const isAdded = addedId === product.id;

          return (
            <div
              key={product.id}
              className="border-2 w-[233px] h-[370px] p-4 shrink-0 flex flex-col"
            >
              {/* Card clickable part */}
              <Link href={`/view-product/${product.id}`} className="flex-1 flex flex-col">
                <div className="flex w-full justify-center h-[180px]">
                  <Image
                    src={product.img?.[0] || '/placeholder.png'}
                    alt={product.title}
                    width={180}
                    height={180}
                    className="object-contain h-full w-full"
                  />
                </div>

                <div className="mt-3 space-y-1">
                  <p className="text-sm md:text-lg font-medium leading-tight line-clamp-2">
                    {product.title}
                  </p>

                  {product.brand && (
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {product.brand}
                    </p>
                  )}

                  <p className="text-lg md:text-2xl font-semibold mt-1">
                    ${product.price?.toFixed(2)}
                  </p>
                </div>
              </Link>

              <Button
                disabled={isAdding}
                className="w-full rounded-none mt-4"
                onClick={async () => {
                  try {
                    setAddingId(product.id);
                    const cartPayload = {
                      productId: product.id,
                      name: product.title ?? product.name ?? 'Unknown Product',
                      price: product.price ?? product.basePrice ?? 0,
                      image: product.img?.[0] || product.images?.[0] || '/placeholder.png',
                      quantity: 1,
                    };

                    await addToCart(cartPayload);

                    setAddedId(product.id);
                    setTimeout(() => setAddedId(null), 2000);
                  } catch (err) {
                    console.error('🔴 Error adding to cart:', err);
                  } finally {
                    setAddingId(null);
                  }
                }}
              >
                {isAdding ? 'Adding...' : isAdded ? 'Added ✓' : 'Add to Cart'}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
