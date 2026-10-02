'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Beer,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Flame,
  GlassWater,
  Heart,
  HelpCircle,
  MapPin,
  Menu,
  Phone,
  Search,
  ShieldCheck,
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

// Barmandoo categories structure
const BARMANDOO_NAV_CATEGORIES = [
  { name: 'Hard Drinks / Spirits', href: '/customer', icon: Wine, badge: 'Popular' },
  { name: 'Beer & Cider', href: '/customer', icon: Beer, badge: 'Chilled' },
  { name: 'Wine & Champagne', href: '/customer', icon: GlassWater, badge: 'Imported' },
  { name: 'Late-Night Food & Momo', href: '/customer', icon: Utensils, badge: 'Hot 24/7' },
  { name: 'Soft Drinks & Mixers', href: '/customer', icon: Sparkles, badge: '' },
  { name: 'Cigarettes & Snacks', href: '/customer', icon: Zap, badge: 'Fast' },
];

const PROMO_SLIDES = [
  {
    title: "NEPAL'S FASTEST LATE-NIGHT LIQUOR & FOOD DELIVERY",
    subtitle: 'Get your favorite drinks & hot food delivered within 45 minutes guaranteed!',
    tag: '45 MINS EXPRESS',
    bgGradient: 'from-[#f46f25] to-[#f26f29]',
    image: '/brands/barahsinghe-craft-lager.webp',
  },
  {
    title: 'CHILLED BEERS & CRAFT PILSNERS ON DEMAND',
    subtitle: 'Cold Barahsinghe, Tuborg, Gorkha & Carlsberg delivered to your party.',
    tag: 'ALWAYS CHILLED',
    bgGradient: 'from-[#000000] to-[#1a1a1a]',
    image: '/brands/barahsinghe-craft-lager.webp',
  },
];

const BARMANDOO_CATEGORIES_GRID = [
  { id: 'spirits', name: 'Whiskey & Rum', items: '40+ Items', color: 'bg-amber-500/10 border-amber-500/30 text-amber-600', icon: Wine },
  { id: 'beers', name: 'Cold Beers', items: '25+ Brands', color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600', icon: Beer },
  { id: 'food', name: 'Late Night Food', items: 'Hot Momo & Snacks', color: 'bg-orange-500/10 border-orange-500/30 text-orange-600', icon: Utensils },
  { id: 'wine', name: 'Red & White Wine', items: 'Local & Imported', color: 'bg-rose-500/10 border-rose-500/30 text-rose-600', icon: GlassWater },
  { id: 'mixers', name: 'Mixers & Juices', items: 'Tonic, Soda, Cola', color: 'bg-blue-500/10 border-blue-500/30 text-blue-600', icon: Sparkles },
  { id: 'snacks', name: 'Snacks & Cigarettes', items: 'Instant Delivery', color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600', icon: Zap },
];

const BARMANDOO_PRODUCTS = [
  {
    id: 'b1',
    name: 'Old Durbar Black Chimney Peated Whisky',
    brand: 'Old Durbar',
    price: 3450,
    originalPrice: 3600,
    size: '750ml Bottle',
    abv: '40%',
    image: '/brands/barahsinghe-craft-lager.webp',
    inStock: true,
    tag: 'Best Seller',
  },
  {
    id: 'b2',
    name: 'Barahsinghe Craft Pilsner (Case of 12)',
    brand: 'Barahsinghe',
    price: 4380,
    originalPrice: 4500,
    size: '12 x 650ml',
    abv: '5.0%',
    image: '/brands/barahsinghe-craft-lager.webp',
    inStock: true,
    tag: '45 Mins Cold',
  },
  {
    id: 'b3',
    name: 'Khukuri XXX Coronation Rum',
    brand: 'Khukuri',
    price: 1650,
    originalPrice: 1750,
    size: '750ml Bottle',
    abv: '42.8%',
    image: '/brands/barahsinghe-craft-lager.webp',
    inStock: true,
    tag: 'Nepal Icon',
  },
  {
    id: 'b4',
    name: 'Tuborg Strong Premium Beer',
    brand: 'Tuborg',
    price: 375,
    originalPrice: 400,
    size: '650ml Bottle',
    abv: '6.5%',
    image: '/brands/barahsinghe-craft-lager.webp',
    inStock: true,
    tag: 'Cold Stored',
  },
  {
    id: 'b5',
    name: '8848 Pure Rye Mountain Vodka',
    brand: '8848 Vodka',
    price: 1950,
    originalPrice: 2100,
    size: '750ml Bottle',
    abv: '40.0%',
    image: '/brands/barahsinghe-craft-lager.webp',
    inStock: true,
    tag: '5x Distilled',
  },
  {
    id: 'b6',
    name: 'Steamed Buff / Chicken Momo (Full Plate)',
    brand: 'Barmandoo Kitchen',
    price: 240,
    originalPrice: 280,
    size: '10 Pieces + Achar',
    abv: 'Hot Food',
    image: '/brands/barahsinghe-craft-lager.webp',
    inStock: true,
    tag: 'Hot 24/7',
  },
];

export default function HomeLanding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'liquor' | 'food'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % PROMO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#404040] font-sans antialiased">
      {/* 1. TOP BARMANDOO ORANGE MICRO BANNER */}
      <div className="bg-[#f46f25] px-4 py-1.5 text-center text-xs font-bold text-white shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-ping rounded-full bg-white" />
            <span className="tracking-wide">BARMANDOO · FASTEST LATE-NIGHT LIQUOR & FOOD DELIVERY IN NEPAL</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <Clock size={13} /> 45-MINUTE EXPRESS DELIVERY
            </span>
            <span className="border-l border-white/30 pl-3">HOTLINE: +977-9802088800</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN BARMANDOO HEADER */}
      <header className="sticky top-0 z-40 border-b border-[#dddada] bg-white shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#f46f25] text-white font-black text-xl shadow-md">
              B
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-[#000000]">
                barmandoo<span className="text-[#f46f25]">.</span>
              </div>
              <p className="text-[10px] font-bold text-[#555]">Liquor & Late Night Food</p>
            </div>
          </Link>

          {/* Center Search Input */}
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
              className="absolute right-1 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-full bg-[#f46f25] text-white"
            >
              <Search size={14} />
            </button>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-lg border border-[#dddada] bg-[#f7f8f8] px-3.5 py-2 text-xs font-bold text-[#404040] hover:bg-white hover:border-[#f46f25] transition"
            >
              <User size={15} className="text-[#f46f25]" />
              <span>Login / Register</span>
            </Link>

            <Link
              href="/customer"
              className="relative flex items-center gap-2 rounded-lg bg-[#f46f25] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#e05e16] transition"
            >
              <ShoppingBag size={16} />
              <span>Cart</span>
              <span className="grid h-4 w-4 place-items-center rounded-full bg-white text-[10px] font-black text-[#f46f25]">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* Barmandoo Category Navigation Bar */}
        <div className="border-t border-[#eee] bg-[#fff] px-4 py-2 hidden sm:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between text-xs font-bold text-[#404040]">
            <div className="flex items-center gap-6 overflow-x-auto">
              {BARMANDOO_NAV_CATEGORIES.map((cat, idx) => {
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

            <div className="flex items-center gap-2 text-[#f46f25]">
              <Flame size={14} />
              <span>Hot Deals</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. HERO SLIDER BANNER (BARMANDOO STYLE) */}
      <section className="relative bg-[#000000] text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-md bg-[#f46f25] px-3 py-1 text-xs font-black text-white">
                <Clock size={14} />
                <span>{PROMO_SLIDES[currentSlide].tag}</span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-5xl leading-tight">
                {PROMO_SLIDES[currentSlide].title}
              </h1>

              <p className="text-sm sm:text-base text-[#ccc] font-medium leading-relaxed max-w-xl">
                {PROMO_SLIDES[currentSlide].subtitle} Order online for fast, safe & chilled doorstep delivery across Butwal and surrounding areas.
              </p>

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

              {/* Barmandoo Trust Chips */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-white/10 text-xs font-semibold text-[#eee]">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#f46f25]" />
                  <span>100% Genuine</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-[#f46f25]" />
                  <span>45 Min Express</span>
                </div>
                <div className="flex items-center gap-2">
                  <Utensils size={16} className="text-[#f46f25]" />
                  <span>Late Night Food</span>
                </div>
              </div>
            </div>

            {/* Right Banner Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-md">
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-black">
                  <Image
                    src="/home/drinks-lineup.webp"
                    alt="Barmandoo Express Drinks"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-[#f46f25] uppercase">
                      Chilled & Delivered
                    </span>
                    <span className="text-sm font-black text-white">Beer, Spirits & Food</span>
                  </div>

                  <Link
                    href="/customer"
                    className="rounded-lg bg-[#f46f25] px-3.5 py-1.5 text-xs font-bold text-white"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CATEGORIES GRID (BARMANDOO CARDS) */}
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
          {BARMANDOO_CATEGORIES_GRID.map(cat => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href="/customer"
                className="group relative flex flex-col justify-between rounded-xl border border-[#dddada] bg-white p-4 transition hover:border-[#f46f25] hover:shadow-md"
              >
                <div>
                  <div className={`grid h-12 w-12 place-items-center rounded-lg border ${cat.color} mb-3 group-hover:scale-105 transition`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="text-xs font-extrabold text-[#000000] group-hover:text-[#f46f25] transition">
                    {cat.name}
                  </h3>
                </div>

                <div className="mt-3 text-[11px] font-semibold text-[#777] flex items-center justify-between border-t border-[#eee] pt-2">
                  <span>{cat.items}</span>
                  <ArrowUpRight size={13} className="text-[#f46f25]" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. BEST SELLERS / PRODUCTS GRID (BARMANDOO STYLED) */}
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
                onClick={() => setActiveCategoryTab('all')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  activeCategoryTab === 'all'
                    ? 'bg-[#f46f25] text-white'
                    : 'bg-[#f7f8f8] text-[#404040] border border-[#dddada]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveCategoryTab('liquor')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  activeCategoryTab === 'liquor'
                    ? 'bg-[#f46f25] text-white'
                    : 'bg-[#f7f8f8] text-[#404040] border border-[#dddada]'
                }`}
              >
                Liquor
              </button>
              <button
                onClick={() => setActiveCategoryTab('food')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  activeCategoryTab === 'food'
                    ? 'bg-[#f46f25] text-white'
                    : 'bg-[#f7f8f8] text-[#404040] border border-[#dddada]'
                }`}
              >
                Food
              </button>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {BARMANDOO_PRODUCTS.map(prod => (
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
              Whether it's a late-night house party or sudden food craving, Barmandoo is your go-to delivery partner across Kathmandu & Butwal.
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

      {/* 7. BARMANDOO FOOTER */}
      <footer className="border-t border-[#dddada] bg-[#000000] text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          <div>
            <div className="text-xl font-black mb-2">
              barmandoo<span className="text-[#f46f25]">.</span>
            </div>
            <p className="text-[#aaa] leading-relaxed">
              Nepal's fastest delivery eCommerce platform. Delivering drinks, late-night food, snacks, and essentials right to your door.
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