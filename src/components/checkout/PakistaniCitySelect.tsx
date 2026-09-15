'use client';

import React from 'react';
import { PAKISTANI_CITIES, PAKISTANI_PROVINCES } from '../../lib/pakistan-cities';

interface PakistaniCitySelectProps {
  selectedCity: string;
  selectedProvince: string;
  onCityChange: (city: string, province: string) => void;
  onProvinceChange: (province: string) => void;
}

export default function PakistaniCitySelect({
  selectedCity,
  selectedProvince,
  onCityChange,
  onProvinceChange,
}: PakistaniCitySelectProps) {
  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    const found = PAKISTANI_CITIES.find((c) => c.name === cityName);
    if (found) {
      onCityChange(found.name, found.province);
    } else {
      onCityChange(cityName, selectedProvince);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* City dropdown */}
      <div>
        <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
          City in Pakistan *
        </label>
        <select
          value={selectedCity}
          onChange={handleCitySelect}
          required
          className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-3 text-xs font-medium text-zinc-800 focus:ring-2 focus:ring-brand-800 focus:outline-none transition shadow-sm"
        >
          <option value="">Select your city...</option>
          {PAKISTANI_CITIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name} ({c.province})
            </option>
          ))}
        </select>
      </div>

      {/* Province dropdown */}
      <div>
        <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
          Province / Region *
        </label>
        <select
          value={selectedProvince}
          onChange={(e) => onProvinceChange(e.target.value)}
          required
          className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-3 text-xs font-medium text-zinc-800 focus:ring-2 focus:ring-brand-800 focus:outline-none transition shadow-sm"
        >
          <option value="">Select province...</option>
          {PAKISTANI_PROVINCES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

