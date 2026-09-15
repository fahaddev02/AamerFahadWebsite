'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, Phone, MessageCircle, Truck, Mail, Globe } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { fetchApi } from '@/lib/api';

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    store_name: 'Zavier Lifestyle',
    store_tagline: 'Pakistan’s Premier Lifestyle & Leather Accessories Brand',
    whatsapp_number: '+923001234567',
    support_phone: '+92 300 1234567',
    support_email: 'support@zavier.pk',
    delivery_fee: '200',
    free_delivery_threshold: '3500',
    announcement_text: '🚚 Flat Delivery Rs. 200 | Free Shipping on orders over Rs. 3,500 | Cash on Delivery All Over Pakistan',
    cod_enabled: 'true',
    instagram_url: 'https://instagram.com/zavierlifestyle.pk',
    facebook_url: 'https://facebook.com/zavierlifestyle.pk',
    tiktok_url: 'https://tiktok.com/@zavierlifestyle',
  });

  useEffect(() => {
    fetchApi<Record<string, string>>('/settings').then((res) => {
      if (res.success && res.data) {
        setSettings((prev) => ({ ...prev, ...res.data }));
      }
      setIsLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const res = await fetchApi('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });

    setIsSaving(false);

    if (res.success) {
      showToast('Store settings updated successfully!', 'success');
    } else {
      showToast(res.message || 'Failed to save settings', 'error');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-zinc-400 text-xs">Loading store configuration...</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-950">Store Settings & Configuration</h1>
        <p className="text-xs text-zinc-500">
          Configure business metadata, WhatsApp numbers, Pakistani delivery charges, and banners.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. General Brand Information */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4 text-xs">
          <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-100 pb-3">
            <Globe className="w-4 h-4 text-brand-800" /> Brand & Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Store Name</label>
              <input
                type="text"
                required
                value={settings.store_name}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Store Tagline</label>
              <input
                type="text"
                value={settings.store_tagline}
                onChange={(e) => setSettings({ ...settings, store_tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1">Top Announcement Bar Text</label>
            <input
              type="text"
              value={settings.announcement_text}
              onChange={(e) => setSettings({ ...settings, announcement_text: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
            />
          </div>
        </div>

        {/* 2. Pakistani Logistics & Delivery Charges */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4 text-xs">
          <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-100 pb-3">
            <Truck className="w-4 h-4 text-brand-800" /> Delivery & Courier Configuration (PKR)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Standard Delivery Fee (PKR)</label>
              <input
                type="number"
                required
                value={settings.delivery_fee}
                onChange={(e) => setSettings({ ...settings, delivery_fee: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono"
              />
              <p className="text-[11px] text-zinc-400 mt-1">Charged on orders below the threshold (e.g. Rs. 200)</p>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Free Delivery Minimum Order (PKR)</label>
              <input
                type="number"
                required
                value={settings.free_delivery_threshold}
                onChange={(e) => setSettings({ ...settings, free_delivery_threshold: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono"
              />
              <p className="text-[11px] text-zinc-400 mt-1">Orders above this amount get Rs. 0 delivery (e.g. Rs. 3,500)</p>
            </div>
          </div>
        </div>

        {/* 3. WhatsApp & Contact Channels */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4 text-xs">
          <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-100 pb-3">
            <MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp Integration & Customer Helpline
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">WhatsApp Order Number</label>
              <input
                type="text"
                required
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono"
              />
              <p className="text-[11px] text-zinc-400 mt-1">Used for 1-click WhatsApp order generation</p>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Helpline Phone</label>
              <input
                type="text"
                value={settings.support_phone}
                onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Official Support Email</label>
              <input
                type="email"
                value={settings.support_email}
                onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* 4. Social Links */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4 text-xs">
          <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider border-b border-zinc-100 pb-3">
            Social Media Handles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Instagram URL</label>
              <input
                type="url"
                value={settings.instagram_url}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Facebook Page URL</label>
              <input
                type="url"
                value={settings.facebook_url}
                onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">TikTok Channel URL</label>
              <input
                type="url"
                value={settings.tiktok_url}
                onChange={(e) => setSettings({ ...settings, tiktok_url: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 bg-brand-900 hover:bg-brand-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Settings...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

