'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { ProductImage } from '../../types/index';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const fallbackImages = [
    {
      id: 'default',
      url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
      alt: productName,
      isMain: true,
      sortOrder: 0,
    },
  ];

  const galleryList = images && images.length > 0 ? images : fallbackImages;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const activeImage = galleryList[selectedIndex] || galleryList[0];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % galleryList.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + galleryList.length) % galleryList.length);
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnail Strip */}
      {galleryList.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 scrollbar-none shrink-0 lg:w-20">
          {galleryList.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-16 h-20 sm:w-20 sm:h-24 lg:w-20 lg:h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                selectedIndex === idx
                  ? 'border-brand-800 ring-2 ring-brand-800/20 shadow-md'
                  : 'border-zinc-200 hover:border-zinc-400 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Showcase Image */}
      <div className="relative flex-1 aspect-[4/5] bg-zinc-100 rounded-3xl overflow-hidden border border-zinc-200/80 shadow-sm">
        <Image
          src={activeImage.url}
          alt={activeImage.alt || productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-cover object-center transition-all duration-300 ${
            isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        />

        {/* Floating Zoom Indicator */}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute top-4 right-4 p-2.5 bg-white/80 hover:bg-white backdrop-blur-md rounded-full shadow-md text-zinc-700 transition"
          aria-label="Toggle zoom"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Carousel Arrow Controls (if multiple images) */}
        {galleryList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-zinc-800 rounded-full shadow-lg backdrop-blur-sm transition"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-zinc-800 rounded-full shadow-lg backdrop-blur-sm transition"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

