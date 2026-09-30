'use client';

import { useEffect, useState } from 'react';
import { Activity, Bike, Box, ShoppingBag, Store, Users, Wallet } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { MetricCard } from '@/components/MetricCard';
import { OrderTable } from '@/components/OrderTable';
import { getCatalogProducts, getCustomerOrders } from '@/lib/catalog-store';

export default function Admin() {
  const [orderCount, setOrderCount] = useState(0);
  const [salesTotal, setSalesTotal] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [onDeliveryCount, setOnDeliveryCount] = useState(0);

  useEffect(() => {
    function refreshStats() {
      const orders = getCustomerOrders();
      const products = getCatalogProducts();
      setOrderCount(orders.length);
      const total = orders
        .filter(o => o.status !== 'CANCELLED')
        .reduce((sum, o) => sum + o.total, 0);
      setSalesTotal(total);
      setProductCount(products.length);
      setOnDeliveryCount(
        orders.filter(o => ['PREPARING', 'OUT_FOR_DELIVERY'].includes(o.status)).length
      );
    }

    refreshStats();
    window.addEventListener('drinkdrop_storage_update', refreshStats);
    return () => window.removeEventListener('drinkdrop_storage_update', refreshStats);
  }, []);

  return (
    <AppShell title="Admin Dashboard" subtitle="Business intelligence and central system control">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard label="Today's Orders" value={orderCount} icon={<ShoppingBag size={18} />} />
        <MetricCard
          label="Today's Sales"
          value={`Rs. ${salesTotal.toLocaleString('en-NP')}`}
          icon={<Wallet size={18} />}
        />
        <MetricCard label="Catalog Drinks" value={productCount} icon={<Box size={18} />} />
        <MetricCard label="Active Dealers" value="4" icon={<Store size={18} />} />
        <MetricCard label="Active Riders" value="6" icon={<Bike size={18} />} />
        <MetricCard label="On Delivery" value={onDeliveryCount} icon={<Activity size={18} />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Recent Customer Orders</h2>
          </div>
          <OrderTable />
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-bold text-slate-800">Live Riders in Butwal</h2>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-slate-800">Bikash Thapa</span>
                </div>
                <span className="text-slate-500">Traffic Chowk · Online</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-slate-800">Prakash Gurung</span>
                </div>
                <span className="text-slate-500">Kalikanagar · On Delivery</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-slate-800">Kiran Sharma</span>
                </div>
                <span className="text-slate-500">Milanchowk · Online</span>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-bold text-slate-800">Active Butwal Dealers</h2>
            <div className="mt-3 space-y-2 text-xs text-slate-600">
              <div className="rounded-xl border border-slate-100 p-2.5">
                <strong className="text-slate-800">Butwal Central Liquors</strong>
                <p className="text-[11px] text-slate-400">Ward 6, Traffic Chowk · Accepting Orders</p>
              </div>
              <div className="rounded-xl border border-slate-100 p-2.5">
                <strong className="text-slate-800">Highway Cold Store</strong>
                <p className="text-[11px] text-slate-400">Milanchowk Highway · Accepting Orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
