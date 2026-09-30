'use client';

import Image from 'next/image';
import {
  Beer,
  Check,
  CupSoda,
  Droplets,
  Flame,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Wine,
} from 'lucide-react';
import { Product } from '@/lib/catalog-store';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onOpenDetails: (product: Product) => void;
}

export function ProductCard({
  product,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  onOpenDetails,
}: ProductCardProps) {
  const isOutOfStock = product.stockQuantity <= 0 || !product.active;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
      {/* Top Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
        {product.chilled && (
          <span className="flex items-center gap-1 rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-bold text-cyan-700 ring-1 ring-cyan-200">
            <Droplets size={11} className="fill-cyan-500 text-cyan-500" /> Chilled
          </span>
        )}
        {product.popular && (
          <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-200">
            <Flame size={11} className="text-amber-500" /> Hot Pick
          </span>
        )}
        {product.alcoholic ? (
          <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
            18+
          </span>
        ) : (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
            Soft
          </span>
        )}
      </div>

      {/* Image Area */}
      <div
        onClick={() => onOpenDetails(product)}
        className="relative mb-3 flex h-44 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-slate-50 transition-colors group-hover:bg-slate-100/70"
      >
        {product.imageUrl ? (
          <div className="relative h-full w-full p-2 transition-transform duration-300 group-hover:scale-105">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-300 transition-transform duration-300 group-hover:scale-110">
            {product.category === 'Beer & Craft' ? (
              <Beer size={54} strokeWidth={1.2} />
            ) : product.category === 'Whiskey & Spirits' || product.category === 'Wine' ? (
              <Wine size={54} strokeWidth={1.2} />
            ) : (
              <CupSoda size={54} strokeWidth={1.2} />
            )}
            <span className="mt-1 text-[11px] font-medium text-slate-400">{product.brand}</span>
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px]">
            <span className="rounded-lg bg-red-600 px-3 py-1 text-xs font-bold text-white shadow">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="font-semibold text-blue-700">{product.brand}</span>
          <span>{product.size}</span>
        </div>

        <h3
          onClick={() => onOpenDetails(product)}
          className="mt-1 line-clamp-1 cursor-pointer font-bold text-slate-900 transition-colors hover:text-blue-600"
          title={product.name}
        >
          {product.name}
        </h3>

        <p className="mt-1 line-clamp-2 text-xs text-slate-500">{product.description}</p>

        {product.abv ? (
          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-600">
            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-700">
              {product.abv}% ABV
            </span>
            <span className="truncate text-slate-400">· {product.dealerName?.split('(')[0] || 'Local Dealer'}</span>
          </div>
        ) : (
          <div className="mt-1.5 text-[11px] text-slate-400">
            {product.dealerName?.split('(')[0] || 'Available in Butwal'}
          </div>
        )}
      </div>

      {/* Pricing & Add To Cart Button */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <div>
          <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Price</div>
          <div className="text-base font-black text-slate-900">
            Rs. {product.price.toLocaleString('en-NP')}
          </div>
        </div>

        <div>
          {isOutOfStock ? (
            <button
              disabled
              className="cursor-not-allowed rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-400"
            >
              Unavailable
            </button>
          ) : quantityInCart > 0 ? (
            <div className="flex items-center gap-2 rounded-xl bg-blue-600 p-1 text-white shadow-sm">
              <button
                type="button"
                onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
                className="grid h-7 w-7 place-items-center rounded-lg hover:bg-blue-700 active:scale-95 transition"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-4 text-center text-xs font-black">{quantityInCart}</span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(product.id, quantityInCart + 1)}
                className="grid h-7 w-7 place-items-center rounded-lg hover:bg-blue-700 active:scale-95 transition"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="flex items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-600 hover:text-white active:scale-95"
            >
              <Plus size={14} strokeWidth={2.5} />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
