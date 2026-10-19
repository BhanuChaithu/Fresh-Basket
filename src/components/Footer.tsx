'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, MessageCircle, Mail, MapPin, ShieldCheck, Clock, Truck } from 'lucide-react';
import { useDelivery } from '@/context/DeliveryContext';

export default function Footer() {
  const { settings } = useDelivery();
  const whatsappUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
    'Hi Fresh Basket! I would like to enquire about placing a fresh produce order in Bengaluru.'
  )}`;

  return (
    <footer className="bg-[#14532D] text-white pt-14 pb-8 border-t border-emerald-950">
      {/* Value Proposition Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-emerald-800/60">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-800/80 rounded-xl text-[#FFC928]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-white">Daily Farm-to-Door</h4>
              <p className="text-xs text-emerald-100/80 mt-1 leading-relaxed">
                Harvested from Kolar, Hoskote, and Bengaluru outskirts. Zero old warehouse stock.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-800/80 rounded-xl text-[#FFC928]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-white">Honest Transparent Prices</h4>
              <p className="text-xs text-emerald-100/80 mt-1 leading-relaxed">
                Clear ₹/kg and unit rates. No inflated prices, hidden subscription fees, or surge costs.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-800/80 rounded-xl text-[#FFC928]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-white">Pre-Order Freshness</h4>
              <p className="text-xs text-emerald-100/80 mt-1 leading-relaxed">
                Orders placed before 9 PM arrive fresh the next morning in your chosen delivery slot.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-emerald-800/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#218838] to-[#2ecc71] flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black tracking-tight text-white">FRESH</span>
                <span className="text-2xl font-black tracking-tight text-[#FFC928]">BASKET</span>
              </div>
            </Link>

            <p className="text-sm text-emerald-100/90 max-w-sm italic">
              &quot;{settings.slogan}&quot;
            </p>

            <p className="text-xs text-emerald-200/70 leading-relaxed max-w-sm">
              Fresh Basket brings authentic farm produce directly to homes in Bengaluru. We operate on a lean, pre-order supply chain to eliminate food wastage and pass savings directly to our customers.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs text-emerald-100/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FFC928] shrink-0" />
                <span>Serving Selected Neighbourhoods in Bengaluru, Karnataka</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  WhatsApp: {settings.display_phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FFC928] shrink-0" />
                <span>{settings.contact_email}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h5 className="font-bold text-sm text-[#FFC928] uppercase tracking-wider mb-4">
              Categories
            </h5>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              <li>
                <Link href="/shop?category=cat-veg" className="hover:text-white transition-colors">
                  Everyday Vegetables
                </Link>
              </li>
              <li>
                <Link href="/shop?category=cat-fruits" className="hover:text-white transition-colors">
                  Fresh Fruits
                </Link>
              </li>
              <li>
                <Link href="/shop?category=cat-leafy" className="hover:text-white transition-colors">
                  Leafy Greens (Keerai)
                </Link>
              </li>
              <li>
                <Link href="/shop?category=cat-veg-baskets" className="hover:text-white transition-colors">
                  Weekly Veggie Baskets
                </Link>
              </li>
              <li>
                <Link href="/shop?category=cat-fruit-baskets" className="hover:text-white transition-colors">
                  Immunity Fruit Baskets
                </Link>
              </li>
              <li>
                <Link href="/shop?category=cat-microgreens" className="hover:text-white transition-colors">
                  Hydroponic Microgreens
                </Link>
              </li>
              <li>
                <Link href="/shop?category=cat-seasonal" className="hover:text-white transition-colors">
                  Seasonal Produce
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-sm text-[#FFC928] uppercase tracking-wider mb-4">
              Customer Care
            </h5>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Fresh Basket
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  WhatsApp Support
                </a>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-[#FFC928] transition-colors font-medium">
                  Store Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <h5 className="font-bold text-sm text-[#FFC928] uppercase tracking-wider mb-4">
              Policies
            </h5>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              <li>
                <Link href="/delivery-policy" className="hover:text-white transition-colors">
                  Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/cancellation-and-refund-policy" className="hover:text-white transition-colors">
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-emerald-200/60 gap-4">
          <p>© 2026 FRESH BASKET. All rights reserved. Bengaluru, Karnataka, India.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>100% Zero-Cost Lean Architecture</span>
            <span>•</span>
            <span>Direct Sourcing Model</span>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-white">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
