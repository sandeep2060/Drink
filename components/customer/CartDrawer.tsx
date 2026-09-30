'use client';

import Image from 'next/image';
import {
  ArrowRight,
  Beer,
  CupSoda,
  Flame,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  Wine,
  X,
} from 'lucide-react';
import { CartItem } from '@/lib/catalog-store';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onClearCart,
  onProceedToCheckout,
  orderNotes,
  setOrderNotes,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeDeliveryThreshold = 1000;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : items.length > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;
  const amountNeededForFree = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="relative w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <ShoppingBag size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Your Drinks Cart</h3>
                <p className="text-xs text-slate-500">
                  {items.length === 0
                    ? 'Cart is empty'
                    : `${items.reduce((acc, i) => acc + i.quantity, 0)} items selected`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={onClearCart}
                  className="rounded-lg p-1.5 text-xs text-slate-400 hover:bg-slate-100 hover:text-red-600 transition"
                  title="Clear Cart"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Free Delivery Meter */}
          {items.length > 0 && (
            <div className="border-b border-slate-100 bg-amber-50/60 p-4">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-amber-900">
                  <Truck size={15} className="text-amber-600" />
                  {isFreeDelivery ? (
                    <span className="text-emerald-700 font-bold">🎉 You unlocked FREE Butwal delivery!</span>
                  ) : (
                    <span>
                      Add <strong>Rs. {amountNeededForFree.toLocaleString('en-NP')}</strong> more for FREE delivery
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-amber-700">Rs. 1,000 min</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-amber-100">
                <div
                  className={`h-full transition-all duration-300 ${
                    isFreeDelivery ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-12">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-500 mb-3">
                  <Beer size={32} strokeWidth={1.5} />
                </div>
                <h4 className="font-bold text-slate-800">Your cart is empty</h4>
                <p className="mt-1 max-w-xs text-xs text-slate-500">
                  Explore cold beers, fine whiskies, chilled sodas, and juices from local Butwal stores.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                >
                  Start Exploring Drinks
                </button>
              </div>
            ) : (
              items.map(item => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-2xs"
                >
                  {/* Thumbnail */}
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-slate-50 p-1">
                    {item.product.imageUrl ? (
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-contain"
                        sizes="64px"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        {item.product.category === 'Beer & Craft' ? (
                          <Beer size={24} />
                        ) : (
                          <CupSoda size={24} />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h5 className="truncate text-sm font-bold text-slate-800" title={item.product.name}>
                      {item.product.name}
                    </h5>
                    <div className="text-[11px] text-slate-500">
                      {item.product.brand} · {item.product.size}
                    </div>
                    <div className="mt-1 font-bold text-xs text-slate-900">
                      Rs. {item.product.price.toLocaleString('en-NP')}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="grid h-6 w-6 place-items-center rounded-lg bg-white text-slate-700 hover:bg-slate-200 transition"
                      aria-label="Decrease"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-4 text-center text-xs font-black">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="grid h-6 w-6 place-items-center rounded-lg bg-white text-slate-700 hover:bg-slate-200 transition"
                      aria-label="Increase"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Special Instructions Note */}
            {items.length > 0 && (
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery instructions (optional)
                </label>
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={e => setOrderNotes(e.target.value)}
                  placeholder="e.g., Leave at the door, keep beers extra chilled, call upon arrival..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white resize-none"
                />
              </div>
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString('en-NP')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span className="flex items-center gap-1">
                    Delivery fee
                    {isFreeDelivery && (
                      <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
                        FREE
                      </span>
                    )}
                  </span>
                  <span>{isFreeDelivery ? 'Rs. 0' : `Rs. ${deliveryFee}`}</span>
                </div>
                <div className="border-t border-slate-200/80 pt-2 flex justify-between text-base font-extrabold text-slate-900">
                  <span>Total Amount</span>
                  <span>Rs. {total.toLocaleString('en-NP')}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onProceedToCheckout}
                className="flex w-full items-center justify-between rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-[0.99] transition"
              >
                <span>Proceed to Checkout</span>
                <span className="flex items-center gap-1">
                  Rs. {total.toLocaleString('en-NP')} <ArrowRight size={16} />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
