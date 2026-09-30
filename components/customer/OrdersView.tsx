'use client';

import { useState } from 'react';
import {
  ArrowRight,
  Clock3,
  MapPin,
  Package,
  RotateCcw,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { Order, OrderItem } from '@/lib/catalog-store';

interface OrdersViewProps {
  orders: Order[];
  onTrackOrder: (order: Order) => void;
  onReorder: (items: OrderItem[]) => void;
  onStartShopping: () => void;
}

export function OrdersView({
  orders,
  onTrackOrder,
  onReorder,
  onStartShopping,
}: OrdersViewProps) {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'DELIVERED'>('ALL');

  const filteredOrders = orders.filter(order => {
    if (filter === 'ACTIVE') {
      return !['DELIVERED', 'CANCELLED'].includes(order.status);
    }
    if (filter === 'DELIVERED') {
      return order.status === 'DELIVERED';
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl">My Orders & Tracking</h2>
          <p className="text-xs text-slate-500">Track current deliveries and view your order history</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white p-1 text-xs font-semibold shadow-2xs">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`rounded-xl px-3 py-1.5 transition ${
              filter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('ACTIVE')}
            className={`rounded-xl px-3 py-1.5 transition ${
              filter === 'ACTIVE'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Active ({orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status)).length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('DELIVERED')}
            className={`rounded-xl px-3 py-1.5 transition ${
              filter === 'DELIVERED'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Delivered ({orders.filter(o => o.status === 'DELIVERED').length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-600 mb-3">
            <Package size={32} strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No orders found</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500">
            {filter === 'ACTIVE'
              ? 'You do not have any active drink deliveries currently on the road.'
              : 'You have not placed any orders yet. Check out the latest drinks catalog!'}
          </p>
          <button
            type="button"
            onClick={onStartShopping}
            className="mt-5 flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
          >
            <ShoppingBag size={15} /> Browse Drinks Catalog
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredOrders.map(order => {
            const isActive = !['DELIVERED', 'CANCELLED'].includes(order.status);
            const isDelivered = order.status === 'DELIVERED';
            const isCancelled = order.status === 'CANCELLED';

            return (
              <div
                key={order.id}
                className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">
                          #{order.orderNumber}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            isDelivered
                              ? 'bg-emerald-100 text-emerald-800'
                              : isCancelled
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800 animate-pulse'
                          }`}
                        >
                          {order.status.replaceAll('_', ' ')}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Clock3 size={13} />
                        {new Date(order.placedAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-slate-900">
                        Rs. {order.total.toLocaleString('en-NP')}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Fonepay / QR'}
                      </div>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="my-3 space-y-1.5 text-xs">
                    {order.items.slice(0, 3).map(item => (
                      <div key={item.productId} className="flex justify-between text-slate-700">
                        <span className="truncate pr-2">
                          <strong className="text-slate-900">{item.quantity}x</strong> {item.name} ({item.size})
                        </span>
                        <span className="shrink-0 font-medium text-slate-500">
                          Rs. {item.lineTotal.toLocaleString('en-NP')}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="text-[11px] font-semibold text-blue-600">
                        +{order.items.length - 3} more drinks in this order
                      </div>
                    )}
                  </div>

                  {/* Destination */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 rounded-xl p-2.5 mt-2">
                    <MapPin size={13} className="text-blue-600 shrink-0" />
                    <span className="truncate">
                      <strong>{order.address.label}:</strong> {order.address.addressLine}, {order.address.zone}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => onReorder(order.items)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition"
                  >
                    <RotateCcw size={13} /> Order Again
                  </button>

                  <button
                    type="button"
                    onClick={() => onTrackOrder(order)}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                      isActive
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                        : 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Truck size={14} /> Track Live
                      </>
                    ) : (
                      <>
                        View Receipt <ArrowRight size={13} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
