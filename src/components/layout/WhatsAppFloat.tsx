'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppFloatProps {
  phoneNumber?: string;
}

export default function WhatsAppFloat({ phoneNumber = '+923001234567' }: WhatsAppFloatProps) {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const defaultMessage = encodeURIComponent(
    'Assalam-o-Alaikum! I am visiting Aamer Fahad and have an inquiry regarding your products.'
  );
  const waUrl = `https://wa.me/${cleanPhone}?text=${defaultMessage}`;

  return (
    <aside aria-label="Customer Support" className="fixed bottom-20 md:bottom-8 right-5 z-40 flex items-center group">
      <span className="hidden group-hover:block mr-2.5 px-3 py-1.5 bg-zinc-900 text-white text-xs font-semibold rounded-xl shadow-xl transition-all animate-fade-in pointer-events-none">
        Need help? Chat on WhatsApp
      </span>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="w-13 h-13 p-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95"
      >
        <MessageCircle className="w-7 h-7 fill-white text-white" />
      </a>
    </aside>
  );
}

