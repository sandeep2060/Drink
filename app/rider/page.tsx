'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import {
  AlertCircle,
  Bike,
  CheckCircle2,
  Clock,
  DollarSign,
  MapPin,
  Navigation,
  Package,
  Phone,
  Power,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { getCustomerOrders, Order, OrderStatus, updateOrderStatus } from '@/lib/catalog-store';

export default function RiderDashboard() {
  const [shiftStatus, setShiftStatus] = useState<'ON_SHIFT' | 'OFF_SHIFT' | 'PAUSED'>('ON_SHIFT');
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'assigned' | 'history'>('assigned');
  const [riderInfo, setRiderInfo] = useState({
    name: 'Bikash Thapa',
    phone: '+977 9812345678',
    area: 'Traffic Chowk & Central Butwal',
    vehicle: 'Lu 2 Pa 4567 (Motorcycle)',
    todaysEarnings: 1250,
    completedToday: 8,
  });

  const refreshDeliveries = () => {
    const allOrders = getCustomerOrders();
    // Filter orders relevant for rider delivery view
    setOrders(allOrders);
  };

  useEffect(() => {
    refreshDeliveries();
    if (typeof window !== 'undefined') {
      const email = window.localStorage.getItem('drinkdrop_user_email');
      if (email) {
        const namePart = email.split('@')[0].replace('.', ' ');
        const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        setRiderInfo(prev => ({ ...prev, name: capitalized }));
      }
    }
  }, []);

  const handleStatusChange = (orderId: string, nextStatus: OrderStatus) => {
    updateOrderStatus(orderId, nextStatus);
    refreshDeliveries();
  };

  const assignedOrders = orders.filter(o =>
    ['READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'SEARCHING_DEALER', 'DEALER_ASSIGNED', 'PREPARING'].includes(o.status)
  );

  const completedOrders = orders.filter(o => o.status === 'DELIVERED');

  return (
    <AppShell role="RIDER" title="Rider Delivery Workspace" subtitle="Live dispatch, delivery route tracking & cash collection">
      {/* SHIFT STATUS & KPI CARDS */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Duty Status Switch Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Work Shift Status</span>
            <span className={`h-2 w-2 rounded-full ${shiftStatus === 'ON_SHIFT' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
          </div>

          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-900 text-sm">
              {shiftStatus === 'ON_SHIFT' ? 'ON DUTY (AVAILABLE)' : shiftStatus === 'PAUSED' ? 'ON BREAK' : 'OFF DUTY'}
            </span>

            <button
              onClick={() => setShiftStatus(prev => (prev === 'ON_SHIFT' ? 'OFF_SHIFT' : 'ON_SHIFT'))}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-white shadow-xs transition ${
                shiftStatus === 'ON_SHIFT' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-700 hover:bg-slate-800'
              }`}
            >
              <Power size={13} />
              <span>{shiftStatus === 'ON_SHIFT' ? 'Go Off Shift' : 'Start Shift'}</span>
            </button>
          </div>
        </div>

        {/* Deliveries Completed Today */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Completed Today</span>
            <Package size={16} className="text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {completedOrders.length > 0 ? completedOrders.length : riderInfo.completedToday} <span className="text-xs font-medium text-slate-500">trips</span>
          </div>
        </div>

        {/* Today's Cash & Payout Earnings */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Today&apos;s Earnings</span>
            <TrendingUp size={16} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">
            Rs. {(completedOrders.length * 150 + riderInfo.todaysEarnings).toLocaleString('en-NP')}
          </div>
        </div>

        {/* Rider Profile Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
            <UserCheck size={14} className="text-blue-600" />
            <span>{riderInfo.name}</span>
          </div>
          <div className="text-[11px] text-slate-500 truncate">{riderInfo.area}</div>
          <div className="text-[11px] font-mono text-slate-700 font-semibold mt-0.5">{riderInfo.vehicle}</div>
        </div>
      </div>

      {/* DELIVERIES NAVIGATION TABS & REFRESH */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('assigned')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'assigned'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Bike size={15} />
            <span>Assigned Deliveries ({assignedOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 size={15} />
            <span>Completed Trips</span>
          </button>
        </div>

        <button
          onClick={refreshDeliveries}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw size={14} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* ASSIGNED DELIVERIES TAB */}
      {activeTab === 'assigned' && (
        <div className="space-y-4">
          {assignedOrders.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
              <Bike className="mx-auto text-slate-300 mb-3" size={44} />
              <h3 className="font-bold text-slate-900 text-base">No Active Deliveries Assigned</h3>
              <p className="mt-1 text-xs text-slate-500">
                You are currently on duty in {riderInfo.area}. New orders dispatched from nearby depots will pop up here.
              </p>
            </div>
          ) : (
            assignedOrders.map(order => (
              <div
                key={order.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-300"
              >
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-base">{order.orderNumber}</span>
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-extrabold text-blue-700">
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">Depot: {order.dealerName}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-slate-900">
                      Rs. {order.total.toLocaleString('en-NP')}
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Collect {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Fonepay QR'}
                    </span>
                  </div>
                </div>

                {/* Customer Details & Address */}
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                    <div className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <MapPin size={14} className="text-blue-600" /> Customer & Delivery Address
                    </div>
                    <div className="font-bold text-slate-900 text-xs">{order.customerName}</div>
                    <div className="text-xs text-slate-600">{order.address?.addressLine}</div>
                    <div className="text-[11px] text-slate-500 font-semibold">{order.address?.zone}</div>

                    <a
                      href={`tel:${order.customerPhone}`}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1 text-[11px] font-bold text-white shadow-xs"
                    >
                      <Phone size={12} />
                      <span>Call Customer ({order.customerPhone})</span>
                    </a>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                    <div className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Package size={14} className="text-blue-600" /> Order Items ({order.items.length})
                    </div>
                    <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-slate-800 font-medium">
                            {item.quantity}x {item.name} ({item.size})
                          </span>
                          <span className="font-semibold text-slate-900">Rs. {item.lineTotal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Rider Action Workflow Controls */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <Navigation size={14} className="text-blue-600" />
                    <span>Est. Distance: ~2.4 km</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status !== 'OUT_FOR_DELIVERY' && order.status !== 'DELIVERED' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'OUT_FOR_DELIVERY')}
                        className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-600"
                      >
                        <Bike size={14} />
                        <span>Picked Up & Start Delivery</span>
                      </button>
                    )}

                    {order.status === 'OUT_FOR_DELIVERY' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'DELIVERED')}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
                      >
                        <CheckCircle2 size={14} />
                        <span>Mark Order as Delivered & Collected</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* COMPLETED TRIPS TAB */}
      {activeTab === 'history' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Completed Deliveries</h3>
          {completedOrders.length === 0 ? (
            <p className="text-xs text-slate-500">No completed orders recorded today.</p>
          ) : (
            <div className="space-y-3">
              {completedOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200/80 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{order.orderNumber} - {order.customerName}</div>
                    <div className="text-slate-500 text-[11px]">{order.address?.zone}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-emerald-700">Rs. {order.total}</div>
                    <span className="text-[10px] font-bold text-slate-500">DELIVERED</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}