'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Bike,
  CheckCircle2,
  Clock3,
  MapPin,
  PackageCheck,
  Phone,
  Store,
  Truck,
  X,
} from 'lucide-react';
import { Order, OrderStatus, cancelCustomerOrder, updateOrderStatus } from '@/lib/catalog-store';

interface OrderTrackerModalProps {
  order: Order | null;
  onClose: () => void;
  onOrderUpdated: () => void;
}

export function OrderTrackerModal({
  order,
  onClose,
  onOrderUpdated,
}: OrderTrackerModalProps) {
  const [cancelling, setCancelling] = useState(false);
  const [simulationState, setSimulationState] = useState<string | null>(null);

  if (!order) return null;

  const isCancelled = order.status === 'CANCELLED';
  const isDelivered = order.status === 'DELIVERED';

  // Step calculations
  const steps: { label: string; sub: string; done: boolean; active: boolean }[] = [
    {
      label: 'Order Placed',
      sub: 'Received at Butwal Central',
      done: true,
      active: order.status === 'PENDING' || order.status === 'SEARCHING_DEALER',
    },
    {
      label: 'Store Preparing',
      sub: 'Chilling & packing drinks',
      done: ['PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status),
      active: ['DEALER_ASSIGNED', 'PREPARING', 'READY_FOR_PICKUP'].includes(order.status),
    },
    {
      label: 'Out for Delivery',
      sub: 'Rider on the road in Butwal',
      done: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status),
      active: order.status === 'OUT_FOR_DELIVERY',
    },
    {
      label: 'Delivered',
      sub: 'Enjoy responsibly',
      done: order.status === 'DELIVERED',
      active: false,
    },
  ];

  function handleCancel() {
    if (!order) return;
    if (confirm('Are you sure you want to cancel this order?')) {
      setCancelling(true);
      cancelCustomerOrder(order.id);
      onOrderUpdated();
      setCancelling(false);
    }
  }

  // Demo tool: advance stage to showcase live tracking
  function advanceStage() {
    if (!order) return;
    let nextStatus: OrderStatus = 'PREPARING';
    if (order.status === 'PENDING' || order.status === 'SEARCHING_DEALER') nextStatus = 'PREPARING';
    else if (order.status === 'PREPARING') nextStatus = 'OUT_FOR_DELIVERY';
    else if (order.status === 'OUT_FOR_DELIVERY') nextStatus = 'DELIVERED';
    updateOrderStatus(order.id, nextStatus);
    onOrderUpdated();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative z-10 my-8 w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 text-white shadow-sm">
              <Truck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900">Order #{order.orderNumber}</h3>
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
              <p className="text-xs text-slate-500">
                Placed on {new Date(order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-200 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
          {/* Status Stepper */}
          {!isCancelled ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Clock3 size={15} className="text-blue-600" />
                  {isDelivered
                    ? 'Delivered to your location'
                    : `Estimated arrival: ~${order.estimatedDeliveryMinutes} mins`}
                </span>
                {!isDelivered && (
                  <button
                    type="button"
                    onClick={advanceStage}
                    className="text-[11px] font-semibold text-blue-600 hover:underline"
                    title="Advance to next stage in demo mode"
                  >
                    Simulate Next Stage →
                  </button>
                )}
              </div>

              {/* Steps timeline */}
              <div className="grid grid-cols-4 gap-2 text-center">
                {steps.map((step, idx) => (
                  <div key={step.label} className="flex flex-col items-center">
                    <div
                      className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold transition ${
                        step.done
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : step.active
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {step.done ? <CheckCircle2 size={16} /> : idx + 1}
                    </div>
                    <div className="mt-2 text-[11px] font-bold text-slate-800 leading-tight">
                      {step.label}
                    </div>
                    <div className="mt-0.5 text-[9px] text-slate-400 leading-tight hidden sm:block">
                      {step.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-xs text-red-800 border border-red-200">
              <AlertCircle size={20} className="text-red-600 shrink-0" />
              <div>
                <strong className="block text-sm">Order Cancelled</strong>
                This order was cancelled. No charges have been deducted.
              </div>
            </div>
          )}

          {/* Rider & Store Info */}
          {!isCancelled && (
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Rider */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-100 text-blue-700">
                      <Bike size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{order.riderName || 'Rider Assigning'}</div>
                      <div className="text-[10px] text-slate-400">Assigned Delivery Rider</div>
                    </div>
                  </div>
                  {order.riderPhone && (
                    <a
                      href={`tel:${order.riderPhone}`}
                      className="flex items-center gap-1 rounded-xl bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100"
                    >
                      <Phone size={12} /> Call
                    </a>
                  )}
                </div>
              </div>

              {/* Store */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-amber-100 text-amber-700">
                    <Store size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-xs font-bold text-slate-800">{order.dealerName}</div>
                    <div className="text-[10px] text-slate-400">Chilled & Dispatched From</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Location Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              <MapPin size={14} className="text-blue-600" /> Destination
            </h4>
            <div className="text-xs">
              <div className="font-bold text-slate-900">{order.customerName} ({order.customerPhone})</div>
              <p className="mt-1 text-slate-600">
                <strong>{order.address.label}:</strong> {order.address.addressLine}, {order.address.zone}
              </p>
              {order.address.landmark && (
                <p className="mt-0.5 text-slate-400">Landmark: {order.address.landmark}</p>
              )}
              {order.notes && (
                <p className="mt-2 rounded-lg bg-slate-50 p-2 text-[11px] text-slate-500 italic">
                  Note: &ldquo;{order.notes}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Items Receipt */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              <PackageCheck size={14} className="text-blue-600" /> Receipt & Order Items
            </h4>
            <div className="space-y-2 divide-y divide-slate-100 text-xs">
              {order.items.map(item => (
                <div key={item.productId} className="flex justify-between pt-2 first:pt-0">
                  <div>
                    <span className="font-bold text-slate-800">{item.name}</span>
                    <span className="ml-1 text-slate-400">({item.size}) x {item.quantity}</span>
                  </div>
                  <span className="font-bold text-slate-900">
                    Rs. {item.lineTotal.toLocaleString('en-NP')}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-slate-200 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Payment Method</span>
                <span className="font-bold text-slate-700">
                  {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Fonepay / QR'}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery Fee</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : `Rs. ${order.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-100">
                <span>Total Amount</span>
                <span>Rs. {order.total.toLocaleString('en-NP')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 p-4">
          {!isCancelled && !isDelivered && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              className="rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition"
            >
              Cancel Order
            </button>
          )}
          <div className="ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
