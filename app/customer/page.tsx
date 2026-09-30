'use client';

import { useEffect, useState } from 'react';
import {
  Beer,
  CheckCircle2,
  ChevronRight,
  CupSoda,
  Droplets,
  Flame,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  Wine,
  Zap,
} from 'lucide-react';
import {
  CartItem,
  DeliveryAddress,
  Order,
  OrderItem,
  Product,
  ProductCategory,
  addCustomerAddress,
  addToCustomerCart,
  clearCustomerCart,
  getCatalogProducts,
  getCustomerAddresses,
  getCustomerCart,
  getCustomerOrders,
  getSelectedDeliveryAddress,
  saveCustomerAddresses,
  setSelectedDeliveryAddress,
  updateCartItemQuantity,
} from '@/lib/catalog-store';
import { CustomerNav } from '@/components/customer/CustomerNav';
import { ProductCard } from '@/components/customer/ProductCard';
import { ProductDetailModal } from '@/components/customer/ProductDetailModal';
import { CartDrawer } from '@/components/customer/CartDrawer';
import { CheckoutModal } from '@/components/customer/CheckoutModal';
import { OrderTrackerModal } from '@/components/customer/OrderTrackerModal';
import { OrdersView } from '@/components/customer/OrdersView';
import { AddressesView } from '@/components/customer/AddressesView';
import { CustomerSupportView } from '@/components/customer/CustomerSupportView';
import { CustomerProfileView } from '@/components/customer/CustomerProfileView';
import { MobileBottomNav } from '@/components/customer/MobileBottomNav';

type Tab = 'shop' | 'orders' | 'addresses' | 'support' | 'profile';

const CATEGORIES: { label: ProductCategory; icon: React.ElementType }[] = [
  { label: 'All', icon: Sparkles },
  { label: 'Beer & Craft', icon: Beer },
  { label: 'Whiskey & Spirits', icon: Wine },
  { label: 'Wine', icon: Wine },
  { label: 'Soft Drinks & Soda', icon: CupSoda },
  { label: 'Energy & Juice', icon: Zap },
  { label: 'Water & Mixers', icon: Droplets },
];

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('shop');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [selectedAddress, setSelectedAddr] = useState<DeliveryAddress>({
    id: 'default',
    label: 'Home',
    zone: 'Traffic Chowk & Central Butwal',
    addressLine: 'Ward 6, Butwal',
    phone: '+977 9801234567',
    isDefault: true,
  });
  const [orders, setOrders] = useState<Order[]>([]);

  // Search, category & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [chilledOnly, setChilledOnly] = useState(false);
  const [nonAlcoholicOnly, setNonAlcoholicOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Modals & drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [orderNotes, setOrderNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load and subscribe to storage
  useEffect(() => {
    function loadData() {
      setProducts(getCatalogProducts());
      setCart(getCustomerCart());
      setAddresses(getCustomerAddresses());
      setSelectedAddr(getSelectedDeliveryAddress());
      setOrders(getCustomerOrders());
    }

    loadData();
    window.addEventListener('drinkdrop_storage_update', loadData);
    return () => window.removeEventListener('drinkdrop_storage_update', loadData);
  }, []);

  function triggerToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  // Cart operations
  function handleAddToCart(product: Product, quantity = 1) {
    const updated = addToCustomerCart(product, quantity);
    setCart(updated);
    triggerToast(`Added ${quantity}x ${product.name} to cart`);
  }

  function handleUpdateQuantity(productId: string, quantity: number) {
    const updated = updateCartItemQuantity(productId, quantity);
    setCart(updated);
  }

  function handleClearCart() {
    clearCustomerCart();
    setCart([]);
  }

  // Address operations
  function handleSelectAddress(addr: DeliveryAddress) {
    setSelectedAddr(addr);
    setSelectedDeliveryAddress(addr.id);
  }

  function handleAddNewAddress(addr: Omit<DeliveryAddress, 'id'>) {
    const created = addCustomerAddress(addr);
    setAddresses(getCustomerAddresses());
    handleSelectAddress(created);
    triggerToast(`Added delivery location: ${created.label}`);
    return created;
  }

  function handleDeleteAddress(id: string) {
    const remaining = addresses.filter(a => a.id !== id);
    saveCustomerAddresses(remaining);
    setAddresses(remaining);
    if (selectedAddress.id === id && remaining.length > 0) {
      handleSelectAddress(remaining[0]);
    }
  }

  function handleSetDefaultAddress(id: string) {
    const updated = addresses.map(a => ({ ...a, isDefault: a.id === id }));
    saveCustomerAddresses(updated);
    setAddresses(updated);
  }

  // Reorder operation
  function handleReorder(items: OrderItem[]) {
    items.forEach(item => {
      const match = products.find(p => p.id === item.productId);
      if (match) addToCustomerCart(match, item.quantity);
    });
    setCart(getCustomerCart());
    setIsCartOpen(true);
    triggerToast('Items added back to your cart');
  }

  // Order placement callback
  function handleOrderSuccess(newOrder: Order) {
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setOrders(getCustomerOrders());
    setCart([]);
    setTrackingOrder(newOrder);
    triggerToast(`Order #${newOrder.orderNumber} placed successfully!`);
  }

  // Filtered & sorted products
  const filteredProducts = products.filter(p => {
    if (!p.active) return false;
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (chilledOnly && !p.chilled) return false;
    if (nonAlcoholicOnly && p.alcoholic) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (
        !p.name.toLowerCase().includes(q) &&
        !p.brand.toLowerCase().includes(q) &&
        !p.category.toLowerCase().includes(q) &&
        !p.description.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const activeOrdersCount = orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status)).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      {/* Toast Notification — raised above bottom nav on mobile */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-slate-900/90 px-4 py-2.5 text-xs font-bold text-white shadow-xl backdrop-blur-md transition-all md:bottom-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <CustomerNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedAddress={selectedAddress}
        onOpenAddressSelector={() => setActiveTab('addresses')}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        activeOrdersCount={activeOrdersCount}
      />

      {/* Main Body — bottom padding ensures content clears the mobile bottom nav */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-24 sm:px-6 md:pb-8">
        {/* SHOP TAB */}
        {activeTab === 'shop' && (
          <div className="space-y-6">
            {/* Hero Promo Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#18352c] to-[#1d4b3e] p-6 text-white shadow-md sm:p-8">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[#f6e8c3] backdrop-blur-md mb-3">
                  <Flame size={13} className="text-[#dda94e]" />
                  <span>Butwal&apos;s Fast Drinks Delivery</span>
                </div>
                <h1 className="text-2xl font-black tracking-tight sm:text-4xl text-[#eee9d9]">
                  Chilled Drinks, <span className="text-[#dda94e]">Fast to Your Door.</span>
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
                  Order craft beers, Nepali spirits, imported whiskies, sodas, and juices directly from verified Butwal dealers. Ice-cold delivery in 30-45 minutes.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <Truck size={16} className="text-[#dda94e]" /> Free delivery above Rs. 1,000
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <ShieldCheck size={16} className="text-[#dda94e]" /> 18+ Responsible Retail
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <Droplets size={16} className="text-cyan-400" /> Guaranteed Cold Pours
                  </div>
                </div>
              </div>

              <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
              <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center justify-center rounded-2xl bg-white/10 p-5 backdrop-blur-md border border-white/10 text-center">
                <span className="text-xs uppercase font-extrabold text-[#dda94e] tracking-widest">Base Delivery</span>
                <span className="text-3xl font-black text-white mt-1">Rs. 50</span>
                <span className="text-[11px] text-slate-300 mt-0.5">Free over Rs. 1,000</span>
              </div>
            </div>

            {/* Category Selector Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {CATEGORIES.map(({ label, icon: Icon }) => {
                const isSelected = selectedCategory === label;
                const count = label === 'All'
                  ? products.filter(p => p.active).length
                  : products.filter(p => p.active && p.category === label).length;

                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setSelectedCategory(label)}
                    className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition shadow-2xs ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/20'
                        : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={15} />
                    <span>{label}</span>
                    <span
                      className={`rounded-full px-1.5 text-[10px] ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Secondary Filter & Sort Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-xs shadow-2xs">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setChilledOnly(!chilledOnly)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold transition ${
                    chilledOnly ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Droplets size={13} /> Chilled Drinks
                </button>
                <button
                  type="button"
                  onClick={() => setNonAlcoholicOnly(!nonAlcoholicOnly)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold transition ${
                    nonAlcoholicOnly ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <CupSoda size={13} /> Non-Alcoholic Only
                </button>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-slate-400 font-medium hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc')}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none"
                >
                  <option value="featured">Featured / Popular</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {sortedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                  <Search size={28} />
                </div>
                <h3 className="text-base font-bold text-slate-800">No drinks found</h3>
                <p className="mt-1 text-xs text-slate-500 max-w-sm">
                  We couldn&apos;t find any drinks matching &ldquo;{searchQuery || selectedCategory}&rdquo;. Try clearing your filters or search terms.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setChilledOnly(false);
                    setNonAlcoholicOnly(false);
                  }}
                  className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                {sortedProducts.map(product => {
                  const inCart = cart.find(c => c.product.id === product.id)?.quantity || 0;
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      quantityInCart={inCart}
                      onAddToCart={handleAddToCart}
                      onUpdateQuantity={handleUpdateQuantity}
                      onOpenDetails={setDetailProduct}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <OrdersView
            orders={orders}
            onTrackOrder={order => setTrackingOrder(order)}
            onReorder={handleReorder}
            onStartShopping={() => setActiveTab('shop')}
          />
        )}

        {/* ADDRESSES TAB */}
        {activeTab === 'addresses' && (
          <AddressesView
            addresses={addresses}
            selectedAddress={selectedAddress}
            onSelectAddress={handleSelectAddress}
            onAddNewAddress={handleAddNewAddress}
            onDeleteAddress={handleDeleteAddress}
            onSetDefault={handleSetDefaultAddress}
          />
        )}

        {/* SUPPORT TAB */}
        {activeTab === 'support' && <CustomerSupportView />}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && <CustomerProfileView />}
      </main>

      {/* Mobile floating cart bar — positioned above the bottom nav (bottom-[84px]) */}
      {cartCount > 0 && activeTab === 'shop' && (
        <div className="fixed bottom-[84px] left-4 right-4 z-40 md:hidden">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex w-full items-center justify-between rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-xl hover:bg-blue-700 active:scale-[0.99] transition"
          >
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-black text-blue-600">
                {cartCount}
              </span>
              <span>View Drinks Cart</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Rs. {cartTotal.toLocaleString('en-NP')}</span>
              <ChevronRight size={18} />
            </div>
          </button>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        activeOrdersCount={activeOrdersCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Modals & Slide-overs */}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onAddToCart={handleAddToCart}
        currentCartQuantity={
          detailProduct ? cart.find(c => c.product.id === detailProduct.id)?.quantity || 0 : 0
        }
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        orderNotes={orderNotes}
        setOrderNotes={setOrderNotes}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        savedAddresses={addresses}
        selectedAddress={selectedAddress}
        onSelectAddress={handleSelectAddress}
        onAddNewAddress={handleAddNewAddress}
        orderNotes={orderNotes}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderTrackerModal
        order={trackingOrder}
        onClose={() => setTrackingOrder(null)}
        onOrderUpdated={() => {
          setOrders(getCustomerOrders());
          if (trackingOrder) {
            const current = getCustomerOrders().find(o => o.id === trackingOrder.id);
            if (current) setTrackingOrder(current);
          }
        }}
      />
    </div>
  );
}
