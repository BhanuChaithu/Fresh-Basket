'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  MapPin,
  Menu,
  X,
  Phone,
  MessageCircle,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useDelivery } from '@/context/DeliveryContext';

export default function Navbar() {
  const router = useRouter();
  const { totalItems, setIsCartOpen } = useCart();
  const { selectedPincode, selectedArea, isServiceable, setIsModalOpen, settings } = useDelivery();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const whatsappUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
    'Hi Fresh Basket team! I have an enquiry about today’s fresh harvests and delivery.'
  )}`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-gray-100">
      {/* Top micro announcement bar */}
      <div className="bg-[#14532D] text-white py-1.5 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#FFC928] text-[#14532D] text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
              Bengaluru
            </span>
            <span className="hidden sm:inline">
              Farm-to-Door Produce • Pre-orders cutoff at 9 PM for Morning Harvest Delivery
            </span>
            <span className="sm:hidden">Farm Fresh Vegetables & Fruits</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline-flex items-center gap-1 text-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-[#FFC928]" />{' '}
              {settings.free_delivery_threshold === 0
                ? 'FREE Delivery Across Bengaluru!'
                : `Free Delivery over ₹${settings.free_delivery_threshold}`}
            </span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#FFC928] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span className="font-semibold">WhatsApp Order</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-2 md:gap-6">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#218838] to-[#2ecc71] flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#14532D]">
                  FRESH
                </span>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#218838]">
                  BASKET
                </span>
                <span className="w-2 h-2 rounded-full bg-[#FFC928]"></span>
              </div>
              <p className="text-[10px] text-gray-500 font-medium tracking-tight -mt-1 hidden sm:block">
                Honest Prices • Bengaluru
              </p>
            </div>
          </Link>

          {/* Location Selector (Bengaluru PIN) */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200/70 text-left transition-colors cursor-pointer"
            title="Change Bengaluru Delivery PIN"
          >
            <div className={`p-1.5 rounded-full ${isServiceable ? 'bg-emerald-100 text-[#218838]' : 'bg-amber-100 text-amber-700'}`}>
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs">
              <div className="text-gray-400 text-[10px] uppercase font-semibold">Deliver to</div>
              <div className="font-semibold text-gray-800 flex items-center gap-1 truncate max-w-[140px]">
                {selectedArea ? selectedArea.area_name.split('/')[0] : `PIN ${selectedPincode}`}
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          </button>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md relative items-center"
          >
            <input
              type="text"
              placeholder="Search farm fresh tomatoes, apples, spinach, baskets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:bg-white focus:outline-none focus:border-[#218838] focus:ring-2 focus:ring-[#218838]/10 transition-all text-gray-800 placeholder:text-gray-400"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
            {searchQuery && (
              <button
                type="submit"
                className="absolute right-1.5 bg-[#218838] hover:bg-[#1a6f2d] text-white text-xs px-3 py-1 rounded-full font-medium transition-colors"
              >
                Search
              </button>
            )}
          </form>

          {/* Navigation Links & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden xl:flex items-center gap-6 text-sm font-semibold text-gray-700">
              <Link href="/shop" className="hover:text-[#218838] transition-colors">
                All Produce
              </Link>
              <Link href="/shop?category=cat-veg-baskets" className="hover:text-[#218838] transition-colors">
                Veg Baskets
              </Link>
              <Link href="/shop?category=cat-fruit-baskets" className="hover:text-[#218838] transition-colors">
                Fruit Baskets
              </Link>
              <Link href="/track-order" className="hover:text-[#218838] transition-colors">
                Track Order
              </Link>
            </nav>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 bg-[#218838] hover:bg-[#1a6f2d] text-white px-3.5 py-2 rounded-xl font-bold shadow-md shadow-emerald-700/15 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-white" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FFC928] text-[#14532D] text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-sm hidden sm:inline">My Basket</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search vegetables, fruits, baskets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#218838]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
          </form>
          {/* Mobile Location Quick Bar */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-xs">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 text-gray-700 font-medium"
            >
              <MapPin className="w-3.5 h-3.5 text-[#218838]" />
              <span>Bengaluru PIN: <strong>{selectedPincode}</strong></span>
              <span className="text-[#218838] underline text-[11px] font-semibold">Change</span>
            </button>
            <Link href="/track-order" className="text-gray-500 hover:text-gray-800 text-[11px]">
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-gray-50 rounded-lg hover:bg-emerald-50 hover:text-[#218838]"
            >
              🥬 All Produce
            </Link>
            <Link
              href="/shop?category=cat-veg-baskets"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-gray-50 rounded-lg hover:bg-emerald-50 hover:text-[#218838]"
            >
              🧺 Veg Baskets
            </Link>
            <Link
              href="/shop?category=cat-fruit-baskets"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-gray-50 rounded-lg hover:bg-emerald-50 hover:text-[#218838]"
            >
              🍎 Fruit Baskets
            </Link>
            <Link
              href="/shop?category=cat-leafy"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-gray-50 rounded-lg hover:bg-emerald-50 hover:text-[#218838]"
            >
              🌱 Leafy Greens
            </Link>
            <Link
              href="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-gray-50 rounded-lg hover:bg-emerald-50 hover:text-[#218838]"
            >
              📦 Track My Order
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-gray-50 rounded-lg hover:bg-emerald-50 hover:text-[#218838]"
            >
              ℹ️ About Fresh Basket
            </Link>
          </div>

          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-xl font-bold text-sm shadow-xs"
            >
              <MessageCircle className="w-4 h-4" /> Order Directly on WhatsApp
            </a>
            <div className="flex justify-between items-center text-xs text-gray-500 pt-1">
              <span>Bengaluru Support: {settings.display_phone}</span>
              <Link href="/admin/login" className="text-gray-400 hover:text-gray-600">
                Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
