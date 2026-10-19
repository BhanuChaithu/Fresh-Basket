import React from 'react';
import Link from 'next/link';
import { HelpCircle, MessageCircle, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Frequently Asked Questions | Fresh Basket Bengaluru',
  description: 'Find answers about ordering farm fresh vegetables and fruits, delivery slots in Bengaluru, and our zero-cold-storage model.',
};

const FAQS = [
  {
    q: 'How does Fresh Basket guarantee freshness without holding warehouse inventory?',
    a: 'We operate on a direct pre-order model. When you place an order before 9:00 PM, we consolidate the harvest requirements for next morning. Our partner growers in Kolar, Hoskote, and local farm belts harvest and harvest pick at dawn. We grade, pack, and dispatch immediately to your doorstep. There is zero warehouse chilling or multiday holding.',
  },
  {
    q: 'How do I order using WhatsApp?',
    a: 'You can build your cart directly on our website and click "Send Cart to WhatsApp", which generates an organized itemized message with quantities and prices. Alternatively, you can directly message our WhatsApp number (+91 98765 43210) with your grocery list. Our team verifies daily harvest availability and confirms your delivery slot.',
  },
  {
    q: 'Which PIN codes in Bengaluru do you currently serve?',
    a: 'We currently serve active neighbourhoods including HSR Layout (560102), Koramangala (560034), Indiranagar (560038), BTM Layout (560076), Jayanagar (560041), JP Nagar (560078), Bellandur (560103), Whitefield (560066), Madivala (560068), and Sarjapur Road (560035). We are continuously expanding across Bengaluru based on society pre-orders.',
  },
  {
    q: 'What are the delivery charges and free delivery threshold?',
    a: 'All orders of ₹299 and above receive 100% FREE delivery across our active Bengaluru PIN codes! For smaller orders below ₹299, a modest delivery fee between ₹25 and ₹40 is applied depending on your neighbourhood to cover local delivery partner expenses.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Cash on Delivery (COD) and manual UPI payments (Google Pay, PhonePe, Paytm, BHIM). You can inspect your produce at your doorstep first, and then hand over cash or scan the delivery executive’s UPI QR card. No credit card or paid gateway fees are charged.',
  },
  {
    q: 'What happens if I receive a damaged or substandard vegetable or fruit?',
    a: 'Your satisfaction is our priority. Because we encourage inspection at delivery, you can reject any substandard item immediately on the spot, and our delivery partner will deduct that amount from your bill. If you discover an issue later, simply WhatsApp us a photo within 12 hours for an immediate credit or replacement on your next delivery.',
  },
  {
    q: 'Why are some products labeled "Sample Data"?',
    a: 'During our platform rollout, certain seasonal produce entries are labeled as Sample Data for demonstration. The store administrator verifies daily wholesale prices and active stock availability before accepting live customer orders, ensuring you always receive genuine, verified farm rates.',
  },
  {
    q: 'Can I set up a recurring weekly vegetable basket?',
    a: 'Yes! Our weekly vegetable and fruit combo baskets are curated to cover 5-7 days of balanced nutrition for small to large Bengaluru families. You can re-order weekly or contact us on WhatsApp to schedule an automated weekly harvest delivery.',
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="bg-emerald-100 text-[#14532D] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
          Customer Questions
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Everything you need to know about Fresh Basket&apos;s lean sourcing and Bengaluru delivery service.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs space-y-2"
          >
            <h3 className="font-bold text-base text-gray-900 flex items-start gap-2.5">
              <HelpCircle className="w-5 h-5 text-[#218838] shrink-0 mt-0.5" />
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 pl-7 leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      {/* Still have questions */}
      <div className="bg-gradient-to-r from-[#14532D] to-[#218838] p-8 rounded-3xl text-white text-center space-y-4 shadow-lg">
        <h3 className="text-xl font-bold">Have another question?</h3>
        <p className="text-xs text-emerald-100 max-w-md mx-auto">
          Our team is available on WhatsApp every day from 7:00 AM to 9:00 PM to help you with order enquiries.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-[#FFC928] hover:bg-[#e5b320] text-[#14532D] px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-all"
        >
          <span>Contact Our Bengaluru Team</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
