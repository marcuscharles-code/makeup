'use client';

import { useEffect, useState } from 'react';
import ProductSection from '@/components/shared/ProductGrid';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { Product } from '@/components/shared/ProductGrid'



export default function MostPopularMarketplace() {
  const [justIn, setJustIn] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJustIn = async () => {
      try {
        const oneMonthAgo = Timestamp.fromDate(
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        );

        const q = query(
          collection(db, 'products'),
          where('status', '==', 'active'),
          where('createdAt', '>=', oneMonthAgo),
          orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);

        const justInProducts: Product[] = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,               
            title: data.name,
            price: data.basePrice,
            img: data.images || [],
            brand: data.brand,
          };
        });

        setJustIn(justInProducts);
      } catch (error) {
        console.error('Error fetching Just In products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJustIn();
  }, []);

  return (
    <div className="mx-auto max-w-7xl">
      {/* <ProductSection title="Most Popular" items={products} /> */}
      {/* <ProductSection title="Gifts" items={giftsProducts} /> */}

      {!loading && justIn.length > 0 && (
        <ProductSection title="Just In" items={justIn} />
      )}
    </div>
  );
}
