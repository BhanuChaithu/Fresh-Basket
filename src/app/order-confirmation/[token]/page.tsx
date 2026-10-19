import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CheckCircle2,
  Package,
  Clock,
  MapPin,
  MessageCircle,
  Copy,
  ArrowRight,
  ShieldCheck,
  Calendar,
  FileText,
} from 'lucide-react';
import { getOrderByLookupToken, getSettings } from '@/lib/store';
import OrderStatusTimeline from '@/components/OrderStatusTimeline';

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const [order, settings] = await Promise.all([
    getOrderByLookupToken(token),
    getSettings(),
  ]);

  if (!order) {
    notFound();
  }

  const phone = settings.whatsapp_number.replace(/\D/g, '') || '919876543210';
  const whatsappConfirmText = `Hi Fresh Basket! I just placed order *#${order.order_number}* on the website for ₹${order.total_amount}. Delivery to ${order.neighbourhood}, PIN ${order.pincode}. Please confirm my order!`;
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappConfirmText)}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Success Banner */}
      <div className="bg-gradient-to-r from-[#14532D] to-[#218838] text-white p-8 rounded-3xl shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md text-[#FFC928] flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="space-y-1">
          <span className="bg-[#FFC928] text-[#14532D] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block">
            Order Successfully Placed
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Thank you, {order.customer_name}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-md mx-auto">
            Your fresh produce pre-order has been received. Our team will verify and prepare your fresh harvest.
          </p>
        </div>

        {/* Order IDs Box */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 max-w-md mx-auto border border-white/20 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-emerald-200 uppercase tracking-wider block font-semibold">
              Order Reference Number
            </span>
            <span className="text-lg font-black text-white tracking-wider">
              #{order.order_number}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-emerald-200 uppercase tracking-wider block font-semibold">
              Current Status
            </span>
            <span className="inline-block bg-[#FFC928] text-[#14532D] font-black px-2.5 py-0.5 rounded-full text-xs">
              {order.status}
            </span>
          </div>
        </div>

        {/* Action: Send WhatsApp Confirmation */}
        <div className="pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-lg shadow-emerald-950/30 transition-all hover:scale-105"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Order #{order.order_number} to WhatsApp for Fast Confirmation</span>
          </a>
        </div>
      </div>

      {/* Live Status Timeline Component */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
        <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#218838]" /> Live Order Fulfillment Tracking
        </h3>
        <OrderStatusTimeline currentStatus={order.status} />
      </div>

      {/* Order Details Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Delivery Details */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-3 text-xs">
          <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#218838]" /> Delivery Information
          </h4>
          <div className="space-y-1.5 text-gray-600">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Recipient</span>
              <strong className="text-gray-800">{order.customer_name}</strong> ({order.customer_phone})
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Address</span>
              <p className="text-gray-800">{order.delivery_address}, {order.neighbourhood}</p>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Bengaluru PIN Code</span>
              <p className="text-gray-800 font-bold">{order.pincode}</p>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Delivery Time Slot</span>
              <p className="text-[#14532D] font-bold">{order.delivery_slot}</p>
            </div>
            {order.delivery_instructions && (
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Special Instructions</span>
                <p className="text-gray-700 italic">&quot;{order.delivery_instructions}&quot;</p>
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
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Payment Method</span>
              <span className="font-bold text-gray-800">{order.payment_method}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Payment Status</span>
              <span className={`inline-block px-2 py-0.5 rounded-md font-bold ${
                order.payment_status === 'Verified' || order.payment_status === 'Paid on Delivery'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {order.payment_status}
              </span>
            </div>
            {order.upi_reference && (
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">UPI Reference / UTR</span>
                <span className="font-mono text-gray-800">{order.upi_reference}</span>
              </div>
            )}
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Secure Order Lookup Link</span>
              <p className="text-[11px] text-gray-500 break-all bg-gray-50 p-2 rounded-lg border border-gray-200 font-mono">
                /order-confirmation/{order.lookup_token}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Snapshotted Items Summary */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
        <h4 className="font-bold text-base text-gray-900 flex items-center gap-2">
          <Package className="w-4 h-4 text-[#218838]" /> Ordered Produce Items ({order.items.length})
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
                <span className="text-gray-500 font-semibold">{item.quantity} × ₹{item.unit_price}</span>
                <div className="font-black text-[#14532D] text-sm">₹{item.total_price}</div>
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

      {/* Bottom Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <Link
          href="/"
          className="text-xs font-bold text-gray-600 hover:text-gray-900"
        >
          ← Return to Home
        </Link>

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[#218838] hover:bg-[#1a6f2d] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-colors"
        >
          <span>Shop More Produce</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
