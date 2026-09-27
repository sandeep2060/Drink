'use client';
import Link from 'next/link';
import { Shield, Headset, Store, Bike, User } from 'lucide-react';
const roles = [['ADMIN','Admin','/admin',Shield],['MANAGER','Manager','/manager',Headset],['DEALER','Dealer','/dealer',Store],['RIDER','Rider','/rider',Bike],['CUSTOMER','Customer','/customer',User]] as const;
export function RoleCards(){return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{roles.map(([role,label,href,Icon])=><Link key={role} href={href} className="card p-4 transition hover:-translate-y-0.5 hover:border-blue-300"><Icon className="mb-3 text-blue-600"/><div className="font-semibold">{label}</div><div className="mt-1 text-xs text-slate-500">Open demo dashboard</div></Link>)}</div>}
