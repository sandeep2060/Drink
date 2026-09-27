'use client';
import { useEffect, useState } from 'react';
import { defaultSettings, hours } from '@/lib/demo';
export function SettingsForm(){
 const [settings,setSettings]=useState(defaultSettings);
 const [saved,setSaved]=useState(false);
 useEffect(()=>{try{const s=localStorage.getItem('drinkdrop_settings');if(s)setSettings({...defaultSettings,...JSON.parse(s)})}catch{}},[]);
 function save(){localStorage.setItem('drinkdrop_settings',JSON.stringify(settings));setSaved(true);setTimeout(()=>setSaved(false),1800)}
 const set=(k:keyof typeof settings,v:string|number)=>setSettings(s=>({...s,[k]:v}));
 return <div className="space-y-6">
  <section className="card p-5"><h2 className="font-bold">Branding & Contact</h2><p className="mt-1 text-sm text-slate-500">These values are database-backed in production; demo mode stores them locally for testing.</p><div className="mt-5 grid gap-4 md:grid-cols-2">{([['systemName','System name'],['tagline','Tagline'],['phone','Contact phone'],['email','Contact email'],['address','Business address'],['logoText','Logo text']] as const).map(([key,label])=><label key={key} className="text-sm font-medium">{label}<input className="input mt-1" value={settings[key]} onChange={e=>set(key,e.target.value)}/></label>)}</div></section>
  <section className="card p-5"><h2 className="font-bold">Business Rules</h2><div className="mt-5 grid gap-4 md:grid-cols-2">{([['deliveryFee','Default delivery fee'],['freeDeliveryThreshold','Free delivery threshold'],['commissionRate','Dealer commission %'],['minimumOrder','Minimum order']] as const).map(([key,label])=><label key={key} className="text-sm font-medium">{label}<input type="number" className="input mt-1" value={settings[key]} onChange={e=>set(key,Number(e.target.value))}/></label>)}</div></section>
  <section className="card p-5"><h2 className="font-bold">Opening Hours</h2><div className="mt-4 space-y-2">{hours.map(([day,open,close])=><div key={day} className="grid grid-cols-4 items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm"><b>{day}</b><span>Open</span><span>{open}</span><span>{close}</span></div>)}</div><p className="mt-3 text-xs text-slate-500">Timezone: Asia/Kathmandu. Add special closures/overrides in the production Supabase settings tables.</p></section>
  <div className="flex justify-end"><button className="btn-primary" onClick={save}>{saved?'Saved ✓':'Save settings'}</button></div>
 </div>;
}
