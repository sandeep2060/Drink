'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Bike, Box, ClipboardList, LayoutDashboard, Settings, Store, Users, LogOut, LifeBuoy } from 'lucide-react';

const items = [
  ['Dashboard','/admin',LayoutDashboard],['Orders','/orders',ClipboardList],['Dealers','/admin/dealers',Store],['Riders','/admin/riders',Bike],['Customers','/admin/customers',Users],['Products','/admin/products',Box],['Reports','/reports',BarChart3],['Support','/manager',LifeBuoy],['Settings','/admin/settings',Settings]
] as const;
export function Sidebar({ role='ADMIN' }: { role?: string }) {
  const path = usePathname();
  return <aside className="hidden w-64 shrink-0 bg-slate-950 text-white md:block">
    <div className="sticky top-0 flex h-screen flex-col p-4">
      <div className="mb-7 flex items-center gap-3 px-2"><div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 font-bold">DD</div><div><div className="font-bold">DrinkDrop</div><div className="text-xs text-slate-400">{role} PANEL</div></div></div>
      <nav className="space-y-1">{items.map(([label,href,Icon]) => <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${path===href ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-900'}`}><Icon size={18}/>{label}</Link>)}</nav>
      <div className="mt-auto rounded-xl bg-slate-900 p-3 text-xs text-slate-400">Operational data is provided by your connected account.</div>
    </div>
  </aside>;
}
