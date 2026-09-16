import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import WhatsAppFloat from '@/components/layout/WhatsAppFloat';
import CartDrawer from '@/components/cart/CartDrawer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Aamer Fahad | Premium Handbags, Backpacks, Laptop Bags & Wallets in Pakistan',
  description:
    'Discover luxury handbags, executive laptop bags, waterproof backpacks, and genuine leather wallets crafted for modern elegance. Cash on Delivery across Pakistan.',
  keywords: [
    'handbags pakistan',
    'leather wallets pakistan',
    'laptop bags karachi',
    'backpacks lahore',
    'cash on delivery bags',
    'aamer fahad',
  ],
  openGraph: {
    title: 'Aamer Fahad | Premium Pakistani E-Commerce',
    description: 'Handcrafted luxury leather goods, bags, and accessories in Pakistan.',
    type: 'website',
    locale: 'en_PK',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex flex-col min-h-screen bg-[#FAF9F6] text-zinc-900 font-sans">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <AnnouncementBar />
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <MobileNav />
                <WhatsAppFloat />
                <CartDrawer />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

