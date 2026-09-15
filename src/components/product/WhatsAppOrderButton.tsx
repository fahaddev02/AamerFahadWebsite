'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { formatPKR } from '../../lib/formatters';

interface WhatsAppOrderButtonProps {
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  variantName?: string | null;
  productSlug: string;
  whatsAppNumber?: string;
}

export default function WhatsAppOrderButton({
  productName,
  sku,
  price,
  quantity,
  variantName,
  productSlug,
  whatsAppNumber = '+923319235315',
}: WhatsAppOrderButtonProps) {
  const handleWhatsAppOrder = () => {
    const cleanPhone = whatsAppNumber.replace(/[^0-9]/g, '');
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://aamerfahad.pk';
    const productUrl = `${origin}/product/${productSlug}`;

    const message = `Assalam-o-Alaikum Aamer Fahad,

I would like to place a Cash on Delivery order for:
*Product:* ${productName}
*SKU:* ${sku}
*Variant:* ${variantName || 'Standard'}
*Quantity:* ${quantity}
*Total Price:* ${formatPKR(price * quantity)}
*Product Link:* ${productUrl}

Please confirm my order.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  return (
    <button
      type="button"
      onClick={handleWhatsAppOrder}
      className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 transition active:scale-98"
    >
      <MessageCircle className="w-5 h-5 fill-white text-white" />
      <span>Order on WhatsApp (Fast COD)</span>
    </button>
  );
}

