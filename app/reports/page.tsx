'use client';
import { AppShell } from '@/components/AppShell';
import { MetricCard } from '@/components/MetricCard';
import { ShoppingBag, Wallet } from 'lucide-react';
export default function Reports(){return <AppShell title="Reports & Analytics" subtitle="Filterable business reports"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><MetricCard label="Gross sales" value="Rs. 0" icon={<Wallet size={18}/>} /><MetricCard label="Orders" value="0" icon={<ShoppingBag size={18}/>} /><MetricCard label="Delivery fees" value="Rs. 0"/><MetricCard label="Commission" value="Rs. 0"/></div><div className="card mt-6 p-6 text-sm text-slate-500">Reports will appear when your account has order data.</div></AppShell>}
