import ProductSection from '@/components/shared/ProductGrid';
import {
  products,
  giftsProducts,
  justin,
} from '@/data/product';

export default function MostPopularMarketplace() {
  return (
    <div className="mx-auto max-w-7xl">
      <ProductSection title="Most Popular" items={products} />
      <ProductSection title="Gifts" items={giftsProducts} />
      <ProductSection title="Just In" items={justin} />
    </div>
  );
}
