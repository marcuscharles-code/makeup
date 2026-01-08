import ProductSection from '@/components/shared/ProductGrid';
import {
    products
} from '@/data/product';

export default function Recommended() {
    return (
        <div className="mx-auto max-w-7xl">
            <ProductSection title="We also recommend" items={products} />
        </div>
    );
}
