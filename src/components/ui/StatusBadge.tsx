import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStyle = (s: string) => {
    switch (s?.toUpperCase()) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PROCESSING':
      case 'CONFIRMED':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'CANCELLED':
      case 'RETURNED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'PENDING':
      default:
        return 'bg-zinc-100 text-zinc-800 border-zinc-200';
    }
  };

  return (
    <span
      className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getStyle(
        status
      )}`}
    >
      {status?.replace(/_/g, ' ') || 'UNKNOWN'}
    </span>
  );
}

