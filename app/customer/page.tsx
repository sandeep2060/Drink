'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
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
  const [branchMode, setBranchMode] = useState<'LIQUOR' | 'GROCERY'>('LIQUOR');
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

  // Filtered & sorted products (By Branch Mode: LIQUOR vs GROCERY - cheers.com.np reference)
  const filteredProducts = products.filter(p => {
    if (!p.active) return false;

    // Branch filtering logic
    const isGroceryItem = !p.alcoholic || p.category.includes('Snacks') || p.category.includes('Pantry') || p.category.includes('Bakery');
    if (branchMode === 'GROCERY' && !isGroceryItem && p.alcoholic) return false;
    if (branchMode === 'LIQUOR' && isGroceryItem && !p.alcoholic) return false;

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
        branchMode={branchMode}
        setBranchMode={setBranchMode}
      />

      {/* Main Body — bottom padding ensures content clears the mobile bottom nav */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-24 sm:px-6 md:pb-8">
        {/* SHOP TAB (MATCHING REFERENCE IMAGE SIDEBAR & PRODUCT GRID LAYOUT) */}
        {activeTab === 'shop' && (
          <div className="flex flex-col lg:flex-row items-start gap-8">
            
            {/* LEFT SIDEBAR: FILTERS / FOOD CATEGORIES (MATCHING REFERENCE SCREENSHOT) */}
            <aside className="w-full lg:w-72 shrink-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-black tracking-wider text-slate-900 uppercase border-b border-slate-100 pb-3 mb-4">
                FILTERS
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                    FOODS CATEGORIES
                  </h3>

                  <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {['All', 'Beer & Craft', 'Whiskey & Spirits', 'Wine', 'Soft Drinks & Soda', 'Energy & Juice', 'Water & Mixers', 'PIZZA', 'BURGER', 'MOMO', 'CHOWMEIN', 'MANDOO WINGS', 'DESSERT'].map(cat => {
                      const isSelected = selectedCategory === cat || (cat === 'All' && selectedCategory === 'All');
                      return (
                        <label
                          key={cat}
                          onClick={() => setSelectedCategory(cat as any)}
                          className="flex items-center gap-3 text-xs font-bold text-slate-700 hover:text-[#ff5b00] cursor-pointer transition select-none group"
                        >
                          <div
                            className={`h-4 w-4 rounded border flex items-center justify-center transition ${
                              isSelected
                                ? 'bg-[#ff5b00] border-[#ff5b00] text-white'
                                : 'border-slate-300 bg-white group-hover:border-[#ff5b00]'
                            }`}
                          >
                            {isSelected && <CheckCircle2 size={12} strokeWidth={3} />}
                          </div>
                          <span className={`uppercase font-extrabold ${isSelected ? 'text-[#ff5b00]' : 'text-slate-700'}`}>
                            {cat}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Quick Filter Controls */}
                <div className="pt-4 border-t border-slate-100 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => setChilledOnly(!chilledOnly)}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition border ${
                      chilledOnly
                        ? 'bg-cyan-50 border-cyan-300 text-cyan-800'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Droplets size={14} className="text-cyan-600" /> Chilled Drinks
                    </span>
                    <span className="text-[10px] font-black">{chilledOnly ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNonAlcoholicOnly(!nonAlcoholicOnly)}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition border ${
                      nonAlcoholicOnly
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <CupSoda size={14} className="text-emerald-600" /> Non-Alcoholic Only
                    </span>
                    <span className="text-[10px] font-black">{nonAlcoholicOnly ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>
            </aside>


            {/* RIGHT CONTENT AREA: PRODUCT CATALOG SHOWCASE */}
            <div className="flex-1 w-full space-y-6">
              
              {/* Header Strip with Title, Item Count & Sort Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
                    {selectedCategory === 'All' ? 'ALL PRODUCTS' : selectedCategory}
                  </h1>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {sortedProducts.length} items found for &ldquo;{selectedCategory}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-400 uppercase">Sort By</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc')}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 outline-none shadow-2xs focus:border-[#ff5b00]"
                  >
                    <option value="featured">Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Products Grid (Matching Reference Screenshot Layout) */}
              {sortedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                    <Search size={28} />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">No products found</h3>
                  <p className="mt-1 text-xs text-slate-500 max-w-sm">
                    We couldn&apos;t find any items matching &ldquo;{searchQuery || selectedCategory}&rdquo;.
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedProducts.map((prod, idx) => {
                    const inCart = cart.find(c => c.product.id === prod.id)?.quantity || 0;
                    return (
                      <div
                        key={prod.id || idx}
                        className="group bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                      >
                        <div>
                          {/* Image Box */}
                          <div
                            onClick={() => setDetailProduct(prod)}
                            className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 mb-4 cursor-pointer"
                          >
                            <Image
                              src={prod.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop'}
                              alt={prod.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              unoptimized
                            />
                          </div>

                          {/* Ratings */}
                          <div className="flex items-center gap-1 text-amber-500 text-xs mb-1.5">
                            {[...Array(4)].map((_, i) => (
                              <span key={i}>★</span>
                            ))}
                            <span className="text-slate-300">★</span>
                          </div>

                          {/* Product Title */}
                          <h3
                            onClick={() => setDetailProduct(prod)}
                            className="text-base font-extrabold text-slate-900 line-clamp-1 cursor-pointer hover:text-[#ff5b00] transition"
                          >
                            {prod.name}
                          </h3>

                          {/* Best Seller Badge */}
                          <div className="mt-2 mb-2">
                            <span className="inline-block bg-[#ff5b00] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-2xs">
                              BEST SELLER
                            </span>
                          </div>

                          {/* Price */}
                          <div className="text-sm font-black text-slate-900 mt-1">
                            Rs. {Number(prod.price).toFixed(2)}
                          </div>
                        </div>

                        {/* Add to Cart Button (Matching Reference Screenshot Black Pill/Full Button) */}
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => handleAddToCart(prod)}
                            className="w-full rounded-xl bg-black hover:bg-slate-900 text-white text-xs font-black uppercase tracking-wider py-3.5 transition shadow-md hover:scale-[1.02] active:scale-[0.98]"
                          >
                            {inCart > 0 ? `ADD TO CART (${inCart})` : 'ADD TO CART'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
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
