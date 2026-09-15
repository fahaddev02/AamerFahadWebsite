'use client';

import React from 'react';
import { ProductVariant } from '../../types/index';
import { formatPKR } from '../../lib/formatters';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: string | null;
  onSelectVariant: (variant: ProductVariant) => void;
}

export default function VariantSelector({
  variants,
  selectedVariantId,
  onSelectVariant,
}: VariantSelectorProps) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900">
        Available Options / Colors:
      </label>
      <div className="flex flex-wrap gap-2.5">
        {variants.map((variant) => {
          const isSelected = selectedVariantId === variant.id;
          const isOutOfStock = variant.stock <= 0;

          return (
            <button
              key={variant.id}
              type="button"
              disabled={isOutOfStock}
              onClick={() => onSelectVariant(variant)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 flex items-center gap-2 ${
                isSelected
                  ? 'border-brand-900 bg-brand-900 text-white shadow-md'
                  : isOutOfStock
                  ? 'border-zinc-200 bg-zinc-100 text-zinc-400 cursor-not-allowed line-through'
                  : 'border-zinc-200 bg-white text-zinc-800 hover:border-brand-700 hover:bg-brand-50/50'
              }`}
            >
              <span>{variant.name}</span>
              {variant.price && (
                <span className={`text-[11px] font-normal ${isSelected ? 'text-zinc-200' : 'text-zinc-500'}`}>
                  ({formatPKR(variant.price)})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

