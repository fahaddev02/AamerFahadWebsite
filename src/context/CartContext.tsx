'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/types/index';
import { useToast } from '@/context/ToastContext';
import { fetchApi } from '@/lib/api';

interface AppliedCoupon {
  code: string;
  type: string;
  value: number;
  discountAmount: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  amountToFreeDelivery: number;
  freeDeliveryProgress: number;
  appliedCoupon: AppliedCoupon | null;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  applyCouponCode: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [deliveryFeeConfig, setDeliveryFeeConfig] = useState({ standard: 200, threshold: 3500 });
  const { showToast } = useToast();

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('zavier_cart_items');
    const savedCoupon = localStorage.getItem('zavier_cart_coupon');

    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart:', e);
      }
    }

    if (savedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(savedCoupon));
      } catch (e) {
        console.error('Failed to parse coupon:', e);
      }
    }

    // Fetch store settings for delivery fee
    fetchApi<Record<string, string>>('/settings').then((res) => {
      if (res.success && res.data) {
        setDeliveryFeeConfig({
          standard: parseFloat(res.data['delivery_fee'] || '200'),
          threshold: parseFloat(res.data['free_delivery_threshold'] || '3500'),
        });
      }
    });
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('zavier_cart_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('zavier_cart_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('zavier_cart_coupon');
    }
  }, [appliedCoupon]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const freeDeliveryThreshold = deliveryFeeConfig.threshold;
  const deliveryFee = subtotal >= freeDeliveryThreshold || items.length === 0 ? 0 : deliveryFeeConfig.standard;
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount + deliveryFee);

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      if (existingIndex > -1) {
        const existing = prev[existingIndex];
        const newQty = existing.quantity + quantity;
        if (newQty > item.stock) {
          showToast(`Only ${item.stock} units available in stock.`, 'error');
          return prev;
        }
        const updated = [...prev];
        updated[existingIndex] = { ...existing, quantity: newQty };
        showToast(`Updated "${item.name}" quantity to ${newQty}`, 'success');
        return updated;
      } else {
        if (quantity > item.stock) {
          showToast(`Only ${item.stock} units available in stock.`, 'error');
          return prev;
        }
        showToast(`Added "${item.name}" to cart`, 'success');
        return [...prev, { ...item, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (quantity > item.stock) {
            showToast(`Only ${item.stock} units available in stock.`, 'error');
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) {
        showToast(`Removed "${target.name}" from cart`, 'info');
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('zavier_cart_items');
    localStorage.removeItem('zavier_cart_coupon');
  };

  const applyCouponCode = async (code: string): Promise<boolean> => {
    if (!code.trim()) {
      showToast('Please enter a coupon code.', 'error');
      return false;
    }

    const res = await fetchApi<any>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    });

    if (res.success && res.data) {
      setAppliedCoupon(res.data);
      showToast(`Coupon "${res.data.code}" applied! You saved Rs. ${res.data.discountAmount}`, 'success');
      return true;
    } else {
      showToast(res.message || 'Invalid coupon code.', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        deliveryFee,
        freeDeliveryThreshold,
        amountToFreeDelivery,
        freeDeliveryProgress,
        appliedCoupon,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyCouponCode,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

