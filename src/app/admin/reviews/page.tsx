'use client';

import React, { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, MessageSquare } from 'lucide-react';
import { formatDate } from '../../../lib/formatters.js';
import { useToast } from '../../../context/ToastContext.js';
import { fetchApi } from '../../../lib/api.js';

export default function AdminReviewsPage() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadReviews = async () => {
    setIsLoading(true);
    const res = await fetchApi<any[]>('/admin/reviews');
    if (res.success && res.data) {
      setReviews(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    const res = await fetchApi(`/admin/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ isApproved: !currentStatus }),
    });

    if (res.success) {
      showToast('Review moderation status updated', 'success');
      loadReviews();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this customer review?')) {
      const res = await fetchApi(`/admin/reviews/${id}`, { method: 'DELETE' });
      if (res.success) {
        showToast('Review deleted', 'info');
        loadReviews();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-950">Customer Reviews Moderation</h1>
        <p className="text-xs text-zinc-500">Approve, hide or remove customer feedback.</p>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-zinc-200">
            <thead className="bg-zinc-50 text-zinc-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Product</th>
                <th className="px-6 py-3.5">Reviewer</th>
                <th className="px-6 py-3.5">Rating & Feedback</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                    Loading reviews...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                    No reviews submitted yet.
                  </td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-50/80 transition">
                    <td className="px-6 py-4 font-bold text-zinc-900">{r.product?.name || '—'}</td>
                    <td className="px-6 py-4 font-semibold text-zinc-800">{r.authorName}</td>
                    <td className="px-6 py-4 max-w-xs space-y-1">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'
                            }`}
                          />
                        ))}
                      </div>
                      {r.title && <p className="font-bold text-zinc-900">{r.title}</p>}
                      <p className="text-zinc-600 line-clamp-2 text-[11px]">{r.comment}</p>
                    </td>
                    <td className="px-6 py-4 text-zinc-500">{formatDate(r.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          r.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.isApproved ? 'Approved' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleApproval(r.id, r.isApproved)}
                        className="p-1.5 text-zinc-600 hover:text-brand-900 rounded-lg hover:bg-zinc-100"
                        title={r.isApproved ? 'Hide Review' : 'Approve Review'}
                      >
                        {r.isApproved ? <X className="w-4 h-4 text-amber-600" /> : <Check className="w-4 h-4 text-emerald-600" />}
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

