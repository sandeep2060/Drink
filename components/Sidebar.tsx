'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  Bike,
  Box,
  ClipboardList,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Settings,
  ShoppingBag,
  Store,
  Users,
} from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase';

const items = [
  ['Dashboard', '/admin', LayoutDashboard],
  ['Customer Shop', '/customer', ShoppingBag],
  ['Orders', '/orders', ClipboardList],
  ['Dealers', '/admin/dealers', Store],
  ['Riders', '/admin/riders', Bike],
  ['Customers', '/admin/customers', Users],
  ['Products', '/admin/products', Box],
  ['Reports', '/reports', BarChart3],
  ['Support', '/manager', LifeBuoy],
  ['Settings', '/admin/settings', Settings],
] as const;

export function Sidebar({ role = 'ADMIN' }: { role?: string }) {
  const path = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [siteSettings, setSiteSettings] = useState<{ system_name?: string; logo_text?: string; logo_url?: string }>({
    system_name: 'Drinks & Grocery Delivery',
    logo_text: 'DD',
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const json = await res.json();
          if (json.settings) {
            setSiteSettings(json.settings);
          }
        }
      } catch (err) {
        console.error('Error fetching settings for Sidebar:', err);
      }
    }
    fetchSettings();
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push('/login');
    router.refresh();
  }

  return (
    <aside className="hidden w-64 shrink-0 bg-slate-950 text-white md:block">
      <div className="sticky top-0 flex h-screen flex-col p-4">
        {/* Logo & Header */}
        <div className="mb-7 flex items-center gap-3 px-2">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 font-bold overflow-hidden">
              {siteSettings.logo_url ? (
                <img src={siteSettings.logo_url} alt="Logo" className="h-full w-full object-cover" />
              ) : (
                siteSettings.logo_text || 'DD'
              )}
            </div>
            <div>
              <div className="font-bold text-sm truncate max-w-[140px]">{siteSettings.system_name || 'Drinks Delivery'}</div>
              <div className="text-[10px] tracking-wider text-slate-400 font-bold uppercase">{role} PANEL</div>
            </div>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="space-y-1 overflow-y-auto">
          {items.map(([label, href, Icon]) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                path === href
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="mt-auto space-y-2 border-t border-slate-900 pt-4">
          <Link
            href="/customer"
            className="flex items-center justify-between rounded-xl bg-slate-900/80 px-3 py-2 text-xs font-semibold text-blue-400 hover:bg-slate-900 hover:text-blue-300 transition"
          >
            <span>Open Customer View</span>
            <span>→</span>
          </Link>

          {/* Log out Button */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition disabled:opacity-50"
          >
            <LogOut size={18} />
            <span>{loggingOut ? 'Signing out...' : 'Log out'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
