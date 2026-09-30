'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Award,
  Bell,
  ChevronRight,
  Edit3,
  GlassWater,
  Heart,
  HelpCircle,
  LifeBuoy,
  Lock,
  LogOut,
  MapPin,
  Package,
  Phone,
  Settings,
  ShieldCheck,
  User,
} from 'lucide-react';
import { getCustomerOrders, getCustomerAddresses } from '@/lib/catalog-store';
import { getSupabaseBrowserClient } from '@/lib/supabase';

interface CustomerProfile {
  name: string;
  phone: string;
  email: string;
  joinDate: string;
  totalOrders: number;
  totalSpend: number;
  memberTier: 'Bronze' | 'Silver' | 'Gold';
}

function getMemberTier(totalOrders: number): CustomerProfile['memberTier'] {
  if (totalOrders >= 20) return 'Gold';
  if (totalOrders >= 8) return 'Silver';
  return 'Bronze';
}

const TIER_STYLES = {
  Bronze: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', dot: 'bg-amber-500' },
  Silver: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', dot: 'bg-slate-500' },
  Gold: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-300', dot: 'bg-yellow-500' },
};

const TIER_PERKS = {
  Bronze: 'Free delivery on orders over Rs. 1,000',
  Silver: 'Free delivery on orders over Rs. 700 + Priority support',
  Gold: 'Always free delivery + Gold customer hotline',
};

export function CustomerProfileView() {
  const router = useRouter();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  // Load real stats from local store
  const orders = getCustomerOrders();
  const addresses = getCustomerAddresses();
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length;
  const totalSpend = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.total, 0);
  const memberTier = getMemberTier(totalOrders);
  const tierStyles = TIER_STYLES[memberTier];

  // Profile state (localStorage-backed mock in demo mode)
  const [name, setName] = useState('Sandeep Sharma');
  const [phone, setPhone] = useState('+977 9801234567');
  const [email, setEmail] = useState('sandeep@example.com');

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
    <div className="space-y-5 pb-24 md:pb-6">
      {/* === Profile Hero Card === */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#18352c] to-[#1e4d3a] p-6 text-white shadow-lg">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-blue-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Avatar & Identity */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15 text-3xl font-black text-white backdrop-blur ring-2 ring-white/20">
                {name.charAt(0).toUpperCase()}
              </div>
              <span className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#18352c] ${tierStyles.dot}`} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">{name}</h2>
              <p className="mt-0.5 text-sm text-slate-300">{phone}</p>
              <p className="text-xs text-slate-400">{email}</p>
            </div>
          </div>

          {/* Membership Tier Badge */}
          <div className="flex flex-col items-start sm:items-end gap-2">
            <div className={`inline-flex items-center gap-1.5 rounded-2xl border px-3 py-1.5 text-xs font-bold ${tierStyles.bg} ${tierStyles.text} ${tierStyles.border}`}>
              <Award size={13} />
              {memberTier} Member
            </div>
            <p className="text-[11px] text-slate-400">{TIER_PERKS[memberTier]}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="relative z-10 mt-6 grid grid-cols-3 gap-3">
          {[
            { label: 'Total Orders', value: totalOrders },
            { label: 'Delivered', value: deliveredOrders },
            { label: 'Total Spend', value: `Rs. ${totalSpend.toLocaleString('en-NP')}` },
          ].map(stat => (
            <div key={stat.label} className="rounded-2xl bg-white/8 p-3 text-center backdrop-blur-sm">
              <div className="text-lg font-black text-white">{stat.value}</div>
              <div className="mt-0.5 text-[10px] font-semibold text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* === Edit Profile Form === */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-slate-50"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-100 text-blue-600">
              <Edit3 size={16} />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">Edit Profile Details</div>
              <div className="text-xs text-slate-500">Update your name, phone number, and email</div>
            </div>
          </div>
          <ChevronRight
            size={18}
            className={`text-slate-400 transition-transform ${isEditingProfile ? 'rotate-90' : ''}`}
          />
        </button>

        {isEditingProfile && (
          <div className="border-t border-slate-100 p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* === Quick Links === */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden divide-y divide-slate-100">
        {/* Header */}
        <div className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/60">
          Account Settings
        </div>

        {[
          { icon: MapPin, label: 'Delivery Addresses', sub: `${addresses.length} saved locations in Butwal`, color: 'bg-blue-100 text-blue-600' },
          { icon: Package, label: 'Order History', sub: `${totalOrders} orders placed in total`, color: 'bg-emerald-100 text-emerald-600' },
          { icon: Bell, label: 'Notifications & Alerts', sub: 'Order updates, promos, and reminders', color: 'bg-amber-100 text-amber-700' },
          { icon: ShieldCheck, label: 'Age Verification', sub: '18+ identity verified on this device', color: 'bg-purple-100 text-purple-700' },
          { icon: Lock, label: 'Password & Security', sub: 'Manage account password', color: 'bg-slate-100 text-slate-700' },
        ].map(item => (
          <button
            key={item.label}
            type="button"
            className="flex w-full items-center gap-3.5 px-5 py-4 text-left transition hover:bg-slate-50 active:bg-slate-100"
          >
            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${item.color}`}>
              <item.icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-slate-900">{item.label}</div>
              <div className="truncate text-xs text-slate-500">{item.sub}</div>
            </div>
            <ChevronRight size={16} className="text-slate-300 shrink-0" />
          </button>
        ))}
      </div>

      {/* === App Info === */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden divide-y divide-slate-100">
        <div className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/60">
          About DrinkDrop
        </div>

        {[
          { icon: GlassWater, label: 'About DrinkDrop Butwal', sub: 'Drinks delivered in 30-45 minutes' },
          { icon: LifeBuoy, label: 'Help & Support', sub: 'Contact our Butwal dispatch team' },
          { icon: HelpCircle, label: 'Terms & Conditions', sub: 'Responsible drinking policy' },
        ].map(item => (
          <button
            key={item.label}
            type="button"
            className="flex w-full items-center gap-3.5 px-5 py-4 text-left transition hover:bg-slate-50"
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600">
              <item.icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-slate-900">{item.label}</div>
              <div className="text-xs text-slate-500">{item.sub}</div>
            </div>
            <ChevronRight size={16} className="text-slate-300 shrink-0" />
          </button>
        ))}
      </div>

      {/* === Logout Section === */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {!logoutConfirm ? (
          <button
            type="button"
            onClick={() => setLogoutConfirm(true)}
            className="flex w-full items-center gap-3.5 px-5 py-4 text-left transition hover:bg-red-50"
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-red-100 text-red-600">
              <LogOut size={16} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm text-red-600">Sign Out</div>
              <div className="text-xs text-slate-500">Log out of your DrinkDrop account</div>
            </div>
          </button>
        ) : (
          <div className="p-5 space-y-3">
            <p className="text-sm font-semibold text-slate-800">Are you sure you want to sign out?</p>
            <p className="text-xs text-slate-500">
              You will be redirected to the login screen. Your cart and order history are saved locally.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLogoutConfirm(false)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Stay Signed In
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-60"
              >
                <LogOut size={14} />
                {loggingOut ? 'Signing out...' : 'Yes, Sign Out'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Version Footer */}
      <div className="text-center text-[11px] text-slate-400 pb-2">
        DrinkDrop Butwal · v1.0.0 · Lumbini, Nepal 🇳🇵
      </div>
    </div>
  );
}
