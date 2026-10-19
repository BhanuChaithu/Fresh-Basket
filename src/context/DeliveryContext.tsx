'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DeliveryArea, BusinessSettings, CartItem } from '@/lib/types';
import { INITIAL_SETTINGS } from '@/lib/local-data';

interface DeliveryContextType {
  selectedPincode: string;
  selectedArea: DeliveryArea | null;
  isServiceable: boolean;
  isModalOpen: boolean;
  settings: BusinessSettings;
  setIsModalOpen: (open: boolean) => void;
  checkAndSetPincode: (pincode: string) => Promise<{ success: boolean; message: string }>;
  generateWhatsAppCartUrl: (items: CartItem[], notes?: string) => string;
  generateWhatsAppProductUrl: (productName: string, unit: string, price: number) => string;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export function DeliveryProvider({ children }: { children: React.ReactNode }) {
  const [selectedPincode, setSelectedPincode] = useState('560102'); // Default to HSR Layout
  const [selectedArea, setSelectedArea] = useState<DeliveryArea | null>(null);
  const [isServiceable, setIsServiceable] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [settings, setSettings] = useState<BusinessSettings>(INITIAL_SETTINGS);

  // Fetch store settings on mount
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {
        // Fallback to initial settings
      });

    // Check saved pincode
    const savedPin = localStorage.getItem('fresh_basket_pincode');
    if (savedPin) {
      checkAndSetPincode(savedPin);
    } else {
      checkAndSetPincode('560102');
    }
  }, []);

  const checkAndSetPincode = async (pincode: string) => {
    try {
      const res = await fetch('/api/delivery-areas/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincode }),
      });
      const data = await res.json();

      setSelectedPincode(pincode);
      if (data.is_serviceable && data.area) {
        setSelectedArea(data.area);
        setIsServiceable(true);
        localStorage.setItem('fresh_basket_pincode', pincode);
        return { success: true, message: data.message };
      } else {
        setSelectedArea(null);
        setIsServiceable(false);
        return { success: false, message: data.message };
      }
    } catch {
      return { success: false, message: 'Could not verify delivery area.' };
    }
  };

  const generateWhatsAppCartUrl = (items: CartItem[], notes?: string) => {
    const phone = settings.whatsapp_number.replace(/\D/g, '') || '919876543210';
    let text = `🧺 *FRESH BASKET - ORDER ENQUIRY*\n`;
    text += `_Honest Prices. Bengaluru Farm Fresh._\n\n`;

    let subtotal = 0;
    items.forEach((item, idx) => {
      const total = item.product.current_price * item.quantity;
      subtotal += total;
      text += `${idx + 1}. *${item.product.name}*\n   Qty: ${item.quantity} x ${item.product.unit} (₹${item.product.current_price}) = ₹${total}\n`;
    });

    text += `\n*Estimated Produce Subtotal:* ₹${subtotal}\n`;
    if (selectedArea) {
      text += `*Delivery Area:* ${selectedArea.area_name} (PIN: ${selectedPincode})\n`;
    } else {
      text += `*Delivery PIN:* ${selectedPincode}\n`;
    }

    if (notes) {
      text += `*Notes:* ${notes}\n`;
    }

    text += `\nPlease confirm item availability and next delivery slot for my address!`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  const generateWhatsAppProductUrl = (productName: string, unit: string, price: number) => {
    const phone = settings.whatsapp_number.replace(/\D/g, '') || '919876543210';
    const text = `Hi Fresh Basket! I would like to enquire about ordering *${productName}* (${unit} at ₹${price}). Are fresh harvests available for delivery in ${selectedPincode}?`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <DeliveryContext.Provider
      value={{
        selectedPincode,
        selectedArea,
        isServiceable,
        isModalOpen,
        settings,
        setIsModalOpen,
        checkAndSetPincode,
        generateWhatsAppCartUrl,
        generateWhatsAppProductUrl,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDelivery() {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
}
