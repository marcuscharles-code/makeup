'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Mail, KeyRound, AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";


export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }


    try {
      const credentials = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful');
      router.push('/panel-access');
    } catch (error) {
      setError('Login failed - check credentials');
    }


    console.log('Login credentials submitted:', { email, password });


  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center bg-gray-200 justify-center  p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-full mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Admin Login
            </h1>
            <p className="text-slate-600">
              Sign in to access the admin dash5y677board
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-5">
            <div>
              <Label className="text-sm mb-2">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-12 rounded-none"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm mb-2">
                Password
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-12 rounded-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <Label className="flex items-center gap-2 cursor-pointer">
                <Input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                <span className="text-slate-600">Remember me</span>
              </Label>
              <Link href="#" className="text-slate-900 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <Button
              onClick={handleLogin} disabled={loading}
              className="w-full rounded-none bg-slate-900 hover:bg-slate-800 text-white h-12 text-base font-medium"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Protected admin area. Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}