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
  PhoneCall,
  Search,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  Store,
  Truck,
  User,
  Utensils,
  Wine,
  X,
  Zap,
} from 'lucide-react';
import { HomeNavbar } from './HomeNavbar';
import styles from './home.module.css';

type HomeLandingProps = {
  systemName?: string;
  tagline?: string;
  logoUrl?: string | null;
  businessAddress?: string;
};

// Barmandoo-style food & drinks categories
const BARMANDOO_CATEGORIES = [
  { id: 'whiskey', name: 'Whiskey & Spirits', icon: Wine, count: '45+ Items', tag: 'Hot Sellers', tone: 'bg-amber-500/10 text-amber-500' },
  { id: 'beer', name: 'Chilled Beers & Craft', icon: Beer, count: '30+ Brands', tag: 'Chilled', tone: 'bg-yellow-500/10 text-yellow-500' },
  { id: 'food', name: 'Late-Night Food & Momo', icon: Utensils, count: 'Snacks & Meals', tag: '24/7 Hot', tone: 'bg-rose-500/10 text-rose-500' },
  { id: 'wine', name: 'Wines & Champagne', icon: GlassWater, count: 'Imported & Local', tag: 'Premium', tone: 'bg-purple-500/10 text-purple-500' },
  { id: 'soft', name: 'Cold Drinks & Mixers', icon: Sparkles, count: 'Soda, Tonic & Juices', tag: 'Mixers', tone: 'bg-blue-500/10 text-blue-500' },
  { id: 'energy', name: 'Energy & Cigarettes', icon: Zap, count: 'Instant Delivery', tag: 'Express', tone: 'bg-emerald-500/10 text-emerald-500' },
];

// Curated Best Seller items mimicking Barmandoo
const BEST_SELLERS = [
  {
    id: '1',
    name: 'Old Durbar Black Chimney Peated Whisky',
    brand: 'Old Durbar',
    category: 'Whiskey',
    price: 3450,
    size: '750ml',
    abv: '40%',
    image: '/brands/barahsinghe-craft-lager.webp',
    inStock: true,
    badge: 'BEST SELLER',
  },
  {
    id: '2',
    name: 'Barahsinghe Craft Pilsner (Case of 12)',
    brand: 'Barahsinghe',
    category: 'Beer',
    price: 4380,
    size: '12 x 650ml',
    abv: '5.0%',
    image: '/brands/barahsinghe-craft-lager.webp',
    inStock: true,
    badge: 'CHILLED 45 MINS',
  },
  {
    id: '3',
    name: 'Khukuri XXX Coronation Rum',
    brand: 'Khukuri',
    category: 'Spirits',
    price: 1650,
    size: '750ml',
    abv: '42.8%',
    image: '/brands/barahsinghe-craft-lager.webp',
    inStock: true,
    badge: 'NEPAL ICON',
  },
  {
    id: '4',
    name: 'Tuborg Strong Premium Beer',
    brand: 'Tuborg',
    category: 'Beer',
    price: 375,
    size: '650ml Bottle',
    abv: '6.5%',
    image: '/brands/barahsinghe-craft-lager.webp',
    inStock: true,
    badge: 'COLD STORED',
  },
];

export default function HomeLanding() {
  const [activeTab, setActiveTab] = useState<'all' | 'drinks' | 'food'>('drinks');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* 1. TOP BARMANDOO BANNER */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 px-4 py-2 text-center text-xs font-black tracking-wide text-slate-950 shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-ping rounded-full bg-slate-950" />
            <span>NEPAL'S FASTEST LATE-NIGHT LIQUOR & FOOD DELIVERY · BUTWAL & SURROUNDINGS</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 font-bold">
              <Clock size={13} /> 30 - 45 MIN EXPRESS DELIVERY
            </span>
            <span className="border-l border-slate-950/30 pl-4 font-bold">HOTLINE: +977 9800000000</span>
          </div>
        </div>
      </div>

      {/* 2. BARMANDOO STYLED NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
              <Wine size={22} strokeWidth={2.4} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xl font-black tracking-tight text-white">
                drinkdrop<span className="text-amber-500">.</span>
                <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                  EXPRESS
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-400">Late Night Liquor & Drinks</p>
            </div>
          </Link>

          {/* Quick Category Switcher Pill (Drinks vs Food) */}
          <div className="hidden md:flex items-center rounded-full border border-slate-800 bg-slate-900/90 p-1">
            <button
              onClick={() => setActiveTab('drinks')}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition ${
                activeTab === 'drinks'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wine size={14} />
              <span>Liquor & Drinks</span>
            </button>
            <button
              onClick={() => setActiveTab('food')}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition ${
                activeTab === 'food'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Utensils size={14} />
              <span>Late-Night Momo & Food</span>
            </button>
          </div>

          {/* Nav Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/customer"
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-200 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 transition"
            >
              <Search size={15} className="text-amber-400" />
              <span className="hidden sm:inline">Search Drinks</span>
            </Link>

            <Link
              href="/login"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-2 text-xs font-extrabold text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition"
            >
              <User size={15} />
              <span>Sign In</span>
            </Link>

            <Link
              href="/customer"
              className="relative grid h-9 w-9 place-items-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition"
              title="View Customer Shop"
            >
              <ShoppingBag size={18} />
            </Link>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION - BARMANDOO DARK LATE NIGHT THEME */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0b0f19] via-[#111726] to-[#0b0f19] py-16 lg:py-24 border-b border-slate-800/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-extrabold text-amber-400">
                <Flame size={14} className="animate-bounce text-amber-400" />
                <span>30-45 MINUTES GUARANTEED EXPRESS DELIVERY</span>
              </div>

              <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-6xl leading-[1.1]">
                Craving Late-Night <br />
                <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  Liquor & Cold Drinks?
                </span>
              </h1>

              <p className="max-w-xl text-sm sm:text-base text-slate-400 font-medium leading-relaxed">
                Order authentic Nepali whiskies, ice-cold beers, imported spirits, mixers, snacks, and late-night hot momos. Delivered right to your doorstep in 45 minutes or less.
              </p>

              {/* Instant Search / Location Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-2 shadow-2xl backdrop-blur-md max-w-2xl">
                <div className="flex items-center gap-2.5 flex-1 px-3 py-2 w-full">
                  <MapPin size={18} className="text-amber-400 shrink-0" />
                  <div className="text-left">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Delivering to
                    </span>
                    <span className="block text-xs font-bold text-slate-200">
                      Traffic Chowk, Milanchowk & Central Butwal
                    </span>
                  </div>
                </div>

                <Link
                  href="/customer"
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-3 text-xs font-black text-slate-950 shadow-lg shadow-amber-500/25 transition hover:brightness-110 active:scale-95"
                >
                  <span>Order Now</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Guarantees */}
              <div className="pt-2 grid grid-cols-3 gap-4 max-w-lg">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500/10 text-emerald-400">
                    <Check size={14} />
                  </div>
                  <span>100% Genuine</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500/10 text-emerald-400">
                    <Check size={14} />
                  </div>
                  <span>Chilled Cold</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500/10 text-emerald-400">
                    <Check size={14} />
                  </div>
                  <span>COD / Fonepay</span>
                </div>
              </div>
            </div>

            {/* Right Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl">
                <div className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 px-3 py-1 text-[10px] font-black text-slate-950 shadow-md">
                  HOTTEST SELLER TODAY
                </div>

                <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-800">
                  <Image
                    src="/home/drinks-lineup.webp"
                    alt="Barmandoo Chilled Drinks Lineup"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-400">BARMANDOO SPECIAL</span>
                    <span className="text-xs font-extrabold text-emerald-400">IN STOCK</span>
                  </div>
                  <h3 className="text-lg font-black text-white">Chilled Party Pack & Drinks</h3>
                  <p className="text-xs text-slate-400">
                    Includes craft beers, signature whiskies, mixers, and ice buckets delivered cold.
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold">Starting from</span>
                      <span className="text-lg font-black text-amber-400">Rs. 350</span>
                    </div>

                    <Link
                      href="/customer"
                      className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700 transition"
                    >
                      Browse Store →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CATEGORY TILES (BARMANDOO STYLE) */}
      <section className="py-14 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between border-b border-slate-800 pb-4 mb-8">
          <div>
            <span className="text-xs font-extrabold tracking-widest text-amber-400 uppercase">
              Explore Categories
            </span>
            <h2 className="text-2xl font-black text-white sm:text-3xl mt-1">What are you drinking tonight?</h2>
          </div>

          <Link href="/customer" className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-400 hover:underline">
            View All Categories <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {BARMANDOO_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href="/customer"
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 transition hover:border-amber-500/50 hover:bg-slate-850 hover:shadow-xl"
              >
                <div>
                  <div className={`grid h-12 w-12 place-items-center rounded-xl ${cat.tone} mb-3 group-hover:scale-110 transition`}>
                    <Icon size={24} />
                  </div>
                  <span className="inline-block rounded-md bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-300 mb-1">
                    {cat.tag}
                  </span>
                  <h3 className="text-xs font-extrabold text-white group-hover:text-amber-400 transition">{cat.name}</h3>
                </div>

                <div className="mt-3 text-[11px] font-medium text-slate-500 flex items-center justify-between border-t border-slate-800/60 pt-2">
                  <span>{cat.count}</span>
                  <ArrowUpRight size={14} className="text-slate-400 group-hover:text-amber-400 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. FEATURED PRODUCTS GRID (BEST SELLERS) */}
      <section className="py-12 bg-slate-900/40 border-y border-slate-800/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-extrabold tracking-widest text-amber-400 uppercase">
                Trending Drinks
              </span>
              <h2 className="text-2xl font-black text-white sm:text-3xl mt-1">Best Selling Liquor & Beers</h2>
            </div>

            <Link href="/customer" className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition">
              <span>Explore Shop</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BEST_SELLERS.map(item => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg transition hover:border-amber-500/40 hover:shadow-2xl"
              >
                <div>
                  {/* Badge & Image */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-950 p-4 border border-slate-800">
                    <span className="absolute top-2 left-2 rounded-md bg-amber-500/20 px-2 py-0.5 text-[9px] font-black text-amber-400 border border-amber-500/30">
                      {item.badge}
                    </span>

                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  {/* Title & Specs */}
                  <div className="mt-3 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500">{item.brand}</span>
                    <h3 className="text-sm font-extrabold text-white line-clamp-1 group-hover:text-amber-400 transition">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                      <span>{item.size}</span>
                      <span>·</span>
                      <span className="text-amber-400/90 font-bold">{item.abv} ABV</span>
                    </div>
                  </div>
                </div>

                {/* Price & Buy Button */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="block text-[9px] font-bold text-slate-500">Price</span>
                    <span className="text-base font-black text-amber-400">Rs. {item.price.toLocaleString('en-NP')}</span>
                  </div>

                  <Link
                    href="/customer"
                    className="flex items-center gap-1 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-400 transition"
                  >
                    <span>Add</span>
                    <ShoppingBag size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW BARMANDOO WORKS (4 STEPS) */}
      <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold tracking-widest text-amber-400 uppercase">
            Fast & Hassle Free
          </span>
          <h2 className="text-3xl font-black text-white mt-1">How DrinkDrop Express Works</h2>
          <p className="text-xs text-slate-400 mt-2">
            Get your drinks delivered in four simple steps without stepping out.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { step: '01', title: 'Pick Your Liquor', desc: 'Browse hundreds of beers, whiskies, wines & mixers in our catalog.' },
            { step: '02', title: 'Set Delivery Location', desc: 'Select your zone in Butwal & specify landmark for rider.' },
            { step: '03', title: 'Select Payment Method', desc: 'Pay via Cash on Delivery (COD) or instant Fonepay QR code.' },
            { step: '04', title: 'Doorstep Delivery', desc: 'Receive your cold drinks in 30 to 45 minutes guaranteed.' },
          ].map((item, idx) => (
            <div key={idx} className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <span className="text-3xl font-black text-amber-500/30">{item.step}</span>
              <h3 className="text-sm font-extrabold text-white mt-2">{item.title}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-slate-800 bg-[#070a12] py-12 text-slate-400 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-base font-black text-white mb-2">
              <Wine size={18} className="text-amber-500" />
              <span>drinkdrop<span className="text-amber-500">.</span></span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Nepal's premier late-night liquor & food delivery platform in Butwal. Fast, reliable, and authentic.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/customer" className="hover:text-amber-400">Shop All Liquor</Link></li>
              <li><Link href="/orders" className="hover:text-amber-400">Track Order Status</Link></li>
              <li><Link href="/admin" className="hover:text-amber-400">Admin Portal</Link></li>
              <li><Link href="/rider" className="hover:text-amber-400">Rider Workspace</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-white mb-3">Customer Support</h4>
            <ul className="space-y-2">
              <li>Hotline: +977 9800000000</li>
              <li>Email: support@drinkdrop.com</li>
              <li>Location: Traffic Chowk, Butwal, Nepal</li>
              <li>Operational Hours: 24/7 Delivery</li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-white mb-3">Legal & Age Gate</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Strictly 18+ only. ID verification is conducted upon delivery by our riders. Please drink responsibly.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <span>© {new Date().getFullYear()} DrinkDrop Express Nepal. All rights reserved.</span>
          <span>Designed with late-night convenience in mind.</span>
        </div>
      </footer>
    </div>
  );
}