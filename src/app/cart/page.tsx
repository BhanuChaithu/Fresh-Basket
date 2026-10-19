'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  MessageCircle,
  Truck,
  Sparkles,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useDelivery } from '@/context/DeliveryContext';

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  const {
    selectedPincode,
    selectedArea,
    settings,
    setIsModalOpen,
    generateWhatsAppCartUrl,
  } = useDelivery();

  const freeDeliveryThreshold = settings.free_delivery_threshold ?? 0;
  const isFreeDelivery = freeDeliveryThreshold === 0 || subtotal >= freeDeliveryThreshold;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = freeDeliveryThreshold === 0 ? 100 : Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const standardDeliveryCharge = selectedArea
    ? (selectedArea.delivery_charge ?? 0)
    : (settings.standard_delivery_charge ?? 0);
  const deliveryCharge = isFreeDelivery ? 0 : standardDeliveryCharge;
  const totalAmount = subtotal + deliveryCharge;

  const whatsappUrl = generateWhatsAppCartUrl(items);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-[#218838] flex items-center justify-center mx-auto text-3xl">
          🧺
        </div>
        <h1 className="text-3xl font-black text-gray-900">Your Basket is Empty</h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          You haven&apos;t added any farm fresh produce to your basket yet. Check out our fresh vegetables, fruits, and weekly family combos!
        </p>
        <div className="pt-2">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#218838] hover:bg-[#1a6f2d] text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-700/20 transition-all hover:scale-105"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Fresh Produce</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Shopping Basket
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review your produce items before proceeding to checkout.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-gray-400 hover:text-red-500 self-start sm:self-auto flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear basket
        </button>
      </div>

      {/* Free Delivery Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#218838]" />
            {isFreeDelivery ? (
              <span className="text-[#218838] font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FFC928]" /> You unlocked FREE Bengaluru delivery!
              </span>
            ) : (
              <span>
                Add <strong className="text-[#218838]">₹{remainingForFreeDelivery}</strong> more for FREE delivery
              </span>
            )}
          </span>
          <span className="text-gray-400">{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#218838] to-[#FFC928] h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Content Split: Item Table + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Items List */}
        <div className="lg:col-span-8 space-y-3">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs flex items-center gap-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.product.image_url}
                alt={item.product.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover bg-gray-50 shrink-0"
              />

              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.product.id}`}>
                  <h3 className="font-bold text-sm sm:text-base text-gray-900 hover:text-[#218838] transition-colors truncate">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">
                  Unit: {item.product.unit} • ₹{item.product.current_price}
                </p>
                <div className="text-sm font-black text-[#14532D] mt-1 sm:hidden">
                  ₹{item.product.current_price * item.quantity}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1 shrink-0">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="p-1.5 text-gray-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-black text-gray-900">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="p-1.5 text-gray-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Item Total (Desktop) */}
              <div className="w-20 text-right font-black text-base text-[#14532D] hidden sm:block shrink-0">
                ₹{item.product.current_price * item.quantity}
              </div>

              {/* Delete button */}
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Delivery destination prompt */}
          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#218838]" />
              <span>
                Delivering to: <strong>{selectedArea?.area_name || `PIN ${selectedPincode}`}</strong>
              </span>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-[#218838] font-bold hover:underline"
            >
              Change PIN
            </button>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="font-black text-lg text-gray-900">Order Summary</h3>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Produce Subtotal ({items.length} items)</span>
              <span className="font-semibold text-gray-900">₹{subtotal}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee (Bengaluru)</span>
              <span className="font-semibold">
                {deliveryCharge === 0 ? (
                  <span className="text-[#218838] font-bold">FREE</span>
                ) : (
                  `₹${deliveryCharge}`
                )}
              </span>
            </div>

            <div className="flex justify-between text-base font-black text-gray-900 pt-3 border-t border-gray-100">
              <span>Grand Total</span>
              <span className="text-xl text-[#14532D]">₹{totalAmount}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => router.push('/checkout')}
              className="w-full flex items-center justify-center gap-2 bg-[#218838] hover:bg-[#1a6f2d] text-white py-4 rounded-2xl font-bold text-sm shadow-md shadow-emerald-700/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* WhatsApp Direct Share Order */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-3 rounded-2xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send Cart to WhatsApp</span>
            </a>
          </div>

          <div className="pt-2 text-[11px] text-gray-500 space-y-1.5 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#218838]" /> No advance payment required for COD
            </div>
            <p>
              Pre-order farm produce: Orders are freshly harvested upon order placement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
