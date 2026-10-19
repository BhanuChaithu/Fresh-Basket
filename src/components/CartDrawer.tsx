'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  MessageCircle,
  Truck,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useDelivery } from '@/context/DeliveryContext';

export default function CartDrawer() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, subtotal, isCartOpen, setIsCartOpen } = useCart();
  const { selectedPincode, selectedArea, settings, generateWhatsAppCartUrl } = useDelivery();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = settings.free_delivery_threshold ?? 0;
  const isFreeDelivery = freeDeliveryThreshold === 0 || subtotal >= freeDeliveryThreshold;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = freeDeliveryThreshold === 0 ? 100 : Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const standardDeliveryCharge = selectedArea
    ? (selectedArea.delivery_charge ?? 0)
    : (settings.standard_delivery_charge ?? 0);
  const deliveryCharge = isFreeDelivery ? 0 : standardDeliveryCharge;
  const estimatedTotal = subtotal + deliveryCharge;

  const whatsappUrl = generateWhatsAppCartUrl(items);

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-2xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-[#14532D] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-800/80 rounded-xl text-[#FFC928]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Your Fresh Basket</h3>
                <p className="text-xs text-emerald-200">
                  {items.length} {items.length === 1 ? 'item' : 'items'} • Delivering to PIN {selectedPincode}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Tracker */}
          <div className="bg-[#F7FAF5] p-3.5 border-b border-gray-200 text-xs">
            <div className="flex items-center justify-between mb-1.5 font-semibold">
              <span className="flex items-center gap-1 text-[#14532D]">
                <Truck className="w-3.5 h-3.5 text-[#218838]" />
                {isFreeDelivery ? (
                  <span className="text-[#218838] font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFC928]" /> You unlocked FREE delivery!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-[#218838]">₹{remainingForFreeDelivery}</strong> more for FREE delivery
                  </span>
                )}
              </span>
              <span className="text-gray-500">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#218838] to-[#FFC928] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#218838] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-gray-800">Your basket is empty</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                    Fill your basket with crisp vegetables, farm fruits, and curated weekly produce combos!
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 bg-[#218838] text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-700/20"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-2xl border border-gray-200/70"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-white shrink-0 border border-gray-100"
                  />

                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-gray-900 truncate">
                      {item.product.name}
                    </h5>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {item.product.unit} • ₹{item.product.current_price}
                    </p>
                    <div className="text-xs font-black text-[#14532D] mt-1">
                      ₹{item.product.current_price * item.quantity}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-gray-400 hover:text-red-500 p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-2xs">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 text-gray-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold min-w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 text-gray-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Calculations & Actions */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-gray-200 space-y-3 shadow-lg">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Produce Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Bengaluru Delivery Fee</span>
                  <span className="font-semibold">
                    {deliveryCharge === 0 ? (
                      <span className="text-[#218838] font-bold">FREE</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-100">
                  <span>Estimated Total</span>
                  <span className="text-[#14532D] text-base">₹{estimatedTotal}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 gap-2 pt-1">
                {/* Secure Checkout */}
                <button
                  onClick={handleCheckoutClick}
                  className="w-full flex items-center justify-center gap-2 bg-[#218838] hover:bg-[#1a6f2d] text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-emerald-700/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* WhatsApp Click-to-chat ordering */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  title="Send cart items to Fresh Basket on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Cart & Order on WhatsApp</span>
                </a>
              </div>

              <p className="text-[10px] text-gray-400 text-center leading-tight">
                Cash on Delivery & Manual UPI available. Prices recalculated on server.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
