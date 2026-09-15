'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { fetchApi } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const res = await fetchApi<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    setIsLoading(false);

    if (res.success && res.token && res.user) {
      login(res.token, res.user);
      showToast('Account created successfully! Welcome to Aamer Fahad.', 'success');
      router.push('/account');
    } else {
      setErrorMsg(res.message || 'Registration failed. Please try again.');
      showToast(res.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] uppercase tracking-widest font-bold text-brand-800">
            Create Customer Account
          </span>
          <h1 className="text-2xl font-serif font-black text-zinc-950">Join Aamer Fahad</h1>
          <p className="text-xs text-zinc-500">Save addresses, view order history & get VIP discounts.</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-zinc-700 mb-1.5">Full Name *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ayesha Khan"
                className="w-full pl-10 pr-3 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-brand-800 focus:outline-none"
              />
              <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1.5">Email Address *</label>
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
            <label className="block font-semibold text-zinc-700 mb-1.5">Mobile Number (Pakistan)</label>
            <div className="relative">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="03319235315"
                className="w-full pl-10 pr-3 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-brand-800 focus:outline-none font-mono"
              />
              <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1.5">Password (Min 6 characters) *</label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
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
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-500 pt-2 border-t border-zinc-100">
          Already have an account?{' '}
          <Link href="/account/login" className="font-bold text-brand-900 hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}

