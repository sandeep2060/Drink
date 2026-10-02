'use client';

import { FormEvent, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setError('Sign-in is unavailable until Supabase is configured.');
      return;
    }

    setBusy(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setBusy(false);
      return;
    }

    // Check user role from profiles
    const { data } = await supabase.from('profiles').select('role').single();
    const role = String(data?.role || '').toUpperCase();

    // Store current login session role in localStorage for frontend client views
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('drinkdrop_user_role', role);
      window.localStorage.setItem('drinkdrop_user_email', email);
    }

    // Redirect based on role
    if (role === 'RIDER') {
      router.push('/rider');
    } else if (role === 'ADMIN') {
      router.push('/admin');
    } else if (role === 'MANAGER') {
      router.push('/manager');
    } else if (role === 'DEALER') {
      router.push('/dealer');
    } else {
      router.push('/customer');
    }

    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
        <input
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white"
          type="email"
          placeholder="e.g. rider@drinkdrop.com or admin@drinkdrop.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
        <input
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        disabled={busy}
        type="submit"
        className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? 'Signing in...' : 'Sign In to Account'}
      </button>

      {error && <p className="text-xs font-bold text-red-600 text-center">{error}</p>}
    </form>
  );
}
