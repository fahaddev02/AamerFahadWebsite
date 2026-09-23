'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const router = useRouter();
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAdmin, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const categoriesNav = [
    { name: 'Shop All', href: '/shop' },
    { name: 'Handbags', href: '/category/handbags' },
    { name: 'Backpacks', href: '/category/backpacks' },
    { name: 'Laptop Bags', href: '/category/laptop-bags' },
    { name: 'Wallets', href: '/category/wallets' },
    { name: 'Clutches & Purses', href: '/category/purses' },
    { name: 'Accessories', href: '/category/accessories' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Row: Search (Left) - Brand Logo (Center) - Actions (Right) */}
        <div className="flex items-center justify-between h-20 sm:h-24">
          {/* Mobile Menu & Search Buttons */}
          <div className="flex items-center lg:hidden gap-1">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 -ml-2 text-zinc-800 hover:text-brand-900 rounded-xl focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 text-zinc-800 hover:text-brand-900 rounded-xl sm:hidden"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Left: Spacious Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search luxury bags, wallets..."
                className="w-full bg-zinc-50 hover:bg-zinc-100/80 focus:bg-white text-xs pl-9 pr-4 py-2.5 rounded-full border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-800/20 focus:border-brand-800 transition placeholder:text-zinc-400"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
            </form>
          </div>

          {/* Center: Prominent Brand Logo */}
          <div className="flex flex-col items-center justify-center text-center px-4">
            <Link href="/" className="group flex flex-col items-center">
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo.png`}
                alt="Aamer Fahad Logo"
                className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition duration-300"
              />
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] font-semibold text-zinc-400 mt-1 group-hover:text-brand-600 transition">
                Lifestyle • Pakistan
              </span>
            </Link>
          </div>

          {/* Desktop Right: Actions (Wishlist, Cart, Account) */}
          <div className="flex items-center justify-end flex-1 max-w-xs gap-3 sm:gap-5">
            {/* Tablet Search Bar */}
            <div className="hidden sm:flex lg:hidden items-center">
              <form onSubmit={handleSearchSubmit} className="relative w-44">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-zinc-50 text-xs pl-8 pr-3 py-2 rounded-full border border-zinc-200 focus:outline-none"
                />
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
              </form>
            </div>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="p-2.5 text-zinc-700 hover:text-brand-800 hover:bg-zinc-50 rounded-full transition relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 text-zinc-700 hover:text-brand-800 hover:bg-zinc-50 rounded-full transition relative cursor-pointer"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-brand-800 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Account Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 text-zinc-700 hover:text-brand-800 hover:bg-zinc-50 rounded-full transition text-xs font-semibold cursor-pointer border border-transparent hover:border-zinc-200"
                aria-label="Account"
              >
                <div className="w-7 h-7 rounded-full bg-brand-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user ? user.name[0].toUpperCase() : <UserIcon className="w-4 h-4 text-white" />}
                </div>
                <span className="hidden md:inline max-w-[85px] truncate">
                  {user ? user.name.split(' ')[0] : 'Account'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden sm:inline" />
              </button>

              {/* Dropdown Menu */}
              {isUserDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-zinc-200 py-2 z-40 text-xs animate-fade-in divide-y divide-zinc-100">
                    {user ? (
                      <>
                        <div className="px-4 py-3">
                          <p className="font-bold text-zinc-900 truncate">{user.name}</p>
                          <p className="text-zinc-400 truncate text-[11px]">{user.email}</p>
                          <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-brand-50 text-brand-800 text-[10px] font-bold rounded-full uppercase">
                            {user.role}
                          </span>
                        </div>
                        {isAdmin && (
                          <div className="py-1">
                            <a
                              href={process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001'}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-brand-800 hover:bg-brand-50 font-bold transition"
                            >
                              <ShieldCheck className="w-4 h-4" /> Admin Portal ↗
                            </a>
                          </div>
                        )}
                        <div className="py-1">
                          <Link
                            href="/account"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-zinc-700 hover:bg-zinc-50 font-medium transition"
                          >
                            <UserIcon className="w-4 h-4 text-zinc-400" /> My Orders & Profile
                          </Link>
                        </div>
                        <div className="pt-1">
                          <button
                            onClick={() => {
                              logout();
                              setIsUserDropdownOpen(false);
                            }}
                            className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-rose-600 hover:bg-rose-50 font-semibold transition"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-3">
                          <p className="font-bold text-zinc-900">Welcome to Aamer Fahad</p>
                          <p className="text-zinc-500 text-[11px]">Sign in to track your orders & wishlist.</p>
                        </div>
                        <div className="p-3 space-y-2">
                          <Link
                            href="/account/login"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="block w-full py-2.5 text-center bg-brand-900 hover:bg-brand-800 text-white font-bold rounded-xl shadow-xs transition"
                          >
                            Sign In
                          </Link>
                          <Link
                            href="/account/register"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="block w-full py-2 text-center bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold rounded-xl transition"
                          >
                            Create Account
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tier 2: Category Navigation Bar (Spacious Desktop Menu) */}
        <nav className="hidden lg:flex items-center justify-center gap-10 xl:gap-14 py-3 border-t border-zinc-100">
          {categoriesNav.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xs uppercase tracking-[0.18em] font-semibold text-zinc-700 hover:text-brand-900 transition-colors py-1 relative group"
            >
              <span>{link.name}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-800 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Mobile Search Bar (Expandable) */}
        {isSearchOpen && (
          <div className="sm:hidden py-3 border-t border-zinc-100 animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bags, wallets, accessories..."
                className="w-full bg-zinc-100 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-800"
                autoFocus
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex flex-col w-full max-w-xs bg-white h-full shadow-2xl p-6 z-10 animate-fade-in overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
              <span className="text-xl font-serif font-black tracking-widest text-zinc-950">
                AAMER FAHAD
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="mt-6 flex flex-col space-y-3">
              {categoriesNav.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-semibold text-zinc-800 hover:text-brand-800 py-2.5 border-b border-zinc-100 flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <span className="text-zinc-400 text-xs">→</span>
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-zinc-200 space-y-3">
              {isAdmin && (
                <a
                  href={process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-bold text-brand-800 bg-brand-50 p-3 rounded-xl"
                >
                  <ShieldCheck className="w-5 h-5" /> Admin Control Panel ↗
                </a>
              )}
              {user ? (
                <div className="space-y-2">
                  <div className="p-3 bg-zinc-50 rounded-xl">
                    <p className="font-bold text-sm text-zinc-900">{user.name}</p>
                    <p className="text-xs text-zinc-500">{user.email}</p>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center py-2.5 text-sm bg-zinc-100 hover:bg-zinc-200 font-semibold rounded-xl text-zinc-800"
                  >
                    My Orders & Account
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-center py-2 text-sm text-rose-600 font-semibold cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/account/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2.5 text-center text-sm font-bold bg-brand-900 text-white rounded-xl shadow-xs"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/account/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2.5 text-center text-sm font-semibold bg-zinc-100 text-zinc-800 rounded-xl"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
