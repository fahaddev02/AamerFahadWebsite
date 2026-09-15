'use client';

import React from 'react';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/types/index';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function ProductGrid({
  products,
  isLoading = false,
  emptyMessage = 'No products found matching your selection.',
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-zinc-200 p-3 space-y-3 animate-pulse">
            <div className="aspect-[4/5] bg-zinc-200 rounded-xl w-full" />
            <div className="h-3 bg-zinc-200 rounded w-1/3" />
            <div className="h-4 bg-zinc-200 rounded w-3/4" />
            <div className="h-5 bg-zinc-200 rounded w-1/2 pt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-2xl border border-zinc-200/80 my-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
          🛍️
        </div>
        <h3 className="text-lg font-bold text-zinc-900 mb-1">No Products Found</h3>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

