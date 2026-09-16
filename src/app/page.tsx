import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Star,
  ShoppingBag,
  CheckCircle2,
  Tag,
  Flame,
} from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { Product, Category } from '@/types';

// Server-side fetching helper for Next.js SSR
async function getHomeData() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  try {
    const [catRes, featRes, bestRes] = await Promise.all([
      fetch(`${API_URL}/categories`, { next: { revalidate: 60 } }),
      fetch(`${API_URL}/products/featured`, { next: { revalidate: 60 } }),
      fetch(`${API_URL}/products/best-sellers`, { next: { revalidate: 60 } }),
    ]);

    const categories: Category[] = (await catRes.json())?.data || [];
    const featured: Product[] = (await featRes.json())?.data || [];
    const bestSellers: Product[] = (await bestRes.json())?.data || [];

    return { categories, featured, bestSellers };
  } catch (error) {
    console.error('Error in getHomeData:', error);
    return { categories: [], featured: [], bestSellers: [] };
  }
}

export default async function HomePage() {
  const { categories, featured, bestSellers } = await getHomeData();

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      {/* 1. Hero Banner */}
      <section className="relative bg-zinc-950 text-white overflow-hidden py-20 lg:py-32">
        {/* Background ambient lighting */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_right,#1b3d24_0%,transparent_60%)]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_bottom_left,#d4af37_0%,transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-900/80 border border-brand-700/60 text-gold-400 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" /> Pakistan’s Premier Lifestyle Store
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-[1.15] text-white">
                Handcrafted Luxury Bags, Wallets & Accessories.
              </h1>

              <p className="text-base sm:text-lg text-zinc-300 font-normal max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Elevate your everyday wardrobe with our executive laptop bags, structured handbags, and RFID-protected genuine leather wallets.
              </p>

              {/* Action Buttons & Badges */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto px-8 py-4 bg-brand-800 hover:bg-brand-700 text-white text-sm font-bold rounded-2xl shadow-xl shadow-brand-950/50 flex items-center justify-center gap-2 transition duration-200 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" /> Explore Shop
                </Link>
                <Link
                  href="/category/handbags"
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-bold rounded-2xl backdrop-blur-md flex items-center justify-center gap-2 transition duration-200"
                >
                  Luxury Handbags <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Social Proof Stats */}
              <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-center sm:text-left">
                <div>
                  <p className="text-2xl font-black text-white font-sans">10k+</p>
                  <p className="text-[11px] text-zinc-400 font-medium">Happy Customers</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-gold-400 font-sans">100%</p>
                  <p className="text-[11px] text-zinc-400 font-medium">Cash on Delivery</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white font-sans">4.9 ★</p>
                  <p className="text-[11px] text-zinc-400 font-medium">Average Rating</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-zinc-800/60">
                <Image
                  src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80"
                  alt="Aamer Fahad Signature Luxury Handbag"
                  fill
                  priority
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />

                {/* Floating Product Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-zinc-900/90 backdrop-blur-md border border-zinc-700/60 shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400">Featured Pick</span>
                    <p className="text-sm font-bold text-white">Aurelia Classic Handbag</p>
                    <p className="text-xs font-semibold text-emerald-400">Rs. 3,999 (Save 20%)</p>
                  </div>
                  <Link
                    href="/product/aurelia-classic-structured-leather-handbag"
                    className="p-3 bg-brand-800 hover:bg-brand-700 text-white rounded-xl transition"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Badges Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-brand-50 text-brand-800 rounded-2xl shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase">Cash on Delivery</h4>
              <p className="text-[11px] text-zinc-500">Pay upon delivery across Pakistan</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase">Free Shipping</h4>
              <p className="text-[11px] text-zinc-500">On all orders above Rs. 3,500</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase">100% Genuine</h4>
              <p className="text-[11px] text-zinc-500">Quality-inspected craftsmanship</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-purple-50 text-purple-800 rounded-2xl shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase">7-Day Returns</h4>
              <p className="text-[11px] text-zinc-500">Easy replacement guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-zinc-950 mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-brand-900 hover:text-brand-700 flex items-center gap-1.5 transition"
          >
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative bg-white rounded-2xl border border-zinc-200/80 hover:border-brand-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-square bg-zinc-100 overflow-hidden">
                <Image
                  src={cat.image || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80'}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-xs leading-tight drop-shadow-sm">{cat.name}</h3>
                  {cat.productCount !== undefined && (
                    <span className="text-[10px] text-zinc-300 font-medium">
                      {cat.productCount} Products
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-amber-600">
              <Flame className="w-4 h-4 fill-amber-500" /> Customer Favorites
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-zinc-950 mt-1">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/shop?sort=best-selling"
            className="text-xs font-bold text-brand-900 hover:text-brand-700 flex items-center gap-1.5 transition"
          >
            See All Best Sellers <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Promotional Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-brand-950 via-brand-900 to-zinc-950 rounded-3xl p-8 sm:p-12 overflow-hidden text-white shadow-2xl">
          <div className="absolute -right-10 -bottom-10 opacity-10 font-serif text-[120px] sm:text-[160px] font-black pointer-events-none select-none tracking-widest">
            AAMER FAHAD
          </div>

          <div className="relative max-w-2xl space-y-4">
            <span className="px-3 py-1 bg-gold-400 text-zinc-950 text-xs font-bold rounded-lg uppercase tracking-wider">
              Special Discount Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black leading-tight">
              Enjoy 10% Off Your Entire Order
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Use promo coupon <strong className="text-white bg-white/10 px-2 py-1 rounded font-mono">WELCOME10</strong> at checkout. Valid on all Handbags, Laptop Bags, Backpacks and Wallets with free Cash on Delivery!
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="px-6 py-3.5 bg-white text-zinc-950 hover:bg-zinc-100 font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition active:scale-95"
              >
                Claim Discount & Shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
              New Arrivals & Trends
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-zinc-950 mt-1">
              Featured Collection
            </h2>
          </div>
          <Link
            href="/shop?featured=true"
            className="text-xs font-bold text-brand-900 hover:text-brand-700 flex items-center gap-1.5 transition"
          >
            Explore All Featured <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Why Shop With Us Featurette */}
      <section className="bg-zinc-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
              The Aamer Fahad Difference
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-zinc-950">
              Built for Style, Engineered for Durability
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              Every item in our collection undergoes rigorous quality control to ensure long-lasting luxury.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-zinc-200/80 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-900 flex items-center justify-center font-bold text-lg">
                01
              </div>
              <h3 className="text-base font-bold text-zinc-900">Full-Grain & Premium Vegan Leather</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                We handpick heavy-duty fabrics, scratch-resistant coatings, and smooth leather textures that withstand daily commutes in Pakistani weather.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-zinc-200/80 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-900 flex items-center justify-center font-bold text-lg">
                02
              </div>
              <h3 className="text-base font-bold text-zinc-900">Reinforced Stitching & Hardware</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Japanese YKK-grade zippers, double-reinforced stress points, and rust-proof polished metal clasps that never jam or tarnish.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-zinc-200/80 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-900 flex items-center justify-center font-bold text-lg">
                03
              </div>
              <h3 className="text-base font-bold text-zinc-900">Pakistani Currency & ID Fit</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Our wallets and cardholders are specially proportioned to fit Pakistani 5000/1000/500 Rupee notes flat without folding and fit National CNICs securely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Customer Reviews Testimonial Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
            Real Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-zinc-950">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed italic">
              "Ordered the Aurelia Handbag for my wife in Lahore. It arrived in 2 days in a stunning gift box. The leather texture and gold hardware look like an international 30k bag!"
            </p>
            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900">Dr. Hamza Bilal</span>
              <span className="text-[11px] text-zinc-400">Lahore, Punjab</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed italic">
              "The Sovereign RFID Wallet is top notch. Genuine leather smell and PKR 5000 notes fit perfectly without bulging. Cash on delivery was seamless."
            </p>
            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900">Usman Tariq</span>
              <span className="text-[11px] text-zinc-400">Karachi, Sindh</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed italic">
              "Best customer service! I ordered directly on WhatsApp and the parcel arrived in Islamabad within 48 hours. The Vanguard backpack is 100% waterproof."
            </p>
            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900">Ayesha Rehman</span>
              <span className="text-[11px] text-zinc-400">Islamabad, ICT</span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Newsletter & VIP Club */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-900 text-white rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6 shadow-xl">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-gold-400 font-bold">
              Join the Aamer Fahad Circle
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black">
              Get 10% Off Your First Order
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto">
              Subscribe to receive exclusive access to new arrivals, seasonal promotions, and VIP secret sales.
            </p>
          </div>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address..."
              required
              className="flex-1 px-4 py-3.5 rounded-2xl bg-white text-zinc-900 text-xs focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-gold-400 hover:bg-gold-500 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-2xl transition shadow-lg active:scale-95"
            >
              Subscribe
            </button>
          </form>
          <p className="text-[11px] text-zinc-400">We respect your privacy. No spam ever.</p>
        </div>
      </section>
    </div>
  );
}

