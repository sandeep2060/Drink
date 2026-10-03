'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Star,
  Heart,
  ArrowRight,
  ChevronRight,
  Clock,
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  Send,
  Plus,
  Check,
  Flame,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Smartphone,
  Truck,
  Zap,
  Leaf,
  Smile,
  RefreshCw
} from 'lucide-react';
import SignatureDrinkCanvas from './SignatureDrinkCanvas';

// High resolution commercial beverage photography assets
const IMAGES = {
  // Hero Composition Drinks
  heroDrinkMain: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1000&auto=format&fit=crop',
  heroDrinkSec: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
  heroDrinkTert: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=800&auto=format&fit=crop',
  // Category Display Cards
  catSparkling: 'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=800&auto=format&fit=crop',
  catJuice: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?q=80&w=800&auto=format&fit=crop',
  catEnergy: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop',
  catTea: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop',
  catMocktail: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop',
  catHydration: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=800&auto=format&fit=crop',
  catSpirits: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=800&auto=format&fit=crop',
  // Popular Products
  prodMatcha: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=800&auto=format&fit=crop',
  prodYuzu: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
  prodBerry: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?q=80&w=800&auto=format&fit=crop',
  prodGinger: 'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=800&auto=format&fit=crop',
  // Brand Story & Lifestyle
  storyCraft: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1000&auto=format&fit=crop',
  appMockup: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop',
  // Testimonial Avatars
  avatar1: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  avatar2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
  avatar3: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
};

const CATEGORIES = [
  { id: 'sparkling', name: 'Sparkling Botanicals', desc: 'Light & Effervescent', bg: 'from-[#0E3B2E] to-[#174e3e]', image: IMAGES.catSparkling, color: '#B8D94E' },
  { id: 'juices', name: 'Cold-Pressed Juices', desc: '100% Real Fruit', bg: 'from-[#2d5740] to-[#1e402e]', image: IMAGES.catJuice, color: '#FFFFFF' },
  { id: 'energy', name: 'Natural Energy', desc: 'Plant-Based Boost', bg: 'from-[#47765B] to-[#2d523d]', image: IMAGES.catEnergy, color: '#B8D94E' },
  { id: 'teas', name: 'Artisanal Teas & Matcha', desc: 'Ceremonial Grade', bg: 'from-[#173026] to-[#0b1f18]', image: IMAGES.catTea, color: '#FFFFFF' },
  { id: 'mocktails', name: 'Craft Mocktails', desc: 'Zero Alcohol Refreshment', bg: 'from-[#1e4638] to-[#113127]', image: IMAGES.catMocktail, color: '#B8D94E' },
  { id: 'hydration', name: 'Electrolyte Hydration', desc: 'Essential Minerals', bg: 'from-[#2d5d48] to-[#1c4233]', image: IMAGES.catHydration, color: '#FFFFFF' },
  { id: 'spirits', name: 'Premium Craft Beverages', desc: 'Curated Cellar', bg: 'from-[#0E3B2E] to-[#08261e]', image: IMAGES.catSpirits, color: '#B8D94E' },
];

export default function HomeLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Live Database Catalog state
  const [dbProducts, setDbProducts] = useState<any[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch('/api/catalog');
        if (res.ok) {
          const json = await res.json();
          if (json.products && json.products.length > 0) {
            setDbProducts(json.products);
          }
        }
      } catch (err) {
        console.error('Catalog fetch note:', err);
      }
    }
    loadCatalog();
  }, []);

  const handleAddToCart = (id: string) => {
    setAddedItems(prev => ({ ...prev, [id]: true }));
    setCartCount(prev => prev + 1);
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5ED] text-[#17211D] font-sans antialiased overflow-x-hidden selection:bg-[#0E3B2E] selection:text-[#B8D94E]">
      
      {/* ================================================== */}
      {/* 1. HEADER / NAVIGATION */}
      {/* ================================================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#F8F5ED]/90 backdrop-blur-md border-b border-[#0E3B2E]/10 py-3.5 shadow-sm'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8 flex items-center justify-between">
          
          {/* Left: JADE Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-2xl bg-[#0E3B2E] flex items-center justify-center text-[#B8D94E] font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              J
            </div>
            <span className="text-2xl font-black tracking-tight text-[#0E3B2E]">
              JADE <span className="text-xs font-bold uppercase tracking-widest text-[#47765B] block -mt-1">DRINKS</span>
            </span>
          </Link>

          {/* Center: Clean Compact Navigation */}
          <nav className="hidden md:flex items-center gap-9 text-sm font-bold text-[#17211D]/80">
            <Link href="/" className="text-[#0E3B2E] font-extrabold relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0E3B2E]">
              Home
            </Link>
            <Link href="#shop" className="hover:text-[#0E3B2E] transition-colors">
              Shop
            </Link>
            <Link href="#categories" className="hover:text-[#0E3B2E] transition-colors">
              Categories
            </Link>
            <Link href="#about" className="hover:text-[#0E3B2E] transition-colors">
              About
            </Link>
            <Link href="#contact" className="hover:text-[#0E3B2E] transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right: Search, Account, Cart & "Order Now" Button */}
          <div className="flex items-center gap-4 sm:gap-5">
            <button
              aria-label="Search"
              className="p-2 rounded-full text-[#0E3B2E] hover:bg-[#0E3B2E]/5 transition"
            >
              <Search size={20} />
            </button>

            <Link
              href="/login"
              aria-label="Account"
              className="p-2 rounded-full text-[#0E3B2E] hover:bg-[#0E3B2E]/5 transition hidden sm:flex"
            >
              <User size={20} />
            </Link>

            <Link
              href="#shop"
              aria-label="Cart"
              className="relative p-2 rounded-full text-[#0E3B2E] hover:bg-[#0E3B2E]/5 transition"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 h-4.5 w-4.5 rounded-full bg-[#0E3B2E] text-[10px] font-black text-[#B8D94E] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="#shop"
              className="hidden sm:inline-flex items-center justify-center rounded-full bg-[#0E3B2E] hover:bg-[#09281f] px-6 py-2.5 text-xs font-black text-[#F8F5ED] shadow-sm transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Order Now
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#0E3B2E]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#F8F5ED] border-b border-[#0E3B2E]/10 px-6 py-6 space-y-4 animate-in slide-in-from-top-4">
            <nav className="flex flex-col gap-4 text-base font-extrabold text-[#0E3B2E]">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="#shop" onClick={() => setMobileMenuOpen(false)}>
                Shop
              </Link>
              <Link href="#categories" onClick={() => setMobileMenuOpen(false)}>
                Categories
              </Link>
              <Link href="#about" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              <Link href="#contact" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
            </nav>
          </div>
        )}
      </header>


      {/* ================================================== */}
      {/* 2. HERO SECTION */}
      {/* ================================================== */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-28 overflow-hidden bg-[#F8F5ED]">
        {/* Abstract Soft Organic Backdrop Accent */}
        <div className="absolute top-10 right-10 w-[580px] h-[580px] bg-[#47765B]/15 rounded-full blur-[130px] pointer-events-none" />

        <div className="mx-auto max-w-[1360px] px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          
          {/* Left Column: Headlines & Action CTAs */}
          <div className="lg:col-span-6 space-y-7 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0E3B2E]/20 bg-[#0E3B2E]/5 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#0E3B2E]">
              <Sparkles size={14} className="text-[#0E3B2E]" />
              <span>REFRESH YOUR EVERYDAY</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#0E3B2E] leading-[0.98]">
              GOOD DRINKS. <br />
              <span className="text-[#47765B]">BETTER MOMENTS.</span>
            </h1>

            <p className="text-[#66716B] text-base sm:text-xl font-medium max-w-lg leading-relaxed">
              Discover refreshing drinks made for every mood, every moment, and every gathering. Fast delivery across Nepal.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="#shop"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#0E3B2E] hover:bg-[#09281f] px-8 py-4 text-sm font-black text-[#F8F5ED] shadow-md transition hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Shop Drinks</span>
                <ArrowRight size={17} />
              </Link>
              
              <Link
                href="#categories"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#0E3B2E] px-8 py-4 text-sm font-black text-[#0E3B2E] hover:bg-[#0E3B2E]/5 transition"
              >
                <span>Explore Categories</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Multi-Product Composition */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[560px] aspect-4/3 sm:aspect-square flex items-center justify-center">
              
              {/* Organic Soft Abstract Backdrop */}
              <div className="absolute inset-4 rounded-[48px] bg-gradient-to-br from-[#47765B]/20 via-[#0E3B2E]/10 to-transparent border border-[#0E3B2E]/10 shadow-xl" />

              {/* Main Product Bottle */}
              <div className="relative z-20 w-[55%] aspect-3/4 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/60 transform -rotate-3 transition duration-500 hover:rotate-0 hover:scale-105">
                <Image
                  src={IMAGES.heroDrinkMain}
                  alt="JADE Premium Beverage"
                  fill
                  priority
                  className="object-cover"
                  unoptimized
                />
                <span className="absolute top-3 left-3 bg-[#B8D94E] text-[#0E3B2E] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                  Best Seller
                </span>
              </div>

              {/* Secondary Product Bottle */}
              <div className="absolute left-2 bottom-4 z-10 w-[42%] aspect-3/4 rounded-3xl overflow-hidden shadow-xl border-2 border-white/60 transform rotate-6 transition duration-500 hover:rotate-0">
                <Image
                  src={IMAGES.heroDrinkSec}
                  alt="JADE Botanical Drink"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <span className="absolute top-3 left-3 bg-[#0E3B2E] text-[#F8F5ED] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                  Fresh
                </span>
              </div>

              {/* Tertiary Product Bottle */}
              <div className="absolute right-2 top-4 z-30 w-[38%] aspect-3/4 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/60 transform rotate-12 transition duration-500 hover:rotate-0">
                <Image
                  src={IMAGES.heroDrinkTert}
                  alt="JADE Sparkling Tea"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <span className="absolute top-3 right-3 bg-[#47765B] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                  New
                </span>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* ================================================== */}
      {/* 3. SEARCH & EXPRESS BAR (BARMANDOO UX INSPIRED) */}
      {/* ================================================== */}
      <section className="bg-[#0E3B2E] py-8 text-[#F8F5ED] shadow-xl">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="text-center md:text-left space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-[#B8D94E]">
                EXPRESS DELIVERY ACROSS KATHMANDU &amp; BUTWAL
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">Find Your Drink in Seconds</h3>
            </div>

            {/* Quick Search Bar */}
            <div className="w-full md:max-w-xl">
              <div className="relative flex items-center rounded-full bg-white p-1.5 shadow-lg">
                <Search size={20} className="ml-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search drinks (sparkling, juice, matcha, tea, mocktails...)"
                  className="w-full bg-transparent px-3 py-2 text-sm font-bold text-[#17211D] outline-none placeholder:text-slate-400"
                />
                <Link
                  href="#shop"
                  className="flex items-center gap-2 rounded-full bg-[#0E3B2E] px-6 py-2.5 text-xs font-black text-[#F8F5ED] hover:bg-[#09281f] transition shrink-0"
                >
                  <span>SEARCH</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ================================================== */}
      {/* 4. VISUAL SHOP BY CATEGORY */}
      {/* ================================================== */}
      <section id="categories" className="py-20 lg:py-28 bg-[#F8F5ED]">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-black tracking-widest text-[#47765B] uppercase block mb-1">
                EXPLORE CATALOG
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0E3B2E]">
                Shop by <span className="text-[#47765B]">Category</span>
              </h2>
              <p className="text-[#66716B] text-sm sm:text-base font-medium mt-2">
                Discover curated beverages for every occasion
              </p>
            </div>

            <Link
              href="#shop"
              className="inline-flex items-center gap-2 text-sm font-black text-[#0E3B2E] hover:text-[#47765B] transition group shrink-0"
            >
              <span>View All Categories</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                href="#shop"
                className={`group relative rounded-3xl p-6 bg-gradient-to-br ${cat.bg} text-white flex flex-col justify-between overflow-hidden min-h-[250px] shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl`}
              >
                <div className="relative z-10 space-y-1">
                  <h3 className="text-2xl font-black tracking-tight drop-shadow-sm">{cat.name}</h3>
                  <p className="text-xs font-bold text-white/80">{cat.desc}</p>
                </div>

                <div className="relative z-10 flex items-center justify-between mt-6">
                  <div className="h-10 w-10 rounded-full bg-white text-[#0E3B2E] flex items-center justify-center shadow-md group-hover:scale-110 transition duration-300">
                    <ArrowRight size={18} />
                  </div>
                </div>

                {/* Category Image */}
                <div className="absolute right-[-8%] bottom-[-8%] w-[62%] aspect-square rounded-full overflow-hidden transition-transform duration-500 group-hover:scale-105 shadow-2xl opacity-90">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>


      {/* ================================================== */}
      {/* 5. POPULAR PRODUCTS (DATABASE INTEGRATED) */}
      {/* ================================================== */}
      <section id="shop" className="py-20 lg:py-28 bg-white border-y border-[#0E3B2E]/10">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-black tracking-widest text-[#0E3B2E] uppercase block mb-1">
                TOP PICKS THIS WEEK
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0E3B2E]">
                Popular JADE Drinks
              </h2>
            </div>

            <Link
              href="/customer"
              className="inline-flex items-center gap-2 text-sm font-extrabold text-[#0E3B2E] hover:text-[#47765B] transition group shrink-0"
            >
              <span>View Full Store Catalog</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(dbProducts.length > 0 ? dbProducts.slice(0, 8) : [
              { id: '1', name: 'Jade Sparkling Matcha', price: 420, imageUrl: IMAGES.prodMatcha, brand: 'Organic Matcha', size: '330 ml' },
              { id: '2', name: 'Citrus Yuzu Refresh', price: 380, imageUrl: IMAGES.prodYuzu, brand: 'Cold Pressed', size: '350 ml' },
              { id: '3', name: 'Wild Berry Adaptogen', price: 450, imageUrl: IMAGES.prodBerry, brand: 'Botanical Elixir', size: '330 ml' },
              { id: '4', name: 'Spiced Ginger Tonic', price: 360, imageUrl: IMAGES.prodGinger, brand: 'Real Pressed', size: '300 ml' },
            ]).map((prod: any) => (
              <div
                key={prod.id}
                className="group rounded-3xl bg-[#F8F5ED] p-5 shadow-sm border border-[#0E3B2E]/10 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#0E3B2E]/30 relative"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-4 bg-white shadow-xs">
                    <Image
                      src={prod.imageUrl || IMAGES.prodMatcha}
                      alt={prod.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <button
                      onClick={() => toggleFavorite(prod.id)}
                      className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-red-500 transition shadow-md z-10"
                      aria-label="Add to Favorites"
                    >
                      <Heart size={18} className={favorites[prod.id] ? 'fill-red-500 text-red-500' : ''} />
                    </button>
                    <span className="absolute top-3 left-3 bg-[#B8D94E] text-[#0E3B2E] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                      Express 45m
                    </span>
                  </div>

                  {/* Product Details */}
                  <span className="text-[11px] font-bold text-[#66716B] uppercase tracking-wider block">
                    {prod.brand || 'JADE Craft'}
                  </span>
                  <h3 className="text-lg font-black text-[#0E3B2E] group-hover:text-[#47765B] transition line-clamp-1 mt-0.5">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-[#66716B] mt-1 line-clamp-1 font-medium">
                    {prod.size || 'Standard Bottle'}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-amber-500 font-extrabold text-xs">
                    <Star size={15} className="fill-amber-400 text-amber-400" />
                    <span>4.9</span>
                    <span className="text-[#66716B] font-semibold text-[11px] ml-1">(150+ reviews)</span>
                  </div>
                </div>

                {/* Price & Add Button */}
                <div className="mt-5 pt-3.5 border-t border-[#0E3B2E]/10 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-[#66716B] uppercase">Price</span>
                    <span className="text-xl font-black text-[#0E3B2E]">
                      Rs. {Number(prod.price).toLocaleString('en-NP')}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(prod.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-black transition-all duration-200 ${
                      addedItems[prod.id]
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-[#0E3B2E] text-[#F8F5ED] hover:bg-[#09281f] shadow-md shadow-emerald-950/20 hover:scale-105 active:scale-95'
                    }`}
                  >
                    {addedItems[prod.id] ? (
                      <>
                        <Check size={15} /> Added
                      </>
                    ) : (
                      <>
                        <Plus size={15} /> Add
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ================================================== */}
      {/* 6. SIGNATURE INTERACTIVE DRINK CANVAS */}
      {/* ================================================== */}
      <section className="py-24 bg-[#0E3B2E] text-white relative overflow-hidden">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <span className="text-xs font-black tracking-widest text-[#B8D94E] uppercase block">
              SIGNATURE EXPERIENCE
            </span>

            <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Pouring Perfection <br />
              Into Every <span className="text-[#B8D94E]">Glass.</span>
            </h2>

            <p className="text-slate-200 text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              Enjoy our signature botanical drinks served chilled. Made with 100% natural juices and organic green tea extracts.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="#shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#B8D94E] hover:bg-[#a6c73c] px-8 py-4 text-sm font-black text-[#0E3B2E] shadow-xl transition hover:scale-105"
              >
                <span>Order Signature Drinks</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative flex justify-center">
            <SignatureDrinkCanvas />
          </div>

        </div>
      </section>


      {/* ================================================== */}
      {/* 7. APP & EXPRESS PROMOTION */}
      {/* ================================================== */}
      <section className="py-20 lg:py-28 bg-[#F8F5ED]">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          <div className="rounded-[40px] bg-[#0E3B2E] p-8 sm:p-14 text-white shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center border border-[#47765B]/30">
            
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <span className="inline-block rounded-full bg-[#B8D94E] px-4 py-1 text-xs font-black text-[#0E3B2E]">
                24/7 LATE-NIGHT &amp; DAYTIME DELIVERY
              </span>
              <h3 className="text-3xl sm:text-5xl font-black tracking-tight">Order Faster on Mobile</h3>
              <p className="text-slate-200 text-sm sm:text-base max-w-xl leading-relaxed">
                Download the JADE app to unlock exclusive discounts, real-time live order tracking, and instant 45-minute delivery across Kathmandu &amp; Butwal.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  href="#shop"
                  className="flex items-center gap-2 rounded-2xl bg-[#B8D94E] px-8 py-4 text-sm font-black text-[#0E3B2E] hover:bg-[#a6c73c] transition shadow-xl"
                >
                  <span>ORDER ON APP</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-[320px] aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-[#47765B]">
                <Image
                  src={IMAGES.appMockup}
                  alt="JADE Mobile App"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ================================================== */}
      {/* 8. CUSTOMER REVIEWS */}
      {/* ================================================== */}
      <section className="py-20 lg:py-28 bg-white border-t border-[#0E3B2E]/10">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-black tracking-widest text-[#47765B] uppercase block mb-1">
              REAL CUSTOMER FEEDBACK
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0E3B2E]">
              What People Are Saying
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#F8F5ED] rounded-3xl p-8 border border-[#0E3B2E]/10 shadow-sm space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400" />
                ))}
              </div>
              <p className="text-[#17211D] text-sm sm:text-base leading-relaxed font-medium italic">
                &ldquo;Super fast delivery in Kathmandu! The Jade Sparkling Matcha is insanely refreshing.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-[#0E3B2E]/10">
                <div className="relative h-10 w-10 rounded-full overflow-hidden border border-[#0E3B2E]">
                  <Image src={IMAGES.avatar1} alt="Samiksha" fill className="object-cover" unoptimized />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#0E3B2E]">Samiksha Shrestha</h4>
                  <p className="text-xs text-[#66716B]">Verified Buyer</p>
                </div>
              </div>
            </div>

            <div className="bg-[#F8F5ED] rounded-3xl p-8 border border-[#0E3B2E]/10 shadow-sm space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400" />
                ))}
              </div>
              <p className="text-[#17211D] text-sm sm:text-base leading-relaxed font-medium italic">
                &ldquo;Best late-night drinks delivery app. Arrived cold in under 35 minutes!&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-[#0E3B2E]/10">
                <div className="relative h-10 w-10 rounded-full overflow-hidden border border-[#0E3B2E]">
                  <Image src={IMAGES.avatar2} alt="Rohan" fill className="object-cover" unoptimized />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#0E3B2E]">Rohan Thapa</h4>
                  <p className="text-xs text-[#66716B]">Verified Buyer</p>
                </div>
              </div>
            </div>

            <div className="bg-[#F8F5ED] rounded-3xl p-8 border border-[#0E3B2E]/10 shadow-sm space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400" />
                ))}
              </div>
              <p className="text-[#17211D] text-sm sm:text-base leading-relaxed font-medium italic">
                &ldquo;High quality organic ingredients. The Yuzu Refresh is my absolute favorite.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-[#0E3B2E]/10">
                <div className="relative h-10 w-10 rounded-full overflow-hidden border border-[#0E3B2E]">
                  <Image src={IMAGES.avatar3} alt="Aayush" fill className="object-cover" unoptimized />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#0E3B2E]">Aayush KC</h4>
                  <p className="text-xs text-[#66716B]">Verified Buyer</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ================================================== */}
      {/* 9. FOOTER */}
      {/* ================================================== */}
      <footer id="contact" className="bg-[#0E3B2E] text-[#F8F5ED] pt-16 pb-12 border-t border-[#47765B]/30">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-2xl bg-[#B8D94E] text-[#0E3B2E] flex items-center justify-center font-black text-xl">
                J
              </div>
              <span className="text-2xl font-black text-white">JADE DRINKS</span>
            </Link>
            <p className="text-slate-300 text-xs sm:text-sm max-w-sm leading-relaxed">
              Nepal&apos;s premier commercial beverage delivery brand. Delivering cold drinks, sparkling teas, and natural refreshments right to your door.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#B8D94E] hover:text-[#0E3B2E] transition">
                <Facebook size={16} />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#B8D94E] hover:text-[#0E3B2E] transition">
                <Instagram size={16} />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#B8D94E] hover:text-[#0E3B2E] transition">
                <Twitter size={16} />
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-black text-[#B8D94E] uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-300">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="#shop" className="hover:text-white">Shop Drinks</Link></li>
              <li><Link href="#categories" className="hover:text-white">Categories</Link></li>
              <li><Link href="#about" className="hover:text-white">About Us</Link></li>
              <li><Link href="#contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-black text-[#B8D94E] uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-300">
              <li><Link href="#categories" className="hover:text-white">Sparkling Botanicals</Link></li>
              <li><Link href="#categories" className="hover:text-white">Cold-Pressed Juices</Link></li>
              <li><Link href="#categories" className="hover:text-white">Natural Energy</Link></li>
              <li><Link href="#categories" className="hover:text-white">Artisanal Teas</Link></li>
              <li><Link href="#categories" className="hover:text-white">Craft Mocktails</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-black text-[#B8D94E] uppercase tracking-wider">Subscribe</h4>
            <p className="text-xs text-slate-300">Get exclusive offers &amp; updates.</p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative flex items-center rounded-full bg-white/10 border border-white/20 p-1">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-slate-400 outline-none"
                />
                <button
                  type="submit"
                  className="h-8 px-4 rounded-full bg-[#B8D94E] text-[#0E3B2E] font-black text-xs hover:bg-white transition"
                >
                  Send
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-[#B8D94E] font-bold">
                  Subscribed successfully!
                </p>
              )}
            </form>
          </div>

        </div>

        <div className="mx-auto max-w-[1360px] px-5 sm:px-8 mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-bold gap-4">
          <p>© 2026 JADE Drinks. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}