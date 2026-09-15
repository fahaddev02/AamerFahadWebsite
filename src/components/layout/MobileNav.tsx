'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function MobileNav() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();

  // Hide on admin routes
  if (pathname.startsWith('/admin')) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-zinc-200 py-2 px-6 flex items-center justify-between shadow-lg">
      <Link
        href="/"
        className={`flex flex-col items-center gap-1 text-[11px] font-medium transition ${
          pathname === '/' ? 'text-brand-800 font-semibold' : 'text-zinc-500 hover:text-zinc-900'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </Link>

      <Link
        href="/shop"
        className={`flex flex-col items-center gap-1 text-[11px] font-medium transition ${
          pathname.startsWith('/shop') || pathname.startsWith('/category')
            ? 'text-brand-800 font-semibold'
            : 'text-zinc-500 hover:text-zinc-900'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span>Shop</span>
      </Link>

      <button
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center gap-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-900 relative"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-brand-900" />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-brand-800 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
        <span>Cart</span>
      </button>

      <Link
        href="/wishlist"
        className={`flex flex-col items-center gap-1 text-[11px] font-medium transition relative ${
          pathname === '/wishlist' ? 'text-brand-800 font-semibold' : 'text-zinc-500 hover:text-zinc-900'
        }`}
      >
        <div className="relative">
          <Heart className="w-5 h-5" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-amber-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </div>
        <span>Wishlist</span>
      </Link>

      <Link
        href="/account"
        className={`flex flex-col items-center gap-1 text-[11px] font-medium transition ${
          pathname.startsWith('/account') ? 'text-brand-800 font-semibold' : 'text-zinc-500 hover:text-zinc-900'
        }`}
      >
        <User className="w-5 h-5" />
        <span>Account</span>
      </Link>
    </div>
  );
}

