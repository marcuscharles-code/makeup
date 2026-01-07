"use client"

import { Mail, Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav>
            <div className='bg-[#222222] text-white flex gap-4 items-center p-4 flex-col md:flex-row justify-around py-2 font-bold'>
                <p>Phone: <span>+123 456 7890</span></p>
                <p>
                    <Mail className='text-white inline mr-2' size={16} />
                    <a
                        className='text-[#EFBF04]'
                        href="mailto:charm@gmail.com"
                    >
                        charm@gmail.com
                    </a>
                </p>
            </div>

            <div className='py-12 flex flex-col gap-8 md:flex-row justify-around items-center'>
                <div>
                    <Image src="/images/logo.png" alt="Logo" width={150} height={150} />
                </div>

                <div className='flex items-center justify-center relative'>
                    <Input
                        className='w-48'
                        type='search'
                        placeholder='Search...'
                    />
                    <Search className='absolute right-3' size={16} />
                </div>
            </div>

            {/* Mobile Menu */}
            <div className='md:hidden w-[80%] mx-auto mb-4 z-50'>
                <Collapsible>
                    <CollapsibleTrigger asChild>
                        <div
                            className='w-full rounded-none bg-[#C9A654] hover:bg-[#B39944] text-white flex items-center justify-between px-4 py-2'                           
                        >
                            <span className='font-semibold text-'>MENU</span>
                            <Menu size={32} />
                        </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="bg-white border-x border-b">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1" className="border-b px-4">
                                <Link href="/" className="block py-4 font-semibold hover:text-[#C9A654]">
                                    Home
                                </Link>
                            </AccordionItem>

                            <AccordionItem value="item-2" className="px-4">
                                <AccordionTrigger className="font-semibold hover:text-[#C9A654]">
                                    About Us
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex flex-col gap-2 pl-4">
                                        <Link href="/about/team" className="py-2 hover:text-[#C9A654]">Our Team</Link>
                                        <Link href="/about/mission" className="py-2 hover:text-[#C9A654]">Our Mission</Link>
                                        <Link href="/about/history" className="py-2 hover:text-[#C9A654]">History</Link>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3" className="px-4">
                                <AccordionTrigger className="font-semibold hover:text-[#C9A654]">
                                    Perfume
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex flex-col gap-2 pl-4">
                                        <Link href="/blog/latest" className="py-2 hover:text-[#C9A654]">Men</Link>
                                        <Link href="/blog/categories" className="py-2 hover:text-[#C9A654]">Women</Link>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                          
                            <AccordionItem value="item-5" className="px-4">
                                <AccordionTrigger className="font-semibold hover:text-[#C9A654]">
                                    Shop
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex flex-col gap-2 pl-4">
                                        <Link href="/shop/all" className="py-2 hover:text-[#C9A654]">All Products</Link>
                                        <Link href="/shop/makeup" className="py-2 hover:text-[#C9A654]">Make Up</Link>
                                        <Link href="/shop/gifts" className="py-2 hover:text-[#C9A654]">Gifts</Link>
                                        <Link href="/shop/brands" className="py-2 hover:text-[#C9A654]">All Brands</Link>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                           
                            <AccordionItem value="item-7" className="border-b px-4">
                                <Link href="/contact" className="block py-4 font-semibold hover:text-[#C9A654]">
                                    Contact Us
                                </Link>
                            </AccordionItem>
                        </Accordion>
                    </CollapsibleContent>
                </Collapsible>
            </div>


            <div className='hidden md:block'>
                {/* Your desktop navigation menu */}
            </div>
        </nav>
    );
}