import React from 'react';
import Link from 'next/link';
import {
  Package,
  ClipboardList,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight,
  PlusCircle,
  Settings,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  ExternalLink,
} from 'lucide-react';
import { getDashboardStats } from '@/lib/store';

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Real-time business performance, incoming orders, and catalogue status in Bengaluru.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/new-order"
            className="inline-flex items-center gap-2 bg-[#FFC928] hover:bg-[#e5b320] text-[#14532D] px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Manual Order</span>
          </Link>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 bg-[#218838] hover:bg-[#1a6f2d] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>Manage Products</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#218838] flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900">
            ₹{stats.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-gray-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#218838]" /> From confirmed customer orders
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900">
            {stats.totalOrders}
          </div>
          <div className="text-[11px] text-gray-500">
            Across Bengaluru delivery zones
          </div>
        </div>

        {/* Pending Confirmation */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Pending Actions
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">
            {stats.pendingOrders}
          </div>
          <div className="text-[11px] text-gray-500">
            Orders awaiting harvest confirmation
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Live Catalogue
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900">
            {stats.activeProducts} <span className="text-xs font-normal text-gray-400">/ {stats.totalProducts}</span>
          </div>
          <div className="text-[11px] text-gray-500">
            In-stock vegetables, fruits & baskets
          </div>
        </div>
      </div>

      {/* Free Hosting & Zero Cost Health Status Banner */}
      <div className="bg-emerald-50 rounded-2xl border border-emerald-200/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#218838] text-white rounded-xl shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#14532D]">
              ₹0 Monthly Software Cost Architecture Active
            </h4>
            <p className="text-xs text-emerald-800/90 mt-0.5 leading-relaxed">
              Operating on Vercel Free Hobby Tier and Supabase Free PostgreSQL Tier. No credit card required. WhatsApp messaging operates via native free click-to-chat links.
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <span className="bg-emerald-200/80 text-[#14532D] text-xs font-bold px-3 py-1 rounded-full">
            Free Plan Usage: &lt;1% Quota
          </span>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-lg text-gray-900">Recent Customer Orders</h3>
            <p className="text-xs text-gray-500">
              Latest incoming orders placed via web and WhatsApp
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[#218838] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-xs">
            No orders placed yet. Orders will appear here as soon as customers checkout.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] tracking-wider border-y border-gray-200">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Area & PIN</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80">
                    <td className="py-3 px-4 font-bold text-gray-900">
                      #{order.order_number}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-800">{order.customer_name}</div>
                      <div className="text-gray-400 text-[11px]">{order.customer_phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-800">{order.neighbourhood}</div>
                      <div className="text-gray-400 text-[11px]">PIN {order.pincode}</div>
                    </td>
                    <td className="py-3 px-4 font-black text-[#14532D]">
                      ₹{order.total_amount}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                        order.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'Delivered'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-700">{order.payment_method}</div>
                      <div className="text-[11px] text-gray-400">{order.payment_status}</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/orders`}
                        className="text-[#218838] font-bold hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
