'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  MapPin,
  Clock,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  QrCode,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useDelivery } from '@/context/DeliveryContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const {
    selectedPincode,
    selectedArea,
    settings,
    checkAndSetPincode,
    generateWhatsAppCartUrl,
  } = useDelivery();

  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    delivery_address: '',
    neighbourhood: selectedArea ? selectedArea.area_name.split('/')[0].trim() : '',
    pincode: selectedPincode || '560102',
    delivery_slot: settings.delivery_slots[0] || 'Morning Slot: 07:00 AM – 10:00 AM (Next Day)',
    delivery_instructions: '',
    payment_method: 'Cash on Delivery' as 'Cash on Delivery' | 'Manual UPI',
    upi_reference: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#218838] flex items-center justify-center mx-auto text-2xl">
          🧺
        </div>
        <h2 className="text-2xl font-black text-gray-900">Your basket is empty</h2>
        <p className="text-xs text-gray-500">
          Please add produce to your cart before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-2.5 bg-[#218838] text-white rounded-xl text-xs font-bold"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const freeDeliveryThreshold = settings.free_delivery_threshold || 299;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const deliveryCharge = isFreeDelivery
    ? 0
    : selectedArea
    ? selectedArea.delivery_charge
    : settings.standard_delivery_charge || 35;
  const totalAmount = subtotal + deliveryCharge;

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setForm((prev) => ({ ...prev, pincode: val }));
    if (val.length === 6) {
      await checkAndSetPincode(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic frontend checks
    if (!form.customer_name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    const cleanPhone = form.customer_phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!form.delivery_address.trim()) {
      setErrorMsg('Please enter your complete delivery house/flat address.');
      return;
    }
    if (!form.pincode || form.pincode.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit Bengaluru PIN code.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.customer_name,
          customer_phone: cleanPhone,
          customer_email: form.customer_email,
          delivery_address: form.delivery_address,
          neighbourhood: form.neighbourhood || selectedArea?.area_name || 'Bengaluru',
          pincode: form.pincode,
          delivery_slot: form.delivery_slot,
          delivery_instructions: form.delivery_instructions,
          payment_method: form.payment_method,
          upi_reference: form.upi_reference,
          items: items.map((i) => ({
            product_id: i.product.id,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMsg(data.error || 'Checkout failed. Please review your details.');
        setLoading(false);
        return;
      }

      // Order created successfully!
      clearCart();
      router.push(`/order-confirmation/${data.lookup_token}`);
    } catch {
      setErrorMsg('Network error while placing order. Please try again or order via WhatsApp.');
      setLoading(false);
    }
  };

  const whatsappBackupUrl = generateWhatsAppCartUrl(
    items,
    `Address: ${form.delivery_address}, PIN: ${form.pincode}`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Checkout & Delivery Details
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          ₹0 software markup. Pre-order fresh harvest straight to your door in Bengaluru.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Customer Information & Delivery Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Customer Contact */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <User className="w-4 h-4 text-[#218838]" /> 1. Customer Contact (Guest Checkout)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Mobile Number (for delivery SMS/WhatsApp) *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-xs font-bold bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-600">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={form.customer_phone}
                    onChange={(e) =>
                      setForm({ ...form, customer_phone: e.target.value.replace(/\D/g, '') })
                    }
                    placeholder="9876543210"
                    className="flex-1 px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-r-xl focus:bg-white focus:outline-none focus:border-[#218838]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email Address (Optional, for digital receipt)
                </label>
                <input
                  type="email"
                  value={form.customer_email}
                  onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                  placeholder="ramesh@example.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Delivery Address in Bengaluru */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#218838]" /> 2. Bengaluru Delivery Address
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  House / Flat / Building Name & Street *
                </label>
                <textarea
                  required
                  rows={2}
                  value={form.delivery_address}
                  onChange={(e) => setForm({ ...form, delivery_address: e.target.value })}
                  placeholder="e.g. Flat 302, Sai Residency, 7th Cross, 19th Main"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Neighbourhood / Locality *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.neighbourhood}
                    onChange={(e) => setForm({ ...form, neighbourhood: e.target.value })}
                    placeholder="e.g. HSR Layout Sector 2"
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    PIN Code (Bengaluru) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={form.pincode}
                    onChange={handlePincodeChange}
                    placeholder="560102"
                    className="w-full px-3.5 py-2.5 text-xs font-bold tracking-wider bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
                  />
                </div>
              </div>

              {selectedArea && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800 flex items-center justify-between">
                  <span>
                    Serviceable Zone: <strong>{selectedArea.area_name}</strong>
                  </span>
                  <span className="font-bold">PIN {form.pincode}</span>
                </div>
              )}

              {/* Delivery slot */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Choose Preferred Delivery Slot *
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {settings.delivery_slots.map((slot) => (
                    <label
                      key={slot}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs transition-colors ${
                        form.delivery_slot === slot
                          ? 'border-[#218838] bg-emerald-50/70 font-bold text-[#14532D]'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery_slot"
                        checked={form.delivery_slot === slot}
                        onChange={() => setForm({ ...form, delivery_slot: slot })}
                        className="text-[#218838] focus:ring-[#218838]"
                      />
                      <Clock className="w-4 h-4 text-[#218838]" />
                      <span>{slot}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={form.delivery_instructions}
                  onChange={(e) => setForm({ ...form, delivery_instructions: e.target.value })}
                  placeholder="e.g. Ring bell twice, leave with security guard if unavailable"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#218838]" /> 3. Payment Method (Zero Payment Gateway Fee)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Cash on Delivery */}
              <label
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between gap-3 transition-colors ${
                  form.payment_method === 'Cash on Delivery'
                    ? 'border-[#218838] bg-emerald-50/70 text-[#14532D]'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment_method"
                    checked={form.payment_method === 'Cash on Delivery'}
                    onChange={() => setForm({ ...form, payment_method: 'Cash on Delivery' })}
                    className="text-[#218838] focus:ring-[#218838]"
                  />
                  <div>
                    <h5 className="font-bold text-sm">Cash on Delivery (COD)</h5>
                    <p className="text-[11px] text-gray-500">Pay cash upon inspecting produce</p>
                  </div>
                </div>
                <span className="text-[10px] bg-white px-2 py-1 rounded-md border border-gray-200 self-start font-semibold">
                  Most Popular
                </span>
              </label>

              {/* Manual UPI */}
              <label
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between gap-3 transition-colors ${
                  form.payment_method === 'Manual UPI'
                    ? 'border-[#218838] bg-emerald-50/70 text-[#14532D]'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment_method"
                    checked={form.payment_method === 'Manual UPI'}
                    onChange={() => setForm({ ...form, payment_method: 'Manual UPI' })}
                    className="text-[#218838] focus:ring-[#218838]"
                  />
                  <div>
                    <h5 className="font-bold text-sm">Pay via UPI QR / VPA</h5>
                    <p className="text-[11px] text-gray-500">GPay, PhonePe, Paytm, BHIM</p>
                  </div>
                </div>
                <span className="text-[10px] bg-white px-2 py-1 rounded-md border border-gray-200 self-start font-semibold">
                  Scan & Pay
                </span>
              </label>
            </div>

            {/* If Manual UPI is chosen, display UPI details */}
            {form.payment_method === 'Manual UPI' && (
              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-3 text-xs text-amber-900">
                <div className="flex items-center gap-2 font-bold text-sm text-[#14532D]">
                  <QrCode className="w-4 h-4 text-[#218838]" />
                  <span>Fresh Basket Official UPI Details</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">UPI ID / VPA:</span>
                    <strong className="text-gray-900 select-all font-mono">{settings.upi_id}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account Name:</span>
                    <span className="font-semibold text-gray-800">{settings.upi_account_name}</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  You can transfer ₹{totalAmount} now or scan the delivery executive&apos;s UPI QR card at your doorstep!
                </p>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    UPI Transaction ID / UTR Reference (If paid in advance):
                  </label>
                  <input
                    type="text"
                    value={form.upi_reference}
                    onChange={(e) => setForm({ ...form, upi_reference: e.target.value })}
                    placeholder="e.g. 428901234567"
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#218838]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-5 sticky top-24">
          <h3 className="font-black text-lg text-gray-900 flex items-center justify-between">
            <span>Basket Summary</span>
            <span className="text-xs font-semibold text-gray-400">{items.length} items</span>
          </h3>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-1 divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.product.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <div className="font-semibold text-gray-800 truncate">{item.product.name}</div>
                  <div className="text-[11px] text-gray-400">
                    {item.quantity} × {item.product.unit} (₹{item.product.current_price})
                  </div>
                </div>
                <div className="font-black text-[#14532D] shrink-0">
                  ₹{item.product.current_price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-3 border-t border-gray-200 text-xs sm:text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Produce Subtotal</span>
              <span className="font-semibold text-gray-900">₹{subtotal}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Bengaluru Delivery Charge</span>
              <span className="font-semibold">
                {deliveryCharge === 0 ? (
                  <span className="text-[#218838] font-bold">FREE</span>
                ) : (
                  `₹${deliveryCharge}`
                )}
              </span>
            </div>

            <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-100">
              <span>Total Payable</span>
              <span className="text-xl text-[#14532D]">₹{totalAmount}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#218838] hover:bg-[#1a6f2d] text-white py-4 rounded-2xl font-bold text-sm shadow-md shadow-emerald-700/20 disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              {loading ? (
                <span>Placing Your Order...</span>
              ) : (
                <>
                  <span>Confirm Order • ₹{totalAmount}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Or send to WhatsApp */}
            <a
              href={whatsappBackupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 rounded-2xl font-bold text-xs shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Or Confirm via WhatsApp</span>
            </a>
          </div>

          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#218838] shrink-0 mt-0.5" />
            <span>
              <strong>Safe Checkout:</strong> Prices and stock are verified server-side. You will receive an instant unique order reference token.
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
