'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  Bell,
  Bike,
  Box,
  ClipboardList,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  Search,
  Settings,
  ShoppingBag,
  Store,
  Users,
  X,
} from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase';

const navItems = [
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

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const router = useRouter();
  const path = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<{ system_name?: string; logo_text?: string }>({
    system_name: 'Drinks Delivery',
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
        console.error('Error fetching settings for Topbar:', err);
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
    <>
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 md:px-7">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 md:hidden"
            aria-label="Open navigation menu"
          >
            <Menu size={18} />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-900 md:text-xl">{title}</h1>
            {subtitle && <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick Search */}
          <div className="hidden items-center gap-2 rounded-xl bg-slate-100 border border-slate-200 px-3 py-1.5 md:flex">
            <Search size={15} className="text-slate-500" />
            <input
              className="w-36 bg-transparent text-xs font-semibold text-slate-900 outline-none placeholder:text-slate-500"
              placeholder="Search admin..."
            />
          </div>

          {/* Notifications */}
          <button
            type="button"
            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
            title="Notifications"
          >
            <Bell size={17} />
          </button>

          {/* Log out Button */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            title="Sign out of Admin Panel"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">{loggingOut ? 'Signing out...' : 'Log out'}</span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          <div className="relative z-10 flex h-full w-72 flex-col bg-slate-950 p-4 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-900">
              <div className="flex items-center gap-2.5 font-bold">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-xs font-black">
                  {siteSettings.logo_text || 'DD'}
                </div>
                <span className="truncate max-w-[140px]">{siteSettings.system_name || 'Admin Panel'}</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="mt-4 flex-1 space-y-1 overflow-y-auto">
              {navItems.map(([label, href, Icon]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                    path === href ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon size={17} />
                  {label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto border-t border-slate-900 pt-3">
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/20"
              >
                <LogOut size={16} />
                <span>{loggingOut ? 'Signing out...' : 'Log out of Admin'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
