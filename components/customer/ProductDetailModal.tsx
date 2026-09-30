'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  Beer,
  CheckCircle2,
  Clock3,
  CupSoda,
  Droplets,
  Flame,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Store,
  Wine,
  X,
} from 'lucide-react';
import { Product } from '@/lib/catalog-store';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  currentCartQuantity: number;
}

export function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  currentCartQuantity,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isOutOfStock = product.stockQuantity <= 0 || !product.active;
  const totalPrice = product.price * quantity;

  function handleAdd() {
    if (!product || isOutOfStock) return;
    onAddToCart(product, quantity);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
        >
          <X size={18} />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Visual Column */}
          <div className="relative flex min-h-[260px] flex-col items-center justify-center bg-gradient-to-b from-slate-100 to-slate-50 p-6 md:min-h-[420px]">
            <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
              {product.chilled && (
                <span className="flex items-center gap-1 rounded-full bg-cyan-100 px-2.5 py-0.5 text-xs font-bold text-cyan-800">
                  <Droplets size={12} className="fill-cyan-600 text-cyan-600" /> Served Chilled
                </span>
              )}
              {product.alcoholic ? (
                <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-bold text-white">
                  18+ Verified Adult
                </span>
              ) : (
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  Non-Alcoholic
                </span>
              )}
            </div>

            {product.imageUrl ? (
              <div className="relative h-60 w-60">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="260px"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-300">
                {product.category === 'Beer & Craft' ? (
                  <Beer size={80} strokeWidth={1.2} />
                ) : product.category === 'Whiskey & Spirits' || product.category === 'Wine' ? (
                  <Wine size={80} strokeWidth={1.2} />
                ) : (
                  <CupSoda size={80} strokeWidth={1.2} />
                )}
                <span className="mt-2 text-xs font-semibold text-slate-400">{product.brand}</span>
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <Clock3 size={14} className="text-blue-600" />
              <span>Express delivery across Butwal in 30-45 mins</span>
            </div>
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-between p-6 sm:p-7">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-blue-600 uppercase tracking-wider">{product.brand}</span>
                <span className="rounded-lg bg-slate-100 px-2 py-0.5 font-medium">{product.size}</span>
              </div>

              <h2 className="mt-1.5 text-xl font-black text-slate-900 sm:text-2xl">{product.name}</h2>

              {/* ABV & Category Pills */}
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {product.category}
                </span>
                {product.abv && (
                  <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900">
                    {product.abv}% Alc/Vol
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                  <CheckCircle2 size={13} /> In Stock ({product.stockQuantity} available)
                </span>
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">About this drink</h4>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Dealer Depot Information */}
              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Store size={15} className="text-blue-600" /> Fulfilled by Local Dealer
                </div>
                <p className="mt-1 text-slate-500">{product.dealerName || 'Butwal Central Liquors (Traffic Chowk)'}</p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Price</span>
                  <div className="text-2xl font-black text-slate-900">
                    Rs. {totalPrice.toLocaleString('en-NP')}
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-1.5">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="grid h-8 w-8 place-items-center rounded-xl bg-white text-slate-700 shadow-xs transition hover:bg-slate-100"
                    disabled={quantity <= 1}
                  >
                    <Minus size={15} />
                  </button>
                  <span className="w-5 text-center text-sm font-black">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="grid h-8 w-8 place-items-center rounded-xl bg-white text-slate-700 shadow-xs transition hover:bg-slate-100"
                    disabled={quantity >= product.stockQuantity}
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={isOutOfStock}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <ShoppingBag size={18} />
                {currentCartQuantity > 0
                  ? `Add ${quantity} More to Cart`
                  : `Add to Cart · Rs. ${totalPrice.toLocaleString('en-NP')}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
