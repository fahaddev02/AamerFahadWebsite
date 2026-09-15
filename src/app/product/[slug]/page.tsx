import React from 'react';
import ProductDetailClient from './ProductDetailClient';

export function generateStaticParams() {
  return [
    { slug: 'signature-leather-tote' },
    { slug: 'executive-briefcase' },
    { slug: 'urban-leather-backpack' },
    { slug: 'classic-bi-fold-wallet' },
    { slug: 'crossbody-messenger-bag' },
    { slug: 'weekend-duffle-bag' },
  ];
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  return <ProductDetailClient slug={params.slug} />;
}
