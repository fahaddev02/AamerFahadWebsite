import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Truck, Sparkles, Award, Heart, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About Us | Aamer Fahad Pakistan',
  description: 'Learn about Aamer Fahad - Pakistan’s premier destination for luxury handbags, backpacks, laptop bags, and genuine leather goods.',
};

export default function AboutPage() {
  return (
    <div className="space-y-16 md:space-y-24 py-10 md:py-16">
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-900 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Heritage & Craftsmanship</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-zinc-950 tracking-tight">
            Crafted for Distinction, Built for Everyday Life
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            Welcome to <strong>Aamer Fahad</strong>, where contemporary aesthetics meet uncompromising Pakistani craftsmanship. We design luxury handbags, executive laptop bags, durable backpacks, and genuine leather wallets for discerning individuals across Pakistan.
          </p>
        </div>
      </section>

      {/* 2. Brand Story Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-zinc-950 text-white grid grid-cols-1 lg:grid-cols-2">
          <div className="p-8 sm:p-14 flex flex-col justify-center space-y-6">
            <span className="text-xs uppercase tracking-widest text-gold-400 font-bold">Our Philosophy</span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black leading-tight">
              Redefining Modern Pakistani Elegance
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Founded with the vision to make high-end leather accessories and travel essentials accessible across Pakistan, Aamer Fahad merges international runway trends with meticulous local durability standards.
            </p>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Every seam, zipper, lining, and buckle is rigorously tested to ensure our products withstand daily commutes from Karachi’s bustling business avenues to Islamabad’s corporate towers.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-800 hover:bg-brand-700 text-white text-xs uppercase tracking-wider font-bold rounded-2xl shadow-lg transition"
              >
                <span>Explore the Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative min-h-[320px] lg:min-h-full">
            <Image
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80"
              alt="Aamer Fahad Luxury Leather Bag"
              fill
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* 3. Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-zinc-950">Why Choose Aamer Fahad</h2>
          <p className="text-xs sm:text-sm text-zinc-600">The standards that guide everything we create</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-zinc-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-900 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Uncompromising Materials</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              We select full-grain cowhide leather and high-density vegan alternatives with water-resistant coatings for lasting longevity.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-zinc-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-900 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Nationwide Cash on Delivery</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Enjoy reliable courier delivery across 200+ cities in Pakistan with safe, inspection-friendly Cash on Delivery (COD).
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-zinc-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-900 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Customer First Guarantee</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              From our dedicated WhatsApp support (+92 331 9235315) to our 7-day exchange policy, your satisfaction is our priority.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
