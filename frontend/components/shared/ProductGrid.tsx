/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import { Button } from '@/components/ui/button';

type Product = {
  img: any[];
  title: string;
  price: number;
};

interface Props {
  title: string;
  items: Product[];
}

export default function ProductSection({ title, items }: Props) {
  return (
    <div className="my-10 px-6  flex flex-col justify-center">
      <h1 className="text-xl font-semibold">{title}</h1>

      <div className="flex gap-4 overflow-x-auto px-2 py-4 ">
        {items.map((product, index) => (
          <div
            key={index}
            className="border-2 rounded-none flex flex-col justify-between w-[233px] h-[445px] p-4 shrink-0"
          >
            <div>
              <div className="flex justify-center">
                <Image
                  src={product.img[0]}
                  alt={product.title}
                  width={300}
                  height={300}
                  className="object-contain"
                />
              </div>

              <div className="mt-4">
                <p className="text-lg">{product.title}</p>
                <p className="text-2xl font-semibold">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </div>

            <Button className="w-full rounded-none">Add to Cart</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
