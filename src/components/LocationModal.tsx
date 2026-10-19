'use client';

import React, { useState } from 'react';
import { MapPin, X, CheckCircle, AlertCircle, Sparkles, MessageCircle } from 'lucide-react';
import { useDelivery } from '@/context/DeliveryContext';

const POPULAR_AREAS = [
  { pin: '560102', name: 'HSR Layout' },
  { pin: '560034', name: 'Koramangala' },
  { pin: '560038', name: 'Indiranagar' },
  { pin: '560076', name: 'BTM Layout' },
  { pin: '560041', name: 'Jayanagar' },
  { pin: '560103', name: 'Bellandur / ORR' },
  { pin: '560068', name: 'Madivala / Bommanahalli' },
  { pin: '560001', name: 'MG Road / Central' },
];

export default function LocationModal() {
  const {
    isModalOpen,
    setIsModalOpen,
    selectedPincode,
    selectedArea,
    checkAndSetPincode,
    settings,
  } = useDelivery();

  const [inputPin, setInputPin] = useState(selectedPincode);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPin || inputPin.trim().length !== 6) {
      setFeedback({ success: false, message: 'Please enter a valid 6-digit Indian PIN code.' });
      return;
    }

    setLoading(true);
    const result = await checkAndSetPincode(inputPin.trim());
    setFeedback(result);
    setLoading(false);

    if (result.success) {
      setTimeout(() => {
        setIsModalOpen(false);
        setFeedback(null);
      }, 1200);
    }
  };

  const handleSelectArea = async (pin: string) => {
    setInputPin(pin);
    setLoading(true);
    const result = await checkAndSetPincode(pin);
    setFeedback(result);
    setLoading(false);
    if (result.success) {
      setTimeout(() => {
        setIsModalOpen(false);
        setFeedback(null);
      }, 800);
    }
  };

  const whatsappInquiryUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
    `Hi Fresh Basket! My Bengaluru PIN code is ${inputPin}. When will you start delivering fresh produce to my area?`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#14532D] to-[#218838] p-6 text-white relative">
          <button
            onClick={() => {
              setIsModalOpen(false);
              setFeedback(null);
            }}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3">
            <MapPin className="w-6 h-6 text-[#FFC928]" />
          </div>
          <h3 className="text-xl font-bold">Select Delivery Location</h3>
          <p className="text-xs text-emerald-100 mt-1">
            We deliver direct farm-harvested produce across Bengaluru.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Enter 6-Digit Bengaluru PIN Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={inputPin}
                onChange={(e) => {
                  setInputPin(e.target.value.replace(/\D/g, ''));
                  setFeedback(null);
                }}
                placeholder="e.g. 560102"
                className="flex-1 px-4 py-3 text-base font-bold tracking-widest text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838] focus:ring-2 focus:ring-[#218838]/20"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-3 bg-[#218838] hover:bg-[#1a6f2d] text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-700/20 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {loading ? 'Checking...' : 'Check'}
              </button>
            </div>
          </form>

          {/* Feedback message */}
          {feedback && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                feedback.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {feedback.success ? (
                <CheckCircle className="w-4 h-4 text-[#218838] shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed">
                <p className="font-semibold">{feedback.message}</p>
                {!feedback.success && (
                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 font-bold text-[#218838] hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Request Delivery for {inputPin} on WhatsApp
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Current Area Details */}
          {selectedArea && !feedback && (
            <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-[#218838] font-bold uppercase tracking-wider block">
                  Currently Delivering To
                </span>
                <span className="font-bold text-gray-800">{selectedArea.area_name}</span>
              </div>
              <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                PIN {selectedPincode}
              </span>
            </div>
          )}

          {/* Popular Localities */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FFC928]" /> Quick-Select Bengaluru Zones
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {POPULAR_AREAS.map((item) => (
                <button
                  key={item.pin}
                  onClick={() => handleSelectArea(item.pin)}
                  className={`p-2.5 text-left rounded-xl border transition-all cursor-pointer ${
                    selectedPincode === item.pin
                      ? 'border-[#218838] bg-emerald-50/70 font-bold text-[#14532D]'
                      : 'border-gray-200/80 hover:border-emerald-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-[10px] text-gray-400">PIN {item.pin}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
