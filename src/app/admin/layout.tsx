import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  LayoutDashboard,
  Package,
  Layers,
  ClipboardList,
  PlusCircle,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';

export const metadata = {
  title: 'Fresh Basket Admin Portal',
  description: 'Manage products, prices, orders, and delivery zones for Fresh Basket Bengaluru.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-800">
      {/* Sidebar for Desktop */}
      <aside className="w-full md:w-64 bg-[#14532D] text-white shrink-0 flex flex-col justify-between p-4 md:min-h-screen">
        <div className="space-y-6">
          {/* Brand */}
          <div className="flex items-center justify-between pb-4 border-b border-emerald-800/80">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#218838] flex items-center justify-center text-white font-black text-sm">
                FB
              </div>
              <div>
                <span className="font-black text-base text-white tracking-tight">FRESH BASKET</span>
                <span className="block text-[10px] text-emerald-300 font-semibold uppercase">Admin Portal</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-semibold">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-emerald-100 hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-[#FFC928]" />
              <span>Dashboard Overview</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-emerald-100 hover:text-white transition-colors"
            >
              <Package className="w-4 h-4 text-[#FFC928]" />
              <span>Products & Prices</span>
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-emerald-100 hover:text-white transition-colors"
            >
              <Layers className="w-4 h-4 text-[#FFC928]" />
              <span>Categories</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-emerald-100 hover:text-white transition-colors"
            >
              <ClipboardList className="w-4 h-4 text-[#FFC928]" />
              <span>Incoming Orders</span>
            </Link>

            <Link
              href="/admin/new-order"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-emerald-100 hover:text-white transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-[#FFC928]" />
              <span>Manual Order Entry</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-emerald-100 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4 text-[#FFC928]" />
              <span>Delivery & Settings</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-emerald-800/80 space-y-2 text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-200 transition-colors"
          >
            <span>View Public Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Admin Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
