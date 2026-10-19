import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms and Conditions | Fresh Basket Bengaluru',
  description: 'Terms of service for ordering fresh vegetables and fruits through Fresh Basket in Bengaluru.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <span className="text-xs font-bold text-[#218838] uppercase tracking-wider">
          Legal Agreement
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mt-1">
          Terms & Conditions
        </h1>
        <p className="text-xs text-gray-400 mt-1">Last Updated: October 2026</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-2xs space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or placing an order through the Fresh Basket website or our official WhatsApp channels, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, please do not use our service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">2. Pre-Order & Direct Procurement Model</h2>
          <p>
            Fresh Basket operates without permanent cold warehouses to eliminate food wastage and maximize produce freshness. You acknowledge that produce is procured and harvested based on pre-orders. In the rare event that a specific crop is unavailable from our grower clusters due to adverse weather or pest damage, we will notify you before dispatch to offer a substitution or remove the item from your final bill.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">3. Weight Variations & Agricultural Nature of Produce</h2>
          <p>
            Fresh vegetables, fruits, and leafy greens are natural agricultural commodities. While we strive to pack items exactly as specified (e.g. 1 kg, 500 g, or 1 bunch), minor natural weight variances (within ±5%) may occur during sorting and packing. All prices are calculated transparently.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">4. Pricing & Currency</h2>
          <p>
            All prices listed on Fresh Basket are in Indian Rupees (INR, ₹) and include applicable local agricultural taxes. Prices are updated dynamically to reflect wholesale mandi and farm-gate rates. Prices placed on confirmed orders remain fixed and will not change.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">5. Verification of Sample Produce Items</h2>
          <p>
            Certain seasonal items on the website may be labeled with a &quot;Sample Data&quot; badge for platform testing and demonstration purposes. Store administrators verify and update exact farm prices and stock before accepting live customer fulfillment.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">6. Governing Law & Jurisdiction</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of India, and any disputes relating to these terms shall be subject to the exclusive jurisdiction of the courts of Bengaluru, Karnataka, India.
          </p>
        </section>
      </div>
    </div>
  );
}
