import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Fresh Basket Bengaluru',
  description: 'Learn how Fresh Basket protects customer information, handles guest checkout data, and ensures zero spam in Bengaluru.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <span className="text-xs font-bold text-[#218838] uppercase tracking-wider">
          Legal & Trust
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mt-1">
          Privacy Policy
        </h1>
        <p className="text-xs text-gray-400 mt-1">Last Updated: October 2026</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-2xs space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">1. Introduction</h2>
          <p>
            FRESH BASKET (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates an everyday vegetable and fruit delivery service in Bengaluru, Karnataka, India. We are deeply committed to respecting your privacy and protecting the personal information you share with us.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">2. Information We Collect</h2>
          <p>We collect only the minimal information strictly required to fulfill your grocery delivery:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li><strong>Name:</strong> To identify the recipient upon doorstep delivery.</li>
            <li><strong>Mobile Number:</strong> To coordinate delivery dispatch, provide status updates, and verify your order on WhatsApp.</li>
            <li><strong>Delivery Address, Locality & PIN Code:</strong> To navigate to your doorstep and verify serviceable Bengaluru neighbourhoods.</li>
            <li><strong>Optional Delivery Instructions:</strong> Such as gate codes or apartment directions.</li>
          </ul>
          <p>
            We do <strong>not</strong> collect or store credit card numbers, debit card PINs, CVVs, or online banking passwords.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">3. How We Use Your Information</h2>
          <p>Your details are used solely for:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Procuring and preparing your fresh produce order.</li>
            <li>Navigating our delivery logistics team to your Bengaluru address.</li>
            <li>Generating your digital order receipt and order lookup token.</li>
            <li>Customer service communication regarding product availability or delivery slot adjustments.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">4. Zero Data Selling & Anti-Spam Guarantee</h2>
          <p>
            We will <strong>never sell, lease, or rent</strong> your personal information, address, or phone number to any third-party marketing agencies, aggregators, or brokers. We do not blast promotional robocalls or unsolicited spam marketing messages.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">5. Data Security</h2>
          <p>
            Our website utilizes secure HTTPS encryption, modern Row Level Security (RLS) on our database layer, and environment-protected credentials. Public order lookup links use unpredictable, cryptographically random tokens to prevent sequential guessing of orders.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">6. Contact & Data Deletion Requests</h2>
          <p>
            If you wish to request the removal or deletion of your contact records from our order database, please email us at{' '}
            <a href="mailto:hello@freshbasket.in" className="text-[#218838] font-bold hover:underline">
              hello@freshbasket.in
            </a>{' '}
            or WhatsApp our support team.
          </p>
        </section>
      </div>
    </div>
  );
}
