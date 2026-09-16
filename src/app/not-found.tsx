import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Home, ChevronRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-zinc-200/80 p-8 sm:p-12 text-center shadow-lg space-y-6">
        <div className="w-20 h-20 bg-brand-50 text-brand-900 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">Error 404</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-zinc-950">Page Not Found</h1>
          <p className="text-xs text-zinc-500 leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-center">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold uppercase tracking-wider rounded-xl border border-zinc-200 transition"
          >
            <span>Browse Catalog</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
