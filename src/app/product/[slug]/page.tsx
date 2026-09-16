import React from 'react';
import ProductDetailClient from './ProductDetailClient';
import { FALLBACK_PRODUCTS, getFallbackProduct } from '@/data/fallbackData';

export function generateStaticParams() {
  return FALLBACK_PRODUCTS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const fallback = getFallbackProduct(params.slug);
  const name = fallback?.name || params.slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${name} | Aamer Fahad Pakistan`,
    description: fallback?.shortDesc || fallback?.description || `Buy ${name} online at Aamer Fahad. Cash on delivery available.`,
    openGraph: {
      title: `${name} | Aamer Fahad`,
      description: fallback?.shortDesc || fallback?.description,
      images: fallback?.images?.[0]?.url ? [fallback.images[0].url] : [],
    },
  };
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const initialProduct = getFallbackProduct(params.slug);
  return <ProductDetailClient slug={params.slug} initialProduct={initialProduct} />;
}
