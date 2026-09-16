'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext.js';
import AdminSidebar from '../../components/admin/AdminSidebar.js';
import AdminHeader from '../../components/admin/AdminHeader.js';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAdmin, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user || !isAdmin) {
        router.push('/account/login');
      }
    }
  }, [user, isAdmin, isLoading, router]);

  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs tracking-widest uppercase font-semibold text-zinc-400">
          Verifying Admin Credentials...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title="Store Administration"
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

