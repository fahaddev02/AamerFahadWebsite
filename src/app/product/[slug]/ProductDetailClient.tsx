'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Heart,
  Plus,
  Minus,
  ChevronRight,
  Zap,
} from 'lucide-react';
import ProductGallery from '@/components/product/ProductGallery';
import VariantSelector from '@/components/product/VariantSelector';
import WhatsAppOrderButton from '@/components/product/WhatsAppOrderButton';
import ReviewSection from '@/components/product/ReviewSection';
import ProductCard from '@/components/product/ProductCard';
import { Product, ProductVariant } from '@/types';
import { formatPKR } from '@/lib/formatters';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { fetchApi } from '@/lib/api';
import { getFallbackProduct } from '@/data/fallbackData';

interface ProductDetailClientProps {
  slug: string;
  initialProduct?: Product | null;
}

export default function ProductDetailClient({ slug, initialProduct }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const fallback = initialProduct || getFallbackProduct(slug);
  const [product, setProduct] = useState<Product | null>(fallback);
  const [isLoading, setIsLoading] = useState(!fallback);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    fallback?.variants && fallback.variants.length > 0 ? fallback.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'shipping'>('description');

  const loadProduct = async () => {
    let isMounted = true;
    try {
      const res = await fetchApi<Product>(`/products/${slug}`);
      if (res.success && res.data) {
        setProduct(res.data);
        if (res.data.variants && res.data.variants.length > 0) {
          setSelectedVariant(res.data.variants[0]);
        }
      }
    } catch {
      // Keep fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-[4/5] bg-zinc-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-4 bg-zinc-200 rounded w-1/4" />
            <div className="h-8 bg-zinc-200 rounded w-3/4" />
            <div className="h-6 bg-zinc-200 rounded w-1/3" />
            <div className="h-24 bg-zinc-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-serif font-black text-zinc-900">Product Not Found</h1>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
          The requested luxury item is currently unavailable or may have been updated in our catalogue.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:bg-brand-800 transition"
        >
          <span>Browse All Bags & Accessories</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const currentPrice = selectedVariant?.price || product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - (product.salePrice || currentPrice)) / product.price) * 100)
    : 0;

  const maxStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = maxStock <= 0;
  const inWishlist = isInWishlist(product.id);

  let parsedSpecs: Record<string, string> = {};
  if (product.specifications) {
    try {
      parsedSpecs = JSON.parse(product.specifications);
    } catch {
      parsedSpecs = { Details: product.specifications };
    }
  }

  const handleAddToCart = () => {
    if (isOutOfStock) {
      showToast('This item is currently out of stock.', 'error');
      return;
    }

    const mainImg = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80';
    addItem(
      {
        id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
        productId: product.id,
        variantId: selectedVariant ? selectedVariant.id : null,
        name: product.name,
        variantName: selectedVariant ? selectedVariant.name : null,
        price: currentPrice,
        originalPrice: product.price,
        image: mainImg,
        stock: maxStock,
        slug: product.slug,
      },
      quantity
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
        <Link href="/" className="hover:text-brand-900 transition">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        {product.category && (
          <>
            <Link href={`/category/${product.category.slug}`} className="hover:text-brand-900 transition">
              {product.category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
          </>
        )}
        <span className="text-zinc-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images || []} productName={product.name} />
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-800">
                {product.brand || 'Aamer Fahad Signature'}
              </span>
              <span className="text-xs text-zinc-400 font-mono">SKU: {selectedVariant?.sku || product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-black text-zinc-950 mt-1 leading-snug">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(product.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-zinc-800">{product.rating || '5.0'}</span>
              <span className="text-xs text-zinc-400">({product.reviewCount || product.reviews?.length || 0} reviews)</span>
            </div>
          </div>

          {/* Pricing & Discount Badge */}
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-400 block font-medium">Price (Cash on Delivery)</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-zinc-950 font-sans">
                  {formatPKR(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-zinc-400 line-through">
                    {formatPKR(product.price)}
                  </span>
                )}
              </div>
            </div>

            {hasDiscount && (
              <span className="px-3 py-1.5 bg-rose-600 text-white text-xs font-black rounded-xl uppercase tracking-wider shadow-sm">
                SAVE {discountPercent}%
              </span>
            )}
          </div>

          {/* Short Description */}
          {product.shortDesc && (
            <p className="text-xs text-zinc-600 leading-relaxed">{product.shortDesc}</p>
          )}

          {/* Stock Availability */}
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isOutOfStock ? 'bg-rose-500' : maxStock <= 5 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
              }`}
            />
            <span className="font-semibold text-zinc-800">
              {isOutOfStock
                ? 'Out of Stock'
                : maxStock <= 5
                ? `Low Stock: Only ${maxStock} left in warehouse!`
                : `In Stock (${maxStock} units ready for immediate COD delivery)`}
            </span>
          </div>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <VariantSelector
              variants={product.variants}
              selectedVariantId={selectedVariant?.id || null}
              onSelectVariant={(v) => setSelectedVariant(v)}
            />
          )}

          {/* Quantity Controls */}
          {!isOutOfStock && (
            <div className="flex items-center gap-4 pt-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                Quantity:
              </label>
              <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-zinc-100 text-zinc-700 transition"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-zinc-900 min-w-[36px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                  className="p-2.5 hover:bg-zinc-100 text-zinc-700 transition"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Main Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2 transition active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className="w-full py-4 bg-brand-800 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-2 transition active:scale-98"
              >
                <Zap className="w-4 h-4 text-gold-400" />
                <span>Buy Now (COD)</span>
              </button>
            </div>

            {/* Direct WhatsApp Fast Order Button */}
            <WhatsAppOrderButton
              productName={product.name}
              sku={selectedVariant?.sku || product.sku}
              price={currentPrice}
              quantity={quantity}
              variantName={selectedVariant?.name}
              productSlug={product.slug}
            />

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className="w-full py-3 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-2xl text-xs font-semibold text-zinc-700 flex items-center justify-center gap-2 transition"
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>

          {/* Delivery & Assurance Trust Box */}
          <div className="border-t border-zinc-200 pt-6 grid grid-cols-2 gap-4 text-xs text-zinc-600">
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-brand-800 shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-900 block">Fast Delivery</strong>
                <span>2-4 Business Days across Pakistan</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <RotateCcw className="w-4 h-4 text-brand-800 shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-900 block">7-Day Returns</strong>
                <span>Hassle-free replacement policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Specifications, Shipping Policy */}
      <div className="border-t border-zinc-200 pt-12 space-y-6">
        <div className="flex border-b border-zinc-200 gap-8 text-sm font-bold">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'description'
                ? 'border-brand-900 text-brand-900'
                : 'border-transparent text-zinc-400 hover:text-zinc-700'
            }`}
          >
            Full Description
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'specs'
                ? 'border-brand-900 text-brand-900'
                : 'border-transparent text-zinc-400 hover:text-zinc-700'
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'shipping'
                ? 'border-brand-900 text-brand-900'
                : 'border-transparent text-zinc-400 hover:text-zinc-700'
            }`}
          >
            Delivery & COD Information
          </button>
        </div>

        <div className="text-xs sm:text-sm text-zinc-700 leading-relaxed max-w-4xl">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <p>{product.description}</p>
              {product.tags && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {product.tags.split(',').map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-md text-xs">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
              <table className="w-full text-left text-xs divide-y divide-zinc-200">
                <tbody className="divide-y divide-zinc-100">
                  {Object.entries(parsedSpecs).map(([key, val]) => (
                    <tr key={key} className="hover:bg-zinc-50">
                      <td className="px-5 py-3 font-bold text-zinc-900 w-1/3 bg-zinc-50/50">{key}</td>
                      <td className="px-5 py-3 text-zinc-600">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-3 bg-white p-6 rounded-2xl border border-zinc-200">
              <h4 className="font-bold text-sm text-zinc-900">Pakistan Cash on Delivery (COD) Delivery</h4>
              <p>
                We ship all parcels through premier courier services (TCS, Leopard, Call Courier, PostEx).
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
                <li>Major Cities (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad): <strong>2-3 working days</strong>.</li>
                <li>Other Cities & Rural areas: <strong>3-5 working days</strong>.</li>
                <li>Standard delivery charge is <strong>Rs. 200</strong>. Orders over <strong>Rs. 3,500 enjoy 100% FREE delivery</strong>.</li>
                <li>You only pay the rider upon physical inspection and receipt of your parcel.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <ReviewSection
        productId={product.id}
        reviews={product.reviews || []}
        rating={product.rating}
        reviewCount={product.reviewCount}
        onReviewAdded={loadProduct}
      />

      {/* Related Products Grid */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-zinc-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif font-black text-zinc-950">You May Also Like</h3>
            <Link href="/shop" className="text-xs font-bold text-brand-800 hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {product.relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

