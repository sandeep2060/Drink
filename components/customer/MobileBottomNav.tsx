'use client';

import {
  GlassWater,
  LifeBuoy,
  MapPin,
  Package,
  ShoppingBag,
  User,
} from 'lucide-react';

type Tab = 'shop' | 'orders' | 'addresses' | 'support' | 'profile';

interface MobileBottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  cartCount: number;
  activeOrdersCount: number;
  onOpenCart: () => void;
}

export function MobileBottomNav({
  activeTab,
  setActiveTab,
  cartCount,
  activeOrdersCount,
  onOpenCart,
}: MobileBottomNavProps) {
  const tabs: {
    key: Tab;
    label: string;
    icon: React.ElementType;
    badge?: number;
    isCart?: boolean;
  }[] = [
    { key: 'shop', label: 'Shop', icon: GlassWater },
    { key: 'orders', label: 'Orders', icon: Package, badge: activeOrdersCount },
    { key: 'shop', label: 'Cart', icon: ShoppingBag, badge: cartCount, isCart: true },
    { key: 'addresses', label: 'Locations', icon: MapPin },
    { key: 'profile', label: 'Profile', icon: User },
  ];

  return (
    /* Only visible below md breakpoint */
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-end border-t border-white/10 bg-[#0d0f12]/95 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.4)] md:hidden text-white"
      aria-label="Mobile navigation"
    >
      {tabs.map(tab => {
        const isActive = !tab.isCart && activeTab === tab.key;

        return (
          <button
            key={tab.label}
            type="button"
            onClick={() => {
              if (tab.isCart) {
                onOpenCart();
              } else {
                setActiveTab(tab.key);
              }
            }}
            className={`relative flex flex-1 flex-col items-center justify-center gap-1 pb-safe pt-2.5 pb-3 text-center transition-colors active:bg-white/10 ${
              isActive ? 'text-[#ff5b00]' : 'text-slate-400 hover:text-white'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {/* Cart pill / highlight */}
            {tab.isCart ? (
              <div
                className={`relative grid h-11 w-11 place-items-center rounded-2xl shadow-lg transition ${
                  cartCount > 0
                    ? 'bg-gradient-to-r from-[#ff5b00] to-[#ff3b00] text-white shadow-orange-600/30'
                    : 'bg-white/10 text-white border border-white/10'
                }`}
              >
                <tab.icon size={21} strokeWidth={2} />
                {cartCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-white text-[10px] font-black text-[#ff5b00] ring-2 ring-[#ff5b00]">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
            ) : (
              <div className="relative">
                <tab.icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className="transition-transform duration-150"
                  style={{ transform: isActive ? 'scale(1.08)' : 'scale(1)' }}
                />
                {/* Badge */}
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="absolute -right-2.5 -top-1.5 grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-[9px] font-black text-white ring-1 ring-[#0d0f12]">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>
            )}

            {/* Label */}
            <span
              className={`text-[10px] font-semibold leading-none ${
                tab.isCart ? 'mt-1.5' : ''
              } ${isActive ? 'text-[#ff5b00] font-bold' : ''}`}
            >
              {tab.label}
            </span>

            {/* Active indicator dot */}
            {isActive && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-[#ff5b00]" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
