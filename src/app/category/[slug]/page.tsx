import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';
import { Product, Category } from '@/types';

interface Props {
  params: { slug: string };
}

async function getCategoryData(slug: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  try {
    const res = await fetch(`${API_URL}/categories/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as Category & { products: Product[] };
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const data = await getCategoryData(params.slug);
  if (!data) return { title: 'Category Not Found | Aamer Fahad' };

  return {
    title: `${data.name} | Aamer Fahad Pakistan`,
    description: data.description || `Shop premium ${data.name} with Cash on Delivery across Pakistan.`,
    openGraph: {
      title: `${data.name} | Aamer Fahad`,
      description: data.description || `Shop ${data.name}`,
      images: data.image ? [data.image] : [],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const category = await getCategoryData(params.slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
        <Link href="/" className="hover:text-brand-900 transition">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-brand-900 transition">
          Categories
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-zinc-900 font-bold">{category.name}</span>
      </nav>

      {/* Category Header Banner */}
      <div className="relative bg-zinc-950 rounded-3xl overflow-hidden p-8 sm:p-12 text-white shadow-xl">
        {category.image && (
          <div className="absolute inset-0 opacity-25">
            <Image
              src={category.image}
              alt={category.name}
              fill
              priority
              className="object-cover object-center"
            />
          </div>
        )}
        <div className="relative max-w-2xl space-y-3">
          <span className="px-3 py-1 bg-brand-800 text-gold-400 text-xs font-bold uppercase tracking-wider rounded-lg">
            Collection
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black">{category.name}</h1>
          {category.description && (
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg">
              {category.description}
            </p>
          )}
          <div className="pt-2 text-xs text-zinc-400 font-medium">
            {category.products?.length || 0} Products available with Cash on Delivery
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <ProductGrid
          products={category.products || []}
          emptyMessage={`No products currently available in ${category.name}.`}
        />
      </div>
    </div>
  );
}

