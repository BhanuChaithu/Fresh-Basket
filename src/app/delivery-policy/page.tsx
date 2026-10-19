import React from 'react';
import Link from 'next/link';
import { Truck, Clock, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { INITIAL_DELIVERY_AREAS } from '@/lib/local-data';

export const metadata = {
  title: 'Delivery Policy | Fresh Basket Bengaluru',
  description: 'Delivery slots, serviceable Bengaluru PIN codes, free delivery thresholds, and cut-off timings for Fresh Basket.',
};

export default function DeliveryPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <span className="text-xs font-bold text-[#218838] uppercase tracking-wider">
          Fulfillment Guidelines
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mt-1">
          Delivery Policy
        </h1>
        <p className="text-xs text-gray-400 mt-1">Last Updated: October 2026</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-2xs space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#218838]" /> 1. Delivery Slots & Daily Cut-Off Timings
          </h2>
          <p>
            Because we procure produce freshly harvested at dawn rather than holding stock in cold warehouses, we operate with strict harvest cut-off windows:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="font-bold text-[#14532D] block">Morning Slot (07:00 AM – 10:00 AM)</span>
              <p className="text-xs text-emerald-800 mt-1">
                <strong>Cut-off: 09:00 PM</strong> of the previous evening. Ideal for your daily morning cooking and lunchbox preparations.
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <span className="font-bold text-amber-900 block">Evening Slot (04:00 PM – 07:00 PM)</span>
              <p className="text-xs text-amber-800 mt-1">
                <strong>Cut-off: 12:00 PM Noon</strong> of the same day. Consolidated for dinner cooking and next-day meal prep.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FFC928]" /> 2. Delivery Charges & Free Delivery Threshold
          </h2>
          <p>
            We keep delivery fees completely transparent with ₹0 hidden markups:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>
              <strong>Orders ₹299 and above:</strong> 100% <strong>FREE Delivery</strong> across all serviceable Bengaluru PIN codes.
            </li>
            <li>
              <strong>Orders below ₹299:</strong> A nominal delivery fee of ₹25 to ₹40 applies depending on your zone to support our local delivery drivers.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#218838]" /> 3. Serviceable Bengaluru PIN Codes
          </h2>
          <p>
            We currently deliver to the following neighbourhoods and PIN codes in Bengaluru:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {INITIAL_DELIVERY_AREAS.map((area) => (
              <div
                key={area.id}
                className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-gray-900">{area.area_name.split('/')[0]}</span>
                  <span className="text-gray-400 block text-[11px]">{area.area_name}</span>
                </div>
                <span className="font-black text-[#14532D] bg-white px-2 py-1 rounded-md border border-gray-200 shrink-0">
                  {area.pincode}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 pt-1">
            If your PIN code is not listed, you can request bulk society or community delivery via our WhatsApp line.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">4. Customer Unavailability at Delivery</h2>
          <p>
            Our delivery executive will call your registered mobile number upon arrival. If you are unavailable or prefer contactless drop-off, the package can be handed to your building security desk or left at your door as instructed during checkout.
          </p>
        </section>
      </div>
    </div>
  );
}
