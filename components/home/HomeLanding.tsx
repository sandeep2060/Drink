'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingBag,
  Menu,
  X,
  Star,
  ArrowRight,
  Leaf,
  Sparkles,
  Droplet,
  Check,
  Plus,
  Instagram,
  ChevronRight,
  Sun,
  Shield,
  Heart
} from 'lucide-react';
import SignatureDrinkCanvas from './SignatureDrinkCanvas';

// High-end editorial photography assets matching Jade Drinks aesthetic
const IMAGES = {
  // Hero Product Shot (Transparent / Clean Botanical Beverage)
  heroProduct: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1200&auto=format&fit=crop',
  // Featured Beverages
  drinkJadeMatcha: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=800&auto=format&fit=crop',
  drinkCitrusGinger: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
  drinkBotanicalSparkling: 'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=800&auto=format&fit=crop',
  drinkBerryElixir: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?q=80&w=800&auto=format&fit=crop',
  // Story Lifestyle Photography
  storyCraft: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1000&auto=format&fit=crop',
  // Ingredients Closeups
  ingMatcha: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop',
  ingGinger: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=600&auto=format&fit=crop',
  ingCitrus: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?q=80&w=600&auto=format&fit=crop',
  ingBotanicals: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600&auto=format&fit=crop',
  // Lifestyle Cinematic Overlay
  lifestyleBanner: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1600&auto=format&fit=crop',
  // Customer Avatars
  avatar1: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  avatar2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
  avatar3: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop',
};

const FEATURED_PRODUCTS = [
  {
    id: 'jade-sparkling-matcha',
    name: 'Jade Sparkling Matcha',
    flavor: 'Organic Ceremonial Matcha, Yuzu & Wild Mint',
    tags: ['Organic Matcha', 'Zero Added Sugar', 'Gentle Energy'],
    price: 'Rs. 420',
    image: IMAGES.drinkJadeMatcha,
  },
  {
    id: 'citrus-ginger-elixir',
    name: 'Citrus Ginger Elixir',
    flavor: 'Pressed Meyer Lemon, Fresh Ginger Root & Honeybush',
    tags: ['Digestive Health', 'Low Calorie', 'Real Pressed Juice'],
    price: 'Rs. 380',
    image: IMAGES.drinkCitrusGinger,
  },
  {
    id: 'botanical-sparkling-tonic',
    name: 'Botanical Rose Tonic',
    flavor: 'Damask Rose, Hibiscus Flower & Lemon Balm',
    tags: ['Calming Herbs', 'Antioxidants', 'Naturally Hydrating'],
    price: 'Rs. 450',
    image: IMAGES.drinkBotanicalSparkling,
  },
  {
    id: 'wild-berry-adaptogen',
    name: 'Wild Berry Adaptogen',
    flavor: 'Crisp Blackberry, Ashwagandha & Holy Basil',
    tags: ['Stress Support', 'No Artificial Colors', 'Clean Focus'],
    price: 'Rs. 490',
    image: IMAGES.drinkBerryElixir,
  },
];

export default function HomeLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Live Database Products State (optional fallback to editorial list)
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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F3EA] text-[#17201C] font-sans antialiased overflow-x-hidden selection:bg-[#123C32] selection:text-[#D7E85A]">
      
      {/* ================================================== */}
      {/* 1. NAVIGATION BAR */}
      {/* ================================================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#F6F3EA]/90 backdrop-blur-md border-b border-[#123C32]/10 py-4 shadow-sm'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="mx-auto max-w-[1280px] px-6 sm:px-10 flex items-center justify-between">
          
          {/* Left: Minimal Premium Wordmark */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-full bg-[#123C32] flex items-center justify-center text-[#D7E85A] font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              J
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#123C32]">
              Jade <span className="font-light text-[#123C32]/70">Drinks</span>
            </span>
          </Link>

          {/* Center: Minimal Navigation Links */}
          <nav className="hidden md:flex items-center gap-10 text-sm font-semibold text-[#17201C]/80">
            <Link href="#shop" className="hover:text-[#123C32] transition-colors">
              Shop
            </Link>
            <Link href="#story" className="hover:text-[#123C32] transition-colors">
              Our Story
            </Link>
            <Link href="#ingredients" className="hover:text-[#123C32] transition-colors">
              Ingredients
            </Link>
            <Link href="#journal" className="hover:text-[#123C32] transition-colors">
              Journal
            </Link>
            <Link href="#contact" className="hover:text-[#123C32] transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right: Cart & Pill "Shop Now" Button */}
          <div className="flex items-center gap-5">
            <Link
              href="#shop"
              className="relative p-2 text-[#123C32] hover:opacity-80 transition"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={21} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#123C32] text-[10px] font-bold text-[#D7E85A] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="#shop"
              className="hidden sm:inline-flex items-center justify-center rounded-full bg-[#123C32] hover:bg-[#0c2b24] px-6 py-2.5 text-xs font-bold text-[#F6F3EA] shadow-sm transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Shop Now
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#123C32]"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#F6F3EA] border-b border-[#123C32]/10 px-8 py-6 space-y-4 animate-in slide-in-from-top-4">
            <nav className="flex flex-col gap-4 text-base font-bold text-[#123C32]">
              <Link href="#shop" onClick={() => setMobileMenuOpen(false)}>
                Shop
              </Link>
              <Link href="#story" onClick={() => setMobileMenuOpen(false)}>
                Our Story
              </Link>
              <Link href="#ingredients" onClick={() => setMobileMenuOpen(false)}>
                Ingredients
              </Link>
              <Link href="#journal" onClick={() => setMobileMenuOpen(false)}>
                Journal
              </Link>
              <Link href="#contact" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
            </nav>
          </div>
        )}
      </header>


      {/* ================================================== */}
      {/* 2. HERO SECTION (Editorial Botanical) */}
      {/* ================================================== */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-[#F6F3EA]">
        {/* Soft Organic Backdrop Background Shape */}
        <div className="absolute top-12 right-10 w-[550px] h-[550px] bg-[#A8B89A]/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-[1280px] px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#123C32]/20 bg-[#123C32]/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#123C32]">
              <Leaf size={14} className="text-[#123C32]" />
              <span>CRAFTED FOR YOUR EVERYDAY RITUAL</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#123C32] leading-[1.06]">
              Drinks made to feel as good as they taste.
            </h1>

            <p className="text-[#17201C]/80 text-base sm:text-xl font-normal max-w-xl leading-relaxed">
              Thoughtfully crafted drinks with refreshing flavors, quality ingredients, and a modern approach to everyday refreshment.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="#shop"
                className="inline-flex items-center gap-3 rounded-full bg-[#123C32] hover:bg-[#0c2b24] px-8 py-4 text-sm font-bold text-[#F6F3EA] shadow-md transition hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore Drinks</span>
                <ArrowRight size={17} />
              </Link>
              
              <Link
                href="#story"
                className="inline-flex items-center gap-2 rounded-full border border-[#123C32]/30 px-8 py-4 text-sm font-bold text-[#123C32] hover:bg-[#123C32]/5 transition"
              >
                <span>Discover Our Story</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Premium Botanical Bottle Imagery */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-[440px] aspect-3/4 rounded-3xl overflow-hidden shadow-2xl border border-[#123C32]/10 bg-gradient-to-b from-[#A8B89A]/30 to-[#123C32]/10 group">
              <Image
                src={IMAGES.heroProduct}
                alt="Jade Crafted Beverage"
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                unoptimized
              />
              {/* Subtle Botanical Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#F6F3EA]/90 backdrop-blur-md p-4 rounded-2xl border border-[#123C32]/10 flex items-center justify-between shadow-lg">
                <div>
                  <span className="text-xs font-bold text-[#123C32] block">Organic Botanical Blend</span>
                  <span className="text-[11px] text-[#17201C]/70">Zero Preservatives • 100% Natural</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-[#D7E85A] text-[#123C32] flex items-center justify-center font-bold text-xs shrink-0">
                  🌱
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ================================================== */}
      {/* 3. BENEFITS STRIP */}
      {/* ================================================== */}
      <section className="border-y border-[#123C32]/10 bg-[#F6F3EA] py-10">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="h-11 w-11 rounded-2xl bg-[#123C32]/10 text-[#123C32] flex items-center justify-center shrink-0">
              <Leaf size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#123C32]">Natural Ingredients</h4>
              <p className="text-xs text-[#17201C]/70">Pure organic botanicals</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="h-11 w-11 rounded-2xl bg-[#123C32]/10 text-[#123C32] flex items-center justify-center shrink-0">
              <Droplet size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#123C32]">Low Sugar</h4>
              <p className="text-xs text-[#17201C]/70">Naturally sweetened</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="h-11 w-11 rounded-2xl bg-[#123C32]/10 text-[#123C32] flex items-center justify-center shrink-0">
              <Shield size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#123C32]">No Artificial Colors</h4>
              <p className="text-xs text-[#17201C]/70">Clean &amp; honest recipes</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="h-11 w-11 rounded-2xl bg-[#123C32]/10 text-[#123C32] flex items-center justify-center shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#123C32]">Made With Care</h4>
              <p className="text-xs text-[#17201C]/70">Thoughtfully produced</p>
            </div>
          </div>

        </div>
      </section>


      {/* ================================================== */}
      {/* 4. FEATURED DRINKS (Editorial Product Showcase) */}
      {/* ================================================== */}
      <section id="shop" className="py-24 lg:py-32 bg-[#F6F3EA]">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#123C32]/70 uppercase block mb-1">
                OUR COLLECTION
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#123C32]">
                Meet your new favorites
              </h2>
            </div>
            <Link
              href="#shop"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#123C32] hover:opacity-80 transition group"
            >
              <span>Explore All Drinks</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Product Showcase Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(dbProducts.length > 0 ? dbProducts.slice(0, 4) : FEATURED_PRODUCTS).map((item: any, idx) => (
              <div
                key={item.id || idx}
                className="group rounded-3xl bg-white p-6 border border-[#123C32]/10 shadow-sm flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#123C32]/20"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative aspect-3/4 rounded-2xl overflow-hidden mb-6 bg-[#F6F3EA]">
                    <Image
                      src={item.image || item.imageUrl || IMAGES.drinkJadeMatcha}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </div>

                  {/* Drink Info */}
                  <h3 className="text-xl font-bold text-[#123C32] group-hover:text-[#123C32] transition">
                    {item.name}
                  </h3>
                  
                  <p className="text-xs text-[#17201C]/70 mt-2 font-medium leading-relaxed">
                    {item.flavor || item.size || 'Organic Refreshment'}
                  </p>

                  {/* Ingredient Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {(item.tags || ['Organic', 'Clean Taste']).map((tag: string, tIdx: number) => (
                      <span
                        key={tIdx}
                        className="rounded-full bg-[#123C32]/5 px-2.5 py-1 text-[10px] font-semibold text-[#123C32]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & Shop CTA */}
                <div className="mt-8 pt-4 border-t border-[#123C32]/10 flex items-center justify-between">
                  <span className="text-lg font-bold text-[#123C32]">
                    {item.price ? (typeof item.price === 'number' ? `Rs. ${item.price}` : item.price) : 'Rs. 420'}
                  </span>

                  <button
                    onClick={() => handleAddToCart(item.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
                      addedItems[item.id]
                        ? 'bg-[#123C32] text-[#D7E85A]'
                        : 'bg-[#123C32] text-[#F6F3EA] hover:bg-[#0c2b24] shadow-sm'
                    }`}
                  >
                    {addedItems[item.id] ? (
                      <>
                        <Check size={14} /> Added
                      </>
                    ) : (
                      <>
                        <Plus size={14} /> Shop Now
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
      {/* 5. BRAND STORY (Asymmetric Two-Column) */}
      {/* ================================================== */}
      <section id="story" className="py-24 lg:py-32 bg-[#F6F3EA] border-t border-[#123C32]/10">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left: Lifestyle Photograph */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-4/3 sm:aspect-square rounded-3xl overflow-hidden shadow-2xl border border-[#123C32]/10">
              <Image
                src={IMAGES.storyCraft}
                alt="Crafting Jade Beverages"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          {/* Right: Brand Story Copy */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="text-xs font-bold tracking-widest text-[#123C32]/70 uppercase block">
              THE JADE APPROACH
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#123C32] leading-tight">
              Simple ingredients. Thoughtful craft. Better moments.
            </h2>

            <p className="text-[#17201C]/80 text-base sm:text-lg leading-relaxed font-normal">
              We believe everyday drinks should nourish your spirit without sacrificing flavor. Jade Drinks was born out of a desire to create clean, botanical-infused beverages that elevate your daily routine into a mindful ritual.
            </p>

            <div className="pt-2">
              <Link
                href="#ingredients"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#123C32] hover:opacity-80 transition group border-b border-[#123C32]/30 pb-1"
              >
                <span>Learn Our Story</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </section>


      {/* ================================================== */}
      {/* 6. INGREDIENTS SECTION (Dark Jade Green) */}
      {/* ================================================== */}
      <section id="ingredients" className="py-24 lg:py-32 bg-[#123C32] text-[#F6F3EA] relative overflow-hidden">
        {/* Soft Background Accent */}
        <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-[#A8B89A]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="mx-auto max-w-[1280px] px-6 sm:px-10 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold tracking-widest text-[#D7E85A] uppercase block">
              PURE &amp; PURPOSEFUL
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              What&apos;s inside matters.
            </h2>
            <p className="text-[#F6F3EA]/70 text-sm sm:text-base">
              Every botanical, fruit press, and leaf is selected for its clean taste and natural benefits.
            </p>
          </div>

          {/* 4 Interactive Botanical Ingredient Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm text-left hover:bg-white/10 transition">
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-6">
                <Image
                  src={IMAGES.ingMatcha}
                  alt="Green Tea & Matcha"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <h3 className="text-xl font-bold text-white">Green Tea &amp; Matcha</h3>
              <p className="text-xs text-[#F6F3EA]/70 mt-2 leading-relaxed">
                Ceremonial grade green tea packed with L-theanine for sustained, jitters-free energy.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm text-left hover:bg-white/10 transition">
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-6">
                <Image
                  src={IMAGES.ingGinger}
                  alt="Fresh Ginger Root"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <h3 className="text-xl font-bold text-white">Fresh Ginger</h3>
              <p className="text-xs text-[#F6F3EA]/70 mt-2 leading-relaxed">
                Real pressed ginger root bringing a refreshing spice and digestive wellness support.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm text-left hover:bg-white/10 transition">
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-6">
                <Image
                  src={IMAGES.ingCitrus}
                  alt="Meyer Lemon & Yuzu"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <h3 className="text-xl font-bold text-white">Citrus &amp; Yuzu</h3>
              <p className="text-xs text-[#F6F3EA]/70 mt-2 leading-relaxed">
                Sun-ripened citrus fruit pressed for vibrant vitamin C and natural brightness.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm text-left hover:bg-white/10 transition">
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-6">
                <Image
                  src={IMAGES.ingBotanicals}
                  alt="Botanical Extracts"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <h3 className="text-xl font-bold text-white">Botanical Extracts</h3>
              <p className="text-xs text-[#F6F3EA]/70 mt-2 leading-relaxed">
                Infusions of rose petal, lemon balm, and adaptogens for soothing harmony.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ================================================== */}
      {/* 7. LIFESTYLE SECTION (Cinematic Parallax Overlay) */}
      {/* ================================================== */}
      <section className="relative min-h-[500px] lg:min-h-[600px] flex items-center justify-center overflow-hidden">
        <Image
          src={IMAGES.lifestyleBanner}
          alt="Enjoying Jade Drinks"
          fill
          className="object-cover object-center filter brightness-75"
          unoptimized
        />
        
        <div className="relative z-10 max-w-2xl mx-auto text-center px-6 py-16 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-lg">
            Made for slow mornings. <br />
            Busy afternoons. <br />
            Everything in between.
          </h2>

          <div className="pt-2">
            <Link
              href="#shop"
              className="inline-flex items-center gap-3 rounded-full bg-[#F6F3EA] hover:bg-white px-8 py-4 text-xs sm:text-sm font-bold text-[#123C32] shadow-2xl transition hover:scale-105"
            >
              <span>Find Your Flavor</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>


      {/* ================================================== */}
      {/* 8. SOCIAL PROOF (Refined Testimonials) */}
      {/* ================================================== */}
      <section className="py-24 lg:py-32 bg-[#F6F3EA]">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-[#123C32]/70 uppercase block mb-1">
              COMMUNITY
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#123C32]">
              Loved by people who care about what they drink.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Testimonial 1 */}
            <div className="bg-white rounded-3xl p-8 border border-[#123C32]/10 shadow-sm flex flex-col justify-between space-y-6 text-left">
              <p className="text-[#17201C]/80 text-sm sm:text-base leading-relaxed font-normal">
                &ldquo;Finally a drink that tastes fresh without being loaded with sugar. The Sparkling Matcha is my daily ritual.&rdquo;
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-[#123C32]/10">
                <div className="relative h-11 w-11 rounded-full overflow-hidden border border-[#123C32]/20">
                  <Image src={IMAGES.avatar1} alt="Elena Rostova" fill className="object-cover" unoptimized />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#123C32]">Elena Rostova</h4>
                  <p className="text-xs text-[#17201C]/60 font-medium">Verified Customer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-3xl p-8 border border-[#123C32]/10 shadow-sm flex flex-col justify-between space-y-6 text-left">
              <p className="text-[#17201C]/80 text-sm sm:text-base leading-relaxed font-normal">
                &ldquo;Clean ingredients, amazing natural botanical flavor, and gorgeous packaging. Highly recommended.&rdquo;
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-[#123C32]/10">
                <div className="relative h-11 w-11 rounded-full overflow-hidden border border-[#123C32]/20">
                  <Image src={IMAGES.avatar2} alt="Marcus Vance" fill className="object-cover" unoptimized />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#123C32]">Marcus Vance</h4>
                  <p className="text-xs text-[#17201C]/60 font-medium">Verified Customer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-3xl p-8 border border-[#123C32]/10 shadow-sm flex flex-col justify-between space-y-6 text-left">
              <p className="text-[#17201C]/80 text-sm sm:text-base leading-relaxed font-normal">
                &ldquo;The Citrus Ginger Elixir has replaced my afternoon coffee. Refreshing and makes me feel great.&rdquo;
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-[#123C32]/10">
                <div className="relative h-11 w-11 rounded-full overflow-hidden border border-[#123C32]/20">
                  <Image src={IMAGES.avatar3} alt="Sarah Jenkins" fill className="object-cover" unoptimized />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#123C32]">Sarah Jenkins</h4>
                  <p className="text-xs text-[#17201C]/60 font-medium">Verified Customer</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ================================================== */}
      {/* 9. FINAL CTA SECTION (Dark Jade Green) */}
      {/* ================================================== */}
      <section className="py-24 bg-[#123C32] text-[#F6F3EA] text-center relative overflow-hidden">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-10 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to find your favorite?
          </h2>
          
          <p className="text-[#F6F3EA]/80 text-sm sm:text-lg max-w-lg mx-auto font-normal">
            Explore the collection and discover your next everyday drink.
          </p>

          <div className="pt-4">
            <Link
              href="#shop"
              className="inline-flex items-center justify-center rounded-full bg-[#D7E85A] hover:bg-[#c9dc4b] px-9 py-4 text-sm font-bold text-[#123C32] shadow-xl transition hover:scale-105"
            >
              Shop All Drinks
            </Link>
          </div>
        </div>
      </section>


      {/* ================================================== */}
      {/* 10. MINIMAL FOOTER */}
      {/* ================================================== */}
      <footer id="contact" className="bg-[#17201C] text-[#F6F3EA] pt-16 pb-12">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#D7E85A] text-[#123C32] flex items-center justify-center font-bold text-base">
                J
              </div>
              <span className="text-xl font-bold text-white">Jade Drinks</span>
            </Link>
            <p className="text-[#F6F3EA]/70 text-xs sm:text-sm max-w-sm leading-relaxed">
              Crafted for your everyday ritual. Refreshing botanical drinks made with clean, organic ingredients.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-[#D7E85A] uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-xs font-semibold text-[#F6F3EA]/70">
              <li><Link href="#shop" className="hover:text-white transition">Shop</Link></li>
              <li><Link href="#story" className="hover:text-white transition">Our Story</Link></li>
              <li><Link href="#ingredients" className="hover:text-white transition">Ingredients</Link></li>
              <li><Link href="#journal" className="hover:text-white transition">Journal</Link></li>
              <li><Link href="#contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Legal / Social */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-[#D7E85A] uppercase tracking-wider">Social</h4>
            <ul className="space-y-2 text-xs font-semibold text-[#F6F3EA]/70">
              <li><a href="#" className="hover:text-white transition flex items-center gap-1.5"><Instagram size={14} /> Instagram</a></li>
              <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition">Terms &amp; Conditions</Link></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-[#D7E85A] uppercase tracking-wider">Newsletter</h4>
            <p className="text-xs text-[#F6F3EA]/70">Get occasional notes from Jade.</p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative flex items-center rounded-full bg-white/10 border border-white/20 p-1">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-[#F6F3EA]/50 outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-[#D7E85A] text-[#123C32] text-xs font-bold shrink-0 hover:bg-[#c9dc4b] transition"
                >
                  Subscribe
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-[#D7E85A] font-semibold">
                  Thank you for subscribing!
                </p>
              )}
            </form>
          </div>

        </div>

        <div className="mx-auto max-w-[1280px] px-6 sm:px-10 mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F6F3EA]/50 font-medium gap-4">
          <p>© 2026 Jade Drinks. All rights reserved.</p>
          <p>Thoughtfully Crafted Everyday Beverages</p>
        </div>
      </footer>

    </div>
  );
}