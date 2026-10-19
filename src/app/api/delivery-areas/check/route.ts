import { NextRequest, NextResponse } from 'next/server';
import { checkPincode } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const { pincode } = await req.json();
    if (!pincode) {
      return NextResponse.json({ error: 'PIN code is required' }, { status: 400 });
    }

    const result = await checkPincode(String(pincode));
    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error verifying PIN code' },
      { status: 500 }
    );
  }
}
