'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send, ShoppingBag, Sparkles } from 'lucide-react';
import { useDelivery } from '@/context/DeliveryContext';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, selectedPincode, selectedArea } = useDelivery();

  const phone = settings.whatsapp_number.replace(/\D/g, '') || '919876543210';

  const triggerChat = (customMessage: string) => {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(customMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Pop-up Quick Menu */}
      {isOpen && (
        <div className="mb-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#14532D] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-xs">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#14532D]"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Fresh Basket WhatsApp</h4>
                <p className="text-[11px] text-emerald-200">Usually replies within 15 mins</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#F7FAF5] space-y-3">
            <p className="text-xs text-gray-700 bg-white p-3 rounded-xl border border-gray-200 shadow-2xs leading-relaxed">
              👋 <strong>Namaskara!</strong> How can we help you with fresh produce delivery in Bengaluru today?
            </p>

            <div className="space-y-2 text-xs font-semibold">
              <button
                onClick={() =>
                  triggerChat(
                    `Hi Fresh Basket! I would like to place a fresh produce order for delivery to PIN ${selectedPincode} (${selectedArea?.area_name || 'Bengaluru'}).`
                  )
                }
                className="w-full text-left p-2.5 bg-white hover:bg-emerald-50 text-gray-800 hover:text-[#218838] rounded-xl border border-gray-200/80 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#218838]" />
                  Order directly on WhatsApp
                </span>
                <Send className="w-3 h-3 text-gray-400 group-hover:text-[#218838]" />
              </button>

              <button
                onClick={() =>
                  triggerChat(
                    `Hi! What fresh vegetables and fruit baskets are being harvested today for delivery to PIN ${selectedPincode}?`
                  )
                }
                className="w-full text-left p-2.5 bg-white hover:bg-emerald-50 text-gray-800 hover:text-[#218838] rounded-xl border border-gray-200/80 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFC928]" />
                  Check today&apos;s farm harvest
                </span>
                <Send className="w-3 h-3 text-gray-400 group-hover:text-[#218838]" />
              </button>

              <button
                onClick={() =>
                  triggerChat(
                    `Hi Fresh Basket team! I want to check the status of my existing order.`
                  )
                }
                className="w-full text-left p-2.5 bg-white hover:bg-emerald-50 text-gray-800 hover:text-[#218838] rounded-xl border border-gray-200/80 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  📦 Track my existing order
                </span>
                <Send className="w-3 h-3 text-gray-400 group-hover:text-[#218838]" />
              </button>
            </div>

            <p className="text-[10px] text-gray-400 text-center pt-1">
              ₹0 software cost • Official WhatsApp Click-to-Chat
            </p>
          </div>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-lg shadow-emerald-900/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Contact Fresh Basket on WhatsApp"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 text-white fill-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FFC928] animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FFC928]"></span>
        </div>
        <span className="hidden sm:inline font-bold text-sm tracking-wide">
          Order on WhatsApp
        </span>
      </button>
    </div>
  );
}
