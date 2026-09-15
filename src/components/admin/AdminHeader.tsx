'use client';

import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  title: string;
}

export default function AdminHeader({ onToggleSidebar, title }: AdminHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-100"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-zinc-900">{title}</h1>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-900 text-white flex items-center justify-center font-bold text-xs">
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="font-bold text-zinc-900 leading-tight">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] text-zinc-400">{user?.email || 'admin@aamerfahad.pk'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

