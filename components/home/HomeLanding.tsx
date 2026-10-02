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
  Loader2,
  MapPin,
  Menu,
  Phone,
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
import { getHomeData, type HomeData, type HomeCategory, type HomeProduct } from '@/lib/home-data';

const DEFAULT_SLIDES = [
  '/home/butwal-night.webp',
  '/home/drinks-lineup.webp',
  '/home/water-bottle.webp',
];

function getCategoryIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('beer')) return Beer;
  if (lower.includes('wine')) return GlassWater;
  if (lower.includes('momo') || lower.includes('food')) return Utensils;
  if (lower.includes('juice') || lower.includes('soft') || lower.includes('mixer')) return Sparkles;
  if (lower.includes('snack') || lower.includes('energy')) return Zap;
  return Wine;
}

export default function HomeLanding() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [dbCategories, setDbCategories] = useState<HomeCategory[]>([]);
  const [dbProducts, setDbProducts] = useState<HomeProduct[]>([]);
  const [loadingDb, setLoadingDb] = useState(true);

  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'drinks' | 'food'>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch live settings and DB data
  useEffect(() => {
    async function loadData() {
      setLoadingDb(true);
      try {
        const data = await getHomeData();
        setHomeData(data);

        // Fetch live catalog from DB endpoint
        const catRes = await fetch('/api/catalog');
        if (catRes.ok) {
          const catJson = await catRes.json();
          if (catJson.categories && catJson.categories.length > 0) {
            setDbCategories(
              catJson.categories.map((c: any) => ({
                id: c.id,
                name: c.name,
                description: c.description || null,
                imageUrl: c.image_url || null,
                productImageUrl: null,
              }))
            );
          } else if (data.categories) {
            setDbCategories(data.categories);
          }

          if (catJson.products && catJson.products.length > 0) {
            setDbProducts(catJson.products);
          } else if (data.products) {
            setDbProducts(data.products);
          }
        }
      } catch (e) {
        console.error('Error fetching live DB data:', e);
      } finally {
        setLoadingDb(false);
      }
    }

    loadData();
  }, []);

  const slideImages =
    homeData?.heroBgImages && homeData.heroBgImages.length > 0
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

  const filteredProducts = dbProducts.filter(p => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activeTab === 'drinks') {
      return matchesSearch && !p.name.toLowerCase().includes('momo');
    }
    if (activeTab === 'food') {
      return matchesSearch && p.name.toLowerCase().includes('momo');
    }
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#404040] font-sans antialiased selection:bg-[#f46f25] selection:text-white">
      {/* 1. TOP BARMANDOO ORANGE BANNER */}
      <div className="bg-[#f46f25] px-4 py-2 text-center text-xs font-black text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 animate-ping rounded-full bg-white" />
            <span className="tracking-wide uppercase font-extrabold text-xs sm:text-sm">
              BARMANDOO · NEPAL&apos;S FASTEST LATE-NIGHT LIQUOR &amp; FOOD DELIVERY
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <Clock size={15} /> 45-MINUTE GUARANTEED DELIVERY
            </span>
            <span className="border-l border-white/30 pl-3">
              HOTLINE: {homeData?.phone || '+977-9802088800'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. BARMANDOO HERO LANDING & SLIDER */}
      <section className="relative min-h-[90vh] overflow-hidden bg-[#080d16] text-white flex flex-col justify-between">
        {/* BACKGROUND AUTO SLIDER (5 SECONDS TRANSITION) */}
        {slideImages.map((imgUrl, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentBgIndex
                ? 'opacity-40 scale-105 transition-transform duration-10000'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <Image
              src={imgUrl}
              alt="Barmandoo Background Slider"
              fill
              priority={idx === 0}
              className="object-cover object-center"
              unoptimized
            />
          </div>
        ))}

        {/* OVERLAY GRADIENTS matching screenshot */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/85 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none" />

        {/* TOP BAR / LOGO & USER/CART ICONS */}
        <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#f46f25] to-orange-600 text-white font-black text-3xl shadow-xl shadow-orange-500/30">
              B
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {homeData?.systemName || 'barmandoo'}
                <span className="text-[#f46f25]">.</span>
              </div>
              <p className="text-xs font-bold text-slate-300">
                {homeData?.tagline || 'Liquor & Late Night Food'}
              </p>
            </div>
          </Link>

          {/* User & Cart Icons top right */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition shadow-md"
              title="Sign In"
            >
              <User size={20} />
            </Link>

            <Link
              href="/customer"
              className="relative grid h-11 w-11 place-items-center rounded-full bg-[#f46f25] text-white shadow-xl shadow-orange-500/30 hover:bg-[#e05e16] transition"
              title="Cart"
            >
              <ShoppingBag size={20} />
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-white text-xs font-black text-[#f46f25] ring-2 ring-[#080d16]">
                0
              </span>
            </Link>
          </div>
        </header>

        {/* CENTER HERO HEADING & SEARCH (EXACT BARMANDOO SCREENSHOT LAYOUT) */}
        <div className="relative z-20 mx-auto flex flex-1 w-full max-w-5xl flex-col items-center justify-center px-4 py-16 text-center">
          {/* Logo Badge */}
          <div className="mb-6 flex items-center justify-center gap-2 rounded-full border border-amber-500/30 bg-black/70 px-5 py-2 text-xs font-black text-amber-400 backdrop-blur-md shadow-lg">
            <Flame size={16} className="text-[#f46f25]" />
            <span className="tracking-wider">NEPAL&apos;S #1 FASTEST DELIVERY PLATFORM</span>
          </div>

          {/* MAIN BIG CLEAR HEADING */}
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl uppercase leading-none drop-shadow-xl">
            <span className="text-[#f46f25]">FOOD &amp; </span>
            <span className="text-cyan-400">DRINKS </span>
            <span className="text-white">DELIVERY</span>
          </h1>

          <p className="mt-3 text-base sm:text-xl font-black tracking-widest text-slate-200 uppercase drop-shadow">
            EASY, FAST &amp; CONVENIENT
          </p>

          {/* LARGE ACCESSIBLE SEARCH BAR */}
          <div className="mt-10 w-full max-w-3xl">
            <div className="relative flex items-center rounded-full border-2 border-white/40 bg-white/95 p-2 shadow-2xl backdrop-blur-md transition-all focus-within:border-[#f46f25] focus-within:ring-4 focus-within:ring-orange-500/30">
              <Search size={24} className="ml-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for food or drinks (beer, whisky, momo, snacks...)"
                className="w-full bg-transparent px-4 py-3 text-base font-bold text-slate-900 outline-none placeholder:text-slate-400"
              />
              <Link
                href="/customer"
                className="flex items-center gap-2 rounded-full bg-[#f46f25] px-8 py-3.5 text-xs sm:text-sm font-black text-white shadow-lg hover:bg-[#e05e16] transition shrink-0"
              >
                <span>SEARCH</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <p className="mt-5 text-xs sm:text-sm font-black tracking-wider text-slate-200 uppercase drop-shadow-sm">
            ALCOHOL, BEVERAGES &amp; FOOD DELIVERY WITHIN 45 MINS
          </p>

          {/* SLIDER DOTS INDICATOR */}
          <div className="mt-8 flex items-center gap-2.5">
            {slideImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBgIndex(idx)}
                className={`h-3 rounded-full transition-all ${
                  idx === currentBgIndex ? 'w-10 bg-[#f46f25]' : 'w-3 bg-white/40 hover:bg-white'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* BOTTOM GUARANTEES STRIP */}
        <div className="relative z-20 border-t border-white/15 bg-black/75 backdrop-blur-md py-4 text-xs sm:text-sm font-bold text-slate-200">
          <div className="mx-auto flex max-w-7xl items-center justify-around px-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#f46f25]" />
              <span>100% Genuine Spirits</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-[#f46f25]" />
              <span>45 Min Express Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Utensils size={18} className="text-[#f46f25]" />
              <span>Late-Night Hot Food</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC DATABASE CATEGORIES SECTION */}
      <section className="py-14 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between border-b border-[#dddada] pb-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#000000]">Shop By Category</h2>
            <p className="text-xs sm:text-sm text-[#555] font-medium mt-0.5">
              Live Categories Fetched from Database
            </p>
          </div>

          <Link
            href="/customer"
            className="text-xs sm:text-sm font-bold text-[#f46f25] hover:underline flex items-center gap-1"
          >
            <span>View Catalog</span> <ChevronRight size={16} />
          </Link>
        </div>

        {loadingDb ? (
          <div className="flex h-32 items-center justify-center text-slate-500 font-bold gap-2">
            <Loader2 className="animate-spin text-[#f46f25]" size={20} />
            <span>Loading Categories from Database...</span>
          </div>
        ) : dbCategories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-xs font-bold text-slate-500">
            No active categories found in database yet. Add categories in Admin Panel.
          </div>
        ) : (
          <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {dbCategories.map(cat => {
              const Icon = getCategoryIcon(cat.name);
              return (
                <Link
                  key={cat.id}
                  href="/customer"
                  className="group relative flex flex-col justify-between rounded-2xl border border-[#dddada] bg-white p-5 transition hover:border-[#f46f25] hover:shadow-xl"
                >
                  <div>
                    <div className="grid h-14 w-14 place-items-center rounded-xl border border-[#eee] bg-[#f7f8f8] mb-4 text-[#f46f25] group-hover:bg-[#f46f25] group-hover:text-white transition">
                      <Icon size={26} />
                    </div>
                    <h3 className="text-sm font-extrabold text-[#000000] group-hover:text-[#f46f25] transition">
                      {cat.name}
                    </h3>
                  </div>

                  <div className="mt-4 text-xs font-bold text-[#777] flex items-center justify-between border-t border-[#eee] pt-3">
                    <span>In Stock</span>
                    <ArrowUpRight size={15} className="text-[#f46f25]" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. DYNAMIC DATABASE PRODUCTS SECTION */}
      <section className="py-14 bg-white border-y border-[#dddada]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-extrabold tracking-widest text-[#f46f25] uppercase">
                Database Store Products
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#000000] mt-0.5">
                Barmandoo Available Drinks &amp; Food
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`rounded-xl px-4 py-2 text-xs font-extrabold transition ${
                  activeTab === 'all'
                    ? 'bg-[#f46f25] text-white shadow-md'
                    : 'bg-[#f7f8f8] text-[#404040] border border-[#dddada]'
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => setActiveTab('drinks')}
                className={`rounded-xl px-4 py-2 text-xs font-extrabold transition ${
                  activeTab === 'drinks'
                    ? 'bg-[#f46f25] text-white shadow-md'
                    : 'bg-[#f7f8f8] text-[#404040] border border-[#dddada]'
                }`}
              >
                Drinks
              </button>
              <button
                onClick={() => setActiveTab('food')}
                className={`rounded-xl px-4 py-2 text-xs font-extrabold transition ${
                  activeTab === 'food'
                    ? 'bg-[#f46f25] text-white shadow-md'
                    : 'bg-[#f7f8f8] text-[#404040] border border-[#dddada]'
                }`}
              >
                Late Food
              </button>
            </div>
          </div>

          {loadingDb ? (
            <div className="flex h-40 items-center justify-center text-slate-500 font-bold gap-2">
              <Loader2 className="animate-spin text-[#f46f25]" size={24} />
              <span>Fetching live products from database...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-[#f7f8f8] p-12 text-center text-sm font-bold text-slate-600">
              No products available in database matching query. Add products via Admin Panel.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map(prod => (
                <div
                  key={prod.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-[#dddada] bg-white p-4 shadow-xs transition hover:border-[#f46f25] hover:shadow-xl"
                >
                  <div>
                    {/* Image & Stock Badge */}
                    <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-[#f7f8f8] p-3 border border-[#eee]">
                      <span className="absolute top-2 left-2 rounded-md bg-[#f46f25] px-2.5 py-0.5 text-[10px] font-black text-white shadow-xs">
                        Chilled Express
                      </span>

                      {prod.imageUrl ? (
                        <Image
                          src={prod.imageUrl}
                          alt={prod.name}
                          fill
                          className="object-contain p-2 group-hover:scale-105 transition duration-300"
                          unoptimized
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-slate-300">
                          <Wine size={48} />
                        </div>
                      )}
                    </div>

                    {/* Title & Brand */}
                    <div className="mt-4 space-y-1">
                      <span className="text-xs font-bold text-[#777] uppercase tracking-wider">
                        {prod.brand || 'Original'}
                      </span>
                      <h3 className="text-sm font-black text-[#000000] line-clamp-2 group-hover:text-[#f46f25] transition min-h-[40px]">
                        {prod.name}
                      </h3>
                      <div className="text-xs font-medium text-[#666]">
                        <span>{prod.size}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Add Button */}
                  <div className="mt-4 pt-3 border-t border-[#eee] flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400">PRICE</span>
                      <span className="text-base sm:text-lg font-black text-[#000000]">
                        Rs. {prod.price.toLocaleString('en-NP')}
                      </span>
                    </div>

                    <Link
                      href="/customer"
                      className="flex items-center gap-1.5 rounded-xl bg-[#f46f25] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-[#e05e16] transition"
                      title="Add to Cart"
                    >
                      <span>Add</span>
                      <ShoppingBag size={15} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. 45-MINUTE EXPRESS DELIVERY PROMO BANNER */}
      <section className="py-14 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-3xl bg-[#000000] p-8 sm:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-[#333]">
          <div className="space-y-3 text-center md:text-left">
            <span className="inline-block rounded-md bg-[#f46f25] px-3.5 py-1 text-xs font-black">
              24/7 EXPRESS LATE NIGHT SERVICE
            </span>
            <h3 className="text-3xl sm:text-4xl font-black">Delivering Happiness in 45 Minutes</h3>
            <p className="text-sm text-[#ccc] max-w-xl leading-relaxed">
              Whether it&apos;s a late-night house party or sudden food craving, Barmandoo is your go-to delivery partner across Kathmandu &amp; Butwal.
            </p>
          </div>

          <Link
            href="/customer"
            className="flex items-center gap-2 rounded-2xl bg-[#f46f25] px-8 py-4 text-sm font-black text-white hover:bg-[#e05e16] transition shrink-0 shadow-xl"
          >
            <span>ORDER NOW</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* 6. BARMANDOO FOOTER */}
      <footer className="border-t border-[#dddada] bg-[#000000] text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          <div>
            <div className="text-2xl font-black mb-2">
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