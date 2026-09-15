'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Tag, X, Calendar, Percent, Banknote } from 'lucide-react';
import { Coupon } from '../../../types/index';
import { formatPKR, formatDate } from '../../../lib/formatters';
import { useToast } from '../../../context/ToastContext';
import { fetchApi } from '../../../lib/api';

export default function AdminCouponsPage() {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENTAGE',
    value: '10',
    minOrderAmount: '1500',
    maxDiscount: '1000',
    usageLimit: '100',
    expiresAt: '2027-12-31',
    isActive: true,
  });

  const loadCoupons = async () => {
    setIsLoading(true);
    const res = await fetchApi<Coupon[]>('/admin/coupons');
    if (res.success && res.data) {
      setCoupons(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetchApi('/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    if (res.success) {
      showToast('Coupon created successfully!', 'success');
      setIsModalOpen(false);
      setFormData({
        code: '',
        type: 'PERCENTAGE',
        value: '10',
        minOrderAmount: '1500',
        maxDiscount: '1000',
        usageLimit: '100',
        expiresAt: '2027-12-31',
        isActive: true,
      });
      loadCoupons();
    } else {
      showToast(res.message || 'Failed to create coupon', 'error');
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (confirm(`Delete coupon "${code}"?`)) {
      const res = await fetchApi(`/admin/coupons/${id}`, { method: 'DELETE' });
      if (res.success) {
        showToast('Coupon deleted', 'info');
        loadCoupons();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950">Promotions & Coupons</h1>
          <p className="text-xs text-zinc-500">Create percentage discounts or fixed PKR cash voucher codes.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 text-center py-12 text-zinc-400 text-xs">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-zinc-400 text-xs">No coupons created yet.</div>
        ) : (
          coupons.map((c) => (
            <div
              key={c.id}
              className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4 relative"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-brand-50 border border-brand-200 text-brand-900 font-mono font-bold text-sm rounded-xl">
                  {c.code}
                </span>
                <button
                  onClick={() => handleDelete(c.id, c.code)}
                  className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-2xl font-black text-zinc-950 font-sans">
                  {c.type === 'PERCENTAGE' ? `${c.value}% OFF` : `${formatPKR(c.value)} OFF`}
                </p>
                <p className="text-xs text-zinc-500">
                  {c.minOrderAmount ? `Min. spend: ${formatPKR(c.minOrderAmount)}` : 'No minimum spend'}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                <span>Used: {c.usedCount} times</span>
                <span>Expires: {c.expiresAt ? formatDate(c.expiresAt) : 'Never'}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-base font-bold text-zinc-950">Create Promo Coupon</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. AZADI20"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-mono uppercase font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Discount Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (PKR)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Value *</label>
                  <input
                    type="number"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Min. Order Amount (PKR)</label>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-zinc-100 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand-900 text-white font-bold rounded-xl shadow"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

