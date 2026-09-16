'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types/index';
import { useToast } from '@/context/ToastContext';

interface WishlistContextType {
  wishlist: Product[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('aamerfahad_wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse wishlist:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('aamerfahad_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast(`Removed "${product.name}" from wishlist`, 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Added "${product.name}" to wishlist`, 'success');
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

