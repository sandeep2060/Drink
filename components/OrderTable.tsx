'use client';

import { useEffect, useState } from 'react';
import {
  Bike,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  Phone,
  Store,
  User,
} from 'lucide-react';
import { Order, OrderStatus, getCustomerOrders, updateOrderStatus } from '@/lib/catalog-store';
import { StatusBadge } from './StatusBadge';

export function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
    window.addEventListener('drinkdrop_storage_update', loadOrders);
    return () => window.removeEventListener('drinkdrop_storage_update', loadOrders);
  }, []);

  function loadOrders() {
    setOrders(getCustomerOrders());
  }

  function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    updateOrderStatus(orderId, newStatus);
    loadOrders();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  }

  if (orders.length === 0) {
    return (
      <div className="card p-8 text-center text-sm text-slate-500">
        <Package size={28} className="mx-auto mb-2 text-slate-300" />
        <div className="font-semibold text-slate-700">No customer orders yet</div>
        <p className="mt-1 text-xs text-slate-400">
          When customers place drink orders from the customer storefront, they will appear here in real-time.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Order #</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Delivery Zone</th>
                <th className="px-4 py-3">Drinks</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Update Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/70 transition">
                  {/* Order Number */}
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="font-bold text-blue-600 hover:underline"
                    >
                      #{order.orderNumber}
                    </button>
                    <div className="text-[10px] text-slate-400">
                      {new Date(order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900">{order.customerName}</div>
                    <div className="text-[11px] text-slate-400">{order.customerPhone}</div>
                  </td>

                  {/* Zone */}
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800">{order.address.label}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[140px]" title={order.address.zone}>
                      {order.address.zone}
                    </div>
                  </td>

                  {/* Items */}
                  <td className="px-4 py-3">
                    <div className="max-w-[200px] truncate text-slate-800 font-medium">
                      {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                    <div className="text-[10px] text-slate-400">{order.items.length} unique items</div>
                  </td>

                  {/* Total */}
                  <td className="px-4 py-3">
                    <div className="font-black text-slate-900">Rs. {order.total.toLocaleString('en-NP')}</div>
                    <div className="text-[10px] text-slate-400">
                      {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Fonepay / QR'}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>

                  {/* Action Status Selector */}
                  <td className="px-4 py-3 text-right">
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 outline-none hover:border-slate-300"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PREPARING">Preparing Drinks</option>
                      <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Order #{selectedOrder.orderNumber}
                </h3>
                <span className="text-xs text-slate-400">
                  Placed at {new Date(selectedOrder.placedAt).toLocaleString()}
                </span>
              </div>
              <StatusBadge status={selectedOrder.status} />
            </div>

            <div className="mt-4 space-y-4 max-h-[65vh] overflow-y-auto pr-1 text-xs">
              {/* Customer */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <User size={14} className="text-blue-600" /> Customer & Delivery Details
                </div>
                <div>{selectedOrder.customerName} ({selectedOrder.customerPhone})</div>
                <div className="mt-1 text-slate-600">
                  <strong>{selectedOrder.address.label}:</strong> {selectedOrder.address.addressLine}, {selectedOrder.address.zone}
                </div>
                {selectedOrder.address.landmark && (
                  <div className="text-slate-400">Landmark: {selectedOrder.address.landmark}</div>
                )}
                {selectedOrder.notes && (
                  <div className="mt-2 text-slate-500 italic bg-white p-2 rounded border border-slate-200">
                    &ldquo;{selectedOrder.notes}&rdquo;
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="rounded-xl border border-slate-100 bg-white p-3 space-y-2">
                <div className="font-bold text-slate-800 mb-2">Itemized Drinks List</div>
                {selectedOrder.items.map(i => (
                  <div key={i.productId} className="flex justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{i.quantity}x</span> {i.name} ({i.size})
                    </div>
                    <span className="font-bold text-slate-900">
                      Rs. {i.lineTotal.toLocaleString('en-NP')}
                    </span>
                  </div>
                ))}
                <div className="border-t border-slate-100 pt-2 flex justify-between font-black text-sm">
                  <span>Grand Total</span>
                  <span>Rs. {selectedOrder.total.toLocaleString('en-NP')}</span>
                </div>
              </div>

              {/* Dispatch Controls */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                <div className="font-bold text-blue-900 mb-2">Update Operational Dispatch Status</div>
                <div className="flex gap-2 flex-wrap">
                  {(['PENDING', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'] as OrderStatus[]).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selectedOrder.id, st)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                        selectedOrder.status === st
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-slate-700 hover:bg-blue-100 border border-slate-200'
                      }`}
                    >
                      {st.replaceAll('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
