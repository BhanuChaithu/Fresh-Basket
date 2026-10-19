import { NextRequest, NextResponse } from 'next/server';
import { getOrderByLookupToken, lookupOrder } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const { token, order_number, phone } = await req.json();

    let order = null;

    if (token) {
      order = await getOrderByLookupToken(String(token).trim());
    } else if (order_number && phone) {
      order = await lookupOrder(String(order_number).trim(), String(phone).trim());
    } else {
      return NextResponse.json(
        { error: 'Please provide either a secure order tracking link/token OR your Order Number and Mobile Number.' },
        { status: 400 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { error: 'No matching order found. Please verify your order number and phone number.' },
        { status: 404 }
      );
    }

    // Strip private internal notes before returning to public customer
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { internal_notes, ...safeOrder } = order;

    return NextResponse.json({ success: true, order: safeOrder });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Order lookup failed' },
      { status: 500 }
    );
  }
}
