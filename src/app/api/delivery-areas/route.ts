import { NextRequest, NextResponse } from 'next/server';
import { getDeliveryAreas, saveDeliveryArea } from '@/lib/store';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const areas = await getDeliveryAreas();
    return NextResponse.json({ success: true, areas });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch delivery areas' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.pincode || !body.area_name) {
      return NextResponse.json(
        { error: 'PIN code and Area Name are required' },
        { status: 400 }
      );
    }

    const saved = await saveDeliveryArea(body);
    return NextResponse.json({ success: true, area: saved });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to save delivery area' },
      { status: 500 }
    );
  }
}
