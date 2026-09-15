'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Package,
  AlertTriangle,
  Users,
  ArrowRight,
} from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatPKR, formatDate } from '@/lib/formatters';
import { fetchApi } from '@/lib/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi('/admin/dashboard').then((res) => {
      if (res.success && res.data) {
        setStats(res.data);
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-zinc-400 text-xs">Loading analytics...</div>;
  }

  return (
    <div className="space-y-8">
      {/* 1. KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Delivered Sales"
          value={formatPKR(stats?.totalRevenue || 0)}
          subtitle="All confirmed delivered orders"
          icon={DollarSign}
          color="emerald"
        />

        <StatsCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          subtitle="All-time placed orders"
          icon={ShoppingBag}
          color="indigo"
        />

        <StatsCard
          title="Pending COD Orders"
          value={stats?.pendingOrders || 0}
          subtitle="Requires dispatch & confirmation"
          icon={Clock}
          color="amber"
        />

        <StatsCard
          title="Low Stock Alert"
          value={stats?.lowStockProducts || 0}
          subtitle="Products with ≤ 5 units"
          icon={AlertTriangle}
          color="rose"
        />
      </div>

      {/* 2. Quick Actions & Store Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">
              Recent Customer Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-brand-900 hover:underline flex items-center gap-1"
            >
              View All Orders <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-zinc-100">
              <thead>
                <tr className="text-zinc-400 font-semibold uppercase text-[10px]">
                  <th className="py-2.5">Order</th>
                  <th className="py-2.5">Customer</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {stats?.recentOrders?.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-zinc-50/80">
                    <td className="py-3 font-bold text-zinc-900 font-mono">
                      <Link href="/admin/orders" className="hover:text-brand-900">
                        {ord.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3">
                      <p className="font-semibold text-zinc-900">{ord.customerName}</p>
                      <p className="text-[11px] text-zinc-400">{ord.city}</p>
                    </td>
                    <td className="py-3">
                      <StatusBadge status={ord.orderStatus} />
                    </td>
                    <td className="py-3 text-right font-bold text-zinc-950 font-sans">
                      {formatPKR(ord.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Store Summary Metrics */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider pb-3 border-b border-zinc-100">
            Catalog Health
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-2xl">
              <span className="text-zinc-600">Total Products in Store</span>
              <span className="font-bold text-zinc-900 text-sm">{stats?.totalProducts || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-2xl">
              <span className="text-zinc-600">Registered Customers</span>
              <span className="font-bold text-zinc-900 text-sm">{stats?.totalCustomers || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-50 text-emerald-900 rounded-2xl">
              <span>Completed / Delivered</span>
              <span className="font-bold text-sm">{stats?.completedOrders || 0}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/products"
              className="w-full py-3 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs text-center rounded-xl block transition"
            >
              + Manage Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

