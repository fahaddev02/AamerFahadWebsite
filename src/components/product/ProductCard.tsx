'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../../types/index';
import { formatPKR } from '../../lib/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const mainImage =
    product.images && product.images.length > 0
      ? product.images.find((img) => img.isMain)?.url || product.images[0].url
      : 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80';

  const hoverImage =
    product.images && product.images.length > 1
      ? product.images[1].url
      : mainImage;

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const currentPrice = product.salePrice || product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: currentPrice,
      originalPrice: product.price,
      image: mainImage,
      stock: product.stock,
      slug: product.slug,
    });
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-zinc-200/80 hover:border-zinc-300 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Product Image & Badges */}
      <div className="relative aspect-[4/5] bg-zinc-100 overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges Container */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <span className="px-2.5 py-1 bg-rose-600 text-white text-[11px] font-bold rounded-lg shadow-md tracking-wider">
              SAVE {discountPercent}%
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase rounded-lg shadow-sm tracking-wider">
              Best Seller
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="px-2 py-0.5 bg-zinc-900/80 backdrop-blur-sm text-zinc-100 text-[10px] font-medium rounded-md">
              Only {product.stock} Left
            </span>
          )}
          {product.stock === 0 && (
            <span className="px-2 py-0.5 bg-zinc-800 text-white text-[10px] font-bold uppercase rounded-md">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-md ${
            inWishlist
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/80 text-zinc-700 hover:bg-white hover:text-rose-600'
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick Add To Cart Button (Desktop Slide Up) */}
        {product.stock > 0 && (
          <div className="absolute inset-x-3 bottom-3 hidden md:block opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <button
              onClick={handleQuickAdd}
              className="w-full py-2.5 bg-brand-900/95 hover:bg-brand-800 text-white text-xs font-semibold rounded-xl backdrop-blur-sm shadow-lg flex items-center justify-center gap-2 transition active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" /> Quick Add
            </button>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & Rating */}
        <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
          <span className="text-zinc-400 font-medium truncate uppercase text-[10px] tracking-wider">
            {product.category?.name || product.brand || 'Luxury'}
          </span>
          <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating || '5.0'}</span>
          </div>
        </div>

        {/* Product Title */}
        <Link href={`/product/${product.slug}`} className="group-hover:text-brand-800 transition">
          <h3 className="text-sm font-semibold text-zinc-900 line-clamp-1 mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Price Section */}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-zinc-950 font-sans">
              {formatPKR(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-zinc-400 line-through font-normal">
                {formatPKR(product.price)}
              </span>
            )}
          </div>

          {/* Mobile Quick Add Button */}
          {product.stock > 0 && (
            <button
              onClick={handleQuickAdd}
              className="md:hidden p-2 bg-brand-900 text-white rounded-xl active:scale-90 transition"
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

