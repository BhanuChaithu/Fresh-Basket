'use client';

import React, { useState } from 'react';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
} from 'lucide-react';
import { useDelivery } from '@/context/DeliveryContext';

export default function ContactPage() {
  const { settings } = useDelivery();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappPhone = settings.whatsapp_number.replace(/\D/g, '') || '919876543210';
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    'Hi Fresh Basket! I would like to enquire about placing a fresh produce order in Bengaluru.'
  )}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="bg-emerald-100 text-[#14532D] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
          We&apos;re Here to Help
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
          Contact Fresh Basket
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Reach our Bengaluru team for order queries, delivery requests, or bulk corporate vegetable basket enquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Direct WhatsApp Callout */}
          <div className="bg-gradient-to-r from-[#14532D] to-[#218838] text-white p-6 rounded-3xl shadow-md space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center">
              <MessageCircle className="w-5 h-5 fill-white" />
            </div>
            <h3 className="font-bold text-lg text-white">Instant WhatsApp Support</h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              For fastest response on daily harvest availability and delivery status, chat with us on WhatsApp.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[#14532D] font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors shadow-xs"
            >
              <span>Message {settings.display_phone}</span>
            </a>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-[#218838] rounded-xl shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-gray-900 block">Initial Operational Base</span>
                <p className="text-gray-600 mt-0.5">
                  Serving HSR Layout, Koramangala, Indiranagar, BTM Layout, Jayanagar, Bellandur, Whitefield & Sarjapur Road.
                  <br />
                  Bengaluru, Karnataka, India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-[#218838] rounded-xl shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-gray-900 block">Delivery Timings & Cut-offs</span>
                <p className="text-gray-600 mt-0.5">
                  Morning Slot: 07:00 AM – 10:00 AM (Order before 9 PM)
                  <br />
                  Evening Slot: 04:00 PM – 07:00 PM (Order before 12 PM)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-[#218838] rounded-xl shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-gray-900 block">Email Inquiries</span>
                <a href={`mailto:${settings.contact_email}`} className="text-[#218838] hover:underline">
                  {settings.contact_email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-black text-lg text-gray-900">Send Us a Direct Message</h3>
          <p className="text-xs text-gray-500">
            Have a custom produce request or wish to request delivery for an unlisted Bengaluru PIN code?
          </p>

          {submitted ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-[#218838] mx-auto" />
              <h4 className="font-bold text-base text-gray-900">Message Received!</h4>
              <p className="text-xs text-gray-600">
                Thank you, {form.name}. Our Bengaluru team will contact you shortly on WhatsApp or phone.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Priya Nair"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Mobile Number / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Your Message or Delivery Location *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us what vegetables/fruits you need or which Bengaluru apartment/society you are located in..."
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#218838] hover:bg-[#1a6f2d] text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-700/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
