'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, Lock, Mail, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@freshbasket.in');
  const [password, setPassword] = useState('FreshBasket2026!');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Authentication failed. Please check credentials.');
        return;
      }

      // Successful login
      router.push('/admin');
      router.refresh();
    } catch {
      setLoading(false);
      setErrorMsg('Login request failed. Please check your network connection.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#14532D] to-[#218838] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#218838] text-white flex items-center justify-center mx-auto shadow-md">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Fresh Basket Admin
          </h1>
          <p className="text-xs text-gray-500">
            Secure Portal for Store Owners & Fulfillment Operators
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@freshbasket.in"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#218838] hover:bg-[#1a6f2d] text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-700/20 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security & Credentials info notice */}
        <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-[11px] text-gray-600 space-y-1 leading-relaxed">
          <div className="font-bold text-gray-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#218838]" /> Initial Credentials Loaded
          </div>
          <p>
            Default demo administrator credentials have been pre-filled for immediate testing. Custom credentials can be configured in your <code className="bg-gray-200 px-1 py-0.5 rounded text-[10px]">.env.local</code> file or via Supabase Auth.
          </p>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-900 font-semibold">
            ← Back to Public Store
          </Link>
        </div>
      </div>
    </div>
  );
}
