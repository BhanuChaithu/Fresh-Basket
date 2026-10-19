import React from 'react';
import Link from 'next/link';
import { ShieldCheck, RefreshCw, XCircle, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Cancellation and Refund Policy | Fresh Basket Bengaluru',
  description: 'Understand Fresh Basket’s doorstep inspection guarantee, order cancellation cutoffs, and produce refund policy.',
};

export default function CancellationAndRefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <span className="text-xs font-bold text-[#218838] uppercase tracking-wider">
          Fair Customer Guarantee
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mt-1">
          Cancellation & Refund Policy
        </h1>
        <p className="text-xs text-gray-400 mt-1">Last Updated: October 2026</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-2xs space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#218838]" /> 1. Doorstep Inspection Guarantee
          </h2>
          <p>
            Because vegetables and fruits are fresh natural perishables, <strong>we insist that you inspect your items at the time of delivery</strong>.
          </p>
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-900 space-y-1">
            <h4 className="font-bold">Zero-Hassle Doorstep Rejection</h4>
            <p className="text-xs">
              If any vegetable or fruit does not meet your quality standards upon inspection, simply return that individual item to the delivery partner on the spot. The amount will be deducted from your Cash on Delivery or UPI total immediately.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" /> 2. Order Cancellation
          </h2>
          <p>
            You may cancel your order at <strong>₹0 penalty</strong> before the respective farm harvest cutoff:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>
              <strong>Morning Delivery (7 AM – 10 AM):</strong> You can cancel anytime before <strong>09:00 PM</strong> of the previous evening.
            </li>
            <li>
              <strong>Evening Delivery (4 PM – 7 PM):</strong> You can cancel anytime before <strong>12:00 PM Noon</strong> of the delivery day.
            </li>
          </ul>
          <p className="text-xs text-gray-500">
            Once fresh produce has been harvested and packed specifically for your pre-order, cancellations cannot be processed as the harvest cannot be preserved in cold storage.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-[#218838]" /> 3. Post-Delivery Quality Concerns
          </h2>
          <p>
            In the event that an item is found defective after delivery (e.g., internal damage in a papaya or pomegranate not visible externally), please send a photo to our WhatsApp support within <strong>12 hours</strong> of delivery.
          </p>
          <p>
            We will gladly provide a replacement in your next basket or initiate an immediate UPI refund for the affected item.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">4. Refund Processing Time</h2>
          <p>
            For verified digital payments (UPI), refunds are processed directly to your original UPI VPA within <strong>24 to 48 hours</strong> with zero processing fees.
          </p>
        </section>
      </div>
    </div>
  );
}
