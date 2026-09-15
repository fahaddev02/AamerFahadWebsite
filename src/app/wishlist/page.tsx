'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { formatPKR } from '../../lib/formatters';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToCart = (product: any) => {
    const mainImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80';
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      originalPrice: product.price,
      image: mainImage,
      stock: product.stock,
      slug: product.slug,
    });
    removeFromWishlist(product.id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto">
          <Heart className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-serif font-black text-zinc-950">Your Wishlist is Empty</h1>
        <p className="text-xs text-zinc-500">Save your favorite handbags, backpacks, and wallets to buy later.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-900 text-white text-xs font-bold rounded-2xl shadow-md transition"
        >
          <span>Explore Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      <div className="border-b border-zinc-200 pb-4">
        <h1 className="text-3xl font-serif font-black text-zinc-950">My Saved Wishlist</h1>
        <p className="text-xs text-zinc-500 mt-1">
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved in your wishlist.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((prod) => {
          const mainImg = prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80';
          const price = prod.salePrice || prod.price;

          return (
            <div
              key={prod.id}
              className="bg-white rounded-3xl border border-zinc-200/80 overflow-hidden shadow-sm flex flex-col"
            >
              <div className="relative aspect-[4/5] bg-zinc-100">
                <Image
                  src={mainImg}
                  alt={prod.name}
                  fill
                  sizes="280px"
                  className="object-cover object-center"
                />
                <button
                  onClick={() => removeFromWishlist(prod.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-rose-600 rounded-full shadow-md transition"
                  aria-label="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                <div>
                  <Link
                    href={`/product/${prod.slug}`}
                    className="font-bold text-xs text-zinc-900 hover:text-brand-800 transition line-clamp-1"
                  >
                    {prod.name}
                  </Link>
                  <p className="font-bold text-sm text-zinc-950 font-sans mt-1">
                    {formatPKR(price)}
                  </p>
                </div>

                <button
                  onClick={() => handleMoveToCart(prod)}
                  className="w-full py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

