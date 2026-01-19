/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { useRouter } from 'next/navigation';
import { Chrome, Facebook, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

export default function CreateAccountForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });


    const handleSubmit = async () => {
        const { email, password } = formData;

        if (!email || !password) {
            alert('Please enter email and password');
            return;
        }

        try {
            setLoading(true);

            await signInWithEmailAndPassword(auth, email, password);
          
            router.push('/');
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Invalid login credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };



    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg  p-8">
                    <h1 className="text-3xl font-semibold text-center mb-2">
                        Login to my account
                    </h1>

                    <p className="text-center text-gray-600 mb-8">
                        Enter your e-mail and password:
                    </p>

                    <div className="space-y-4">

                        <Input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded-none"
                        />

                        <Input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full rounded-none"
                        />

                        <Button
                            onClick={handleSubmit}
                            className="w-full rounded-none bg-black hover:bg-gray-800 text-white py-6 text-base"
                        >
                            Login
                        </Button>
                    </div>

                    <p className="text-center text-xs text-gray-500 mt-4">
                        This site is protected by hCaptcha and the hCaptcha Privacy Policy and Terms of Service apply.
                    </p>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            New Customer?{' '}
                            <Link href="/auth/create-account" className="text-blue-600 hover:underline">
                                Login
                            </Link>
                        </p>
                        <p className="text-sm text-gray-600">
                            Forgot password?{' '}
                            <Link href="/auth/login" className="text-blue-600 hover:underline">
                                Click here
                            </Link>
                        </p>
                    </div>

                    <div className="mt-6 flex items-center">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-sm text-gray-500">OR</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    <div className="mt-6 flex justify-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="w-12 h-12 rounded-lg"
                        >
                            <Chrome className="w-5 h-5 text-gray-700" />
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="w-12 h-12 rounded-lg"
                        >
                            <Facebook className="w-5 h-5 text-blue-600" />
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="w-12 h-12 rounded-lg"
                        >
                            <Linkedin className="w-5 h-5 text-blue-700" />
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="w-12 h-12 rounded-lg"
                        >
                            <Mail className="w-5 h-5 text-purple-600" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}