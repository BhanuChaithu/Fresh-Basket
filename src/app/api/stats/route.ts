import { NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/store';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const stats = await getDashboardStats();
    return NextResponse.json({ success: true, stats });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
