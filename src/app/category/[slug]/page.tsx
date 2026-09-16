import React from 'react';
import CategoryDetailClient from './CategoryDetailClient';
import { getFallbackCategory, FALLBACK_CATEGORIES } from '@/data/fallbackData';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return FALLBACK_CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const fallback = getFallbackCategory(params.slug);
  const name = fallback?.name || params.slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${name} | Aamer Fahad Pakistan`,
    description: fallback?.description || `Shop premium ${name} with Cash on Delivery across Pakistan.`,
    openGraph: {
      title: `${name} | Aamer Fahad`,
      description: fallback?.description || `Shop ${name}`,
      images: fallback?.image ? [fallback.image] : [],
    },
  };
}

export default function CategoryPage({ params }: Props) {
  const initialCategory = getFallbackCategory(params.slug);
  return <CategoryDetailClient slug={params.slug} initialCategory={initialCategory} />;
}
