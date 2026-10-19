'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  MapPin,
  MessageCircle,
  Truck,
  DollarSign,
  Plus,
  Check,
  AlertCircle,
  Save,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import { BusinessSettings, DeliveryArea } from '@/lib/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ success: boolean; text: string } | null>(null);

  // New PIN modal / form
  const [newPin, setNewPin] = useState('');
  const [newAreaName, setNewAreaName] = useState('');
  const [newMinOrder, setNewMinOrder] = useState('199');
  const [newDeliveryFee, setNewDeliveryFee] = useState('30');

  useEffect(() => {
    Promise.all([
      fetch('/api/settings').then((res) => res.json()),
      fetch('/api/delivery-areas').then((res) => res.json()),
    ]).then(([setData, areaData]) => {
      if (setData.settings) setSettings(setData.settings);
      if (areaData.areas) setDeliveryAreas(areaData.areas);
      setLoading(false);
    });
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMsg({ success: true, text: 'Store and WhatsApp settings saved to database!' });
        setTimeout(() => setStatusMsg(null), 3000);
      } else {
        alert(data.error || 'Failed to save settings');
      }
    } catch {
      alert('Error updating settings');
    }
  };

  const handleAddDeliveryArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin.trim() || !newAreaName.trim()) {
      alert('PIN and Area name are required');
      return;
    }

    try {
      const res = await fetch('/api/delivery-areas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pincode: newPin.trim(),
          area_name: newAreaName.trim(),
          min_order_value: parseFloat(newMinOrder) || 199,
          delivery_charge: parseFloat(newDeliveryFee) || 0,
          is_active: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDeliveryAreas((prev) => [...prev, data.area]);
        setNewPin('');
        setNewAreaName('');
        setStatusMsg({ success: true, text: `Added PIN ${data.area.pincode} (${data.area.area_name}) to serviceable zones!` });
        setTimeout(() => setStatusMsg(null), 3000);
      }
    } catch {
      alert('Error adding delivery area');
    }
  };

  const handleToggleAreaActive = async (area: DeliveryArea) => {
    try {
      const updated = { ...area, is_active: !area.is_active };
      const res = await fetch('/api/delivery-areas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        setDeliveryAreas((prev) =>
          prev.map((a) => (a.id === area.id ? data.area : a))
        );
      }
    } catch {
      alert('Error toggling delivery area');
    }
  };

  if (loading || !settings) {
    return <div className="p-12 text-center text-xs text-gray-400">Loading settings...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Delivery Zones & Business Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Configure WhatsApp numbers, Bengaluru serviceable PIN codes, delivery thresholds, and payment settings.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
            statusMsg.success
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {statusMsg.success ? (
            <Check className="w-4 h-4 text-[#218838] shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 text-xs">
        <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider text-gray-500 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-[#218838]" /> 1. WhatsApp & Store Contact Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              WhatsApp Business Phone (Digits only, including country code 91) *
            </label>
            <input
              type="text"
              required
              value={settings.whatsapp_number}
              onChange={(e) =>
                setSettings({ ...settings, whatsapp_number: e.target.value.replace(/\D/g, '') })
              }
              placeholder="919876543210"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838] font-mono font-bold"
            />
            <span className="text-[10px] text-gray-400 mt-0.5 block">
              Used for ₹0 WhatsApp Click-to-Chat buttons (e.g. wa.me/919876543210)
            </span>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Display Phone Number (Formatted for customers)
            </label>
            <input
              type="text"
              value={settings.display_phone}
              onChange={(e) => setSettings({ ...settings, display_phone: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              placeholder="hello@freshbasket.in"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Brand Slogan
            </label>
            <input
              type="text"
              value={settings.slogan}
              onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
              placeholder="Fresh Produce. Honest Prices. Delivered with Care."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
            />
          </div>
        </div>

        {/* Pricing & Free Delivery Rules */}
        <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider text-gray-500 pt-4 border-t border-gray-100 flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#218838]" /> 2. Delivery Thresholds & Fees
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Free Delivery Order Threshold (₹)
            </label>
            <input
              type="number"
              value={settings.free_delivery_threshold}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  free_delivery_threshold: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838] font-bold"
            />
            <span className="text-[10px] text-gray-400 mt-0.5 block">
              Orders above this get 100% free delivery
            </span>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Standard Bengaluru Delivery Charge (₹)
            </label>
            <input
              type="number"
              value={settings.standard_delivery_charge}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  standard_delivery_charge: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838] font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Minimum Order Value (₹)
            </label>
            <input
              type="number"
              value={settings.minimum_order_value}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  minimum_order_value: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838] font-bold"
            />
          </div>
        </div>

        {/* Payment Settings */}
        <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider text-gray-500 pt-4 border-t border-gray-100 flex items-center gap-2">
          <QrCode className="w-4 h-4 text-[#218838]" /> 3. UPI & Cash on Delivery Options
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Business UPI ID / VPA
            </label>
            <input
              type="text"
              value={settings.upi_id}
              onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
              placeholder="freshbasket@upi"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838] font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              UPI Account Name
            </label>
            <input
              type="text"
              value={settings.upi_account_name}
              onChange={(e) => setSettings({ ...settings, upi_account_name: e.target.value })}
              placeholder="Fresh Basket Bengaluru"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-[#218838] hover:bg-[#1a6f2d] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Store Settings</span>
        </button>
      </form>

      {/* Serviceable PIN Codes Management */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#218838]" /> Serviceable Bengaluru PIN Codes ({deliveryAreas.length})
            </h3>
            <p className="text-gray-400 mt-0.5">
              Customers will be allowed to place orders only if their PIN is active in this list.
            </p>
          </div>
        </div>

        {/* Add new PIN Code inline form */}
        <form onSubmit={handleAddDeliveryArea} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
          <span className="font-bold text-gray-800 block text-xs">Add New Bengaluru Delivery Zone</span>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <input
                type="text"
                required
                maxLength={6}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                placeholder="PIN Code (e.g. 560095)"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-xs"
              />
            </div>
            <div className="sm:col-span-2">
              <input
                type="text"
                required
                value={newAreaName}
                onChange={(e) => setNewAreaName(e.target.value)}
                placeholder="Area Name (e.g. Koramangala 4th Block)"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2 bg-[#218838] hover:bg-[#1a6f2d] text-white font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add PIN
              </button>
            </div>
          </div>
        </form>

        {/* PIN Codes Table */}
        <div className="overflow-x-auto border border-gray-100 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-3">PIN Code</th>
                <th className="py-2.5 px-3">Neighbourhood</th>
                <th className="py-2.5 px-3">Min Order</th>
                <th className="py-2.5 px-3">Delivery Fee</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {deliveryAreas.map((area) => (
                <tr key={area.id} className="hover:bg-gray-50/70">
                  <td className="py-2.5 px-3 font-mono font-bold text-gray-900">{area.pincode}</td>
                  <td className="py-2.5 px-3 text-gray-800">{area.area_name}</td>
                  <td className="py-2.5 px-3 font-semibold">₹{area.min_order_value}</td>
                  <td className="py-2.5 px-3 font-semibold">₹{area.delivery_charge}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => handleToggleAreaActive(area)}
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] cursor-pointer ${
                        area.is_active
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {area.is_active ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
