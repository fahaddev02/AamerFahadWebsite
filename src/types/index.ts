export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  isActive?: boolean;
  sortOrder?: number;
  productCount?: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  isMain: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku?: string | null;
  price?: number | null;
  stock: number;
  options?: string | null;
}

export interface Review {
  id: string;
  productId: string;
  userId?: string | null;
  authorName: string;
  rating: number;
  title?: string | null;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDesc?: string | null;
  price: number;
  salePrice?: number | null;
  costPrice?: number | null;
  stock: number;
  brand?: string | null;
  tags?: string | null;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival?: boolean;
  isPublished: boolean;
  specifications?: string | null;
  categoryId: string;
  category?: { id?: string; name: string; slug: string };
  images: ProductImage[];
  variants: ProductVariant[];
  reviews?: Review[];
  rating?: number;
  reviewCount?: number;
  relatedProducts?: Product[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string; // unique item key: productId or productId-variantId
  productId: string;
  variantId?: string | null;
  name: string;
  variantName?: string | null;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  stock: number;
  slug: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string | null;
  productName: string;
  variantName?: string | null;
  price: number;
  quantity: number;
  subtotal: number;
  product?: {
    images?: ProductImage[];
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerEmail?: string | null;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  province: string;
  postalCode?: string | null;
  notes?: string | null;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'COD' | 'EASYPAISA' | 'JAZZCASH' | 'BANK_TRANSFER' | 'CARD';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
  couponCode?: string | null;
  items: OrderItem[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: 'CUSTOMER' | 'ADMIN';
  addresses?: any[];
  orders?: Order[];
}

export interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minOrderAmount?: number | null;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  expiresAt?: string | null;
  isActive: boolean;
}

export interface StoreSettings {
  store_name?: string;
  store_tagline?: string;
  whatsapp_number?: string;
  support_phone?: string;
  support_email?: string;
  delivery_fee?: string;
  free_delivery_threshold?: string;
  announcement_text?: string;
  cod_enabled?: string;
  currency_symbol?: string;
  instagram_url?: string;
  facebook_url?: string;
  tiktok_url?: string;
}

