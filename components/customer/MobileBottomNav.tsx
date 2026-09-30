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
      className="fixed bottom-0 left-0 right-0 z-40 flex items-end border-t border-slate-200 bg-white/95 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.08)] md:hidden"
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
            className={`relative flex flex-1 flex-col items-center justify-center gap-1 pb-safe pt-2.5 pb-3 text-center transition-colors active:bg-slate-100 ${
              isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {/* Cart pill / highlight */}
            {tab.isCart ? (
              <div
                className={`relative grid h-11 w-11 place-items-center rounded-2xl shadow-md transition ${
                  cartCount > 0
                    ? 'bg-blue-600 text-white shadow-blue-300'
                    : 'bg-slate-900 text-white'
                }`}
              >
                <tab.icon size={21} strokeWidth={2} />
                {cartCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-amber-400 text-[10px] font-black text-slate-900 ring-2 ring-white">
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
                  <span className="absolute -right-2.5 -top-1.5 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[9px] font-black text-white ring-1 ring-white">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>
            )}

            {/* Label */}
            <span
              className={`text-[10px] font-semibold leading-none ${
                tab.isCart ? 'mt-1.5' : ''
              } ${isActive ? 'text-blue-600' : ''}`}
            >
              {tab.label}
            </span>

            {/* Active indicator dot */}
            {isActive && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-blue-600" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
