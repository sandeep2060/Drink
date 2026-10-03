'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  ShoppingBag,
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
  Phone,
  Mail,
  MapPin,
  Send,
  Plus,
  Check,
  Flame,
  ArrowDown,
  Instagram,
  Facebook,
  Twitter,
  Youtube
} from 'lucide-react';
import SignatureDrinkCanvas from './SignatureDrinkCanvas';

// ----------------------------------------------------
// REFERENCE DESIGN HIGH QUALITY PHOTOGRAPHY ASSETS
// ----------------------------------------------------
const IMAGES = {
  // Hero Burger + Fries
  heroBurger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop',
  // Categories
  catPizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
  catBurger: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800&auto=format&fit=crop',
  catChicken: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=800&auto=format&fit=crop',
  catAsian: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800&auto=format&fit=crop',
  catDrinks: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
  catDesserts: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop',
  catCoffee: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop',
  // Signature Drinks
  signatureDrink: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1000&auto=format&fit=crop',
  // Popular Products
  prodMargherita: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800&auto=format&fit=crop',
  prodBurger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
  prodWings: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=800&auto=format&fit=crop',
  prodCoffee: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&auto=format&fit=crop',
  // Testimonial Avatars
  avatar1: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  avatar2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
  avatar3: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
};

const HERO_SLIDES = [
  'https://instagram.fktm17-1.fna.fbcdn.net/v/t51.82787-15/581956763_18102710806677653_9099968982455809756_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&_nc_map=urlgen_bucketless&ig_cache_key=Mzc2NzUwODg2NjAxNjU4OTkxMQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=k7YA3rnb0twQ7kNvwEdbAUa&_nc_oc=AdqY6_DRoz03CrBgHHSoZhstQ_MS9afeJmWNNP3Cfqj3cClZD0BtTQ2sdbC9RXS_azqhV7TSjJX9a7YkUb2wpsr-&_nc_zt=23&_nc_ht=instagram.fktm17-1.fna&_nc_gid=MqaJlvmwprD7HuVrvCJLcA&_nc_ss=7b689&oh=00_AQOMni4P6DXqlrOgEc7FLyhh2p0-CTDhxKSN9s0XA6HHpg&oe=6AC6BDAD',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1600&auto=format&fit=crop',
];

export default function HomeLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [location, setLocation] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Live Database State
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loadingDb, setLoadingDb] = useState(true);

  // 5-second auto background slider state
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 5 SECONDS BACKGROUND AUTO SLIDER
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // FETCH LIVE DATA FROM DATABASE
  useEffect(() => {
    async function loadLiveData() {
      setLoadingDb(true);
      try {
        const res = await fetch('/api/catalog');
        if (res.ok) {
          const json = await res.json();
          if (json.categories) setDbCategories(json.categories);
          if (json.products) setDbProducts(json.products);
        }
      } catch (err) {
        console.error('Failed to load database catalog:', err);
      } finally {
        setLoadingDb(false);
      }
    }
    loadLiveData();
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
    <div className="min-h-screen bg-[#0d0f12] text-white font-sans antialiased overflow-x-hidden">
      
      {/* ================================================== */}
      {/* 3. HEADER / NAVIGATION */}
      {/* ================================================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gradient-to-r from-[#ff3b00] via-[#ff4d00] to-[#ff5b00] text-white shadow-xl ${
          scrolled ? 'py-3 border-b border-orange-700/40 shadow-2xl backdrop-blur-md' : 'py-4.5'
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 flex items-center justify-between">
          {/* Left: Foodies Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-full bg-white text-[#ff3b00] flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform duration-200">
              <Flame size={22} className="fill-[#ff3b00]" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white drop-shadow-sm">
              Foodies
            </span>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-9 text-base font-extrabold text-white/90 tracking-wide">
            <Link
              href="/"
              className="text-white relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white after:rounded-full"
            >
              Home
            </Link>
            <Link href="#menu" className="hover:text-white transition-colors">
              Menu
            </Link>
            <Link href="#about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="#offers" className="hover:text-white transition-colors">
              Offers
            </Link>
            <Link href="#contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-4 sm:gap-5">
            <button
              aria-label="Search food"
              className="p-2.5 rounded-full text-white hover:bg-white/20 transition"
            >
              <Search size={22} />
            </button>

            <Link
              href="/customer"
              aria-label="View Shopping Cart"
              className="relative p-2.5 rounded-full text-white hover:bg-white/20 transition"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-white text-xs font-black text-[#ff3b00] flex items-center justify-center ring-2 ring-[#ff3b00] shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/20 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#ff3b00] border-t border-white/20 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col gap-4 text-lg font-extrabold text-white">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="underline underline-offset-4"
              >
                Home
              </Link>
              <Link
                href="#menu"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white/80"
              >
                Menu
              </Link>
              <Link
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white/80"
              >
                About
              </Link>
              <Link
                href="#offers"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white/80"
              >
                Offers
              </Link>
              <Link
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white/80"
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </header>


      {/* ================================================== */}
      {/* 4. HERO SECTION WITH 5-SECOND AUTO BACKGROUND SLIDER */}
      {/* ================================================== */}
      <section className="relative min-h-[90vh] pt-28 pb-16 lg:pt-36 lg:pb-24 flex flex-col justify-between overflow-hidden bg-[#18092b]">
        
        {/* 5-SECOND AUTO SLIDING BACKGROUND IMAGES */}
        {HERO_SLIDES.map((slideImg, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide
                ? 'opacity-85 scale-105 transition-transform duration-10000'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <Image
              src={slideImg}
              alt="Food & Drinks Delivery Background"
              fill
              priority={idx === 0}
              className="object-cover object-center"
              unoptimized
            />
          </div>
        ))}

        {/* SOFTENED OVERLAY FOR MAXIMUM BACKGROUND VISIBILITY & READABILITY */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#190a36]/65 via-[#260e4e]/50 to-[#0b0c16]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 w-full flex-1 flex flex-col items-center justify-center text-center relative z-10 py-12">
          
          {/* Top Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-900/60 px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-purple-200 backdrop-blur-md shadow-lg mb-6">
            <Sparkles size={16} className="text-[#ff5b00]" />
            <span>NEPAL&apos;S #1 FASTEST DELIVERY PLATFORM</span>
          </div>

          {/* MAIN BIG CLEAR HEADING (BARMANDOO DESIGN) */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-none drop-shadow-2xl">
            <span className="text-[#ff5b00]">FOOD &amp; </span>
            <span className="text-[#00e5ff]">DRINKS </span>
            <span className="text-white">DELIVERY</span>
          </h1>

          <p className="mt-3 text-base sm:text-xl font-black tracking-widest text-slate-200 uppercase drop-shadow">
            EASY, FAST &amp; CONVENIENT
          </p>

          {/* LARGE ACCESSIBLE SEARCH BAR */}
          <div className="mt-10 w-full max-w-3xl">
            <div className="relative flex items-center rounded-full border-2 border-white/40 bg-white p-2 shadow-2xl backdrop-blur-md transition-all focus-within:border-[#ff5b00] focus-within:ring-4 focus-within:ring-orange-500/30">
              <Search size={24} className="ml-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Search for food or drinks (beer, whisky, momo, pizza, snacks...)"
                className="w-full bg-transparent px-4 py-3 text-base font-bold text-slate-900 outline-none placeholder:text-slate-400"
              />
              <Link
                href="/customer"
                className="flex items-center gap-2 rounded-full bg-[#ff5b00] px-8 py-3.5 text-sm font-black text-white shadow-lg hover:bg-[#e05000] transition shrink-0"
              >
                <span>SEARCH</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <p className="mt-6 text-xs sm:text-sm font-black tracking-widest text-cyan-300 uppercase drop-shadow-sm">
            ALCOHOL, BEVERAGES &amp; FOOD DELIVERY WITHIN 45 MINS
          </p>

          {/* 5-SECOND SLIDER DOTS INDICATOR */}
          <div className="mt-8 flex items-center gap-3">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  idx === currentSlide
                    ? 'w-10 bg-[#ff5b00] shadow-md shadow-orange-500/50'
                    : 'w-3 bg-white/40 hover:bg-white'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>

        {/* BOTTOM GUARANTEES STRIP */}
        <div className="relative z-20 border-t border-white/15 bg-black/60 backdrop-blur-md py-4 text-xs sm:text-sm font-bold text-slate-200">
          <div className="mx-auto flex max-w-7xl items-center justify-around px-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#ff5b00]" />
              <span>100% Genuine Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-cyan-400" />
              <span>45 Min Express Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={18} className="text-[#ff5b00]" />
              <span>24/7 Late-Night Delivery</span>
            </div>
          </div>
        </div>
      </section>


      {/* ================================================== */}
      {/* 5. SHOP BY CATEGORY (MATCHING REFERENCE CARD GRID) */}
      {/* ================================================== */}
      <section id="categories" className="py-20 lg:py-28 bg-[#0b0c0e] relative">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
            <div>
              <span className="text-sm font-black tracking-widest text-[#ff5b00] uppercase block mb-1">
                WHAT ARE YOU CRAVING?
              </span>
              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white">
                Shop by <span className="text-[#ff5b00]">Category</span>
              </h2>
              <p className="text-slate-300 text-base sm:text-xl font-medium mt-3">
                Explore our delicious food &amp; drinks categories
              </p>
            </div>

            <Link
              href="#menu"
              className="inline-flex items-center gap-2.5 text-base sm:text-lg font-black text-[#ff5b00] hover:text-[#e05000] transition group shrink-0"
            >
              <span>View All</span>
              <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>

          {/* CATEGORY GRID: ROW 1 (3 Prominent Cards), ROW 2 (4 Compact Cards) */}
          <div className="space-y-6">
            
            {/* ROW 1: 3 Larger Prominent Category Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Pizza (Warm Yellow/Orange) */}
              <div className="group relative rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-[#e58a00] to-[#c86e00] text-white flex flex-col justify-between overflow-hidden min-h-[270px] sm:min-h-[300px] shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-orange-950/50">
                <div className="relative z-10 space-y-1.5">
                  <h3 className="text-3xl sm:text-4xl font-black tracking-tight drop-shadow-md">Pizza</h3>
                  <p className="text-sm sm:text-base font-bold text-amber-100 drop-shadow-xs">Fresh &amp; Tasty</p>
                </div>

                <div className="relative z-10 flex items-center justify-between mt-8">
                  <div className="h-10 w-10 rounded-full bg-white text-[#c86e00] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition duration-300">
                    <ArrowRight size={18} />
                  </div>
                </div>

                {/* Card Image */}
                <div className="absolute right-[-10%] bottom-[-10%] w-[60%] aspect-square rounded-full overflow-hidden transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl">
                  <Image
                    src={IMAGES.catPizza}
                    alt="Fresh Tasty Pizza"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>

              {/* Card 2: Burgers (Vibrant Orange) */}
              <div className="group relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#ff5b00] to-[#d64100] text-white flex flex-col justify-between overflow-hidden min-h-[260px] sm:min-h-[290px] shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-orange-950/50">
                <div className="relative z-10 space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Burgers</h3>
                  <p className="text-xs sm:text-sm font-medium text-orange-100">Juicy &amp; Delicious</p>
                </div>

                <div className="relative z-10 flex items-center justify-between mt-8">
                  <div className="h-10 w-10 rounded-full bg-white text-[#d64100] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition duration-300">
                    <ArrowRight size={18} />
                  </div>
                </div>

                {/* Card Image */}
                <div className="absolute right-[-10%] bottom-[-10%] w-[60%] aspect-square rounded-full overflow-hidden transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl">
                  <Image
                    src={IMAGES.catBurger}
                    alt="Juicy Gourmet Burger"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>

              {/* Card 3: Chicken (Bold Crimson Red) */}
              <div className="group relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#dc2626] to-[#991b1b] text-white flex flex-col justify-between overflow-hidden min-h-[260px] sm:min-h-[290px] shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-red-950/50">
                <div className="relative z-10 space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Chicken</h3>
                  <p className="text-xs sm:text-sm font-medium text-red-100">Crispy &amp; Spicy</p>
                </div>

                <div className="relative z-10 flex items-center justify-between mt-8">
                  <div className="h-10 w-10 rounded-full bg-white text-[#991b1b] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition duration-300">
                    <ArrowRight size={18} />
                  </div>
                </div>

                {/* Card Image */}
                <div className="absolute right-[-10%] bottom-[-10%] w-[60%] aspect-square rounded-full overflow-hidden transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl">
                  <Image
                    src={IMAGES.catChicken}
                    alt="Crispy Fried Chicken"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>

            </div>

            {/* ROW 2: 4 Smaller Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 4: Asian Food (Deep Teal / Green) */}
              <div className="group relative rounded-3xl p-6 bg-gradient-to-br from-[#0d9488] to-[#0f766e] text-white flex flex-col justify-between overflow-hidden min-h-[220px] shadow-xl transition-all duration-300 hover:-translate-y-1.5">
                <div className="relative z-10 space-y-1">
                  <h3 className="text-xl font-black tracking-tight">Asian Food</h3>
                  <p className="text-xs font-medium text-teal-100">Authentic Taste</p>
                </div>

                <div className="relative z-10 flex items-center justify-between mt-6">
                  <div className="h-9 w-9 rounded-full bg-white text-[#0f766e] flex items-center justify-center shadow-md group-hover:scale-110 transition duration-300">
                    <ArrowRight size={16} />
                  </div>
                </div>

                <div className="absolute right-[-10%] bottom-[-10%] w-[55%] aspect-square rounded-full overflow-hidden transition-transform duration-500 group-hover:scale-110">
                  <Image
                    src={IMAGES.catAsian}
                    alt="Authentic Asian Food"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>

              {/* Card 5: Drinks (Bright Cyan / Teal) */}
              <div className="group relative rounded-3xl p-6 bg-gradient-to-br from-[#06b6d4] to-[#0891b2] text-white flex flex-col justify-between overflow-hidden min-h-[220px] shadow-xl transition-all duration-300 hover:-translate-y-1.5">
                <div className="relative z-10 space-y-1">
                  <h3 className="text-xl font-black tracking-tight">Drinks</h3>
                  <p className="text-xs font-medium text-cyan-100">Cool &amp; Refreshing</p>
                </div>

                <div className="relative z-10 flex items-center justify-between mt-6">
                  <div className="h-9 w-9 rounded-full bg-white text-[#0891b2] flex items-center justify-center shadow-md group-hover:scale-110 transition duration-300">
                    <ArrowRight size={16} />
                  </div>
                </div>

                <div className="absolute right-[-10%] bottom-[-10%] w-[55%] aspect-square rounded-full overflow-hidden transition-transform duration-500 group-hover:scale-110">
                  <Image
                    src={IMAGES.catDrinks}
                    alt="Cool Refreshing Drinks"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>

              {/* Card 6: Desserts (Vibrant Pink) */}
              <div className="group relative rounded-3xl p-6 bg-gradient-to-br from-[#ec4899] to-[#be185d] text-white flex flex-col justify-between overflow-hidden min-h-[220px] shadow-xl transition-all duration-300 hover:-translate-y-1.5">
                <div className="relative z-10 space-y-1">
                  <h3 className="text-xl font-black tracking-tight">Desserts</h3>
                  <p className="text-xs font-medium text-pink-100">Sweet Moments</p>
                </div>

                <div className="relative z-10 flex items-center justify-between mt-6">
                  <div className="h-9 w-9 rounded-full bg-white text-[#be185d] flex items-center justify-center shadow-md group-hover:scale-110 transition duration-300">
                    <ArrowRight size={16} />
                  </div>
                </div>

                <div className="absolute right-[-10%] bottom-[-10%] w-[55%] aspect-square rounded-full overflow-hidden transition-transform duration-500 group-hover:scale-110">
                  <Image
                    src={IMAGES.catDesserts}
                    alt="Sweet Moments Desserts"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>

              {/* Card 7: Coffee & Mocktails (Rich Purple) */}
              <div className="group relative rounded-3xl p-6 bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] text-white flex flex-col justify-between overflow-hidden min-h-[220px] shadow-xl transition-all duration-300 hover:-translate-y-1.5">
                <div className="relative z-10 space-y-1">
                  <h3 className="text-xl font-black tracking-tight">Coffee &amp; Mocktails</h3>
                  <p className="text-xs font-medium text-purple-100">Relax &amp; Refresh</p>
                </div>

                <div className="relative z-10 flex items-center justify-between mt-6">
                  <div className="h-9 w-9 rounded-full bg-white text-[#6d28d9] flex items-center justify-center shadow-md group-hover:scale-110 transition duration-300">
                    <ArrowRight size={16} />
                  </div>
                </div>

                <div className="absolute right-[-10%] bottom-[-10%] w-[55%] aspect-square rounded-full overflow-hidden transition-transform duration-500 group-hover:scale-110">
                  <Image
                    src={IMAGES.catCoffee}
                    alt="Coffee and Mocktails"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* ================================================== */}
      {/* 6. SIGNATURE DRINK EXPERIENCE (Scroll Pouring 3D effect) */}
      {/* ================================================== */}
      <section className="py-24 bg-gradient-to-b from-[#090a0c] via-[#0f1217] to-[#090a0c] relative overflow-hidden border-y border-white/5">
        {/* Background glow behind glass */}
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <span className="text-xs font-extrabold tracking-widest text-[#06b6d4] uppercase block">
              SIGNATURE DRINKS
            </span>

            <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Cool Drinks <br />
              for <span className="text-[#ff5b00]">Hot Days</span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Chill, sip, repeat. Enjoy our refreshing drinks made with the best ingredients.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="#menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#ff5b00] hover:bg-[#e05000] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-orange-600/30 transition hover:scale-105"
              >
                <span>Explore Drinks</span>
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Trust points */}
            <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 border-t border-white/10 text-xs font-semibold text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>100% Fresh Ingredients</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                <span>No Added Preservatives</span>
              </div>
            </div>
          </div>

          {/* Right Interactive Canvas Pouring Column */}
          <div className="lg:col-span-6 relative flex justify-center">
            <SignatureDrinkCanvas />
          </div>

        </div>
      </section>


      {/* ================================================== */}
      {/* 7. POPULAR FOOD SECTION (Warm Cream Background) */}
      {/* ================================================== */}
      <section id="menu" className="py-20 lg:py-28 bg-[#f5f2eb] text-slate-900 relative">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-extrabold tracking-widest text-[#ff5b00] uppercase block mb-1">
                POPULAR THIS WEEK
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
                Our Popular Food
              </h2>
            </div>

            <Link
              href="/customer"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#ff5b00] hover:text-[#e05000] transition group shrink-0"
            >
              <span>View All</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 4-Card Desktop Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Product 1: Margherita Pizza */}
            <div className="group rounded-3xl bg-white p-5 shadow-lg border border-slate-200/80 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div>
                {/* Image Wrap */}
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-4 bg-slate-100">
                  <Image
                    src={IMAGES.prodMargherita}
                    alt="Margherita Pizza"
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                    unoptimized
                  />
                  <button
                    onClick={() => toggleFavorite(1)}
                    className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-red-500 transition shadow"
                    aria-label="Add to Favorites"
                  >
                    <Heart size={18} className={favorites[1] ? 'fill-red-500 text-red-500' : ''} />
                  </button>
                </div>

                {/* Details */}
                <h3 className="text-lg font-black text-slate-900 group-hover:text-[#ff5b00] transition">
                  Margherita Pizza
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  Classic cheese &amp; tomato
                </p>
                <div className="flex items-center gap-1 mt-2 text-amber-500 font-bold text-xs">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span>4.8</span>
                </div>
              </div>

              {/* Price & Add */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-lg font-black text-slate-900">
                  Rs. 450
                </span>
                <button
                  onClick={() => handleAddToCart(1)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold transition-all ${
                    addedItems[1]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#ff5b00] text-white hover:bg-[#e05000] shadow-md shadow-orange-500/20'
                  }`}
                >
                  {addedItems[1] ? (
                    <>
                      <Check size={14} /> Added
                    </>
                  ) : (
                    <>
                      <Plus size={14} /> Add
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Product 2: Chicken Burger */}
            <div className="group rounded-3xl bg-white p-5 shadow-lg border border-slate-200/80 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div>
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-4 bg-slate-100">
                  <Image
                    src={IMAGES.prodBurger}
                    alt="Chicken Burger"
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                    unoptimized
                  />
                  <button
                    onClick={() => toggleFavorite(2)}
                    className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-red-500 transition shadow"
                    aria-label="Add to Favorites"
                  >
                    <Heart size={18} className={favorites[2] ? 'fill-red-500 text-red-500' : ''} />
                  </button>
                </div>

                <h3 className="text-lg font-black text-slate-900 group-hover:text-[#ff5b00] transition">
                  Chicken Burger
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  Crispy chicken, fresh veggies
                </p>
                <div className="flex items-center gap-1 mt-2 text-amber-500 font-bold text-xs">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span>4.6</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-lg font-black text-slate-900">
                  Rs. 320
                </span>
                <button
                  onClick={() => handleAddToCart(2)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold transition-all ${
                    addedItems[2]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#ff5b00] text-white hover:bg-[#e05000] shadow-md shadow-orange-500/20'
                  }`}
                >
                  {addedItems[2] ? (
                    <>
                      <Check size={14} /> Added
                    </>
                  ) : (
                    <>
                      <Plus size={14} /> Add
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Product 3: Chicken Wings */}
            <div className="group rounded-3xl bg-white p-5 shadow-lg border border-slate-200/80 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div>
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-4 bg-slate-100">
                  <Image
                    src={IMAGES.prodWings}
                    alt="Spicy Chicken Wings"
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                    unoptimized
                  />
                  <button
                    onClick={() => toggleFavorite(3)}
                    className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-red-500 transition shadow"
                    aria-label="Add to Favorites"
                  >
                    <Heart size={18} className={favorites[3] ? 'fill-red-500 text-red-500' : ''} />
                  </button>
                </div>

                <h3 className="text-lg font-black text-slate-900 group-hover:text-[#ff5b00] transition">
                  Chicken Wings
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  Spicy &amp; crunchy wings
                </p>
                <div className="flex items-center gap-1 mt-2 text-amber-500 font-bold text-xs">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span>4.6</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-lg font-black text-slate-900">
                  Rs. 280
                </span>
                <button
                  onClick={() => handleAddToCart(3)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold transition-all ${
                    addedItems[3]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#ff5b00] text-white hover:bg-[#e05000] shadow-md shadow-orange-500/20'
                  }`}
                >
                  {addedItems[3] ? (
                    <>
                      <Check size={14} /> Added
                    </>
                  ) : (
                    <>
                      <Plus size={14} /> Add
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Product 4: Cold Coffee */}
            <div className="group rounded-3xl bg-white p-5 shadow-lg border border-slate-200/80 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div>
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-4 bg-slate-100">
                  <Image
                    src={IMAGES.prodCoffee}
                    alt="Chilled Cold Coffee"
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                    unoptimized
                  />
                  <button
                    onClick={() => toggleFavorite(4)}
                    className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-red-500 transition shadow"
                    aria-label="Add to Favorites"
                  >
                    <Heart size={18} className={favorites[4] ? 'fill-red-500 text-red-500' : ''} />
                  </button>
                </div>

                <h3 className="text-lg font-black text-slate-900 group-hover:text-[#ff5b00] transition">
                  Cold Coffee
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  Chilled &amp; refreshing
                </p>
                <div className="flex items-center gap-1 mt-2 text-amber-500 font-bold text-xs">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span>4.8</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-lg font-black text-slate-900">
                  Rs. 180
                </span>
                <button
                  onClick={() => handleAddToCart(4)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold transition-all ${
                    addedItems[4]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#ff5b00] text-white hover:bg-[#e05000] shadow-md shadow-orange-500/20'
                  }`}
                >
                  {addedItems[4] ? (
                    <>
                      <Check size={14} /> Added
                    </>
                  ) : (
                    <>
                      <Plus size={14} /> Add
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ================================================== */}
      {/* 8. APP PROMOTION (Dark Cinematic) */}
      {/* ================================================== */}
      <section className="py-20 lg:py-28 bg-[#090a0c] text-white relative overflow-hidden border-t border-white/10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Phone Mockups */}
          <div className="lg:col-span-6 relative flex justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-[420px] aspect-3/4">
              {/* Phone Mockup 1 */}
              <div className="absolute left-0 top-6 w-[70%] aspect-[9/18] rounded-[36px] bg-slate-900 border-4 border-slate-700 shadow-2xl overflow-hidden -rotate-6 transition-transform duration-500 hover:rotate-0">
                <Image
                  src={IMAGES.heroBurger}
                  alt="Foodies Mobile App"
                  fill
                  className="object-cover opacity-90"
                  unoptimized
                />
              </div>

              {/* Phone Mockup 2 */}
              <div className="absolute right-0 top-0 w-[75%] aspect-[9/18] rounded-[40px] bg-slate-950 border-4 border-slate-800 shadow-2xl overflow-hidden rotate-6 transition-transform duration-500 hover:rotate-0">
                <Image
                  src={IMAGES.catPizza}
                  alt="Foodies App Interface"
                  fill
                  className="object-cover opacity-95"
                  unoptimized
                />
              </div>
            </div>
          </div>

          {/* Right Column: Copy & App Download Buttons */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left order-1 lg:order-2">
            <span className="text-xs font-extrabold tracking-widest text-[#ff5b00] uppercase block">
              GET THE APP
            </span>

            <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Order Faster <br />
              <span className="text-[#ff5b00]">On Mobile</span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Download our app and enjoy exclusive offers, quick ordering and real-time tracking.
            </p>

            {/* Store Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                className="h-14 px-6 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center gap-3 transition"
              >
                <div className="text-left">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Download on the</span>
                  <span className="text-sm font-bold text-white">App Store</span>
                </div>
              </button>

              <button
                className="h-14 px-6 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center gap-3 transition"
              >
                <div className="text-left">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Get it on</span>
                  <span className="text-sm font-bold text-white">Google Play</span>
                </div>
              </button>
            </div>

            {/* App Benefits List */}
            <div className="pt-6 grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0 text-left border-t border-white/10 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-[#ff5b00]" />
                <span>Exclusive Offers</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-[#ff5b00]" />
                <span>Easy Ordering</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-[#ff5b00]" />
                <span>Live Tracking</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-[#ff5b00]" />
                <span>Hassle Free</span>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ================================================== */}
      {/* 9. CUSTOMER TESTIMONIALS */}
      {/* ================================================== */}
      <section className="py-20 lg:py-28 bg-[#f5f2eb] text-slate-900">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold tracking-widest text-[#ff5b00] uppercase block mb-1">
              REAL STORIES
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Testimonial 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200/80 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic">
                  &ldquo;Amazing food and super fast delivery! The pizza was perfectly made.&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-[#ff5b00]">
                  <Image
                    src={IMAGES.avatar1}
                    alt="Samiksha Shrestha"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Samiksha Shrestha</h4>
                  <p className="text-xs text-slate-500">Verified Customer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200/80 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic">
                  &ldquo;Best food delivery service in town. Everything arrived fresh.&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-[#ff5b00]">
                  <Image
                    src={IMAGES.avatar2}
                    alt="Rohan Thapa"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Rohan Thapa</h4>
                  <p className="text-xs text-slate-500">Verified Customer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200/80 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic">
                  &ldquo;The drinks are refreshing and the app is very easy to use.&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-[#ff5b00]">
                  <Image
                    src={IMAGES.avatar3}
                    alt="Aayush KC"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Aayush KC</h4>
                  <p className="text-xs text-slate-500">Verified Customer</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ================================================== */}
      {/* 10. FOOTER */}
      {/* ================================================== */}
      <footer id="contact" className="bg-[#08090b] text-white pt-16 pb-12 border-t border-white/10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-[#ff5b00] flex items-center justify-center text-white">
                <Flame size={20} className="fill-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Foodies
              </span>
            </Link>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              &ldquo;Good Food. Great Moments.&rdquo; Delivering your favorite food &amp; drinks fresh to your doorstep within 30 minutes.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#" aria-label="Facebook" className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#ff5b00] transition">
                <Facebook size={16} />
              </a>
              <a href="#" aria-label="Instagram" className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#ff5b00] transition">
                <Instagram size={16} />
              </a>
              <a href="#" aria-label="Twitter" className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#ff5b00] transition">
                <Twitter size={16} />
              </a>
              <a href="#" aria-label="YouTube" className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#ff5b00] transition">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="#menu" className="hover:text-white transition">Menu</Link></li>
              <li><Link href="#about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="#offers" className="hover:text-white transition">Offers</Link></li>
              <li><Link href="#contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li><Link href="#categories" className="hover:text-white transition">Pizza</Link></li>
              <li><Link href="#categories" className="hover:text-white transition">Burgers</Link></li>
              <li><Link href="#categories" className="hover:text-white transition">Chicken</Link></li>
              <li><Link href="#categories" className="hover:text-white transition">Asian Food</Link></li>
              <li><Link href="#categories" className="hover:text-white transition">Drinks</Link></li>
              <li><Link href="#categories" className="hover:text-white transition">Coffee / Mocktails</Link></li>
            </ul>
          </div>

          {/* Subscribe */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Subscribe</h4>
            <p className="text-xs text-slate-400">Get exclusive offers and updates.</p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative flex items-center rounded-2xl bg-white/10 border border-white/20 p-1">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-slate-400 outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="h-8 w-8 rounded-xl bg-[#ff5b00] hover:bg-[#e05000] text-white flex items-center justify-center shrink-0 transition"
                >
                  <Send size={14} />
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 font-semibold">
                  Thank you for subscribing!
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-semibold gap-4">
          <p>© 2026 Foodies. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-slate-300 transition">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-300 transition">Terms &amp; Conditions</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}