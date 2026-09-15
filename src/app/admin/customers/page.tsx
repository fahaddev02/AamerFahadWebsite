'use client';

import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';
import { formatPKR, formatDate } from '../../../lib/formatters';
import { fetchApi } from '../../../lib/api';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi('/admin/customers').then((res) => {
      if (res.success && res.data) {
        setCustomers(res.data);
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-950">Customer Base</h1>
        <p className="text-xs text-zinc-500">Registered users, total spend and order histories.</p>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-zinc-200">
            <thead className="bg-zinc-50 text-zinc-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Contact Details</th>
                <th className="px-6 py-3.5">Joined Date</th>
                <th className="px-6 py-3.5">Total Orders</th>
                <th className="px-6 py-3.5 text-right">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-400">
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-400">
                    No customers registered yet.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-50/80 transition">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-900 text-white font-bold flex items-center justify-center text-xs">
                        {c.name[0].toUpperCase()}
                      </div>
                      <span className="font-bold text-zinc-900">{c.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-zinc-800">{c.email}</p>
                      <p className="text-[11px] font-mono text-zinc-400">{c.phone || 'No phone'}</p>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">{formatDate(c.createdAt)}</td>
                    <td className="px-6 py-4 font-semibold text-zinc-800">{c.totalOrders} orders</td>
                    <td className="px-6 py-4 text-right font-bold text-zinc-950 font-sans">
                      {formatPKR(c.totalSpent)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

