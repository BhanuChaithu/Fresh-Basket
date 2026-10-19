'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Package,
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { Order } from '@/lib/types';
import OrderStatusTimeline from '@/components/OrderStatusTimeline';
import { useDelivery } from '@/context/DeliveryContext';

export default function TrackOrderPage() {
  const { settings } = useDelivery();
  const [tab, setTab] = useState<'number' | 'token'>('number');
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setOrder(null);

    const payload: { order_number?: string; phone?: string; token?: string } = {};

    if (tab === 'number') {
      if (!orderNumber.trim()) {
        setErrorMsg('Please enter your Order Reference Number.');
        return;
      }
      if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
        setErrorMsg('Please enter your 10-digit mobile number for secure verification.');
        return;
      }
      payload.order_number = orderNumber.trim();
      payload.phone = phone.replace(/\D/g, '');
    } else {
      if (!token.trim()) {
        setErrorMsg('Please enter your secure order lookup token.');
        return;
      }
      payload.token = token.trim();
    }

    setLoading(true);

    try {
      const res = await fetch('/api/orders/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'No matching order found. Please check your details.');
        return;
      }

      setOrder(data.order);
    } catch {
      setLoading(false);
      setErrorMsg('Failed to look up order. Please try again.');
    }
  };

  const whatsappPhone = settings.whatsapp_number.replace(/\D/g, '') || '919876543210';
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hi Fresh Basket! I would like to check on my order ${orderNumber || 'status'}.`
  )}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="bg-emerald-100 text-[#14532D] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
          Order Verification & Status
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Track Your Fresh Produce Order
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Enter your Order Number and Mobile Number to safely verify and track your live harvest status.
        </p>
      </div>

      {/* Lookup Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm max-w-xl mx-auto space-y-6">
        {/* Tab switch */}
        <div className="flex bg-gray-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => {
              setTab('number');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
              tab === 'number'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Order Number + Mobile
          </button>
          <button
            onClick={() => {
              setTab('token');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
              tab === 'token'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Tracking Token
          </button>
        </div>

        <form onSubmit={handleLookup} className="space-y-4">
          {tab === 'number' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Order Number
                </label>
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. FB-2026-101"
                  className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Registered Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-xs font-bold bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-600">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="flex-1 px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-r-xl focus:bg-white focus:outline-none focus:border-[#218838]"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Order Tracking Token
              </label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="e.g. tok_fb_demo_hsr_789"
                className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
              />
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#218838] hover:bg-[#1a6f2d] text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-700/20 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Verifying Order...' : 'Track Live Status'}</span>
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
          <span>Need help?</span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#218838] font-bold hover:underline inline-flex items-center gap-1"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" /> Ask on WhatsApp
          </a>
        </div>
      </div>

      {/* Found Order Details */}
      {order && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                Order Reference
              </span>
              <h2 className="text-xl font-black text-gray-900">
                #{order.order_number}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                Current Status
              </span>
              <span className="inline-block bg-[#14532D] text-[#FFC928] text-xs font-black px-3 py-1 rounded-full mt-0.5">
                {order.status}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <OrderStatusTimeline currentStatus={order.status} />

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#218838]" /> Delivery Destination
              </h4>
              <p className="text-gray-700">
                <strong>{order.customer_name}</strong>
                <br />
                {order.delivery_address}, {order.neighbourhood}
                <br />
                PIN: {order.pincode}
              </p>
              <div className="text-[#14532D] font-bold pt-1">
                Slot: {order.delivery_slot}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#218838]" /> Payment Summary
              </h4>
              <div className="flex justify-between text-gray-600">
                <span>Method:</span>
                <strong className="text-gray-900">{order.payment_method}</strong>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Payment Status:</span>
                <span className="font-bold text-emerald-700">{order.payment_status}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
                <span>Total Amount:</span>
                <span className="text-base text-[#14532D]">₹{order.total_amount}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2 pt-2">
            <h4 className="font-bold text-xs uppercase text-gray-400 tracking-wider">
              Produce Snapshot ({order.items.length} items)
            </h4>
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden bg-gray-50/50">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-800">{item.product_name}</span>
                    <span className="text-gray-400 ml-2">({item.unit})</span>
                  </div>
                  <div className="font-bold text-gray-900">
                    {item.quantity} × ₹{item.unit_price} = ₹{item.total_price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
