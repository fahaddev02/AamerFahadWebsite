'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  color?: 'emerald' | 'amber' | 'rose' | 'indigo' | 'zinc';
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'emerald',
}: StatsCardProps) {
  const colorMap = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    zinc: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex items-start justify-between">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{title}</span>
        <div className="text-2xl font-black text-zinc-950 font-sans tracking-tight">{value}</div>
        {subtitle && <p className="text-xs text-zinc-400">{subtitle}</p>}
        {trend && (
          <span className="inline-block text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
            {trend}
          </span>
        )}
      </div>

      <div className={`p-3 rounded-2xl border ${colorMap[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}

