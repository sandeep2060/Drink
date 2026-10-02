'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Beer,
  Check,
  ChevronRight,
  Clock,
  Flame,
  GlassWater,
  MapPin,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Truck,
  User,
  Utensils,
  Wine,
  X,
  Zap,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Hard Drinks / Spirits', href: '/customer', icon: Wine, badge: 'Popular' },
  { name: 'Beer & Craft Lager', href: '/customer', icon: Beer, badge: 'Chilled' },
  { name: 'Wines & Champagne', href: '/customer', icon: GlassWater, badge: 'Imported' },
  { name: 'Late-Night Momo & Food', href: '/customer', icon: Utensils, badge: 'Hot 24/7' },
  { name: 'Soft Drinks & Mixers', href: '/customer', icon: Sparkles, badge: '' },
  { name: 'Cigarettes & Snacks', href: '/customer', icon: Zap, badge: 'Fast' },
];

const BARMANDOO_CATEGORIES = [
  { id: 'whiskey', name: 'Whiskey & Spirits', count: '45+ Items', tag: 'Hot Sellers', icon: Wine, border: 'hover:border-amber-500' },
  { id: 'beer', name: 'Chilled Beers', count: '30+ Brands', tag: 'Cold Stored', icon: Beer, border: 'hover:border-yellow-500' },
  { id: 'momo', name: 'Late-Night Food & Momo', count: 'Hot & Fresh', tag: '24/7 Delivery', icon: Utensils, border: 'hover:border-orange-500' },
  { id: 'wine', name: 'Wines & Champagne', count: 'Red, White & Rosé', tag: 'Imported', icon: GlassWater, border: 'hover:border-rose-500' },
  { id: 'soft', name: 'Soft Drinks & Mixers', count: 'Tonic, Soda & Cola', tag: 'Mixers', icon: Sparkles, border: 'hover:border-blue-500' },
  { id: 'snacks', name: 'Snacks & Cigarettes', count: 'Instant Delivery', tag: 'Express', icon: Zap, border: 'hover:border-emerald-500' },
];

const BEST_SELLERS = [
  {
    id: 'b1',
    name: 'Old Durbar Black Chimney Peated Whisky',
    brand: 'Old Durbar',
    category: 'Whiskey',
    price: 3450,
    originalPrice: 3600,
    size: '750ml Bottle',
    abv: '40%',
    image: '/brands/barahsinghe-craft-lager.webp',
    tag: 'Best Seller',
    rating: 4.9,
  },
  {
    id: 'b2',
    name: 'Barahsinghe Craft Pilsner (Case of 12)',
    brand: 'Barahsinghe',
    category: 'Beer',
    price: 4380,
    originalPrice: 4500,
    size: '12 x 650ml',
    abv: '5.0%',
    image: '/brands/barahsinghe-craft-lager.webp',
    tag: '45 Mins Cold',
    rating: 5.0,
  },
  {
    id: 'b3',
    name: 'Khukuri XXX Coronation Rum',
    brand: 'Khukuri',
    category: 'Spirits',
    price: 1650,
    originalPrice: 1750,
    size: '750ml Bottle',
    abv: '42.8%',
    image: '/brands/barahsinghe-craft-lager.webp',
    tag: 'Nepal Icon',
    rating: 4.8,
  },
  {
    id: 'b4',
    name: 'Tuborg Strong Premium Beer',
    brand: 'Tuborg',
    category: 'Beer',
    price: 375,
    originalPrice: 400,
    size: '650ml Bottle',
    abv: '6.5%',
    image: '/brands/barahsinghe-craft-lager.webp',
    tag: 'Cold Stored',
    rating: 4.7,
  },
  {
    id: 'b5',
    name: '8848 Pure Rye Mountain Vodka',
    brand: '8848 Vodka',
    category: 'Spirits',
    price: 1950,
    originalPrice: 2100,
    size: '750ml Bottle',
    abv: '40.0%',
    image: '/brands/barahsinghe-craft-lager.webp',
    tag: '5x Distilled',
    rating: 4.9,
  },
  {
    id: 'b6',
    name: 'Steamed Buff / Chicken Momo (Full Plate)',
    brand: 'Barmandoo Kitchen',
    category: 'Food',
    price: 240,
    originalPrice: 280,
    size: '10 Pcs + Hot Achar',
    abv: 'Hot Food',
    image: '/brands/barahsinghe-craft-lager.webp',
    tag: 'Hot 24/7',
    rating: 5.0,
  },
];

export default function HomeLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'liquor' | 'food'>('all');

  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#404040] font-sans antialiased selection:bg-[#f46f25] selection:text-white">
      {/* 1. TOP BARMANDOO ORANGE BANNER */}
      <div className="bg-[#f46f25] px-4 py-1.5 text-center text-xs font-black text-white shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-ping rounded-full bg-white" />
            <span className="tracking-wide uppercase">
              BARMANDOO · NEPAL&apos;S FASTEST LATE-NIGHT LIQUOR &amp; FOOD DELIVERY
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 font-bold">
              <Clock size={13} /> 45-MINUTE GUARANTEED DELIVERY
            </span>
            <span className="border-l border-white/30 pl-3 font-bold">HOTLINE: +977-9802088800</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN BARMANDOO BRAND HEADER */}
      <header className="sticky top-0 z-40 border-b border-[#dddada] bg-white shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-lg p-2 text-[#404040] hover:bg-[#f7f8f8] md:hidden"
          >
            <Menu size={22} />
          </button>

          {/* Barmandoo Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#f46f25] text-white font-black text-2xl shadow-md">
              B
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-[#000000]">
                barmandoo<span className="text-[#f46f25]">.</span>
              </div>
              <p className="text-[10px] font-bold text-[#555]">Liquor &amp; Late Night Food</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="relative hidden md:block w-full max-w-md">
            <input
              type="text"
              placeholder="Search liquor, beer, whisky, momo, snacks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-[#a8a8a8] bg-[#f7f8f8] py-2 pl-4 pr-10 text-xs font-medium outline-none focus:border-[#f46f25] focus:bg-white focus:ring-1 focus:ring-[#f46f25]"
            />
            <button
              type="button"
              className="absolute right-1 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-full bg-[#f46f25] text-white hover:bg-[#e05e16] transition"
            >
              <Search size={14} />
            </button>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-lg border border-[#dddada] bg-[#f7f8f8] px-3.5 py-2 text-xs font-bold text-[#404040] hover:bg-white hover:border-[#f46f25] transition"
            >
              <User size={15} className="text-[#f46f25]" />
              <span className="hidden sm:inline">Login / Register</span>
            </Link>

            <Link
              href="/customer"
              className="relative flex items-center gap-2 rounded-lg bg-[#f46f25] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#e05e16] transition"
            >
              <ShoppingBag size={16} />
              <span className="hidden sm:inline">Cart</span>
              <span className="grid h-4 w-4 place-items-center rounded-full bg-white text-[10px] font-black text-[#f46f25]">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="border-t border-[#eee] bg-white px-4 py-2 hidden md:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between text-xs font-bold text-[#404040]">
            <div className="flex items-center gap-6 overflow-x-auto">
              {NAV_ITEMS.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={idx}
                    href={cat.href}
                    className="flex items-center gap-1.5 hover:text-[#f46f25] transition whitespace-nowrap"
                  >
                    <Icon size={14} className="text-[#f46f25]" />
                    <span>{cat.name}</span>
                    {cat.badge && (
                      <span className="rounded-md bg-[#f46f25]/10 px-1.5 py-0.5 text-[9px] font-extrabold text-[#f46f25]">
                        {cat.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-[#f46f25] font-black">
              <Flame size={14} />
              <span>45 MIN EXPRESS</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. HERO BANNER (BARMANDOO EXACT SLIDER LOOK) */}
      <section className="relative bg-[#000000] text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left Column Text */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-md bg-[#f46f25] px-3.5 py-1 text-xs font-black text-white">
                <Clock size={14} />
                <span>45 MINUTE EXPRESS DELIVERY</span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-5xl leading-tight">
                NEPAL&apos;S FASTEST LATE-NIGHT <br />
                <span className="text-[#f46f25]">LIQUOR &amp; FOOD DELIVERY</span>
              </h1>

              <p className="text-sm sm:text-base text-[#ccc] font-medium leading-relaxed max-w-xl">
                Order authentic whiskies, chilled beers, imported spirits, mixers, snacks &amp; late-night hot momos. Delivered right to your doorstep in 45 minutes or less!
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/customer"
                  className="flex items-center gap-2 rounded-lg bg-[#f46f25] px-6 py-3 text-xs font-black text-white shadow-lg hover:bg-[#e05e16] transition"
                >
                  <span>ORDER LIQUOR NOW</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/orders"
                  className="flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-xs font-bold text-white hover:bg-white/20 transition"
                >
                  <span>Track Delivery Status</span>
                </Link>
              </div>

              {/* Features List */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-white/15 text-xs font-semibold text-[#eee]">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#f46f25]" />
                  <span>100% Genuine</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-[#f46f25]" />
                  <span>Chilled 45 Mins</span>
                </div>
                <div className="flex items-center gap-2">
                  <Utensils size={16} className="text-[#f46f25]" />
                  <span>Late Night Food</span>
                </div>
              </div>
            </div>

            {/* Right Column Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-md shadow-2xl">
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-black border border-white/10">
                  <Image
                    src="/home/drinks-lineup.webp"
                    alt="Barmandoo Express Drinks Showcase"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-[#f46f25] uppercase">
                      Chilled &amp; Delivered
                    </span>
                    <span className="text-sm font-black text-white">Beer, Spirits &amp; Food</span>
                  </div>

                  <Link
                    href="/customer"
                    className="rounded-lg bg-[#f46f25] px-4 py-2 text-xs font-bold text-white hover:bg-[#e05e16]"
                  >
                    Shop Catalog
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SHOP BY CATEGORY SECTION */}
      <section className="py-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between border-b border-[#dddada] pb-3 mb-6">
          <div>
            <h2 className="text-xl font-black text-[#000000] sm:text-2xl">Shop By Category</h2>
            <p className="text-xs text-[#555]">Find your favorite drinks or late night snacks</p>
          </div>

          <Link href="/customer" className="text-xs font-bold text-[#f46f25] hover:underline flex items-center gap-1">
            <span>View All</span> <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {BARMANDOO_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href="/customer"
                className={`group relative flex flex-col justify-between rounded-xl border border-[#dddada] bg-white p-4 transition ${cat.border} hover:shadow-md`}
              >
                <div>
                  <div className="grid h-12 w-12 place-items-center rounded-lg border border-[#eee] bg-[#f7f8f8] mb-3 text-[#f46f25] group-hover:bg-[#f46f25] group-hover:text-white transition">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-xs font-extrabold text-[#000000] group-hover:text-[#f46f25] transition">
                    {cat.name}
                  </h3>
                </div>

                <div className="mt-3 text-[11px] font-semibold text-[#777] flex items-center justify-between border-t border-[#eee] pt-2">
                  <span>{cat.count}</span>
                  <ArrowUpRight size={13} className="text-[#f46f25]" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. BEST SELLERS GRID */}
      <section className="py-10 bg-white border-y border-[#dddada]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-extrabold tracking-widest text-[#f46f25] uppercase">
                Trending Items
              </span>
              <h2 className="text-xl font-black text-[#000000] sm:text-2xl mt-0.5">
                Barmandoo Best Sellers
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  activeTab === 'all'
                    ? 'bg-[#f46f25] text-white'
                    : 'bg-[#f7f8f8] text-[#404040] border border-[#dddada]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('liquor')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  activeTab === 'liquor'
                    ? 'bg-[#f46f25] text-white'
                    : 'bg-[#f7f8f8] text-[#404040] border border-[#dddada]'
                }`}
              >
                Liquor
              </button>
              <button
                onClick={() => setActiveTab('food')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  activeTab === 'food'
                    ? 'bg-[#f46f25] text-white'
                    : 'bg-[#f7f8f8] text-[#404040] border border-[#dddada]'
                }`}
              >
                Food
              </button>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {BEST_SELLERS.map(prod => (
              <div
                key={prod.id}
                className="group relative flex flex-col justify-between rounded-xl border border-[#dddada] bg-white p-3.5 shadow-xs transition hover:border-[#f46f25] hover:shadow-md"
              >
                <div>
                  {/* Image & Tag */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#f7f8f8] p-2 border border-[#eee]">
                    <span className="absolute top-1.5 left-1.5 rounded-md bg-[#f46f25] px-2 py-0.5 text-[9px] font-black text-white shadow-xs">
                      {prod.tag}
                    </span>

                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  {/* Title & Brand */}
                  <div className="mt-3 space-y-1">
                    <span className="text-[10px] font-bold text-[#777] uppercase">{prod.brand}</span>
                    <h3 className="text-xs font-extrabold text-[#000000] line-clamp-2 group-hover:text-[#f46f25] transition min-h-[32px]">
                      {prod.name}
                    </h3>
                    <div className="text-[11px] font-medium text-[#666]">
                      <span>{prod.size}</span> · <span className="font-bold text-[#f46f25]">{prod.abv}</span>
                    </div>
                  </div>
                </div>

                {/* Price & Add Button */}
                <div className="mt-3 pt-2 border-t border-[#eee] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-[#000000]">
                      Rs. {prod.price.toLocaleString('en-NP')}
                    </span>
                    {prod.originalPrice > prod.price && (
                      <span className="block text-[10px] text-[#999] line-through">
                        Rs. {prod.originalPrice}
                      </span>
                    )}
                  </div>

                  <Link
                    href="/customer"
                    className="flex items-center justify-center rounded-lg bg-[#f46f25] p-2 text-white shadow-xs hover:bg-[#e05e16] transition"
                    title="Add to Cart"
                  >
                    <ShoppingBag size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BARMANDOO 45-MIN DELIVERY BANNER */}
      <section className="py-12 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-2xl bg-[#000000] p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#333]">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-block rounded-md bg-[#f46f25] px-3 py-1 text-xs font-black">
              LATE NIGHT SERVICE
            </span>
            <h3 className="text-2xl font-black sm:text-3xl">Delivering Happiness in 45 Minutes</h3>
            <p className="text-xs text-[#ccc] max-w-xl">
              Whether it&apos;s a late-night house party or sudden food craving, Barmandoo is your go-to delivery partner across Kathmandu &amp; Butwal.
            </p>
          </div>

          <Link
            href="/customer"
            className="flex items-center gap-2 rounded-xl bg-[#f46f25] px-6 py-3 text-xs font-black text-white hover:bg-[#e05e16] transition shrink-0"
          >
            <span>ORDER NOW</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-[#dddada] bg-[#000000] text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          <div>
            <div className="text-xl font-black mb-2">
              barmandoo<span className="text-[#f46f25]">.</span>
            </div>
            <p className="text-[#aaa] leading-relaxed">
              Nepal&apos;s fastest delivery eCommerce platform. Delivering drinks, late-night food, snacks, and essentials right to your door.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Customer Care</h4>
            <ul className="space-y-2 text-[#aaa]">
              <li><Link href="/customer" className="hover:text-white">Shop Drinks</Link></li>
              <li><Link href="/orders" className="hover:text-white">Track Your Order</Link></li>
              <li><Link href="/login" className="hover:text-white">Customer Login</Link></li>
              <li><Link href="/admin" className="hover:text-white">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Contact Info</h4>
            <ul className="space-y-2 text-[#aaa]">
              <li>Dillibazar / Butwal Traffic Chowk</li>
              <li>Hotline: +977-9802088800</li>
              <li>Support: support@barmandoo.com.np</li>
              <li>Operating Hours: 24 Hours / Late Night</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Age Verification</h4>
            <p className="text-[#aaa] text-[11px] leading-relaxed">
              Alcoholic beverages are strictly sold to individuals 18 years of age or older. ID check is mandatory upon delivery.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 mt-8 border-t border-[#222] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#777]">
          <span>© {new Date().getFullYear()} Barmandoo Nepal. All rights reserved.</span>
          <span>Fastest Late-Night Delivery Service</span>
        </div>
      </footer>
    </div>
  );
}