'use client';

import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquarePlus, X } from 'lucide-react';
import { Review } from '../../types/index';
import { formatDate } from '../../lib/formatters';
import { useToast } from '../../context/ToastContext';
import { fetchApi } from '../../lib/api';

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
  rating?: number;
  reviewCount?: number;
  onReviewAdded?: () => void;
}

export default function ReviewSection({
  productId,
  reviews = [],
  rating = 5.0,
  reviewCount = 0,
  onReviewAdded,
}: ReviewSectionProps) {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    authorName: '',
    rating: 5,
    title: '',
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.authorName.trim() || !formData.comment.trim()) {
      showToast('Please fill in your name and review details.', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await fetchApi('/reviews', {
      method: 'POST',
      body: JSON.stringify({
        productId,
        ...formData,
      }),
    });

    setIsSubmitting(false);

    if (res.success) {
      showToast('Thank you! Your review has been published.', 'success');
      setIsModalOpen(false);
      setFormData({ authorName: '', rating: 5, title: '', comment: '' });
      if (onReviewAdded) onReviewAdded();
    } else {
      showToast(res.message || 'Failed to submit review.', 'error');
    }
  };

  return (
    <div className="space-y-8 pt-8 border-t border-zinc-200">
      {/* Header & Rating Breakdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-zinc-50 p-6 rounded-3xl border border-zinc-200/80">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-black text-zinc-950 font-sans">
            {rating}
          </div>
          <div>
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-zinc-500 mt-1">Based on {reviewCount || reviews.length} customer reviews</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold rounded-2xl shadow-md transition"
        >
          <MessageSquarePlus className="w-4 h-4" /> Write a Review
        </button>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-10 text-zinc-500 text-sm">
          No reviews yet. Be the first to share your experience with this product!
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-zinc-900">{rev.authorName}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" /> Verified Buyer
                  </span>
                </div>
                <span className="text-xs text-zinc-400">{formatDate(rev.createdAt)}</span>
              </div>

              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'
                    }`}
                  />
                ))}
              </div>

              {rev.title && <h5 className="font-semibold text-xs text-zinc-900">{rev.title}</h5>}
              <p className="text-xs text-zinc-600 leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Write Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h4 className="text-base font-bold text-zinc-900">Write Customer Review</h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Your Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: s })}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          s <= formData.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  placeholder="e.g. Fatima Ali"
                  className="w-full p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-800 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Review Headline</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Great quality and fast delivery in Karachi"
                  className="w-full p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-800 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Your Feedback *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Share details about the leather feel, build quality, stitching, and packaging..."
                  className="w-full p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-800 focus:outline-none text-xs"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-brand-900 hover:bg-brand-800 text-white font-semibold rounded-xl shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

