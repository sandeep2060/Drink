'use client';

import Link from 'next/link';
import {
  Beer,
  Clock3,
  Flame,
  LifeBuoy,
  MapPin,
  Package,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { DeliveryAddress } from '@/lib/catalog-store';

type Tab = 'shop' | 'orders' | 'addresses' | 'support' | 'profile';

interface CustomerNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  selectedAddress: DeliveryAddress;
  onOpenAddressSelector: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  activeOrdersCount: number;
}

export function CustomerNav({
  activeTab,
  setActiveTab,
  selectedAddress,
  onOpenAddressSelector,
  searchQuery,
  setSearchQuery,
  cartCount,
  cartTotal,
  onOpenCart,
  activeOrdersCount,
}: CustomerNavProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      {/* Top micro banner */}
      <div className="bg-[#18352c] px-4 py-1.5 text-xs text-[#eee9d9]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="font-medium">DrinkDrop Express Butwal</span>
            <span className="hidden text-slate-400 sm:inline">· Cold drinks delivered in 30-45 mins</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-[#dda94e]">
              <Flame size={13} /> Free delivery over Rs. 1,000
            </span>
            <Link href="/admin" className="hidden font-medium text-slate-300 hover:text-white sm:inline-block">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-xl font-black text-[#18352c]">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#18352c] text-[#f6e8c3] shadow-sm">
                <Beer size={20} strokeWidth={2.4} />
              </span>
              <span className="tracking-tight">
                drinkdrop<span className="text-[#c65b36]">.</span>
              </span>
            </Link>

            {/* Delivering To Location Pill */}
            <button
              onClick={onOpenAddressSelector}
              type="button"
              className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-left text-xs transition hover:border-slate-300 hover:bg-slate-100 md:flex"
              title="Change delivery location"
            >
              <div className="grid h-6 w-6 place-items-center rounded-lg bg-blue-100 text-blue-600">
                <MapPin size={14} />
              </div>
              <div className="max-w-[170px] truncate">
                <div className="font-semibold text-slate-800">{selectedAddress.label}</div>
                <div className="truncate text-[11px] text-slate-500">{selectedAddress.zone}</div>
              </div>
            </button>
          </div>

          {/* Search bar (desktop) */}
          <div className="relative hidden max-w-md flex-1 md:block">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search beer, rum, whiskey, cola, juices, soda..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-8 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Action buttons (desktop) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Orders Tab Link */}
            <button
              onClick={() => setActiveTab('orders')}
              type="button"
              className={`relative flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                activeTab === 'orders'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Package size={16} />
              <span className="hidden sm:inline">My Orders</span>
              {activeOrdersCount > 0 && (
                <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            {/* Profile Button (desktop) */}
            <button
              onClick={() => setActiveTab('profile')}
              type="button"
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                activeTab === 'profile'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <User size={16} />
              <span className="hidden lg:inline">Profile</span>
            </button>

            {/* Cart Trigger Button */}
            <button
              onClick={onOpenCart}
              type="button"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow active:scale-95"
            >
              <div className="relative">
                <ShoppingBag size={17} />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-amber-400 text-[10px] font-black text-slate-900 ring-2 ring-blue-600">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="border-l border-blue-400/40 pl-2 font-extrabold">
                  Rs. {cartTotal.toLocaleString('en-NP')}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search & Location Row */}
        <div className="mt-2.5 flex flex-col gap-2 md:hidden">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search drinks, beer, whiskey, cola..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-xs outline-none focus:border-blue-500 focus:bg-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={onOpenAddressSelector}
            type="button"
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 text-[11px] text-slate-600"
          >
            <span className="flex items-center gap-1.5 truncate">
              <MapPin size={13} className="text-blue-600 shrink-0" />
              <strong className="text-slate-800">{selectedAddress.label}:</strong> {selectedAddress.zone}
            </span>
            <span className="text-blue-600 font-medium shrink-0 ml-1">Change</span>
          </button>
        </div>

        {/* Secondary Category / View Tabs — DESKTOP ONLY (hidden on mobile, replaced by bottom nav) */}
        <div className="mt-2 hidden items-center justify-between border-t border-slate-100 pt-2 text-xs font-semibold md:flex">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {(
              [
                { key: 'shop' as Tab, label: 'Shop Catalog' },
                { key: 'orders' as Tab, label: 'Orders & Tracking', badge: activeOrdersCount },
                { key: 'addresses' as Tab, label: 'Saved Locations' },
                { key: 'support' as Tab, label: 'Butwal Support' },
                { key: 'profile' as Tab, label: 'My Profile' },
              ] as { key: Tab; label: string; badge?: number }[]
            ).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                type="button"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className={`rounded-full px-1.5 text-[10px] ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-emerald-500 text-white'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-2 text-[11px] text-slate-500 lg:flex">
            <Clock3 size={13} className="text-emerald-600" />
            <span>Open today until 9:00 PM</span>
          </div>
        </div>
      </div>
    </header>
  );
}
