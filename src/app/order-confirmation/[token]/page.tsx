import React from 'react';
import { getOrderByLookupToken, getSettings } from '@/lib/store';
import OrderConfirmationView from '@/components/OrderConfirmationView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const decodedToken = decodeURIComponent(token || '');

  const [order, settings] = await Promise.all([
    getOrderByLookupToken(decodedToken),
    getSettings(),
  ]);

  return (
    <OrderConfirmationView
      initialOrder={order}
      token={decodedToken}
      settings={settings}
    />
  );
}
