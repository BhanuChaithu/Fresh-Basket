'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User, Database, ShieldCheck } from 'lucide-react';

export default function AdminHeader() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState<string>('Admin');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          // If not authenticated, allow viewing login page or redirect
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.authenticated && data.admin) {
          setAdminEmail(data.admin.email);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-[#218838] border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-[#218838] animate-pulse"></span>
          Live Store Management
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-gray-500">
          <Database className="w-3 h-3 text-[#218838]" /> Real-time Price Sync Active
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs font-semibold">
        <div className="flex items-center gap-2 text-gray-700">
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#14532D] flex items-center justify-center font-bold">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="hidden sm:inline">{adminEmail}</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors cursor-pointer text-xs"
          title="Sign out of Admin Dashboard"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}
