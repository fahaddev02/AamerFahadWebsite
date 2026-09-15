'use client';

import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'order' | 'payment';
}

export default function StatusBadge({ status, type = 'order' }: StatusBadgeProps) {
  const getStyles = () => {
    const s = status.toUpperCase();

    if (type === 'payment') {
      if (s === 'PAID') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      if (s === 'PENDING') return 'bg-amber-100 text-amber-800 border-amber-300';
      if (s === 'FAILED') return 'bg-rose-100 text-rose-800 border-rose-300';
      if (s === 'REFUNDED') return 'bg-purple-100 text-purple-800 border-purple-300';
      return 'bg-zinc-100 text-zinc-800 border-zinc-300';
    }

    // Order status
    switch (s) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'PROCESSING':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      case 'SHIPPED':
        return 'bg-cyan-100 text-cyan-900 border-cyan-300';
      case 'OUT_FOR_DELIVERY':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'RETURNED':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      default:
        return 'bg-zinc-100 text-zinc-800 border-zinc-300';
    }
  };

  const formatText = (text: string) => {
    return text.replace(/_/g, ' ');
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${getStyles()}`}
    >
      {formatText(status)}
    </span>
  );
}

