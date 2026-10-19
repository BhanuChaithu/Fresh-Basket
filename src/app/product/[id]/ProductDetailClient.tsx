'use client';

import React, { useState } from 'react';
import { ShoppingBag, Plus, Minus, MessageCircle, Check, ArrowRight } from 'lucide-react';
import { Product, BusinessSettings } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useDelivery } from '@/context/DeliveryContext';

export default function ProductDetailClient({
  product,
  settings,
}: {
  product: Product;
  settings: BusinessSettings;
}) {
  const [quantity, setQuantity] = useState(product.min_quantity || 1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const { addToCart, setIsCartOpen } = useCart();
  const { selectedPincode, selectedArea, generateWhatsAppProductUrl } = useDelivery();

  const discountPercent =
    product.previous_price && product.previous_price > product.current_price
      ? Math.round(((product.previous_price - product.current_price) / product.previous_price) * 100)
      : null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      setIsCartOpen(true);
    }, 400);
  };

  const whatsappUrl = generateWhatsAppProductUrl(
    product.name,
    product.unit,
    product.current_price
  );

  return (
    <div className="space-y-6">
      {/* Product Title & Unit */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-[#218838] uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md">
            {product.category_name || 'Produce'}
          </span>
          {discountPercent && (
            <span className="bg-[#FFC928] text-[#14532D] text-xs font-black px-2.5 py-0.5 rounded-full">
              Save {discountPercent}%
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
          {product.name}
        </h1>

        <div className="text-sm text-gray-500 font-semibold mt-1">
          Standard Unit: <span className="text-gray-800 font-bold">{product.unit}</span>
        </div>
      </div>

      {/* Pricing Header */}
      <div className="p-4 bg-white rounded-2xl border border-gray-200/80 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#14532D]">
              ₹{product.current_price}
            </span>
            {product.previous_price && product.previous_price > product.current_price && (
              <span className="text-base text-gray-400 line-through">
                ₹{product.previous_price}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Prices verified against daily farm harvest rates
          </p>
        </div>

        <div className="text-right">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
            product.is_available
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {product.is_available ? 'In Stock (Fresh Harvest)' : 'Currently Unavailable'}
          </span>
          <span className="block text-[11px] text-gray-400 mt-1">
            Deliver to PIN: <strong>{selectedPincode}</strong>
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
          About this Produce
        </h4>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          {product.description ||
            'Hand-selected and sorted produce sourced fresh from local Karnataka farmers. Carefully cleaned and delivered in fresh condition.'}
        </p>
      </div>

      {/* Quantity Selector & Add to Cart */}
      {product.is_available ? (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center border-2 border-gray-200 rounded-2xl bg-white p-1">
              <button
                onClick={() => setQuantity(Math.max(product.min_quantity || 1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-black text-lg"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-black text-base text-gray-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-black text-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-bold text-sm text-white shadow-lg shadow-emerald-700/20 transition-all ${
                addedAnimation
                  ? 'bg-emerald-700 scale-98'
                  : 'bg-[#218838] hover:bg-[#1a6f2d] hover:scale-[1.01] active:scale-98'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Added to Basket!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>
                    Add to Basket • ₹{product.current_price * quantity}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* WhatsApp Direct Order Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-md shadow-emerald-900/20 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Order this item on WhatsApp</span>
          </a>
        </div>
      ) : (
        <div className="p-4 bg-gray-100 rounded-2xl text-center text-gray-600 text-sm font-semibold">
          This produce is currently awaiting fresh harvest arrival.
        </div>
      )}
    </div>
  );
}
