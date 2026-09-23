'use client';

import React from 'react';
import Link from 'next/link';
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Instagram,
  Facebook,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-300 pt-16 pb-24 md:pb-12 border-t border-zinc-800">
      {/* 1. Trust Badges Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-zinc-800/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-900/60 border border-brand-700/40 rounded-2xl text-gold-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Cash on Delivery</h4>
              <p className="text-xs text-zinc-400 mt-1">Order now & pay when your parcel arrives at your doorstep.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-900/60 border border-brand-700/40 rounded-2xl text-gold-400 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">7-Day Easy Returns</h4>
              <p className="text-xs text-zinc-400 mt-1">Hassle-free return & replacement policy for peace of mind.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-900/60 border border-brand-700/40 rounded-2xl text-gold-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Premium Quality</h4>
              <p className="text-xs text-zinc-400 mt-1">High-grade materials with durable stitching & hardware.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-900/60 border border-brand-700/40 rounded-2xl text-gold-400 shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">WhatsApp Support</h4>
              <p className="text-xs text-zinc-400 mt-1">Direct support available 7 days a week for all inquiries.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="inline-block space-y-1">
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo.png`}
              alt="Aamer Fahad Logo"
              className="h-16 md:h-20 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
            Aamer Fahad is a premium Pakistani brand delivering handcrafted leather accessories, luxury handbags, executive laptop bags, backpacks, and minimalist wallets designed for elegance, durability, and function.
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-brand-800 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white transition"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-brand-800 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white transition"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/923319235315"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-brand-800 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white transition"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest">Shop Categories</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/category/handbags" className="text-zinc-400 hover:text-white transition">Luxury Handbags</Link></li>
            <li><Link href="/category/backpacks" className="text-zinc-400 hover:text-white transition">Everyday Backpacks</Link></li>
            <li><Link href="/category/laptop-bags" className="text-zinc-400 hover:text-white transition">Executive Laptop Bags</Link></li>
            <li><Link href="/category/wallets" className="text-zinc-400 hover:text-white transition">Genuine Leather Wallets</Link></li>
            <li><Link href="/category/purses" className="text-zinc-400 hover:text-white transition">Clutches & Purses</Link></li>
            <li><Link href="/category/accessories" className="text-zinc-400 hover:text-white transition">Travel Accessories</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest">Customer Care</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/shop" className="text-zinc-400 hover:text-white transition">All Products</Link></li>
            <li><Link href="/about" className="text-zinc-400 hover:text-white transition">About Aamer Fahad</Link></li>
            <li><Link href="/cart" className="text-zinc-400 hover:text-white transition">View Shopping Cart</Link></li>
            <li><Link href="/wishlist" className="text-zinc-400 hover:text-white transition">My Wishlist</Link></li>
            <li><Link href="/account" className="text-zinc-400 hover:text-white transition">Track Order</Link></li>
            <li><span className="text-zinc-500">Shipping across 200+ Cities</span></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest">Get In Touch</h4>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-gold-400 shrink-0" />
              <span>+92 331 9235315</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-gold-400 shrink-0" />
              <span>support@aamerfahad.pk</span>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Karachi, Lahore & Islamabad, Pakistan</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Bottom Copyright & Payment Methods */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} Aamer Fahad. All Rights Reserved.</p>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-[11px] font-semibold text-zinc-400">
            Cash On Delivery (COD)
          </span>
          <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-[11px] font-semibold text-zinc-400">
            Bank Transfer
          </span>
          <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-[11px] font-semibold text-zinc-400">
            EasyPaisa / JazzCash
          </span>
        </div>
      </div>
    </footer>
  );
}

