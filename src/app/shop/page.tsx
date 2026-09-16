'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, ArrowUpDown, X, Search, RotateCcw } from 'lucide-react';
import ProductGrid from '../../components/product/ProductGrid';
import { Product, Category } from '../../types/index';
import { fetchApi } from '../../lib/api';
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from '../../data/fallbackData';

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(FALLBACK_PRODUCTS.length);

  // Filter States
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || searchParams.get('q') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const inStockParam = searchParams.get('inStock') === 'true';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [selectedSort, setSelectedSort] = useState(sortParam);
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  const [inStockOnly, setInStockOnly] = useState(inStockParam);

  // Sync url params to local state
  useEffect(() => {
    setSelectedCategory(categoryParam);
    setSearchTerm(searchParam);
    setSelectedSort(sortParam);
    setMinPrice(minPriceParam);
    setMaxPrice(maxPriceParam);
    setInStockOnly(inStockParam);
  }, [categoryParam, searchParam, sortParam, minPriceParam, maxPriceParam, inStockParam]);

  // Load categories
  useEffect(() => {
    fetchApi<Category[]>('/categories').then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        setCategories(res.data);
      }
    });
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (searchTerm) params.set('search', searchTerm);
    if (selectedSort) params.set('sort', selectedSort);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (inStockOnly) params.set('inStock', 'true');

    fetchApi<Product[]>(`/products?${params.toString()}`)
      .then((res) => {
        if (isMounted) {
          if (res.success && res.data && res.data.length > 0) {
            setProducts(res.data);
            setTotalCount(res.pagination?.total || res.data.length);
          } else {
            // Apply local filter on fallback products
            let filtered = [...FALLBACK_PRODUCTS];
            if (selectedCategory) {
              const matchedCat = FALLBACK_CATEGORIES.find((c) => c.slug === selectedCategory || c.id === selectedCategory);
              if (matchedCat) {
                filtered = filtered.filter((p) => p.categoryId === matchedCat.id);
              }
            }
            if (searchTerm) {
              const term = searchTerm.toLowerCase();
              filtered = filtered.filter(
                (p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
              );
            }
            setProducts(filtered);
            setTotalCount(filtered.length);
          }
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          let filtered = [...FALLBACK_PRODUCTS];
          if (selectedCategory) {
            const matchedCat = FALLBACK_CATEGORIES.find((c) => c.slug === selectedCategory || c.id === selectedCategory);
            if (matchedCat) {
              filtered = filtered.filter((p) => p.categoryId === matchedCat.id);
            }
          }
          if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
              (p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
            );
          }
          setProducts(filtered);
          setTotalCount(filtered.length);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, searchTerm, selectedSort, minPrice, maxPrice, inStockOnly]);

  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/shop?${params.toString()}`);
  };

  const resetAllFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
    setSelectedSort('newest');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    router.push('/shop');
  };

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    Boolean(searchTerm) ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Page Header */}
      <div className="border-b border-zinc-200 pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-zinc-950">
            {selectedCategory
              ? categories.find((c) => c.slug === selectedCategory)?.name || 'Collection'
              : 'Shop All Products'}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Showing {products.length} of {totalCount} items with Cash on Delivery available
          </p>
        </div>

        {/* Top Controls: Search & Sort */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-semibold flex items-center gap-2 border border-zinc-200"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-brand-800" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-zinc-400 hidden sm:inline" />
            <select
              value={selectedSort}
              onChange={(e) => {
                setSelectedSort(e.target.value);
                updateFilters({ sort: e.target.value });
              }}
              className="bg-white border border-zinc-200 text-xs font-semibold text-zinc-800 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand-800 focus:outline-none"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="featured">Featured First</option>
              <option value="best-selling">Best Selling</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid & Filters Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-800" /> Filters
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="text-xs text-rose-600 hover:underline font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Keyword Search Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                Search Keyword
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && updateFilters({ search: searchTerm })}
                  placeholder="e.g. Leather, Laptop, Tan"
                  className="w-full pl-8 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-800"
                />
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-3" />
              </div>
            </div>

            {/* Categories Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                Categories
              </label>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    updateFilters({ category: null });
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl transition ${
                    !selectedCategory
                      ? 'bg-brand-900 text-white font-bold'
                      : 'text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCategory(c.slug);
                      updateFilters({ category: c.slug });
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center justify-between ${
                      selectedCategory === c.slug
                        ? 'bg-brand-900 text-white font-bold'
                        : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    <span>{c.name}</span>
                    {c.productCount !== undefined && (
                      <span className={`text-[10px] ${selectedCategory === c.slug ? 'text-zinc-200' : 'text-zinc-400'}`}>
                        {c.productCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                Price (PKR)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min Rs."
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-800 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Max Rs."
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-800 focus:outline-none"
                />
              </div>
              <button
                onClick={() => updateFilters({ minPrice, maxPrice })}
                className="mt-2 w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition"
              >
                Apply Price
              </button>
            </div>

            {/* Stock Availability Filter */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 text-xs font-medium text-zinc-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => {
                    setInStockOnly(e.target.checked);
                    updateFilters({ inStock: e.target.checked ? 'true' : null });
                  }}
                  className="w-4 h-4 rounded text-brand-900 focus:ring-brand-800"
                />
                <span>In Stock Items Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Product Catalog Display */}
        <div className="lg:col-span-3">
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs text-zinc-400 font-medium">Active filters:</span>
              {selectedCategory && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 border border-brand-200 text-brand-900 text-xs rounded-full font-semibold">
                  Category: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                  <button onClick={() => updateFilters({ category: null })}><X className="w-3 h-3" /></button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 border border-zinc-300 text-zinc-800 text-xs rounded-full font-semibold">
                  "{searchTerm}"
                  <button onClick={() => updateFilters({ search: null })}><X className="w-3 h-3" /></button>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 border border-zinc-300 text-zinc-800 text-xs rounded-full font-semibold">
                  Price: Rs. {minPrice || 0} - Rs. {maxPrice || '∞'}
                  <button onClick={() => updateFilters({ minPrice: null, maxPrice: null })}><X className="w-3 h-3" /></button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-full font-semibold">
                  In Stock Only
                  <button onClick={() => updateFilters({ inStock: null })}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}

          <ProductGrid products={products} isLoading={isLoading} />
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 shadow-2xl flex flex-col z-10 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
              <h3 className="font-bold text-base text-zinc-950">Filter Products</h3>
              <button onClick={() => setIsMobileFiltersOpen(false)}>
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-700 mb-2">Category</label>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    updateFilters({ category: null });
                    setIsMobileFiltersOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl ${!selectedCategory ? 'bg-brand-900 text-white font-bold' : 'text-zinc-700'}`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCategory(c.slug);
                      updateFilters({ category: c.slug });
                      setIsMobileFiltersOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl ${selectedCategory === c.slug ? 'bg-brand-900 text-white font-bold' : 'text-zinc-700'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-700 mb-2">Price (PKR)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-zinc-200 space-y-2">
              <button
                onClick={() => {
                  updateFilters({ minPrice, maxPrice });
                  setIsMobileFiltersOpen(false);
                }}
                className="w-full py-3 bg-brand-900 text-white font-bold rounded-xl text-xs"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  resetAllFilters();
                  setIsMobileFiltersOpen(false);
                }}
                className="w-full py-2 text-center text-xs text-rose-600 font-semibold"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-zinc-400">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}

