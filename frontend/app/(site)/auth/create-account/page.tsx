/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { auth, db } from '@/firebase/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Chrome, Facebook, Linkedin, Mail } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function CreateAccountForm() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const handleSubmit = async () => {
        const { email, password, firstName, lastName } = formData;

        if (!email || !password || !firstName || !lastName) {
            alert('Please fill in all fields');
            return;
        }

        try {
            // 1. Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;
            
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                firstName,
                lastName,
                email,
                createdAt: serverTimestamp(),
            });

            router.push('/');
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Something went wrong');
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
                        Create my account
                    </h1>

                    <p className="text-center text-gray-600 mb-8">
                        Please fill in the information below:
                    </p>

                    <div className="space-y-4">
                        <Input
                            type="text"
                            name="firstName"
                            placeholder="First name"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full rounded-none"
                        />

                        <Input
                            type="text"
                            name="lastName"
                            placeholder="Last name"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full rounded-none"
                        />

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
                            Create my account
                        </Button>
                    </div>

                    <p className="text-center text-xs text-gray-500 mt-4">
                        This site is protected by hCaptcha and the hCaptcha Privacy Policy and Terms of Service apply.
                    </p>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link href="/auth/login" className="text-blue-600 hover:underline">
                                Login here
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