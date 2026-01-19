'use client';
import { useState, useEffect } from 'react';
import { Menu, Search, User, ShoppingCart } from 'lucide-react';
import MobileNavDrawer from './MobileNavDrawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useRouter } from 'next/navigation';
import { allBrandNames, skincareCategories, makeupCategories } from '@/data/nav';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import logo from "@/public/images/Fragrancebynayalogo2.png"
import { getAuth } from 'firebase/auth';



export default function EssenzaNavbar() {
    const router = useRouter();
    const [cartCount, setCartCount] = useState(0);
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchCartCount = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                setCartCount(0);
                return;
            }

            try {
                const cartSnap = await getDocs(collection(db, 'users', user.uid, 'cart'));
                const count = cartSnap.docs.length;
                setCartCount(count);
                console.log('🛒 Cart Count:', count);
            } catch (error) {
                console.error('Error fetching cart count:', error);
            }
        };

        fetchCartCount();
    }, [user]);





    return (
        <nav className="w-full bg-white border-b">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between px-4 py-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <Menu className="h-6 w-6" />
                </Button>

                <div
                    onClick={() => { router.push('/') }}
                    className="flex items-center cursor-pointer w-32 h-32 relative">
                    <Image
                        src={logo}
                        alt=''
                        className='h-full w-full object-contain'
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <Search className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                    </Button>
                    <Button
                        onClick={() => { router.push('/cart') }}
                        variant="ghost" size="icon" className="relative">
                        <ShoppingCart className="h-5 w-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                                {cartCount}
                            </span>
                        )}
                    </Button>

                </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                {/* Logo */}
                <div
                    onClick={() => { router.push('/') }}
                    className="flex items-center cursor-pointer w-32 h-32 relative">
                    <Image
                        src={logo}
                        alt=''
                        className='h-full w-full object-contain'
                    />
                </div>


                <div className="flex-1 max-w-2xl mx-8 flex gap-2">
                    <div className="relative flex-1">
                        <Input
                            type="text"
                            placeholder="Search..."
                            className="w-full pr-4"
                        />
                    </div>
                    <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All categories</SelectItem>
                            <SelectItem value="perfume">Perfume</SelectItem>
                            <SelectItem value="skincare">Skincare</SelectItem>
                            <SelectItem value="makeup">Make Up</SelectItem>
                            <SelectItem value="gift">Gift</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button className="bg-red-700 hover:bg-red-800 text-white px-6">
                        <Search className="h-5 w-5" />
                    </Button>
                </div>


                <Button
                    onClick={() => { router.push('/cart') }}
                    variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                            {cartCount}
                        </span>
                    )}
                </Button>


                {/* Right Actions */}
                <div className="text-sm text-right">
                    {!user ? (
                        <>
                            <div className="flex items-center gap-4">
                                <Link href="/auth/login">
                                    <Button
                                        variant="ghost"
                                        className="font-medium text-gray-700 hover:text-primary hover:bg-transparent px-4 py-2"
                                    >
                                        Login
                                    </Button>
                                </Link>
                                <div className="h-4 w-px bg-gray-300" />
                                <Link href="/auth/create-account">
                                    <Button
                                        className="font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-full shadow-sm hover:shadow transition-all"
                                    >
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex gap-3 justify-end">
                                <Link href="/my-account">
                                    <Button variant="ghost" className="p-0 font-medium hover:text-red-700">
                                        My account
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    className="p-0 font-medium text-red-600 hover:text-red-700"
                                    onClick={() => signOut(auth)}
                                >
                                    Logout
                                </Button>
                            </div>
                        </>
                    )}
                </div>

            </div>

            {/* Navigation Menu - Desktop */}
            <div className="hidden md:block border-t bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-2">
                            {/* ALL BRANDS */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="text-sm w-fit font-medium bg-transparent hover:text-red-700">
                                    ALL BRANDS
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[1200px] h-[400px] overflow-y-scroll gap-3 p-4 md:grid-cols-4">
                                        {/* Alphabetical sections */}
                                        <li>
                                            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">A - B</div>
                                            {allBrandNames.A_B.map((brand) => (
                                                <NavigationMenuLink key={brand} asChild>
                                                    <a
                                                        href={`/brands/${brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">{brand}</div>
                                                    </a>
                                                </NavigationMenuLink>
                                            ))}
                                        </li>

                                        <li>
                                            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">C - E</div>
                                            {allBrandNames.C_E.map((brand) => (
                                                <NavigationMenuLink key={brand} asChild>
                                                    <a
                                                        href={`/brands/${brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">{brand}</div>
                                                    </a>
                                                </NavigationMenuLink>
                                            ))}
                                        </li>

                                        <li>
                                            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">E - H</div>
                                            {allBrandNames.E_H.map((brand) => (
                                                <NavigationMenuLink key={brand} asChild>
                                                    <a
                                                        href={`/brands/${brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">{brand}</div>
                                                    </a>
                                                </NavigationMenuLink>
                                            ))}
                                        </li>

                                        <li>
                                            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">I - L</div>
                                            {allBrandNames.I_L.map((brand) => (
                                                <NavigationMenuLink key={brand} asChild>
                                                    <a
                                                        href={`/brands/${brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">{brand}</div>
                                                    </a>
                                                </NavigationMenuLink>
                                            ))}
                                        </li>

                                        <li>
                                            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">L - M</div>
                                            {allBrandNames.L_M.map((brand) => (
                                                <NavigationMenuLink key={brand} asChild>
                                                    <a
                                                        href={`/brands/${brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">{brand}</div>
                                                    </a>
                                                </NavigationMenuLink>
                                            ))}
                                        </li>

                                        <li>
                                            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">M - R</div>
                                            {allBrandNames.M_R.map((brand) => (
                                                <NavigationMenuLink key={brand} asChild>
                                                    <a
                                                        href={`/brands/${brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">{brand}</div>
                                                    </a>
                                                </NavigationMenuLink>
                                            ))}
                                        </li>

                                        <li>
                                            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">R - Z</div>
                                            {allBrandNames.R_Z.map((brand) => (
                                                <NavigationMenuLink key={brand} asChild>
                                                    <a
                                                        href={`/brands/${brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">{brand}</div>
                                                    </a>
                                                </NavigationMenuLink>
                                            ))}
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* PERFUME */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="text-sm font-medium bg-transparent hover:text-red-700">
                                    PERFUME
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                                        {/* Featured perfumes */}
                                        <li className="col-span-2">
                                            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Featured Perfumes</div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {allBrandNames.featured.map((brand) => (
                                                    <NavigationMenuLink key={brand} asChild>
                                                        <a
                                                            href={`/perfumes/brand/${brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                        >
                                                            <div className="text-sm font-medium leading-none">{brand}</div>
                                                        </a>
                                                    </NavigationMenuLink>
                                                ))}
                                            </div>
                                        </li>

                                        {/* Browse by brand (alphabetically) */}
                                        <li>
                                            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Browse by Brand</div>
                                            {['A-B', 'C-E', 'E-H', 'I-L', 'L-M', 'M-R', 'R-Z'].map((range) => (
                                                <NavigationMenuLink key={range} asChild>
                                                    <a
                                                        href={`/perfumes/brands/${range}`}
                                                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">Brands {range}</div>
                                                    </a>
                                                </NavigationMenuLink>
                                            ))}
                                        </li>

                                        {/* All perfume brands link */}
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <a
                                                    href="/perfumes/all-brands"
                                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground border-t pt-3"
                                                >
                                                    <div className="text-sm font-medium leading-none">View All Perfume Brands →</div>
                                                </a>
                                            </NavigationMenuLink>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* SKINCARE */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="text-sm font-medium bg-transparent hover:text-red-700">
                                    SKINCARE
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                                        {/* All Skincare */}
                                        {skincareCategories.all.map((item) => (
                                            <li key={item} className="col-span-2">
                                                <NavigationMenuLink asChild>
                                                    <a
                                                        href="/skincare/all"
                                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">{item}</div>
                                                    </a>
                                                </NavigationMenuLink>
                                            </li>
                                        ))}

                                        {/* Skincare Brands */}
                                        <li>
                                            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Brands</div>
                                            {skincareCategories.brands.map((brand) => (
                                                <NavigationMenuLink key={brand} asChild>
                                                    <a
                                                        href={`/skincare/brand/${brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">{brand}</div>
                                                    </a>
                                                </NavigationMenuLink>
                                            ))}
                                        </li>

                                        {/* Face */}
                                        <li>
                                            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">{skincareCategories.face.title}</div>
                                            {skincareCategories.face.items.map((item) => (
                                                <NavigationMenuLink key={item} asChild>
                                                    <a
                                                        href={`/skincare/face/${item.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">{item}</div>
                                                    </a>
                                                </NavigationMenuLink>
                                            ))}
                                        </li>

                                        {/* Body */}
                                        <li>
                                            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">{skincareCategories.body.title}</div>
                                            {skincareCategories.body.items.map((item) => (
                                                <NavigationMenuLink key={item} asChild>
                                                    <a
                                                        href={`/skincare/body/${item.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">{item}</div>
                                                    </a>
                                                </NavigationMenuLink>
                                            ))}
                                        </li>

                                        {/* Men */}
                                        <li>
                                            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">{skincareCategories.men.title}</div>
                                            {skincareCategories.men.items.map((item) => (
                                                <NavigationMenuLink key={item} asChild>
                                                    <a
                                                        href={`/skincare/men/${item.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">{item}</div>
                                                    </a>
                                                </NavigationMenuLink>
                                            ))}
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* MAKE UP */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="text-sm font-medium bg-transparent hover:text-red-700">
                                    MAKE UP
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                                        {/* All Makeup */}
                                        {makeupCategories.all.map((item) => (
                                            <li key={item} className="col-span-2">
                                                <NavigationMenuLink asChild>
                                                    <a
                                                        href="/makeup/all"
                                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">{item}</div>
                                                    </a>
                                                </NavigationMenuLink>
                                            </li>
                                        ))}

                                        {/* Makeup Brands */}
                                        <li>
                                            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Brands</div>
                                            {makeupCategories.brands.map((brand) => (
                                                <NavigationMenuLink key={brand} asChild>
                                                    <a
                                                        href={`/makeup/brand/${brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">{brand}</div>
                                                    </a>
                                                </NavigationMenuLink>
                                            ))}
                                        </li>

                                        {/* Face */}
                                        <li>
                                            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">{makeupCategories.face.title}</div>
                                            {makeupCategories.face.items.map((item) => (
                                                <NavigationMenuLink key={item} asChild>
                                                    <a
                                                        href={`/makeup/face/${item.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">{item}</div>
                                                    </a>
                                                </NavigationMenuLink>
                                            ))}
                                        </li>

                                        {/* Eyes */}
                                        <li>
                                            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">{makeupCategories.eyes.title}</div>
                                            {makeupCategories.eyes.items.map((item) => (
                                                <NavigationMenuLink key={item} asChild>
                                                    <a
                                                        href={`/makeup/eyes/${item.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">{item}</div>
                                                    </a>
                                                </NavigationMenuLink>
                                            ))}
                                        </li>

                                        {/* Cheeks */}
                                        <li>
                                            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">{makeupCategories.cheeks.title}</div>
                                            {makeupCategories.cheeks.items.map((item) => (
                                                <NavigationMenuLink key={item} asChild>
                                                    <a
                                                        href={`/makeup/cheeks/${item.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">{item}</div>
                                                    </a>
                                                </NavigationMenuLink>
                                            ))}
                                        </li>

                                        {/* Lips */}
                                        <li>
                                            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">{makeupCategories.lips.title}</div>
                                            {makeupCategories.lips.items.map((item) => (
                                                <NavigationMenuLink key={item} asChild>
                                                    <a
                                                        href={`/makeup/lips/${item.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">{item}</div>
                                                    </a>
                                                </NavigationMenuLink>
                                            ))}
                                        </li>

                                        {/* Tools */}
                                        <li>
                                            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">{makeupCategories.tools.title}</div>
                                            {makeupCategories.tools.items.map((item) => (
                                                <NavigationMenuLink key={item} asChild>
                                                    <a
                                                        href={`/makeup/tools/${item.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">{item}</div>
                                                    </a>
                                                </NavigationMenuLink>
                                            ))}
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* GIFT */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="text-sm font-medium bg-transparent hover:text-red-700">
                                    GIFT
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                                        {/* Gift ideas using featured brands */}
                                        <li className="col-span-2">
                                            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Luxury Gift Sets</div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {allBrandNames.featured.slice(0, 4).map((brand) => (
                                                    <NavigationMenuLink key={brand} asChild>
                                                        <a
                                                            href={`/gifts/brand/${brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                        >
                                                            <div className="text-sm font-medium leading-none">{brand} Gifts</div>
                                                        </a>
                                                    </NavigationMenuLink>
                                                ))}
                                            </div>
                                        </li>

                                        {/* Gift Categories */}
                                        <li>
                                            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">By Category</div>
                                            {['Perfume Gift Sets', 'Skincare Gift Sets', 'Makeup Gift Sets', 'Luxury Collections', 'Holiday Specials'].map((item) => (
                                                <NavigationMenuLink key={item} asChild>
                                                    <a
                                                        href={`/gifts/${item.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">{item}</div>
                                                    </a>
                                                </NavigationMenuLink>
                                            ))}
                                        </li>

                                        <li>
                                            <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">By Recipient</div>
                                            {['For Her', 'For Him', 'Unisex Gifts', 'Anniversary Gifts', 'Birthday Gifts'].map((item) => (
                                                <NavigationMenuLink key={item} asChild>
                                                    <a
                                                        href={`/gifts/${item.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <div className="text-sm font-medium leading-none">{item}</div>
                                                    </a>
                                                </NavigationMenuLink>
                                            ))}
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* TIPS & TRENDS */}
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    href="/tips-trends"
                                    className={navigationMenuTriggerStyle() + " text-sm font-medium bg-transparent hover:text-red-700"}
                                >
                                    TIPS & TRENDS
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            {/* OTHER BRANDS NOT HERE */}
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    href="/other-brands"
                                    className={navigationMenuTriggerStyle() + " text-sm font-medium bg-transparent hover:text-red-700"}
                                >
                                    OTHER BRANDS NOT HERE
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>

            {/* Mobile Menu - Now visible on mobile, hidden on desktop */}
            <MobileNavDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        </nav>
    );
}