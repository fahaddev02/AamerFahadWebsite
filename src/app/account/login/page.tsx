'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { fetchApi } from '../../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const res = await fetchApi<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    setIsLoading(false);

    if (res.success && res.token && res.user) {
      login(res.token, res.user);
      showToast(`Welcome back, ${res.user.name}!`, 'success');

      router.push('/account');
    } else {
      setErrorMsg(res.message || 'Invalid email or password.');
      showToast(res.message || 'Login failed', 'error');
    }
  };

  const handleFillDemoAdmin = () => {
    setFormData({ email: 'admin@aamerfahad.pk', password: 'AdminPassword123!' });
  };

  const handleFillDemoCustomer = () => {
    setFormData({ email: 'ahmed.khan@gmail.com', password: 'Customer123!' });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] uppercase tracking-widest font-bold text-brand-800">
            Account Access
          </span>
          <h1 className="text-2xl font-serif font-black text-zinc-950">Welcome Back</h1>
          <p className="text-xs text-zinc-500">Sign in to track orders, manage addresses & wishlist.</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-zinc-700 mb-1.5">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-brand-800 focus:outline-none"
              />
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-brand-800 focus:outline-none"
              />
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-brand-900 hover:bg-brand-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition active:scale-98"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Credentials */}


        <div className="text-center text-xs text-zinc-500 pt-2 border-t border-zinc-100">
          Don't have an account?{' '}
          <Link href="/account/register" className="font-bold text-brand-900 hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}

