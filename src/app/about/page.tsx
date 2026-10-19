import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, ShieldCheck, Truck, Users, Leaf, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About Us | Fresh Basket Bengaluru',
  description: 'Learn about Fresh Basket: authentic farm produce, transparent pricing, and zero cold-storage pre-order delivery in Bengaluru.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <span className="bg-emerald-100 text-[#14532D] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
          Our Story & Philosophy
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
          Fresh Produce. Honest Prices. Delivered with Care.
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          How a Bengaluru startup set out to fix produce freshness by eliminating cold warehouses and middlemen markups.
        </p>
      </div>

      {/* Main Philosophy Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm space-y-6 text-sm text-gray-700 leading-relaxed">
        <h2 className="text-xl font-bold text-gray-900">
          The Problem with Traditional Grocery Delivery
        </h2>
        <p>
          Most conventional grocery apps store fresh vegetables and fruits in massive refrigerated warehouses for days. By the time produce reaches your kitchen cutting board, vitamins are depleted, water content has evaporated, and the natural aroma has dulled.
        </p>
        <p>
          Furthermore, high venture-capital delivery costs, expensive marketing campaigns, and heavy app commissions force customers to pay 30% to 50% more than genuine wholesale farm-gate prices.
        </p>

        <div className="p-5 bg-[#F7FAF5] rounded-2xl border border-emerald-100 space-y-2">
          <h3 className="font-bold text-[#14532D] flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#218838]" /> The Fresh Basket Pre-Order Solution
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            We operate on a <strong>pre-order, zero-waste supply chain</strong>. When you place an order before 9:00 PM, we consolidate exact quantities and source them directly at dawn from verified Karnataka farm clusters in Kolar, Hoskote, Malur, and Nilgiris. Produce is sorted, packed into breathable bags, and delivered directly to your doorstep.
          </p>
        </div>

        <h2 className="text-xl font-bold text-gray-900 pt-2">
          Our Core Commitments to Bengaluru Homes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#218838]" /> 1. Honest ₹/kg Pricing
            </h4>
            <p className="text-xs text-gray-600">
              Prices pegged directly to daily wholesale mandi rates. No dynamic surge pricing during rain or peak demand.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#218838]" /> 2. Zero Cold-Storage Holding
            </h4>
            <p className="text-xs text-gray-600">
              We never hold unsold perishable produce in chillers for days. What you receive was harvested within the last 24 hours.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#218838]" /> 3. Doorstep Inspection First
            </h4>
            <p className="text-xs text-gray-600">
              Inspect your greens, tomatoes, and fruits at your door. If anything is unsatisfactory, hand it right back with zero questions.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#218838]" /> 4. ₹0 Software Cost Efficiency
            </h4>
            <p className="text-xs text-gray-600">
              Our website runs on free-tier, energy-efficient modern cloud infrastructure, allowing us to invest in better quality produce instead of server bills.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[#218838] hover:bg-[#1a6f2d] text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-md transition-all hover:scale-105"
        >
          <span>Explore Today&apos;s Fresh Produce</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
