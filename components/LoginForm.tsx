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
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">
          Email Address
        </label>
        <input
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#ff5b00] focus:bg-white/10 transition"
          type="email"
          placeholder="e.g. rider@foodies.com or admin@foodies.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">
          Password
        </label>
        <input
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#ff5b00] focus:bg-white/10 transition"
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
        className="w-full rounded-xl bg-gradient-to-r from-[#ff5b00] to-[#ff3b00] py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-orange-600/30 transition hover:bg-[#e05000] hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 mt-2"
      >
        {busy ? 'Authenticating...' : 'Sign In to Account'}
      </button>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-bold text-red-400 text-center">
          {error}
        </div>
      )}
    </form>
  );
}
