'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Beer,
  ChevronRight,
  Clock,
  Flame,
  GlassWater,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  User,
  Utensils,
  Wine,
  X,
  Zap,
} from 'lucide-react';
import { getHomeData, type HomeData } from '@/lib/home-data';

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
  },
];

const DEFAULT_SLIDES = [
  '/home/butwal-night.webp',
  '/home/drinks-lineup.webp',
  '/home/water-bottle.webp',
];

export default function HomeLanding() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'liquor' | 'food'>('all');

  useEffect(() => {
    getHomeData().then(data => setHomeData(data));
  }, []);

  const slideImages = homeData?.heroBgImages && homeData.heroBgImages.length > 0
    ? homeData.heroBgImages
    : DEFAULT_SLIDES;

  // 5 SECONDS AUTO BACKGROUND SLIDER
  useEffect(() => {
    if (slideImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBgIndex(prev => (prev + 1) % slideImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slideImages]);

  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#404040] font-sans antialiased selection:bg-[#f46f25] selection:text-white">
      {/* 1. TOP BARMANDOO BANNER */}
      <div className="bg-[#f46f25] px-4 py-1.5 text-center text-xs font-black text-white shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-ping rounded-full bg-white" />
            <span className="tracking-wide uppercase">
              BARMANDOO · FASTEST LATE-NIGHT LIQUOR &amp; FOOD DELIVERY IN NEPAL
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 font-bold">
              <Clock size={13} /> 45-MINUTE EXPRESS DELIVERY
            </span>
            <span className="border-l border-white/30 pl-3 font-bold">HOTLINE: +977-9802088800</span>
          </div>
        </div>
      </div>

      {/* 2. EXACT BARMANDOO HERO LANDING HEADER */}
      <section className="relative min-h-[85vh] overflow-hidden bg-[#080d16] text-white flex flex-col justify-between">
        {/* BACKGROUND AUTO SLIDER (5 SECONDS TRANSITION) */}
        {slideImages.map((imgUrl, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentBgIndex ? 'opacity-35 scale-105 transition-transform duration-10000' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Image
              src={imgUrl}
              alt="Barmandoo Background"
              fill
              priority={idx === 0}
              className="object-cover object-center"
              unoptimized
            />
          </div>
        ))}

        {/* OVERLAY GRADIENTS matching barmandoo screenshot */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/80 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        {/* TOP BAR / LOGO & CART ICON */}
        <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#f46f25] to-orange-600 text-white font-black text-2xl shadow-lg shadow-orange-500/30">
              B
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight text-white">
                barmandoo<span className="text-[#f46f25]">.</span>
              </div>
              <p className="text-[10px] font-bold text-slate-300">Liquor &amp; Late Night Food</p>
            </div>
          </Link>

          {/* User & Cart Icons top right */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition"
              title="Sign In"
            >
              <User size={18} />
            </Link>

            <Link
              href="/customer"
              className="relative grid h-10 w-10 place-items-center rounded-full bg-[#f46f25] text-white shadow-lg shadow-orange-500/30 hover:bg-[#e05e16] transition"
              title="Cart"
            >
              <ShoppingBag size={18} />
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-white text-[10px] font-black text-[#f46f25] ring-2 ring-[#080d16]">
                0
              </span>
            </Link>
          </div>
        </header>

        {/* CENTER HERO HEADING & SEARCH (EXACT BARMANDOO SCREENSHOT LAYOUT) */}
        <div className="relative z-20 mx-auto flex flex-1 w-full max-w-5xl flex-col items-center justify-center px-4 py-12 text-center">
          {/* Logo Badge */}
          <div className="mb-4 flex items-center justify-center gap-2 rounded-full border border-amber-500/30 bg-black/60 px-4 py-1.5 text-xs font-black text-amber-400 backdrop-blur-md">
            <Flame size={15} className="text-[#f46f25]" />
            <span>NEPAL&apos;S #1 ON-DEMAND DELIVERY PLATFORM</span>
          </div>

          {/* MAIN BIG HEADING */}
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl md:text-7xl uppercase leading-none drop-shadow-md">
            <span className="text-[#f46f25]">FOOD &amp; </span>
            <span className="text-cyan-400">DRINKS </span>
            <span className="text-white">DELIVERY</span>
          </h1>

          <p className="mt-2 text-sm font-bold tracking-widest text-slate-200 uppercase">
            EASY, FAST &amp; CONVENIENT
          </p>

          {/* LARGE CENTERED SEARCH INPUT BAR */}
          <div className="mt-8 w-full max-w-2xl">
            <div className="relative flex items-center rounded-full border border-white/30 bg-white/95 p-1.5 shadow-2xl backdrop-blur-md transition-all focus-within:ring-4 focus-within:ring-orange-500/30">
              <Search size={22} className="ml-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for food or drinks (beer, whisky, momo, pizza...)"
                className="w-full bg-transparent px-3 py-2.5 text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400"
              />
              <Link
                href="/customer"
                className="flex items-center gap-2 rounded-full bg-[#f46f25] px-6 py-3 text-xs font-black text-white shadow-md hover:bg-[#e05e16] transition shrink-0"
              >
                <span>SEARCH</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <p className="mt-4 text-xs font-extrabold tracking-wider text-slate-300 uppercase">
            ALCOHOL, BEVERAGES &amp; FOOD DELIVERY WITHIN 45 MINS
          </p>

          {/* SLIDER DOTS INDICATOR */}
          <div className="mt-6 flex items-center gap-2">
            {slideImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBgIndex(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  idx === currentBgIndex ? 'w-8 bg-[#f46f25]' : 'w-2.5 bg-white/40 hover:bg-white'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* BOTTOM GUARANTEES STRIP */}
        <div className="relative z-20 border-t border-white/10 bg-black/60 backdrop-blur-md py-3 text-xs font-bold text-slate-300">
          <div className="mx-auto flex max-w-7xl items-center justify-around px-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#f46f25]" />
              <span>100% Genuine Spirits</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-[#f46f25]" />
              <span>45 Min Express Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Utensils size={16} className="text-[#f46f25]" />
              <span>Late-Night Hot Food</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SHOP BY CATEGORY SECTION */}
      <section className="py-12 mx-auto max-w-7xl px-4 sm:px-6">
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
      <section className="py-12 bg-white border-y border-[#dddada]">
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