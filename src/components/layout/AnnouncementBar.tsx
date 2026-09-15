'use client';

import React, { useState } from 'react';
import { Truck, Sparkles, X } from 'lucide-react';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-brand-900 text-white text-xs font-medium py-2 px-4 relative z-40 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-center flex items-center justify-center gap-2 tracking-wide">
          <Truck className="w-3.5 h-3.5 text-gold-400 hidden sm:inline" />
          <span>
            <strong className="text-gold-400 font-semibold">Free Delivery</strong> on orders over Rs. 3,500 | 
            <span className="hidden md:inline"> Cash on Delivery Available Across Pakistan 🇵🇰</span>
          </span>
          <span className="hidden lg:inline-flex items-center gap-1 bg-brand-800/80 px-2 py-0.5 rounded-full text-[11px] text-zinc-200 border border-brand-700/50">
            <Sparkles className="w-3 h-3 text-gold-400" /> Use code: <strong className="text-white">WELCOME10</strong> for 10% OFF
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white/60 hover:text-white p-1 rounded transition ml-2"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

