'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Truck, MessageCircle, Printer, ArrowRight } from 'lucide-react';
import { Order } from '@/types';
import { formatPKR, formatDate } from '@/lib/formatters';
import { fetchApi } from '@/lib/api';

export default function OrderSuccessClient({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi<Order>(`/orders/${id}`).then((res) => {
      if (res.success && res.data) {
        setOrder(res.data);
      }
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-zinc-400">
        Loading order confirmation...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-black text-zinc-950">Order Found!</h2>
        <p className="text-xs text-zinc-500">Thank you! Your order #{id} has been recorded successfully.</p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-brand-900 text-white text-xs font-bold rounded-xl"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const whatsappMsg = encodeURIComponent(
    `Assalam-o-Alaikum, I want to track my order #${order.orderNumber} placed for ${order.customerName}.`
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8 print:p-0 print:m-0">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-8 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Order Confirmed (Cash on Delivery)
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-zinc-950">
            Thank You, {order.customerName}!
          </h1>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Your order has been placed. Our team will verify your phone number and dispatch your parcel via express courier.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-xl text-xs font-mono font-bold text-zinc-900">
          Order Number: <span className="text-brand-900">{order.orderNumber}</span>
        </div>
      </div>

      {/* 2. Order Details Receipt Card */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm space-y-6 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 gap-2">
          <div>
            <span className="text-zinc-400 block">Order Date</span>
            <span className="font-semibold text-zinc-900">{formatDate(order.createdAt)}</span>
          </div>
          <div>
            <span className="text-zinc-400 block">Estimated Delivery</span>
            <span className="font-semibold text-brand-900 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" /> 2 - 4 Business Days
            </span>
          </div>
          <div>
            <span className="text-zinc-400 block">Payment Method</span>
            <span className="font-semibold text-zinc-900">Cash on Delivery (COD)</span>
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <h3 className="font-bold text-zinc-950 uppercase tracking-wider mb-2">Delivery Address</h3>
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-1 text-zinc-700">
            <p className="font-bold text-zinc-900">{order.customerName}</p>
            <p>{order.shippingAddress}</p>
            <p>{order.city}, {order.province} {order.postalCode && `(${order.postalCode})`}</p>
            <p className="font-mono pt-1 text-zinc-900">Phone: {order.customerPhone}</p>
            {order.notes && <p className="text-zinc-500 italic mt-1">Note: {order.notes}</p>}
          </div>
        </div>

        {/* Ordered Items */}
        <div>
          <h3 className="font-bold text-zinc-950 uppercase tracking-wider mb-3">Items Ordered</h3>
          <div className="divide-y divide-zinc-100">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-zinc-900">{item.productName}</h4>
                  {item.variantName && (
                    <p className="text-[11px] text-zinc-400">{item.variantName}</p>
                  )}
                  <span className="text-zinc-500">Qty: {item.quantity} × {formatPKR(item.price)}</span>
                </div>
                <span className="font-bold text-zinc-900 font-sans">{formatPKR(item.subtotal)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Totals */}
        <div className="pt-4 border-t border-zinc-100 space-y-2 text-zinc-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-medium text-zinc-900">{formatPKR(order.subtotal)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Coupon Discount ({order.couponCode})</span>
              <span>-{formatPKR(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="font-medium text-zinc-900">
              {order.deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : formatPKR(order.deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between text-sm font-bold text-zinc-950 pt-2 border-t border-zinc-200">
            <span>Total Payable to Rider (COD)</span>
            <span className="text-base text-brand-900 font-sans">{formatPKR(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* 3. Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 print:hidden">
        <Link
          href="/shop"
          className="w-full sm:flex-1 py-3.5 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs uppercase tracking-wider text-center rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <a
          href={`https://wa.me/923001234567?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:flex-1 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs text-center rounded-2xl shadow-md transition flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Track on WhatsApp</span>
        </a>

        <button
          onClick={handlePrint}
          className="w-full sm:w-auto p-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-2xl border border-zinc-200 transition"
          aria-label="Print receipt"
        >
          <Printer className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

