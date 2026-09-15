'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, MapPin, Heart, LogOut, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import StatusBadge from '@/components/ui/StatusBadge';
import { Order } from '@/types/index';
import { formatPKR, formatDate } from '@/lib/formatters';
import { fetchApi } from '@/lib/api';

export default function CustomerAccountPage() {
  const router = useRouter();
  const { user, token, logout, isAdmin, isLoading: isAuthLoading } = useAuth();
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001';

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');

  useEffect(() => {
    if (!isAuthLoading && !token) {
      router.push('/account/login');
      return;
    }

    if (token) {
      fetchApi<Order[]>('/customer/orders').then((res) => {
        if (res.success && res.data) {
          setOrders(res.data);
        }
        setIsLoadingOrders(false);
      });
    }
  }, [token, isAuthLoading, router]);

  if (isAuthLoading || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-zinc-400">
        Loading customer dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Account Hero Banner */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-900 text-white flex items-center justify-center font-serif font-black text-2xl shadow-md">
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-950">{user.name}</h1>
            <p className="text-xs text-zinc-400">{user.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-brand-50 text-brand-800 text-[10px] font-bold rounded-full uppercase">
              {user.role} Account
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <a
              href={adminUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-brand-900 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" /> Admin Portal
            </a>
          )}
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-xl flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Grid with Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-zinc-200/80 p-4 shadow-sm space-y-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-3 rounded-2xl flex items-center gap-3 transition ${
              activeTab === 'orders'
                ? 'bg-brand-900 text-white font-bold shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-2xl flex items-center gap-3 transition ${
              activeTab === 'profile'
                ? 'bg-brand-900 text-white font-bold shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>

          <Link
            href="/wishlist"
            className="w-full text-left px-4 py-3 rounded-2xl flex items-center gap-3 text-zinc-600 hover:bg-zinc-100 transition"
          >
            <Heart className="w-4 h-4" />
            <span>My Wishlist ↗</span>
          </Link>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm">
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-zinc-950 border-b border-zinc-100 pb-3">
                Order History & Status
              </h2>

              {isLoadingOrders ? (
                <div className="text-center py-12 text-zinc-400 text-xs">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto text-xl">
                    📦
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900">No Orders Yet</h3>
                  <p className="text-xs text-zinc-500">When you place Cash on Delivery orders, they will appear here.</p>
                  <Link
                    href="/shop"
                    className="inline-block mt-2 px-5 py-2.5 bg-brand-900 text-white font-semibold text-xs rounded-xl"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl border border-zinc-200/80 hover:border-zinc-300 transition space-y-3 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
                        <div>
                          <span className="text-zinc-400 text-[11px] block">Order Number</span>
                          <span className="font-bold text-zinc-900 font-mono">{order.orderNumber}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400 text-[11px] block">Placed On</span>
                          <span className="font-semibold text-zinc-800">{formatDate(order.createdAt)}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400 text-[11px] block">Total Amount</span>
                          <span className="font-bold text-zinc-950 font-sans">{formatPKR(order.totalAmount)}</span>
                        </div>
                        <StatusBadge status={order.orderStatus} />
                      </div>

                      <div className="divide-y divide-zinc-50">
                        {order.items.map((item) => (
                          <div key={item.id} className="py-2 flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-zinc-900">{item.productName}</span>
                              {item.variantName && (
                                <span className="text-zinc-400 text-[11px] ml-2">({item.variantName})</span>
                              )}
                              <span className="text-zinc-500 text-[11px] block">Qty: {item.quantity}</span>
                            </div>
                            <span className="font-semibold text-zinc-900 font-sans">{formatPKR(item.subtotal)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex justify-end">
                        <Link
                          href={`/order-success/${order.id}`}
                          className="text-xs font-bold text-brand-900 hover:underline"
                        >
                          View Full Receipt / Invoice →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-zinc-950 border-b border-zinc-100 pb-3">
                Customer Profile Details
              </h2>
              <div className="max-w-md space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-500 font-medium mb-1">Full Name</label>
                  <p className="font-bold text-zinc-900 text-sm">{user.name}</p>
                </div>
                <div>
                  <label className="block text-zinc-500 font-medium mb-1">Email Address</label>
                  <p className="font-bold text-zinc-900 text-sm">{user.email}</p>
                </div>
                <div>
                  <label className="block text-zinc-500 font-medium mb-1">Phone Number</label>
                  <p className="font-bold text-zinc-900 text-sm">{user.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

