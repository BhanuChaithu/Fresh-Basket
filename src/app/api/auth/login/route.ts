import { NextRequest, NextResponse } from 'next/server';
import { signToken, setAdminSessionCookie } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // 1. If Supabase Auth is enabled, try authenticating via Supabase
    if (supabase) {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: String(password),
      });

      if (!authError && authData.user) {
        const token = signToken({ email: authData.user.email || cleanEmail, role: 'admin' });
        await setAdminSessionCookie(token);
        return NextResponse.json({
          success: true,
          admin: { email: authData.user.email, role: 'admin' },
        });
      }
    }

    // 2. Default initial administrator authentication fallback
    // Matches default environment variable credentials or ADMIN_DEFAULT_EMAIL/ADMIN_DEFAULT_PASSWORD
    const validEmail = (process.env.ADMIN_DEFAULT_EMAIL || 'admin@freshbasket.in').toLowerCase();
    const validPass = process.env.ADMIN_DEFAULT_PASSWORD || 'FreshBasket2026!';

    if (cleanEmail === validEmail && password === validPass) {
      const token = signToken({ email: cleanEmail, role: 'super_admin' });
      await setAdminSessionCookie(token);
      return NextResponse.json({
        success: true,
        admin: { email: cleanEmail, role: 'super_admin' },
      });
    }

    return NextResponse.json(
      { error: 'Invalid administrator credentials. Please check your email and password.' },
      { status: 401 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Login failed' },
      { status: 500 }
    );
  }
}
