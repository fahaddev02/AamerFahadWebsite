'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, Sparkles, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPKR } from '../../lib/formatters';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    deliveryFee,
    amountToFreeDelivery,
    freeDeliveryProgress,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    totalAmount,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    await applyCouponCode(couponInput.trim());
    setIsApplying(false);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-zinc-100 flex items-center justify-center text-4xl shadow-inner">
          🛍️
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-zinc-950">Your Shopping Cart is Empty</h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
            Discover our luxury leather bags, waterproof backpacks, and genuine wallets designed for Pakistan.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition active:scale-95"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-black text-zinc-950">Shopping Cart</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Review your {items.length} {items.length === 1 ? 'item' : 'items'} before proceeding to Cash on Delivery checkout.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:underline self-start sm:self-auto"
        >
          Clear All Items
        </button>
      </div>

      {/* Free Delivery Banner */}
      <div className="p-4 bg-brand-50 border border-brand-100 rounded-2xl text-xs">
        {amountToFreeDelivery === 0 ? (
          <p className="font-semibold text-brand-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            🎉 Congratulations! You have qualified for <strong>FREE Delivery</strong> across Pakistan.
          </p>
        ) : (
          <p className="text-zinc-700">
            Add <strong className="text-brand-900 font-bold">{formatPKR(amountToFreeDelivery)}</strong> more worth of items to unlock <strong>FREE Delivery</strong>!
          </p>
        )}
        <div className="w-full bg-zinc-200 h-2.5 rounded-full mt-2.5 overflow-hidden">
          <div
            className="bg-brand-800 h-full rounded-full transition-all duration-500"
            style={{ width: `${freeDeliveryProgress}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Item List & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm divide-y divide-zinc-100">
          {items.map((item) => (
            <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-5 first:pt-0 last:pb-0">
              <div className="relative w-24 h-28 bg-zinc-100 rounded-2xl overflow-hidden shrink-0 border border-zinc-200">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="120px"
                  className="object-cover object-center"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-bold text-sm sm:text-base text-zinc-900 hover:text-brand-800 transition"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-zinc-400 hover:text-rose-600 transition p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {item.variantName && (
                    <p className="text-xs text-zinc-500 mt-1 font-medium">{item.variantName}</p>
                  )}

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-bold text-sm text-zinc-950 font-sans">
                      {formatPKR(item.price)}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-xs text-zinc-400 line-through">
                        {formatPKR(item.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Quantity Selector & Item Total */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100">
                  <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-zinc-200 text-zinc-700 transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-bold text-zinc-900 min-w-[32px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-zinc-200 text-zinc-700 transition"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-zinc-400 block font-medium">Subtotal</span>
                    <span className="text-sm font-bold text-zinc-950 font-sans">
                      {formatPKR(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Coupon Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm space-y-5 text-xs">
            <h3 className="text-base font-bold text-zinc-950 border-b border-zinc-100 pb-3">
              Order Summary
            </h3>

            {/* Coupon input */}
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <span>
                    Coupon <strong>{appliedCoupon.code}</strong> (-{formatPKR(appliedCoupon.discountAmount)})
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-rose-600 hover:underline font-bold"
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
                  placeholder="Discount Coupon Code"
                  className="flex-1 px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs uppercase focus:ring-2 focus:ring-brand-800 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isApplying || !couponInput.trim()}
                  className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-bold rounded-xl transition"
                >
                  {isApplying ? '...' : 'Apply'}
                </button>
              </form>
            )}

            {/* Summary lines */}
            <div className="space-y-2.5 text-zinc-600 pt-2">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-zinc-900">{formatPKR(subtotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatPKR(appliedCoupon.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery (COD Express)</span>
                <span className="font-semibold text-zinc-900">
                  {deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : formatPKR(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-zinc-950 pt-3 border-t border-zinc-200">
                <span>Grand Total (PKR)</span>
                <span className="text-lg text-brand-900 font-sans">{formatPKR(totalAmount)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              className="block w-full py-4 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs uppercase tracking-wider text-center rounded-2xl shadow-xl transition active:scale-98"
            >
              Proceed to Checkout (COD) →
            </Link>

            <Link
              href="/shop"
              className="block text-center text-xs text-zinc-500 hover:text-brand-900 transition flex items-center justify-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

