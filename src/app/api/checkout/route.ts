import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      customer_name,
      customer_phone,
      customer_email,
      delivery_address,
      neighbourhood,
      pincode,
      delivery_slot,
      delivery_instructions,
      payment_method,
      upi_reference,
      items,
    } = body;

    // Required field validation
    if (!customer_name || !customer_name.trim()) {
      return NextResponse.json({ error: 'Please enter your full name' }, { status: 400 });
    }
    if (!customer_phone || !customer_phone.trim()) {
      return NextResponse.json({ error: 'Please enter your mobile number' }, { status: 400 });
    }

    const cleanPhone = customer_phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit mobile number' },
        { status: 400 }
      );
    }

    if (!delivery_address || !delivery_address.trim()) {
      return NextResponse.json({ error: 'Please enter your delivery address' }, { status: 400 });
    }
    if (!neighbourhood || !neighbourhood.trim()) {
      return NextResponse.json({ error: 'Please enter your neighbourhood/locality' }, { status: 400 });
    }
    if (!pincode || !pincode.trim()) {
      return NextResponse.json({ error: 'Please enter your PIN code' }, { status: 400 });
    }
    if (!delivery_slot) {
      return NextResponse.json({ error: 'Please select a delivery slot' }, { status: 400 });
    }
    if (!payment_method || !['Cash on Delivery', 'Manual UPI'].includes(payment_method)) {
      return NextResponse.json({ error: 'Please select a valid payment method' }, { status: 400 });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 });
    }

    const result = await createOrder({
      customer_name,
      customer_phone,
      customer_email,
      delivery_address,
      neighbourhood,
      pincode,
      delivery_slot,
      delivery_instructions,
      payment_method,
      upi_reference,
      items,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      order: result.order,
      lookup_token: result.order.lookup_token,
      order_number: result.order.order_number,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Checkout processing failed' },
      { status: 500 }
    );
  }
}
