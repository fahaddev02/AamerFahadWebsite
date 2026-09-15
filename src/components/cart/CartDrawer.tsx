'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPKR } from '../../lib/formatters';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    subtotal,
    deliveryFee,
    freeDeliveryThreshold,
    amountToFreeDelivery,
    freeDeliveryProgress,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    totalAmount,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    await applyCouponCode(couponInput.trim());
    setIsApplyingCoupon(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-fade-in">
          {/* 1. Header */}
          <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-brand-900" />
              <h3 className="text-base font-bold text-zinc-900">Your Shopping Bag</h3>
              <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full font-semibold">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Free Delivery Meter */}
          <div className="p-4 bg-brand-50/70 border-b border-brand-100 text-xs">
            {amountToFreeDelivery === 0 ? (
              <p className="font-semibold text-brand-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                🎉 You’ve unlocked <strong>FREE Delivery</strong> across Pakistan!
              </p>
            ) : (
              <p className="text-zinc-700">
                Add <strong className="text-brand-900 font-bold">{formatPKR(amountToFreeDelivery)}</strong> more to unlock <strong className="text-brand-900">FREE Delivery</strong>
              </p>
            )}
            <div className="w-full bg-zinc-200 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-brand-800 h-full rounded-full transition-all duration-500"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          {/* 3. Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-zinc-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 text-2xl">
                  🛍️
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-base">Your cart is empty</h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                    Explore our luxury handbags, executive laptop bags and genuine leather wallets.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-3 bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold rounded-xl transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 first:pt-0">
                  <div className="relative w-20 h-24 bg-zinc-100 rounded-xl overflow-hidden shrink-0 border border-zinc-200/80">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover object-center"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-semibold text-xs text-zinc-900 hover:text-brand-800 transition line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-zinc-400 hover:text-rose-600 transition p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.variantName && (
                        <p className="text-[11px] text-zinc-500 mt-0.5">{item.variantName}</p>
                      )}

                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-bold text-xs text-zinc-950">
                          {formatPKR(item.price)}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-[10px] text-zinc-400 line-through">
                            {formatPKR(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden bg-zinc-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-zinc-200 text-zinc-700 transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-bold text-zinc-800 min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-zinc-200 text-zinc-700 transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-zinc-900">
                        {formatPKR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 4. Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-zinc-200 bg-zinc-50/80 space-y-3.5 text-xs">
              {/* Coupon Section */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>
                      Coupon <strong className="font-bold">{appliedCoupon.code}</strong> applied ({formatPKR(appliedCoupon.discountAmount)} off)
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Coupon Code (e.g. WELCOME10)"
                    className="flex-1 px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs uppercase focus:ring-2 focus:ring-brand-800 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon || !couponInput.trim()}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-semibold rounded-xl transition"
                  >
                    {isApplyingCoupon ? '...' : 'Apply'}
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-zinc-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-zinc-900">{formatPKR(subtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>-{formatPKR(appliedCoupon.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery (TCS/Leopard COD)</span>
                  <span className="font-medium text-zinc-900">
                    {deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : formatPKR(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-zinc-950 pt-2 border-t border-zinc-200">
                  <span>Estimated Total</span>
                  <span className="text-base text-brand-900 font-sans">{formatPKR(totalAmount)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3.5 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-2 transition active:scale-98"
                >
                  <span>Proceed to Checkout (COD)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full py-2.5 text-center text-xs font-semibold text-zinc-700 hover:text-brand-900 hover:bg-zinc-100 rounded-xl transition"
                >
                  View Full Cart Page
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

