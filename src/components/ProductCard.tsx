'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Plus, Minus, MessageCircle, MapPin, AlertCircle } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useDelivery } from '@/context/DeliveryContext';

export default function ProductCard({ product }: { product: Product }) {
  const { items, addToCart, updateQuantity } = useCart();
  const { generateWhatsAppProductUrl } = useDelivery();

  const cartItem = items.find((item) => item.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const discountPercent =
    product.previous_price && product.previous_price > product.current_price
      ? Math.round(((product.previous_price - product.current_price) / product.previous_price) * 100)
      : null;

  const whatsappUrl = generateWhatsAppProductUrl(
    product.name,
    product.unit,
    product.current_price
  );

  return (
    <div className="group bg-white rounded-2xl border border-gray-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col overflow-hidden relative">
      {/* Top badges */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {discountPercent && (
            <span className="bg-[#FFC928] text-[#14532D] text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {product.is_sample_data && (
            <span
              className="bg-amber-100/90 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded-sm border border-amber-300/80"
              title="Test sample data: Prices & availability must be verified before accepting real orders"
            >
              Sample Data
            </span>
          )}
        </div>

        {/* WhatsApp direct order / enquire link */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Enquire on WhatsApp"
          className="pointer-events-auto w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-xs flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
        </a>
      </div>

      {/* Product Image */}
      <Link
        href={`/product/${product.id}`}
        className="relative block aspect-4/3 overflow-hidden bg-gray-50"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-300"
        />
        {!product.is_available && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center text-white font-bold text-xs">
            <span className="bg-red-600 px-3 py-1 rounded-full uppercase tracking-wider text-[11px]">
              Sold Out / Seasonal
            </span>
          </div>
        )}
      </Link>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Origin / Local indicator */}
          {product.origin && (
            <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-semibold mb-1">
              <MapPin className="w-3 h-3 text-[#218838]" />
              <span className="truncate">{product.origin}</span>
            </div>
          )}

          {/* Product Name */}
          <Link href={`/product/${product.id}`}>
            <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#218838] transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Unit */}
          <div className="text-xs text-gray-500 mt-1 font-medium">
            Unit: <span className="text-gray-700 font-semibold">{product.unit}</span>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-[#14532D]">
                ₹{product.current_price}
              </span>
              {product.previous_price && product.previous_price > product.current_price && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.previous_price}
                </span>
              )}
            </div>
            <div className="text-[10px] text-gray-400 font-medium">
              Transparent Farm Price
            </div>
          </div>

          {/* Cart Stepper or Add button */}
          <div>
            {!product.is_available ? (
              <span className="text-xs font-semibold text-gray-400 px-2 py-1 bg-gray-100 rounded-md">
                Unavailable
              </span>
            ) : quantityInCart > 0 ? (
              <div className="flex items-center bg-[#218838] text-white rounded-xl overflow-hidden shadow-xs">
                <button
                  onClick={() => updateQuantity(product.id, quantityInCart - 1)}
                  className="px-2 py-1.5 hover:bg-[#1a6f2d] transition-colors cursor-pointer"
                  title="Decrease"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-xs font-black min-w-5 text-center">
                  {quantityInCart}
                </span>
                <button
                  onClick={() => updateQuantity(product.id, quantityInCart + 1)}
                  className="px-2 py-1.5 hover:bg-[#1a6f2d] transition-colors cursor-pointer"
                  title="Increase"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product, 1)}
                className="flex items-center gap-1.5 bg-emerald-50 hover:bg-[#218838] text-[#218838] hover:text-white px-3.5 py-1.5 rounded-xl font-bold text-xs border border-emerald-200 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
