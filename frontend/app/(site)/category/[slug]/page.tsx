'use client';

import { useEffect, useState } from 'react';
import ProductSection from '@/components/shared/ProductGrid';
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { Product } from '@/components/shared/ProductGrid';
import { useParams } from 'next/navigation';

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        console.log("SLUG FROM URL:", slug);

        const q = query(
          collection(db, 'products'),
          where('category', '==', slug),
          where('status', '==', 'active')
        );

        const snapshot = await getDocs(q);

        console.log(
          "RAW FIRESTORE DATA:",
          snapshot.docs.map(d => d.data())
        );

        const items: Product[] = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            title: data.name,
            price: data.basePrice,
            img: data.images || [],
            brand: data.brand,
          };
        });

        setProducts(items);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryProducts();
    }
  }, [slug]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="p-4">
        <p>Slug: {slug}</p>
        <p>Products Found: {products.length}</p>
      </div>

      {!loading && (
        <ProductSection
          title={slug?.replace(/-/g, ' ')}
          items={products}
        />
      )}
    </div>
  );
}
