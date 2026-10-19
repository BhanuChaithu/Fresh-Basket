'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Package,
  Clock,
  MapPin,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { Order, BusinessSettings } from '@/lib/types';
import OrderStatusTimeline from '@/components/OrderStatusTimeline';

interface Props {
  initialOrder: Order | null;
  token: string;
  settings: BusinessSettings;
}

export default function OrderConfirmationView({
  initialOrder,
  token,
  settings,
}: Props) {
  const [order, setOrder] = useState<Order | null>(initialOrder);
  const [searching, setSearching] = useState(!initialOrder);

  useEffect(() => {
    if (order) return;

    // 1. Try restoring from local session (placed in this browser just now)
    try {
      const cached =
        sessionStorage.getItem('fb_last_order') ||
        localStorage.getItem('fb_last_order');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (
          parsed &&
          (parsed.lookup_token === token ||
            parsed.order_number?.toLowerCase() === token.toLowerCase() ||
            parsed.id === token ||
            Date.now() - new Date(parsed.created_at).getTime() < 1800000)
        ) {
          setOrder(parsed);
          setSearching(false);
          return;
        }
      }
    } catch {
      // Ignore parse errors
    }

    // 2. Poll API lookup in case disk sync was just slightly delayed
    fetch('/api/orders/lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.order) {
          setOrder(data.order);
        }
      })
      .catch(() => {
        // Fallback display handles this gracefully
      })
      .finally(() => {
        setSearching(false);
      });
  }, [token, order]);

  const phone = (settings.whatsapp_number || '919876543210').replace(/\D/g, '');
  const orderRef = order?.order_number || token;

  const whatsappConfirmText = order
    ? `Hi Fresh Basket! I just placed order *#${order.order_number}* on the website for ₹${order.total_amount}. Delivery to ${order.neighbourhood}, PIN ${order.pincode}. Please confirm my order!`
    : `Hi Fresh Basket! I just placed an order on the website (Reference: #${token}). Please confirm my order!`;

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    whatsappConfirmText
  )}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Success Celebration Banner */}
      <div className="bg-gradient-to-r from-[#14532D] via-[#1b6b33] to-[#218838] text-white p-8 rounded-3xl shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md text-[#FFC928] flex items-center justify-center mx-auto shadow-inner ring-4 ring-white/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="bg-[#FFC928] text-[#14532D] text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider inline-block shadow-xs">
            ✓ Order Placed Successfully
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {order ? `Thank you, ${order.customer_name}!` : 'Thank You for Your Order!'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-md mx-auto">
            Your fresh produce pre-order has been safely received. Our Bengaluru team will prepare your harvest.
          </p>
        </div>

        {/* Order IDs Box */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 max-w-md mx-auto border border-white/20 flex items-center justify-between text-xs">
          <div className="text-left">
            <span className="text-[10px] text-emerald-200 uppercase tracking-wider block font-semibold">
              Order Reference
            </span>
            <span className="text-lg font-black text-white tracking-wider">
              {order ? `#${order.order_number}` : `#${orderRef}`}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-emerald-200 uppercase tracking-wider block font-semibold">
              Current Status
            </span>
            <span className="inline-block bg-[#FFC928] text-[#14532D] font-black px-2.5 py-0.5 rounded-full text-xs">
              {order?.status || 'Pending confirmation'}
            </span>
          </div>
        </div>

        {/* Action: Send WhatsApp Confirmation */}
        <div className="pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-emerald-950/30 transition-all hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Send Order #{orderRef} to WhatsApp for Instant Confirmation</span>
          </a>
        </div>
      </div>

      {/* Live Status Timeline Component */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
        <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#218838]" /> Live Order Fulfillment Tracking
        </h3>
        <OrderStatusTimeline
          currentStatus={order ? order.status : 'Pending confirmation'}
        />
      </div>

      {/* If Manual UPI is chosen, show PhonePe QR card to scan */}
      {order && order.payment_method === 'Manual UPI' && (
        <div className="bg-gradient-to-b from-purple-50/70 to-white p-6 rounded-3xl border-2 border-purple-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-purple-100 pb-3">
            <div className="flex items-center gap-2 font-black text-base text-[#14532D]">
              <QrCode className="w-5 h-5 text-purple-600" />
              <span>PhonePe UPI Payment for Order #{order.order_number}</span>
            </div>
            <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase">
              Scan & Pay ₹{order.total_amount}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="p-2 bg-white rounded-2xl border-2 border-purple-200 shadow-md shrink-0">
              <img
                src="/images/phonepe-qr.jpg"
                alt="PhonePe UPI QR - PALETI ANITHA"
                className="w-48 h-auto rounded-lg object-contain"
              />
            </div>

            <div className="space-y-3 text-xs flex-1 text-gray-700">
              <div className="bg-white p-4 rounded-xl border border-purple-100 space-y-2 shadow-2xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Payee Account:</span>
                  <strong className="text-gray-900 font-extrabold text-sm">
                    {settings.upi_account_name || 'PALETI ANITHA'}
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Total Amount:</span>
                  <strong className="text-[#14532D] font-black text-base">
                    ₹{order.total_amount}
                  </strong>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-purple-100">
                  <span className="text-gray-500">UPI ID / VPA:</span>
                  <span className="font-mono text-purple-900 font-bold bg-purple-50 px-2 py-0.5 rounded">
                    {settings.upi_id || 'freshbasket@upi'}
                  </span>
                </div>
              </div>

              <a
                href={`upi://pay?pa=${encodeURIComponent(
                  settings.upi_id || 'freshbasket@upi'
                )}&pn=${encodeURIComponent(
                  settings.upi_account_name || 'PALETI ANITHA'
                )}&am=${order.total_amount}&cu=INR`}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                <span>Tap to Pay ₹{order.total_amount} via PhonePe / UPI App</span>
              </a>

              <p className="text-[11px] text-gray-500 leading-relaxed">
                If you already paid, our team will verify your transaction shortly. You can also pay by scanning the QR code when the delivery executive arrives at your doorstep.
              </p>
            </div>
          </div>
        </div>
      )}

      {order ? (
        <>
          {/* Order Details Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Details */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-3 text-xs">
              <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#218838]" /> Delivery Information
              </h4>
              <div className="space-y-1.5 text-gray-600">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">
                    Recipient
                  </span>
                  <strong className="text-gray-800">{order.customer_name}</strong> (
                  {order.customer_phone})
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">
                    Address
                  </span>
                  <p className="text-gray-800">
                    {order.delivery_address}, {order.neighbourhood}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">
                    Bengaluru PIN Code
                  </span>
                  <p className="text-gray-800 font-bold">{order.pincode}</p>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">
                    Delivery Time Slot
                  </span>
                  <p className="text-[#14532D] font-bold">{order.delivery_slot}</p>
                </div>
                {order.delivery_instructions && (
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">
                      Special Instructions
                    </span>
                    <p className="text-gray-700 italic">
                      &quot;{order.delivery_instructions}&quot;
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment & Security Info */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-3 text-xs">
              <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#218838]" /> Payment & Verification
              </h4>
              <div className="space-y-1.5 text-gray-600">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">
                    Payment Method
                  </span>
                  <span className="font-bold text-gray-800">{order.payment_method}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">
                    Payment Status
                  </span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md font-bold ${
                      order.payment_status === 'Verified' ||
                      order.payment_status === 'Paid on Delivery'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {order.payment_status}
                  </span>
                </div>
                {order.upi_reference && (
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">
                      UPI Reference / UTR
                    </span>
                    <span className="font-mono text-gray-800">
                      {order.upi_reference}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">
                    Order Lookup Reference
                  </span>
                  <p className="text-[11px] text-gray-600 break-all bg-gray-50 p-2 rounded-lg border border-gray-200 font-mono">
                    #{order.order_number}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Snapshotted Items Summary */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
            <h4 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#218838]" /> Ordered Produce Items (
              {order.items.length})
            </h4>

            <div className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900">{item.product_name}</span>
                    <p className="text-gray-400 mt-0.5">
                      Unit: {item.unit} • ₹{item.unit_price} each
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-gray-500 font-semibold">
                      {item.quantity} × ₹{item.unit_price}
                    </span>
                    <div className="font-black text-[#14532D] text-sm">
                      ₹{item.total_price}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Produce Subtotal</span>
                <span className="font-semibold text-gray-900">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge</span>
                <span className="font-semibold">
                  {order.delivery_charge === 0 ? (
                    <span className="text-[#218838] font-bold">FREE</span>
                  ) : (
                    `₹${order.delivery_charge}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-100">
                <span>Total Amount</span>
                <span className="text-xl text-[#14532D]">₹{order.total_amount}</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Graceful Fallback if details are still fetching */
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-4 text-center">
          <div className="w-12 h-12 bg-emerald-50 text-[#218838] rounded-full flex items-center justify-center mx-auto text-xl">
            🧺
          </div>
          <h3 className="font-bold text-lg text-gray-900">
            Pre-order Recorded & Queued for Harvest
          </h3>
          <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
            Your order has been safely placed with reference <strong className="text-gray-900 font-mono">#{orderRef}</strong>. Our dispatch team is packaging your fresh produce according to your delivery slot.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/track-order"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition"
            >
              Track Order via Number & Phone
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Verify Order on WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <Link
          href="/"
          className="text-xs font-bold text-gray-600 hover:text-gray-900"
        >
          ← Return to Home
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/track-order"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition"
          >
            <Truck className="w-3.5 h-3.5 text-gray-500" />
            <span>Track Order</span>
          </Link>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#218838] hover:bg-[#1a6f2d] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-colors"
          >
            <span>Shop More Produce</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
