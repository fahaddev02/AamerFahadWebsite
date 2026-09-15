'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import ProductGrid from '../../components/product/ProductGrid';
import { Product } from '../../types/index';
import { fetchApi } from '../../lib/api';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSearchInput(query);
    if (!query) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetchApi<Product[]>(`/products?search=${encodeURIComponent(query)}`).then((res) => {
      if (res.success && res.data) {
        setProducts(res.data);
      }
      setIsLoading(false);
    });
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Search Input Hero */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-3xl font-serif font-black text-zinc-950">Search Products</h1>
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by product name, category, SKU, or tags..."
            className="w-full bg-white border-2 border-zinc-200 focus:border-brand-800 rounded-2xl pl-12 pr-28 py-4 text-sm focus:outline-none shadow-sm transition"
          />
          <SearchIcon className="w-5 h-5 text-zinc-400 absolute left-4" />
          <button
            type="submit"
            className="absolute right-2 px-6 py-2.5 bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold rounded-xl transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results Header */}
      {query && (
        <div className="border-b border-zinc-200 pb-4 flex items-center justify-between">
          <p className="text-sm text-zinc-700">
            Found <strong className="text-zinc-950 font-bold">{products.length}</strong> results for &ldquo;
            <span className="text-brand-900 font-bold">{query}</span>&rdquo;
          </p>
        </div>
      )}

      {/* Grid */}
      <ProductGrid
        products={products}
        isLoading={isLoading}
        emptyMessage={
          query
            ? `No products found matching "${query}". Try checking your spelling or search for "Handbag", "Backpack", or "Wallet".`
            : 'Type a keyword above to find products.'
        }
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-zinc-400">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}

