'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

export default function Footer() {
    const [email, setEmail] = useState('');

    const handleSubscribe = () => {
        console.log('Subscribed:', email);
        setEmail('');
    };

    return (
        <footer className="bg-black text-white">
            <div className="hidden md:block mx-auto px-12 py-12">
                <div className="grid grid-cols-3 gap-12">
                    <div>
                        <h3 className="text-sm  mb-6 tracking-wider">
                            CONTACT US
                        </h3>
                        <div className="space-y-2 text-sm text-gray-300">
                            <p>Greenville plaza. No. 15, block 20. Admiralty way,</p>
                            <p>Lekki Phase 1, Lagos.</p>
                            <p className="mt-4">Call Us : 09062277470</p>
                            <p className="mt-2">
                                Email:{' '}
                                <a
                                    href="mailto:info@essenza.ng"
                                    className="underline hover:text-white"
                                >
                                    info@essenza.ng
                                </a>
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold mb-6 tracking-wider">
                            MORE ON ESSENZA
                        </h3>
                        <ul className="space-y-3 text-sm text-gray-300">
                            {[
                                'About Essenza',
                                'Essenza Cares',
                                'Shipping and Delivery',
                                'Our Stores',
                                'Terms of Service',
                                'Refund policy',
                                'Let Us Know Your Birthday',
                                'Frequently Asked Questions',
                            ].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="hover:text-white transition">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold mb-6 tracking-wider">
                            ESSENZA TIPS & TRENDS
                        </h3>
                        <p className="text-sm text-gray-300 mb-6">
                            Join our exclusive community to enjoy latest updates on niche
                            fragrance, skincare, and makeup brands.
                        </p>
                        <div className="space-y-4">
                            <Input
                                type="email"
                                placeholder="Your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white text-black rounded-none"
                            />
                            <Button
                                onClick={handleSubscribe}
                                className="bg-red-700 hover:bg-red-800 rounded-none"
                            >
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="md:hidden px-6 py-6">
                <Accordion type="multiple" className="space-y-4">
                    <AccordionItem value="contact" className="border-b border-gray-800">
                        <AccordionTrigger
                            className="text-sm font-semibold tracking-wider"                           
                        >
                            CONTACT US
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-gray-300 space-y-2">
                            <p>Greenville plaza. No. 15, block 20. Admiralty way,</p>
                            <p>Lekki Phase 1, Lagos.</p>
                            <p>Call Us : 09062277470</p>
                            <p>
                                Email:{' '}
                                <a href="mailto:info@essenza.ng" className="underline">
                                    info@essenza.ng
                                </a>
                            </p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="more" className="border-b border-gray-800">
                        <AccordionTrigger
                            className="text-sm font-semibold tracking-wider"                           
                        >
                            MORE ON ESSENZA
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="space-y-3 text-sm text-gray-300">
                                {[
                                    'About Essenza',
                                    'Essenza Cares',
                                    'Shipping and Delivery',
                                    'Our Stores',
                                    'Terms of Service',
                                    'Refund policy',
                                    'Let Us Know Your Birthday',
                                    'Frequently Asked Questions',
                                ].map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="hover:text-white">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <div className="mt-8">
                    <h3 className="text-sm font-semibold mb-4 tracking-wider">
                        ESSENZA TIPS & TRENDS
                    </h3>
                    <Input
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white text-black rounded-none mb-4"
                    />
                    <Button className="bg-red-700 hover:bg-red-800 rounded-none">
                        Subscribe
                    </Button>
                </div>


                <div className="mt-8 text-sm text-gray-400">
                    <p>© 2026 essenza</p>
                    <p>Powered by essenza</p>
                </div>
            </div>
        </footer>
    );
}
