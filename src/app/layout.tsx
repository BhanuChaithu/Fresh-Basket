import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { DeliveryProvider } from '@/context/DeliveryContext';
import ClientShell from '@/components/ClientShell';

export const metadata: Metadata = {
  title: 'Fresh Basket | Fresh Vegetables & Fruits Delivery in Bengaluru',
  description:
    'Fresh Produce. Honest Prices. Delivered with Care. Order farm-fresh vegetables, seasonal fruits, and weekly family baskets in Bengaluru online or through WhatsApp at transparent ₹/kg rates.',
  keywords: [
    'Fresh Basket',
    'Vegetables Bengaluru',
    'Fruits delivery Bangalore',
    'Farm fresh produce',
    'HSR Layout vegetable delivery',
    'Koramangala organic fruits',
    'WhatsApp grocery ordering',
    'Honest prices produce',
  ],
  authors: [{ name: 'Fresh Basket Bengaluru' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Fresh Basket | Farm Fresh Produce in Bengaluru',
    description:
      'Honest prices, daily harvests, and weekly baskets delivered directly to your doorstep in Bengaluru.',
    siteName: 'Fresh Basket',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#F7FAF5] text-[#1F2937]">
        <DeliveryProvider>
          <CartProvider>
            <ClientShell>{children}</ClientShell>
          </CartProvider>
        </DeliveryProvider>
      </body>
    </html>
  );
}
