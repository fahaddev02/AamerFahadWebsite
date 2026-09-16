'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Sparkles } from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';
import { Product, Category } from '@/types';
import { fetchApi } from '@/lib/api';
import { getFallbackCategory, FALLBACK_CATEGORIES } from '@/data/fallbackData';

interface Props {
  slug: string;
  initialCategory?: (Category & { products: Product[] }) | null;
}

export default function CategoryDetailClient({ slug, initialCategory }: Props) {
  const fallback = initialCategory || getFallbackCategory(slug);
  const [category, setCategory] = useState<(Category & { products: Product[] }) | null>(fallback);
  const [isLoading, setIsLoading] = useState(!fallback);

  useEffect(() => {
    let isMounted = true;
    fetchApi<Category & { products: Product[] }>(`/categories/${slug}`)
      .then((res) => {
        if (isMounted && res.success && res.data) {
          setCategory(res.data);
        }
      })
      .catch(() => {
        // Keep fallback data if API is offline
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const catName = category?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const catDesc = category?.description || `Explore our premium collection of ${catName.toLowerCase()} crafted with distinction.`;
  const catImage = category?.image || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80';
  const products = category?.products || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
        <Link href="/" className="hover:text-brand-900 transition">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-brand-900 transition">
          Collections
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-zinc-900 font-bold">{catName}</span>
      </nav>

      {/* Category Header Banner */}
      <div className="relative bg-zinc-950 rounded-3xl overflow-hidden p-8 sm:p-12 text-white shadow-xl">
        <div className="absolute inset-0 opacity-25">
          <Image
            src={catImage}
            alt={catName}
            fill
            priority
            className="object-cover object-center"
          />
        </div>
        <div className="relative max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-800 text-gold-400 text-xs font-bold uppercase tracking-wider rounded-lg">
            <Sparkles className="w-3 h-3" /> Exclusive Collection
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black">{catName}</h1>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg">
            {catDesc}
          </p>
          <div className="pt-2 text-xs text-zinc-400 font-medium">
            {products.length} Products available with Free Cash on Delivery across Pakistan
          </div>
        </div>
      </div>

      {/* Quick Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {FALLBACK_CATEGORIES.map((cat) => {
          const isActive = cat.slug === slug;
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-900 text-white shadow-sm'
                  : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {/* Products Grid */}
      <div>
        <ProductGrid
          products={products}
          emptyMessage={`No products currently available in ${catName}. Browse our shop for full catalog.`}
        />
      </div>
    </div>
  );
}
