'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  PlusCircle,
  ShoppingBag,
  User,
  MapPin,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
} from 'lucide-react';
import { Product, BusinessSettings } from '@/lib/types';

export default function AdminNewOrderPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [neighbourhood, setNeighbourhood] = useState('HSR Layout');
  const [pincode, setPincode] = useState('560102');
  const [deliverySlot, setDeliverySlot] = useState('Morning Slot: 07:00 AM – 10:00 AM (Next Day)');
  const [deliveryInstructions, setDeliveryInstructions] = useState('Order received via WhatsApp');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Manual UPI'>('Cash on Delivery');

  // Selected Items
  const [orderItems, setOrderItems] = useState<{ productId: string; quantity: number }[]>([]);

  useEffect(() => {
    fetch('/api/products?includeUnavailable=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProducts(data.products);
          // Pre-select 1st product
          if (data.products.length > 0) {
            setOrderItems([{ productId: data.products[0].id, quantity: 1 }]);
          }
        }
      });

    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      });
  }, []);

  const handleAddItemRow = () => {
    if (products.length > 0) {
      setOrderItems((prev) => [...prev, { productId: products[0].id, quantity: 1 }]);
    }
  };

  const handleRemoveItemRow = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateItemProduct = (index: number, productId: string) => {
    setOrderItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, productId } : item))
    );
  };

  const handleUpdateItemQty = (index: number, qty: number) => {
    if (qty <= 0) return;
    setOrderItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: qty } : item))
    );
  };

  // Calculate estimated subtotal
  const estimatedSubtotal = orderItems.reduce((sum, item) => {
    const prod = products.find((p) => p.id === item.productId);
    return sum + (prod ? prod.current_price * item.quantity : 0);
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      setErrorMsg('Please enter customer name, mobile, and address.');
      return;
    }

    if (orderItems.length === 0) {
      setErrorMsg('Please add at least one produce item.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          customer_phone: customerPhone,
          delivery_address: deliveryAddress,
          neighbourhood,
          pincode,
          delivery_slot: deliverySlot,
          delivery_instructions: deliveryInstructions,
          payment_method: paymentMethod,
          items: orderItems.map((i) => ({
            product_id: i.productId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Failed to create manual order');
        return;
      }

      setSuccessOrder(data.order);
    } catch {
      setLoading(false);
      setErrorMsg('Network error while creating manual order.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Manual Order Entry (WhatsApp / Phone)
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Record orders received directly from customers via WhatsApp click-to-chat or direct phone call.
        </p>
      </div>

      {successOrder ? (
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-[#218838] mx-auto" />
          <h2 className="text-2xl font-black text-gray-900">
            Manual Order #{successOrder.order_number} Created!
          </h2>
          <p className="text-xs text-gray-600 max-w-md mx-auto">
            Order for <strong>{successOrder.customer_name}</strong> has been logged in the database for ₹{successOrder.total_amount}.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => {
                setSuccessOrder(null);
                setCustomerName('');
                setCustomerPhone('');
                setDeliveryAddress('');
              }}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold"
            >
              Enter Another Order
            </button>
            <button
              onClick={() => router.push('/admin/orders')}
              className="px-5 py-2.5 bg-[#218838] hover:bg-[#1a6f2d] text-white rounded-xl text-xs font-bold"
            >
              View in Incoming Orders
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#218838]" /> Customer Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Anand Murthy"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  WhatsApp / Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Bengaluru Delivery Address *
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Flat 101, Green Meadows, 5th Main"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Neighbourhood *
                </label>
                <input
                  type="text"
                  required
                  value={neighbourhood}
                  onChange={(e) => setNeighbourhood(e.target.value)}
                  placeholder="e.g. HSR Layout Sector 1"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="560102"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838] font-bold"
                />
              </div>
            </div>
          </div>

          {/* Slot & Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Delivery Slot
              </label>
              <select
                value={deliverySlot}
                onChange={(e) => setDeliverySlot(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#218838]"
              >
                {settings?.delivery_slots?.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#218838]"
              >
                <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                <option value="Manual UPI">Manual UPI</option>
              </select>
            </div>
          </div>

          {/* Produce Items Selection */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-[#218838]" /> Produce Items
              </h3>
              <button
                type="button"
                onClick={handleAddItemRow}
                className="text-[#218838] font-bold text-xs hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Another Item
              </button>
            </div>

            <div className="space-y-2">
              {orderItems.map((item, idx) => {
                const selectedProd = products.find((p) => p.id === item.productId);
                return (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-200">
                    <select
                      value={item.productId}
                      onChange={(e) => handleUpdateItemProduct(idx, e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — ₹{p.current_price} ({p.unit})
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => handleUpdateItemQty(idx, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateItemQty(idx, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="w-16 font-bold text-right text-gray-900">
                      ₹{selectedProd ? selectedProd.current_price * item.quantity : 0}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItemRow(idx)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between font-bold text-sm text-[#14532D]">
              <span>Estimated Produce Subtotal:</span>
              <span>₹{estimatedSubtotal}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#218838] hover:bg-[#1a6f2d] text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
          >
            {loading ? 'Creating Order in Database...' : 'Save Manual Order to Database'}
          </button>
        </form>
      )}
    </div>
  );
}
