'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Truck, Lock, ArrowRight, Banknote, AlertCircle } from 'lucide-react';
import PakistaniCitySelect from '../../components/checkout/PakistaniCitySelect';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatPKR } from '../../lib/formatters';
import { fetchApi } from '../../lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, deliveryFee, appliedCoupon, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    shippingAddress: '',
    city: 'Karachi',
    province: 'Sindh',
    postalCode: '',
    notes: '',
    paymentMethod: 'COD',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Prefill if user is logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName: prev.customerName || user.name || '',
        customerEmail: prev.customerEmail || user.email || '',
        customerPhone: prev.customerPhone || user.phone || '',
      }));
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-black text-zinc-950">Your Cart is Empty</h2>
        <p className="text-xs text-zinc-500">Please add items to your cart before proceeding to checkout.</p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-brand-900 text-white text-xs font-bold rounded-xl"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Phone validation
    const phoneClean = formData.customerPhone.replace(/[\s-]/g, '');
    if (!/^(\+92|0|92)[0-9]{9,11}$/.test(phoneClean)) {
      setErrorMessage('Please enter a valid Pakistani phone number (e.g. 03001234567 or +923001234567).');
      showToast('Please enter a valid Pakistani phone number.', 'error');
      return;
    }

    if (!formData.city || !formData.shippingAddress.trim()) {
      setErrorMessage('Please complete all required shipping fields.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      customerName: formData.customerName.trim(),
      customerPhone: phoneClean,
      customerEmail: formData.customerEmail.trim() || undefined,
      shippingAddress: formData.shippingAddress.trim(),
      city: formData.city,
      province: formData.province,
      postalCode: formData.postalCode.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      couponCode: appliedCoupon?.code,
      paymentMethod: formData.paymentMethod,
      items: items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId || null,
        quantity: i.quantity,
      })),
    };

    const res = await fetchApi<any>('/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    setIsSubmitting(false);

    if (res.success && res.data) {
      clearCart();
      showToast('Order placed successfully! Cash on Delivery confirmed.', 'success');
      router.push(`/order-success/${res.data.orderId || res.data.orderNumber}`);
    } else {
      setErrorMessage(res.message || 'Failed to place order. Please try again.');
      showToast(res.message || 'Failed to place order.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Checkout Title */}
      <div className="border-b border-zinc-200 pb-4">
        <h1 className="text-3xl font-serif font-black text-zinc-950">Cash on Delivery Checkout</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Complete your delivery details. You will pay in cash when the courier rider delivers your package.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Customer and Shipping Information */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Customer Info */}
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-100 pb-3">
              1. Customer Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. Bilal Ahmed"
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-3 text-xs focus:ring-2 focus:ring-brand-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Mobile Number (For Courier SMS & Call) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  placeholder="03001234567"
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-3 text-xs focus:ring-2 focus:ring-brand-800 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Email Address (Optional for Order Updates)
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                placeholder="name@example.com"
                className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-3 text-xs focus:ring-2 focus:ring-brand-800 focus:outline-none"
              />
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-100 pb-3">
              2. Delivery Address in Pakistan
            </h2>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Street Address / House / Flat No. / Area *
              </label>
              <textarea
                required
                rows={2}
                value={formData.shippingAddress}
                onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                placeholder="e.g. House # 42-B, Street 14, Sector F-8/3"
                className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-3 text-xs focus:ring-2 focus:ring-brand-800 focus:outline-none"
              />
            </div>

            {/* Pakistani Cities & Province Selector */}
            <PakistaniCitySelect
              selectedCity={formData.city}
              selectedProvince={formData.province}
              onCityChange={(city, province) => setFormData({ ...formData, city, province })}
              onProvinceChange={(province) => setFormData({ ...formData, province })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Postal Code (Optional)
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="e.g. 75600"
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-3 text-xs focus:ring-2 focus:ring-brand-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Leave with guard if not home"
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-3 text-xs focus:ring-2 focus:ring-brand-800 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-100 pb-3">
              3. Payment Method
            </h2>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 bg-brand-50/70 border-2 border-brand-800 rounded-2xl cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                  className="w-4 h-4 text-brand-900 mt-0.5 focus:ring-brand-800"
                />
                <div>
                  <div className="flex items-center gap-2 font-bold text-xs text-brand-950">
                    <Banknote className="w-4 h-4 text-emerald-700" />
                    <span>Cash on Delivery (COD)</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded-full">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 mt-1">
                    Pay with physical cash to the delivery rider when receiving your parcel.
                  </p>
                </div>
              </label>

              {/* Extensible Future Methods (Disabled for Phase 1 as required) */}
              <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-2xl text-xs text-zinc-400 flex items-center justify-between">
                <span>Online Card / EasyPaisa / JazzCash</span>
                <span className="text-[10px] font-semibold bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary: Order Items & Submit CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm space-y-5 text-xs">
            <h2 className="text-base font-bold text-zinc-950 border-b border-zinc-100 pb-3">
              Order Review ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h2>

            {/* Items mini list */}
            <div className="max-h-64 overflow-y-auto divide-y divide-zinc-100 pr-1 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                  <div className="relative w-14 h-16 bg-zinc-100 rounded-xl overflow-hidden shrink-0 border border-zinc-200">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="60px"
                      className="object-cover object-center"
                    />
                    <span className="absolute top-1 right-1 bg-zinc-900 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs text-zinc-900 truncate">{item.name}</h4>
                    {item.variantName && (
                      <p className="text-[11px] text-zinc-500 truncate">{item.variantName}</p>
                    )}
                    <span className="font-bold text-xs text-zinc-950 font-sans">
                      {formatPKR(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-3 border-t border-zinc-100 text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900">{formatPKR(subtotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon ({appliedCoupon.code})</span>
                  <span>-{formatPKR(appliedCoupon.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="font-semibold text-zinc-900">
                  {deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : formatPKR(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-zinc-950 pt-3 border-t border-zinc-200">
                <span>Amount to Pay on Delivery</span>
                <span className="text-lg text-brand-900 font-sans">{formatPKR(totalAmount)}</span>
              </div>
            </div>

            {/* Submit Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-brand-900 hover:bg-brand-800 disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-2 transition active:scale-98"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? 'Placing Order...' : 'Confirm Cash on Delivery Order'}</span>
            </button>

            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-zinc-400 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe & Secure • 7 Days Replacement Warranty</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

