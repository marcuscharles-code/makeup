/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/firebase/firebaseConfig';
import Link from 'next/link';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import logo from "@/public/images/Fragrancebynayalogo2.png";

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function EssenzaNavbar() {
    const router = useRouter();

    const [cartCount, setCartCount] = useState(0);
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    // Auth listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    // Fetch first 5 categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const q = query(
                    collection(db, 'categories'),
                    orderBy('createdAt', 'desc'),
                    limit(5)
                );

                const snap = await getDocs(q);

                const cats = snap.docs.map(doc => ({
                    id: doc.id,
                    ...(doc.data() as any)
                }));

                setCategories(cats);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <nav className="w-full bg-white border-b">

            {/* ===== DESKTOP HEADER ===== */}
            <div className="hidden md:flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">

                {/* Logo */}
                <div
                    onClick={() => router.push('/')}
                    className="flex items-center cursor-pointer w-32 h-32 relative"
                >
                    <Image
                        src={logo}
                        alt="logo"
                        className="h-full w-full object-contain"
                    />
                </div>

                {/* Search */}
                <div className="flex-1 max-w-2xl mx-8 flex gap-2">
                    <Input placeholder="Search products..." />
                    <Button className="bg-red-700 hover:bg-red-800">
                        <Search className="h-5 w-5" />
                    </Button>
                </div>

                {/* Cart */}
                <Button
                    onClick={() => router.push('/cart')}
                    variant="ghost"
                    size="icon"
                    className="relative"
                >
                    <ShoppingCart className="h-5 w-5" />

                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </Button>

                {/* Auth */}
                <div>
                    {!user ? (
                        <div className="flex gap-4">
                            <Link href="/auth/login">Login</Link>
                            <Link href="/auth/create-account">Sign Up</Link>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <Link href="/my-account">My account</Link>

                            <button
                                onClick={() => signOut(auth)}
                                className="text-red-600"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ===== SIMPLE CATEGORY NAV ===== */}
            <div className="hidden md:block border-t bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 flex gap-6 py-3">

                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => router.push(`/category/${cat.slug}`)}
                            className="text-sm font-medium hover:text-red-700 transition"
                        >
                            {cat.name}
                        </button>
                    ))}

                </div>
            </div>

        </nav>
    );
}
